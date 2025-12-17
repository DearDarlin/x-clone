import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function Story({ item }: { item: any }) {

    if (item.isMyStory) {
        return (
            <TouchableOpacity style={styles.container}>
                <View style={styles.noBorderContainer}>
                    <Image source={{ uri: item.img }} style={styles.image} contentFit="cover" />
                    <View style={styles.addIcon}>
                        <Ionicons name="add" size={12} color="white" />
                    </View>
                </View>
                <Text style={styles.username} numberOfLines={1}>You</Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.container}>
            <LinearGradient
                colors={['#ffffff', '#808080', '#202020']}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
            >
                <View style={styles.innerContainer}>
                    <Image source={{ uri: item.img }} style={styles.image} contentFit="cover" />
                </View>
            </LinearGradient>

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

    gradientBorder: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,
    },
    innerContainer: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: '#000000',
        justifyContent: "center",
        alignItems: "center",
    },
    noBorderContainer: {
        width: 88,
        height: 88,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,
    },
    image: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    username: {
        color: COLORS.white,
        fontSize: 13
    },
    addIcon: {
        position: "absolute",
        bottom: 2,
        right: 2,
        backgroundColor: COLORS.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: '#000000'
    },
});