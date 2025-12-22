import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CreateAccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = () => {
    // Basic validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    // Navigate to the main app with tabs
    // Option 1: Navigate to tabs layout
    router.replace('/(tabs)');
    
    // Option 2: If you want to navigate to a specific tab
    // router.replace('/(tabs)/home');
  };

  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    // For now, just navigate to tabs
    router.replace('/(tabs)');
  };

  const handleNavigateToSignIn = () => {
    // Navigate to sign in screen if you have one
    router.push('/signin');
  };

  return (
    <ImageBackground
      source={require('@/assets/images/signup_bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
          {/* App Icon */}
          <View style={styles.iconContainer}>
            <Image
              source={require('@/assets/images/music-icon.png')}
              style={styles.appIcon}
              resizeMode="contain"
            />
          </View>

          {/* Welcome */}
          <AppText variant='subtitle' style={styles.welcomeText}>
            Welcome to Vii Music
          </AppText>

          {/* Title */}
          <AppText variant='title' style={styles.title}>
            Create your account
          </AppText>

          {/* Inputs */}
          <View style={styles.form}>
            <View>
              <AppText variant='caption' style={styles.label}>Name</AppText>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="vikashini"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View>
              <AppText variant='caption' style={styles.label}>Email</AppText>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Spotify@gmail.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <AppText variant='caption' style={styles.label}>Password</AppText>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="************"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />
            </View>
          </View>

          {/* Primary Button */}
          <TouchableOpacity activeOpacity={0.9} onPress={handleSignIn}>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <AppText variant='body' style={styles.primaryButtonText}>
                Sign in
              </AppText>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <AppText style={styles.dividerText}>
              Or continue with
            </AppText>
            <View style={styles.line} />
          </View>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
            <Image
              source={require('@/assets/icons/google-icon.png')}
              style={styles.googleIcon}
            />
            <AppText variant='body' style={styles.googleText}>
              Sign up with Google
            </AppText>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <AppText variant='body' style={styles.footerText}>
              Already have an account?
            </AppText>
            <TouchableOpacity onPress={handleNavigateToSignIn}>
              <AppText variant='body' style={styles.signInText}>
                {' '}Sign in
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 50
  },

  appIcon: {
    width: 28,
    height: 28,
  },

  welcomeText: {
    color: colors.surface,
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    color: colors.text.primary,
  },

  form: {
    gap: 18,
    marginBottom: 28,
  },
  label: {
    color: colors.text.primary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.text.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 12
  },

  primaryButton: {
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 28,
  },
  primaryButtonText: {
    color: colors.text.primary,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    color: '#9CA3AF',
    marginHorizontal: 12,
    fontSize: 12,
  },

  googleButton: {
    backgroundColor: colors.text.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleText: {
    color: '#374151',
    fontWeight: '500',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: colors.text.primary,
  },
  signInText: {
    color: colors.primary,
    fontWeight: '600',
  },
});