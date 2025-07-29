import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, useWindowDimensions, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/type';
import { styles } from './style';
import { loginUser } from '../../services/auth';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        alert('Please enter username and password');
        return;
      }

      setLoading(true);

      const data = await loginUser(username, password);
      console.log('Login success:', data);

      // Navigate ke Home dan kirim data JSON
    navigation.navigate('Home', { userData: data });

    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof Error) {
        alert('Login failed: ' + error.message);
      } else {
        alert('Login failed: Unknown error');
      }
    } finally {
      setLoading(false);
    }
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
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
