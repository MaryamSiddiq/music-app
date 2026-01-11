// src/services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ==================== INTERFACES ====================

export interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
  album?: string;
  year?: string;
}

export interface SongDetails {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  album?: string;
  year?: string;
  language?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface FavoriteItem {
  _id: string;
  songId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
}

// ==================== API CONFIGURATION ====================

const API_BASE_URL = 'http://10.114.110.112:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from AsyncStorage or your auth context
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get token (you'll need to implement this based on your storage)
const getToken = (): string | null => {
  // Implement based on your token storage (AsyncStorage, context, etc.)
  // For now, return null - you'll need to update this
  return null;
};
// Add this function to get user profile
export const getProfile = async () => {
  try {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};
// ==================== AUTHENTICATION API ====================

// Signup user
export const signup = async (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    console.log('Signing up user:', userData.email);
    
    const response = await api.post('/auth/signup', userData);
    
    if (response.data.success) {
      console.log('Signup successful:', response.data.message);
      // Store token if needed
      if (response.data.data?.token) {
        // storeToken(response.data.data.token);
      }
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Signup error:', error.message);
    
    // Return a structured error response
    if (error.response?.data) {
      throw error.response.data;
    }
    
    throw {
      success: false,
      message: error.message || 'Signup failed'
    };
  }
};

// Login user
export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    console.log('Logging in user:', credentials.email);
    
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success) {
      console.log('Login successful');
      // Store token if needed
      if (response.data.data?.token) {
        // storeToken(response.data.data.token);
      }
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.message);
    
    if (error.response?.data) {
      throw error.response.data;
    }
    
    throw {
      success: false,
      message: error.message || 'Login failed'
    };
  }
};

