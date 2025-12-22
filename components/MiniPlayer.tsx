import { colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { IconButton } from './IconButton';


export const MiniPlayer = () => {
  return (
    <View style={styles.container}>
      <View>
        <AppText>Song Name</AppText>
        <AppText variant="caption">Artist</AppText>
      </View>
      <IconButton icon="play" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
