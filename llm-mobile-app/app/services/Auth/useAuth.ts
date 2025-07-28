import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('access_token');
      const userInfo = await AsyncStorage.getItem('user_info');
      setIsLoggedIn(!!token);
      if (userInfo) setUser(JSON.parse(userInfo));
    };

    checkAuth();
  }, []);

  return { isLoggedIn, user };

};