import { colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from './AppText';
export const SocialButton = ({ title }: { title: string }) => {
  return (
    <TouchableOpacity style={styles.button}>
      <AppText>{title}</AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 12,
  },
});
