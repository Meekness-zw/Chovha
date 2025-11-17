import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#D4AF37';
const TEXT_DARK = '#1C1C1C';
const TEXT_MUTED = '#6A6A6A';
const CARD_BG = '#FFFFFF';

type VehicleItem = {
  make?: string;
  model?: string;
  year?: string;
  plate?: string;
  color?: string;
  driverName?: string;
  licenseNumber?: string;
  phone?: string;
};

const FleetVehiclesScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);

  useEffect(() => {
    const incoming: VehicleItem | undefined = route.params?.newVehicle;
    if (incoming) {
      setVehicles((prev) => [...prev, incoming]);
      // Clear the param to avoid duplicate adds if user comes back
      navigation.setParams?.({ newVehicle: undefined } as any);
    }
  }, [route.params?.newVehicle]);

  const renderItem = ({ item }: { item: VehicleItem }) => (
    <View style={styles.vehicleCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.vehicleTitle} numberOfLines={1}>
          {item.make || '-'} {item.model || ''} {item.year ? `• ${item.year}` : ''}
        </Text>
        <Text style={styles.vehicleMeta}>{item.plate || '--'}{item.color ? ` • ${item.color}` : ''}</Text>
        {item.driverName ? (
          <Text style={styles.vehicleMeta}>Driver: {item.driverName}</Text>
        ) : null}
      </View>
      <Ionicons name="car-outline" size={20} color={TEXT_DARK} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fleet Vehicles</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          {vehicles.length === 0 ? (
            <Text style={styles.emptyText}>No vehicles added yet.</Text>
          ) : (
            <FlatList
              data={vehicles}
              keyExtractor={(_, idx) => String(idx)}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          )}

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('FleetVehicleDetails' as never)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryText}>Add Vehicle</Text>
          </TouchableOpacity>

          <View style={{ height: 10 }} />
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: TEXT_DARK },
  card: { backgroundColor: CARD_BG, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3, flex: 1 },
  emptyText: { color: TEXT_MUTED, textAlign: 'center', marginVertical: 12 },
  vehicleCard: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#F7F7F7', borderRadius: 10 },
  vehicleTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  vehicleMeta: { fontSize: 13, color: TEXT_MUTED, marginTop: 2 },
  primaryBtn: { marginTop: 16, backgroundColor: PRIMARY, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  primaryText: { color: TEXT_DARK, fontWeight: '800' },
  
});

export default FleetVehiclesScreen;
