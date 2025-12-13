import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function Story({ item }: { item: any }) {
    return (
        <TouchableOpacity style={styles.container}>
            <View style={[styles.border, item.isMyStory && styles.noBorder]}>
                <Image source={{ uri: item.img }} style={styles.image} contentFit="cover" />
                {item.isMyStory && (
                    <View style={styles.addIcon}>
                        <Ionicons name="add" size={12} color="white" />
                    </View>
                )}
            </View>
            <Text style={styles.username} numberOfLines={1}>{item.username}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginRight: 15,
        width: 90
    },
    border: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 2,
        borderColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5
    },
    noBorder: {
        borderWidth: 0
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.surface
    },
    username: {
        color: COLORS.white,
        fontSize: 13
    },
    addIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        width: 24,
        height: 24,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: COLORS.background
    },
});