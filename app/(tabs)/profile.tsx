import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { Image } from 'expo-image';
import { useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Doc } from '../../convex/_generated/dataModel';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from "expo-router";

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
    <View style={styles.box}>
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
        <TouchableOpacity style={styles.change_button}><Text style={styles.button_text}>Change info</Text></TouchableOpacity>
        <TouchableOpacity style={styles.logout_button}><Text style={styles.button_text}>Log out</Text></TouchableOpacity>
        <TouchableOpacity style={styles.share_button}><Text style={styles.button_text}>Share</Text></TouchableOpacity>
        <TouchableOpacity style={styles.params_button}><FontAwesome6 name="bars" size={20} color="black" /></TouchableOpacity>
      </View>
      <ScrollView style = {styles.posts}>
        <FlatList data={posts} keyExtractor={(i)=>i._id} renderItem={(i)=>{
          return <TouchableOpacity>
            <Image style={styles.post_image} source={i.item.imageUrl} contentFit="cover" transition={200}></Image>
          </TouchableOpacity>
        }}></FlatList>
      </ScrollView>
    </View>
  );
}