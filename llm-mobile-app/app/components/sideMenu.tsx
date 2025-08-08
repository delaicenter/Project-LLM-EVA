import React, { useRef, useState, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../services/Auth/AuthContext';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useChatHistory } from '../services/Chats/ChatHistoryContext';
import { chatService } from '../services/Chats/chats.service';
import { RefreshControl } from 'react-native';
import CustomAlert from '../components/customAlert';
import { Swipeable } from 'react-native-gesture-handler';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Animated } from 'react-native';

const SideMenu = ({ navigation, state }: any) => {
    const { isLoggedIn, isLoading, user } = useAuth();
    const { chatHistory, refreshChatHistory } = useChatHistory();
    const openSwipeableRef = useRef<Swipeable | null>(null);
    const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const activeRoute = state?.routes[0]?.state?.routes.find(
        (route: any) => route.name === 'Chat'
    );
    const activeConversationId = activeRoute?.params?.conversationId;
    const currentYear = new Date().getFullYear();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [showActionMenuForId, setShowActionMenuForId] = useState<string | null>(null);

    const confirmDelete = (chatId: string) => {
        setSelectedChatId(chatId);
        setShowDeleteConfirm(true);
    };

    const handleDeletePress = (chatId: string) => {
        setSelectedChatId(chatId);
        setShowDeleteConfirm(true);
        setShowActionMenuForId(null);
    };

        const closeSwipeable = () => {
    if (openSwipeableRef.current) {
        openSwipeableRef.current.close();
        openSwipeableRef.current = null;
    }
    };

    const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
    chatId: string
    ) => {
    const scale = dragX.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <TouchableOpacity onPress={() => handleDeletePress(chatId)}>
        <Animated.View style={[styles.deleteSwipe, { transform: [{ scale }] }]}>
            <Icon name="delete" size={30} color="#fff" />
        </Animated.View>
        </TouchableOpacity>
    );
    };

    const deleteChat = async () => {
    if (selectedChatId) {
        try {
        await chatService.deleteConversation(selectedChatId);
        refreshChatHistory(); 
        } catch (err) {
        console.error(err);
        }
        setSelectedChatId(null);
        setShowDeleteConfirm(false);
    }
    };

    useFocusEffect(
        useCallback(() => {
            const refresh = async () => {
                try {
                    setLoading(true);
                    await refreshChatHistory();
                } catch {
                    setError('Failed to refresh chat history');
                } finally {
                    setLoading(false);
                }
            };

            if (isLoggedIn) refresh();
        }, [isLoggedIn])
    );
    
    useFocusEffect(
        useCallback(() => {
            return () => {
            setShowActionMenuForId(null); 
            };
        }, [])
    );

    const handleNewChat = () => {
        navigation.navigate('Main', {
            screen: 'Chat',
            params: { conversationId: null, title: 'New Chat' }
        });
        navigation.closeDrawer();
    };

    
    const groupChatsSmart = (chats: any[]) => {
        const now = new Date();
        const grouped: { [key: string]: any[] } = {};

        chats.forEach(chat => {
            const date = new Date(chat.lastUpdated || chat.createdAt);
            const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

            let key = '';

            if (diffInDays < 30) {
                const weekIndex = Math.floor(diffInDays / 7);
                if (weekIndex === 0) key = 'Minggu Ini';
                else if (weekIndex === 1) key = 'Minggu Lalu';
                else key = `${weekIndex} Minggu Lalu`;
            } else {
                const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                key = monthYear;
            }

            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(chat);
        });

        return grouped;
    };


    const filteredHistory = chatHistory.filter((chat: any) =>
        (chat.title ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const groupedChats = groupChatsSmart(filteredHistory);

    if (isLoading || isLoggedIn === null) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        );
    }

    return (
    <TouchableWithoutFeedback
        onPress={() => {
        Keyboard.dismiss();
        closeSwipeable();  
        }}
    >
    <View style={styles.container}>
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
                                placeholder="Cari riwayat obrolan..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#03346E"
                            />
                        </View>

                        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
                            <Icon name="add" size={20} color="#fff" />
                            <Text style={styles.newChatButtonText}>Obrolan Baru</Text>
                        </TouchableOpacity>
                    </View>

                    <DrawerContentScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={refreshChatHistory}
                                tintColor="#ffffff"
                            />
                        }
                    >
                        <View style={styles.historySection}>
                            <Text style={styles.sectionTitle}>Riwayat Obrolan</Text>
                            <View style={styles.separator} />

                            {loading && filteredHistory.length === 0 ? (
                                <Text style={styles.loadingText}>Refreshing...</Text>
                            ) : error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : filteredHistory.length === 0 ? (
                                <Text style={styles.emptyText}>Tidak ada riwayat obrolan</Text>
                            ) : (
                                Object.entries(groupedChats).map(([label, chats], index) => (
                                    <View key={label}>
                                        {index !== 0 && <View style={styles.separator} />}
                                        <View style={styles.groupLabelWrapper}>
                                            <Text style={styles.groupLabel} >{label}</Text>
                                        </View>

                                        {chats.map((chat: any) => (
                                            <Swipeable
                                                friction={2}
                                                key={chat.id}
                                                    renderLeftActions={(progress, dragX) =>
                                                        renderLeftActions(progress, dragX, chat.id)
                                                    }
                                                    onSwipeableWillOpen={() => {
                                                        if (openSwipeableRef.current && openSwipeableRef.current !== swipeableRefs.current[chat.id]) {
                                                        openSwipeableRef.current.close();
                                                        }
                                                    }}
                                                    onSwipeableOpen={() => {
                                                        // Simpan referensi swipeable yang sedang terbuka
                                                        openSwipeableRef.current = swipeableRefs.current[chat.id];
                                                    }}
                                                    ref={(ref) => {
                                                        swipeableRefs.current[chat.id] = ref;
                                                    }}
                                                >
                                                <TouchableOpacity
                                                style={styles.chatItem}
                                                onPress={() => {
                                                    navigation.navigate('Main', {
                                                    screen: 'Chat',
                                                    params: {
                                                        conversationId: chat.id,
                                                        title: chat.title,
                                                    },
                                                    });
                                                    navigation.closeDrawer();
                                                }}
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
                                            </Swipeable>
                                            ))}
                                    </View>
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
                     <Text style={styles.footerText}>© {currentYear} IT DEL. All rights reserved.</Text>                ) : (
                    <TouchableOpacity
                        style={[styles.button, styles.loginButton]}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                )}
            </View>

            <CustomAlert
                visible={showDeleteConfirm}
                title="Konfirmasi Hapus"
                message="Yakin ingin menghapus percakapan ini?"
                onClose={() => {
                    setShowDeleteConfirm(false);
                    setSelectedChatId(null);
                }}
                onConfirm={deleteChat}
                type="error"
            />
        </View>
    </View>
    </TouchableWithoutFeedback>
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
        paddingTop: 0,
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
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 10,
    },
    separator: {
        borderBottomColor: '#444',
        borderBottomWidth: 1,
        marginVertical: 10,
        marginHorizontal: 10,
    },  
    footerText: {
        color: '#ffffff',
        fontSize: 13,
        fontStyle: 'italic',
        letterSpacing: 0.5,
        opacity: 0.7,
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
    groupLabelWrapper: {
        backgroundColor: 'rgba(90, 90, 90, 0.05)',
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginHorizontal: 10,    
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },

    groupLabel: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    deleteSwipe: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    paddingVertical: 10,
    borderRadius: 8,
    },

    deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
    },
});


export default SideMenu;