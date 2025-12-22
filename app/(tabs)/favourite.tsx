import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const favouriteSongs = [
  {
    id: '1',
    title: 'Dailamo Dailamo',
    artist: 'Sangeetha Rajeshwaran, Vijay Annoty',
  },
  {
    id: '2',
    title: 'Saara Kaattrae',
    artist: 'S.P. Balasubrahmanyam',
  },
  {
    id: '3',
    title: 'Marundhaani',
    artist: 'Nakash Aziz, Anthony Daasan',
  },
  {
    id: '4',
    title: 'Oru Devadhai',
    artist: 'Roopkumar Rathod',
  },
  {
    id: '5',
    title: 'Marundhaani',
    artist: 'Nakash Aziz, Anthony Daasan',
  },
  {
    id: '6',
    title: 'Marundhaani',
    artist: 'Nakash Aziz, Anthony Daasan',
  },
];

export default function FavouriteScreen() {
  const [activeSongId, setActiveSongId] = useState<string | null>(null);

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

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {favouriteSongs.map(item => {
          const isActive = item.id === activeSongId;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => setActiveSongId(item.id)}
              style={[
                styles.songItem,
                isActive && styles.activeItem,
              ]}
            >
              <View style={{ flex: 1 }}>
                <AppText variant="body" style={styles.title}>
                  {item.title}
                </AppText>
                <AppText variant="caption" style={styles.artist}>
                  {item.artist}
                </AppText>
              </View>

              <View
                style={[
                  styles.playBtn,
                  isActive && styles.activePlayBtn,
                ]}
              >
                <MaterialIcons
                  name="play-arrow"
                  size={18}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
          );
        })}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  profile: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 14,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },

  activeItem: {
    backgroundColor: '#4E4E54',
  },

  title: {
    color: colors.primary,
  },

  artist: {
    color: colors.text.primary,
    marginTop: 2,
  },

  playBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6C6C72',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activePlayBtn: {
    backgroundColor: colors.primary,
  },
});
