import { Loader } from '@/components/Loader';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const profile = useQuery(api.users.getUserProfile, id ? { id: id as any } : 'skip');
  const currentUser = useQuery(api.users.currentUser);
  const posts = useQuery(api.posts.getPostsByUser, id ? { userId: id as any } : 'skip');
  const isFollowingQuery = useQuery(api.users.isFollowing, profile ? { followingId: profile._id as any } : 'skip');

  const toggleFollow = useMutation(api.users.toggleFollow);

  const [isFollowing, setIsFollowing] = useState<boolean | undefined>(undefined);
  const [followersCount, setFollowersCount] = useState<number>(profile?.followers || 0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);

  useEffect(() => {
    if (typeof isFollowingQuery === 'boolean') setIsFollowing(isFollowingQuery);
  }, [isFollowingQuery]);

  useEffect(() => {
    if (profile) setFollowersCount(profile.followers || 0);
  }, [profile]);

  if (!id) return (
    <ScreenWrapper>
      <Loader />
    </ScreenWrapper>
  );

  if (!profile) {
    return (
      <ScreenWrapper>
        <Loader />
      </ScreenWrapper>
    );
  }

  const handleToggleFollow = async () => {
    try {
      await toggleFollow({ followingId: profile._id as any });
      // optimistic update
      setIsFollowing((s) => {
        const newVal = !s;
        setFollowersCount((c) => c + (newVal ? 1 : -1));
        return newVal;
      });
    } catch (err) {
      console.error('Failed toggle follow', err);
      Alert.alert('Помилка', 'Не вдалось змінити підписку');
    }
  };

  const openImage = (index: number) => {
    setSelectedPostIndex(index);
    setIsVisible(true);
  };

  const isOwner = currentUser && profile && currentUser._id === profile._id;

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 6 }}>
            <Ionicons name="arrow-back" size={22} color={'white'} />
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
            @{profile.username || profile.email?.split('@')[0]}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.topSection}>
          <Image
            style={styles.avatar_image}
            source={profile?.image}
            contentFit="cover"
            transition={200}
          />

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts?.length || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{followersCount || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile?.following || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.fullname}>@{profile?.username || profile?.email?.split('@')[0]}</Text>
          {profile?.bio && <Text style={styles.bio}>{profile?.bio}</Text>}
        </View>

        <View style={styles.buttonsRow}>
          {isOwner ? (
            <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(tabs)/profile')}>
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleToggleFollow}
              style={isFollowing ? styles.following_button : styles.unfollowing_button}
            >
              <Text style={styles.editButtonText}>{isFollowing ? 'Following' : 'Follow'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        {/* Posts grid */}
        {(!posts || posts.length === 0) ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
            <Ionicons name="image" size={74} color={"#1DA1F2"} />
            <Text style={{ color: '#1DA1F2', fontSize: 22, marginTop: 12 }}>No posts yet</Text>
            <Text style={{ color: '#71767B', marginTop: 6 }}>This user hasn't posted anything.</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            numColumns={3}
            keyExtractor={(i) => i?._id || Math.random().toString()}
            columnWrapperStyle={{ gap: 2 }}
            contentContainerStyle={{ gap: 2 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const width = Dimensions.get('window').width / 3 - 2;
              const isOwnerPost = !!currentUser && item && item.userId === currentUser._id;
              return (
                <View style={{ width: '33.33%', padding: 2 }}>
                  <View style={{ position: 'relative' }}>
                    <TouchableOpacity onPress={() => openImage(index)}>
                      <Image
                        style={{ width: width, height: width, backgroundColor: '#1a1a1a' }}
                        source={item?.imageUrl}
                        contentFit="cover"
                        transition={200}
                      />
                    </TouchableOpacity>

                    {isOwnerPost && (
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          padding: 6,
                          borderRadius: 20,
                        }}
                      >
                        <Ionicons name="trash-outline" size={16} color="#ffdddd" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}

        {posts && posts.length > 0 && (
          <ImageViewing
            images={posts.filter(Boolean).map((p: any) => ({ uri: p.imageUrl }))}
            imageIndex={selectedPostIndex}
            visible={isVisible}
            onRequestClose={() => setIsVisible(false)}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}