import React, { useState, useRef } from 'react';
import {
     View,
     Text,
     Button,
     KeyboardAvoidingView,
     Platform,
     SafeAreaView,
     ScrollView,
     ActivityIndicator,
     TextInput,
} from 'react-native';
import { useAuth } from '../../services/auth';
import MessageInputCard from '../../components/chatCard';
import ChatBubble from '../../components/chatBubble';
import { styles } from './styles';
import ChatLoadingBubble from '../../components/chatLoading';

type Message = {
     id: string;
     text: string;
     isUser: boolean;
     timestamp: string;
     isLoading?: boolean;
};

const HomeScreen = () => {
     const { isLoggedIn, user, login, logout } = useAuth();
     const [messages, setMessages] = useState<Message[]>([]);
     const scrollViewRef = useRef<ScrollView>(null);

     const handleLogin = () => {
          login({
               name: 'Edward',
               email: 'john@example.com',
          });
     };

     const handleSendMessage = (message: string) => {
          if (!message.trim()) return;

          const newMessage: Message = {
               id: Date.now().toString(),
               text: message,
               isUser: true,
               timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          setMessages((prev) => [...prev, newMessage]);

          setTimeout(() => {
               scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);

          const loadingMessage: Message = {
               id: 'loading-' + Date.now().toString(),
               text: '',
               isUser: false,
               timestamp: '',
               isLoading: true,
          };

          setMessages((prev) => [...prev, loadingMessage]);

          setTimeout(() => {
               scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);

          setTimeout(() => {
               setMessages((prev) => prev.filter(msg => msg.id !== loadingMessage.id));

               const replyMessage: Message = {
                    id: Date.now().toString() + '-bot',
                    text: 'Anda mengetikkan : ' + message,
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               };
               setMessages((prev) => [...prev, replyMessage]);

               setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
               }, 100);
          }, 1000);
     };

     return (
          <SafeAreaView style={styles.container}>
               {isLoggedIn ? (
                    <>
                         <View style={styles.header}>
                              <Text style={styles.welcomeText}>Welcome, {user?.name}!</Text>
                              <Button title="Logout" onPress={logout} color="red" />
                         </View>

                         <KeyboardAvoidingView
                              style={{ flex: 1 }}
                              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}
                         >
                              <ScrollView
                                   ref={scrollViewRef}
                                   style={styles.chatContainer}
                                   contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
                                   keyboardShouldPersistTaps="handled"
                                   onContentSizeChange={() =>
                                        scrollViewRef.current?.scrollToEnd({ animated: true })
                                   }
                              >
                                   {messages.map((msg) =>
                                        msg.isLoading ? (
                                             <ChatLoadingBubble key={msg.id} />
                                        ) : (
                                             <ChatBubble
                                                  key={msg.id}
                                                  message={msg.text}
                                                  isUser={msg.isUser}
                                                  timestamp={msg.timestamp}
                                             />
                                        )
                                   )}
                              </ScrollView>

                              <MessageInputCard onSend={handleSendMessage} />
                         </KeyboardAvoidingView>
                    </>
               ) : (
                    <View style={styles.authContainer}>
                         <Text>Please login to continue</Text>
                         <Button title="Login" onPress={handleLogin} />
                    </View>
               )}
          </SafeAreaView>


     );
};

export default HomeScreen;