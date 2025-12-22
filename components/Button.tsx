import { colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from './AppText';

interface Props {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<Props> = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <AppText style={styles.text}>{title}</AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
});
