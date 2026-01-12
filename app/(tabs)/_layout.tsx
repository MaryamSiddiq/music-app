import { TabBarIcon } from '@/components/TabBarIcon';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/src/theme/colors';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.tabcolor,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              focused={focused} 
              iconName="home" 
              iconNameOutline="home-outline" 
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favourite"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              focused={focused} 
              iconName="heart" 
              iconNameOutline="heart-outline" 
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="playingsong"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              focused={focused} 
              iconName="play-circle" 
              iconNameOutline="play-circle-outline" 
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="download"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              focused={focused} 
              iconName="time" 
              iconNameOutline="time-outline" 
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              focused={focused} 
              iconName="person" 
              iconNameOutline="person-outline" 
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="play"
        options={{ href: null }}
      />
    </Tabs>
  );
}