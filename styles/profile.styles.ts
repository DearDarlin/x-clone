import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    header:{
        width:'100%',
        alignItems:'center',
        flexDirection:'row',
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
        fontSize:15,
        color:COLORS.white
    },

    buttons:{
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center',
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

    post_button:{
        marginTop:10,
        marginLeft:10
    },
    post_image:{
        width:112,
        height:112
    },

    bio:{
        fontSize:17,
        fontWeight:'bold',
        color:COLORS.white,
        paddingLeft:15
    },


    modal:{
        flex:1,
        backgroundColor:COLORS.white
    },
    
    header_modal:{
        backgroundColor:COLORS.background,
        flexDirection:'row',
        justifyContent:'space-between',
        padding:7
    },
    header_text_modal:{
        fontWeight:'bold',
        fontSize:17,
        color:COLORS.white
    },

    box_modal:{
        alignSelf:'center',
        padding:5,
        marginTop:10
    },
    text_box_modal:{
        fontSize:23,
        fontWeight:'bold',
        marginBottom:5,
        alignSelf:'center'
    },
    textinput_box_modal:{
        backgroundColor:COLORS.background,
        borderRadius:5,
        color:COLORS.white,
        fontSize:15,
        alignItems:'center',
        justifyContent:'center'
    },

    button_modal:{
        padding:9,
        backgroundColor:COLORS.background,
        borderRadius:5,
        alignItems:'center',
        alignSelf:'center',
        marginTop:10
    },
    button_text_modal:{
        fontSize:17,
        fontWeight:'bold',
        color:COLORS.white
    }
})