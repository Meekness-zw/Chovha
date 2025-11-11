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