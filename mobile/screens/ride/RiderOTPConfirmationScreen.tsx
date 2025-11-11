import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform, Keyboard, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Minimal Type Definition for compilation, defining the screens this component needs to know about
type RootStackParamList = {
  RoleSelection: undefined;
  PhoneInput: { role: 'rider' | 'driver' };
  OTPConfirmation: { role: 'rider' | 'driver', phoneNumber: string };
  Home: undefined; // The final destination for the rider
};

// Define the Props specific to this screen
type RiderOTPConfirmationScreenProps = NativeStackScreenProps<RootStackParamList, 'OTPConfirmation'>;

const PRIMARY_COLOR = '#D4AF37';
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BORDER_COLOR = '#D3D3D3';
const BUTTON_HEIGHT = 56;
const CODE_LENGTH = 6;
const { width } = Dimensions.get('window');

// Component simplified to handle Rider flow only
const RiderOTPConfirmationScreen = ({ route, navigation }: RiderOTPConfirmationScreenProps) => {

  // Safely read the phone number. We implicitly assume the role is 'rider' now.
  const displayPhoneNumber = route.params?.phoneNumber || '+263 777 XXX XXX';

  const [code, setCode] = useState(new Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<TextInput[]>([]);

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length === CODE_LENGTH) {
      // Logic to verify code here...
      console.log(`Attempting to verify code ${fullCode} for Rider.`);

      Keyboard.dismiss();

      // --- SIMPLIFIED NAVIGATION: ALWAYS GOES TO HOME ---
      console.log('Verification successful for Rider. Navigating to Home.');
      // Use 'replace' so the user cannot go back to the OTP screen
      navigation.replace('Home');
      // -----------------------------------------------

    } else {
      console.warn('Please enter the full 6-digit code.');
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (text && index === CODE_LENGTH - 1) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }: any, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
          Verify your number
        </Text>
        <Text style={styles.body}>
          Enter the 6-digit code sent to
          <Text style={styles.phoneNumberText}> {displayPhoneNumber}</Text>
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={styles.codeInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Resend Code Link */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity
            onPress={() => console.log('Resending Code for Rider')}
          >
            <Text style={styles.resendLink}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Button and Legal Text */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: PRIMARY_COLOR,
              opacity: code.join('').length === CODE_LENGTH ? 1 : 0.6
            }
          ]}
          onPress={handleVerify}
          disabled={code.join('').length !== CODE_LENGTH}
        >
          <Text style={styles.buttonText}>
            VERIFY
          </Text>
        </TouchableOpacity>

        <View style={styles.legalTextContainer}>
          <Text style={styles.legalText}>
            By continuing, you agree to our
          </Text>
          <TouchableOpacity><Text style={styles.legalLink}>Terms</Text></TouchableOpacity>
          <Text style={styles.legalText}> & </Text>
          <TouchableOpacity><Text style={styles.legalLink}>Privacy Policy</Text></TouchableOpacity>
        </View>
      </View>
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
  phoneNumberText: {
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: width - 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  codeInput: {
    width: '14%',
    aspectRatio: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
  },
  resendContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  resendText: {
    fontSize: 16,
    color: TEXT_COLOR_GREY,
  },
  resendLink: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  legalTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  legalText: {
    fontSize: 12,
    color: TEXT_COLOR_GREY,
  },
  legalLink: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default RiderOTPConfirmationScreen;