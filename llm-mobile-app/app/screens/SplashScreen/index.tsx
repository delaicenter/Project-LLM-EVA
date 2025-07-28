import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './style';
const SplashScreen = () => {
     const navigation = useNavigation();
     const fadeAnim = useRef(new Animated.Value(0)).current;
     const scaleAnim = useRef(new Animated.Value(0.8)).current;

     useEffect(() => {
          Animated.parallel([
               Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
               }),
               Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 4,
                    tension: 40,
                    useNativeDriver: true,
               })
          ]).start();

          setTimeout(async () => {
               const token = await AsyncStorage.getItem('access_token');

               if (token) {
                    navigation.reset({ index: 0, routes: [{ name: 'Chat' }] });
               } else {
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
               }
          }, 2500);
     }, []);

     return (
          <View style={styles.container}>
               <Animated.Image
                    source={require('../../../assets/icon.png')}  
                    style={[
                         styles.logo,
                         {
                              opacity: fadeAnim,
                              transform: [{ scale: scaleAnim }]
                         }
                    ]}
                    resizeMode="contain"
               />
          </View>
     );
};

export default SplashScreen;

