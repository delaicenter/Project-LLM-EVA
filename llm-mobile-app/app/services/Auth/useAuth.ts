import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

type AuthState = {
  isLoggedIn: boolean | null;
  isLoading: boolean;
  user: any;
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: null,
    isLoading: true,
    user: null
  });

  const checkAuth = async () => {
    try {
      const [token, userInfo] = await Promise.all([
        AsyncStorage.getItem('access_token'),
        AsyncStorage.getItem('user_info')
      ]);
      
      setAuthState({
        isLoggedIn: !!token,
        isLoading: false,
        user: userInfo ? JSON.parse(userInfo) : null
      });
    } catch (error) {
      setAuthState({
        isLoggedIn: false,
        isLoading: false,
        user: null
      });
    }
  };

  const triggerAuthCheck = () => {
    checkAuth();
  };

  useEffect(() => {
    checkAuth();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkAuth();
      }
    });

    return () => subscription.remove();
  }, []);

  return {
    ...authState,  
    triggerAuthCheck,
    checkAuth
  };
};