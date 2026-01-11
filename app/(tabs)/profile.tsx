// app/(tabs)/profile.tsx
import { AppText } from '@/components/AppText';
import * as API from '@/src/services/api';
import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    username?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'No user session found');
        setUserData(null);
        return;
      }

      // Try API first
      try {
        const response = await API.getProfile();
        
        if (response.success) {
          setUserData({
            name: response.data.user.username || 'User',
            email: response.data.user.email,
            username: response.data.user.username
          });
          return;
        }
      } catch (apiError) {
        console.log('API failed, trying local storage');
      }
      
      // Fallback to local storage
      const savedUserData = await AsyncStorage.getItem('userData');
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // Function to get first letter of name
  const getInitial = (name: string | undefined): string => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // Function to generate color based on name
  const getAvatarColor = (name: string | undefined): string => {
    if (!name) return colors.primary;
    
    const colorsList = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#FFD166', // Yellow
      '#06D6A0', // Green
      '#118AB2', // Blue
      '#EF476F', // Pink
      '#7209B7', // Purple
      '#F3722C', // Orange
    ];
    
    // Simple hash for consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colorsList[Math.abs(hash) % colorsList.length];
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              Alert.alert('Success', 'Logged out successfully');
              router.replace('/signin');
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText variant="body" style={styles.loadingText}>
          Loading profile...
        </AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          {/* Avatar with first letter */}
          {userData ? (
            <View style={[
              styles.avatarContainer, 
              { backgroundColor: getAvatarColor(userData.name) }
            ]}>
              <AppText variant="title" style={styles.avatarText}>
                {getInitial(userData.name)}
              </AppText>
            </View>
          ) : (
            <View style={styles.guestAvatar}>
              <MaterialIcons name="person" size={32} color={colors.text.secondary} />
            </View>
          )}
          
          {userData ? (
            <>
              <AppText variant="title" style={styles.name}>
                {userData.name}
              </AppText>
              <AppText variant="caption" style={styles.email}>
                {userData.email}
              </AppText>
            </>
          ) : (
            <>
              <AppText variant="title" style={styles.name}>
                Guest User
              </AppText>
              <AppText variant="caption" style={styles.email}>
                Not signed in
              </AppText>
            </>
          )}
        </View>

        <View style={styles.section}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            Personal Information
          </AppText>
          
          <TouchableOpacity style={styles.menuItem}>
            <AppText variant="body" style={styles.label}>Name</AppText>
            <View style={styles.row}>
              <AppText variant="body" style={styles.value}>
                {userData?.name || 'Not available'}
              </AppText>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.text.tertiary}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <AppText variant="body" style={styles.label}>Email</AppText>
            <View style={styles.row}>
              <AppText variant="body" style={styles.value}>
                {userData?.email || 'Not available'}
              </AppText>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.text.tertiary}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <AppText variant="body" style={styles.label}>Language</AppText>
            <View style={styles.row}>
              <AppText variant="body" style={styles.value}>
                English
              </AppText>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.text.tertiary}
              />
            </View>
          </TouchableOpacity>
          
          <AppText variant="subtitle" style={[styles.sectionTitle, styles.sectionMargin]}>
            About
          </AppText>
          
          <TouchableOpacity style={styles.menuItem}>
            <AppText variant="body" style={styles.text}>Privacy</AppText>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.text.tertiary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <AppText variant="body" style={styles.text}>Storage</AppText>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.text.tertiary}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <AppText variant="body" style={styles.text}>Audio Quality</AppText>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.text.tertiary}
            />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <MaterialIcons
              name="logout"
              size={20}
              color="#DC2626"
              style={styles.logoutIcon}
            />
            <AppText variant="body" style={styles.logoutText}>
              Logout
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.text.secondary,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
  },
  // Avatar with first letter
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  guestAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: {
    marginBottom: 4,
    color: colors.text.primary,
  },
  email: {
    color: colors.text.secondary,
    marginBottom: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 40, // Extra padding for scroll
  },
  sectionTitle: {
    marginBottom: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  sectionMargin: {
    marginTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: colors.text.secondary,
    flex: 1,
  },
  value: {
    color: colors.text.primary,
    marginRight: 8,
  },
  text: {
    color: colors.text.primary,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 40,
    marginBottom: 20,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '600',
  },
});