// SectionHeader.tsx
import { colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';

interface Props {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const SectionHeader: React.FC<Props> = ({
  title,
  actionText,
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title} variant="body">{title}</AppText>
      {actionText && (
        <TouchableOpacity onPress={onActionPress}>
          <AppText style={styles.action}>{actionText}</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    marginHorizontal: 30,
  },
  title: {
    color: colors.text.primary,
  },
  action: {
    color: colors.primary,
    fontSize: 12,
  },
});