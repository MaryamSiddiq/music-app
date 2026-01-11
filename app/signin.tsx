// screens/SignInScreen.tsx (NO AUTH CONTEXT - DIRECT STORAGE)
import { AppText } from '@/components/AppText';
import * as API from '@/src/services/api';
import { colors } from '@/src/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
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

const TOKEN_KEY = 'userToken';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    try {
      setLoading(true);
      console.log(' Logging in:', email.trim().toLowerCase());
      
      const response = await API.login({
        email: email.trim().toLowerCase(),
        password: password.trim()
      });

      if (response.success && response.data?.token) {
        const token = response.data.token;
        console.log('   Login success, token:', token.substring(0, 20) + '...');
        
        // Save token directly to AsyncStorage
        await AsyncStorage.setItem(TOKEN_KEY, token);
        console.log(' Token saved to storage');
        
        // Verify it was saved
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        console.log('   Verified token in storage:', savedToken ? 'YES' : 'NO');
        
        // Navigate
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid credentials');
      }
    } catch (error: any) {
      console.error(' Login error:', error);
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/signup_bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <Image
            source={require('@/assets/images/music-icon.png')}
            style={styles.appIcon}
            resizeMode="contain"
          />
        </View>

        <AppText variant='subtitle' style={styles.welcomeText}>Vii Music</AppText>
        <AppText variant='title' style={styles.title}>Sign In to your account</AppText>

        <View style={styles.form}>
          <View>
            <AppText variant='caption' style={styles.label}>Email Address</AppText>
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

        <TouchableOpacity activeOpacity={0.9} onPress={handleSignIn} disabled={loading}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            {loading ? (
              <ActivityIndicator color={colors.text.primary} />
            ) : (
              <AppText variant='body' style={styles.primaryButtonText}>Sign in</AppText>
            )}
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <View style={styles.rememberContainer}>
            <Checkbox
              value={rememberMe}
              onValueChange={setRememberMe}
              color={rememberMe ? colors.primary : undefined}
            />
            <AppText variant="caption" style={styles.rememberText}>Remember me</AppText>
          </View>

          <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Password reset coming soon')}>
            <AppText variant="caption" style={styles.forgotText}>Forgot your password?</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <AppText style={styles.dividerText}>Or continue with</AppText>
          <View style={styles.line} />
        </View>

        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={() => Alert.alert('Coming Soon', 'Google sign in coming soon')}
        >
          <Image source={require('@/assets/icons/google-icon.png')} style={styles.googleIcon} />
          <AppText variant='body' style={styles.googleText}>Sign in with Google</AppText>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <AppText variant='body' style={styles.signupText}>Don't have an account?</AppText>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <AppText variant='body' style={styles.signupLink}> Sign up</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 100, paddingBottom: 40, flexGrow: 1 },
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
  appIcon: { width: 28, height: 28 },
  welcomeText: { color: colors.surface, textAlign: 'center' },
  title: { textAlign: 'center', color: colors.text.primary },
  form: { gap: 18, marginBottom: 28, marginTop: 24 },
  label: { color: colors.text.primary, marginBottom: 6 },
  input: {
    backgroundColor: colors.text.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 12,
    height: 48,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 28,
    height: 48,
    justifyContent: 'center',
  },
  primaryButtonText: { color: colors.text.primary },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  dividerText: { color: '#9CA3AF', marginHorizontal: 12, fontSize: 12 },
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
  googleIcon: { width: 20, height: 20 },
  googleText: { color: '#374151', fontWeight: '500' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -12,
    marginBottom: 14
  },
  forgotText: { color: colors.primary },
  rememberContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rememberText: { color: '#9CA3AF' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  signupText: { color: colors.text.primary },
  signupLink: { color: colors.primary, fontWeight: '600' },
});