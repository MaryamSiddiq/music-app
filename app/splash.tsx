// screens/SplashScreen.tsx
import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // Check if token exists in AsyncStorage
        const userToken = await AsyncStorage.getItem('userToken');
        
        // Wait for 2.5 seconds total (splash screen duration)
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        if (userToken) {
          console.log('Token found, navigating to home');
          router.replace('/(tabs)'); // Navigate to main app
        } else {
          console.log(' No token found, navigating to signup');
          router.replace('/signup'); // Navigate to signup
        }
      } catch (error) {
        console.error('Error checking token:', error);
        // On error, go to signup
        router.replace('/signup');
      }
    };

    checkAuthAndNavigate();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={require('@/assets/images/music-icon.png')}
          style={styles.icon}
        />
      </View>

      <AppText variant="title" style={styles.title}>
        Start Tuning Your ideas into Reality
      </AppText>

      <AppText variant="subtitle" style={styles.subtitle}>
        Listen to Vii Music
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  icon: {
    width: 111.91,
    height: 125.92
  },
  title: {
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.surface,
    textAlign: 'center',
  },
});