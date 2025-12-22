import { colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface Props {
  placeholder: string;
  secureTextEntry?: boolean;
}

export const Input: React.FC<Props> = ({
  placeholder,
  secureTextEntry,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    height: 48,
    color: colors.text.primary,
  },
});
