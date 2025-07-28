import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EVA_API_URL } from '@env'

const API_BASE = EVA_API_URL;

export const loginUser = async (username: string, password: string) => {
     const response = await axios.post(`${API_BASE}/auth/login`, {
          username,
          password,
     });

     const data = response.data;

     await AsyncStorage.setItem('access_token', data.access_token);
     await AsyncStorage.setItem('user_info', JSON.stringify(data));

     return data;
};

export const getAccessToken = async (): Promise<string | null> => {
     const token = await AsyncStorage.getItem('access_token');
     return token ? `Bearer ${token}` : null;
};

export const logoutUser = async () => {
     await AsyncStorage.removeItem('access_token');
     await AsyncStorage.removeItem('user_info');
};
