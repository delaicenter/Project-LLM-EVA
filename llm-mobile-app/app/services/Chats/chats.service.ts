import axios from 'axios';
import { getAccessToken } from '../Auth/auth.service';

const API_BASE = 'http://eva.del.ac.id:33332/api/proxy/api';

export const startChat = async (message: string, conversationId?: string) => {
  const token = await getAccessToken();

  try {
    const response = await axios.post(`${API_BASE}/chat/`, {
      message,
      conversation_id: conversationId
    }, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    return {
      reply: response.data.response,
      conversationId: response.data.conversation_id,
      usedRag: response.data.used_rag
    };
  } catch (error) {
    console.error('Error in startChat:', error);
    throw error;
  }
};

export const initiateConversation = async () => {
  const token = await getAccessToken();

  try {
    const response = await axios.post(`${API_BASE}/chat/initiate`, {}, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    return response.data.conversation_id;
  } catch (error) {
    console.error('Error initiating conversation:', error);
    throw error;
  }
};

export const getConversations = async () => {
  const token = await getAccessToken();

  try {
    const response = await axios.get(`${API_BASE}/chat/conversations`, {
      headers: {
        'Authorization': token
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
};

export const getChatHistory = async () => {
  const token = await getAccessToken();

  try {
    const response = await axios.get(`${API_BASE}/chat/conversations`, {
      headers: {
        'Authorization': token
      }
    });

    return response.data.map((conv: any) => ({
      id: conv.id,
      title: conv.headline || `Percakapan ${new Date(conv.created_at).toLocaleDateString()}`,
      createdAt: conv.created_at,
      lastUpdated: conv.updated_at
    }));
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};

export const getPreviousMessages = async (conversationId: string) => {
  const token = await getAccessToken();
  
  try {
    const response = await axios.get(`${API_BASE}/chat/conversations/${conversationId}`, {
      headers: {
        'Authorization': token
      }
    });
    // Pastikan response.data dan response.data.messages ada
    return response.data?.messages || [];
  } catch (error) {
    console.error('Error getting previous messages:', error);
    throw error;
  }
};