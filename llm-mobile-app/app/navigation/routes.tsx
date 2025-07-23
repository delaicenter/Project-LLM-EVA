import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import SideMenu from '../components/sideMenu';
import Header from '../components/header';
import HomeScreen from '../screens/ChastScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <Header />, 
      }}
      initialRouteName='Login'
    >
       <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ headerShown: false }}
        />
      <Stack.Screen name="Home" component={HomeScreen} />
      
    </Stack.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <SideMenu {...props} />}
        screenOptions={{
          drawerPosition: 'left',
          headerShown: false,
        }}
      >
        <Drawer.Screen name="Main" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