// Logout user (client-side only)
export const logout = async (): Promise<void> => {
  try {
    // Clear token from storage
    // await removeToken();
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Get current user profile (requires token)
export const getCurrentUser = async (token: string): Promise<any> => {
  try {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Get user error:', error.message);
    throw error;
  }
};

// ==================== FAVORITES API ====================

// Add song to favorites
// In your api.ts file, update the favorites functions:

export const checkFavorite = async (songId: string, token: string): Promise<{ success: boolean; data: { isFavorite: boolean; songId: string } }> => {
  try {
    console.log(' Checking favorite for song:', songId);
    console.log('Token being used:', token.substring(0, 20) + '...');
    
    const response = await api.get(`/favorite/check/${songId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Favorite check response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('   Favorite check error:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    // Return false if error (song is not favorite)
    return {
      success: false,
      data: {
        isFavorite: false,
        songId
      }
    };
  }
};

export const addToFavorites = async (
  songData: {
    songId: string;
    title: string;
    artist: string;
    thumbnail?: string;
    duration?: string;
  },
  token: string
): Promise<any> => {
  try {
    console.log('Adding to favorites:', songData.songId);
    console.log('Token:', token.substring(0, 20) + '...');
    
    const response = await api.post('/favorite/add', songData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Add favorite response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('   Add favorite error:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    if (error.response?.data) {
      throw error.response.data;
    }
    
    throw {
      success: false,
      message: 'Failed to add to favorites'
    };
  }
};

export const removeFromFavorites = async (songId: string, token: string): Promise<any> => {
  try {
    console.log('🗑️ Removing from favorites:', songId);
    console.log('Token:', token.substring(0, 20) + '...');
    
    const response = await api.delete(`/favorite/remove/${songId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Remove favorite response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('   Remove favorite error:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    if (error.response?.data) {
      throw error.response.data;
    }
    
    throw {
      success: false,
      message: 'Failed to remove from favorites'
    };
  }
};

// Get user's favorites
export const getFavorites = async (token: string): Promise<{ success: boolean; data: FavoriteItem[]; count: number }> => {
  try {
    const response = await api.get('/favorite', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Get favorites error:', error.message);
    
    if (error.response?.data) {
      throw error.response.data;
    }
    
    throw {
      success: false,
      message: 'Failed to get favorites',
      data: [],
      count: 0
    };
  }
};



// Get favorites count
export const getFavoritesCount = async (token: string): Promise<{ success: boolean; data: { count: number } }> => {
  try {
    const response = await api.get('/favorite/count', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Get favorites count error:', error.message);
    
    return {
      success: false,
      data: { count: 0 }
    };
  }
};

// Clear all favorites
export const clearFavorites = async (token: string): Promise<any> => {
  try {
    const response = await api.delete('/favorite/clear', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Clear favorites error:', error.message);
    throw error;
  }
};

// ==================== HISTORY API ====================

// Record song play
export const recordPlay = async (
  songData: {
    songId: string;
    title: string;
    artist: string;
    thumbnail: string;
    duration: string;
  },
  token: string
): Promise<any> => {
  try {
    const response = await api.post('/history/record', songData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error recording play:', error);
    throw error;
  }
};

// Get user's listening history
export const getHistory = async (token: string, page = 1, limit = 20): Promise<any> => {
  try {
    const response = await api.get('/history', {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

// Get recently played songs
export const getRecentPlays = async (token: string, limit = 10): Promise<any> => {
  try {
    const response = await api.get('/history/recent', {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching recent plays:', error);
    throw error;
  }
};

// Get most played songs
export const getMostPlayed = async (token: string, limit = 10): Promise<any> => {
  try {
    const response = await api.get('/history/most-played', {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching most played:', error);
    throw error;
  }
};

// Clear history
export const clearHistory = async (token: string): Promise<any> => {
  try {
    const response = await api.delete('/history/clear', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};

// Remove specific item from history
export const removeFromHistory = async (songId: string, token: string): Promise<any> => {
  try {
    const response = await api.delete(`/history/remove/${songId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error removing from history:', error);
    throw error;
  }
};

// Get history stats
export const getHistoryStats = async (token: string): Promise<any> => {
  try {
    const response = await api.get('/history/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching history stats:', error);
    throw error;
  }
};

// ==================== MUSIC API ====================

// Search songs
export const searchSongs = async (query: string): Promise<Song[]> => {
  try {
    console.log('Searching for:', query);
    
    const response = await api.get('/search', {
      params: { query }
    });
    
    if (response.data.success && response.data.results) {
      console.log(`Found ${response.data.results.length} songs`);
      return response.data.results;
    }
    
    return [];
  } catch (error: any) {
    console.error('Search error:', error.message);
    return [];
  }
};

// Get recent songs
export const getRecentSongs = async (): Promise<Song[]> => {
  try {
    console.log('Fetching recent songs...');
    
    const response = await api.get('/songs/recent');
    
    if (response.data.success && response.data.songs) {
      console.log(`Got ${response.data.songs.length} recent songs`);
      return response.data.songs;
    }
    
    return [];
  } catch (error: any) {
    console.error('Recent songs error:', error.message);
    return [];
  }
};

// Get trending songs
export const getTrendingSongs = async (): Promise<Song[]> => {
  try {
    console.log('Fetching trending songs...');
    
    const response = await api.get('/songs/trending');
    
    if (response.data.success && response.data.songs) {
      console.log(`Got ${response.data.songs.length} trending songs`);
      return response.data.songs;
    }
    
    return [];
  } catch (error: any) {
    console.error('Trending songs error:', error.message);
    return [];
  }
};

// Get recommendations
export const getRecommendations = async (): Promise<Song[]> => {
  try {
    console.log('Fetching recommendations...');
    
    const response = await api.get('/songs/recommendations');
    
    if (response.data.success && response.data.songs) {
      console.log(`Got ${response.data.songs.length} recommendations`);
      return response.data.songs;
    }
    
    return [];
  } catch (error: any) {
    console.error('Recommendations error:', error.message);
    return [];
  }
};

// Get song info/details
export const getSongInfo = async (songId: string): Promise<SongDetails | null> => {
  try {
    console.log('Getting song info for:', songId);
    
    const response = await api.get(`/player/info/${songId}`);
    
    if (response.data) {
      console.log('Song info retrieved:', response.data.title);
      return response.data;
    }
    
    return null;
  } catch (error: any) {
    console.error('Song info error:', error.message);
    return null;
  }
};

// Get audio stream URL for playback
export const getAudioStreamUrl = async (songId: string): Promise<string | null> => {
  try {
    console.log('Getting audio stream URL for:', songId);
    
    const response = await api.get(`/player/stream/${songId}`);
    
    if (response.data.success && response.data.url) {
      console.log('Stream URL obtained successfully');
      console.log('URL preview:', response.data.url.substring(0, 50) + '...');
      return response.data.url;
    }
    
    console.warn('No stream URL in response');
    return null;
  } catch (error: any) {
    console.error('Stream URL error:', error.message);
    return null;
  }
};

// Check API health
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.data.status === 'OK';
  } catch (error) {
    console.error('Health check failed');
    return false;
  }
};

// Get full song details with play URL
export const getFullSongDetails = async (songId: string): Promise<any> => {
  try {
    console.log('Getting full song details for:', songId);
    
    const response = await api.get(`/jiosaavn/song/${songId}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error: any) {
    console.error('Full song details error:', error.message);
    return null;
  }
};

// ==================== HELPER FUNCTIONS ====================

// Optional: Add token management helpers
export const storeToken = async (token: string): Promise<void> => {
  try {
    // Implement using AsyncStorage or your preferred storage
    // await AsyncStorage.setItem('userToken', token);
    console.log('Token stored');
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    // await AsyncStorage.removeItem('userToken');
    console.log('Token removed');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const getStoredToken = async (): Promise<string | null> => {
  try {
    // const token = await AsyncStorage.getItem('userToken');
    // return token;
    return null; // Implement based on your storage
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// ==================== EXPORT ALL FUNCTIONS ====================

export default {
  // Auth
  signup,
  login,
  logout,
  getCurrentUser,
  
  // Favorites
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite,
  getFavoritesCount,
  clearFavorites,
  
  // History
  recordPlay,
  getHistory,
  getRecentPlays,
  getMostPlayed,
  clearHistory,
  removeFromHistory,
  getHistoryStats,
  
  // Music
  searchSongs,
  getRecentSongs,
  getTrendingSongs,
  getRecommendations,
  getSongInfo,
  getAudioStreamUrl,
  checkHealth,
  getFullSongDetails,
  
  // Token helpers
  storeToken,
  removeToken,
  getStoredToken
};