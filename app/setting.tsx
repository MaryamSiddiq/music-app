import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export const SettingsScreen = () => {
  const menuItems = [
    { id: 1, icon: '👤', label: 'Profile', screen: 'Profile' },
    { id: 2, icon: '⚙️', label: 'Settings', screen: 'Settings' },
    { id: 3, icon: '❤️', label: 'Favorite / Playlist', screen: 'Favorites' },
    { id: 4, icon: '📝', label: 'Language', screen: 'Language' },
    { id: 5, icon: '🔒', label: 'Privacy', screen: 'Privacy' },
    { id: 6, icon: '📚', label: 'Terms and policy', screen: 'Terms' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <AppText variant="body">←</AppText>
        </TouchableOpacity>
        <AppText variant="subtitle">More</AppText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {menuItems.map(item => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <AppText variant="body">{item.icon}</AppText>
              <AppText variant="body" style={styles.menuLabel}>
                {item.label}
              </AppText>
            </View>
            <AppText variant="body" style={styles.chevron}>
              →
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
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
  placeholder: {
    width: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuLabel: {
    fontSize: 16,
  },
  chevron: {
    color: colors.text.tertiary,
  },
});