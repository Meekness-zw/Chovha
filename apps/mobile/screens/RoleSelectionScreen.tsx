import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Dimensions, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// HACK: Placing type definitions inside a conditional block to avoid runtime text parsing errors 
// that occur in some React Native environments.
if (false as any) {
  // Define the navigation types to enforce parameter passing
  type RootStackParamList = {
    RoleSelection: undefined;
    PhoneInput: { role: 'rider' | 'driver' }; // <-- Requires role parameter
    DriverRoleSelection: undefined;
  };

  type RoleSelectionScreenProps = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;
}

// Re-declare types in a safer way for export/use, assuming the above definition is processed by TS
type RootStackParamList = any; // Placeholder for runtime safety
type RoleSelectionScreenProps = any; // Placeholder for runtime safety

const PRIMARY_COLOR = '#D4AF37'; // Gold
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const BACKGROUND_COLOR = '#FFFFFF';
const CARD_BG_COLOR = '#F9F9F9'; // Slightly off-white for card background

const { width, height } = Dimensions.get('window');

const RoleSelectionScreen = ({ navigation }: any) => { // Use 'any' for navigation type to avoid parameter errors

  const handleSelectRole = (role: 'rider' | 'driver') => {
    if (role === 'rider') {
      // Correctly navigates to PhoneInput with role:'rider'
      navigation.navigate('RiderPhoneInputScreen');
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
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        <View style={styles.iconCircle}>
          <Ionicons name={iconName} size={30} color={PRIMARY_COLOR} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>{title}</Text>
          <Text style={styles.buttonDescription}>{description}</Text>
        </View>
        <Ionicons name="arrow-forward-circle-outline" size={30} color={TEXT_COLOR_GREY} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ScrollView added to prevent clipping on smaller screens */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
            <Image
              source={require('../assets/Logo.png')}
              style={styles.illustrationImage}
              resizeMode="contain"
            />

            <Text style={styles.title}>Welcome to Chovha</Text>
            <Text style={styles.subtitle}>Choose your role to continue</Text>

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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  // Increased flexGrow to push content further up and policy text further down
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60, 
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'flex-start',
  },
  // Style for the placeholder space
  illustrationImage: {
    width: '70%',
    height: width * 0.35, // Responsive height based on screen width
    marginTop: 60,
    marginBottom: 40,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28, // Slightly reduced size
    fontWeight: '800', // Made bold
    color: TEXT_COLOR_DARK,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16, // Slightly reduced size
    fontWeight: '500',
    color: TEXT_COLOR_GREY,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 15, // Reduced gap between buttons
    maxWidth: 400, // Optional: Limit max width on large screens
  },
  button: {
    backgroundColor: CARD_BG_COLOR,
    padding: 20,
    borderRadius: 15,
    // Enhanced shadow to match the card look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF8E1', // Very light background for the icon
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    // Add a light border for definition
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  textContainer: {
    flex: 1,
    marginLeft: 5,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
  },
  buttonDescription: {
    fontSize: 13,
    color: TEXT_COLOR_GREY,
    marginTop: 2,
  },
  policyText: {
    // Increased margin to push it down further
    marginTop: 150, // Pushed down further
    alignSelf: 'center',
    width: '100%',
  },
  policyLink: {
    fontSize: 12,
    color: TEXT_COLOR_GREY,
    textAlign: 'center',
    lineHeight: 18,
  }
});

export default RoleSelectionScreen;