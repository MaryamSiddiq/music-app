// Update IconButton to accept MaterialIcons as well
import { colors } from '@/src/theme/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  icon: keyof typeof Ionicons.glyphMap | keyof typeof MaterialIcons.glyphMap;
  size?: number;
  onPress?: () => void;
  iconType?: 'ionicons' | 'material';
  color?: string;
}

export const IconButton: React.FC<Props> = ({
  icon,
  size = 20,
  onPress,
  iconType = 'ionicons',
  color = colors.text.primary,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {iconType === 'ionicons' ? (
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={size} color={color} />
      ) : (
        <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={size} color={color} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});