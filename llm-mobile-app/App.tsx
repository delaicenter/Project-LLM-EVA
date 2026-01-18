import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import AppRoutes from './app/navigation/routes';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './app/services/Auth/AuthContext'; 
import { useAuth } from './app/services/Auth/useAuth';
import { ChatHistoryProvider } from './app/services/Chats/ChatHistoryContext';
import { ThemeProvider, useTheme } from './app/theme/themeContext';

SplashScreen.preventAutoHideAsync();

function MainApp() {
  const [appReady, setAppReady] = useState(false);
  const { checkAuth } = useAuth();
  const { theme } = useTheme();


  useEffect(() => {
    checkAuth(); 
  }, []);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  if (!appReady) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#021526" />
      <AppRoutes />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatHistoryProvider>
          <MainApp />
        </ChatHistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021526',
  },
});
