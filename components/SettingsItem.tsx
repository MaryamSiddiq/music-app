import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';

export const SettingsItem = ({ title }: { title: string }) => {
  return (
    <View style={styles.container}>
      <AppText>{title}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
});
