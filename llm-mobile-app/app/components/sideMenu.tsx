import React, { useState, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../services/Auth/AuthContext';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useChatHistory } from '../services/Chats/ChatHistoryContext';
import { RefreshControl } from 'react-native';

const SideMenu = ({ navigation, state }: any) => {
    const { isLoggedIn, isLoading, user } = useAuth();
    const { chatHistory, refreshChatHistory } = useChatHistory();

    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const activeRoute = state?.routes[0]?.state?.routes.find(
        (route: any) => route.name === 'Chat'
    );
    const activeConversationId = activeRoute?.params?.conversationId;
    const currentYear = new Date().getFullYear();

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

    const handleNewChat = () => {
        navigation.navigate('Main', {
            screen: 'Chat',
            params: { conversationId: null, title: 'New Chat' }
        });
        navigation.closeDrawer();
    };

    const filteredHistory = chatHistory.filter((chat: any) =>
        (chat.title ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading || isLoggedIn === null) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        );
    }

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

                            {loading && filteredHistory.length === 0 ? (
                                <Text style={styles.loadingText}>Refreshing...</Text>
                            ) : error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : filteredHistory.length === 0 ? (
                                <Text style={styles.emptyText}>Tidak ada riwayat obrolan</Text>
                            ) : (
                                filteredHistory.map((chat: any) => (
                                    <TouchableOpacity
                                        key={chat.id}
                                        style={[
                                            styles.chatItem,
                                            chat.id === activeConversationId && styles.activeChatItem
                                        ]}
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
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        width: '90%',
        marginBottom: 8,
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
});


export default SideMenu;