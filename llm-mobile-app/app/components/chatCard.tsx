import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import RecordingModal from './recordModal';

type MessageInputCardProps = {
  onSend: (message: string) => void;
  autoFocus?: boolean;
};

const MessageInputCard = ({ onSend, autoFocus }: MessageInputCardProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState('Mendengarkan...');
  const slideAnim = useState(new Animated.Value(0))[0];
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      Keyboard.dismiss();
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
    <View style={styles.container}>
      <RecordingModal
        visible={isRecording}
        slideAnim={slideAnim}
        recordingText={recordingText}
        onStop={stopRecording}
      />

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Tanyakan sesuatu..."
          placeholderTextColor="#ffffff"
          value={message}
          onChangeText={setMessage}
          multiline
          onSubmitEditing={handleSend}
        />
        <View style={styles.iconContainer}>
          {message ? (
            <TouchableOpacity onPress={handleSend} style={styles.iconButton}>
              <Icon name="send" size={24} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              style={styles.iconButton}
            >
              <Icon
                name={isRecording ? 'mic-off' : 'mic'}
                size={24}
                color={isRecording ? '#FF3B30' : '#FFFFFF'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D6BDE2A',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 10,
    fontSize: 16,
    color: 'white',
    paddingVertical: 8,
  },
  iconContainer: {
    marginLeft: 10,
  },
  iconButton: {
    padding: 8,
  },
});

export default MessageInputCard;