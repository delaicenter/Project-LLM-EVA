import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { removeThinkTags } from '../utils/chat';
import Markdown from 'react-native-markdown-display';
type ChatBubbleProps = {
     message: string;
     isUser: boolean;
     timestamp: string;
     isTyping?: boolean;
     onTypingDone?: () => void;
};

const ChatBubble = ({ message, isUser, timestamp, isTyping = false, onTypingDone }: ChatBubbleProps) => {
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
                         onTypingDone?.();
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

     const markdownStyles: { [key: string]: TextStyle | ViewStyle } = {
          text: {
               color: 'white',
               fontSize: 15,
               lineHeight: 22,
          },
          strong: {
               fontWeight: '700',
          },
          em: {
               fontStyle: 'italic',
          },
          heading1: {
               fontSize: 22,
               fontWeight: '700',
          },
          heading2: {
               fontSize: 18,
               fontWeight: '700',
          },
          bullet_list: {
               marginVertical: 4,
               color:'#ffffff'
          },
          list_item: {
               flexDirection: 'row',
               alignItems: 'flex-start',
               color:'#ffffff'
          },
          table: {
               borderWidth: 1,
               borderColor: '#ccc',
               marginVertical: 6,
          },
          th: {
               backgroundColor: '#ccc',
               padding: 4,
          },
          td: {
               padding: 4,
               borderWidth: 1,
               borderColor: '#ffffff',
          },
     };


     return (
          <View style={[styles.container, isUser ? styles.userBubble : styles.otherBubble]}>
               {isUser ? (
                    <Text style={styles.userText}>{cleanedMessage}</Text>
               ) : (
                    <Markdown style={markdownStyles}>
                         {displayedText}
                    </Markdown>
               )}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          maxWidth: '100%',
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
