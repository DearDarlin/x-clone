import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingHorizontal: 15,
        paddingBottom: 5,
    },

    topSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    avatar_image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#000',
    },
    statsContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        marginLeft: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        color: COLORS.grey,
        fontSize: 13,
        marginTop: 2,
    },

    infoSection: {
        marginBottom: 15,
    },
    fullname: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    bio: {
        color: COLORS.white,
        fontSize: 15,
        lineHeight: 20,
    },

    buttonsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    editButton: {
        flex: 1,
        backgroundColor: '#1f1f1f',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    editButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 14,
    },
    iconButton: {
        width: 40,
        height: 36,
        backgroundColor: '#1f1f1f',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },

    divider: {
        height: 1,
        backgroundColor: '#333',
        marginBottom: 10,
        marginHorizontal: -15
    },

    modal: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    modal_content_container: {
        flex: 1,
        paddingBottom: 20
    },
    header_modal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        paddingTop: 60,
    },
    header_text_modal: {
        fontWeight: 'bold',
        fontSize: 18,
        color: COLORS.white
    },
    box_modal: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 20
    },
    text_box_modal: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: COLORS.white,
    },
    textinput_box_modal: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        color: COLORS.white,
        fontSize: 16,
        padding: 12,
        minHeight: 45,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    button_modal: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30
    },
    button_text_modal: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black'
    }
})