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