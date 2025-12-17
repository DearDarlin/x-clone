import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    box:{

    },

    header:{
        width:'100%',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:COLORS.grey,
        marginTop:40,
        padding:5
    },
    avatar_image:{
        width:50,
        height:50,
        borderRadius:30
    },
    avatar_box:{
        flexDirection:'row',
        marginLeft:10
    },
    avatar_name:{
        fontSize:17,
        fontWeight:'bold',
        color:COLORS.white,
        marginRight:10,
        alignSelf:'center'
    },
    avatar_info_box:{
        marginRight:10,
        alignItems:'center'
    },
    avatar_info_text:{
        fontSize:13,
        color:COLORS.white
    },

    buttons:{
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor:COLORS.grey,
        padding:5
    },
    logout_button:{
        backgroundColor:COLORS.white,
        borderRadius:8,
        padding:8,
        marginLeft:10,
        marginRight:10
    },
    change_button:{
        backgroundColor:COLORS.white,
        borderRadius:8,
        padding:8
    },
    share_button:{
        backgroundColor: COLORS.white,
        padding: 8,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight:10
    },
    params_button:{
        backgroundColor: COLORS.white,
        padding: 8,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    button_text:{
        color:'black',
        fontSize:17
    },

    posts:{
        backgroundColor:COLORS.grey
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
        color:COLORS.white,
        backgroundColor:COLORS.grey,
        paddingLeft:15
    }
})