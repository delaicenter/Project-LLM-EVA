import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const ChatLoadingBubble = () => {
     return (
          <View style={styles.bubble}>
               <ActivityIndicator size="small" color="#0000ff" />
          </View>
     );
};

const styles = StyleSheet.create({
     bubble: {
          alignSelf: 'flex-start',
          backgroundColor: '#f0f0f0',
          padding: 12,
          borderRadius: 18,
          marginVertical: 4,
          marginLeft: 8,
          maxWidth: '80%',
     },
});

export default ChatLoadingBubble;
