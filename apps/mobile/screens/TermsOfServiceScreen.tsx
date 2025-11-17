import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#D4AF37';
const TEXT_DARK = '#1C1C1C';
const TEXT_MUTED = '#6A6A6A';
const CARD_BG = '#FFFFFF';

const TermsOfServiceScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By using the Chovha app, you agree to these Terms. If you do not agree, do not use the service.
          </Text>

          <Text style={styles.sectionTitle}>User Responsibilities</Text>
          <Text style={styles.paragraph}>
            You are responsible for maintaining accurate account information, complying with laws, and using the app responsibly.
          </Text>

          <Text style={styles.sectionTitle}>Payments and Fees</Text>
          <Text style={styles.paragraph}>
            Ride fares and related fees are displayed at booking or completion. Additional charges may apply based on your trip details.
          </Text>

          <Text style={styles.sectionTitle}>Prohibited Conduct</Text>
          <Text style={styles.paragraph}>
            You may not misuse the service, engage in fraudulent activity, or interfere with the safety and privacy of others.
          </Text>

          <Text style={styles.sectionTitle}>Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the fullest extent permitted by law, Chovha is not liable for indirect, incidental, or consequential damages.
          </Text>

          <Text style={styles.sectionTitle}>Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We may update these Terms from time to time. Continued use of the app indicates acceptance of the updated Terms.
          </Text>
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
  paragraph: { color: TEXT_DARK, lineHeight: 20 },
});

export default TermsOfServiceScreen;
