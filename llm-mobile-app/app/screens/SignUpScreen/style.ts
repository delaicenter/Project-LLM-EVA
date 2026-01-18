import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#021526' },
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
  signUpButton: {
    backgroundColor: '#03346E',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#E2E2B6',
    fontWeight: '600',
    fontSize: 16,
  },
});
