
import React, { useRef, useState } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TextInputKeyPressEventData,
  TextInputProps 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 

// --- Type Definitions ---
type RootStackParamList = {
  OTPConfirmation: undefined;
  UserSignUp: undefined; 
  DriverSignUp: undefined; 
  // Add other screens...
};

type OTPConfirmationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTPConfirmation'>; 

interface Props {
  navigation: OTPConfirmationScreenNavigationProp;
}
// --- End Type Definitions ---

// --- Design Constants (Reused) ---
const PRIMARY_COLOR = '#D4AF37'; 
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const BUTTON_HEIGHT = 55;
const OTP_BOX_SIZE = 45; 

const OTPConfirmationScreen = ({ navigation }: Props) => {
  const [otp, setOtp] = useState(Array(6).fill('') as string[]); 
  
  // Using the least-typed useRef initialization
  const inputRefs: any = useRef(null); 
  if (!inputRefs.current) {
    inputRefs.current = Array(6).fill(null); 
  }

  const displayPhoneNumber = '+263 771 234 567'; 
  
  const isOtpComplete = otp.every((digit: string) => digit.length === 1); 

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return; 

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      (inputRefs.current[index + 1] as TextInput | null)?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }: { nativeEvent: TextInputKeyPressEventData }, index: number) => {
    if (nativeEvent.key === 'Backspace' && otp[index].length === 0 && index > 0) {
        (inputRefs.current[index - 1] as TextInput | null)?.focus();
    }
  };

  const handleVerify = () => {
    const fullOtp = otp.join('');
    console.log('Verifying OTP:', fullOtp);
    navigation.navigate('DriverSignUp'); 
  };

  const handleResendCode = () => {
    console.log('Resending code to:', displayPhoneNumber);
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* --- Custom Header (Back Button Only) --- */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            {/* Using the new backButtonText style for increased size */}
            <Text style={styles.backButtonText}>&larr;</Text> 
          </TouchableOpacity>
        </View>

        {/* --- Main Content --- */}
        <View style={styles.contentContainer}>
          
          {/* Text Section */}
          <View style={styles.textSection}>
            <Text style={styles.title}>
              Verify your number
            </Text>
            <Text style={styles.body}>
              Enter the 6-digit code sent to <Text style={{fontWeight: '600'}}>{displayPhoneNumber}</Text>
            </Text>
          </View>

          {/* OTP Input Row */}
          <View style={styles.otpContainer}>
            {otp.map((digit: string, index: number) => {
              
              const props = {
                key: index,
                ref: (el: TextInput | null) => {
                    inputRefs.current[index] = el;
                },
                style: styles.otpInput,
                keyboardType: 'number-pad' as TextInputProps['keyboardType'], 
                maxLength: 1,
                onChangeText: (text: string) => handleChange(text, index),
                value: digit,
                autoFocus: index === 0, 
                onKeyPress: (e: any) => handleKeyPress(e, index),
              } as any; 

              return <TextInput {...props} />;
            })}
          </View>
          
          {/* Resend Link */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the code?{' '}
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            </Text>
          </View>
          
        </View>

        {/* --- Footer Button and Disclaimer --- */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={[styles.button, {backgroundColor: PRIMARY_COLOR}]}
            onPress={handleVerify}
            disabled={!isOtpComplete}
          >
            <Text style={styles.buttonText}>
              VERIFY
            </Text>
          </TouchableOpacity>

          {/* Disclaimer Text */}
          <Text style={styles.disclaimerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.disclaimerLink} onPress={() => console.log('Navigate to Terms')}>
              Terms
            </Text>{' '}
            &{' '}
            <Text style={styles.disclaimerLink} onPress={() => console.log('Navigate to Privacy')}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  
  // Header Styles
  headerContainer: {
    // Increased height to accommodate larger button and padding
    height: 70, 
    paddingHorizontal: 15,
    // Pushed down slightly
    paddingTop: 15,
    paddingBottom: 5,
    justifyContent: 'center',
  },
  // ** BACK BUTTON FIX APPLIED HERE (55x55) **
  backButton: {
    width: 55, // Increased width
    height: 55, // Increased height
    justifyContent: 'center',
    alignItems: 'flex-start',
    // Adjusted vertical position
    marginTop: -5,
  },
  // ** TEXT SIZE INCREASED HERE (36) **
  backButtonText: {
    fontSize: 36, // Larger arrow text
    color: TEXT_COLOR_DARK, 
  },

  // Main Content Styles
  contentContainer: {
    flex: 1,
    paddingHorizontal: 25, 
    paddingTop: 20,
  },
  
  // Text Styles
  textSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28, 
    fontWeight: '700', 
    color: TEXT_COLOR_DARK,
    marginBottom: 8,
  },
  body: {
    fontSize: 16, 
    fontWeight: '400',
    color: TEXT_COLOR_GREY,
    lineHeight: 22,
  },

  // OTP Input Styles
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', 
    marginBottom: 20,
  },
  otpInput: {
    width: OTP_BOX_SIZE,
    height: OTP_BOX_SIZE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0', 
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_COLOR_DARK,
  },

  // Resend Link Styles
  resendContainer: {
    alignItems: 'flex-start', 
  },
  resendText: {
    fontSize: 15,
    color: TEXT_COLOR_GREY,
    flexDirection: 'row', 
    alignItems: 'center',
  },
  resendLink: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
    textDecorationLine: 'none', 
    fontSize: 15,
  },

  // Footer Styles (Button and Disclaimer)
  bottomSection: {
    paddingHorizontal: 25,
    paddingBottom: Platform.OS === 'ios' ? 20 : 15, 
    alignItems: 'center',
  },
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15, 
  },
  buttonText: {
    color: TEXT_COLOR_DARK, 
    fontSize: 16,
    fontWeight: '700', 
    letterSpacing: 1, 
  },
  disclaimerText: {
    fontSize: 12,
    color: TEXT_COLOR_GREY,
    textAlign: 'center',
    lineHeight: 18,
  },
  disclaimerLink: {
    color: TEXT_COLOR_DARK,
    fontWeight: '700',
    textDecorationLine: 'underline', 
  }
});

export default OTPConfirmationScreen;