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