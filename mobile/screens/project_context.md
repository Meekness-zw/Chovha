# Project Context Map for: screens

This file contains the directory structure and the contents of important project files.

---

## 1. Directory Structure

├── DriverLicenseScreen.tsx
├── DriverLoginScreen.tsx
├── DriverReviewStatusScreen.tsx
├── DriverRoleSelection.tsx
├── DriverSignUpScreen.tsx
├── DriverVehicleDetailsScreen.tsx
├── HomeScreen.jsx
├── OTPConfirmationScreen.tsx
├── PhoneInputScreen.tsx
├── project_mapper.py
├── RoleSelectionScreen.tsx
│   ├── **ride/**
│   │   ├── ChooseRiderScreen.tsx
│   │   ├── OTPConfirmationScreen.tsx
│   │   ├── PickupTimeModal.tsx
│   │   ├── RiderPhoneInputScreen.tsx
│   │   ├── RiderScreen.tsx
│   │   ├── RideScreen.tsx
│   │   ├── SearchDestinationScreen.tsx
│   │   ├── SwitchRiderModal.tsx

---

## 2. File Contents


### File: `DriverLicenseScreen.tsx`

```tsx
import React, { useState } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
// Explicitly imported Alert for better compatibility in React Native
import { Alert } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons'; 


// --- Design Constants ---
const PRIMARY_COLOR = '#D4AF37'; 
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const BUTTON_HEIGHT = 55;
const PROGRESS_PERCENTAGE = 0.75; // Matches 75% in the image

// Reusable component for file/photo upload placeholder
// NOTE: Removed TS typing from props here
const DocumentUploadBox = ({ title, onPress }) => (
    <TouchableOpacity
      style={[styles.documentUploadBox, { borderColor: title.includes('(Uploaded)') ? PRIMARY_COLOR : '#D3D3D3' }]}
      onPress={onPress}
    >
      <Ionicons 
        name={title.includes('(Uploaded)') ? "document-text" : "document-text-outline"} 
        size={24} 
        color={title.includes('(Uploaded)') ? PRIMARY_COLOR : TEXT_COLOR_DARK} 
      />
      <Text style={[
          styles.documentText, 
          { color: title.includes('(Uploaded)') ? PRIMARY_COLOR : TEXT_COLOR_DARK }
      ]}>
        {title}
      </Text>
      <Ionicons 
        name="chevron-forward" 
        size={24} 
        color={TEXT_COLOR_GREY} 
        style={styles.documentIconRight} 
      />
    </TouchableOpacity>
);


// NOTE: Removed TS typing for props
const DriverLicenseScreen = ({ navigation }) => {
  const [licenseNumber, setLicenseNumber] = useState(''); 
  const [expiryDate, setExpiryDate] = useState(''); 
  
  // State to track if files have been "uploaded" (for validation/visual feedback)
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);


  const handleUpload = (documentType) => {
    // In a real app, this would launch ImagePicker and save the URI.
    Alert.alert('Upload Required', `Opening camera/gallery for: ${documentType}`);
    
    // Simulate successful upload for validation
    if (documentType === 'front') setFrontUploaded(true);
    if (documentType === 'back') setBackUploaded(true);
    if (documentType === 'selfie') setSelfieUploaded(true);
  };

  const handleSubmit = () => {
    // Simple validation
    if (!licenseNumber.trim() || !expiryDate.trim() || !frontUploaded || !backUploaded || !selfieUploaded) {
      Alert.alert('Missing Requirements', 'Please provide the license number, expiry date, and all three required photos.');
      return;
    }
    
    console.log('License Details Submitted:', { licenseNumber, expiryDate });
    
    // Navigate to the next step: DriverReviewStatus is the final step
    // @ts-ignore: Assuming 'DriverReviewStatus' is defined in the navigator
    navigation.navigate('DriverReviewStatus'); 
  };
  
  const isFormValid = licenseNumber.trim() && expiryDate.trim() && frontUploaded && backUploaded && selfieUploaded;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.keyboardAvoidingView}>
          
          {/* --- Header & Progress Bar --- */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              {/* FIX: Use the style definition for the large arrow */}
              <Text style={styles.backButtonText}>&larr;</Text> 
            </TouchableOpacity>
            <Text style={styles.logoText}>logoipsum</Text>
            <Ionicons name="information-circle-outline" size={24} color={TEXT_COLOR_GREY} />
          </View>

          {/* Progress Bar (75%) */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[
                styles.progressBarFill, 
                { width: `${PROGRESS_PERCENTAGE * 100}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>{PROGRESS_PERCENTAGE * 100}%</Text>
          </View>
          
          {/* --- Main Content --- */}
          <View style={styles.contentContainer}>
            
            {/* Title Section */}
            <View style={styles.textSection}>
              <Text style={styles.title}>
                Add your driver's license.
              </Text>
              <Text style={styles.body}>
                We need a valid driver's license to verify that you're legally allowed to drive with Chovha.
              </Text>
            </View>

            {/* License Uploads */}
            <DocumentUploadBox 
                title={frontUploaded ? "Front of driver's license (Uploaded)" : "Front of driver's license"} 
                onPress={() => handleUpload('front')}
            />
            <DocumentUploadBox 
                title={backUploaded ? "Back of driver's license (Uploaded)" : "Back of driver's license"} 
                onPress={() => handleUpload('back')}
            />
            <DocumentUploadBox 
                title={selfieUploaded ? "Selfie with license (Uploaded)" : "Selfie while holding driver's license"} 
                onPress={() => handleUpload('selfie')}
            />
            
            {/* License Number Input */}
            <View style={[styles.inputGroup, {marginTop: 30}]}>
              <Text style={styles.inputLabel}>License Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g AB1234567"
                placeholderTextColor="#A9A9A9"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
                autoCapitalize="characters"
              />
            </View>

            {/* Expiry Date Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <View style={[styles.input, styles.inputWithIcon]}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="DD/MM/YYYY"
                        placeholderTextColor="#A9A9A9"
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                        keyboardType="number-pad"
                        maxLength={10}
                    />
                    <Ionicons name="calendar-outline" size={20} color={TEXT_COLOR_GREY} />
                </View>
            </View>
            
          </View>

          {/* --- Footer Button --- */}
          <View style={styles.bottomSection}>
            <TouchableOpacity 
              style={[
                styles.button, 
                {backgroundColor: isFormValid ? PRIMARY_COLOR : '#E0E0E0'}
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <Text style={[
                styles.buttonText, 
                {color: isFormValid ? TEXT_COLOR_DARK : TEXT_COLOR_GREY}
              ]}>
                SUBMIT FOR REVIEW
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  
  // Header Styles
  headerContainer: {
    // Increased height and vertical padding to push elements down
    height: 70, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 15, // Pushed down visually
    paddingBottom: 5,
  },
  // ** BACK BUTTON FIX APPLIED HERE (55x55) **
  backButton: {
    width: 55, // Increased width
    height: 55, // Increased height
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: -5, // Adjusted vertical position
  },
  // ** TEXT SIZE INCREASED HERE (36) **
  backButtonText: {
    fontSize: 36, // Larger arrow text
    color: TEXT_COLOR_DARK, 
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
  },

  // Progress Bar Styles
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: TEXT_COLOR_DARK,
    fontWeight: '600',
  },

  // Main Content Styles
  contentContainer: {
    paddingHorizontal: 25, 
  },
  
  // Text Styles
  textSection: {
    marginBottom: 30,
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
  
  // Document Upload
  documentUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 2,
    // Note: The color logic for uploaded state is now inside the DocumentUploadBox component
    borderStyle: 'dashed',
    borderRadius: 10,
    marginBottom: 15,
  },
  documentText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
    // Note: Color is now dynamically set in the component
  },
  documentIconRight: {
    marginLeft: 'auto',
  },

  // Input Styles
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F5F5', 
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    fontSize: 16,
    color: TEXT_COLOR_DARK,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: TEXT_COLOR_DARK,
  },

  // Footer Styles (Button)
  bottomSection: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20, 
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700', 
    letterSpacing: 1, 
  },
});

export default DriverLicenseScreen;
```

### File: `DriverLoginScreen.tsx`

```tsx
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

```

### File: `DriverReviewStatusScreen.tsx`

```tsx
import React from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import { Ionicons } from '@expo/vector-icons'; 

// --- Type Definitions ---
type RootStackParamList = {
  DriverLicense: undefined;
  DriverReviewStatus: undefined; 
  Home: undefined; // Target screen after review
};

type DriverReviewStatusScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DriverReviewStatus'>; 

interface Props {
  navigation: DriverReviewStatusScreenNavigationProp;
}
// --- End Type Definitions ---

// --- Design Constants ---
const PRIMARY_COLOR = '#D4AF37'; 
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const BUTTON_HEIGHT = 55;
const PROGRESS_PERCENTAGE = 1.0; // Matches 100% in the image

const DriverReviewStatusScreen = ({ navigation }: Props) => {
  
  // Note: On this screen, the back button is typically disabled or leads to the Home screen
  const handleGoToHome = () => {
    // Navigate past the sign-up stack to the main driver home screen
    // You may need to reset the navigation stack here depending on your app structure.
    navigation.navigate('Home'); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.keyboardAvoidingView}>
          
          {/* --- Header & Progress Bar --- */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleGoToHome} // Treat back button as go home/cancel
              disabled={true} // Usually disabled on a success/status screen
            >
                <Text style={{ fontSize: 24 }}>&larr;</Text> 
            </TouchableOpacity>
            <Text style={styles.logoText}>logoipsum</Text>
            <Ionicons name="information-circle-outline" size={24} color={TEXT_COLOR_GREY} />
          </View>

          {/* Progress Bar (100%) */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              {/* Progress Bar is full at 100% */}
              <View style={[
                styles.progressBarFill, 
                { width: `${PROGRESS_PERCENTAGE * 100}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>{PROGRESS_PERCENTAGE * 100}%</Text>
          </View>
          
          {/* --- Main Content (Centered Text) --- */}
          <View style={styles.contentContainer}>
            
            {/* Title Section */}
            <View style={styles.textSection}>
              <Text style={styles.title}>
                We're verifying your account.
              </Text>
              <Text style={styles.body}>
                Our team is reviewing your documents to make sure everything checks out. You'll get a notification once your driver profile is approved.
              </Text>
            </View>
            
          </View>

          {/* --- Footer Button --- */}
          <View style={styles.bottomSection}>
            <TouchableOpacity 
              style={[
                styles.button, 
                {backgroundColor: PRIMARY_COLOR}
              ]}
              onPress={handleGoToHome}
            >
              <Text style={styles.buttonText}>
                GO TO HOME
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: 'space-between',
  },
  
  // Header Styles
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
  },

  // Progress Bar Styles
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 40,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: TEXT_COLOR_DARK,
    fontWeight: '600',
  },

  // Main Content Styles
  contentContainer: {
    paddingHorizontal: 25, 
    flex: 1, // Allows the text to push the button down
  },
  
  // Text Styles
  textSection: {
    // Aligns text nicely
  },
  title: {
    fontSize: 28, 
    fontWeight: '700', 
    color: TEXT_COLOR_DARK,
    marginBottom: 15,
  },
  body: {
    fontSize: 16, 
    fontWeight: '400',
    color: TEXT_COLOR_GREY,
    lineHeight: 25,
  },
  

  // Footer Styles (Button)
  bottomSection: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20, 
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700', 
    letterSpacing: 1, 
    color: TEXT_COLOR_DARK,
  },
});

