import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../services/Auth/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import {
    chatHistoryIsCached,
    fetchAndCacheChatHistory,
    getCachedChatHistory
} from '../services/Chats/chatHistoryStore';

const SideMenu = ({ navigation, state }: any) => {
    const { isLoggedIn, isLoading, user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const activeRoute = state?.routes[0]?.state?.routes.find(
        (route: any) => route.name === 'Chat'
    );
    const activeConversationId = activeRoute?.params?.conversationId;

    const fetchChatHistory = async () => {
        try {
            setLoading(true);
            if (chatHistoryIsCached()) {
                setChatHistory(getCachedChatHistory());
            } else {
                const history = await fetchAndCacheChatHistory();
                setChatHistory(history);
            }
        } catch (err) {
            setError('Failed to load chat history');
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            setIsInitialLoad(true);
            fetchChatHistory();
        }
    }, [isLoggedIn]);

    useFocusEffect(
        useCallback(() => {
            if (isLoggedIn) {
                fetchChatHistory();
            }
        }, [isLoggedIn])
    );

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        );
    }

    const handleNewChat = () => {
        navigation.navigate('Main', {
            screen: 'Chat',
            params: { conversationId: null, title: 'New Chat' }
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
                    routes: [{ name: 'Main', state: { routes: [{ name: 'Login' }] } }]
                })
            );
        } catch (error) {
            console.error('Failed to logout:', error);
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
                                placeholder="Search chat history..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#03346E"
                            />
                        </View>

                        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
                            <Icon name="add" size={20} color="#fff" />
                            <Text style={styles.newChatButtonText}>New Chat</Text>
                        </TouchableOpacity>
                    </View>

                    <DrawerContentScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <View style={styles.historySection}>
                            <Text style={styles.sectionTitle}>Chat History</Text>

                            {loading && isInitialLoad ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#ffffff" />
                                    <Text style={styles.loadingText}>Loading your chats...</Text>
                                </View>
                            ) : error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : filteredHistory.length === 0 ? (
                                <Text style={styles.emptyText}>No chat history</Text>
                            ) : (
                                filteredHistory.map(chat => (
                                    <TouchableOpacity
                                        key={chat.id}
                                        style={[
                                            styles.chatItem,
                                            chat.id === activeConversationId && styles.activeChatItem
                                        ]}
                                        onPress={() =>
                                            navigation.navigate('Main', {
                                                screen: 'Chat',
                                                params: { conversationId: chat.id, title: chat.title }
                                            })
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.chatItemText,
                                                chat.id === activeConversationId && styles.activeChatItemText
                                            ]}
                                            numberOfLines={1}
                                        >
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
                    <Text style={styles.loginText}>Please login to access chat features</Text>
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
                        onPress={() => navigation.navigate('Login')}
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
        backgroundColor: '#021526',
    },
    fixedSection: {
        paddingTop: 0,
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
    },
    newChatButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    historySection: {
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
        paddingTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingIndicator: {
        marginBottom: 15,
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
    chatItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 4,
        marginBottom: 4,
    },
    activeChatItem: {
        backgroundColor: 'rgba(3, 52, 110, 0.2)',
        borderLeftWidth: 3,
        borderLeftColor: '#03346E',
    },
    chatItemText: {
        color: '#ffffff',
        fontSize: 16
    },
    activeChatItemText: {
        fontWeight: 'bold',
        color: '#03346E',
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
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginTop: 'auto',
    },
    button: {
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        width: '100%',
    },
    loginButton: {
        backgroundColor: '#007AFF',
    },
    logoutButton: {
        borderColor: '#ff4444',
        borderWidth: 1,
    },
    buttonText: {
        color: '#ff4444',
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