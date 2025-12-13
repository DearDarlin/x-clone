import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import ImageViewing from "react-native-image-viewing";

type PostType = {
    _creationTime: number;
    caption?: string;
    imageUrl?: string;
    comments?: number;
    likes?: number;
    author?: {
        fullname?: string;
        username?: string;
        image?: string;
    };
};

export default function Post({ post }: { post: PostType }) {
    const [visible, setVisible] = useState(false);

    let timeAgo = "just now";
    try {
        timeAgo = formatDistanceToNow(new Date(post._creationTime), { addSuffix: true })
            .replace("about ", "")
            .replace("less than a minute ago", "just now");
    } catch {
        timeAgo = new Date(post._creationTime).toLocaleDateString();
    }

    return (
        <View style={styles.post}>
            <Image
                source={post.author?.image ? { uri: post.author.image } : null}
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
                    <Text style={styles.time}>· {timeAgo}</Text>
                </View>

                {post.caption && <Text style={styles.text}>{post.caption}</Text>}

                {post.imageUrl && (
                    <>
                        <TouchableOpacity onPress={() => setVisible(true)}>
                            <Image
                                source={{ uri: post.imageUrl }}
                                style={styles.postImage}
                                contentFit="contain"
                                transition={200}
                                cachePolicy="memory-disk"
                            />
                        </TouchableOpacity>

                        <ImageViewing
                            images={[{ uri: post.imageUrl }]}
                            imageIndex={0}
                            visible={visible}
                            onRequestClose={() => setVisible(false)}
                            swipeToCloseEnabled
                            doubleTapToZoomEnabled
                        />
                    </>
                )}

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble-outline" size={18} color={COLORS.grey} />
                        <Text style={styles.actionText}>{post.comments ?? 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="heart-outline" size={18} color={COLORS.grey} />
                        <Text style={styles.actionText}>{post.likes ?? 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="stats-chart-outline" size={18} color={COLORS.grey} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="share-outline" size={18} color={COLORS.grey} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    post: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.surface,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: COLORS.surface,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    name: {
        fontWeight: "bold",
        color: COLORS.white,
        marginRight: 5,
        fontSize: 15,
    },
    username: {
        color: COLORS.grey,
        marginRight: 5,
        fontSize: 14,
    },
    time: {
        color: COLORS.grey,
        fontSize: 14,
    },
    text: {
        color: COLORS.white,
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 10,
    },
    postImage: {
        width: "100%",
        // виходячи з шириини екрану
        aspectRatio: 1,
        borderRadius: 12,
        marginTop: 6,
        marginBottom: 10,
        backgroundColor: COLORS.background,
        marginLeft: -18,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
        paddingRight: 10,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    actionText: {
        color: COLORS.grey,
        fontSize: 13,
    },
});