import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/type';

export function useAppNavigation() {
  return useNavigation<DrawerNavigationProp<RootStackParamList>>();
}