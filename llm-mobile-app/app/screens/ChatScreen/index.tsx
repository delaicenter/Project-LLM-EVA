import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform, Keyboard, StyleSheet
} from 'react-native';
import { useAuth } from '../../services/Auth/useAuth';
import ChatBubble from '../../components/chatBubble';
import ChatLoadingBubble from '../../components/chatLoading';
import MessageInputCard from '../../components/chatCard';
import WelcomeCard from '../../components/welcomeCard';
import { ChatScreenProps } from '../../navigation/type';
import { useFocusEffect } from '@react-navigation/native';
import { chatService } from '../../services/Chats/chats.service';
import { useChatHistory } from '../../services/Chats/ChatHistoryContext';
import { useThemedStyles } from "../../theme/useThemedStyles";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  isLoading?: boolean;
  isTyping?: boolean;
};

const themedStyles = (theme: any) =>
  StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: theme.backgroundChat,
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
    backgroundColor: theme.backgroundChat,
    paddingBottom: Platform.OS === 'ios' ? 16 :8,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  });

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { conversationId: paramConversationId } = route.params || {};
  const { isLoggedIn } = useAuth();

  const [conversationId, setConversationId] = useState<string | null>(paramConversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { setChatHistory, moveChatToTop } = useChatHistory();
  const [isStopped, setIsStopped] = useState(false);
  const styles = useThemedStyles(themedStyles);
  

  const resetchat = () => {
    setMessages([]);
  }
  useFocusEffect(
    useCallback(() => {
      if (!paramConversationId) {
        resetchat();
      }
    }, [paramConversationId])
  );

  const handleStopGenerate = () => {
    setIsStopped(true);
    setMessages((prev) =>
      prev.map((m) =>
        m.isLoading || m.isTyping ? { ...m, isLoading: false, isTyping: false } : m
      )
    );
  };

  useEffect(() => {
    const initChat = async () => {
      if (!isLoggedIn) return;

      if (paramConversationId) {
        try {
          const prevMsgs = await chatService.getPreviousMessages(paramConversationId);
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

          setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 100);
        } catch (err) {
          console.error('Gagal load chat lama:', err);
        }
      } else {
        setMessages([]);
        try {
          const newId = await chatService.initiateConversation();
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
    () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 20);
    }
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
    setIsStopped(false);
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
  const res = await chatService.startChat(message, conversationId || undefined);

  const { replyData, updatedHistory } = res;

  if (replyData.conversationId && !conversationId) {
    setConversationId(replyData.conversationId);
  }

  setMessages((prev) => prev.filter((m) => m.id !== loadingMsg.id));

  const reply: Message = {
    id: Date.now().toString() + '-bot',
    text: replyData.reply || 'Tidak ada balasan.',
    isUser: false,
    isTyping: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  setMessages((prev) => [...prev.map((m) => ({ ...m, isTyping: false })), reply]);

  // setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

  setChatHistory(updatedHistory);
    if (conversationId) {
    moveChatToTop(conversationId);
  } 
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
          contentContainerStyle={{ paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
          // onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
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
                  isStopped={isStopped}
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
      <MessageInputCard 
        onSend={handleSendMessage} 
        onStop={handleStopGenerate}
        isGenerating={messages.some(m => m.isLoading || m.isTyping)} 
      />
    </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;