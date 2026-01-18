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
import { useAuth } from '../../services/Auth/AuthContext';
import { Feather } from '@expo/vector-icons'; // ✅ icon

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true); // ✅ toggle state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();
  const { login } = useAuth();

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      await login(username, password);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    } catch (error) {
      console.error('Login gagal:', error);
      setErrorMessage('Login gagal. Periksa kembali username dan password.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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

          <View style={{ position: 'relative' }}>
            <TextInput
              style={[styles.input, { paddingRight: 40 }]} // beri ruang kanan untuk icon
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={secureText}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 12, top: '20%' }}
              onPress={() => setSecureText(!secureText)}
            >
              <Feather
                name={secureText ? 'eye-off' : 'eye'} 
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

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
