import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from './IconButton';

export const PlayerControls = () => {
  return (
    <View style={styles.container}>
      <IconButton icon="play-skip-back" />
      <IconButton icon="play" size={32} />
      <IconButton icon="play-skip-forward" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
});
