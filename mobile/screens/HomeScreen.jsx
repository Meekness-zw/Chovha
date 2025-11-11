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