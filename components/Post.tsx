import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import ImageViewing from "react-native-image-viewing";

export default function Post({ post }: { post: any }) {
    // чи відкрито фото на весь екран
    const [visible, setVisible] = useState(false);

    // коли виставлено
    let timeAgo = "just now";
    try {
        timeAgo = formatDistanceToNow(new Date(post._creationTime), { addSuffix: true })
            .replace("about ", "")
            .replace("less than a minute ago", "just now");
    } catch (e) {
        // запас
        timeAgo = new Date(post._creationTime).toLocaleDateString();
    }

    return (
        <View style={styles.post}>
            {/* аватар */}
            <Image
                source={post.author?.image ? { uri: post.author.image } : null}
                style={styles.avatar}
                contentFit="cover"
            />

            <View style={styles.content}>
                {/*шапка */}
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

                {/*покращеннями для iPad та якості*/}
                {post.imageUrl && (
                    <>
                        {/* обгорнули, щоб натискати на нього */}
                        <TouchableOpacity
                            onPress={() => setVisible(true)}
                            activeOpacity={1}
                        >
                            <Image
                                source={{ uri: post.imageUrl }}
                                style={styles.postImage}
                                // повністю,без обрізання
                                contentFit="contain"
                                transition={200}
                                cachePolicy="memory-disk" // для швидкості кешування
                            />
                        </TouchableOpacity>

                        {/* visible=true показує на весь екран */}
                        <ImageViewing
                            images={[{ uri: post.imageUrl }]}
                            imageIndex={0}
                            visible={visible}
                            onRequestClose={() => setVisible(false)}
                            swipeToCloseEnabled={true} // можна закрити свайпом вниз
                            doubleTapToZoomEnabled={true} // подвійний тап для зуму
                        />
                    </>
                )}

                {/* кнопки дій */}
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