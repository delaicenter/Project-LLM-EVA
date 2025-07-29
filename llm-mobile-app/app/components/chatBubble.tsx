import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { removeThinkTags } from '../utils/chat';

type ChatBubbleProps = {
     message: string;
     isUser: boolean;
     timestamp: string;
     isTyping?: boolean;
};

const ChatBubble = ({ message, isUser, timestamp, isTyping = false }: ChatBubbleProps) => {
     const [displayedText, setDisplayedText] = useState('');
     const [showCursor, setShowCursor] = useState(true);

     const cleanedMessage = isUser ? message : removeThinkTags(message);

     useEffect(() => {
          if (isTyping && !isUser) {
               let currentIndex = 0;
               setDisplayedText('');

               const typingInterval = setInterval(() => {
                    if (currentIndex < cleanedMessage.length) {
                         setDisplayedText(prev => prev + cleanedMessage[currentIndex]);
                         currentIndex++;
                    } else {
                         clearInterval(typingInterval);
                         setShowCursor(false);
                    }
               }, 30);

               return () => clearInterval(typingInterval);
          } else {
               setDisplayedText(cleanedMessage);
          }
     }, [cleanedMessage, isTyping, isUser]);

     // Efek blink cursor
     useEffect(() => {
          if (isTyping && !isUser) {
               const cursorInterval = setInterval(() => {
                    setShowCursor(prev => !prev);
               }, 500);

               return () => clearInterval(cursorInterval);
          }
     }, [isTyping, isUser]);

     return (
          <View style={[styles.container, isUser ? styles.userBubble : styles.otherBubble]}>
               <Text style={isUser ? styles.userText : styles.otherText}>
                    {isUser ? cleanedMessage : displayedText}
                    {!isUser && isTyping && showCursor && <Text style={styles.cursor}>|</Text>}
               </Text>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          maxWidth: '80%',
          padding: 15,
          borderRadius: 12,
          marginVertical: 10,
          bottom: 5
     },
     userBubble: {
          alignSelf: 'flex-end',
          backgroundColor: '#4B4B4B64',
          borderBottomRightRadius: 0,
     },
     otherBubble: {
          alignSelf: 'flex-start',
          backgroundColor: '#021526',
          borderBottomLeftRadius: 0,
     },
     userText: {
          color: 'white',
     },
     otherText: {
          color: 'white',
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
     cursor: {
          opacity: 0.8,
          fontWeight: 'bold',
     },
});

export default ChatBubble;