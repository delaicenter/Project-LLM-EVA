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

type MessageInputCardProps = {
  onSend: (message: string) => void;
  autoFocus?: boolean;
};

const MessageInputCard = ({ onSend, autoFocus }: MessageInputCardProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingText, setRecordingText] = useState("Mendengarkan...");
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
      setMessage("");
      Keyboard.dismiss();
    }
  };

  const startRecording = async () => {
    try {
      console.log("Meminta izin microphone...");
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Izin microphone dibutuhkan!");
        return;
      }

      console.log("Menyiapkan audio...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Mulai merekam...");
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
    console.log("Stop recording...");
    setIsRecording(false);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    try {
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      console.log("File audio:", uri);

      if (uri) {
        const transcript = await uploadAudio(uri);
        if (transcript) {
          setMessage(transcript); // ✅ langsung isi ke input
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
                name={isRecording ? "mic-off" : "mic"}
                size={24}
                color={isRecording ? "#FF3B30" : "#FFFFFF"}
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
    backgroundColor: "#0D6BDE2A",
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
    color: "white",
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
