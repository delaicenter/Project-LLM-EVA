import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, useWindowDimensions, Image } 
from 'react-native';import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/routes';
import { styles } from './style';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();

  const handleLogin = () => {
    console.log('Login pressed', { email, password });
    navigation.navigate("Home")
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
          placeholder="Email"
          placeholderTextColor="#888"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToSignUp}>
          <Text style={styles.signupText}>
            Don’t have an account? <Text style={styles.signupLink}>Sign up here</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleIconButton} onPress={handleGoogleLogin}>
          <Image 
            source={require('../../../assets/google.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
