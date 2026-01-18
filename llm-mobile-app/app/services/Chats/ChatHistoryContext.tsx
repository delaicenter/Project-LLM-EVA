import React, { createContext, useContext, useState } from 'react';
import { fetchAndCacheChatHistory, getCachedChatHistory } from './chatHistoryStore';

const ChatHistoryContext = createContext<any>(null);

export const ChatHistoryProvider = ({ children }: any) => {
  const [chatHistory, setChatHistory] = useState(getCachedChatHistory());

    const [loading, setLoading] = useState(false);

    const refreshChatHistory = async () => {
        setLoading(true);
        const history = await fetchAndCacheChatHistory();
        setChatHistory(history);
        setLoading(false);
    };

    const moveChatToTop = (conversationId: string) => {
      setChatHistory(prev => {
        const target = prev.find(chat => chat.id === conversationId);
        if (!target) return prev;
        const filtered = prev.filter(chat => chat.id !== conversationId);
        return [target, ...filtered];
      });
    };


  return (

    <ChatHistoryContext.Provider value={{ chatHistory, setChatHistory, refreshChatHistory, moveChatToTop }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = () => useContext(ChatHistoryContext);
