import { AppText } from '@/components/AppText';
import { colors } from '@/src/theme/colors';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
  const notifications = [
    {
      id: 1,
      user: 'Username',
      message: 'commented on your post: Amazing vibes!',
      time: '2h ago',
      avatar: '',
    },
    {
      id: 2,
      user: 'Username',
      message: 'started following you',
      time: '5h ago',
      avatar: '',
    },
    {
      id: 3,
      user: 'Username',
      message: 'liked your playlist',
      time: '1d ago',
      avatar: '',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <AppText variant="body">←</AppText>
        </TouchableOpacity>
        <AppText variant="subtitle">Notifications</AppText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map(notification => (
          <TouchableOpacity key={notification.id} style={styles.notificationItem}>
            <View style={styles.avatar} />
            <View style={styles.notificationContent}>
              <AppText variant="body">
                <AppText variant="body" style={styles.username}>
                  {notification.user}
                </AppText>{' '}
                {notification.message}
              </AppText>
              <AppText variant="caption" style={styles.time}>
                {notification.time}
              </AppText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  username: {
    fontWeight: '600',
  },
  time: {
    color: colors.text.tertiary,
    marginTop: 4,
  },
});
