import { StyleSheet } from 'react-native';
import { Theme } from "../../theme/theme";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    paddingHorizontal: 20,
  },
  title: {
    color: theme.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.text,
  },
  changeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  changeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  changeButtonOutline: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderColor: '#6EACDA',
  borderWidth: 1.5,
  paddingVertical: 10,
  borderRadius: 8,
  marginTop: 10,
},
changeButtonTextOutline: {
  color: '#6EACDA',
  fontWeight: 'bold',
  fontSize: 16,
    },
});
