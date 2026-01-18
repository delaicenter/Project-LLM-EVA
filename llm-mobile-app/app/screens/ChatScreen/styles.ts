import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#021526',
     },
     keyboardAvoidingView: {
          flex: 1,
     },
     contentContainer: {
          flex: 1,
          justifyContent: 'space-between',
     },
     chatContainer: {
          flex: 1,
     },
     chatContentContainer: {
          paddingHorizontal: 16,
          paddingTop: 16,
     },
     emptyChatContentContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
     },
     inputWrapper: {
          paddingHorizontal: 16,
          paddingBottom: 50,
     },
     authContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
     },
});
