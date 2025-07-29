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
  Platform
} from 'react-native';
import { styles } from './style';
import { signupUser } from '../../services/Auth/auth.service';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../../components/customAlert';

const SignUpScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const handleSignUp = async () => {
    // Validasi: jika ada field kosong
    if (!username.trim() || !email.trim() || !fullName.trim() || !password.trim()) {
      setAlertTitle('❌ Error');
      setAlertMessage('Semua field wajib diisi.');
      setAlertType('error');
      setAlertVisible(true);
      return;
    }

    try {
      const data = await signupUser(username, email, fullName, password);
      console.log('Signup berhasil:', data);

      setAlertTitle('✅ Berhasil!');
      setAlertMessage('Akun kamu sudah terdaftar. Silakan login.');
      setAlertType('success');
      setAlertVisible(true);
    } catch (error: any) {
      console.error('Signup gagal:', error);

      let msg = 'Terjadi kesalahan, coba lagi.';
      if (error.response?.data?.message) {
        msg = String(error.response.data.message).trim();
      } else if (error.message) {
        msg = String(error.message).trim();
      }

      setAlertTitle('❌ Error');
      setAlertMessage(msg);
      setAlertType('error');
      setAlertVisible(true);
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
          <Text style={[styles.title, { fontSize: width * 0.08 }]}>Sign Up</Text>

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
            placeholder="Email"
            placeholderTextColor="#888"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            onChangeText={setFullName}
            value={fullName}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => {
          setAlertVisible(false);
          if (alertType === 'success') {
            navigation.navigate('Login' as never);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default SignUpScreen;
