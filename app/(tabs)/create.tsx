import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { File } from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { fetch } from "expo/fetch";
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateScreen() {
    const route = useRouter()
    const [selectedImage,setSelectedImage]=useState<string>('')
    const [caption,setCaption] = useState<string>('')
    const [isSharing,setIsSharing] = useState<boolean>(false)
    const createPost = useMutation(api.posts.createPost)
    const generateUpLoadUrl = useMutation(api.posts.generateUploadUrl)


    const pickImage= async()=>{
    let result = await ImagePicker.launchImageLibraryAsync({      
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1,1],
    quality: 0.8,});
    if(!result.canceled){
      setSelectedImage(result.assets[0].uri)
    }
  }
  const handleShare = async()=>{
    if(!selectedImage)return
    try{
      setIsSharing(true)
      const upLoadUrl = await generateUpLoadUrl()
      const file = new File(selectedImage)
      const upLoadResult= await fetch('https://example.com', 
        {method: 'POST',
        body: file,
        headers:{
          "Content-Type":"image/jpeg"
        }
      });
      if(!upLoadResult.ok)throw new Error('Upload failed')
      const {storageId}=await upLoadResult.json()
      await createPost({storageId,caption})
      setCaption('')
      setSelectedImage('')
      route.push("/(tabs)")
    }
    catch(err){
      console.error(err)
    }
    finally{
      setIsSharing(false)
    }
  }

  if(selectedImage===''){
    return(
        <View>
            <View>
                <Text style={{marginTop:50,alignSelf:'center',fontWeight:'bold',fontSize:25}}> Create your own post</Text>
                <TouchableOpacity style={{borderRadius:10,marginTop:80,backgroundColor:'rgba(139, 139, 139, 1)',alignItems:'center',height:400,width:300,alignSelf:'center',justifyContent:'center'}} onPress={()=>pickImage()}>
                    <Text style={{backgroundColor:'white',padding:70,fontWeight:'bold',fontSize:23,color:'black',borderRadius:5}}>Choose photo</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
  }
    return (
        <View>
            <ScrollView style={{marginTop:70}}>

                <View style={{alignItems:'center'}}>
                <TouchableOpacity style={{backgroundColor:'orange',padding:5,borderRadius:10,alignItems:'center'}} onPress={()=>pickImage()}>
                    <Text style={{fontSize:20,fontWeight:'bold',backgroundColor:'white',borderRadius:5,padding:4}}>Change photo</Text>
                </TouchableOpacity>
                <Image style={{height:350,width:350,marginTop:20,borderRadius:5}} source={selectedImage} contentFit='cover' transition={200}></Image>
                <View style={{padding:3,marginTop:20,backgroundColor:'black',alignItems:'center',borderRadius:5}}>
                    <TextInput style={{fontSize:18,fontWeight:'bold',padding:3,alignItems:'center',backgroundColor:'white',borderRadius:5,color:'black'}} onChangeText={(text)=>setCaption(text)} placeholder='Input coment for your post'></TextInput>
                </View>
                </View>

                <View style={{marginTop:20,alignItems:'center'}}>
                <TouchableOpacity style={{backgroundColor:'blue',padding:5,borderRadius:10,alignItems:'center',marginBottom:30}} onPress={()=>handleShare()}>
                    <Text style={{fontSize:20,fontWeight:'bold',backgroundColor:'white',borderRadius:5,padding:4}}>Publish post</Text>
                </TouchableOpacity>

            </View>
            </ScrollView>
        </View>
    );
}
