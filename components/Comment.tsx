import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons"; // іконки
import { useMutation, useQuery } from "convex/react"; // хуки convex
import { api } from "@/convex/_generated/api";

export default function Comment({ comment, postOwnerId }: { comment: any, postOwnerId: string }) {
    // мутація видалення
    const deleteComment = useMutation(api.comments.deleteComment);
    // отримання поточного юзера
    const currentUser = useQuery(api.users.currentUser);

    // чи можна видаляти (автор комента або поста)
    const canDelete = currentUser?._id === comment.userId || currentUser?._id === postOwnerId;

    // функція видалення з підтвердженням
    const handleDelete = () => {
        Alert.alert("Видалити коментар", "Ви впевнені?", [
            { text: "Відмінити", style: "cancel" },
            {
                text: "Видалити",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteComment({ commentId: comment._id });
                    } catch (error) {
                        console.log(error);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: comment.author?.image }}
                style={styles.avatar}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.username}>{comment.author?.username}</Text>
                    <Text style={styles.time}>
                        {formatDistanceToNow(new Date(comment._creationTime), { addSuffix: true })}
                    </Text>
                </View>
                <Text style={styles.text}>{comment.content}</Text>
            </View>

            {/* кнопка видалення */}
            {canDelete && (
                <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={16} color={COLORS.grey} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.surface,
        alignItems: "flex-start", // вирівнювання по верху
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    content: {
        flex: 1,
        marginRight: 8, // відступ від кнопки видалення
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
        paddingRight: 4, // відступ щоб текст не злипався
    },
    username: {
        color: COLORS.white,
        fontWeight: "bold",
    },
    time: {
        color: COLORS.grey,
        fontSize: 12,
    },
    text: {
        color: COLORS.white,
        fontSize: 14,
    },
    // стиль кнопки видалення
    deleteBtn: {
        padding: 4,
        marginTop: -2,
    },
});