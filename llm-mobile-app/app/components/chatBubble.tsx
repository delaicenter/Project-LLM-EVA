import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { removeThinkTags } from '../utils/chat';
import * as Clipboard from 'expo-clipboard';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { useThemedStyles } from "../theme/useThemedStyles";
import { useTheme } from "../theme/themeContext"

const COLUMN_WIDTH = 160;

const themedStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      maxWidth: '95%',
      padding: 16,
      borderRadius: 16,
      marginVertical: 8,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 1 },
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
      backgroundColor: theme.otherModal,
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
    userTimestamp: { color: '#4B5563' },
    otherTimestamp: { color: '#9CA3AF' },
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
      gap: 6,
    },
    copyButton: { padding: 4 },
  });

type ChatBubbleProps = {
  message: string;
  isUser: boolean;
  timestamp: string;
  isTyping?: boolean;
  isStopped?: boolean;
  onTypingDone?: () => void;
};

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/^###\s?/gm, '')
    .replace(/^##\s?/gm, '')
    .replace(/^#\s?/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1')
    .replace(/^- /gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

const ChatBubble = ({
  message,
  isUser,
  timestamp,
  isStopped = false,
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
  const styles = useThemedStyles(themedStyles);

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
  }, [fadeAnim]);

  useEffect(() => {
    if (isTyping && !isUser) {
      textBufferRef.current = '';
      currentIndexRef.current = 0;
      setDisplayedText('');

      typingIntervalRef.current = setInterval(() => {
        if (isStopped) {
          clearInterval(typingIntervalRef.current!);
          typingIntervalRef.current = null;
          setShowCursor(false);
          return;
        }

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
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      };
    } else {
      if (!isStopped) setDisplayedText(cleanedMessage);
      setShowCursor(false);
    }
  }, [cleanedMessage, isTyping, isUser, isStopped, onTypingDone]);

  useEffect(() => {
    if (isTyping && !isUser) {
      cursorIntervalRef.current = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);

      return () => {
        if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);
      };
    }
  }, [isTyping, isUser]);

  const { theme } = useTheme();

  const markdownStyles: { [key: string]: TextStyle | ViewStyle } = {
    body: { color: theme.text, fontSize: 16, lineHeight: 24 },
    text: { color: theme.text, fontSize: 16, lineHeight: 24 },
    strong: { fontWeight: '700', color: theme.text },
    em: { fontStyle: 'italic' },
    heading1: { fontSize: 20, fontWeight: '700', color: theme.text, marginVertical: 8 },
    heading2: { fontSize: 18, fontWeight: '600', color: theme.text, marginVertical: 6 },
    bullet_list: { marginVertical: 4 },
    ordered_list: { marginVertical: 4 },
    list_item: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
    list_item_content: { flex: 1, color: theme.text },

    table: {
      borderWidth: 1,
      borderColor: '#b7b7b7ff',
      marginVertical: 8,
      borderRadius: 6,
      overflow: 'hidden',
      width: 'auto', 
    },
    th: {
      backgroundColor: theme.th,
      padding: 10,
      fontWeight: '600',
      borderColor: '#b7b7b7ff',
      borderWidth: 1,
      borderRightColor: '#374151',
    },
    td: {
      padding: 10,
      borderWidth: 1,
      borderColor: '#b7b7b7ff',
      borderRightColor: '#374151',
      borderBottomWidth: 0,
    },
    code_inline: {
      backgroundColor: '#1F2937',
      paddingHorizontal: 4,
      borderRadius: 3,
      fontFamily: 'monospace',
    },
    code_block: {
      backgroundColor: '#1F2937',
      padding: 12,
      borderRadius: 6,
      marginVertical: 8,
      fontFamily: 'monospace',
    },
    blockquote: {
      backgroundColor: '#1F2937',
      borderLeftWidth: 4,
      borderLeftColor: '#4B5563',
      paddingVertical: 4,
      paddingHorizontal: 12,
      marginVertical: 8,
    },
  };

  const markdownRules = useMemo(
    () => ({
      table: (node: any, children: any) => (
        <ScrollView
          key={node.key} 
          horizontal
          nestedScrollEnabled
          collapsable={false}
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 8 }}
          contentContainerStyle={{ paddingHorizontal: 2 }}
        >
          <View style={markdownStyles.table}>{children}</View>
        </ScrollView>
      ),
      thead: (node: any, children: any) => (
        <View key={node.key} style={{ flexDirection: 'column' }}>
          {children}
        </View>
      ),
      tbody: (node: any, children: any) => (
        <View key={node.key} style={{ flexDirection: 'column' }}>
          {children}
        </View>
      ),
      tr: (node: any, children: any) => (
        <View key={node.key} style={{ flexDirection: 'row', alignItems: 'stretch' }}>
          {children}
        </View>
      ),
      th: (node: any, children: any) => (
        <View
          key={node.key}
          style={[markdownStyles.th as any, { width: COLUMN_WIDTH, alignItems: 'flex-start' }]}
        >
          <View style={{ flexShrink: 1 }}>{children}</View>
        </View>
      ),
      td: (node: any, children: any) => (
        <View
          key={node.key}
          style={[markdownStyles.td as any, { width: COLUMN_WIDTH, alignItems: 'flex-start' }]}
        >
          <View style={{ flexShrink: 1 }}>{children}</View>
        </View>
      ),
      hr: (node: any) => (
      <View key={node.key} style={{ height: 0, marginVertical: 0 }} />
    ),
    }),
    
    [markdownStyles]
  );

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
      ) : (
        <>
          <View>
            <Markdown style={markdownStyles} rules={markdownRules}>
              {displayedText}
            </Markdown>
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

export default ChatBubble;
