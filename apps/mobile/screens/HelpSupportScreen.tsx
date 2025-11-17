import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#D4AF37';
const TEXT_DARK = '#1C1C1C';
const TEXT_MUTED = '#6A6A6A';
const CARD_BG = '#FFFFFF';

const HelpSupportScreen: React.FC = () => {
  const navigation = useNavigation();

  const emailSupport = () => {
    Linking.openURL('mailto:support@chovha.app?subject=Support%20Request');
  };

  const callSupport = () => {
    Linking.openURL('tel:+263771234567');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>FAQs</Text>
          <Text style={styles.paragraph}>
            - How do I book a ride? Open the app, set your pickup and destination, then confirm your ride.
          </Text>
          <Text style={styles.paragraph}>
            - How do I contact my driver? After booking, you can call or message your driver from the trip screen.
          </Text>
          <Text style={styles.paragraph}>
            - I have a payment issue. Please contact support with your trip details for quick assistance.
          </Text>

          <Text style={styles.sectionTitle}>Contact Support</Text>
          <TouchableOpacity style={styles.button} onPress={emailSupport}>
            <Text style={styles.buttonText}>Email Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOutline} onPress={callSupport}>
            <Text style={styles.buttonTextDark}>Call Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
  scroll: { padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: TEXT_DARK },
  card: { backgroundColor: CARD_BG, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: TEXT_DARK, marginTop: 10, marginBottom: 6 },
  paragraph: { color: TEXT_DARK, lineHeight: 20, marginBottom: 6 },
  button: { marginTop: 10, backgroundColor: PRIMARY, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonOutline: { marginTop: 10, backgroundColor: '#EFEFEF', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: TEXT_DARK, fontWeight: '800' },
  buttonTextDark: { color: TEXT_DARK, fontWeight: '800' },
});

export default HelpSupportScreen;
