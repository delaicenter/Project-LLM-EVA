import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService, { logoutUser } from './auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  full_name: string;
  email: string;
  [key: string]: any;
};

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    const data = await AuthService.loginUser(username, password);
    setUser(data);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsLoggedIn(false);
  };

  const checkAuth = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('access_token');
    const userInfo = await AsyncStorage.getItem('user_info');
    if (token && userInfo) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userInfo));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, user, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
