import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useAuth } from '../services/Auth/useAuth';
import { useAppNavigation } from '../hooks/useAppNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Switch } from 'react-native';
import { useThemedStyles } from "../theme/useThemedStyles";
import { useTheme } from "../theme/themeContext";

  const themedStyles = (theme: any) =>
  StyleSheet.create({
    container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 1,
    backgroundColor: theme.backgroundHeader,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    marginTop: 12,
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    width: '100%',
    backgroundColor: theme.text,
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
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
    backgroundColor: theme.iconHeader,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitial: {
    color: theme.text,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlayModal,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 10,
  },
  profileBox: {
    width: 220,
    backgroundColor: theme.profileBox,
    borderRadius: 12,
    padding: 15,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
 profileCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  borderWidth: 2,
  borderColor: theme.iconHeader,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
  backgroundColor: 'transparent',
},
  profileInitial: {
    color: theme.text,
    fontWeight: 'bold',
    fontSize: 18,
  },
  profileName: {
    color: theme.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileEmail: {
    color: '#ccc',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.divider,
    marginVertical: 8,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
    changePassword: {
    color: '#5499e2ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  });
  
const Header = () => {
  const { isLoggedIn, user } = useAuth();
  const navigation = useAppNavigation();
  const [showProfile, setShowProfile] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const styles = useThemedStyles(themedStyles);

  const openDrawer = () => {
    navigation.openDrawer();
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
                routes: [{ name: 'Login' }]
              }
            }
          ],
        })
      );
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
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

      <Text style={styles.title}>EVA AI</Text>

      {isLoggedIn ? (
        <>
          <TouchableOpacity onPress={() => setShowProfile(true)}>
            <View style={styles.userIcon}>
          <Text style={styles.userInitial}>
               {(() => {
                    const name = user?.full_name || user?.name || '';
                    const parts = name.trim().split(' ');
                    if (parts.length >= 2) {
                         return (parts[0][0] + parts[1][0]).toUpperCase();
                    } else if (parts.length === 1 && parts[0].length > 0) {
                         return parts[0][0].toUpperCase();
                    } else {
                         return 'U';
                    }
               })()}
          </Text>
            </View>
          </TouchableOpacity>
          <Modal
            visible={showProfile}
            transparent
            animationType="fade"
            onRequestClose={() => setShowProfile(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowProfile(false)}>
              <View style={styles.profileBox}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileCircle}>
                    <Text style={styles.userInitial}>
                         {(() => {
                              const name = user?.full_name || user?.name || '';
                              const parts = name.trim().split(' ');
                              if (parts.length >= 2) {
                                   return (parts[0][0] + parts[1][0]).toUpperCase();
                              } else if (parts.length === 1 && parts[0].length > 0) {
                                   return parts[0][0].toUpperCase();
                              } else {
                                   return 'U';
                              }
                         })()}
                         </Text>
                  </View>
                  <View>
                    <Text style={styles.profileName}>{user?.full_name}</Text>
                    <Text style={styles.profileEmail}>{user?.email}</Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Logout */}
                <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
                  <Icon name="logout" size={20} color="#ff4444" style={styles.logoutIcon} />
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
               <TouchableOpacity
               style={styles.logoutRow}
               onPress={() => {
                    setShowProfile(false); 
                    navigation.navigate('ChangePassword' as never);
                    }}
               >
                    <MaterialCommunityIcons name="lock-reset" size={20} color="#5499e2ff" style={styles.logoutIcon} />
                    <Text style={styles.changePassword}>Change Password</Text>
               </TouchableOpacity>
                <View style={styles.logoutRow}>
                  <MaterialCommunityIcons
                    name={isDark ? "weather-night" : "weather-sunny"}
                    size={20}
                    color={isDark ? "#f1c40f" : "#34495e"}
                    style={styles.logoutIcon}
                  />
                  <Text style={[styles.changePassword, { color: theme.text, flex: 1 }]}>
                    Dark Mode
                  </Text>
                  <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    thumbColor={isDark ? "#ffffffff" : "#81b0ff"}
                    trackColor={{ false: "#dce7fbff", true: "#81b0ff" }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      ) : (
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
