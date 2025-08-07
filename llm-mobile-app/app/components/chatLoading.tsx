import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

const Bar = ({ delay }: { delay: number }) => {
  const height = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(height, {
          toValue: 16,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(height, {
          toValue: 6,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [height]);

  return (
    <Animated.View style={[styles.bar, { height }]} />
  );
};

const ChatLoadingBubble = () => {
  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <Bar delay={0} />
        <Bar delay={100} />
        <Bar delay={200} />
        <Bar delay={300} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginVertical: 4,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 20,
    gap: 4,
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  bar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#6EACDA',
  },
});

export default ChatLoadingBubble;
