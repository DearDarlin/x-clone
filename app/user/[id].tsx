import { ScreenWrapper } from "@/components/ScreenWrapper";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery } from "convex/react";
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import ImageViewing from "react-native-image-viewing";

export default function ProfileScreen() {
  const {id} = useLocalSearchParams()
  const router = useRouter();

  const userId = id as Id<'users'>
  const posts = useQuery(api.posts.getPostsByUser, {userId});
  const profile = useQuery(api.users.getUserProfile,{id:userId})
  const isFollowing = useQuery(api.users.isFollowing,{followingId:userId})

  const folllow = useMutation(api.users.toggleFollow)

  const [isVisible, setIsVisible] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);

  const openImage = (index: number) => {
    setSelectedPostIndex(index);
    setIsVisible(true);
  };

  if(profile === undefined){
    return(
      <View>
        <Text>user not found</Text>
      </View>
    )
  }

  const ProfileHeader = () => (
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
            <Text style={styles.statNumber}>{profile?.followers || 0}</Text>
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
        <TouchableOpacity style={styles.unfollowing_button} onPress={() => folllow({followingId:userId})}>
          <Text style={isFollowing ? styles.following_button : styles.unfollowing_button}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={() => {if(router.canGoBack()){router.back()} else{router.push('/(tabs)/profile')}}}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
    </View>
  );

  return (
    <ScreenWrapper>
      <FlatList
        data={posts}
        numColumns={3}
        keyExtractor={(i) => i?._id || Math.random().toString()}
        ListHeaderComponent={ProfileHeader}
        columnWrapperStyle={{ gap: 2 }}
        contentContainerStyle={{ gap: 2 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const width = Dimensions.get('window').width / 3 - 2;
          const isOwner = !!profile && item && item.userId === profile._id;
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
              </View>
            </View>
          );
        }}
      />
      {((posts) || []).filter(Boolean).length > 0 && (
        <ImageViewing
          images={(((posts || [])) as any[]).filter(Boolean).map((post) => ({ uri: post.imageUrl }))}
          imageIndex={selectedPostIndex}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        />
      )}
    </ScreenWrapper>
  );
}