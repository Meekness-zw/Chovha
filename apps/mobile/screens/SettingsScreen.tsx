import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.brandWrap}>
          <Image source={require('../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}> 
            <Text style={styles.rowTitle}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
          <View style={styles.divider} />
          <View style={styles.rowBetween}> 
            <Text style={styles.rowTitle}>Notifications</Text>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('PrivacyPolicy' as never)}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('TermsOfService' as never)}>
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('HelpSupport' as never)}>
            <Text style={styles.linkText}>Help & Support</Text>
          </TouchableOpacity>
        </View>
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
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rowTitle: { fontSize: 16, fontWeight: '800', color: TEXT_DARK },
  divider: { height: 1, backgroundColor: '#EFEFEF' },
  section: { backgroundColor: CARD_BG, borderRadius: 16, marginTop: 16, overflow: 'hidden' },
  linkRow: { paddingVertical: 14, paddingHorizontal: 16 },
  linkText: { fontSize: 15, color: TEXT_DARK },
});

export default SettingsScreen;
