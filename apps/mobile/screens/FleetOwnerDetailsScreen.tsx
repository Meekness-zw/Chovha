import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#D4AF37';
const TEXT_DARK = '#1C1C1C';
const TEXT_MUTED = '#6A6A6A';
const CARD_BG = '#FFFFFF';
const BUTTON_HEIGHT = 55;

const FleetOwnerDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [ownerName, setOwnerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fleet Owner Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Owner Full Name</Text>
          <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName} placeholder="e.g. Morgan Chovha" placeholderTextColor="#A9A9A9" />

          <Text style={styles.label}>Company Name (optional)</Text>
          <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="e.g. Chovha Logistics" placeholderTextColor="#A9A9A9" />

          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="e.g. +263 77 123 4567" placeholderTextColor="#A9A9A9" keyboardType="phone-pad" />

          <Text style={styles.label}>Email (optional)</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="e.g. owner@example.com" placeholderTextColor="#A9A9A9" autoCapitalize="none" keyboardType="email-address" />

          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('FleetVehicles' as never)}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryText}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: TEXT_DARK },
  card: { backgroundColor: CARD_BG, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  label: { fontSize: 16, color: TEXT_DARK, marginTop: 12, marginBottom: 8, fontWeight: '600' },
  input: { height: 50, backgroundColor: '#F5F5F5', borderRadius: 8, paddingHorizontal: 15, color: TEXT_DARK, fontSize: 16 },
  bottomSection: { paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 10 : 0 },
  primaryBtn: { height: BUTTON_HEIGHT, backgroundColor: PRIMARY, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: TEXT_DARK, fontWeight: '700', letterSpacing: 1 },
});

export default FleetOwnerDetailsScreen;
