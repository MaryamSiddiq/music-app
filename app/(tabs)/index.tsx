// HomeScreen.tsx
import { AppText } from '@/components/AppText';
import { SectionHeader } from '@/components/SectionHeader';
import * as API from '@/src/services/api';
import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PartyCard {
  id: number;
  title: string;
  subtitle: string;
  image: any;
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<string>('Recommendation');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<API.Song[]>([]);
  const [recentSongs, setRecentSongs] = useState<API.Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  const tabs: string[] = ['Recommendation', 'Trending', 'Beauty', 'Business'];

  const partyCards: PartyCard[] = [
    { id: 1, title: 'Friday Party', subtitle: 'Party mood !', image: require('@/assets/images/party-card1.png') },
    { id: 2, title: 'Saturday Party', subtitle: 'Party mood !', image: require('@/assets/images/party-card2.png') },
  ];

  // Fetch username and recent songs on component mount
  useEffect(() => {
    fetchUsername();
    fetchRecentSongs();
  }, []);

  // Fetch songs based on active tab
  useEffect(() => {
    if (activeTab === 'Recommendation') {
      fetchRecommendations();
    } else if (activeTab === 'Trending') {
      fetchTrendingSongs();
    }
    else if (activeTab === 'Beauty') {
      fetchRecommendations();
    }
    else if (activeTab === 'Business') {
      fetchTrendingSongs();
    }
  }, [activeTab]);

  // Handle search with debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch();
      } else {
        setShowSearchResults(false);
        // Restore the original songs based on tab
        if (activeTab === 'Recommendation') {
          fetchRecommendations();
        } else if (activeTab === 'Trending') {
          fetchTrendingSongs();
        } else {
          fetchRecentSongs();
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Fetch username from AsyncStorage
  const fetchUsername = async (): Promise<void> => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUsername(userData.name || userData.username || '');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const fetchRecentSongs = async (): Promise<void> => {
    try {
      setLoading(true);
      const songs = await API.getRecentSongs();
      setRecentSongs(songs);
    } catch (error) {
      console.error('Error fetching recent songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (): Promise<void> => {
    try {
      setLoading(true);
      const songs = await API.getRecommendations();
      setRecentSongs(songs);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingSongs = async (): Promise<void> => {
    try {
      setLoading(true);
      const songs = await API.getTrendingSongs();
      setRecentSongs(songs);
    } catch (error) {
      console.error('Error fetching trending songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (): Promise<void> => {
    try {
      setLoading(true);
      const results = await API.searchSongs(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongPress = async (song: API.Song): Promise<void> => {
    try {
      // Navigate to playing screen with song data
      router.push({
        pathname: '/playingsong' as any,
        params: { 
          id: song.id,
          title: song.title,
          artist: song.artist,
          thumbnail: song.thumbnail,
          duration: song.duration || '0:00'
        }
      });
    } catch (error) {
      console.error('Error handling song press:', error);
    }
  };

  const renderSongItem = (item: API.Song) => (
    <TouchableOpacity
      key={item.id}
      style={styles.recentItem}
      activeOpacity={0.8}
      onPress={() => handleSongPress(item)}
    >
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.recentImage}
      />

      <View style={{ flex: 1 }}>
        <AppText variant="body" style={styles.recenttext}>{item.title}</AppText>
        <AppText variant="caption" style={styles.recenttext}>{item.artist}</AppText>
        <AppText variant="caption" style={styles.time}>{item.duration || '0:00'}</AppText>
      </View>

      <View style={styles.playCircle}>
        <MaterialIcons name="play-arrow" size={18} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  // Format greeting with username or default
  const getGreeting = () => {
    if (username) {
      return `Hello ${username},`;
    }
    return 'Hello,';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="body" style={styles.ptext}>{getGreeting()}</AppText>
        <AppText variant="caption" style={styles.ptext}>
          What You want to hear today ?
        </AppText>
      </View>
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={(text: string) => setSearchQuery(text)}
        />
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <MaterialIcons name="keyboard-voice" size={20} color={colors.text.tertiary} />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => {
                  setActiveTab(tab);
                  setShowSearchResults(false);
                }}
                style={styles.tabItem}
                activeOpacity={0.8}
              >
                <AppText
                  variant="caption"
                  style={[
                    styles.tabText,
                    isActive && styles.activeTabText,
                  ]}
                >
                  {tab}
                </AppText>
                {isActive && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Party Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.partyCardsContainer}>
          {partyCards.map(card => (
            <View key={card.id} style={styles.partyCard}>
              <Image source={card.image} style={styles.partyImage} />
              <TouchableOpacity style={styles.playBtn}>
                <MaterialIcons name="play-arrow" size={15} color="#ffff" />
              </TouchableOpacity>
              <View style={styles.partyText}>
                <AppText variant="caption" style={styles.partyTitle}>
                  {card.title}
                </AppText>
                <AppText variant="caption" style={styles.subtitle}>{card.subtitle}</AppText>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Search Results or Recently Played */}
        {showSearchResults ? (
          <>
            <SectionHeader
              title="Search Results"
              actionText="Clear"
              onActionPress={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
            />
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            ) : searchResults.length > 0 ? (
              searchResults.map(renderSongItem)
            ) : (
              <AppText variant="body" style={styles.noResults}>
                No songs found
              </AppText>
            )}
          </>
        ) : (
          <>
            <SectionHeader
              title={activeTab === 'Recommendation' ? 'Recommended' : 'Recently Played'}
              actionText="See all"
            />
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            ) : recentSongs.length > 0 ? (
              recentSongs.map(renderSongItem)
            ) : (
              <AppText variant="body" style={styles.noResults}>
                No songs available
              </AppText>
            )}
          </>
        )}

        <View style={{ height: 90 }} />
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
    padding: 20,
  },
  ptext: {
    color: colors.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: colors.text.tertiary,
    marginHorizontal: 6,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabItem: {
    marginRight: 22,
    alignItems: 'center',
  },
  tabText: {
    color: colors.text.tertiary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  tabUnderline: {
    marginTop: 4,
    height: 2,
    width: '60%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  partyCardsContainer: {
    marginBottom: 20,
  },
  partyCard: {
    width: 150,
    height: 160,
    marginLeft: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  partyImage: {
    width: '100%',
    height: '100%',
  },
  playBtn: {
    position: 'absolute',
    right: 12,
    bottom: 20,
    backgroundColor: colors.primary,
    width: 17,
    height: 17,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partyText: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  partyTitle: {
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.text.primary,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#4E4E54',
    borderRadius: 10,
    padding: 10,
  },
  recentImage: {
    width: 60,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    marginLeft:-10,
    backgroundColor: '#3A3A3A',
  },
  recenttext: {
    color: colors.text.primary,
  },
  time: {
    marginTop: 2,
    color: colors.text.primary,
  },
  playCircle: {
    backgroundColor: colors.primary,
    width: 25,
    height: 25,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginTop: 20,
  },
  noResults: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginTop: 20,
    paddingHorizontal: 20,
  },
});