import { colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  onPress?: () => void;
}

export const IconButton: React.FC<Props> = ({
  icon,
  size = 20,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons name={icon} size={size} color={colors.text.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
