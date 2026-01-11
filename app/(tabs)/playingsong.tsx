// NowPlayingScreen.tsx
import { AppText } from '@/components/AppText';
import * as API from '@/src/services/api';
import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const TOKEN_KEY = 'userToken';
const NOW_PLAYING_KEY = 'nowPlayingSong';

// Helper functions
const saveNowPlayingSong = async (songData: API.SongDetails) => {
  try {
    await AsyncStorage.setItem(NOW_PLAYING_KEY, JSON.stringify(songData));
    console.log(' Saved now playing song');
  } catch (error) {
    console.error('  Error saving now playing:', error);
  }
};

const loadNowPlayingSong = async (): Promise<API.SongDetails | null> => {
  try {
    const saved = await AsyncStorage.getItem(NOW_PLAYING_KEY);
    if (saved) {
      const song = JSON.parse(saved);
      console.log(' Loaded saved song:', song?.title);
      return song;
    }
  } catch (error) {
    console.error('  Error loading saved song:', error);
  }
  return null;
};

export default function NowPlayingScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const title = params.title as string;
  const artist = params.artist as string;
  const thumbnail = params.thumbnail as string;
  const duration = params.duration as string;
  
  const [song, setSong] = useState<API.SongDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [hasRecordedPlay, setHasRecordedPlay] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      console.log(' NowPlayingScreen initialized');
      
      await setupAudio();
      
      if (id) {
        console.log('🎵 Loading song from params:', id);
        await fetchSongDetails();
      } else {
        console.log(' No song ID, trying to load saved song...');
        const savedSong = await loadNowPlayingSong();
        if (savedSong) {
          console.log('  Using saved song:', savedSong.title);
          setSong(savedSong);
          setLoading(false);
          
          if (savedSong.id && savedSong.id !== 'default' && savedSong.id !== 'error') {
            await loadAudio(savedSong.id);
          }
        } else {
          console.log('  No saved song found');
          setSong({
            id: 'default',
            title: 'Welcome to Music Player',
            artist: 'Select a song to begin',
            thumbnail: 'https://via.placeholder.com/600x600/1DB954/FFFFFF?text=Music+App',
            duration: '0:00'
          });
          setLoading(false);
        }
      }
      
      await checkFavoriteStatus();
    };
    
    initialize();
    
    return () => {
      console.log(' Cleaning up audio...');
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id]);

  // Save song when it loads
  useEffect(() => {
    if (song && song.id && song.id !== 'default' && song.id !== 'error') {
      saveNowPlayingSong(song);
    }
  }, [song]);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      console.log('  Audio configured');
    } catch (error) {
      console.error('  Audio setup error:', error);
    }
  };

  const fetchSongDetails = async () => {
    try {
      setLoading(true);
      
      let songData: API.SongDetails | null;
      
      if (title && artist) {
        songData = { id, title, artist, thumbnail, duration: duration || '3:00' };
        console.log('  Using song data from params');
      } else {
        console.log(' Fetching song details from API...');
        songData = await API.getSongInfo(id);
      }
      
      if (songData) {
        console.log('  Song loaded:', songData.title);
        setSong(songData);
        const durationMillis = getDurationInMillis(songData?.duration);
        setTotalDuration(durationMillis);
        await loadAudio(id);
      } else {
        console.log('  No song data received');
        setSong({
          id: 'default',
          title: 'Song Not Found',
          artist: 'Try another song',
          thumbnail: 'https://via.placeholder.com/600x600/333/666?text=Not+Found',
          duration: '0:00'
        });
      }
    } catch (error: any) {
      console.error('  Error fetching song:', error);
      setSong({
        id: 'error',
        title: 'Error Loading Song',
        artist: 'Try another song',
        thumbnail: 'https://via.placeholder.com/600x600/333/666?text=Error',
        duration: '0:00'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAudio = async (songId: string) => {
    try {
      setLoadingAudio(true);
      console.log('🎵 Loading audio for:', songId);
      
      const streamUrl = await API.getAudioStreamUrl(songId);
      
      if (!streamUrl) {
        throw new Error('No stream URL available');
      }

      console.log('  Stream URL obtained');
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { 
          shouldPlay: false, 
          progressUpdateIntervalMillis: 1000,
          isLooping: false
        },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      console.log('  Audio loaded successfully');
    } catch (error: any) {
      console.error('  Audio load error:', error);
      Alert.alert('Playback Error', 'Unable to load audio. The song may not be available.', [
        { text: 'Try Again', onPress: () => loadAudio(songId) },
        { text: 'Go Back', onPress: () => router.back(), style: 'cancel' }
      ]);
    } finally {
      setLoadingAudio(false);
    }
  };

 const recordPlay = async () => {
  if (!song || hasRecordedPlay || song.id === 'default' || song.id === 'error') {
    console.log('  Skipping record play:', {
      hasSong: !!song,
      alreadyRecorded: hasRecordedPlay,
      songId: song?.id
    });
    return;
  }
  
  try {
    console.log(' Attempting to record play for:', song.title);
    
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    console.log(' Token from storage:', token ? 'YES' : 'NO');
    
    if (!token) {
      console.log(' No token found, skipping history recording');
      return;
    }
    
    console.log(' Calling API.recordPlay...');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('History recording timeout')), 5000);
    });
    
    const recordPromise = API.recordPlay({
      songId: song.id,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail || '',
      duration: song.duration || '3:00'
    }, token);
    
    // Race between API call and timeout
    const response = await Promise.race([recordPromise, timeoutPromise]);
    
    console.log('  Play recorded successfully:', response);
    setHasRecordedPlay(true);
    
  } catch (error: any) {
    console.error(' Record play error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Don't set hasRecordedPlay on error - let it try again
    console.log(' Will try recording again on next play');
  }
};

  const checkFavoriteStatus = async () => {
    if (!id || !song || song.id === 'default' || song.id === 'error') return;
    
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log(' Checking favorite, token:', token ? 'YES  ' : 'NO  ');
      
      if (!token) {
        setIsFavorite(false);
        return;
      }
      
      const response = await API.checkFavorite(id, token);
      if (response.success && response.data) {
        setIsFavorite(response.data.isFavorite);
        console.log('  Favorite status:', response.data.isFavorite);
      } else {
        setIsFavorite(false);
      }
    } catch (error: any) {
      console.error('  Check favorite error:', error);
      setIsFavorite(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
  console.log(' Playback status:', {
    isLoaded: status.isLoaded,
    isPlaying: status.isPlaying,
    position: status.positionMillis,
    duration: status.durationMillis,
    didJustFinish: status.didJustFinish
  });
  
  if (status.isLoaded) {
    setPosition(status.positionMillis);
    setTotalDuration(status.durationMillis || totalDuration);
    setIsPlaying(status.isPlaying);

    // Record play when song starts (but wait 2 seconds to ensure it's intentional)
    if (status.isPlaying && !hasRecordedPlay && status.positionMillis > 2000) {
      console.log(' Song playing for >2s, recording play...');
      recordPlay();
    }

    if (status.didJustFinish) {
      console.log(' Playback finished');
      setIsPlaying(false);
      setPosition(0);
      sound?.setPositionAsync(0);
      setHasRecordedPlay(false);
    }
  } else if (status.error) {
    console.error('  Playback error:', status.error);
    setIsPlaying(false);
  }
};

  const togglePlayback = async () => {
    console.log(' Toggle playback, currently:', isPlaying ? 'Playing' : 'Paused');
    
    if (!sound) {
      console.log('  No sound object');
      Alert.alert('Error', 'Audio not loaded yet');
      return;
    }
    
    try {
      if (isPlaying) {
        console.log('Pausing playback...');
        await sound.pauseAsync();
        // Note: isPlaying will be updated by onPlaybackStatusUpdate
      } else {
        console.log(' Starting playback...');
        await sound.playAsync();
        // Note: isPlaying will be updated by onPlaybackStatusUpdate
      }
    } catch (error: any) {
      console.error('  Playback toggle error:', error);
      Alert.alert('Error', `Failed to ${isPlaying ? 'pause' : 'play'}: ${error.message}`);
    }
  };

  const handleToggleFavorite = async () => {
    if (!song || song.id === 'default' || song.id === 'error' || togglingFavorite) return;
    
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      console.log(' Toggle favorite');
      console.log(' Token from storage:', token ? 'YES  ' : 'NO  ');
      
      if (!token) {
        Alert.alert('Login Required', 'Please login to add favorites');
        return;
      }
      
      setTogglingFavorite(true);
      
      if (isFavorite) {
        console.log(' Removing from favorites');
        const response = await API.removeFromFavorites(song.id, token);
        if (response.success) {
          setIsFavorite(false);
          console.log('  Removed from favorites');
        } else {
          console.log('  Remove failed:', response.message);
        }
      } else {
        console.log(' Adding to favorites');
        const response = await API.addToFavorites({
          songId: song.id,
          title: song.title,
          artist: song.artist,
          thumbnail: song.thumbnail || '',
          duration: song.duration || '3:00'
        }, token);
        
        if (response.success) {
          setIsFavorite(true);
          console.log('  Added to favorites');
        } else {
          console.log('  Add failed:', response.message);
        }
      }
    } catch (error: any) {
      console.error(' Favorite error:', error);
      
      const errorMsg = error.message || '';
      if (errorMsg.includes('already in favorites')) {
        setIsFavorite(true);
        Alert.alert('Info', 'Song already in favorites');
      } else if (errorMsg.includes('not found')) {
        setIsFavorite(false);
        Alert.alert('Info', 'Song not in favorites');
      } else if (errorMsg.includes('authorized') || errorMsg.includes('token')) {
        Alert.alert('Session Expired', 'Please login again');
      } else {
        Alert.alert('Error', 'Failed to update favorites');
      }
    } finally {
      setTogglingFavorite(false);
    }
  };

  const skipForward = async () => {
    if (!sound) return;
    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.min(
          status.positionMillis + 10000,
          status.durationMillis || totalDuration
        );
        await sound.setPositionAsync(newPosition);
        console.log(' Skipped forward 10s');
      }
    } catch (error) {
      console.error('Skip forward error:', error);
    }
  };

  const skipBackward = async () => {
    if (!sound) return;
    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(status.positionMillis - 10000, 0);
        await sound.setPositionAsync(newPosition);
        console.log('Skipped backward 10s');
      }
    } catch (error) {
      console.error('Skip backward error:', error);
    }
  };

  const formatTime = (millis: number): string => {
    if (!millis || millis <= 0) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDurationInMillis = (durationString: string | undefined): number => {
    if (!durationString) return 180000;
    try {
      const [minutes, seconds] = durationString.split(':').map(Number);
      return (minutes * 60 + seconds) * 1000;
    } catch {
      return 180000;
    }
  };

  const progressPercentage = totalDuration > 0 ? (position / totalDuration) * 100 : 0;

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText variant="body" style={styles.loadingText}>Loading song...</AppText>
      </View>
    );
  }

  if (!song) {
    return (
      <View style={[styles.container, styles.center]}>
        <AppText variant="body" style={{ color: colors.text.primary }}>Song not found</AppText>
        <TouchableOpacity onPress={() => router.back()}>
          <AppText variant="body" style={{ color: colors.primary, marginTop: 20 }}>Go Back</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
        </TouchableOpacity>
        <AppText variant="body" style={styles.headerText}>Playing Now</AppText>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.albumContainer}>
        <Image 
          source={{ uri: song.thumbnail }} 
          style={styles.albumImage} 
          resizeMode="cover"
          defaultSource={require('@/assets/images/music-icon.png')}
        />
      </View>

      <View style={styles.songRow}>
        <View style={styles.songInfo}>
          <AppText variant="subtitle" style={styles.songTitle} numberOfLines={2}>
            {song.title}
          </AppText>
          <AppText variant="caption" style={styles.artist} numberOfLines={1}>
            {song.artist}
          </AppText>
        </View>

        {song.id !== 'default' && song.id !== 'error' && (
          <TouchableOpacity 
            onPress={handleToggleFavorite}
            disabled={togglingFavorite}
            style={togglingFavorite ? { opacity: 0.5 } : {}}
          >
            {togglingFavorite ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons 
                name={isFavorite ? "favorite" : "favorite-border"} 
                size={24} 
                color={isFavorite ? colors.primary : '#fff'} 
              />
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progressPercentage}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <AppText variant="caption" style={styles.timeText}>{formatTime(position)}</AppText>
          <AppText variant="caption" style={styles.timeText}>{formatTime(totalDuration)}</AppText>
        </View>
      </View>

     

      {song.id !== 'default' && song.id !== 'error' && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={skipBackward} disabled={!sound || loadingAudio}>
            <MaterialIcons 
              name="replay-10" 
              size={36} 
              color={sound && !loadingAudio ? '#fff' : '#666'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.playButton, (!sound || loadingAudio) && styles.disabledButton]} 
            onPress={togglePlayback}
            disabled={!sound || loadingAudio}
          >
            {loadingAudio ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons 
                name={isPlaying ? "pause" : "play-arrow"} 
                size={42} 
                color="#fff" 
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={skipForward} disabled={!sound || loadingAudio}>
            <MaterialIcons 
              name="forward-10" 
              size={36} 
              color={sound && !loadingAudio ? '#fff' : '#666'} 
            />
          </TouchableOpacity>
        </View>
      )}

      {song.id === 'default' && (
        <TouchableOpacity 
          style={styles.browseButton}
          onPress={() => router.push('/(tabs)')}
        >
          <MaterialIcons name="search" size={20} color="#fff" />
          <AppText variant="body" style={styles.browseButtonText}>Browse Songs</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary, padding: 20 },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: colors.text.primary, marginTop: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  headerText: { color: '#fff' },
  albumContainer: { alignItems: 'center', marginVertical: 40 },
  albumImage: { width: 280, height: 280, borderRadius: 16, backgroundColor: '#222' },
  songRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  songInfo: { flex: 1, marginRight: 10 },
  songTitle: { color: colors.text.primary, fontSize: 18, fontWeight: '600', marginBottom: 4 },
  artist: { color: colors.text.tertiary, fontSize: 14 },
  progressContainer: { marginBottom: 20 },
  progressBar: { height: 4, backgroundColor: '#3A3A3A', borderRadius: 2, overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  timeText: { color: colors.text.tertiary, fontSize: 12 },
  statusText: { 
    textAlign: 'center', 
    color: colors.text.tertiary, 
    marginBottom: 20,
    fontSize: 14 
  },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 40 },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { backgroundColor: '#666' },
  browseButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});