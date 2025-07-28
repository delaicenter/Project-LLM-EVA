import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type Props = {
  onSelectOption: (option: 'wisata' | 'penginapan') => void;
};

const WelcomeCard = ({ onSelectOption }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apa yang bisa saya bantu di Toba?</Text>

      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectOption('wisata')}
        >
          <Ionicons name="map" size={28} color="#0077cc" style={styles.icon} />
          <Text style={styles.cardText}>Rekomendasi Parawisata</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectOption('penginapan')}
        >
          <MaterialIcons name="hotel" size={28} color="#0077cc" style={styles.icon} />
          <Text style={styles.cardText}>Rekomendasi Penginapan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    bottom:20
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
    color:'white'
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
    borderColor: '#0D6BDE2A',
    borderWidth:1
  },
  icon: {
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FCFCFCE2',
    textAlign: 'center',
  },
});

export default WelcomeCard;
