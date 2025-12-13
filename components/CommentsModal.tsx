import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Comment from "./Comment";

interface CommentsModalProps {
    visible: boolean;
    onClose: () => void;
    postId: string;
}

export default function CommentsModal({ visible, onClose, postId }: CommentsModalProps) {
    const [newComment, setNewComment] = useState("");
    const comments = useQuery(api.comments.getComments, { postId: postId as any });
    const addComment = useMutation(api.comments.addComment);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await addComment({ postId: postId as any, content: newComment });
            setNewComment("");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Comments</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                {comments === undefined ? (
                    <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <Comment comment={item} />}
                        ListEmptyComponent={
                            <Text style={styles.empty}>No comments yet. Be the first!</Text>
                        }
                    />
                )}

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
                >
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Post your reply"
                            placeholderTextColor={COLORS.grey}
                            value={newComment}
                            onChangeText={setNewComment}
                        />
                        <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
                            <Text style={[styles.sendBtn, !newComment.trim() && { opacity: 0.5 }]}>
                                Post
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.surface,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.white,
    },
    empty: {
        color: COLORS.grey,
        textAlign: "center",
        marginTop: 40,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderTopWidth: 0.5,
        borderTopColor: COLORS.surface,
        paddingBottom: 30,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        paddingHorizontal: 16,
        color: COLORS.white,
        marginRight: 10,
    },
    sendBtn: {
        color: COLORS.primary,
        fontWeight: "bold",
    },
});