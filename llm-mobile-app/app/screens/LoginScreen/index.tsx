import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/type';
import { styles } from './style';
import { loginUser } from '../../services/Auth/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage('Username dan password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const userData = await loginUser(username, password);
      console.log('Login berhasil:', userData);
      navigation.replace("Chat");
    } catch (error: any) {
      console.error('Login gagal:', error.response?.data || error.message);
      const detail = error.response?.data?.detail || "Login gagal, periksa username dan password.";
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login pressed');
  };

  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.container, { paddingVertical: height * 0.1 }]}>
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>


        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity onPress={goToSignUp}>
          <Text style={styles.signupText}>
            Don’t have an account? <Text style={styles.signupLink}>Sign up here</Text>
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.googleIconButton} onPress={handleGoogleLogin}>
          <Image
            source={require('../../../assets/google.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
