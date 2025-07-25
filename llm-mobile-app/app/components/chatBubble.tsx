import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ChatBubbleProps = {
     message: string;
     isUser: boolean;
     timestamp: string;
};

const ChatBubble = ({ message, isUser, timestamp }: ChatBubbleProps) => {
     return (
          <View style={[styles.container, isUser ? styles.userBubble : styles.otherBubble]}>
               <Text style={isUser ? styles.userText : styles.otherText}>{message}</Text>
               <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.otherTimestamp]}>
                    {timestamp}
               </Text>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          maxWidth: '80%',
          padding: 12,
          borderRadius: 12,
          marginVertical: 4,
          bottom:10
     },
     userBubble: {
          alignSelf: 'flex-end',
          backgroundColor: '#007AFF',
          borderBottomRightRadius: 0,
     },
     otherBubble: {
          alignSelf: 'flex-start',
          backgroundColor: '#E5E5EA',
          borderBottomLeftRadius: 0,
     },
     userText: {
          color: 'white',
     },
     otherText: {
          color: 'black',
     },
     timestamp: {
          fontSize: 10,
          marginTop: 4,
          textAlign: 'right',
     },
     userTimestamp: {
          color: '#D3D3D3',
     },
     otherTimestamp: {
          color: '#8E8E93',
     },
});

export default ChatBubble;