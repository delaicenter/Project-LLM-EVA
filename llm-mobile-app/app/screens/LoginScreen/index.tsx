import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/type';
import { styles } from './style';
import { loginUser } from '../../services/Auth/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../services/Auth/useAuth';
import { fetchAndCacheChatHistory } from '../../services/Chats/chatHistoryStore';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { triggerAuthCheck } = useAuth();

const handleLogin = async () => {
  setLoading(true);
  try {
    const userData = await loginUser(username, password);
    await AsyncStorage.setItem('access_token', userData.access_token);
    await AsyncStorage.setItem('user_info', JSON.stringify(userData));

    // Pastikan status login update sebelum navigate
    await triggerAuthCheck();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' }]
      })
    );
  } catch (error) {
    console.error('Login gagal:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingVertical: height * 0.1 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { fontSize: width * 0.08 }]}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            autoCapitalize="none"
            returnKeyType="next"
            onChangeText={setUsername}
            value={username}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            onChangeText={setPassword}
            value={password}
          />

          <TouchableOpacity
            style={[styles.loginButton, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </ScrollView>

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Processing login...</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
