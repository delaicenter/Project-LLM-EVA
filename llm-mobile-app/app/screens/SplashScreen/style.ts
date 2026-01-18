import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#021526',
          justifyContent: 'center',
          alignItems: 'center',
     },
     logo: {
          width: width * 0.45,
          height: width * 0.45,
          borderRadius:25
     },
})