import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App'; // Import the RootStackParamList type

// 🟢 RENAMED PROP TYPE 🟢
type RiderPhoneInputScreenProps = NativeStackScreenProps<RootStackParamList, 'PhoneInput'>;

const PRIMARY_COLOR = '#D4AF37';
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BG_COLOR = '#F5F5F5';
const BUTTON_HEIGHT = 55;

// 🟢 RENAMED COMPONENT 🟢
const RiderPhoneInputScreen = ({ navigation }: RiderPhoneInputScreenProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  // Currently fixed based on the image: Zimbabwe (+263)
  const countryCode = '+263'; 
  const flag = '🇿🇼'; // Zimbabwe Flag

  const handleSendCode = () => {
    if (phoneNumber.length >= 7) {
      // Logic to send the OTP code here...

      // Navigate to OTP Confirmation, passing role for subsequent routing
      const formatted = `${countryCode} ${phoneNumber}`;
      navigation.navigate('RiderOTPConfirmationScreen', { role: 'rider', phoneNumber: formatted });
    } else {
      alert('Please enter a valid phone number.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={TEXT_COLOR_DARK} /> 
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Enter your phone number.
        </Text>
        <Text style={styles.body}>
          We'll send you a one time code to verify your number
        </Text>
        
        {/* Phone Number Input Section */}
        <View style={styles.inputRow}>
          {/* Country Code Dropdown (Styled as static for now) */}
          <View style={styles.countryCodeInput}>
            <Text style={styles.countryCodeText}>{flag}</Text>
            <Text style={[styles.countryCodeText, { marginRight: 5 }]}>{countryCode}</Text>
            <Ionicons name="chevron-down" size={16} color={TEXT_COLOR_DARK} />
          </View>

          {/* Phone Number Input */}
          <TextInput
            style={styles.phoneInput}
            keyboardType="numeric"
            placeholder="771 234 567" 
            placeholderTextColor={TEXT_COLOR_GREY}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={9} 
          />
        </View>

      </View>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, {backgroundColor: PRIMARY_COLOR}]}
          onPress={handleSendCode}
        >
          <Text style={styles.buttonText}>
            SEND CODE
          </Text>
        </TouchableOpacity>
      </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: { height: 60, paddingHorizontal: 15, justifyContent: 'center' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  contentContainer: { flex: 1, paddingHorizontal: 25, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: '700', color: TEXT_COLOR_DARK, marginBottom: 15 },
  body: { fontSize: 16, fontWeight: '400', color: TEXT_COLOR_GREY, lineHeight: 22, marginBottom: 50 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  countryCodeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    color: TEXT_COLOR_DARK,
    fontWeight: '600',
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
  },
  footer: { 
    paddingHorizontal: 25, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 20, 
  },
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: TEXT_COLOR_DARK, 
    fontSize: 16,
    fontWeight: '700', 
    letterSpacing: 1, 
  },
});

export default RiderPhoneInputScreen;