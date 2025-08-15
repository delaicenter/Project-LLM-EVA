import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
} from "react-native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { Audio } from "expo-av";
import RecordingModal from "./recordModal";
import { uploadAudio } from "../services/Audio/audio.service";
import { useThemedStyles } from "../theme/useThemedStyles";
import { useTheme } from "../theme/themeContext";

type MessageInputCardProps = {
  onSend: (message: string) => void;
  autoFocus?: boolean;
  onStop: () => void;
  isGenerating?: boolean;
};

const MessageInputCard = ({ onSend, onStop, autoFocus, isGenerating }: MessageInputCardProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingText, setRecordingText] = useState("Mendengarkan...");
  const slideAnim = useState(new Animated.Value(0))[0];
  const inputRef = useRef<TextInput>(null);

  const { theme } = useTheme();
  const styles = useThemedStyles((theme) => ({
    container: {
      backgroundColor: theme.inputBackground,
      borderRadius: 25,
      paddingHorizontal: 15,
      paddingVertical: 8,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 120,
      paddingHorizontal: 10,
      fontSize: 16,
      color: theme.placeholder,
      paddingVertical: 8,
    },
    iconContainer: {
      marginLeft: 10,
    },
    iconButton: {
      padding: 8,
    },
  }));

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
      setMessage("");
      Keyboard.dismiss();
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Izin microphone dibutuhkan!");
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecordingText("Mendengarkan...");

      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => setRecordingText("Sedang merekam..."), 1000);
      setTimeout(() => setRecordingText("Masih mendengarkan..."), 2000);
    } catch (err) {
      console.error("Gagal mulai merekam", err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    try {
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      if (uri) {
        const transcript = await uploadAudio(uri);
        if (transcript) {
          setMessage(transcript);
        }
      }
      setRecording(null);
    } catch (err) {
      console.error("Gagal stop recording", err);
    }
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
          placeholderTextColor={theme.icon}
          value={message}
          onChangeText={setMessage}
          multiline
          onSubmitEditing={handleSend}
        />
        <View style={styles.iconContainer}>
          {isGenerating ? (
            <TouchableOpacity onPress={onStop} style={styles.iconButton}>
              <Icon name="stop" size={24} color={theme.icon} />
            </TouchableOpacity>
          ) : message ? (
            <TouchableOpacity onPress={handleSend} style={styles.iconButton}>
              <Icon name="send" size={24} color={theme.icon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              style={styles.iconButton}
            >
              <Icon
                name={isRecording ? "mic-off" : "mic"}
                size={24}
                color={isRecording ? "#FF3B30" : theme.icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default MessageInputCard;
