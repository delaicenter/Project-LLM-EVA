import axios from 'axios';
import { getAccessToken } from '../Auth/auth.service';

const API_BASE = 'https://eva.del.ac.id/api/proxy/api';

const getAuthHeader = async () => {
  const token = await getAccessToken();
  if (!token) throw new Error('No access token found');
  return { Authorization: `Bearer ${token}` };
};

export const startChat = async (message: string, conversationId?: string) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(`${API_BASE}/chat/`, {
      message,
      conversation_id: conversationId
    }, {
      headers: {
        ...headers,
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
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(`${API_BASE}/chat/initiate`, {}, {
      headers: {
        ...headers,
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
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_BASE}/chat/conversations`, {
      headers
    });

    return response.data;
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
};

export const getChatHistory = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_BASE}/chat/conversations`, {
      headers: {
        ...headers,
        Accept: 'application/json'
      }
    });

    const list = Array.isArray(response.data)
      ? response.data
      : response.data.data || [];

    return list.map((conv: any) => ({
      id: conv.id,
      title: conv.headline || `Percakapan ${new Date(conv.created_at).toLocaleDateString()}`,
      createdAt: conv.created_at,
      lastUpdated: conv.updated_at
    }));
  } catch (error: any) {
    console.error('Error getting chat history:', error.response?.data || error.message);
    throw error;
  }
};

export const getPreviousMessages = async (conversationId: string) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_BASE}/chat/conversations/${conversationId}`, {
      headers
    });
    return response.data?.messages || [];
  } catch (error) {
    console.error('Error getting previous messages:', error);
    throw error;
  }
};
