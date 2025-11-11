import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Platform } from 'react-native';
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

  // Function to open the profile or side menu
  const handleMenuPress = () => {
    // You will need to register 'Profile' or a drawer navigator later
    alert('Opening Profile/Menu');
    // navigation.navigate('Profile'); 
  };
  
  return (
    <View style={styles.container}>
      {/* 1. Map View (Takes up most of the screen) */}
      <MapPlaceholder />

      {/* 2. Overlaid Header/Menu Button */}
      <SafeAreaView style={styles.headerSafeArea}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={handleMenuPress}
        >
          <Ionicons name="menu" size={28} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </SafeAreaView>

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
    paddingTop: Platform.OS === 'android' ? 30 : 0, // Adjust for Android status bar
    zIndex: 10,
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