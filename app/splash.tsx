import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function SplashScreen() {
 useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/signup'); // move to signup
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
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