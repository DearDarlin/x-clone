import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    box:{

    },

    header:{
        width:'100%',
        justifyContent:'space-between'
    },
    avatar_image:{
        width:70,
        height:70,
        borderRadius:30
    },
    avatar_box:{
        
    },
    avatar_name:{
        fontSize:17,
        fontWeight:'bold',
        color:COLORS.white
    },
    avatar_info_box:{

    },
    avatar_info_text:{
        fontSize:13,
        color:COLORS.white
    },

    buttons:{
        alignItems:'center'
    },
    logout_button:{
        backgroundColor:COLORS.surface,
        borderRadius:8,
        padding:8
    },
    change_button:{
        backgroundColor:COLORS.surface,
        borderRadius:8,
        padding:8
    },
    share_button:{
        backgroundColor: COLORS.surface,
        padding: 8,
        borderRadius: 8,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    button_text:{
        color:'black',
        fontSize:17
    },

    posts:{

    },
    post_button:{
        flex: 1 / 3,
        aspectRatio: 1,
        padding: 1,
    },
    post_image:{
        flex: 1,
    },

    bio:{
        fontSize:17,
        fontWeight:'bold',
        color:COLORS.white
    }
})