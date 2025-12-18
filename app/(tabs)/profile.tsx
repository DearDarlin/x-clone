import { ScreenWrapper } from "@/components/ScreenWrapper";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useMutation, useQuery } from "convex/react";
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Doc } from '../../convex/_generated/dataModel';
import { ModalEditProfile } from "@/components/EditProfileModal";

export default function ProfileScreen() {
  const { signOut,userId } = useAuth();
  const router = useRouter()

  const currentUser = useQuery(api.users.getUserByClerkId,userId?{clerkId:userId}:'skip')
  const posts = useQuery(api.posts.getPostsByUser,{})
  const updateProfile = useMutation(api.users.updateProfile)

  const [isModalWindovVisiable,setIsModalWindovVisiable] = useState(false)
  const [editProfile,setEditProfile] = useState({fullname:currentUser?.fullname||'',bio:currentUser?.bio||''})
  const [selectedPost,setSelectedPost] = useState<Doc<'posts'>|null>(null)

  const handlerSafeProfile = async()=>{
    await updateProfile(editProfile)
    setIsModalWindovVisiable(p=>!p)
  }

  return (
    <ScreenWrapper>
    <View>
      <View style={styles.header}>
        <Image style={styles.avatar_image} source={currentUser?.image} contentFit="cover" transition={200}></Image>
        <View style={styles.avatar_box}>
          <Text style={styles.avatar_name}>{currentUser?.fullname}</Text>

          <View style={styles.avatar_info_box}>
            <Text style={styles.avatar_info_text}>{posts?.length}</Text>
            <Text style={styles.avatar_info_text}>Posts</Text>
          </View>

          <View style={styles.avatar_info_box}>
            <Text style={styles.avatar_info_text}>{currentUser?.followers}</Text>
            <Text style={styles.avatar_info_text}>Followers</Text>
          </View>

          <View style={styles.avatar_info_box}>
            <Text style={styles.avatar_info_text}>{currentUser?.following}</Text>
            <Text style={styles.avatar_info_text}>Following</Text>
          </View>

        </View>
      </View>
      <Text style={styles.bio}>{currentUser?.bio}</Text>
      <View style = {styles.buttons}>
        <TouchableOpacity style={styles.change_button} onPress={()=>setIsModalWindovVisiable(p=>!p)}><Text style={styles.button_text}>Change info</Text></TouchableOpacity>
        <TouchableOpacity style={styles.logout_button} onPress={()=>signOut()}><Text style={styles.button_text}>Log out</Text></TouchableOpacity>
        <TouchableOpacity style={styles.params_button} onPress={()=>router.push('/(tabs)/bookmarks')}><FontAwesome6 name="bars" size={20} color="black" /></TouchableOpacity>
      </View>
      <ScrollView>
        <FlatList data={posts} numColumns={3} keyExtractor={(i)=>i._id} renderItem={(i)=>{
          return <TouchableOpacity style={styles.post_button} onPress={()=>setSelectedPost(i.item)}>
            <Image style={styles.post_image} source={i.item.imageUrl} contentFit="cover" transition={200}></Image>
          </TouchableOpacity>
        }}></FlatList>
      </ScrollView>
      <ModalEditProfile isEditModalVisible={isModalWindovVisiable} setIsEditModalVisible={setIsModalWindovVisiable} editedProfile={editProfile} setEditedProfile={setEditProfile} handleSaveProfile={handlerSafeProfile}></ModalEditProfile>
    </View>
    </ScreenWrapper>
  );
}