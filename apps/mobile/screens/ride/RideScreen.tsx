import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Platform, Animated, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Assuming you defined RootStackParamList in App.tsx:
type RootStackParamList = {
  Home: undefined; // The name registered in App.tsx
  Ride: undefined; // Screen name for itself (optional if using 'Home')
  SearchDestination: undefined;
  Profile: undefined;
};

type RideScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>; // Or use 'Ride' if registered

const PRIMARY_COLOR = '#D4AF37';
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const SCREEN_HEIGHT = Dimensions.get('window').height;

// --- DUMMY MAP COMPONENT ---
// In a real app, you would replace this with Expo Go, react-native-maps, or another map library.
const MapPlaceholder = () => (
  <View style={styles.map}>
    <Text style={styles.mapText}>[Map View Placeholder]</Text>
    <Text style={styles.mapText}>Current Location Pin</Text>
  </View>
);
// ---------------------------

const RideScreen = ({ navigation }: RideScreenProps) => {

  // Function to navigate to the search screen when the input is pressed
  const handleSearchPress = () => {
    // You will need to register 'SearchDestination' in App.tsx later
    alert('Navigating to Search Destination Screen');
    // navigation.navigate('SearchDestination'); 
  };

  // Drawer state & animations
  const drawerWidth = Math.min(Dimensions.get('window').width * 0.75, 360);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const handleMenuPress = async () => {
    const opening = !menuOpen;
    if (opening) {
      try {
        const Haptics = await import('expo-haptics');
        await Haptics.selectionAsync();
      } catch {}
    }
    setMenuOpen(opening);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(drawerAnim, { toValue: menuOpen ? 0 : -drawerWidth, duration: 260, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: menuOpen ? 1 : 0, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [menuOpen, drawerAnim, backdropAnim, drawerWidth]);
  
  return (
    <View style={styles.container}>
      {/* 1. Map View (Takes up most of the screen) */}
      <MapPlaceholder />

      {/* 2. Overlaid Header/Menu Button */}
      <SafeAreaView style={styles.headerSafeArea}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={handleMenuPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={28} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Backdrop */}
      {menuOpen && (
        <Animated.View pointerEvents={menuOpen ? 'auto' : 'none'} style={[StyleSheet.absoluteFillObject, styles.backdrop, { opacity: backdropAnim }]}>
          <Pressable style={{ flex: 1 }} onPress={() => setMenuOpen(false)} />
        </Animated.View>
      )}

      {/* Left Drawer */}
      <Animated.View style={[styles.drawer, { width: drawerWidth, transform: [{ translateX: drawerAnim }] }]}> 
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.drawerHeaderRow}>
            <Text style={styles.drawerTitle}>Menu</Text>
            <TouchableOpacity onPress={() => setMenuOpen(false)}><Ionicons name="close" size={24} color={TEXT_COLOR_DARK} /></TouchableOpacity>
          </View>
          <View style={styles.drawerItems}>
            <TouchableOpacity style={styles.drawerItem} onPress={() => setMenuOpen(false)}>
              <Text style={styles.drawerItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => setMenuOpen(false)}>
              <Text style={styles.drawerItemText}>Trips</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => setMenuOpen(false)}>
              <Text style={styles.drawerItemText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* 3. Bottom Sheet Search Interface */}
      <View style={styles.bottomSheet}>
        <Text style={styles.greetingText}>
          Good Afternoon!
        </Text>

        {/* Search Input Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={20} color={TEXT_COLOR_GREY} style={styles.searchIcon} />
          <Text style={styles.searchText}>
            Where to?
          </Text>
        </TouchableOpacity>
        
        {/* Quick Access Destinations (e.g., Saved Places) */}
        <View style={styles.quickAccess}>
          {['Home', 'Work'].map((label) => (
            <TouchableOpacity key={label} style={styles.quickAccessItem}>
              <Ionicons name="bookmark-outline" size={20} color={TEXT_COLOR_GREY} />
              <Text style={styles.quickAccessText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0', // Light grey background for map
  },
  mapText: {
    color: '#000000',
    fontSize: 18,
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    zIndex: 30,
    ...Platform.select({ android: { elevation: 20 } }),
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
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
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
    paddingVertical: 14,
  },
  drawerItemText: {
    fontSize: 16,
    color: TEXT_COLOR_DARK,
    fontWeight: '700',
  },
  menuButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
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
    paddingBottom: Platform.OS === 'ios' ? 35 : 20, // Padding for safe area on iOS
    paddingTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    fontSize: 16,
    color: TEXT_COLOR_GREY,
    fontWeight: '500',
  },
  quickAccess: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  quickAccessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  quickAccessText: {
    marginLeft: 8,
    fontSize: 15,
    color: TEXT_COLOR_DARK,
    fontWeight: '600',
  },
});

export default RideScreen;