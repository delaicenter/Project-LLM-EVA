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
import { startChat, initiateConversation, getPreviousMessages } from '../../services/Chats/chats.service';
import { ChatScreenProps } from '../../navigation/type';
type Message = {
     id: string;
     text: string;
     isUser: boolean;
     timestamp: string;
     isLoading?: boolean;
     isTyping?: boolean;
};


const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
     const { conversationId: initialConversationId, title } = route.params || {};
     const [conversationId, setConversationId] = useState<string | null>(initialConversationId || null);
     const { isLoggedIn, user } = useAuth();
     const [messages, setMessages] = useState<Message[]>([]);
     const [keyboardHeight, setKeyboardHeight] = useState(0);
     const scrollViewRef = useRef<ScrollView>(null);

     //ngeload message dari history
     useEffect(() => {
          const loadPreviousMessages = async () => {
               if (!initialConversationId || !isLoggedIn) return;
               try {
                    const prevMsgs = await getPreviousMessages(initialConversationId);
                    console.log('Log:', prevMsgs);
                    prevMsgs.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                    const formattedMessages: Message[] = prevMsgs.map((msg: any) => ({
                         id: msg.id?.toString() ?? Date.now().toString(),
                         text: msg.content || '',
                         isUser: msg.role === 'user',
                         timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                         }),
                    }));

                    setMessages(formattedMessages);
               } catch (error) {
                    console.error('Failed to load previous messages:', error);
               }
          };

          loadPreviousMessages();
     }, [initialConversationId, isLoggedIn]);


     //ngeload chat yang baru saja dimulai
     useEffect(() => {
          if (!initialConversationId) {
               setMessages([]); // Kosongkan isi chat
          }
     }, [initialConversationId]);

     useEffect(() => {
          const init = async () => {
               if (!initialConversationId && isLoggedIn) {
                    try {
                         const newConversationId = await initiateConversation();
                         setConversationId(newConversationId);
                    } catch (error) {
                         console.error('Failed to initiate conversation:', error);
                    }
               } else if (initialConversationId) {
                    setConversationId(initialConversationId);
               }
          };

          init();
     }, [initialConversationId, isLoggedIn]);


     //set keyboard
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


     //handle send message
     const handleSendMessage = async (message: string) => {
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

          try {
               const response = await startChat(message, conversationId || undefined);

               if (response.conversationId && !conversationId) {
                    setConversationId(response.conversationId);
               }

               setMessages((prev) => prev.filter(msg => msg.id !== loadingMessage.id));

               const replyMessage: Message = {
                    id: Date.now().toString() + '-bot',
                    text: response.reply || 'Tidak ada balasan.',
                    isUser: false,
                    isTyping: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               };


               setMessages((prev) => {
                    const updated = prev.map(msg => ({
                         ...msg,
                         isTyping: false
                    }));

                    return [...updated, replyMessage];
               });
               ;

               setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
               }, 100);
          } catch (error: any) {
               setMessages((prev) => prev.filter(msg => msg.id !== loadingMessage.id));
               console.error('Error starting chat:', error);
               const errorMsg: Message = {
                    id: Date.now().toString() + '-err',
                    text: 'Terjadi kesalahan saat mengirim pesan.',
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
               };
               setMessages((prev) => [...prev, errorMsg]);
          }
     };

     if (!isLoggedIn) {
          return (
               <SafeAreaView style={styles.container}>
                    <View style={styles.authContainer}>
                         <Text>To start chat, please login</Text>
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
                                                  isTyping={msg.isTyping}
                                                  onTypingDone={() => {
                                                       setMessages(prev =>
                                                            prev.map(m => (m.id === msg.id ? { ...m, isTyping: false } : m))
                                                       );
                                                  }}
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
          backgroundColor: '#021526',
     },
     authContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
     },
});

export default ChatScreen;