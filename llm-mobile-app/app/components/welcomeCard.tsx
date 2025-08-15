import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useThemedStyles } from "../theme/useThemedStyles";
import { useTheme } from "../theme/themeContext";

type Props = {
  onSelectOption: (option: 'wisata' | 'penginapan') => void;
};

const themedStyles = (theme: any) =>
  StyleSheet.create({
      container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      top:100
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 30,
      textAlign: 'center',
      color: theme.text
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
    },
    card: {
      flex: 1,
      paddingVertical: 20,
      borderRadius: 12,
      alignItems: 'center',
      borderColor: theme.borderCard,
      borderWidth: 1
    },
    icon: {
      marginBottom: 8,
      color: '#0077cc' 
    },
    cardText: {
      fontSize: 16,
      color: theme.text,
      textAlign: 'center',
    },
  }); 

const WelcomeCard = ({ onSelectOption }: Props) => {
  const styles = useThemedStyles(themedStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apa yang bisa saya bantu?</Text>

      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectOption('wisata')}
        >
          <Ionicons name="map" size={28} style={styles.icon} />
          <Text style={styles.cardText}>Rekomendasi Parawisata</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectOption('penginapan')}
        >
          <MaterialIcons name="hotel" size={28} style={styles.icon} />
          <Text style={styles.cardText}>Rekomendasi Penginapan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeCard;
