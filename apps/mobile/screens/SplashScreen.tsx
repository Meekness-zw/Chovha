import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('RoleSelection');
    }, 1200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        source={require('../assets/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator style={styles.spinner} color="#D4AF37" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
  spinner: {
    marginTop: 20,
  },
});

export default SplashScreen;
