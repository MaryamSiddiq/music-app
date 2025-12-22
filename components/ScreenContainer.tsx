import { colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const ScreenContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 16,
  },
});
