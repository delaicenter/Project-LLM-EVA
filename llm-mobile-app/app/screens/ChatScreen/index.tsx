import React, { useState, useRef, useEffect } from 'react';
import {
     View,
     Text,
     KeyboardAvoidingView,
     Platform,
     SafeAreaView,
     ScrollView,
     StyleSheet,
     Keyboard,
} from 'react-native';
import { useAuth } from '../../services/Auth/useAuth';
import MessageInputCard from '../../components/chatCard';
import ChatBubble from '../../components/chatBubble';
import ChatLoadingBubble from '../../components/chatLoading';
import WelcomeCard from '../../components/welcomeCard';

type Message = {
     id: string;
     text: string;
     isUser: boolean;
     timestamp: string;
     isLoading?: boolean;
};

const HomeScreen = () => {
     const { isLoggedIn, user } = useAuth();
     const [messages, setMessages] = useState<Message[]>([]);
     const [keyboardHeight, setKeyboardHeight] = useState(0);
     const scrollViewRef = useRef<ScrollView>(null);

     useEffect(() => {
          const keyboardDidShowListener = Keyboard.addListener(
               Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
               (e) => {
                    setKeyboardHeight(e.endCoordinates.height);
               }
          );

          const keyboardDidHideListener = Keyboard.addListener(
               Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
               () => {
                    setKeyboardHeight(0);
               }
          );

          return () => {
               keyboardDidShowListener.remove();
               keyboardDidHideListener.remove();
          };
     }, []);

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

     if (!isLoggedIn) {
          return (
               <SafeAreaView style={styles.container}>
                    <View style={styles.authContainer}>
                         <Text>Please login from the side menu to continue</Text>
                    </View>
               </SafeAreaView>
          );
     }

     return (
          <SafeAreaView style={styles.container}>
               <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
               >
                    <View style={styles.contentContainer}>
                         <ScrollView
                              ref={scrollViewRef}
                              style={styles.chatContainer}
                              contentContainerStyle={[
                                   styles.chatContentContainer,
                                   messages.length === 0 && styles.emptyChatContentContainer,
                                   {
                                        paddingBottom: keyboardHeight > 0
                                             ? keyboardHeight + (Platform.OS === 'ios' ? 20 : 0)
                                             : 20
                                   }
                              ]}
                              keyboardShouldPersistTaps="handled"
                              onContentSizeChange={() => {
                                   scrollViewRef.current?.scrollToEnd({ animated: true });
                              }}
                         >
                              {messages.length === 0 ? (
                                   <WelcomeCard
                                        onSelectOption={(option) => {
                                             const selectedMessage =
                                                  option === 'wisata'
                                                       ? 'Berikan saya rekomendasi wisata di Toba'
                                                       : 'Berikan saya rekomendasi penginapan di Toba';
                                             handleSendMessage(selectedMessage);
                                        }}
                                   />
                              ) : (
                                   messages.map((msg) =>
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
                                   )
                              )}
                         </ScrollView>

                         <View style={[
                              styles.inputWrapper,
                              {
                                   paddingBottom: Platform.OS === 'ios' ? 16 : 65,
                                   marginBottom: keyboardHeight > 0 ? 0 : 0
                              }
                         ]}>
                              <MessageInputCard onSend={handleSendMessage} />
                         </View>
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
          backgroundColor: '#021526', // Tambahkan background color
     },
     authContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
     },
});

export default HomeScreen;