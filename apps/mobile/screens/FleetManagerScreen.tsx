import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const TEXT_DARK = '#1C1C1C';
const TEXT_MUTED = '#6A6A6A';
const PRIMARY = '#D4AF37';

const FleetManagerScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>

        <Text style={styles.title}>Manage a Fleet</Text>
        <Text style={styles.subtitle}>Set up your fleet, add drivers and vehicles, and manage operations in one place.</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('FleetOwnerDetails' as never)}>
          <Text style={styles.primaryText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: TEXT_DARK, marginTop: 10 },
  subtitle: { fontSize: 15, color: TEXT_MUTED, marginTop: 8 },
  primaryBtn: { marginTop: 24, backgroundColor: PRIMARY, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  primaryText: { color: TEXT_DARK, fontWeight: '800' },
});

export default FleetManagerScreen;
