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