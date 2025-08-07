import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Easing,
} from 'react-native';
import { removeThinkTags } from '../utils/chat';
import * as Clipboard from 'expo-clipboard';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';


type ChatBubbleProps = {
  message: string;
  isUser: boolean;
  timestamp: string;
  isTyping?: boolean;
  onTypingDone?: () => void;
};

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/^###\s?/gm, '')          // Remove ### heading
    .replace(/^##\s?/gm, '')           // Remove ## heading
    .replace(/^#\s?/gm, '')            // Remove # heading
    .replace(/\*\*(.*?)\*\*/g, '$1')   // Bold
    .replace(/\*(.*?)\*/g, '$1')       // Italic
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')   // Remove images
    .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1') // Links
    .replace(/^- /gm, '')              // List dashes
    .replace(/\n{2,}/g, '\n')          // Extra newlines
    .trim();
}


const ChatBubble = ({
  message,
  isUser,
  timestamp,
  isTyping = false,
  onTypingDone,
}: ChatBubbleProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const textBufferRef = useRef('');
  const currentIndexRef = useRef(0);

  const cleanedMessage = useMemo(
    () => (isUser ? message : removeThinkTags(message)),
    [isUser, message]
  );

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
      textBufferRef.current = '';
      currentIndexRef.current = 0;
      setDisplayedText('');

      typingIntervalRef.current = setInterval(() => {
        const nextIndex = currentIndexRef.current;
        if (nextIndex < cleanedMessage.length) {
          textBufferRef.current += cleanedMessage[nextIndex];
          currentIndexRef.current += 1;
          setDisplayedText(textBufferRef.current);
        } else {
          clearInterval(typingIntervalRef.current!);
          typingIntervalRef.current = null;
          setShowCursor(false);
          onTypingDone?.();
        }
      }, 16); 

      return () => {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      };
    } else {
      setDisplayedText(cleanedMessage);
      setShowCursor(false);
    }
  }, [cleanedMessage, isTyping, isUser]);

  useEffect(() => {
    if (isTyping && !isUser) {
      cursorIntervalRef.current = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);

      return () => {
        if (cursorIntervalRef.current) {
          clearInterval(cursorIntervalRef.current);
        }
      };
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
      borderRightColor: isUser ? '#D1D5DB' : '#374151',
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
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      {isUser ? (
        <Text style={styles.userText}>{cleanedMessage}</Text>
      ) : 
(
  <>
     <View>
     <Markdown style={markdownStyles}>{displayedText}</Markdown>

     {isTyping && showCursor && <View style={styles.cursor} />}
     </View>
  </>
)}
     <View style={styles.footerRow}>
     <Text
     style={[
          styles.timestamp,
          isUser ? styles.userTimestamp : styles.otherTimestamp,
     ]}
     >
     {timestamp}
     </Text>

     {!isUser && (
     <TouchableOpacity
          style={styles.copyButton}
          onPress={() => Clipboard.setStringAsync(stripMarkdown(displayedText))}
     >
          <Feather name="copy" size={14} color="#9CA3AF" />
     </TouchableOpacity>
     )}
     </View>
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
    marginRight: 5,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 4,
    marginLeft: 5,
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
     footerRow: {
     flexDirection: 'row',
     justifyContent: 'flex-end',
     alignItems: 'center',
     marginTop: 6,
     gap: 6, // atau gunakan `marginLeft` jika gap tidak didukung
     },

     copyButton: {
     padding: 4,
     },

});

export default ChatBubble;
