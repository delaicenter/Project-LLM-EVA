import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Animated, Easing } from 'react-native';
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
     const fadeAnim = useState(new Animated.Value(0))[0];

     const cleanedMessage = isUser ? message : removeThinkTags(message);

     useEffect(() => {
          Animated.timing(fadeAnim, {
               toValue: 1,
               duration: 300,
               easing: Easing.out(Easing.quad),
               useNativeDriver: true,
          }).start();
     }, []);

     useEffect(() => {
          if (isTyping && !isUser) {
               let currentIndex = 0;
               setDisplayedText('');
               let prev: string;

               const typingInterval = setInterval(() => {
                    if (currentIndex < cleanedMessage.length) {
                         if (!prev) {
                              prev = cleanedMessage[0];
                         } else {
                              prev = prev + cleanedMessage[currentIndex];
                         }
                         setDisplayedText(prev);
                         currentIndex++;
                    } else {
                         clearInterval(typingInterval);
                         setShowCursor(false);
                         onTypingDone?.();
                    }
               }, 20); // Slightly faster typing speed

               return () => clearInterval(typingInterval);
          } else {
               setDisplayedText(cleanedMessage);
          }
     }, [cleanedMessage, isTyping, isUser]);

     // Cursor blink effect
     useEffect(() => {
          if (isTyping && !isUser) {
               const cursorInterval = setInterval(() => {
                    setShowCursor(prev => !prev);
               }, 500);

               return () => clearInterval(cursorInterval);
          }
     }, [isTyping, isUser]);

     const markdownStyles: { [key: string]: TextStyle | ViewStyle } = {
          body: {
               color: isUser ? '#111' : '#F8F9FA',
               fontSize: 16,
               lineHeight: 24,
          },
          text: {
               color: isUser ? '#111' : '#F8F9FA',
               fontSize: 16,
               lineHeight: 24,
          },
          strong: {
               fontWeight: '700',
               color: isUser ? '#000' : '#FFF',
          },
          em: {
               fontStyle: 'italic',
          },
          heading1: {
               fontSize: 20,
               fontWeight: '700',
               color: isUser ? '#000' : '#FFF',
               marginVertical: 8,
          },
          heading2: {
               fontSize: 18,
               fontWeight: '600',
               color: isUser ? '#000' : '#FFF',
               marginVertical: 6,

          },
          bullet_list: {
               marginVertical: 4,
          },
          ordered_list: {
               marginVertical: 4,
          },
          list_item: {
               flexDirection: 'row',
               alignItems: 'flex-start',
               marginBottom: 4,
          },
          list_item_content: {
               flex: 1,
               color: isUser ? '#111' : '#F8F9FA',
          },
          table: {
               borderWidth: 1,
               borderColor: isUser ? '#E0E0E0' : '#374151',
               marginVertical: 8,
               borderRadius: 6,
               overflow: 'hidden',
          },
          th: {
               backgroundColor: isUser ? '#F0F0F0' : '#1F2937',
               padding: 10,
               fontWeight: '600',
               borderColor: isUser ? '#D1D5DB' : '#374151',
               borderWidth: 1,
               borderRightColor: isUser ? '#D1D5DB' : '#374151'
          },
          td: {
               padding: 10,
               borderWidth: 1,
               borderColor: isUser ? '#D1D5DB' : '#374151',
               borderRightColor: isUser ? '#D1D5DB' : '#374151',
               borderBottomColor: isUser ? '#D1D5DB' : '#374151',
          },
          code_inline: {
               backgroundColor: isUser ? '#F0F0F0' : '#1F2937',
               paddingHorizontal: 4,
               borderRadius: 3,
               fontFamily: 'monospace',
          },
          code_block: {
               backgroundColor: isUser ? '#F0F0F0' : '#1F2937',
               padding: 12,
               borderRadius: 6,
               marginVertical: 8,
               fontFamily: 'monospace',
          },
          blockquote: {
               backgroundColor: isUser ? '#F0F0F0' : '#1F2937',
               borderLeftWidth: 4,
               borderLeftColor: isUser ? '#9CA3AF' : '#4B5563',
               paddingVertical: 4,
               paddingHorizontal: 12,
               marginVertical: 8,
          },
     };

     return (
          <Animated.View
               style={[
                    styles.container,
                    isUser ? styles.userBubble : styles.otherBubble,
                    {
                         opacity: fadeAnim, transform: [{
                              translateY: fadeAnim.interpolate({
                                   inputRange: [0, 1],
                                   outputRange: [20, 0]
                              })
                         }]
                    }
               ]}
          >
               {isUser ? (
                    <Text style={styles.userText}>{cleanedMessage}</Text>
               ) : (
                    <>
                         <Markdown style={markdownStyles}>
                              {displayedText}
                         </Markdown>
                         {isTyping && showCursor && (
                              <View style={styles.cursor} />
                         )}
                    </>
               )}
               <Text style={[
                    styles.timestamp,
                    isUser ? styles.userTimestamp : styles.otherTimestamp
               ]}>
                    {timestamp}
               </Text>
          </Animated.View>
     );
};

const styles = StyleSheet.create({
     container: {
          maxWidth: '95%',
          padding: 16,
          borderRadius: 16,
          marginVertical: 8,
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
     },
     userBubble: {
          alignSelf: 'flex-end',
          backgroundColor: '#E3F2FD',
          borderBottomRightRadius: 4,
          marginRight:5
     },
     otherBubble: {
          alignSelf: 'flex-start',
          backgroundColor: '#1E293B',
          borderBottomLeftRadius: 4,
          marginLeft: 5

     },
     userText: {
          color: '#111827',
          fontSize: 16,
          lineHeight: 24,
     },
     timestamp: {
          fontSize: 11,
          marginTop: 6,
          textAlign: 'right',
          opacity: 0.7,
     },
     userTimestamp: {
          color: '#4B5563',
     },
     otherTimestamp: {
          color: '#9CA3AF',
     },
     cursor: {
          width: 8,
          height: 20,
          backgroundColor: '#F8F9FA',
          marginLeft: 4,
          opacity: 0.8,
     },
});

export default ChatBubble;