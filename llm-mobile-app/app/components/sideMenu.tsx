import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../services/Auth/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { getChatHistory } from '../services/Chats/chats.service';
import { CommonActions } from '@react-navigation/native';

const SideMenu = ({ navigation }: any) => {
     const { isLoggedIn, user, } = useAuth();
     const [searchQuery, setSearchQuery] = useState('');
     const [chatHistory, setChatHistory] = useState<any[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');

     useEffect(() => {
          if (isLoggedIn) {
               fetchChatHistory();
          }
     }, [isLoggedIn]);

     const fetchChatHistory = async () => {
          setLoading(true);
          setError('');
          try {
               const history = await getChatHistory();
               setChatHistory(history);
          } catch (err) {
               setError('Gagal memuat history chat');
               console.error(err);
          } finally {
               setLoading(false);
          }
     };

     const handleNewChat = () => {
          navigation.navigate('Main', {
               screen: 'Chat',
               params: {
                    conversationId: null,
                    title: 'Obrolan Baru'
               }
          });
          navigation.closeDrawer();
     };

     const handleLogout = async () => {
          try {
               await AsyncStorage.removeItem('access_token');
               await AsyncStorage.removeItem('user_info');

               navigation.dispatch(
                    CommonActions.reset({
                         index: 0,
                         routes: [
                              {
                                   name: 'Main',
                                   state: {
                                        routes: [
                                             { name: 'Login' }
                                        ]
                                   }
                              }
                         ],
                    })
               );
          } catch (error) {
               console.error('Failed to remove token:', error);
          }
     };


     const filteredHistory = chatHistory.filter(chat =>
          chat.title.toLowerCase().includes(searchQuery.toLowerCase())
     );

     return (
          <View style={styles.container}>
               {isLoggedIn ? (
                    <>
                         <View style={styles.fixedSection}>
                              <View style={styles.userSection}>
                                   <Text style={styles.userName}>{user?.full_name}</Text>
                                   <Text style={styles.userEmail}>{user?.email}</Text>
                              </View>

                              <View style={styles.searchContainer}>
                                   <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
                                   <TextInput
                                        style={styles.searchInput}
                                        placeholder="Cari history chat..."
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        placeholderTextColor={'#03346E'}
                                   />
                              </View>
                              <TouchableOpacity
                                   style={styles.newChatButton}
                                   onPress={handleNewChat}
                              >
                                   <Icon name="add" size={20} color="#fff" />
                                   <Text style={styles.newChatButtonText}>Obrolan Baru</Text>
                              </TouchableOpacity>
                         </View>

                         <DrawerContentScrollView
                              style={styles.scrollView}
                              contentContainerStyle={styles.scrollContent}
                         >
                              <View style={styles.historySection}>
                                   <Text style={styles.sectionTitle}>History Chat</Text>

                                   {loading ? (
                                        <ActivityIndicator size="small" color="#ffffff" />
                                   ) : error ? (
                                        <Text style={styles.errorText}>{error}</Text>
                                   ) : filteredHistory.length === 0 ? (
                                        <Text style={styles.emptyText}>Tidak ada history chat</Text>
                                   ) : (
                                        filteredHistory.map(chat => (
                                             <TouchableOpacity
                                                  key={chat.id}
                                                  style={styles.chatItem}
                                                  onPress={() => navigation.navigate('Main', {
                                                       screen: 'Chat',
                                                       params: {
                                                            conversationId: chat.id,
                                                            title: chat.title
                                                       }
                                                  })
                                                  }
                                             >
                                                  <Text style={styles.chatItemText} numberOfLines={1}>
                                                       {chat.title}
                                                  </Text>
                                                  <Text style={styles.chatDateText}>
                                                       {new Date(chat.lastUpdated || chat.createdAt).toLocaleDateString()}
                                                  </Text>
                                             </TouchableOpacity>
                                        ))
                                   )}
                              </View>
                         </DrawerContentScrollView>
                    </>
               ) : (
                    <View style={styles.loginPrompt}>
                         <Text style={styles.loginText}>Silakan login untuk mengakses fitur chat</Text>
                    </View>
               )}

               <View style={styles.footer}>
                    {isLoggedIn ? (
                         <TouchableOpacity
                              style={[styles.button, styles.logoutButton]}
                              onPress={handleLogout}
                         >
                              <Text style={styles.buttonText}>Logout</Text>
                         </TouchableOpacity>
                    ) : (
                         <TouchableOpacity
                              style={[styles.button, styles.loginButton]}
                              onPress={handleLogout}
                         >
                              <Text style={styles.buttonText}>Login</Text>
                         </TouchableOpacity>
                    )}
               </View>
          </View>
     );
};
const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
     fixedSection: {
          paddingTop: 20,
     },
     userSection: {
          padding: 20,
          paddingBottom: 10,
     },
     userName: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 4,
          color: '#ffffff',
     },
     userEmail: {
          fontSize: 14,
          color: '#666',
     },
     searchContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: 8,
          marginHorizontal: 15,
          marginBottom: 15,
          paddingHorizontal: 10,
     },
     searchIcon: {
          marginRight: 8,
     },
     searchInput: {
          flex: 1,
          height: 40,
          fontSize: 14,
          color: '#03346E'
     },
     newChatButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#03346E',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
          justifyContent: 'center',
          marginHorizontal: 15,
          paddingHorizontal: 10,
     },
     newChatButtonText: {
          color: '#fff',
          marginLeft: 8,
          fontWeight: 'bold',
     },
     scrollView: {
          flex: 1,
          top: 0,
     },
     scrollContent: {
          paddingBottom: 20,
     },
     historySection: {
          paddingHorizontal: 10,
          top: -40

     },
     sectionTitle: {
          fontWeight: 'bold',
          marginBottom: 10,
          color: '#555',
          paddingTop: 10,
     },
     chatItem: {
          paddingVertical: 12,
          paddingHorizontal: 10,
          bottom: 12,
          color: '#ffffff'
     },
     chatItemText: {
          color: '#ffffff',
          fontSize: 16
     },
     errorText: {
          color: '#ff4444',
          textAlign: 'center',
          marginTop: 10,
     },
     emptyText: {
          color: '#666',
          textAlign: 'center',
          marginTop: 10,
     },
     chatDateText: {
          color: '#888',
          fontSize: 12,
          marginTop: 2,
     },

     footer: {
       backgroundColor:'#021526',  
          paddingVertical: 12,
          paddingHorizontal: 10,
          alignItems: 'center',
          marginTop: 'auto', 
          bottom:30
     },

     developedBy: {
          color: '#aaa',           
          fontSize: 12,
          textAlign: 'center',
          letterSpacing: 0.5,
     },

     button: {
          padding: 12,
          borderRadius: 6,
          alignItems: 'center',
     },
     loginButton: {
          backgroundColor: '#007AFF',
     },
     logoutButton: {
          backgroundColor: '#ff4444',
          width: '100%',
          
     },
     buttonText: {
          color: 'white',
          fontWeight: 'bold',
     },
     loginPrompt: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
     },
     loginText: {
          fontSize: 16,
          color: '#666',
          textAlign: 'center',
     },
});

export default SideMenu;