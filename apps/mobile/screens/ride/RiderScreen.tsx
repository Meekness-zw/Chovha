import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Assuming you defined RootStackParamList in App.tsx:
type RootStackParamList = {
  Home: undefined; 
  SearchDestination: undefined;
  Profile: undefined;
};

type RideScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>; 

const PRIMARY_COLOR = '#D4AF37';
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BG_COLOR = '#F5F5F5';
const SCREEN_HEIGHT = Dimensions.get('window').height;

// --- DUMMY MAP COMPONENT ---
// This is structured to be easily replaced with your MapView component
const MapPlaceholder = () => (
  <View style={styles.map}>
    <Text style={styles.mapText}>[Map View Placeholder]</Text>
    {/* Profile/Menu Button is now handled as an overlay */}
  </View>
);
// ---------------------------

const RideScreen = ({ navigation }: RideScreenProps) => {

  const handleDestinationPress = () => {
    // This action should navigate to a dedicated search screen
    alert('Navigating to Search Destination Screen...');
    // navigation.navigate('SearchDestination'); 
  };
  
  const handleMenuPress = () => {
    // This action should open a drawer navigator or a profile screen
    alert('Opening Profile/Menu...');
    // navigation.navigate('Profile'); 
  };

  return (
    <View style={styles.container}>
      {/* 1. Map View (Full Screen) */}
      <MapPlaceholder />

      {/* 2. Menu Button Overlay (Top Left) */}
      <SafeAreaView style={styles.headerSafeArea}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={handleMenuPress}
        >
          {/* Using a profile-style icon as common for main screen menus */}
          <Ionicons name="menu" size={28} color={TEXT_COLOR_DARK} /> 
        </TouchableOpacity>
      </SafeAreaView>

      {/* 3. Trip Planning Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.handleBar} />
        
        <Text style={styles.title}>
          Plan your ride
        </Text>

        {/* Pickup Time and User Selector */}
        <View style={styles.dropdownContainer}>
          {/* Pickup Now Dropdown */}
          <TouchableOpacity style={styles.dropdownButton}>
            <Ionicons name="time-outline" size={18} color={TEXT_COLOR_DARK} style={styles.dropdownIcon} />
            <Text style={styles.dropdownText}>Pickup now</Text>
            <Ionicons name="chevron-down" size={18} color={TEXT_COLOR_DARK} style={styles.dropdownIconRight} />
          </TouchableOpacity>
          
          {/* For Me Dropdown */}
          <TouchableOpacity style={styles.dropdownButton}>
            <Ionicons name="person-outline" size={18} color={TEXT_COLOR_DARK} style={styles.dropdownIcon} />
            <Text style={styles.dropdownText}>For me</Text>
            <Ionicons name="chevron-down" size={18} color={TEXT_COLOR_DARK} style={styles.dropdownIconRight} />
          </TouchableOpacity>
        </View>

        {/* --- Location Inputs --- */}
        
        {/* FROM: Current Location Input (Static/Tappable) */}
        <Text style={styles.inputLabel}>From</Text>
        <TouchableOpacity style={styles.inputBar} activeOpacity={0.7}>
          <MaterialCommunityIcons name="target" size={20} color={TEXT_COLOR_DARK} style={styles.inputIcon} />
          <Text style={styles.inputPlaceholderText}>Current Location</Text>
        </TouchableOpacity>

        {/* TO: Destination Input (Navigates to search) */}
        <Text style={styles.inputLabel}>To</Text>
        <TouchableOpacity 
          style={styles.inputBar}
          onPress={handleDestinationPress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="send-outline" size={20} color={TEXT_COLOR_DARK} style={styles.inputIcon} />
          <Text style={styles.inputPlaceholderText}>Type in your destination</Text>
        </TouchableOpacity>

        {/* Select Location on Map Option */}
        <TouchableOpacity style={styles.mapSelectButton}>
          <MaterialCommunityIcons name="map-marker-outline" size={20} color={PRIMARY_COLOR} style={styles.mapSelectIcon} />
          <Text style={styles.mapSelectText}>Select location on map</Text>
        </TouchableOpacity>
        
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
    backgroundColor: '#E0E0E0', 
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
});

export default RideScreen;