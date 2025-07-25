import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../services/auth';
import { useAppNavigation } from '../hooks/useAppNavigation';

const Header = () => {
     const { isLoggedIn, user } = useAuth();
     const navigation = useAppNavigation();

     const openDrawer = () => {
          navigation.openDrawer();
     };

     return (
          <View style={styles.container}>
               <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                    <View style={styles.menuIcon}>
                         <View style={styles.menuLine} />
                         <View style={styles.menuLine} />
                         <View style={styles.menuLine} />
                    </View>
               </TouchableOpacity>

               <Text style={styles.title}>Del AI</Text>

               {isLoggedIn ? (
                    <View style={styles.userIcon}>
                         <Text style={styles.userInitial}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
                    </View>
               ) : (
                    <TouchableOpacity style={styles.loginButton}>
                         <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
               )}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 15,
          paddingTop: 35,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
     },
     menuButton: {
          padding: 8, 
     },
     menuIcon: {
          width: 24,
          height: 18,
          justifyContent: 'space-between',
     },
     menuLine: {
          height: 2,
          width: '100%',
          backgroundColor: '#333',
          borderRadius: 2,
     },
     title: {
          fontSize: 18,
          fontWeight: 'bold',
     },
     loginButton: {
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: '#007AFF',
          borderRadius: 4,
     },
     loginText: {
          color: '#fff',
          fontSize: 14,
     },
     userIcon: {
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: '#007AFF',
          justifyContent: 'center',
          alignItems: 'center',
     },
     userInitial: {
          color: '#fff',
          fontWeight: 'bold',
     },
});

export default Header;