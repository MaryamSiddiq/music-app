import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlaylistDetailScreen() {
  const tracks = [
    { id: 1, title: 'Song Title 1', artist: 'Artist Name', duration: '3:45' },
    { id: 2, title: 'Song Title 2', artist: 'Artist Name', duration: '4:12' },
    { id: 3, title: 'Song Title 3', artist: 'Artist Name', duration: '3:28' },
    { id: 4, title: 'Song Title 4', artist: 'Artist Name', duration: '5:01' },
    { id: 5, title: 'Song Title 5', artist: 'Artist Name', duration: '3:55' },
  ];

  return (
         <SafeAreaView style={styles.container}>
    
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <AppText variant="body">←</AppText>
        </TouchableOpacity>
        <AppText variant="subtitle">Playing now</AppText>
        <TouchableOpacity style={styles.moreButton}>
          <AppText variant="body">⋮</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.albumArt} />
        
        <View style={styles.info}>
          <AppText variant="title" style={styles.playlistTitle}>
            Playlist Name
          </AppText>
          <AppText variant="caption" style={styles.playlistSubtitle}>
            Various Artists • 24 songs
          </AppText>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.shuffleButton}>
            <AppText variant="body">🔀</AppText>
            <AppText variant="caption" style={styles.shuffleText}>Shuffle</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButton}>
            <AppText variant="title" style={styles.playIcon}>▶</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.trackList}>
          {tracks.map((track, index) => (
            <TouchableOpacity key={track.id} style={styles.trackItem}>
              <View style={styles.trackNumber}>
                <AppText variant="caption">{index + 1}</AppText>
              </View>
              <View style={styles.trackThumbnail} />
              <View style={styles.trackInfo}>
                <AppText variant="body" numberOfLines={1}>{track.title}</AppText>
                <AppText variant="caption" numberOfLines={1}>{track.artist}</AppText>
              </View>
              <AppText variant="caption" style={styles.duration}>
                {track.duration}
              </AppText>
              <TouchableOpacity style={styles.trackMoreButton}>
                <AppText variant="body">⋮</AppText>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  moreButton: {
    padding: 8,
  },
  albumArt: {
    width: '100%',
    height: 300,
    backgroundColor: colors.surface,
  },
  info: {
    padding: 20,
    alignItems: 'center',
  },
  playlistTitle: {
    marginBottom: 8,
  },
  playlistSubtitle: {
    color: colors.text.tertiary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 24,
  },
  shuffleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  shuffleText: {
    color: colors.text.primary,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: colors.surface,
  },
  trackList: {
    paddingHorizontal: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  trackNumber: {
    width: 24,
    marginRight: 12,
  },
  trackThumbnail: {
    width: 40,
    height: 40,
    backgroundColor: colors.surface,
    borderRadius: 4,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  duration: {
    marginRight: 12,
    color: colors.text.tertiary,
  },
  trackMoreButton: {
    padding: 4,
  },
});
