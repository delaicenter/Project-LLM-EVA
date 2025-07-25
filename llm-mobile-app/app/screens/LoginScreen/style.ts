import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingHorizontal: '8%',
  },
  title: { 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center', 
    color: '#fff' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#333', 
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8, 
    marginBottom: 15, 
    padding: 12 
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#121212',
    fontWeight: '600',
    fontSize: 16,
  },
  signupText: { 
    marginTop: 20, 
    textAlign: 'center', 
    color: '#ccc' 
  },
  signupLink: { 
    color: '#3b82f6', 
    fontWeight: '500' 
  },
  googleIconButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
});
