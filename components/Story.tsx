import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function Story({ item }: { item: any }) {
    // Якщо це "Моя історія" — показуємо без градієнта
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

    // Якщо це чужа історія — показуємо ГРАДІЄНТНИЙ БОРДЕР
    return (
        <TouchableOpacity style={styles.container}>
            <LinearGradient
                // 🔥 ТУТ КОЛЬОРИ ГРАДІЄНТА
                // Срібний/Монохромний ефект:
                colors={['#ffffff', '#808080', '#202020']}

                // Якщо захочеш кольоровий (Instagram-style), розкоментуй це:
                // colors={['#F58529', '#DD2A7B', '#8134AF', '#515BD4']}

                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
            >
                {/* Цей View робить "відступ" між градієнтом і фото */}
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
    // Це зовнішнє кільце (градієнт)
    gradientBorder: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,
    },
    // Це прошарок (чорний фон), щоб відділити фото від рамки
    innerContainer: {
        width: 82,      // Трохи менше за градієнт (різниця = товщина рамки)
        height: 82,
        borderRadius: 41,
        backgroundColor: COLORS.background, // 🔥 Колір фону додатку (щоб виглядало як кільце)
        justifyContent: "center",
        alignItems: "center",
    },
    // Контейнер для "Моєї історії" (без градієнта)
    noBorderContainer: {
        width: 88,
        height: 88,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,
    },
    image: {
        width: 76,      // Фото ще трохи менше
        height: 76,
        borderRadius: 38,
        backgroundColor: COLORS.surface
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
        borderColor: COLORS.background
    },
});