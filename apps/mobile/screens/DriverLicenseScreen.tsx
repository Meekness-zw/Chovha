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