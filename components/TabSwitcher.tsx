import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabSwitcher = ({ tabs, activeTab, onTabChange }: TabSwitcherProps) => {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <AppText
              variant="caption"
              style={[styles.tabText, isActive && styles.activeTabText]}
            >
              {tab}
            </AppText>
            {isActive && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});