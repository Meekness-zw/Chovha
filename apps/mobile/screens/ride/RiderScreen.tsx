import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Platform, Animated, Pressable, Image, TextInput } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';

type RideScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>; 

const PRIMARY_COLOR = '#D4AF37';
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BG_COLOR = '#F5F5F5';
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Map renders full screen behind overlays

const RideScreen = ({ navigation, route }: RideScreenProps) => {
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState({
    latitude: -17.8277,
    longitude: 31.0534,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerWidth = Math.min(Dimensions.get('window').width * 0.75, 360);
  const drawerAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [selectingLocation, setSelectingLocation] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showOffers, setShowOffers] = useState<boolean>(!!route?.params?.showOffers);

  const handleDestinationPress = () => {
    navigation.navigate('SearchDestination', {
      focus: 'destination',
      existingPickupLocation: (route?.params as any)?.existingPickupLocation,
      existingPickupCoord: (route?.params as any)?.existingPickupCoord,
      existingDestination: (route?.params as any)?.existingDestination,
      existingDestCoord: (route?.params as any)?.existingDestCoord,
    }); 
  };
  
  const handleMenuPress = async () => {
    console.log('[RiderScreen] Hamburger pressed. Current menuOpen =', menuOpen);
    const opening = !menuOpen;
    if (opening) {
      try {
        const Haptics = await import('expo-haptics');
        await Haptics.selectionAsync();
      } catch {}
    }
    if (opening) {
      setDrawerVisible(true);
    }
    setMenuOpen(opening);
    console.log('[RiderScreen] menuOpen set to', opening);
  };

  const handleGetCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const loc = await Location.getCurrentPositionAsync({});
    const next = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(next);
    // Animate camera to the user's current location without locking gestures
    mapRef.current?.animateToRegion(next, 500);
  };

  const handleToggleSelectOnMap = () => {
    setSelectingLocation((v) => !v);
  };

  const handleMapPress = (e: any) => {
    if (!selectingLocation) return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedCoord({ latitude, longitude });
  };

  // Animate drawer when menuOpen changes
  useEffect(() => {
    console.log('[RiderScreen] useEffect animate drawer. menuOpen =', menuOpen);
    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue: menuOpen ? 0 : -drawerWidth,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: menuOpen ? 1 : 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!menuOpen) {
        setDrawerVisible(false); // Unmount overlay after close animation
      }
    });
  }, [menuOpen, drawerWidth]);

  // One-time init and selectingOnMap toggle
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getCurrentPositionAsync({});
        const next = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(next);
        mapRef.current?.animateToRegion(next, 500);
      } catch {}
    })();
    if (route?.params?.selectingOnMap) {
      setSelectingLocation(true);
    }
    if (route?.params?.showOffers) {
      setShowOffers(true);
    } else if (route?.params && route.params.showOffers === false) {
      setShowOffers(false);
    }
  }, [route?.params?.selectingOnMap]);

  useEffect(() => {
    setShowOffers(!!route?.params?.showOffers);
  }, [route?.params?.showOffers]);

  type Offer = { id: string; driverName: string; rating: number; car: string; color: string; plate: string; price: number; distanceKm: number };
  type OfferShown = Offer & { expiresAt: number };
  const [fareBase, setFareBase] = useState<number | undefined>(route?.params?.fareOffer);
  const [offeredPriceText, setOfferedPriceText] = useState<string>(
    typeof route?.params?.fareOffer === 'number'
      ? (route.params!.fareOffer! === 2.5 ? '2.50' : String(route.params!.fareOffer))
      : ''
  );
  const calculatedFare = fareBase;
  const baseOffers: Offer[] = React.useMemo(() => {
    const base = typeof calculatedFare === 'number' ? calculatedFare : 5;
    // Slight variance for realism
    const withVar = (n: number) => Math.max(2.5, Math.round(n));
    return [
      { id: 'd1', driverName: 'Tariro M.', rating: 4.9, car: 'Toyota Corolla', color: 'Silver', plate: 'ABZ 2345', price: withVar(base + 0), distanceKm: 1.2 },
      { id: 'd2', driverName: 'Kuda P.', rating: 4.7, car: 'Honda Fit', color: 'Blue', plate: 'AEL 7789', price: withVar(base - 1), distanceKm: 2.0 },
      { id: 'd3', driverName: 'Ruvimbo T.', rating: 4.8, car: 'Nissan Sylphy', color: 'White', plate: 'ADX 9012', price: withVar(base + 1), distanceKm: 0.8 },
      { id: 'd4', driverName: 'Tendai G.', rating: 4.6, car: 'VW Polo', color: 'Grey', plate: 'AAY 5521', price: withVar(base - 2), distanceKm: 1.7 },
    ];
  }, [calculatedFare]);

  // Progressive, animated appearance of offers
  const [offersShown, setOffersShown] = useState<OfferShown[]>([]);
  const offerAnimRef = useRef<Record<string, Animated.Value>>({});
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const expiryTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancelReasons, setCancelReasons] = useState<Record<string, boolean>>({});
  const [cancelNotes, setCancelNotes] = useState<string>('');

  useEffect(() => {
    // Clear pending timers on cleanup or when offers hidden
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      Object.values(expiryTimersRef.current).forEach(clearTimeout);
      expiryTimersRef.current = {};
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, []);

  useEffect(() => {
    // Reset and progressively show offers when toggled on
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setOffersShown([]);
    Object.values(expiryTimersRef.current).forEach(clearTimeout);
    expiryTimersRef.current = {};
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (!showOffers) return;
    // Start 1s ticker for countdown labels
    intervalRef.current = setInterval(() => setNow(Date.now()), 1000);
    baseOffers.forEach((off, idx) => {
      // Staggered arrival with slight randomness
      const delay = 400 + idx * 600 + Math.floor(Math.random() * 200);
      const t = setTimeout(() => {
        offerAnimRef.current[off.id] = new Animated.Value(0);
        const expiresAt = Date.now() + 20000; // 20s lifespan
        setOffersShown((prev) => [...prev, { ...off, expiresAt }]);
        Animated.timing(offerAnimRef.current[off.id], {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }).start();
        // Auto-expire this offer after 20s
        expiryTimersRef.current[off.id] = setTimeout(() => {
          setOffersShown((prev) => prev.filter((o) => o.id !== off.id));
          delete offerAnimRef.current[off.id];
          delete expiryTimersRef.current[off.id];
        }, 20000);
      }, delay);
      timersRef.current.push(t);
    });
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      Object.values(expiryTimersRef.current).forEach(clearTimeout);
      expiryTimersRef.current = {};
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, [showOffers, baseOffers]);

  const performCancelOfferRequest = () => {
    // Stop timers and hide offers panel
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    Object.values(expiryTimersRef.current).forEach(clearTimeout);
    expiryTimersRef.current = {} as any;
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setOffersShown([]);
    setShowOffers(false);
  };
  const cancelOfferRequest = () => {
    setShowCancelModal(true);
  };
  const toggleReason = (key: string) => {
    setCancelReasons((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const submitCancelSurvey = () => {
    // Here you can send reasons to backend if needed
    performCancelOfferRequest();
    setShowCancelModal(false);
    setCancelReasons({});
    setCancelNotes('');
  };

  useEffect(() => {
    if (typeof route?.params?.fareOffer === 'number') {
      setFareBase(route.params!.fareOffer);
      setOfferedPriceText(route.params!.fareOffer === 2.5 ? '2.50' : String(route.params!.fareOffer));
    }
  }, [route?.params?.fareOffer]);

  return (
    <View style={styles.container}>
      {/* 1. Map View (Full Screen) */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        ref={mapRef}
        initialRegion={region}
        onPress={handleMapPress}
        showsUserLocation
      >
        {selectedCoord && (
          <Marker coordinate={selectedCoord} />
        )}
      </MapView>

      {/* 2. Header Overlay */}
      <SafeAreaView style={styles.headerSafeArea}>
        {selectingLocation ? (
          <View style={styles.selectHeaderRow}>
            <TouchableOpacity 
              style={styles.backBtn}
              onPress={() => setSelectingLocation(false)}
            >
              <Ionicons name="arrow-back" size={24} color={TEXT_COLOR_DARK} />
            </TouchableOpacity>
            <Text style={styles.selectHeaderText}>Tap on map to select</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={handleMenuPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={28} color={TEXT_COLOR_DARK} /> 
          </TouchableOpacity>
        )}
      </SafeAreaView>

      {/* Side Drawer Backdrop */}
      {drawerVisible && (
        <Animated.View pointerEvents={menuOpen ? 'auto' : 'none'} style={[StyleSheet.absoluteFillObject, styles.backdrop, { opacity: backdropAnim }]}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              console.log('[RiderScreen] Backdrop pressed - closing');
              setMenuOpen(false);
            }}
          />
        </Animated.View>
      )}

      {/* Side Drawer Panel (Left) */}
      <Animated.View style={[styles.drawer, { width: drawerWidth, transform: [{ translateX: drawerAnim }] }]}> 
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.drawerHeaderRow}>
            <View style={styles.brandRow}>
              <Image source={require('../../assets/Logo.png')} style={styles.brandLogo} resizeMode="contain" />
              <View style={styles.brandTextWrap}>
                <Text style={styles.brandTitle}>Chovha</Text>
                <Text style={styles.brandSubtitle}>Ride better</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                console.log('[RiderScreen] Close (X) pressed');
                setMenuOpen(false);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={TEXT_COLOR_DARK} />
            </TouchableOpacity>
          </View>
          <View style={styles.drawerItems}>
            <TouchableOpacity style={styles.drawerItem} onPress={() => {
              setMenuOpen(false);
              setTimeout(() => navigation.navigate('Profile'), 300);
            }}>
              <MaterialCommunityIcons name="account-outline" size={22} color={TEXT_COLOR_DARK} />
              <Text style={styles.drawerItemText}>Profile</Text>
              <Ionicons name="chevron-forward" size={18} color={TEXT_COLOR_DARK} style={styles.itemRightIcon} />
            </TouchableOpacity>
            <View style={styles.drawerDivider} />
            <TouchableOpacity style={styles.drawerItem} onPress={() => {
              setMenuOpen(false);
              setTimeout(() => navigation.navigate('Trips'), 300);
            }}>
              <MaterialCommunityIcons name="history" size={22} color={TEXT_COLOR_DARK} />
              <Text style={styles.drawerItemText}>Trips</Text>
              <Ionicons name="chevron-forward" size={18} color={TEXT_COLOR_DARK} style={styles.itemRightIcon} />
            </TouchableOpacity>
            <View style={styles.drawerDivider} />
            <TouchableOpacity style={styles.drawerItem} onPress={() => {
              setMenuOpen(false);
              setTimeout(() => navigation.navigate('Settings'), 300);
            }}>
              <MaterialCommunityIcons name="cog-outline" size={22} color={TEXT_COLOR_DARK} />
              <Text style={styles.drawerItemText}>Settings</Text>
              <Ionicons name="chevron-forward" size={18} color={TEXT_COLOR_DARK} style={styles.itemRightIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.drawerFooter}>
            <TouchableOpacity style={styles.switchBtn} onPress={() => {
              setMenuOpen(false);
              setTimeout(() => navigation.navigate('DriverVehicleDetails'), 300);
            }}>
              <Text style={styles.switchText}>Switch to Driver</Text>
            </TouchableOpacity>
            <View style={{ height: 10 }} />
            <TouchableOpacity style={styles.logoutBtn} onPress={() => {
              setMenuOpen(false);
              setTimeout(() => navigation.navigate('RoleSelection'), 300);
            }}>
              <Ionicons name="log-out-outline" size={20} color={TEXT_COLOR_DARK} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </SafeAreaView>
      </Animated.View>

      {selectingLocation && (
        <SafeAreaView style={styles.mapConfirmBar}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => { setSelectingLocation(false); setSelectedCoord(null); }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!selectedCoord}
            style={[styles.confirmBtn, { opacity: selectedCoord ? 1 : 0.5 }]}
            onPress={() => {
              if (!selectedCoord) return;
              navigation.navigate('SearchDestination', {
                selectedFromMap: { latitude: selectedCoord.latitude, longitude: selectedCoord.longitude } as any,
                focus: route?.params?.target || 'destination',
                existingPickupLocation: (route?.params as any)?.existingPickupLocation,
                existingPickupCoord: (route?.params as any)?.existingPickupCoord,
                existingDestination: (route?.params as any)?.existingDestination,
                existingDestCoord: (route?.params as any)?.existingDestCoord,
              });
            }}
          >
            <Text style={styles.confirmText}>Use this location</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {/* 3. Trip Planning Bottom Sheet */}
      {!selectingLocation && !showOffers && (
      <View style={styles.bottomSheet}>
        <View style={styles.handleBar} />
        <View style={{ marginTop: 8 }}>
          <TouchableOpacity
            style={{ backgroundColor: PRIMARY_COLOR, paddingVertical: 14, borderRadius: 10, alignItems: 'center' }}
            onPress={() => navigation.navigate('SearchDestination' as never)}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#1C1C1C', fontWeight: '700' }}>Book a ride</Text>
          </TouchableOpacity>
        </View>
        
      </View>
      )}
      {/* 4. Offers Panel */}
      {!selectingLocation && showOffers && (
        <View style={styles.offersPanel}>
          <View style={styles.offersHeaderRow}>
            <Text style={styles.offersTitle}>Driver offers</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity onPress={() => setShowOffers(false)}>
                <Text style={styles.offersClear}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelOfferRequest}>
                <Text style={styles.offersCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
          {offersShown.map((o) => {
            const a = offerAnimRef.current[o.id] || new Animated.Value(1);
            const translateY = a.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
            const scale = a.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] });
            const remaining = Math.max(0, Math.ceil((o.expiresAt - now) / 1000));
            return (
              <Animated.View key={o.id} style={[styles.offerCard, { opacity: a, transform: [{ translateY }, { scale }] }] }>
                <View style={styles.offerRowTop}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitials}>{o.driverName.split(' ').map(s=>s[0]).join('').slice(0,2)}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.offerDriver}>{o.driverName}</Text>
                    <Text style={styles.offerCar}>{o.car} • {o.color}</Text>
                    <Text style={styles.offerPlate}>{o.plate}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <View style={styles.ratingPill}>
                      <Ionicons name="star" size={14} color={'#1C1C1C'} />
                      <Text style={styles.ratingText}>{o.rating.toFixed(1)}</Text>
                    </View>
                    <Text style={styles.expireText}>{remaining}s</Text>
                  </View>
                </View>
                <View style={styles.offerRowBottom}>
                  <Text style={styles.offerPrice}>US${o.price.toFixed(2)}</Text>
                  <Text style={styles.offerDistance}>{o.distanceKm.toFixed(1)} km away</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={styles.declineBtn}
                      onPress={() => {
                        // manual decline
                        if (expiryTimersRef.current[o.id]) { clearTimeout(expiryTimersRef.current[o.id]); delete expiryTimersRef.current[o.id]; }
                        setOffersShown((prev) => prev.filter((x) => x.id !== o.id));
                        delete offerAnimRef.current[o.id];
                      }}
                    >
                      <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acceptBtn} onPress={() => { /* accept flow */ }}>
                      <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            );
          })}

          {/* Summary modal under offers */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your ride</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pickup</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>
                {(route?.params as any)?.existingPickupLocation || 'Current location'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Destination</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>
                {(route?.params as any)?.existingDestination || '--'}
              </Text>
            </View>
            <View style={[styles.summaryRow, { alignItems: 'center' }]}>
              <Text style={styles.summaryLabel}>Your offer</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
                <Text style={[styles.summaryValue, { marginRight: 6 }]}>US$</Text>
                <TextInput
                  value={offeredPriceText}
                  onChangeText={setOfferedPriceText}
                  keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
                  placeholder="--"
                  placeholderTextColor="#9A9A9A"
                  style={styles.summaryInput}
                />
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={() => {
                    const parsed = parseFloat(String(offeredPriceText).replace(/[^0-9.]/g, ''));
                    if (!isNaN(parsed)) {
                      const normalized = parsed >= 2.5 && parsed < 3 ? 2.5 : Math.max(2.5, Math.round(parsed));
                      setFareBase(normalized);
                      setOfferedPriceText(normalized === 2.5 ? '2.50' : String(normalized));
                    }
                    // Re-seed offers by toggling showOffers to trigger progressive flow
                    setShowOffers(false);
                    setTimeout(() => setShowOffers(true), 10);
                  }}
                >
                  <Text style={styles.updateText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>
      )}
      {/* Cancel survey modal rendered at screen root to stay centered */}
      {showCancelModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cancel ride request</Text>
            <Text style={styles.modalSubtitle}>Tell us why you’re cancelling</Text>

            {['Found another ride','Change of plans','Price too high','Driver ETA too long','Entered wrong destination'].map((label) => (
              <TouchableOpacity key={label} style={styles.reasonRow} onPress={() => toggleReason(label)}>
                <Ionicons
                  name={cancelReasons[label] ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={TEXT_COLOR_DARK}
                />
                <Text style={styles.reasonText}>{label}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.modalSubtitle}>Notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={cancelNotes}
              onChangeText={setCancelNotes}
              placeholder="Add a short note"
              placeholderTextColor="#9A9A9A"
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => setShowCancelModal(false)}>
                <Text style={styles.modalSecondaryText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalPrimaryBtn, { opacity: Object.values(cancelReasons).some(Boolean) ? 1 : 0.6 }]}
                onPress={submitCancelSurvey}
                disabled={!Object.values(cancelReasons).some(Boolean)}
              >
                <Text style={styles.modalPrimaryText}>Submit & Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/* Removed legacy inline menu overlay; using the animated drawer instead */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuPanel: {
    backgroundColor: '#FFFFFF',
    marginTop: Platform.OS === 'android' ? 50 : 70,
    marginLeft: 15,
    paddingVertical: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 },
      android: { elevation: 6 },
    }),
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    color: TEXT_COLOR_DARK,
    fontSize: 16,
    fontWeight: '600',
  },
 
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    ...Platform.select({ android: { elevation: 20 } }),
    pointerEvents: 'box-none',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 25,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 35,
    pointerEvents: 'auto',
    
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogo: {
    width: 36,
    height: 36,
  },
  brandTextWrap: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_COLOR_DARK,
    lineHeight: 20,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#8A8A8A',
    lineHeight: 16,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_COLOR_DARK,
  },
  drawerItems: {
    paddingVertical: 12,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  drawerItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
    fontWeight: '700',
  },
  itemRightIcon: {
    marginLeft: 'auto',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
  },
  drawerFooter: {
    marginTop: 'auto',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  switchBtn: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: {
    color: '#1C1C1C',
    fontWeight: '800',
    fontSize: 15,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 15,
    color: TEXT_COLOR_DARK,
    fontWeight: '700',
  },
  versionText: {
    marginTop: 6,
    fontSize: 12,
    color: '#9A9A9A',
  },
  mapConfirmBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)'
  },
  cancelBtn: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  cancelText: {
    color: TEXT_COLOR_DARK,
    fontSize: 16,
    fontWeight: '700',
  },
  confirmBtn: {
    height: 48,
    flex: 1,
    marginLeft: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
  },
  confirmText: {
    color: '#1C1C1C',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  selectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 6,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selectHeaderText: {
    marginLeft: 8,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
    fontWeight: '600',
  },
  menuButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 },
      android: { elevation: 5 },
    }),
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20, 
    paddingTop: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 5 },
      android: { elevation: 10 },
    }),
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
    marginBottom: 20,
  },
  dropdownContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  dropdownIcon: {
    marginRight: 5,
  },
  dropdownIconRight: {
    marginLeft: 5,
  },
  dropdownText: {
    fontSize: 15,
    color: TEXT_COLOR_DARK,
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
    marginBottom: 5,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55, // Set a consistent height
  },
  inputIcon: {
    marginRight: 15,
    color: TEXT_COLOR_GREY,
  },
  inputPlaceholderText: {
    fontSize: 16,
    color: TEXT_COLOR_DARK, 
    fontWeight: '500',
  },
  mapSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  mapSelectIcon: {
    marginRight: 15,
  },
  mapSelectText: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  // --- Offers Panel Styles ---
  offersPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 6 },
      android: { elevation: 10 },
    }),
  },
  offersHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  offersTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_COLOR_DARK,
  },
  offersClear: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY_COLOR,
  },
  offersCancel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D9534F',
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  offerRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF4D1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_COLOR_DARK,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '800',
    color: TEXT_COLOR_DARK,
  },
  expireText: {
    marginTop: 4,
    fontSize: 12,
    color: '#9A9A9A',
    fontWeight: '700',
  },
  offerDriver: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_COLOR_DARK,
  },
  offerCar: {
    fontSize: 13,
    color: '#6A6A6A',
    marginTop: 2,
  },
  offerPlate: {
    fontSize: 12,
    color: '#9A9A9A',
    marginTop: 2,
  },
  offerRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_COLOR_DARK,
  },
  offerDistance: {
    fontSize: 13,
    color: '#6A6A6A',
    marginLeft: 8,
    flex: 1,
  },
  acceptBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  acceptText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1C',
  },
  declineBtn: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  declineText: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT_COLOR_DARK,
  },
  // --- Summary modal styles ---
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT_COLOR_DARK,
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6A6A6A',
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 14,
    color: TEXT_COLOR_DARK,
    fontWeight: '700',
    maxWidth: '65%',
    textAlign: 'right',
  },
  summaryInput: {
    width: 90,
    height: 40,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
    textAlign: 'right',
  },
  updateBtn: {
    backgroundColor: PRIMARY_COLOR,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1C',
  },
  // --- Cancel survey modal ---
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }, android: { elevation: 6 } })
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: TEXT_COLOR_DARK },
  modalSubtitle: { fontSize: 13, color: '#6A6A6A', marginTop: 6, marginBottom: 10 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  reasonText: { fontSize: 14, color: TEXT_COLOR_DARK, fontWeight: '700' },
  notesInput: {
    minHeight: 70,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: TEXT_COLOR_DARK,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 10 },
  modalSecondaryBtn: { backgroundColor: '#EFEFEF', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  modalSecondaryText: { color: TEXT_COLOR_DARK, fontWeight: '800' },
  modalPrimaryBtn: { backgroundColor: PRIMARY_COLOR, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  modalPrimaryText: { color: '#1C1C1C', fontWeight: '800' },
});

export default RideScreen;