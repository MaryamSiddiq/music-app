// screens/CreateAccountScreen.tsx (Signup)
import { AppText } from '@/components/AppText';
import { useAuth } from '@/src/context/AuthContext';
import * as API from '@/src/services/api';
import { colors } from '@/src/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function CreateAccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { setUserToken } = useAuth(); // Get setUserToken from auth context

  const handleSignUp = async () => {
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

  if (password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters');
    return;
  }

  try {
    setLoading(true);
    console.log('Attempting signup...');
    console.log('Signup data:', { name, email: email.trim().toLowerCase() });
    
    // FIX: Call signup API instead of login API
    const response = await API.signup({
      username: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim()
    });

    console.log('📥 Signup response:', JSON.stringify(response, null, 2));

    if (response.success) {
      console.log('   Signup successful');
      
      // Option 1: Automatically log the user in after signup
      if (response.data?.token) {
        console.log(' Token received:', response.data.token.substring(0, 20) + '...');
        
        // Save token
        await setUserToken(response.data.token);
        console.log(' Token saved to context and storage');
        
        // Add a small delay to ensure context updates
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log(' Navigating to main app...');
        
        // Navigate to the main app with tabs
        router.replace('/(tabs)');
        
      } else {
        console.log(' No token received after signup');
        Alert.alert('Signup Error', 'No token received. Please try signing in.');
      }
      
    } else {
      console.log(' Signup failed:', response.message);
      Alert.alert('Signup Failed', response.message || 'Signup failed. Please try again.');
    }
  } catch (error: any) {
    console.error('Signup error:', error);

    // Handle specific error messages
    let errorMessage = 'Signup failed. Please try again.';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.errors) {
      // Handle validation errors
      const firstError = Object.values(error.errors)[0];
      errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
    }

    Alert.alert('Error', errorMessage);
  } finally {
    setLoading(false);
  }
};
  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    // For now, just show a message
    Alert.alert('Coming Soon', 'Google signup will be available soon');
  };

  const handleNavigateToSignIn = () => {
    // Navigate to sign in screen
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
              editable={!loading}
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
              editable={!loading}
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
              editable={!loading}
            />
          </View>
        </View>

        {/* Primary Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSignUp}
          disabled={loading}
          style={loading ? { opacity: 0.7 } : {}}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            {loading ? (
              <ActivityIndicator color={colors.text.primary} />
            ) : (
              <AppText variant='body' style={styles.primaryButtonText}>
                Sign Up
              </AppText>
            )}
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
        <TouchableOpacity
          style={[styles.googleButton, loading && { opacity: 0.7 }]}
          onPress={handleGoogleSignUp}
          disabled={loading}
        >
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
          <TouchableOpacity
            onPress={handleNavigateToSignIn}
            disabled={loading}
          >
            <AppText variant='body' style={styles.signInText}>
              {' '}Sign in
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

// Styles remain the same...
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
    height: 48,
    justifyContent: 'center',
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