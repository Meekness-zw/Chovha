import React from 'react'; // Standard React import
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// Note: Ensure this library is installed if you use native stack navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 

// --- Type Definitions ---
// Define all relevant screens for proper navigation typing
type RootStackParamList = {
  RoleSelection: undefined;
  PhoneInput: undefined;
  OTPConfirmation: undefined; 
  DriverLogin: undefined;
  // Add other screens here...
};

type PhoneInputScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhoneInput'>; 

interface Props {
  navigation: PhoneInputScreenNavigationProp;
}
// --- End Type Definitions ---

// --- Design Constants (Reused from RoleSelection) ---
const PRIMARY_COLOR = '#D4AF37'; // Golden/Yellowish-Brown for the button
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BG_COLOR = '#F5F5F5'; // Light background color for input
const BUTTON_HEIGHT = 55;
const SCREEN_WIDTH = Dimensions.get('window').width;

// Using direct function component typing to avoid React.FC/FC issues
const PhoneInputScreen = ({ navigation }: Props) => {
  const [phoneNumber, setPhoneNumber] = React.useState('771 234 567'); 
  
  const handleSendCode = () => {
    // Navigate to the OTP confirmation screen
    navigation.navigate('OTPConfirmation'); 
  };
  
  // NOTE on Dropdown: This is a VISUAL element only. 
  const handleCountryCodePress = () => {
    console.log('Open country code selector logic here');
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
              Enter your phone number.
            </Text>
            <Text style={styles.body}>
              We'll send you a one time code to verify your number
            </Text>
          </View>

          {/* Input Row */}
          <View style={styles.inputRow}>
            
            {/* Country Code Picker (VISUAL DUPLICATION) */}
            <TouchableOpacity 
              style={styles.countryCodeContainer}
              onPress={handleCountryCodePress}
            >
              {/* Zimbabwe Flag (using simple emoji) */}
              <Text style={styles.flagText}>🇿🇼</Text> 
              <Text style={styles.countryCodeText}>+263</Text>
              <Text style={styles.dropdownArrow}>&#9660;</Text> 
            </TouchableOpacity>

            {/* Phone Number Input Field */}
            <TextInput
              style={styles.phoneInput}
              placeholder="771 234 567" 
              keyboardType="phone-pad"
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              placeholderTextColor={TEXT_COLOR_GREY}
              maxLength={15}
            />
          </View>
        </View>

        {/* --- Button (Stuck to Bottom) --- */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={[styles.button, {backgroundColor: PRIMARY_COLOR}]}
            onPress={handleSendCode}
            disabled={phoneNumber.length < 9} 
          >
            <Text style={styles.buttonText}>
              SEND CODE
            </Text>
          </TouchableOpacity>
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

  // Input Row Styles
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30, 
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 8,
    marginRight: 8, 
    width: '30%', 
  },
  flagText: {
    fontSize: 20,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
    marginRight: 4,
  },
  dropdownArrow: {
    fontSize: 10,
    color: TEXT_COLOR_GREY,
    marginLeft: 'auto', 
  },

  phoneInput: {
    flex: 1, 
    height: 50, 
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
  },
  
  // Button Styles
  bottomButtonContainer: {
    paddingHorizontal: 25,
    paddingBottom: Platform.OS === 'ios' ? 20 : 15, 
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

export default PhoneInputScreen;