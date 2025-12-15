import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import ImageViewing from "react-native-image-viewing";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CommentsModal from "./CommentsModal";
import ReportModal from "./ReportModal";

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
    isLiked?: boolean;
    isBookmarked?: boolean;
};

export default function Post({ post }: { post: any }) {
    const [visible, setVisible] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [isHidden, setIsHidden] = useState(false); // стан для приховування поста

    const toggleLike = useMutation(api.posts.toggleLike);
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
    const deletePost = useMutation(api.posts.deletePost);
    const currentUser = useQuery(api.users.currentUser);

    const handleLike = () => {
        toggleLike({ postId: post._id });
    };

    const handleBookmark = () => {
        toggleBookmark({ postId: post._id });
    };

    const handleDelete = () => {
        Alert.alert("Видалити пост", "Ви впевнені?", [
            { text: "Відмінити", style: "cancel" },
            {
                text: "Видалити",
                style: "destructive",
                onPress: () => deletePost({ postId: post._id }),
            },
        ]);
    };

    // функція відкриття меню
    const handleOptions = () => {
        Alert.alert("Опції поста", undefined, [
            { text: "Відмінити", style: "cancel" },
            {
                text: "Поскаржитись",
                style: "destructive",
                onPress: () => setShowReport(true),
            },
        ]);
    };

    let timeAgo = "just now";
    try {
        timeAgo = formatDistanceToNow(new Date(post._creationTime), { addSuffix: true })
            .replace("about ", "")
            .replace("less than a minute ago", "just now");
    } catch {
        timeAgo = new Date(post._creationTime).toLocaleDateString();
    }

    const isOwner = currentUser?._id === post.userId;

    // якщо пост приховано після скарги
    if (isHidden) {
        return (
            <View style={styles.hiddenPost}>
                <Ionicons name="checkmark-circle-outline" size={32} color={COLORS.grey} />
                <Text style={styles.hiddenText}>Скаргу отримано.</Text>
                <TouchableOpacity onPress={() => setIsHidden(false)}>
                    <Text style={styles.undoText}>Повернути пост - "return"</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.post}>
            <CommentsModal
                visible={showComments}
                onClose={() => setShowComments(false)}
                postId={post._id}
            />

            {/* модалка скарг */}
            <ReportModal
                visible={showReport}
                onClose={() => setShowReport(false)}
                postId={post._id}
                onReportSubmitted={() => setIsHidden(true)} // приховуємо пост після успіху
            />

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

                {isOwner ? (
                    <TouchableOpacity style={styles.moreButton} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color="#ff3040" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.moreButton} onPress={handleOptions}>
                        <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.grey} />
                    </TouchableOpacity>
                )}
            </View>

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

            <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons
                            name={post.isLiked ? "heart" : "heart-outline"}
                            size={22}
                            color={post.isLiked ? "#ff3040" : COLORS.white}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowComments(true)}>
                        <Ionicons name="chatbubble-outline" size={22} color={COLORS.white} />
                    </TouchableOpacity>

                </View>

                <TouchableOpacity onPress={handleBookmark}>
                    <Ionicons
                        name={post.isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={22}
                        color={post.isBookmarked ? COLORS.primary : COLORS.white}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.postInfo}>
                <View style={styles.statsRow}>
                    {!!post.likes && (
                        <Text style={styles.likesText}>
                            {post.likes} {post.likes === 1 ? "like" : "likes"}
                        </Text>
                    )}
                    {!!post.comments && (
                        <Text style={styles.likesText}>
                            {post.comments} {post.comments === 1 ? "comment" : "comments"}
                        </Text>
                    )}
                </View>

                {post.caption && (
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername}>
                            {post.author?.username || "user"}
                        </Text>
                        <Text style={styles.captionText}>{post.caption}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    post: {
        marginBottom: 16,
        backgroundColor: COLORS.background,
    },
    // стилі для прихованого поста
    hiddenPost: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.surface,
        marginBottom: 16,
        gap: 8,
        minHeight: 150,
    },
    hiddenText: {
        color: COLORS.grey,
        fontSize: 16,
        fontWeight: "bold",
    },
    undoText: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: "600",
        marginTop: 4,
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
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 6,
    },
    likesText: {
        color: COLORS.white,
        fontWeight: "600",
        fontSize: 14,
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