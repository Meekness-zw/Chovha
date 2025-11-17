import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App'; // Adjust path as needed
import * as Location from 'expo-location';

type SearchDestinationScreenProps = NativeStackScreenProps<RootStackParamList, 'SearchDestination'>;

const PRIMARY_COLOR = '#D4AF37';
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BG_COLOR = '#F5F5F5';

// --- Placeholder Data for Suggestions ---
const SUGGESTED_LOCATIONS = [
  { id: '1', type: 'home', name: 'Home', address: '123 Main St, Harare', icon: 'home-outline' },
  { id: '2', type: 'work', name: 'Work', address: 'CBD Office Park, 4th Floor', icon: 'briefcase-outline' },
  { id: '3', type: 'recent', name: 'Borrowdale Sam Levy', address: 'Sam Levy Village, Harare', icon: 'time-outline' },
  { id: '4', type: 'recent', name: 'Avondale Shops', address: 'Avondale Shopping Centre, Harare', icon: 'time-outline' },
];
// ----------------------------------------

const SearchDestinationScreen = ({ navigation, route }: SearchDestinationScreenProps) => {
  const [pickupLocation, setPickupLocation] = useState('Current Location');
  const [destination, setDestination] = useState('');
  const [focusedField, setFocusedField] = useState<'pickup' | 'destination'>('destination');
  const [suggestions, setSuggestions] = useState<any[]>(SUGGESTED_LOCATIONS);
  const [loading, setLoading] = useState(false);
  const [pickupCoord, setPickupCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destCoord, setDestCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [apiDistanceMeters, setApiDistanceMeters] = useState<number | null>(null);
  const [apiDurationText, setApiDurationText] = useState<string | null>(null);
  const [apiDurationSeconds, setApiDurationSeconds] = useState<number | null>(null);
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [offerUsd, setOfferUsd] = useState<string>('');
  const [offerTouched, setOfferTouched] = useState<boolean>(false);

  const queryPlaces = async (text: string) => {
    try {
      if (!apiKey || !text || text.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${encodeURIComponent(text)}&components=country:zw`;
      const res = await fetch(url);
      const json = await res.json();
      if (json?.predictions) {
        setSuggestions(json.predictions.map((p: any) => ({ id: p.place_id, description: p.description, place_id: p.place_id })));
      } else {
        setSuggestions([]);
      }
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const coordsToAddress = async (lat: number, lon: number): Promise<string> => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      if (results && results.length > 0) {
        const r = results[0] as any;
        const parts = [
          r.name || r.street || r.streetName,
          r.city || r.subregion,
          r.region,
          r.country,
        ].filter(Boolean);
        const joined = parts.join(', ');
        return joined || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
      }
    } catch {}
    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  };

  useEffect(() => {
    // Restore existing values if provided (to avoid resetting when switching focus or returning from map)
    if (route?.params?.existingPickupLocation) {
      setPickupLocation(route.params.existingPickupLocation);
    }
    if (route?.params?.existingPickupCoord) {
      setPickupCoord(route.params.existingPickupCoord as any);
    }
    if (route?.params?.existingDestination) {
      setDestination(route.params.existingDestination);
    }
    if (route?.params?.existingDestCoord) {
      setDestCoord(route.params.existingDestCoord as any);
    }
    if (route?.params?.selectedFromMap) {
      const d = route.params.selectedFromMap;
      (async () => {
        const desc = d.description || await coordsToAddress(d.latitude, d.longitude);
        if (route.params.focus === 'pickup') {
          setPickupLocation(desc);
          setFocusedField('pickup');
          setPickupCoord({ latitude: d.latitude, longitude: d.longitude });
        } else {
          setDestination(desc);
          setFocusedField('destination');
          setDestCoord({ latitude: d.latitude, longitude: d.longitude });
        }
      })();
    }
    if (route?.params?.focus) {
      setFocusedField(route.params.focus);
    }
  }, [route?.params?.selectedFromMap, route?.params?.focus]);

  const renderSeparator = () => <View style={styles.separator} />;

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      if (!apiKey || !placeId) return null;
      const url = `https://maps.googleapis.com/maps/api/place/details/json?key=${apiKey}&place_id=${placeId}&fields=geometry/location,formatted_address`;
      const res = await fetch(url);
      const json = await res.json();
      const loc = json?.result?.geometry?.location;
      const addr = json?.result?.formatted_address;
      if (loc) return { latitude: loc.lat, longitude: loc.lng, address: addr };
    } catch {}
    return null;
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={async () => {
        if (item.place_id) {
          const details = await fetchPlaceDetails(item.place_id);
          if (details) {
            if (focusedField === 'pickup') {
              setPickupLocation(details.address || item.description || item.name);
              setPickupCoord({ latitude: details.latitude, longitude: details.longitude });
            } else {
              setDestination(details.address || item.description || item.name);
              setDestCoord({ latitude: details.latitude, longitude: details.longitude });
            }
            return;
          }
        }
        // Fallback: set text only
        if (focusedField === 'pickup') {
          setPickupLocation(item.description || item.name);
          setPickupCoord(null);
        } else {
          setDestination(item.description || item.name);
          setDestCoord(null);
        }
      }}
    >
      <View style={styles.iconCircle}>
        <Ionicons name="location-outline" size={20} color={TEXT_COLOR_DARK} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.suggestionName}>{item.description || item.name}</Text>
        {item.address ? <Text style={styles.suggestionAddress}>{item.address}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  const haversineKm = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  const distanceKm = pickupCoord && destCoord ? haversineKm(pickupCoord, destCoord) : null;
  const effectiveKm = apiDistanceMeters != null ? apiDistanceMeters / 1000 : distanceKm;
  const durationMinutes = apiDurationSeconds != null ? apiDurationSeconds / 60 : null;
  const baseFare = 1.5; // Harare starter
  const perKm = 0.6;
  const perMinute = 0.1;
  const minFare = 2.5;
  const surge = 1.0;
  const fareUsd = effectiveKm != null && durationMinutes != null
    ? Math.max(minFare, (baseFare + effectiveKm * perKm + durationMinutes * perMinute) * surge)
    : (effectiveKm != null
        ? Math.max(minFare, (baseFare + effectiveKm * perKm) * surge)
        : null);

  const fareSuggested = fareUsd != null
    ? (fareUsd >= 2.5 && fareUsd < 3 ? 2.5 : Math.round(fareUsd))
    : null;

  useEffect(() => {
    if (!offerTouched) {
      setOfferUsd(
        fareSuggested != null
          ? (fareSuggested === 2.5 ? '2.50' : String(fareSuggested))
          : ''
      );
    }
  }, [fareSuggested, offerTouched]);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        if (!apiKey || !pickupCoord || !destCoord) {
          setApiDistanceMeters(null);
          setApiDurationText(null);
          return;
        }
        const origin = `${pickupCoord.latitude},${pickupCoord.longitude}`;
        const destination = `${destCoord.latitude},${destCoord.longitude}`;
        const url = `https://maps.googleapis.com/maps/api/directions/json?key=${apiKey}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving`;
        const res = await fetch(url);
        const json = await res.json();
        const leg = json?.routes?.[0]?.legs?.[0];
        if (leg?.distance?.value) {
          setApiDistanceMeters(leg.distance.value);
          setApiDurationText(leg.duration?.text || null);
          setApiDurationSeconds(typeof leg?.duration?.value === 'number' ? leg.duration.value : null);
        } else {
          setApiDistanceMeters(null);
          setApiDurationText(null);
          setApiDurationSeconds(null);
        }
      } catch {
        setApiDistanceMeters(null);
        setApiDurationText(null);
        setApiDurationSeconds(null);
      }
    };
    fetchDirections();
  }, [pickupCoord?.latitude, pickupCoord?.longitude, destCoord?.latitude, destCoord?.longitude, apiKey]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
        {/* Header and Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('Home', {
              existingPickupLocation: pickupLocation,
              existingPickupCoord: pickupCoord,
              existingDestination: destination,
              existingDestCoord: destCoord,
            })}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={TEXT_COLOR_DARK} /> 
          </TouchableOpacity>
        </View>

        {/* Pickup and Destination Inputs */}
        <View style={styles.inputSection}>
          
          {/* Pickup Input (FROM) */}
          <View style={styles.locationInputRow}>
            <View style={[styles.dot, styles.dotPrimary]} />
            <TextInput
              style={styles.locationInput}
              placeholder="Current Location"
              placeholderTextColor={TEXT_COLOR_DARK}
              value={pickupLocation}
              onChangeText={(t) => { setPickupLocation(t); setFocusedField('pickup'); queryPlaces(t); }}
              onFocus={() => setFocusedField('pickup')}
            />
          </View>
          
          {/* Connection Line */}
          <View style={styles.verticalLine} />

          {/* Destination Input (TO) */}
          <View style={styles.locationInputRow}>
            <View style={[styles.dot, styles.dotSecondary]} />
            <TextInput
              style={styles.locationInput}
              placeholder="Where to?"
              placeholderTextColor={TEXT_COLOR_GREY}
              value={destination}
              onChangeText={(t) => { setDestination(t); setFocusedField('destination'); queryPlaces(t); }}
              onFocus={() => setFocusedField('destination')}
              autoFocus={true}
            />
            <TouchableOpacity style={styles.mapPinButton} onPress={() => navigation.navigate('Home', {
                selectingOnMap: true,
                target: focusedField,
                existingPickupLocation: pickupLocation,
                existingPickupCoord: pickupCoord,
                existingDestination: destination,
                existingDestCoord: destCoord,
              })}
            >
                <MaterialCommunityIcons name="map-marker-outline" size={24} color={TEXT_COLOR_DARK} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions above suggestions */}
        <View style={styles.actionRow}>
          {focusedField === 'pickup' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={async () => {
                try {
                  const { status } = await Location.requestForegroundPermissionsAsync();
                  if (status !== 'granted') return;
                  const loc = await Location.getCurrentPositionAsync({});
                  const lat = loc.coords.latitude;
                  const lon = loc.coords.longitude;
                  const label = await coordsToAddress(lat, lon);
                  setPickupLocation(label);
                  setPickupCoord({ latitude: lat, longitude: lon });
                } catch {}
              }}
            >
              <MaterialCommunityIcons name="crosshairs-gps" size={18} color={PRIMARY_COLOR} />
              <Text style={styles.actionText}>Use current location</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Home', {
              selectingOnMap: true,
              target: focusedField,
              existingPickupLocation: pickupLocation,
              existingPickupCoord: pickupCoord,
              existingDestination: destination,
              existingDestCoord: destCoord,
            })}
          >
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={PRIMARY_COLOR} />
            <Text style={styles.actionText}>Select on map</Text>
          </TouchableOpacity>
        </View>

        {/* Suggestions list */}
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => String(item.id || index)}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />

        {/* Fare and action footer */}
        <View style={styles.footerBar}>
          <View style={styles.fareBox}>
            <Text style={styles.fareLabel}>Fare</Text>
            <TextInput
              style={styles.fareValue}
              value={offerUsd}
              onChangeText={(t) => { setOfferUsd(t); setOfferTouched(true); }}
              keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
              placeholder={
                fareSuggested != null
                  ? `$${fareSuggested === 2.5 ? '2.50' : String(fareSuggested)}`
                  : '--'
              }
              placeholderTextColor={TEXT_COLOR_GREY}
            />
            {fareSuggested != null ? (
              <Text style={styles.suggestionAddress}>{`Suggested $${fareSuggested === 2.5 ? '2.50' : String(fareSuggested)}`}</Text>
            ) : null}
          </View>
          <View style={styles.distanceBox}>
            <Text style={styles.fareLabel}>Distance</Text>
            <Text style={styles.fareValue}>{effectiveKm != null ? `${effectiveKm.toFixed(1)} km` : '--'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.findRideBtn, { opacity: pickupCoord && destCoord ? 1 : 0.5 }]}
            disabled={!(pickupCoord && destCoord)}
            onPress={() => {
              const parsed = parseFloat(String(offerUsd).replace(/[^0-9.]/g, ''));
              if (!isNaN(parsed)) {
                let normalized = parsed >= 2.5 && parsed < 3 ? 2.5 : Math.round(parsed);
                if (normalized < 2.5) normalized = 2.5;
                setOfferUsd(normalized === 2.5 ? '2.50' : String(normalized));
              }
              const parsed2 = parseFloat(String(offerUsd).replace(/[^0-9.]/g, ''));
              const fare = !isNaN(parsed2) ? (parsed2 >= 2.5 && parsed2 < 3 ? 2.5 : Math.round(Math.max(2.5, parsed2))) : undefined;
              navigation.navigate('Home', {
                showOffers: true,
                fareOffer: fare,
                existingPickupLocation: pickupLocation,
                existingPickupCoord: pickupCoord,
                existingDestination: destination,
                existingDestCoord: destCoord,
              } as any);
            }}
          >
            <Text style={styles.findRideText}>FIND RIDE</Text>
          </TouchableOpacity>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 20 },
  headerContainer: { height: 60, justifyContent: 'center', marginBottom: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  
  inputSection: { 
    paddingBottom: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EFEFEF',
    marginBottom: 8,
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  dotPrimary: { 
    backgroundColor: TEXT_COLOR_DARK, 
  },
  dotSecondary: {
    backgroundColor: PRIMARY_COLOR,
  },
  verticalLine: {
    height: 25,
    width: 2,
    backgroundColor: TEXT_COLOR_GREY,
    marginLeft: 4,
    opacity: 0.3,
  },
  locationInput: {
    flex: 1,
    height: 50,
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 3 },
      android: { elevation: 1 },
    })
  },
  mapPinButton: {
    padding: 8,
    marginLeft: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  
  // Suggestions List Styles
  listContent: {
    paddingVertical: 6,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: INPUT_BG_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
  },
  suggestionAddress: {
    fontSize: 13,
    color: TEXT_COLOR_GREY,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginLeft: 55, // Align with text content
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 3 },
      android: { elevation: 1 },
    })
  },
  actionText: {
    marginLeft: 8,
    color: TEXT_COLOR_DARK,
    fontSize: 14,
    fontWeight: '700',
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  fareBox: {
    minWidth: 90,
    backgroundColor: '#FFF6E5',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE3A3',
  },
  distanceBox: {
    minWidth: 110,
    backgroundColor: '#F3F7FF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E4FF',
  },
  fareLabel: {
    fontSize: 12,
    color: TEXT_COLOR_GREY,
    marginBottom: 2,
    fontWeight: '600',
  },
  fareValue: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_COLOR_DARK,
  },
  findRideBtn: {
    marginLeft: 'auto',
    backgroundColor: PRIMARY_COLOR,
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 4 },
      android: { elevation: 2 },
    })
  },
  findRideText: {
    color: TEXT_COLOR_DARK,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default SearchDestinationScreen;