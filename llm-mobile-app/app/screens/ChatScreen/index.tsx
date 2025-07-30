import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform, Keyboard, StyleSheet
} from 'react-native';
import { useAuth } from '../../services/Auth/useAuth';
import ChatBubble from '../../components/chatBubble';
import ChatLoadingBubble from '../../components/chatLoading';
import MessageInputCard from '../../components/chatCard';
import WelcomeCard from '../../components/welcomeCard';
import { initiateConversation, getPreviousMessages, startChat } from '../../services/Chats/chats.service';
import { ChatScreenProps } from '../../navigation/type';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  isLoading?: boolean;
  isTyping?: boolean;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { conversationId: paramConversationId } = route.params || {};
  const { isLoggedIn } = useAuth();

  const [conversationId, setConversationId] = useState<string | null>(paramConversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const initChat = async () => {
      if (!isLoggedIn) return;

      if (paramConversationId) {
        try {
          const prevMsgs = await getPreviousMessages(paramConversationId);

          // Urutkan dari paling lama ke terbaru
          const sortedMsgs = [...prevMsgs].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          const formatted = sortedMsgs.map((msg: any) => ({
            id: msg.id?.toString() ?? Date.now().toString(),
            text: msg.content || '',
            isUser: msg.role === 'user',
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));

          setMessages(formatted);
          setConversationId(paramConversationId);

          // Scroll ke bawah setelah load
          setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 100);
        } catch (err) {
          console.error('Gagal load chat lama:', err);
        }
      } else {
        // Mode Obrolan Baru
        setMessages([]);
        try {
          const newId = await initiateConversation();
          setConversationId(newId);
        } catch (err) {
          console.error('Gagal bikin percakapan baru:', err);
        }
      }
    };

    initChat();
  }, [paramConversationId, isLoggedIn]);

  /* Keyboard listener */
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  /* Kirim pesan */
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !isLoggedIn) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);

    const loadingMsg: Message = {
      id: 'loading-' + Date.now(),
      text: '',
      isUser: false,
      timestamp: '',
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMsg]);

    // Scroll ke bawah setelah kirim
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const res = await startChat(message, conversationId || undefined);
      if (res.conversationId && !conversationId) {
        setConversationId(res.conversationId);
      }

      setMessages((prev) => prev.filter((m) => m.id !== loadingMsg.id));

      const reply: Message = {
        id: Date.now().toString() + '-bot',
        text: res.reply || 'Tidak ada balasan.',
        isUser: false,
        isTyping: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev.map((m) => ({ ...m, isTyping: false })), reply]);

      // Scroll lagi ke bawah setelah bot balas
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      console.error('Error kirim pesan:', err);
      setMessages((prev) => prev.filter((m) => m.id !== loadingMsg.id));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={
            messages.length === 0
              ? styles.emptyChatContentContainer
              : { padding: 16, paddingBottom: keyboardHeight + 20 }
          }
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <WelcomeCard
              onSelectOption={(opt) => {
                const msg = opt === 'wisata'
                  ? 'Berikan saya rekomendasi wisata di Toba'
                  : 'Berikan saya rekomendasi penginapan di Toba';
                handleSendMessage(msg);
              }}
            />
          ) : (
            messages.map((m) =>
              m.isLoading ? (
                <ChatLoadingBubble key={m.id} />
              ) : (
                <ChatBubble
                  key={m.id}
                  message={m.text}
                  isUser={m.isUser}
                  timestamp={m.timestamp}
                  isTyping={m.isTyping}
                  onTypingDone={() => {
                    setMessages((prev) =>
                      prev.map((msg) => msg.id === m.id ? { ...msg, isTyping: false } : msg)
                    );
                  }}
                />
              )
            )
          )}
        </ScrollView>

        <View style={styles.inputWrapper}>
          <MessageInputCard onSend={handleSendMessage} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021526',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatContainer: {
    flex: 1,
  },
  chatContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyChatContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#021526',
    paddingBottom: Platform.OS === 'ios' ? 16 : 65,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ChatScreen;