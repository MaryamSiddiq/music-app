

// screens/HistoryScreen.tsx (REPLACE DownloadScreen)
import { AppText } from '@/components/AppText';
import * as API from '@/src/services/api';
import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

interface HistoryItem {
  _id: string;
  songId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  playedAt: string;
  lastPlayedAt: string;
  playCount: number;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      if (!token) {
        Alert.alert('Login Required', 'Please login to view your history');
        setHistory([]);
        return;
      }
      
      console.log(' Loading history, page:', pageNum);
      const response = await API.getHistory(token, pageNum, 20);
      
      console.log(' History response:', response);
      
      if (response.success && response.data?.history) {
        if (pageNum === 1) {
          setHistory(response.data.history);
        } else {
          setHistory(prev => [...prev, ...response.data.history]);
        }
        
        setHasMore(response.data.pagination?.hasNext || false);
        setPage(pageNum);
      } else {
        console.log(' History load failed:', response.message);
        Alert.alert('Error', 'Failed to load history');
      }
    } catch (error: any) {
      console.error(' History load error:', error);
      Alert.alert('Error', 'Failed to load listening history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadHistory(1, true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadHistory(page + 1);
    }
  };

  const clearHistory = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      if (!token) {
        Alert.alert('Login Required', 'Please login to clear history');
        return;
      }
      
      Alert.alert(
        'Clear History',
        'Are you sure you want to clear all your listening history?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: async () => {
              try {
                await API.clearHistory(token);
                setHistory([]);
                Alert.alert('Success', 'History cleared');
              } catch (error) {
                Alert.alert('Error', 'Failed to clear history');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Clear history error:', error);
    }
  };

  const handlePlaySong = (item: HistoryItem) => {
    router.push({
      pathname: '/playingsong',
      params: {
        id: item.songId,
        title: item.title,
        artist: item.artist,
        thumbnail: item.thumbnail,
        duration: item.duration
      }
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch {
      return 'Recently';
    }
  };

  if (loading && history.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <AppText variant="body" style={styles.loadingText}>
          Loading history...
        </AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
       {/* Header */}
      <View style={styles.header}>
        <AppText variant="subtitle" style={styles.headerText}>
          Downloads
        </AppText>
      </View>

      {/* History List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
          ) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons 
              name="history" 
              size={80} 
              color={colors.text.tertiary} 
            />
            <AppText variant="body" style={styles.emptyText}>
              Your listening history is empty
            </AppText>
            <AppText variant="caption" style={styles.emptySubtext}>
              Play some songs to see them here
            </AppText>
          </View>
        ) : (
          <>
            {history.map(item => (
              <TouchableOpacity 
                key={item._id} 
                style={styles.songItem}
                onPress={() => handlePlaySong(item)}
                activeOpacity={0.7}
              >
                {/* Thumbnail */}
                <Image 
                  source={{ uri: item.thumbnail || 'https://via.placeholder.com/100x100/333/666?text=Music' }} 
                  style={styles.thumbnail}
                  defaultSource={require('@/assets/images/music-icon.png')}
                />

                {/* Song Info */}
                <View style={styles.textContainer}>
                  <AppText variant="body" style={styles.title} numberOfLines={1}>
                    {item.title}
                  </AppText>
                  <AppText variant="caption" style={styles.artist} numberOfLines={1}>
                    {item.artist}
                  </AppText>
                  <View style={styles.metaRow}>
                    <AppText variant="caption" style={styles.metaText}>
                      {formatDate(item.playedAt)}
                    </AppText>
                    <View style={styles.dot} />
                    <AppText variant="caption" style={styles.metaText}>
                      {item.playCount} {item.playCount === 1 ? 'play' : 'plays'}
                    </AppText>
                  </View>
                </View>

                {/* Play Button */}
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => handlePlaySong(item)}
                >
                  <MaterialIcons
                    name="play-arrow"
                    size={24}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            
            {/* Loading More Indicator */}
            {hasMore && (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color={colors.primary} />
                <AppText variant="caption" style={styles.loadingMoreText}>
                  Loading more...
                </AppText>
              </View>
            )}
            
            <View style={{ height: 80 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text.primary,
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
        alignItems: 'center',

  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    color: colors.text.primary
    
  },
  subtitle: {
    color: colors.text.tertiary,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#333',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  artist: {
    color: colors.text.secondary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: colors.text.tertiary,
    fontSize: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.tertiary,
    marginHorizontal: 6,
  },
  playButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: colors.text.primary,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  loadingMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  loadingMoreText: {
    color: colors.text.tertiary,
  },
});