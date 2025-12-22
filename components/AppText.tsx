import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

type AppTextProps = TextProps & {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
};

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  style,
  ...props
}) => {
  return (
    <Text {...props} style={[styles.base, styles[variant], style]} />
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Poppins_400Regular',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  body: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
  },
});
