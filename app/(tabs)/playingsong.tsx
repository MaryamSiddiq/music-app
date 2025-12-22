import { AppText } from '@/components/AppText';
import { recentPlays } from '@/src/data/recentPlays';
import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function NowPlayingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const song = recentPlays.find(item => item.id === Number(id));

  if (!song) return null;

  const [currentTime, totalTime] = song.time.split('/');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
        </TouchableOpacity>

        <AppText variant="body" style={styles.headerText}>
          Playing Now
        </AppText>

        <View style={{ width: 22 }} />
      </View>

      {/* Album Art */}
      <View style={styles.albumContainer}>
        <Image
          source={song.image}
          style={styles.albumImage}
          resizeMode="cover"   
        />
      </View>

      {/* Song Info + Favourite */}
      <View style={styles.songRow}>
        <View style={styles.songInfo}>
          <AppText variant="subtitle" style={styles.songTitle}>
            {song.title}
          </AppText>
          <AppText variant="caption" style={styles.artist}>
            {song.artist}
          </AppText>
        </View>

        <TouchableOpacity>
          <MaterialIcons name="favorite" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>

        {/* Time Row */}
        <View style={styles.timeRow}>
          <AppText variant="caption" style={styles.timeText}>
            {currentTime}
          </AppText>
          <AppText variant="caption" style={styles.timeText}>
            {totalTime}
          </AppText>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <MaterialIcons name="skip-previous" size={30} color="#fff" />

        <TouchableOpacity style={styles.playButton}>
          <MaterialIcons name="play-arrow" size={42} color="#fff" />
        </TouchableOpacity>

        <MaterialIcons name="skip-next" size={30} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },

  headerText: {
    color: '#fff',
  },

  albumContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },

  albumImage: {
    width: 280,
    height: 280,
    borderRadius: 16,
    backgroundColor: '#222', // fallback to avoid blur flash
  },

  songRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  songInfo: {
    flex: 1,
    marginRight: 10,
  },

  songTitle: {
    color: colors.text.primary,
  },

  artist: {
    color: colors.text.tertiary,
  },

  progressContainer: {
    marginBottom: 40,
  },

  progressBar: {
    height: 4,
    backgroundColor: '#3A3A3A',
    borderRadius: 2,
  },

  progress: {
    width: '45%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  timeText: {
    color: colors.text.tertiary,
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },

  playButton: {
    width: 60,
    height: 60,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
