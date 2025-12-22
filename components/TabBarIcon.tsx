import { colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

interface TabBarIconProps {
  focused: boolean;
  iconName: string;
  iconNameOutline: string;
  color?: string;
}

export const TabBarIcon = ({ 
  focused, 
  iconName, 
  iconNameOutline, 
  color = colors.primary 
}: TabBarIconProps) => {
  return (
    <View style={styles.iconContainer}>
      <Ionicons 
        name={focused ? iconName as any : `${iconNameOutline}` as any} 
        size={20} 
        color={color} 
      />
      {focused && <View style={[styles.underline, { backgroundColor: color }]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
  underline: {
    width: 20,
    height: 2,
    borderRadius: 1,
    marginTop: 4,
  },
});