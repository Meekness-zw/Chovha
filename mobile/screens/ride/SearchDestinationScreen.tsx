import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App'; // Adjust path as needed

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

const SearchDestinationScreen = ({ navigation }: SearchDestinationScreenProps) => {
  const [pickupLocation, setPickupLocation] = useState('Current Location');
  const [destination, setDestination] = useState('');

  const renderSeparator = () => <View style={styles.separator} />;

  const renderItem = ({ item }: { item: typeof SUGGESTED_LOCATIONS[0] }) => (
    <TouchableOpacity style={styles.suggestionItem} onPress={() => setDestination(item.name)}>
      <View style={styles.iconCircle}>
        <Ionicons 
          name={item.icon as any} // Cast icon name
          size={20} 
          color={item.type === 'home' || item.type === 'work' ? PRIMARY_COLOR : TEXT_COLOR_DARK} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.suggestionName}>{item.name}</Text>
        <Text style={styles.suggestionAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header and Back Button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
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
              onChangeText={setPickupLocation}
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
              onChangeText={setDestination}
              autoFocus={true} // Auto-focus when entering this screen
            />
            <TouchableOpacity style={styles.mapPinButton}>
                <MaterialCommunityIcons name="map-marker-outline" size={24} color={TEXT_COLOR_DARK} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Suggestions/Recent Locations */}
        <FlatList
          data={SUGGESTED_LOCATIONS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 20 },
  headerContainer: { height: 60, justifyContent: 'center', marginBottom: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  
  inputSection: { 
    paddingBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    height: 45,
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
  },
  mapPinButton: {
    padding: 5,
    marginLeft: 10,
  },
  
  // Suggestions List Styles
  listContent: {
    paddingVertical: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: INPUT_BG_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
  },
  suggestionAddress: {
    fontSize: 13,
    color: TEXT_COLOR_GREY,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 55, // Align with text content
  },
});

export default SearchDestinationScreen;