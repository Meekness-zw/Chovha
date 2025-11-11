import React from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// --- TYPE DEFINITIONS ---
type RootStackParamList = {
  DriverLogin: undefined;
  OTPConfirmation: { phoneNumber: string, role: 'rider' | 'driver' }; // Must accept parameters
};

type DriverLoginScreenProps = NativeStackScreenProps<RootStackParamList, 'DriverLogin'>;

// --- DESIGN CONSTANTS ---
const PRIMARY_COLOR = '#D4AF37'; 
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BG_COLOR = '#F5F5F5'; 
const BUTTON_HEIGHT = 55;


const DriverLoginScreen: React.FC<DriverLoginScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = React.useState(''); 
  const [countryCode, setCountryCode] = React.useState('+263');
  
  const handleLogin = () => {
    if (phoneNumber.length >= 9) {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      
      // FIX: Explicitly passing 'role' to ensure route.params is defined in OTPConfirmation.
      navigation.navigate('OTPConfirmation', { 
        phoneNumber: fullPhoneNumber,
        role: 'driver' 
      }); 
    }
  };
  
  const handleCountryCodePress = () => {
    console.log('Open country code selector logic here');
  };

  const isInputValid = phoneNumber.length >= 9;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* --- Header (Back Button) --- */}
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
          >
            <Ionicons name="arrow-back" size={24} color={TEXT_COLOR_DARK} /> 
          </TouchableOpacity>
        </View>

        {/* --- Main Content --- */}
        <View style={styles.contentContainer}>
          
          {/* Text Section */}
          <View style={styles.textSection}>
            <Text style={styles.title}>
              Welcome back, Driver.
            </Text>
            <Text style={styles.body}>
              Enter your registered phone number to log in. We'll send a code to verify your identity.
            </Text>
          </View>

          {/* Input Row */}
          <View style={styles.inputRow}>
            
            {/* Country Code Picker */}
            <TouchableOpacity 
              style={styles.countryCodeContainer}
              onPress={handleCountryCodePress}
            >
              <Text style={styles.flagText}>🇿🇼</Text> 
              <Text style={styles.countryCodeText}>{countryCode}</Text>
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
            style={[
                styles.button, 
                {backgroundColor: isInputValid ? PRIMARY_COLOR : '#E0E0E0'} 
            ]}
            onPress={handleLogin}
            disabled={!isInputValid} 
          >
            <Text style={[
                styles.buttonText, 
                {color: isInputValid ? TEXT_COLOR_DARK : TEXT_COLOR_GREY} 
            ]}>
              LOGIN
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
    height: 60,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    height: BUTTON_HEIGHT, 
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
    height: BUTTON_HEIGHT, 
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
    fontWeight: '600',
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

export default DriverLoginScreen;
