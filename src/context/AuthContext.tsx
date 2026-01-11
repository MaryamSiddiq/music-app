// src/context/AuthContext.tsx (SUPER SIMPLE VERSION)
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const TOKEN_KEY = 'userToken';

interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  setUserToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isLoading: true,
  setUserToken: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token on mount
  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('Token loaded:', token ? 'YES ' : 'NO   ');
      setUserTokenState(token);
    } catch (error) {
      console.error('   Load token error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserToken = async (token: string | null) => {
    try {
      if (token) {
        await AsyncStorage.setItem(TOKEN_KEY, token);
        console.log(' Token saved');
      } else {
        await AsyncStorage.removeItem(TOKEN_KEY);
        console.log(' Token removed');
      }
      setUserTokenState(token);
    } catch (error) {
      console.error('   Save token error:', error);
    }
  };

  const logout = async () => {
    await setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, setUserToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};