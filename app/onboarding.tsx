import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.image} />
      </View>

      <View style={styles.content}>
        <AppText variant="title" style={styles.title}>
          Welcome to the world of YM Music
        </AppText>
        
        <AppText variant="body" style={styles.description}>
          Discover millions of songs and podcasts. Create your own playlists. 
          All available to enjoy free, on any device, anywhere.
        </AppText>

        <TouchableOpacity style={styles.button}>
          <AppText variant="body" style={styles.buttonText}>
            Get Started
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.pagination}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.surface,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    opacity: 0.3,
  },
  activeDot: {
    backgroundColor: colors.primary,
    opacity: 1,
  },
});