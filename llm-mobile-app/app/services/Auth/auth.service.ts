import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://eva.del.ac.id/api/proxy/api';

class AuthService {
  static token: string | null = null;

  static async loginUser(username: string, password: string) {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      AuthService.token = data.access_token;
      await AsyncStorage.setItem('access_token', data.access_token);
      await AsyncStorage.setItem('user_info', JSON.stringify(data));

      return data;
    } catch (error: any) {
      console.error('LOGIN ERROR:', error.response?.data || error.message);
      throw error;
    }
  }

  static async getToken(): Promise<string | null> {
    if (AuthService.token) {
      return AuthService.token;
    }

    const storedToken = await AsyncStorage.getItem('access_token');
    AuthService.token = storedToken;
    return storedToken;
  }
}

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
  } catch (error:any) {
    console.error('SIGNUP ERROR:', error.response?.data || error.message);
    throw error;
  }
};


// auth.service.ts
export const getAccessToken = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return token;  
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

export default AuthService;