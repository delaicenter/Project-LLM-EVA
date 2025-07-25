import React, { createContext, useContext, useState } from 'react';

interface User {
     name: string;
     email: string;
}

interface AuthContextType {
     isLoggedIn: boolean;
     user: User | null;
     login: (userData: User) => void;
     logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [user, setUser] = useState<User | null>(null);

     const login = (userData: User) => {
          setIsLoggedIn(true);
          setUser(userData);
     };

     const logout = () => {
          setIsLoggedIn(false);
          setUser(null);
     };

     return (
          <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
               {children}
          </AuthContext.Provider>
     );
};

export const useAuth = () => {
     const context = useContext(AuthContext);
     if (!context) {
          throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
};