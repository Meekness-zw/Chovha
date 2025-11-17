import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Assuming RootStackParamList is defined in '../../App'
type RootStackParamList = {
  Home: undefined; // Or the screen that navigates to this
  SwitchRider: undefined;
  ChooseRider: undefined; // To navigate to the contact selection screen
};

type SwitchRiderModalProps = NativeStackScreenProps<RootStackParamList, 'SwitchRider'>;

const PRIMARY_COLOR = '#D4AF37';
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BG_COLOR = '#F5F5F5';
const BUTTON_HEIGHT = 55;
const RADIO_SIZE = 22;

type RiderOption = 'me' | 'add_new';

const SwitchRiderModal = ({ navigation }: SwitchRiderModalProps) => {
  const [selectedOption, setSelectedOption] = useState<RiderOption>('add_new');

  const handleDone = () => {
    navigation.goBack(); // Dismiss the modal

    if (selectedOption === 'add_new') {
      alert('Navigating to Add New Contact / Choose Rider screen.');
      // Future logic: Navigate to the ChooseRiderScreen or a dedicated add contact screen
      // navigation.navigate('ChooseRider');
    } else {
      alert('Rider set to "Me".');
    }
  };

  const RadioButton = ({ selected, label, subtext, iconName, option, onPress }: any) => (
    <TouchableOpacity style={styles.radioItem} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color={TEXT_COLOR_DARK} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.radioLabel}>{label}</Text>
        {subtext && <Text style={styles.radioSubtext}>{subtext}</Text>}
      </View>
      <View style={styles.radioOuter}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    // Standard modal overlay structure
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => navigation.goBack()} // Dismiss modal on backdrop press
      />
      
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.handleBar} />
        
        <Text style={styles.title}>
          Switch Rider
        </Text>

        {/* Option: Add new contact */}
        <RadioButton
          selected={selectedOption === 'add_new'}
          label="Add new contact"
          iconName="person-add-outline"
          option="add_new"
          onPress={() => setSelectedOption('add_new')}
        />

        {/* Done Button */}
        <TouchableOpacity 
          style={[styles.button, {backgroundColor: PRIMARY_COLOR}]}
          onPress={handleDone}
        >
          <Text style={styles.buttonText}>
            DONE
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    maxHeight: Dimensions.get('window').height * 0.5,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
    marginBottom: 25,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  iconContainer: {
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
  },
  radioSubtext: {
    fontSize: 13,
    color: TEXT_COLOR_GREY,
    marginTop: 2,
  },
  radioOuter: {
    height: RADIO_SIZE,
    width: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  radioInner: {
    height: RADIO_SIZE / 2,
    width: RADIO_SIZE / 2,
    borderRadius: RADIO_SIZE / 4,
    backgroundColor: PRIMARY_COLOR,
  },
  separator: {
    height: 1,
    backgroundColor: INPUT_BG_COLOR,
    marginHorizontal: 10,
  },
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: TEXT_COLOR_DARK, 
    fontSize: 16,
    fontWeight: '700', 
    letterSpacing: 1, 
  },
});

export default SwitchRiderModal;