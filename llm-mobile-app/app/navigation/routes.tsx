import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import SideMenu from '../components/sideMenu';
import Header from '../components/header';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SplashScreen from '../screens/SplashScreen';
import { RootStackParamList } from './type';
import ChangePasswordScreen from '../screens/ChangePassword';
import { useAuth } from '../services/Auth/useAuth';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <Header />,
      }}
      initialRouteName='Splash'
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.title || 'Chat'
        })}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{ headerShown: false  }}  
      />
    </Stack.Navigator>
  );
}

export default function AppRoutes() {
  const [navKey, setNavKey] = useState(0);
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      <Drawer.Navigator
        key={navKey} // Force re-render on auth changes
        drawerContent={(props) => <SideMenu {...props} />}
        screenOptions={{
          drawerPosition: 'left',
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#021526'
          }
        }}
      >
        <Drawer.Screen name="Main" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}