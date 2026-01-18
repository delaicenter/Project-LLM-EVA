import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Chat: { 
    conversationId?: string;
    title?: string;
  };
  ChangePassword: undefined;
};

export type MainDrawerParamList = {
  Main: NavigatorScreenParams<RootStackParamList>;
};

export type ChatScreenNavigationProp = StackScreenProps<RootStackParamList, 'Chat'>['navigation'];
export type ChatScreenRouteProp = StackScreenProps<RootStackParamList, 'Chat'>['route'];

export interface ChatScreenProps {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}