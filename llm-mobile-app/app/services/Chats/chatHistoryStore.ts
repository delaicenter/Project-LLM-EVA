import { chatService } from './chats.service';

let chatHistoryCache: any[] = [];
let hasFetchedOnce = false;

export const fetchAndCacheChatHistory = async () => {
  const history = await chatService.getChatHistory(); 
  chatHistoryCache = history;
  hasFetchedOnce = true;
  return history;
};


export const getCachedChatHistory = () => chatHistoryCache;
export const chatHistoryIsCached = () => hasFetchedOnce;
