import { colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';

interface Props {
  title: string;
  actionText?: string;
}

export const SectionHeader: React.FC<Props> = ({
  title,
  actionText,
}) => {
  return (
    <View style={styles.container}>
      <AppText variant="subtitle">{title}</AppText>
      {actionText && (
        <TouchableOpacity>
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
  },
  action: {
    color: colors.primary,
    fontSize: 12,
  },
});
