import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.brandWrap}>
          <Image source={require('../assets/Logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MC</Text>
          </View>
          <Text style={styles.name}>Morgan Chovha</Text>
          <Text style={styles.muted}>+263 77 123 4567</Text>
          <Text style={styles.muted}>morgan@example.com</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('EditProfile' as never)}>
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
};

const PRIMARY = '#D4AF37';
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
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  avatar: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: '#FFF4D1', alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: TEXT_DARK },
  name: { fontSize: 20, fontWeight: '800', color: TEXT_DARK, marginTop: 4 },
  muted: { fontSize: 14, color: TEXT_MUTED, marginTop: 4 },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 8 },
  actionBtn: { flex: 1, backgroundColor: PRIMARY, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  actionBtnOutline: { flex: 1, backgroundColor: '#EFEFEF', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  actionText: { color: TEXT_DARK, fontWeight: '800' },
  actionTextDark: { color: TEXT_DARK, fontWeight: '800' },
  section: { backgroundColor: CARD_BG, borderRadius: 16, padding: 16, marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: TEXT_DARK, marginBottom: 10 },
  row: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EFEFEF' },
  rowText: { fontSize: 15, color: TEXT_DARK },
});

export default ProfileScreen;
