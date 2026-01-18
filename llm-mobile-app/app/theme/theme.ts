// theme.ts
export type Theme = {
  background: string;
  inputBackground: string;
  text: string;
  bubbleUser: string;
  bubbleBot: string;
  cardBackground: string;
  icon: string;
  placeholder: string; 
  iconHeader: string;
  overlayModel: string;
  profileBox: string;
  backgroundChat: string;
  backgroundHeader: string;
  borderCard: string;
  divider: string;
  otherBubble: string;
  th: string;
  button: string;
  textButton: string;
};

export const lightTheme: Theme = {
  background: '#FFFFFF',
  inputBackground: '#d9dadaff',
  text: '#000000',
  bubbleUser: '#DCF8C6',
  bubbleBot: '#ECECEC',
  cardBackground: '#ddddddff',
  icon: '#000000',
  placeholder: '#757474ff',
  iconHeader: '#007AFF',
  overlayModel: 'rgba(0,0,0,0.3)',
  profileBox: '#ffffff',
  backgroundChat: '#F5F8FA',
  backgroundHeader: '#F5F8FA',
  borderCard: '#0077cc',
  divider: '#333',
  otherBubble: '#F5F8FA',
  th: '#E0F2FE',
  button: '#000',
  textButton: '#fff',
};

export const darkTheme: Theme = {
  background: '#021526',
  inputBackground: '#0A2438',
  text: '#FFFFFF',
  bubbleUser: '#2E6F95',
  bubbleBot: '#16324F',
  cardBackground: '#0A2438',
  icon: '#c0d0e0ff',
  placeholder: '#999999',
  iconHeader: '#007AFF', 
  overlayModel: 'rgba(92, 85, 85, 0.3)',
  profileBox: '#1c1c1e',
  backgroundChat: '#021526',
  backgroundHeader: '#021526',
  borderCard: '#0D6BDE2A',
  divider: '#fff',
  otherBubble: '#1E293B',
  th: '#0d2039ff',
  button: '#03346E',
  textButton: '#fff',
};