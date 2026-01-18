// ✅ CustomAlert.tsx (sudah ditingkatkan untuk konfirmasi juga)
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'confirm';
  onConfirm?: () => void;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type = 'success',
  onConfirm,
  onClose,
}) => {
  const color = type === 'error' ? '#FF3B30' : type === 'confirm' ? '#007AFF' : '#28A745';

  return (
  <Modal transparent visible={visible} animationType="fade">
    <TouchableOpacity
      activeOpacity={1}
      onPress={onClose}
      style={styles.overlay}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {}} 
        style={styles.alertBox}
      >
        <Text style={[styles.alertTitle, { color }]}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>

        {type === 'confirm' ? (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ccc' }]}
              onPress={onClose}
            >
              <Text style={styles.okButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: color }]}
              onPress={onConfirm}
            >
              <Text style={styles.okButtonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: color }]}
            onPress={() => {
              onConfirm?.();
              onClose();
            }}
          >
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginHorizontal: 5,
  },
  okButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default CustomAlert;
