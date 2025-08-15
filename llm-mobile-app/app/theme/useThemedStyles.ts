import { StyleSheet } from 'react-native';
import { useTheme } from './themeContext';
import { Theme } from './theme';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  stylesFn: (theme: Theme) => T
) {
  const { theme } = useTheme();
  return StyleSheet.create(stylesFn(theme));
}
