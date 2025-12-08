import { View, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { fetch } from "expo/fetch";
import { Image } from "expo-image";
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function CreateScreen() {
    const [SelectedImage,setSelectedImage]=useState('')

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

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <TouchableOpacity onPress={()=>pickImage()}><Text>Choose photo</Text></TouchableOpacity>
            <Text style={{ fontSize: 20 }}>Створити пост!</Text>
        </View>
    );
}
