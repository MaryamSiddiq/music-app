// app/(tabs)/profile.tsx
import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
         <SafeAreaView style={styles.container}>
    
    <View style={styles.container}>
      <View style={styles.profileHeader}>
           <Image
  source={require('../../assets/images/profile.png')} // adjust the path
  style={styles.profile}
/>

        <AppText variant="title" style={styles.name}>Vikashini vini</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="subtitle" style={styles.name}>Personal Information</AppText>
        <TouchableOpacity style={styles.menuItem}>
          <AppText variant="body" style={styles.text}>Name</AppText>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.text.tertiary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <AppText variant="body" style={styles.text}>Email</AppText>
           <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.text.tertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <AppText variant="body" style={styles.text}>Language</AppText>
           <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.text.tertiary}
          />
        </TouchableOpacity>
        <AppText variant="body" style={styles.name}>About</AppText>
        <TouchableOpacity style={styles.menuItem}>
          <AppText variant="body" style={styles.text} >Privacy</AppText>
           <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.text.tertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <AppText variant="body" style={styles.text}>Storage</AppText>
           <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.text.tertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <AppText variant="body" style={styles.text}>Audio Quality</AppText>
           <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.text.tertiary}
          />
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
  },
    profile: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    marginBottom: 4,
    color: colors.text.primary,
  },
  section: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',          // text + arrow in one line
    alignItems: 'center',
    justifyContent: 'space-between', // arrow moves to right
    paddingVertical: 8,
  },

  text: {
    color: colors.text.primary,
  },

});