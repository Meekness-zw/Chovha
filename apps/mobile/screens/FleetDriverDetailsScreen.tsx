import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#D4AF37';
const TEXT_DARK = '#1C1C1C';
const TEXT_MUTED = '#6A6A6A';
const CARD_BG = '#FFFFFF';
const BUTTON_HEIGHT = 55;

const FleetDriverDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const [driverName, setDriverName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('');

  const onFinish = () => {
    (navigation as any).navigate('FleetManager');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Driver Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Driver Full Name</Text>
          <TextInput style={styles.input} value={driverName} onChangeText={setDriverName} placeholder="e.g. Alex Ndlovu" placeholderTextColor="#A9A9A9" />

          <Text style={styles.label}>License Number</Text>
          <TextInput style={styles.input} value={licenseNumber} onChangeText={setLicenseNumber} placeholder="e.g. DL123456" placeholderTextColor="#A9A9A9" autoCapitalize="characters" />

          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="e.g. +263 71 234 5678" placeholderTextColor="#A9A9A9" keyboardType="phone-pad" />

          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={onFinish}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryText}>FINISH</Text>
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

export default FleetDriverDetailsScreen;
