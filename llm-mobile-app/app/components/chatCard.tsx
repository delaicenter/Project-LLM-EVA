import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import RecordingModal from './recordModal';

type MessageInputCardProps = {
  onSend: (message: string) => void;
};

const MessageInputCard = ({ onSend }: MessageInputCardProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState('Mendengarkan...');
  const slideAnim = useState(new Animated.Value(0))[0];

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingText('Mendengarkan...');

    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => setRecordingText('Sedang merekam...'), 1000);
    setTimeout(() => setRecordingText('Masih mendengarkan...'), 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.wrapper}>
      <RecordingModal
        visible={isRecording}
        slideAnim={slideAnim}
        recordingText={recordingText}
        onStop={stopRecording}
      />

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ketik pesan..."
            value={message}
            onChangeText={setMessage}
            multiline
            editable
          />
          <View style={styles.iconContainer}>
            {message ? (
              <TouchableOpacity onPress={handleSend} style={styles.iconButton}>
                <Icon name="send" size={24} color="#007AFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                style={styles.iconButton}
              >
                <Icon
                  name={isRecording ? 'mic-off' : 'mic'}
                  size={24}
                  color={isRecording ? '#FF3B30' : '#007AFF'}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  container: {
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 60,
    
  },

  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 10,
  },
  iconButton: {
    padding: 8,
  },
});

export default MessageInputCard;
