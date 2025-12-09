import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

export default function Post({ post }: { post: any }) {
    const date = new Date(post._creationTime).toLocaleDateString();

    return (
        <View style={styles.post}>
            <Image
                source={post.author?.image}
                style={styles.avatar}
                contentFit="cover"
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={1}>
                        {post.author?.fullname || "Unknown User"}
                    </Text>
                    <Text style={styles.username} numberOfLines={1}>
                        @{post.author?.username || "user"}
                    </Text>
                    <Text style={styles.time}>· {date}</Text>
                </View>

                {post.caption ? <Text style={styles.text}>{post.caption}</Text> : null}

                {post.imageUrl && (
                    <Image
                        source={{ uri: post.imageUrl }}
                        style={styles.postImage}
                        // повністю,без обрізання
                        contentFit="contain"
                        transition={200}
                        cachePolicy="memory-disk"
                    />
                )}

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={18} color={COLORS.grey} />
                        <Text style={styles.actionText}>{post.comments || 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="heart-outline" size={18} color={COLORS.grey} />
                        <Text style={styles.actionText}>{post.likes || 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="share-social-outline" size={18} color={COLORS.grey} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    post: {
        flexDirection: "row",
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.surface || '#333',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: '#333',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    name: {
        fontWeight: "bold",
        color: "white",
        marginRight: 5,
        fontSize: 15,
    },
    username: {
        color: "#71767B",
        marginRight: 5,
        fontSize: 14,
        flex: 1,
    },
    time: {
        color: "#71767B",
        fontSize: 14,
    },
    text: {
        color: "white",
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 10,
    },
    postImage: {
        width: "100%",
        // виходячи з шириини екрану
        aspectRatio: 1,
        borderRadius: 12,
        marginBottom: 10,
        backgroundColor: '#000',
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
        paddingRight: 20,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    actionText: {
        color: "#71767B",
        fontSize: 13,
    },
});