

// FavouriteScreen.tsx (WITH REAL API DATA)
import { AppText } from '@/components/AppText';
import * as API from '@/src/services/api';
import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOKEN_KEY = 'userToken';

interface FavoriteSong {
  _id: string;
  songId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
}

export default function FavouriteScreen() {
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSongId, setActiveSongId] = useState<string | null>(null);

  // Fetch favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      if (!token) {
        console.log('No token, user not logged in');
        setFavorites([]);
        return;
      }

      console.log('📥 Fetching favorites...');
      const response = await API.getFavorites(token);
      
      if (response.success && response.data) {
        setFavorites(response.data);
        console.log('  Loaded', response.data.length, 'favorites');
      } else {
        setFavorites([]);
      }
    } catch (error: any) {
      console.error('   Error fetching favorites:', error);
      // Don't show alert on every error - just log it
      if (error.message?.includes('401') || error.message?.includes('authorized')) {
        Alert.alert('Session Expired', 'Please login again');
      }
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const handlePlaySong = (song: FavoriteSong) => {
    setActiveSongId(song.songId);
    
    // Navigate to playing screen
    router.push({
      pathname: '/playingsong',
      params: {
        id: song.songId,
        title: song.title,
        artist: song.artist,
        thumbnail: song.thumbnail,
        duration: song.duration,
      },
    });
  };

  const handleRemoveFavorite = async (song: FavoriteSong) => {
    Alert.alert(
      'Remove from Favorites',
      `Remove "${song.title}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem(TOKEN_KEY);
              if (!token) return;

              console.log(' Removing:', song.title);
              const response = await API.removeFromFavorites(song.songId, token);
              
              if (response.success) {
                // Remove from local state immediately
                setFavorites(prev => prev.filter(f => f.songId !== song.songId));
                console.log('  Removed from favorites');
              }
            } catch (error) {
              console.error('   Error removing favorite:', error);
              Alert.alert('Error', 'Failed to remove from favorites');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) return;

    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await API.clearFavorites(token);
              setFavorites([]);
              console.log('  All favorites cleared');
            } catch (error) {
              console.error('   Error clearing favorites:', error);
              Alert.alert('Error', 'Failed to clear favorites');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText variant="body" style={styles.loadingText}>
            Loading favorites...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.playBtn}>
          <MaterialIcons name="favorite" size={16} color={colors.primary} />
        </TouchableOpacity>

        <Image
          source={require('@/assets/images/profile.png')}
          style={styles.profile}
        />

        <TouchableOpacity style={styles.playBtn}>
          <MaterialIcons
            name="more-horiz"
            size={18}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      </View>
      {/* Empty State */}
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={64} color="#666" />
          <AppText variant="subtitle" style={styles.emptyTitle}>
            No Favorites Yet
          </AppText>
          <AppText variant="caption" style={styles.emptyText}>
            Songs you favorite will appear here
          </AppText>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)')}
          >
            <AppText variant="body" style={styles.browseButtonText}>
              Browse Music
            </AppText>
          </TouchableOpacity>
        </View>
      ) : (
        /* List */
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {favorites.map(item => {
            const isActive = item.songId === activeSongId;

            return (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.8}
                onPress={() => handlePlaySong(item)}
                onLongPress={() => handleRemoveFavorite(item)}
                style={[
                  styles.songItem,
                  isActive && styles.activeItem,
                ]}
              >
                {/* Thumbnail */}
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.thumbnail}
                />

                {/* Song Info */}
                <View style={styles.songInfo}>
                  <AppText variant="body" style={styles.title} numberOfLines={1}>
                    {item.title}
                  </AppText>
                  <AppText variant="caption" style={styles.artist} numberOfLines={1}>
                    {item.artist}
                  </AppText>
                </View>

                {/* Duration */}
                <AppText variant="caption" style={styles.duration}>
                  {item.duration}
                </AppText>

                {/* Play Button */}
                <TouchableOpacity
                  style={[
                    styles.playBtn,
                    isActive && styles.activePlayBtn,
                  ]}
                  onPress={() => handlePlaySong(item)}
                >
                  <MaterialIcons
                    name="play-arrow"
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: colors.text.secondary,
    marginTop: 12,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },

  headerCenter: {
    alignItems: 'center',
  },

  headerTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerSubtitle: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: 2,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emptyTitle: {
    color: colors.text.primary,
    marginTop: 16,
    fontSize: 20,
  },

  emptyText: {
    color: colors.text.tertiary,
    marginTop: 8,
    textAlign: 'center',
  },

  browseButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 24,
  },

  browseButtonText: {
    color: colors.text.primary,
    fontWeight: '600',
  },

  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },

  activeItem: {
    backgroundColor: '#4E4E54',
  },

  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#222',
    marginRight: 12,
  },

  songInfo: {
    flex: 1,
    marginRight: 8,
  },

  title: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '500',
  },

  artist: {
    color: colors.text.tertiary,
    marginTop: 2,
    fontSize: 13,
  },

  duration: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginRight: 12,
  },

  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6C6C72',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activePlayBtn: {
    backgroundColor: colors.primary,
  },
});