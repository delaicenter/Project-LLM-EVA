import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet, Easing } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';
import { RootStackParamList } from '../../navigation/type';

const { width } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SplashScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // Semua state dan ref untuk animasi tetap sama
    const textFade = useRef(new Animated.Value(0)).current;
    const circleAnim = useRef(new Animated.Value(0)).current;
    const circleRadius = useRef(new Animated.Value(0)).current;
    const circleFillOpacity = useRef(new Animated.Value(0)).current;
    const dotScale = useRef(new Animated.Value(0)).current;
    const dotOpacity = useRef(new Animated.Value(0)).current;

    const radius = (width * 0.45) / 3;
    const circumference = 2 * Math.PI * radius;
    const center = width * 0.45 / 2;

    useEffect(() => {
        // Logika animasi tidak berubah
        Animated.timing(textFade, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(circleAnim, {
                toValue: 1,
                duration: 700,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }).start(() => {
                circleFillOpacity.setValue(1);
                Animated.parallel([
                    Animated.timing(textFade, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                    Animated.timing(circleRadius, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    Animated.parallel([
                        Animated.timing(dotScale, {
                            toValue: 1.5,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.timing(dotOpacity, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ]).start();
                });
            });
        });

        // Logika pengecekan login setelah animasi selesai (SEKARANG LEBIH SEDERHANA)
        const timer = setTimeout(async () => {
            const token = await AsyncStorage.getItem('access_token');

            // Tidak ada lagi pemanggilan `triggerAuthCheck` di sini
            if (token) {
                // Jika sudah ada token, langsung ke halaman utama
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Chat' }],
                });
            } else {
                // Jika tidak ada token, ke halaman Login
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }
        }, 3000); // Sesuaikan durasi ini dengan total durasi animasi Anda

        // Best practice: membersihkan timer jika komponen di-unmount sebelum timeout selesai
        return () => clearTimeout(timer);

    }, [navigation]); // Dependensi cukup navigation

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Svg height={width * 0.45} width={width * 0.45}>
                    <AnimatedCircle
                        cx={center}
                        cy={center}
                        r={circleRadius.interpolate({
                            inputRange: [0, 1.5],
                            outputRange: [radius - 3, 2],
                        })}
                        stroke="white"
                        strokeWidth={3}
                        fill="white"
                        fillOpacity={circleFillOpacity}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={circleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [circumference, 0],
                        })}
                        rotation={-180}
                        originX={center}
                        originY={center}
                    />
                </Svg>

                <Animated.View
                    style={{
                        position: 'absolute',
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'white',
                        transform: [{ scale: dotScale }],
                        opacity: dotOpacity,
                    }}
                />

                <Animated.Text
                    style={[
                        styles.text,
                        {
                            opacity: textFade,
                            transform: [
                                {
                                    scale: textFade.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.8, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    EVA
                </Animated.Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#021526', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 48,
        fontWeight: 'bold',
        position: 'absolute',
    },
});

export default SplashScreen;