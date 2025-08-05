import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import AppRoutes from './app/navigation/routes';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './app/services/Auth/AuthContext'; // Pastikan path sesuai
import { useAuth } from './app/services/Auth/useAuth';

SplashScreen.preventAutoHideAsync();

function MainApp() {
  const [appReady, setAppReady] = useState(false);
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth(); // Mengecek status login
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
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021526',
  },
});
