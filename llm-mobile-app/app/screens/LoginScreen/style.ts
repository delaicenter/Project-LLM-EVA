import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#021526',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },

  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#E2E2B6',
  },
  input: {
    backgroundColor: '#FFFFFF0C',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderColor: '#03346E',
    color: '#ffffff',
  },
  loginButton: {
    backgroundColor: '#03346E',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#E2E2B6',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  signupText: {
    textAlign: 'center',
    color: '#444',
    marginTop: 20,
  },
  signupLink: {
    color: '#03346E',
    fontWeight: 'bold',
  },
  googleIconButton: {
    alignSelf: 'center',
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 50,
    elevation: 3,
  },
});