export default DriverReviewStatusScreen;
```

### File: `DriverRoleSelection.tsx`

```tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Assuming RootStackParamList is defined in App.tsx
type RootStackParamList = {
  RoleSelection: undefined;
  DriverRoleSelection: undefined;
  DriverLogin: undefined;
  // 🟢 FIX 1: PhoneInput must be defined to accept a 'role' parameter for navigation
  PhoneInput: { role: 'rider' | 'driver' }; 
};

type DriverRoleSelectionScreenProps = NativeStackScreenProps<RootStackParamList, 'DriverRoleSelection'>;

const PRIMARY_COLOR = '#D4AF37';
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';

const DriverRoleSelectionScreen = ({ navigation }: DriverRoleSelectionScreenProps) => {

  const handleSelectOption = (action: 'login' | 'signup') => {
    if (action === 'login') {
      // Existing Driver: Navigates straight to the login form
      navigation.navigate('DriverLogin');
    } else {
      // 🟢 FIX 2: Pass the explicit 'driver' role when navigating to PhoneInput.
      // This parameter is used by OTPConfirmation to select the correct next screen (DriverSignUp).
      navigation.navigate('PhoneInput', { role: 'driver' }); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={TEXT_COLOR_DARK} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Drive with us</Text>
        <Text style={styles.subtitle}>Select an option to proceed</Text>

        <View style={styles.buttonContainer}>
          {/* Sign Up Button (New Driver) */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: PRIMARY_COLOR }]}
            onPress={() => handleSelectOption('signup')} // Now passes { role: 'driver' }
          >
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>

          {/* Login Button (Existing Driver) */}
          <TouchableOpacity
            style={[styles.actionButton, styles.loginButton]}
            onPress={() => handleSelectOption('login')}
          >
            <Text style={[styles.buttonText, { color: TEXT_COLOR_DARK }]}>LOG IN</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  backButton: {
    paddingVertical: 10,
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: TEXT_COLOR_GREY,
    marginBottom: 60,
  },
  buttonContainer: {
    gap: 15,
  },
  actionButton: {
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#F5F5F5', 
    borderWidth: 1,
    borderColor: TEXT_COLOR_GREY,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

export default DriverRoleSelectionScreen;
```

### File: `DriverSignUpScreen.tsx`

```tsx
import React, { useState } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  ScrollView,
  Platform,
  Image, 
  Alert, // Explicitly imported for better compatibility
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker'; 

// --- Design Constants ---
const PRIMARY_COLOR = '#D4AF37'; 
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const BUTTON_HEIGHT = 55;
const PHOTO_UPLOAD_HEIGHT = 150;
const PROGRESS_PERCENTAGE = 0.25; // Represents 25%

const DriverSignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState(''); 
  const [dateOfBirth, setDateOfBirth] = useState(''); 
  const [idNumber, setIdNumber] = useState(''); 
  const [cityOfResidence, setCityOfResidence] = useState('Harare'); 
  
  // Clean JavaScript state for the profile image URI
  const [profileImage, setProfileImage] = useState(null); 
  
  const handlePhotoUpload = async () => {
    // Request media library permissions first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photo library to set your profile picture.'
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleIDUpload = () => {
    console.log('Navigate to ID document upload/scanner screen.');
    // This will alert, but in a real flow, it navigates to the license screen or similar.
    Alert.alert('Document Upload', 'This will launch the National ID photo upload flow.');
  };

  const handleNext = () => {
    if (!fullName.trim() || !dateOfBirth.trim() || !idNumber.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    
    console.log('Driver Profile Details:', { fullName, dateOfBirth, idNumber, cityOfResidence, profileImage });
    
    // Navigate to the next step, which seems to be the License screen
    // Note: Assuming 'DriverDocuments' is the next logical step to group documents
    navigation.navigate('DriverLicense'); 
  };
  
  const isFormValid = fullName.trim() && dateOfBirth.trim() && idNumber.trim() && cityOfResidence.trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.keyboardAvoidingView}>
          
          {/* --- Header & Progress Bar --- */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              {/* Using the new backButtonText style for increased size */}
              <Text style={styles.backButtonText}>&larr;</Text> 
            </TouchableOpacity>
            
            <Text style={styles.logoText}>logoipsum</Text>
            <Ionicons name="information-circle-outline" size={24} color={TEXT_COLOR_GREY} />
          </View>

          {/* Progress Bar (25%) */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[
                styles.progressBarFill, 
                { width: `${PROGRESS_PERCENTAGE * 100}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>{PROGRESS_PERCENTAGE * 100}%</Text>
          </View>
          
          {/* --- Main Content --- */}
          <View style={styles.contentContainer}>
            
            {/* Title Section */}
            <View style={styles.textSection}>
              <Text style={styles.title}>
                Tell us about yourself.
              </Text>
              <Text style={styles.body}>
                We just need a few details to complete your driver profile.
              </Text>
            </View>

            {/* Photo Upload Area */}
            <TouchableOpacity 
              style={styles.photoUploadBox}
              onPress={handlePhotoUpload}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="camera-outline" size={30} color={TEXT_COLOR_GREY} />
                  <Text style={styles.photoUploadText}>
                    Tap to take or upload a clear front-facing photo
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* National ID Upload Placeholder */}
            <TouchableOpacity
              style={styles.documentUploadBox}
              onPress={handleIDUpload}
            >
              <Ionicons name="document-text-outline" size={24} color={TEXT_COLOR_DARK} />
              <Text style={styles.documentText}>National ID</Text>
              <Ionicons name="chevron-forward" size={24} color={TEXT_COLOR_GREY} style={styles.documentIconRight} />
            </TouchableOpacity>
            
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#A9A9A9"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                textContentType="name"
              />
            </View>

            {/* Date of Birth & ID Number Row */}
            <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>Date of Birth</Text>
                    <View style={[styles.input, styles.inputWithIcon]}>
                        <TextInput
                            style={styles.inputField}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor="#A9A9A9"
                            value={dateOfBirth}
                            onChangeText={setDateOfBirth}
                            keyboardType="number-pad"
                            maxLength={10}
                        />
                        <Ionicons name="calendar-outline" size={20} color={TEXT_COLOR_GREY} />
                    </View>
                </View>
                <View style={[styles.inputGroup, styles.inputHalf]}>
                    <Text style={styles.inputLabel}>ID Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="63-1234567 V 75"
                        placeholderTextColor="#A9A9A9"
                        value={idNumber}
                        onChangeText={setIdNumber}
                        autoCapitalize="characters"
                    />
                </View>
            </View>
            
            {/* City of Residence Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>City of Residence</Text>
              <TextInput
                style={styles.input}
                placeholder="Harare"
                placeholderTextColor="#A9A9A9"
                value={cityOfResidence}
                onChangeText={setCityOfResidence}
                autoCapitalize="words"
              />
            </View>
            
          </View>

          {/* --- Footer Button --- */}
          <View style={styles.bottomSection}>
            <TouchableOpacity 
              style={[
                styles.button, 
                {backgroundColor: isFormValid ? PRIMARY_COLOR : '#E0E0E0'}
              ]}
              onPress={handleNext}
              disabled={!isFormValid}
            >
              <Text style={[
                styles.buttonText, 
                {color: isFormValid ? TEXT_COLOR_DARK : TEXT_COLOR_GREY}
              ]}>
                NEXT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  
  // Header Styles
  headerContainer: {
    // Increased height and vertical padding to push elements down
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 15, // Pushed down visually
    paddingBottom: 5,
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
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
  },

  // Progress Bar Styles
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: TEXT_COLOR_DARK,
    fontWeight: '600',
  },


  // Main Content Styles
  contentContainer: {
    paddingHorizontal: 25, 
  },
  
  // Text Styles
  textSection: {
    marginBottom: 30,
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
  
  // Photo Upload
  photoUploadBox: {
    borderWidth: 2,
    borderColor: '#D3D3D3',
    borderStyle: 'dashed',
    borderRadius: 10,
    height: PHOTO_UPLOAD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden', 
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  photoUploadText: {
    fontSize: 14,
    color: TEXT_COLOR_GREY,
    marginTop: 10,
  },

  // Document Upload
  documentUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginBottom: 30,
  },
  documentText: {
    fontSize: 16,
    color: TEXT_COLOR_DARK,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  documentIconRight: {
    marginLeft: 'auto',
  },

  // Input Styles
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F5F5', 
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: TEXT_COLOR_DARK,
  },

  // Footer Styles (Button)
  bottomSection: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20, 
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700', 
    letterSpacing: 1, 
  },
});

export default DriverSignUpScreen;
```

### File: `DriverVehicleDetailsScreen.tsx`

```tsx
import React, { useState } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  ScrollView,
  Platform,
  Alert, 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import { Ionicons } from '@expo/vector-icons'; 

// --- Type Definitions ---
type RootStackParamList = {
  DriverSignUpProfile: undefined;
  DriverVehicleDetails: undefined; 
  DriverFinalDocuments: undefined; // Next logical screen (e.g., Driver's License)
};

type DriverVehicleDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DriverVehicleDetails'>; 

interface Props {
  navigation: DriverVehicleDetailsScreenNavigationProp;
}
// --- End Type Definitions ---

// --- Design Constants ---
const PRIMARY_COLOR = '#D4AF37'; 
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const BUTTON_HEIGHT = 55;
const PROGRESS_PERCENTAGE = 0.50; // Matches 50% in the image

const DriverVehicleDetailsScreen = ({ navigation }: Props) => {
  const [vehicleBrand, setVehicleBrand] = useState(''); 
  const [vehicleModel, setVehicleModel] = useState(''); 
  const [productionYear, setProductionYear] = useState(''); 
  const [vehicleColor, setVehicleColor] = useState(''); 
  
  // Placeholder for document upload function
  const handleDocumentUpload = (documentType: string) => {
    Alert.alert('Upload Required', `This will open the flow for uploading: ${documentType}`);
  };

  const handleNext = () => {
    if (!vehicleBrand.trim() || !vehicleModel.trim() || !productionYear.trim() || !vehicleColor.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all vehicle details.');
      return;
    }
    
    console.log('Vehicle Details:', { vehicleBrand, vehicleModel, productionYear, vehicleColor });
    
    // Navigate to the next step: Final document/license upload
    // @ts-ignore: Ignoring type error since we're simulating navigation
    navigation.navigate('DriverFinalDocuments'); 
  };
  
  const isFormValid = vehicleBrand.trim() && vehicleModel.trim() && productionYear.trim() && vehicleColor.trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.keyboardAvoidingView}>
          
          {/* --- Header & Progress Bar --- */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>&larr;</Text> 
            </TouchableOpacity>
            <Text style={styles.logoText}>logoipsum</Text>
            <Ionicons name="information-circle-outline" size={24} color={TEXT_COLOR_GREY} />
          </View>

          {/* Progress Bar (50%) */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[
                styles.progressBarFill, 
                { width: `${PROGRESS_PERCENTAGE * 100}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>{PROGRESS_PERCENTAGE * 100}%</Text>
          </View>
          
          {/* --- Main Content --- */}
          <View style={styles.contentContainer}>
            
            {/* Title Section */}
            <View style={styles.textSection}>
              <Text style={styles.title}>
                Add your vehicle details.
              </Text>
              <Text style={styles.body}>
                We'll use these details to confirm your vehicle and show it to the passenger before every ride.
              </Text>
            </View>

            {/* Vehicle Picture Upload Area */}
            <TouchableOpacity 
              style={styles.uploadBox}
              onPress={() => handleDocumentUpload('Vehicle Picture')}
            >
              <View style={styles.placeholderContainer}>
                <Ionicons name="camera-outline" size={30} color={TEXT_COLOR_GREY} />
                <Text style={styles.uploadText}>
                  Vehicle Picture
                </Text>
              </View>
            </TouchableOpacity>

            {/* Vehicle Registration Certificate Upload Placeholder */}
            <TouchableOpacity
              style={[styles.documentUploadBox, {marginBottom: 30}]}
              onPress={() => handleDocumentUpload('Vehicle Registration Certificate')}
            >
              <Ionicons name="document-text-outline" size={24} color={TEXT_COLOR_DARK} />
              <Text style={styles.documentText}>Vehicle Registration Certificate</Text>
              <Ionicons name="chevron-forward" size={24} color={TEXT_COLOR_GREY} style={styles.documentIconRight} />
            </TouchableOpacity>
            
            {/* Vehicle Brand Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vehicle Brand</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g Toyota"
                placeholderTextColor="#A9A9A9"
                value={vehicleBrand}
                onChangeText={setVehicleBrand}
                autoCapitalize="words"
              />
            </View>

            {/* Vehicle Model Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vehicle Model</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g Corolla"
                placeholderTextColor="#A9A9A9"
                value={vehicleModel}
                onChangeText={setVehicleModel}
                autoCapitalize="words"
              />
            </View>

            {/* Production Year Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Production Year</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g 2012"
                placeholderTextColor="#A9A9A9"
                value={productionYear}
                onChangeText={setProductionYear}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            {/* Vehicle Color Input (Placeholder for Picker) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vehicle Color</Text>
              <TouchableOpacity
                style={[styles.input, styles.inputTouchable]} // Use inputTouchable for explicit alignment
                onPress={() => Alert.alert('Color Picker', 'This should open a color selection dialog.')}
              >
                <Text style={vehicleColor ? styles.inputColorText : styles.inputPlaceholderText}>
                    {vehicleColor || "Select vehicle color"}
                </Text>
              </TouchableOpacity>
            </View>
            
          </View>

          {/* --- Footer Button --- */}
          <View style={styles.bottomSection}>
            <TouchableOpacity 
              style={[
                styles.button, 
                {backgroundColor: isFormValid ? PRIMARY_COLOR : '#E0E0E0'}
              ]}
              onPress={handleNext}
              disabled={!isFormValid}
            >
              <Text style={[
                styles.buttonText, 
                {color: isFormValid ? TEXT_COLOR_DARK : TEXT_COLOR_GREY}
              ]}>
                NEXT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  
  // Header Styles
  headerContainer: {
    // Increased height and vertical padding to push elements down
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 15, // Pushed down visually
    paddingBottom: 5,
  },
  // ** BACK BUTTON FIX APPLIED HERE (55x55) **
  backButton: {
    width: 55, // Increased width
    height: 55, // Increased height
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: -5, // Adjusted vertical position
  },
  // ** TEXT SIZE INCREASED HERE (36) **
  backButtonText: {
    fontSize: 36, // Larger arrow text
    color: TEXT_COLOR_DARK, 
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
  },

  // Progress Bar Styles
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: TEXT_COLOR_DARK,
    fontWeight: '600',
  },

  // Main Content Styles
  contentContainer: {
    paddingHorizontal: 25, 
  },
  
  // Text Styles
  textSection: {
    marginBottom: 30,
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
  
  // Upload Components
  uploadBox: {
    borderWidth: 2,
    borderColor: '#D3D3D3',
    borderStyle: 'dashed',
    borderRadius: 10,
    height: 120, // Reduced height for the vehicle picture upload
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden', 
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: TEXT_COLOR_GREY,
    marginTop: 10,
  },
  documentUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginBottom: 15,
  },
  documentText: {
    fontSize: 16,
    color: TEXT_COLOR_DARK,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  documentIconRight: {
    marginLeft: 'auto',
  },

  // Input Styles
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F5F5', 
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
  },
  inputTouchable: {
    // Ensures text is vertically centered in the TouchableOpacity used as an input
    justifyContent: 'center', 
  },
  inputPlaceholderText: {
    fontSize: 16,
    color: '#A9A9A9',
  },
  inputColorText: {
    fontSize: 16,
    color: TEXT_COLOR_DARK,
    // Add logic here to show a color swatch if selected
  },

  // Footer Styles (Button)
  bottomSection: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20, 
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  button: {
    height: BUTTON_HEIGHT,
    borderRadius: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700', 
    letterSpacing: 1, 
  },
});

export default DriverVehicleDetailsScreen;
```

### File: `HomeScreen.jsx`

```jsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
} from 'react-native';

const PRIMARY_COLOR = '#D4AF37'; 
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const BUTTON_HEIGHT = 55;

const HomeScreen = ({ navigation }) => {
  
  const handleTestNavigation = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('RoleSelection'); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* FIX: Clean string ensures correct two-line wrap: "Welcome to" then "Chovha!" */}
        <Text style={styles.title}>Welcome to Chovha!</Text>
        
        <Text style={styles.body}>
          This is the Driver Home Screen (after the application review). 
          Once approved, the driver's main map and earnings dashboard will go here.
        </Text>
        
        <View style={styles.separator} />

        <Text style={styles.note}>
          The application has been submitted and is currently under review.
        </Text>

        <TouchableOpacity 
          style={[styles.testButton, {backgroundColor: PRIMARY_COLOR}]}
          onPress={handleTestNavigation}
        >
          <Text style={styles.testButtonText}>
            GO TO ROLE SELECTION
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 25,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '700', 
    color: TEXT_COLOR_DARK, 
    marginBottom: 10,
    textAlign: 'center', 
  },
  body: { 
    fontSize: 18, 
    textAlign: 'center',
    color: TEXT_COLOR_GREY,
    lineHeight: 25,
    marginBottom: 40,
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  note: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 60,
  },
  testButton: {
    height: BUTTON_HEIGHT,
    width: '100%',
    padding: 12, 
    borderRadius: 8,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  testButtonText: {
    color: TEXT_COLOR_DARK, 
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  }
});

export default HomeScreen;
```

### File: `OTPConfirmationScreen.tsx`

```tsx
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
```

### File: `PhoneInputScreen.tsx`

```tsx
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
```

### File: `project_mapper.py`

```py
import os
import sys

# --- Configuration ---
# Directories to ignore during the scan (e.g., environments, build folders, version control)
EXCLUDE_DIRS = [
    '.git', '__pycache__', 'venv', 'env', 'node_modules', 'dist', 'build', '.idea', '.vscode'
]
# File extensions to ignore (e.g., binary files, compressed files)
EXCLUDE_EXTENSIONS = [
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.tar', '.gz',
    '.sqlite3', '.db', '.bin', '.dll', '.exe', '.lock', '.log', '.pyd', '.pyc'
]
# Maximum character limit for file content included in the output (to avoid exceeding LLM context limits)
MAX_CONTENT_CHARS = 15000 
# Maximum number of files to process to prevent extremely long outputs
MAX_FILES = 100 
# --- End Configuration ---


def get_file_content(filepath):
    """Safely reads file content, handling encoding errors and size limits."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read(MAX_CONTENT_CHARS)
        
        if len(content) == MAX_CONTENT_CHARS:
            content += f"\n\n... [Content truncated at {MAX_CONTENT_CHARS} characters] ..."
            
        return content
    except UnicodeDecodeError:
        # Ignore binary or non-UTF-8 files
        return "[Content skipped: Binary or non-UTF-8 encoded file]"
    except Exception as e:
        return f"[Content skipped: Error reading file: {e}]"

def map_project(root_dir, output_file_path):
    """
    Scans the project directory, builds the structure map, and extracts content.
    """
    print(f"Starting scan of directory: {os.path.abspath(root_dir)}")
    
    # 1. Structure the output
    structure_map = f"# Project Context Map for: {os.path.basename(os.path.abspath(root_dir))}\n\n"
    structure_map += "This file contains the directory structure and the contents of important project files.\n\n"
    structure_map += "---\n\n## 1. Directory Structure\n\n"
    
    content_map = "\n---\n\n## 2. File Contents\n"

    file_count = 0

    for root, dirs, files in os.walk(root_dir, topdown=True):
        # Filter out excluded directories in place for os.walk to respect
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        # Calculate indentation level
        depth = root[len(root_dir):].count(os.sep)
        indent = '│   ' * depth
        
        # Add the current directory to the structure map (relative path)
        relative_path = os.path.relpath(root, root_dir)
        if relative_path != '.':
            structure_map += f"{indent}├── **{os.path.basename(root)}/**\n"
            indent += '│   ' # Increase indent for contents

        # Process files in the current directory
        for i, file_name in enumerate(files):
            file_path = os.path.join(root, file_name)
            
            # Check for file extension exclusion
            if any(file_name.lower().endswith(ext) for ext in EXCLUDE_EXTENSIONS):
                continue
            
            # Check max file limit
            if file_count >= MAX_FILES:
                structure_map += f"{indent}└── ... (Maximum file limit reached: {MAX_FILES} files processed)\n"
                print(f"Maximum file limit ({MAX_FILES}) reached. Stopping scan.")
                break

            file_count += 1
            
            # Add file to the structure map
            structure_map += f"{indent}├── {file_name}\n"
            
            # 2. Extract and format file content
            relative_file_path = os.path.relpath(file_path, root_dir)
            content = get_file_content(file_path)
            
            # Determine code block language for syntax highlighting (optional, helps LLM)
            extension = os.path.splitext(file_name)[1].lstrip('.')
            
            content_map += f"\n\n### File: `{relative_file_path}`\n\n"
            content_map += f"```{extension if extension else 'text'}\n"
            content_map += content
            content_map += "\n```"

        if file_count >= MAX_FILES:
            break

    # Combine and write the final output
    final_output = structure_map + content_map
    
    try:
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(final_output)
        print(f"\n✅ Successfully generated project context map to: {os.path.abspath(output_file_path)}")
        print(f"Total files processed: {file_count}")
        print("You can now copy the contents of this file directly into a Gemini prompt.")

    except Exception as e:
        print(f"\n❌ ERROR: Could not write output file {output_file_path}. Reason: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        # If no path is provided, use the current directory
        project_path = os.getcwd()
        print("No directory path provided. Defaulting to current directory.")
    else:
        project_path = sys.argv[1]
    
    if not os.path.isdir(project_path):
        print(f"Error: The path '{project_path}' is not a valid directory.")
        sys.exit(1)

    # Use a fixed output name for easy use in LLM prompts
    output_filename = "project_context.md"
    map_project(project_path, output_filename)

```

### File: `RoleSelectionScreen.tsx`

```tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the navigation types to enforce parameter passing
type RootStackParamList = {
  RoleSelection: undefined;
  PhoneInput: { role: 'rider' | 'driver' }; // <-- Requires role parameter
  DriverRoleSelection: undefined;
};

type RoleSelectionScreenProps = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

const PRIMARY_COLOR = '#D4AF37'; // Gold
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';

const RoleSelectionScreen = ({ navigation }: RoleSelectionScreenProps) => {

  const handleSelectRole = (role: 'rider' | 'driver') => {
    if (role === 'rider') {
      // Correctly navigates to PhoneInput with role:'rider'
      navigation.navigate('PhoneInput', { role: 'rider' });
    } else {
      // Driver flow continues to a dedicated selection screen
      navigation.navigate('DriverRoleSelection');
    }
  };

  const RoleButton: React.FC<{
    title: string;
    description: string;
    iconName: keyof typeof Ionicons.glyphMap;
    role: 'rider' | 'driver';
  }> = ({ title, description, iconName, role }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handleSelectRole(role)}
      activeOpacity={0.8}
    >
      <Ionicons name={iconName} size={30} color={TEXT_COLOR_DARK} style={styles.buttonIcon} />
      <View style={styles.textContainer}>
        <Text style={styles.buttonTitle}>{title}</Text>
        <Text style={styles.buttonDescription}>{description}</Text>
      </View>
      <Ionicons name="arrow-forward" size={24} color={TEXT_COLOR_DARK} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Choose your role to get started</Text>

        <View style={styles.buttonContainer}>
          <RoleButton
            title="Ride"
            description="Book a trip, or send parcels"
            iconName="car-outline"
            role="rider"
          />

          <RoleButton
            title="Drive"
            description="Drive with us and earn"
            iconName="key-outline"
            role="driver"
          />
        </View>

        <TouchableOpacity style={styles.policyText}>
            <Text style={styles.policyLink}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: TEXT_COLOR_DARK,
    marginBottom: 50,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
  },
  buttonDescription: {
    fontSize: 14,
    color: TEXT_COLOR_GREY,
    marginTop: 2,
  },
  policyText: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: Dimensions.get('window').width - 50,
  },
  policyLink: {
    fontSize: 12,
    color: TEXT_COLOR_GREY,
    textAlign: 'center',
    lineHeight: 18,
  }
});

export default RoleSelectionScreen;
```

### File: `ride\ChooseRiderScreen.tsx`

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Assuming RootStackParamList is defined in '../../App'
type RootStackParamList = {
  Home: undefined; // Or the screen that navigates to this
  ChooseRider: undefined;
};

type ChooseRiderScreenProps = NativeStackScreenProps<RootStackParamList, 'ChooseRider'>;

const PRIMARY_COLOR = '#D4AF37';
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BG_COLOR = '#F5F5F5';

// Dummy data for Device Contacts
const DUMMY_CONTACTS = [
  { id: '1', name: 'John Doe', phoneNumber: '+263 771 234 567' },
  { id: '2', name: 'Jane Smith', phoneNumber: '+263 771 234 568' },
  { id: '3', name: 'Michael Brown', phoneNumber: '+263 771 234 569' },
  { id: '4', name: 'Emily Davis', phoneNumber: '+263 771 234 570' },
  { id: '5', name: 'David Wilson', phoneNumber: '+263 771 234 571' },
  { id: '6', name: 'Sarah Miller', phoneNumber: '+263 771 234 572' },
  { id: '7', name: 'Chris Taylor', phoneNumber: '+263 771 234 573' },
  { id: '8', name: 'Olivia White', phoneNumber: '+263 771 234 574' },
];

const ChooseRiderScreen = ({ navigation }: ChooseRiderScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(DUMMY_CONTACTS);

  // Filter contacts based on search query
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = DUMMY_CONTACTS.filter(contact =>
        contact.name.toLowerCase().includes(text.toLowerCase()) ||
        contact.phoneNumber.includes(text)
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(DUMMY_CONTACTS);
    }
  };

  const renderContactItem = ({ item }: { item: typeof DUMMY_CONTACTS[0] }) => (
    <TouchableOpacity style={styles.contactItem}>
      <Ionicons name="person-outline" size={24} color={TEXT_COLOR_DARK} style={styles.contactIcon} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactNumber}>{item.phoneNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Handle Bar for Bottom Sheet look */}
        <View style={styles.handleBar} />

        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={TEXT_COLOR_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose a rider</Text>
          <TouchableOpacity style={styles.addRiderButton}>
            <Ionicons name="person-add-outline" size={24} color={TEXT_COLOR_DARK} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={TEXT_COLOR_GREY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or number"
            placeholderTextColor={TEXT_COLOR_GREY}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Device Contacts List */}
        <Text style={styles.listHeader}>Device Contacts</Text>
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          contentContainerStyle={styles.flatListContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20, // Mimic bottom sheet
    borderTopRightRadius: 20, // Mimic bottom sheet
    paddingHorizontal: 20,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
  },
  addRiderButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
    marginBottom: 15,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  contactIcon: {
    width: 30, // Allocate space for icon
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT_COLOR_DARK,
  },
  contactNumber: {
    fontSize: 13,
    color: TEXT_COLOR_GREY,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: INPUT_BG_COLOR,
    marginLeft: 45, // Align with text
  },
});

export default ChooseRiderScreen;
```

### File: `ride\OTPConfirmationScreen.tsx`

```tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform, Keyboard } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App'; // Import the RootStackParamList type

// Define the Props specific to this screen
type OTPConfirmationScreenProps = NativeStackScreenProps<RootStackParamList, 'OTPConfirmation'>;

const PRIMARY_COLOR = '#D4AF37';
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BORDER_COLOR = '#D3D3D3';
const BUTTON_HEIGHT = 55;
const CODE_LENGTH = 6;

const OTPConfirmationScreen = ({ route, navigation }: OTPConfirmationScreenProps) => {
  const { role } = route.params; // Get the role passed from the previous screen
  const [code, setCode] = useState(new Array(CODE_LENGTH).fill(''));
  // inputRefs is an array of TextInput references
  const inputRefs = useRef<TextInput[]>([]);

  // Sample phone number (should be passed from PhoneInputScreen)
  const displayPhoneNumber = '+263 771 234 567'; 

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length === CODE_LENGTH) {
      // Logic to verify code here...
      
      Keyboard.dismiss();

      // Navigate based on the role determined earlier
      if (role === 'rider') {
        // Navigate to the main Rider screen
        navigation.replace('Home');
      } else {
        // Navigate to the Driver's next step (e.g., DriverSignUp or DriverReviewStatus)
        alert('Verification successful for Driver. Proceeding to next step.');
        // navigation.replace('DriverSignUp'); 
      }
    } else {
      alert('Please enter the full 6-digit code.');
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) return; // Prevent pasting multiple characters
    
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus to the next input or handle verification on last digit
    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (text && index === CODE_LENGTH - 1) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }: any, index: number) => {
    // Handle backspace logic
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
              // 🟢 FIXED: Use block body to perform assignment without returning a value
              ref={(ref) => { inputRefs.current[index] = ref as TextInput; }}
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
          <TouchableOpacity onPress={() => alert('Resending Code...')}>
            <Text style={styles.resendLink}>Resend Code</Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* Footer Button and Legal Text */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, {backgroundColor: PRIMARY_COLOR}]}
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
  },
  buttonText: {
    color: TEXT_COLOR_DARK, 
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

export default OTPConfirmationScreen;
```

### File: `ride\PickupTimeModal.tsx`

```tsx
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
```

### File: `ride\RiderPhoneInputScreen.tsx`

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Platform } from 'react-native';
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
      navigation.navigate('OTPConfirmation', { role: 'rider' });
    } else {
      alert('Please enter a valid phone number.');
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
```

### File: `ride\RiderScreen.tsx`

```tsx
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
```

### File: `ride\RideScreen.tsx`

```tsx
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
```

### File: `ride\SearchDestinationScreen.tsx`

```tsx
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
```

### File: `ride\SwitchRiderModal.tsx`

```tsx
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
  const [selectedOption, setSelectedOption] = useState<RiderOption>('me');

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

        {/* Option: Me */}
        <RadioButton
          selected={selectedOption === 'me'}
          label="Me"
          subtext="Request a ride, hop-in, and ride"
          iconName="person-outline"
          option="me"
          onPress={() => setSelectedOption('me')}
        />
        
        {/* Separator */}
        <View style={styles.separator} />

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
```