import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = "Search" 
}: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        value={value}
        onChangeText={onChangeText}
      />
      <MaterialIcons name="keyboard-voice" size={20} color={colors.text.tertiary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    marginHorizontal: 6,
  },
});