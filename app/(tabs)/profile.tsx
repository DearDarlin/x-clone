import { ModalEditProfile } from "@/components/EditProfileModal";
import { Loader } from "@/components/Loader";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from "convex/react";
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import ImageViewing from "react-native-image-viewing";

export default function ProfileScreen() {
  const { signOut, userId } = useAuth();
  const router = useRouter();

  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : 'skip');
  const posts = useQuery(api.posts.getPostsByUser, {});
  const bookmarks = useQuery(api.bookmarks.getBookmarkedPosts, userId ? {} : 'skip');
  const updateProfile = useMutation(api.users.updateProfile);
  const deletePostMutation = useMutation(api.posts.deletePost);

  const [isModalWindovVisiable, setIsModalWindovVisiable] = useState(false);
  const [editProfile, setEditProfile] = useState({ fullname: '', bio: '' });

  const [isVisible, setIsVisible] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [showBookmarks, setShowBookmarks] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditProfile({
        fullname: currentUser.fullname || '',
        bio: currentUser.bio || ''
      });
    }
  }, [currentUser]);

  const handlerSafeProfile = async () => {
    try {
      const result = await updateProfile(editProfile);

      if (result.status === "error" && result.message === "NICKNAME_TAKEN") {
        Alert.alert("Помилка", "Цей нікнейм вже зайнятий. Спробуйте інший.");
        return;
      }
      setIsModalWindovVisiable(false);
    } catch (error) {
      Alert.alert("Помилка", "Щось пішло не так.");
      console.error(error);
    }
  }

  const openImage = (index: number) => {
    setSelectedPostIndex(index);
    setIsVisible(true);
  };

  const handleDeletePost = (postId: string) => {
    Alert.alert('Видалити пост', 'Ви впевнені, що хочете видалити цей пост?', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePostMutation({ postId: postId as any });
          } catch (err) {
            console.error('Delete post error', err);
            Alert.alert('Помилка', 'Не вдалось видалити пост');
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert(
      "Вихід з акаунту",
      "Ви впевнені, що хочете вийти?",
      [
        {
          text: "Скасувати",
          style: "cancel"
        },
        {
          text: "Вийти",
          style: "destructive",
          onPress: () => signOut()
        }
      ]
    );
  };

  const ProfileHeader = () => (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          style={styles.avatar_image}
          source={currentUser?.image}
          contentFit="cover"
          transition={200}
        />

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{posts?.length || 0}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser?.followers || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser?.following || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.fullname}>@{currentUser?.username || currentUser?.email?.split('@')[0]}</Text>
        {currentUser?.bio && <Text style={styles.bio}>{currentUser?.bio}</Text>}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsModalWindovVisiable(true)}>
          <Text style={styles.editButtonText}>Edit profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowBookmarks((s) => !s)}
        >
          <Ionicons name={showBookmarks ? "bookmark" : "bookmark-outline"} size={22} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
    </View>
  );

  const dataToRender = showBookmarks ? bookmarks : posts;

  if (showBookmarks && bookmarks === undefined) {
    return (
      <ScreenWrapper>
        <Loader />
      </ScreenWrapper>
    );
  }

  if (showBookmarks && (!bookmarks || bookmarks.length === 0)) {
    return (
      <ScreenWrapper>
        <ProfileHeader />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="bookmark" size={74} color={"#1DA1F2"} />
          <Text style={{ color: '#1DA1F2', fontSize: 22, marginTop: 12 }}>Поки що порожньо</Text>
          <Text style={{ color: '#71767B', marginTop: 6 }}>Збережені пости з'являться тут</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={dataToRender}
        numColumns={3}
        keyExtractor={(i) => i?._id || Math.random().toString()}
        ListHeaderComponent={ProfileHeader}
        columnWrapperStyle={{ gap: 2 }}
        contentContainerStyle={{ gap: 2 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const width = Dimensions.get('window').width / 3 - 2;
          const isOwner = !!currentUser && item && item.userId === currentUser._id;
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

                {isOwner && (
                  <TouchableOpacity
                    onPress={() => handleDeletePost(item._id)}
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

      <ModalEditProfile
        isEditModalVisible={isModalWindovVisiable}
        setIsEditModalVisible={setIsModalWindovVisiable}
        editedProfile={editProfile}
        setEditedProfile={setEditProfile}
        handleSaveProfile={handlerSafeProfile}
      />

      {((showBookmarks ? bookmarks : posts) || []).filter(Boolean).length > 0 && (
        <ImageViewing
          images={((showBookmarks ? (bookmarks || []) : (posts || [])) as any[]).filter(Boolean).map((post) => ({ uri: post.imageUrl }))}
          imageIndex={selectedPostIndex}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        />
      )}
    </ScreenWrapper>
  );
}