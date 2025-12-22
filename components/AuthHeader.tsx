import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';

export const AuthHeader = ({ title }: { title: string }) => {
  return (
    <View style={styles.container}>
      <AppText variant="title">{title}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
});
