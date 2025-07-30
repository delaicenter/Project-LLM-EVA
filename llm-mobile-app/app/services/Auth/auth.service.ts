import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';

const API_BASE = 'http://eva.del.ac.id:33332/api/proxy/api';

export const loginUser = async (username: string, password: string) => {
  console.log('LOGIN STARTED:', { username, password }); 

  try {
    const payload = qs.stringify({ username, password });

    console.log('LOGIN PAYLOAD:', payload); 

    const response = await axios.post(`${API_BASE}/auth/token`, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = response.data;

    console.log('LOGIN SUCCESS:', data); 

    await AsyncStorage.setItem('access_token', data.access_token);
    await AsyncStorage.setItem('user_info', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('LOGIN ERROR:', error.response?.data || error.message);
    throw error;
  }
};

 
export const signupUser = async (
  username: string,
  email: string,
  fullName: string,
  password: string
) => {
  console.log('SIGNUP STARTED:', { username, email, fullName, password });

  try {
    const response = await axios.post(`${API_BASE}/auth/signup`, {
      username,
      email,
      full_name: fullName,
      password,
    });

    console.log('SIGNUP SUCCESS:', response.data);
    return response.data;
  } catch (error) {
    console.error('SIGNUP ERROR:', error.response?.data || error.message);
    throw error;
  }
};

 
export const getAccessToken = async (): Promise<string | null> => {
  const token = await AsyncStorage.getItem('access_token');
  console.log('GET ACCESS TOKEN:', token);
  return token ? `Bearer ${token}` : null;
};

 
export const logoutUser = async () => {
  console.log('LOGOUT USER');
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('user_info');
};

 
export const changePassword = async (
  newPassword: string,
  confirmPassword: string
) => {
  const token = await getAccessToken();

  console.log('CHANGE PASSWORD:', {
    newPassword,
    confirmPassword,
    token,
  });

  const response = await axios.post(
    `${API_BASE}/auth/change-password`,
    {
      new_password: newPassword,
      confirm_password: confirmPassword,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );

  console.log('CHANGE PASSWORD SUCCESS:', response.data);

  return response.data;
};
