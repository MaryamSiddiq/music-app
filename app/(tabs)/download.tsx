import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const downloadedSongs = [
  {
    id: '1',
    title: 'Live Long',
    artist: 'Sangeetha Rajeshwaran',
    image: require('@/assets/images/download1.png'),
  },
  {
    id: '2',
    title: 'Live Long',
    artist: 'S.P. Balasubrahmanyam',
    image: require('@/assets/images/download2.png'),

  },
  {
    id: '3',
    title: 'Live Long',
    artist: 'Nakash Aziz',
    image: require('@/assets/images/download3.png'),
  },
   {
    id: '4',
    title: 'Live Long',
    artist: 'Nakash Aziz',
    image: require('@/assets/images/download4.png'),
  }, {
    id: '5',
    title: 'Live Long',
    artist: 'Nakash Aziz',
    image: require('@/assets/images/download5.png'),
  }, {
    id: '6',
    title: 'Live Long',
    artist: 'Nakash Aziz',
    image: require('@/assets/images/download6.png'),
  },
];

export default function DownloadScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="subtitle" style={styles.headerText}>
          Downloads
        </AppText>
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {downloadedSongs.map(item => (
          <View key={item.id} style={styles.songItem}>
            {/* Image */}
            <Image source={item.image} style={styles.thumbnail} />

            {/* Title & Artist */}
            <View style={styles.textContainer}>
              <AppText variant="body" style={styles.title}>
                {item.title}
              </AppText>
              <AppText variant="caption" style={styles.artist}>
                {item.artist}
              </AppText>
            </View>

            {/* Three Dots */}
            <TouchableOpacity style={styles.moreBtn}>
              <MaterialIcons
                name="more-vert"
                size={20}
                color={colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  headerText: {
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 20,
  },

  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 14,
    padding: 12,
    borderRadius: 12,

  },

  thumbnail: {
    width: 48,
    height: 48,
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

  moreBtn: {
    padding: 6,
  },
});
