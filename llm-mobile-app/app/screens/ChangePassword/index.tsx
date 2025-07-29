import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { changePassword } from '../../services/Auth/auth.service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomAlert from '../../components/customAlert';

const ChangePasswordScreen: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const showAlert = (title: string, message: string, onClose?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
    // optional: handle onClose after dismiss
    if (onClose) {
      setOnCloseCallback(() => onClose);
    } else {
      setOnCloseCallback(() => () => setAlertVisible(false));
    }
  };

  const [onCloseCallback, setOnCloseCallback] = useState<() => void>(() => () => setAlertVisible(false));

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showAlert('Error', 'Semua field wajib diisi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert('Error', 'Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(newPassword, confirmPassword);
      showAlert('Success', 'Password berhasil diperbarui.', () => {
        setAlertVisible(false);
        navigation.goBack();
      });
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Terjadi kesalahan, coba lagi.';
      showAlert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingVertical: height * 0.1 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { fontSize: width * 0.07 }]}>Change Password</Text>

        <View style={[styles.inputWrapper, { marginBottom: 12 }]}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="New Password"
            placeholderTextColor="#888"
            secureTextEntry={!showNewPassword}
            onChangeText={setNewPassword}
            value={newPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <Icon name={showNewPassword ? 'visibility' : 'visibility-off'} size={22} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Confirm New Password"
            placeholderTextColor="#888"
            secureTextEntry={!showConfirmPassword}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Icon name={showConfirmPassword ? 'visibility' : 'visibility-off'} size={22} color="#666" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
            style={styles.changeButtonOutline}
            onPress={handleChangePassword}
            disabled={loading}
        >
            <Icon name="lock-reset" size={20} color="#6EACDA" style={{ marginRight: 6 }} />
            <Text style={styles.changeButtonTextOutline}>
                {loading ? 'Updating...' : 'Update Password'}
            </Text>
        </TouchableOpacity>

      </ScrollView>

        <CustomAlert
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            onClose={() => {
                setAlertVisible(false);
                onCloseCallback();
        }}
            type={alertTitle === 'Error' ? 'error' : 'success'} // kirim type sesuai kondisi
        />
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
