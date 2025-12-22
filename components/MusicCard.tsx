import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';

interface Props {
  title: string;
  artist: string;
  image: string;
}

export const MusicCard: React.FC<Props> = ({
  title,
  artist,
  image,
}) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <AppText numberOfLines={1}>{title}</AppText>
      <AppText variant="caption">{artist}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    marginBottom: 8,
  },
});
