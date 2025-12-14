import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns";
import { COLORS } from "@/constants/theme";

export default function Comment({ comment }: { comment: any }) {
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.surface,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
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
});