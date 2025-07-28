import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../services/Auth/useAuth';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const SideMenu = ({ navigation }: any) => {
     const { isLoggedIn, user, login, logout } = useAuth();
     const [searchQuery, setSearchQuery] = React.useState('');

     const chatHistory = [
          { id: 1, title: 'Diskusi Project A' },
          { id: 2, title: 'Meeting dengan Klien' },
          { id: 3, title: 'Brainstorming Ide' },
          { id: 4, title: 'Review Proposal Kerja Sama' },
          { id: 5, title: 'Follow Up Tim Desain' },
          { id: 6, title: 'Rapat Evaluasi Mingguan' },
          { id: 7, title: 'Diskusi Anggaran' },
          { id: 8, title: 'Pembuatan Roadmap Produk' },
          { id: 9, title: 'Koordinasi dengan Developer' },
          { id: 10, title: 'Strategi Marketing 2025' },
          { id: 11, title: 'Presentasi Ke Investor' },
          { id: 12, title: 'Pembuatan Konten Sosial Media' },
          { id: 13, title: 'Diskusi Nama Produk Baru' },
          { id: 14, title: 'Analisis Feedback Pengguna' },
          { id: 15, title: 'Perencanaan UI/UX Baru' },
          { id: 16, title: 'Diskusi Pricing Model' },
          { id: 17, title: 'Persiapan Demo App' },
          { id: 18, title: 'Rencana Peluncuran Versi Beta' },
          { id: 19, title: 'Konsultasi Legalitas Produk' },
          { id: 20, title: 'Tindak Lanjut Feedback Tim QA' },
     ];

     const handleLogin = () => {
          login({
               name: 'Edward',
               email: 'edd@example.com',
          });
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
                                   <Text style={styles.userName}>{user?.name}</Text>
                                   <Text style={styles.userEmail}>{user?.email}</Text>
                              </View>

                              <View style={styles.searchContainer}>
                                   <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
                                   <TextInput
                                        style={styles.searchInput}
                                        placeholder="Cari history chat..."
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                   />
                              </View>
                         </View>

                         <DrawerContentScrollView
                              style={styles.scrollView}
                              contentContainerStyle={styles.scrollContent}
                         >
                              <View style={styles.historySection}>
                                   <Text style={styles.sectionTitle}>History Chat</Text>
                                   {filteredHistory.map(chat => (
                                        <TouchableOpacity
                                             key={chat.id}
                                             style={styles.chatItem}
                                             onPress={() => navigation.navigate('Chat', { chatId: chat.id })}
                                        >
                                             <Text style={styles.chatItemText}>{chat.title}</Text>
                                        </TouchableOpacity>
                                   ))}
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
                              onPress={logout}
                         >
                              <Text style={styles.buttonText}>Logout</Text>
                         </TouchableOpacity>
                         ) : (
                              <TouchableOpacity
                              style={[styles.button, styles.loginButton]}
                              onPress={handleLogin}
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
     },
     scrollView: {
          flex: 1,
          top: 0
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

     footer: {
          padding: 15,
          bottom: 30
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