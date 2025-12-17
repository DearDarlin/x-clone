import { FlatList, Text, View, StyleSheet } from 'react-native';
import { styles } from '@/styles/notifications.styles';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader } from '@/components/Loader';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { Notification } from '@/components/Notification';
import { ScreenWrapper } from '@/components/ScreenWrapper';

export default function NotificationsScreen() {
  const { isAuthenticated } = useConvexAuth();
  const notifications = useQuery(api.notifications.getNotifications, isAuthenticated ? {} : 'skip');

  if (notifications === undefined) return <Loader />;
  if (notifications.length === 0) return <NoNotificationsFound />;

  return (
    // замість <View style={styles.container}> використовуємо <ScreenWrapper>
    <ScreenWrapper>

      <View style={[styles.header, { paddingHorizontal: 20, paddingTop: 10 }]}>
        <Text style={[styles.headerTitle, { color: 'white' }]}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={({ item }) => <Notification notification={item as any} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

    </ScreenWrapper>
  );
}

function NoNotificationsFound() {
  return (
    <ScreenWrapper>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="notifications-outline" size={74} color={COLORS.primary} />
        <Text style={{ fontSize: 20, color: 'white', marginTop: 10 }}>
          Немає на даний момент сповіщень
        </Text>
      </View>
    </ScreenWrapper>
  );
}