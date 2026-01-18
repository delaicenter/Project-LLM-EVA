import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { getAccessToken } from '../Auth/auth.service';
import { EVA_API_URL } from '@env';

// const API_BASE = 'https://eva.del.ac.id/api/proxy/api';
const API_BASE = EVA_API_URL;

export interface ChatReply {
  reply: string;
  conversationId: string;
  usedRag: boolean;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: string;
  lastUpdated: string;
}

export class ChatService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE,
      headers: { 'Content-Type': 'application/json' }
    });

    this.api.interceptors.request.use(async (config) => {
      const token = await getAccessToken();
      if (!token) throw new Error('No access token found');
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  private handleError(error: unknown, context: string): never {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;
      console.error(`[ChatService] ${context} failed:`, {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    } else {
      console.error(`[ChatService] ${context} failed:`, error);
    }
    throw error;
  }

  async startChat(message: string, conversationId?: string): Promise<{ replyData: ChatReply, updatedHistory: ChatHistoryItem[] }> {
    try {
      const { data } = await this.api.post('/chat/', {
        message,
        conversation_id: conversationId
      });

      const history = await this.getChatHistory();

      return {
        replyData: {
          reply: data.response,
          conversationId: data.conversation_id,
          usedRag: data.used_rag
        },
        updatedHistory: history
      };
    } catch (error) {
      this.handleError(error, 'startChat');
    }
  }

  async initiateConversation(): Promise<string> {
    try {
      const { data } = await this.api.post('/chat/initiate');
      return data.conversation_id;
    } catch (error) {
      this.handleError(error, 'initiateConversation');
    }
  }

  async getConversations(): Promise<any[]> {
    try {
      const { data } = await this.api.get('/chat/conversations');
      return data;
    } catch (error) {
      this.handleError(error, 'getConversations');
    }
  }

  async getChatHistory(): Promise<ChatHistoryItem[]> {
    try {
      const { data } = await this.api.get('/chat/conversations');
      const list = Array.isArray(data) ? data : data.data || [];

      return list.map((conv: any) => ({
        id: conv.id,
        title: conv.headline || `Percakapan ${new Date(conv.created_at).toLocaleDateString()}`,
        createdAt: conv.created_at,
        lastUpdated: conv.updated_at
      }));
    } catch (error) {
      this.handleError(error, 'getChatHistory');
    }
  }

  async getPreviousMessages(conversationId: string): Promise<any[]> {
    try {
      const { data } = await this.api.get(`/chat/conversations/${conversationId}`);
      return data?.messages || [];
    } catch (error) {
      this.handleError(error, 'getPreviousMessages');
    }
  }

  async deleteConversation(conversationId: string): Promise<string> {
    try {
      const { data } = await this.api.delete(`/chat/conversations/${conversationId}`);
      return data.detail; 
    } catch (error) {
      this.handleError(error, 'deleteConversation');
    }
  }

}

export const chatService = new ChatService();
