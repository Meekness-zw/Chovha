import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#D4AF37';
const TEXT_DARK = '#1C1C1C';
const TEXT_MUTED = '#6A6A6A';
const CARD_BG = '#FFFFFF';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('Morgan Chovha');
  const [phone, setPhone] = useState('+263 77 123 4567');
  const [email, setEmail] = useState('morgan@example.com');

  const onSave = () => {
    // TODO: Hook into persistence once backend/state is ready
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={TEXT_MUTED}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Your phone"
            placeholderTextColor={TEXT_MUTED}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Your email"
            placeholderTextColor={TEXT_MUTED}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveText}>Save Changes</Text>
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

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  label: { fontSize: 13, color: TEXT_MUTED, marginTop: 8, marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: TEXT_DARK,
  },
  saveBtn: { marginTop: 16, backgroundColor: PRIMARY, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  saveText: { color: TEXT_DARK, fontWeight: '800' },
});

export default EditProfileScreen;
