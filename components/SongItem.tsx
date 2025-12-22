import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface SongItemProps {
  image: any;
  title: string;
  artist: string;
  time?: string;
  onPress?: () => void;
  showPlayButton?: boolean;
  isActive?: boolean;
}

export const SongItem = ({ 
  image, 
  title, 
  artist, 
  time, 
  onPress, 
  showPlayButton = true,
  isActive = false
}: SongItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image source={image} style={styles.image} />
      
      <View style={styles.textContainer}>
        <AppText variant="body" style={styles.title}>{title}</AppText>
        <AppText variant="caption" style={styles.artist}>{artist}</AppText>
        {time && <AppText variant="caption" style={styles.time}>{time}</AppText>}
      </View>
      
      {showPlayButton && (
        <View style={[styles.playButton, isActive && styles.activePlayButton]}>
          <MaterialIcons name="play-arrow" size={18} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  activeContainer: {
    backgroundColor: colors.background.tertiary,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
  },
  artist: {
    color: colors.text.primary,
    marginTop: 2,
  },
  time: {
    color: colors.text.primary,
    marginTop: 2,
  },
  playButton: {
    backgroundColor: colors.background.tertiary,
    width: 25,
    height: 25,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePlayButton: {
    backgroundColor: colors.primary,
  },
});