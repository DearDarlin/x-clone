import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import ImageViewing from "react-native-image-viewing";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const { width } = Dimensions.get("window");

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
    isLiked?: boolean; // тип для лайка
};

export default function Post({ post }: { post: any }) {
    const [visible, setVisible] = useState(false);

    const toggleLike = useMutation(api.posts.toggleLike);

    const handleLike = () => {
        toggleLike({ postId: post._id });
    };

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
            {/* Header */}
            <View style={styles.postHeader}>
                <View style={styles.postHeaderLeft}>
                    <Image
                        source={post.author?.image ? { uri: post.author.image } : null}
                        style={styles.postAvatar}
                        contentFit="cover"
                    />
                    <View>
                        <Text style={styles.postUsername} numberOfLines={1}>
                            {post.author?.fullname || "Unknown User"}
                        </Text>
                        <Text style={styles.timeAgo}>{timeAgo}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.moreButton} onPress={() => { }}>
                    <Ionicons
                        name="ellipsis-horizontal"
                        size={20}
                        color={COLORS.grey}
                    />
                </TouchableOpacity>
            </View>

            {/* Image */}
            {post.imageUrl && (
                <>
                    <TouchableOpacity onPress={() => setVisible(true)}>
                        <Image
                            source={{ uri: post.imageUrl }}
                            style={styles.postImage}
                            contentFit="cover"
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

            {/* Actions */}
            <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>

                    {/* червоне серце */}
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons
                            name={post.isLiked ? "heart" : "heart-outline"}
                            size={22}
                            color={post.isLiked ? "#ff3040" : COLORS.white}
                        />
                    </TouchableOpacity>


                    <TouchableOpacity>
                        <Ionicons name="chatbubble-outline" size={22} color={COLORS.white} />
                    </TouchableOpacity>



                    <TouchableOpacity>
                        <Ionicons name="stats-chart-outline" size={22} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity>
                    <Ionicons name="share-outline" size={22} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* Caption */}
            {post.caption && (
                <View style={styles.postInfo}>
                    {/* кількість лайків */}
                    {!!post.likes && (
                        <Text style={styles.likesText}>
                            {post.likes} {post.likes === 1 ? "like" : "likes"}
                        </Text>
                    )}

                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername}>
                            {post.author?.username || "user"}
                        </Text>
                        <Text style={styles.captionText}>{post.caption}</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    post: {
        marginBottom: 16,
        backgroundColor: COLORS.background,
    },
    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
    },
    postHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    postAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    postUsername: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.white,
    },
    timeAgo: {
        fontSize: 12,
        color: COLORS.grey,
    },
    postImage: {
        width: width,
        height: width,
    },
    postActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    postActionsLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    postInfo: {
        paddingHorizontal: 12,
    },
    // стиль для тексту лайков
    likesText: {
        color: COLORS.white,
        fontWeight: "600",
        fontSize: 14,
        marginBottom: 6,
    },
    captionContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 6,
    },
    captionUsername: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.white,
        marginRight: 6,
    },
    captionText: {
        fontSize: 14,
        color: COLORS.white,
        flex: 1,
    },
    moreButton: {
        padding: 6,
    },
});