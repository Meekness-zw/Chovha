import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const TripsScreen: React.FC = () => {
  const navigation = useNavigation();
  const trips = [
    { id: '1', from: 'Home', to: 'Work', date: 'Nov 11, 10:24', price: 'US$4.80' },
    { id: '2', from: 'City Center', to: 'Airport', date: 'Nov 8, 18:05', price: 'US$14.00' },
    { id: '3', from: 'Avondale', to: 'Borrowdale', date: 'Nov 2, 08:15', price: 'US$6.10' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trips</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.brandWrap}>
          <Image source={require('../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Recent Trips</Text>

        {trips.map(t => (
          <View key={t.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.place}>{t.from}</Text>
              <Text style={styles.price}>{t.price}</Text>
            </View>
            <Text style={styles.to}>→ {t.to}</Text>
            <Text style={styles.date}>{t.date}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const TEXT_DARK = '#1C1C1C';
const TEXT_MUTED = '#6A6A6A';
const CARD_BG = '#FFFFFF';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
  scroll: { padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: TEXT_DARK },
  brandWrap: { alignItems: 'center', marginBottom: 10 },
  logo: { width: 110, height: 60 },
  title: { fontSize: 18, fontWeight: '800', color: TEXT_DARK, marginVertical: 10 },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  place: { fontSize: 16, fontWeight: '800', color: TEXT_DARK },
  to: { fontSize: 15, color: TEXT_DARK, marginTop: 4 },
  date: { fontSize: 12, color: TEXT_MUTED, marginTop: 8 },
  price: { fontSize: 15, fontWeight: '800', color: TEXT_DARK },
});

export default TripsScreen;
