import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 🟢 FIX: Using Ionicons as standard
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Assuming you have defined RootStackParamList in a file like '../../App'
type RootStackParamList = {
  Home: undefined;
  PickupTimeModal: undefined;
};

type PickupTimeModalProps = NativeStackScreenProps<RootStackParamList, 'PickupTimeModal'>;

// --- Color Constants from User Input ---
const PRIMARY_COLOR = '#D4AF37'; 
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BG_COLOR = '#F5F5F5';
const BUTTON_HEIGHT = 55;
const RADIO_SIZE = 22;
const { width } = Dimensions.get('window');

type RideTimeOption = 'now' | 'later';

const PickupTimeModal = ({ navigation }: PickupTimeModalProps) => { // 🟢 FIX: Added navigation prop
  // Sets the default selection to 'Now', as shown in the design
  const [selectedOption, setSelectedOption] = useState<RideTimeOption>('now');

  const handleDone = () => {
    // 1. Close the modal
    navigation.goBack(); 

    // 2. Future logic for scheduling if 'Later' is selected
    if (selectedOption === 'later') {
      console.log('User selected: Later. Proceeding to scheduling interface.');
    }
  };

  const SelectionRow: React.FC<{
    label: string;
    description: string;
    iconName: keyof typeof Ionicons.glyphMap; // 🟢 FIX: Use string icon name
    option: RideTimeOption;
  }> = ({ label, description, iconName, option }) => {
    const isSelected = selectedOption === option;

    return (
      <TouchableOpacity
        style={styles.rowContainer}
        onPress={() => setSelectedOption(option)}
        accessibilityRole="radio"
        accessibilityState={{ checked: isSelected }}
      >
        <View style={styles.iconTextContainer}>
          {/* Icon is now used directly */}
          <Ionicons name={iconName} size={24} color={TEXT_COLOR_DARK} style={{marginRight: 15}}/>
          
          <View style={styles.textContainer}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
        
        {/* Radio Button matching design */}
        <View style={[
          styles.radioOuterCircle,
          { borderColor: isSelected ? PRIMARY_COLOR : TEXT_COLOR_GREY }
        ]}>
          {isSelected && <View style={styles.radioInnerCircle} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    // 🟢 FIX: Overlay structure for transparent modal
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => navigation.goBack()} // Dismiss modal on backdrop press
      />
      
      <SafeAreaView style={styles.bottomSheet}>
        <View style={styles.handle} />
        
        <Text style={styles.title}>When do you need a ride?</Text>

        <SelectionRow
          label="Now"
          description="Request a ride, hop-in, and ride"
          iconName="time-outline" // 🟢 FIX: Ionicons name
          option="now"
        />
        
        {/* Separator to match the gap between options */}
        <View style={styles.separator} /> 
        
        <SelectionRow
          label="Later"
          description="Reserve for extra peace of mind"
          iconName="calendar-outline" // 🟢 FIX: Ionicons name
          option="later"
        />

        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: PRIMARY_COLOR }]}
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>DONE</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  // 🟢 FIX: Styles for the full transparent modal overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent background
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    width: '100%',
    maxHeight: Dimensions.get('window').height * 0.5,
  },
  handle: {
    width: 40,
    height: 5, // Slightly thicker handle
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22, // Larger font size to match design
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
    marginBottom: 25,
    textAlign: 'left', // Aligned left in design
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  separator: {
    height: 1,
    backgroundColor: INPUT_BG_COLOR,
    marginVertical: 0,
    marginHorizontal: 10,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    // marginLeft is applied inside Ionicons style now
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
  },
  description: {
    fontSize: 13,
    color: TEXT_COLOR_GREY,
    marginTop: 2,
  },
  radioOuterCircle: {
    height: RADIO_SIZE, 
    width: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerCircle: {
    height: RADIO_SIZE / 2,
    width: RADIO_SIZE / 2,
    borderRadius: RADIO_SIZE / 4,
    backgroundColor: PRIMARY_COLOR,
  },
  doneButton: {
    // Background color handled inline above
    height: BUTTON_HEIGHT,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 35, // Increased margin for spacing
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Take full width of the padding
    alignSelf: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700', 
    color: TEXT_COLOR_DARK,
    letterSpacing: 1, 
  },
});

export default PickupTimeModal;