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
    Keyboard,
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
    postOwnerId: string;
}

export default function CommentsModal({ visible, onClose, postId, postOwnerId }: CommentsModalProps) {
    const [newComment, setNewComment] = useState("");
    const comments = useQuery(api.comments.getComments, { postId: postId as any });
    const addComment = useMutation(api.comments.addComment);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await addComment({ postId: postId as any, content: newComment });
            setNewComment("");
            Keyboard.dismiss();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            {/* 👇 ОСЬ ТУТ БУЛА ПОМИЛКА. style={styles.overlay} має бути всередині цього тега 👇 */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.overlay}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={styles.modalContent}>
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>

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
                            renderItem={({ item }) => <Comment comment={item} postOwnerId={postOwnerId} />}
                            ListEmptyComponent={
                                <Text style={styles.empty}>No comments yet. Be the first!</Text>
                            }
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    )}

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Post your reply"
                            placeholderTextColor={COLORS.grey}
                            value={newComment}
                            onChangeText={setNewComment}
                            multiline
                        />
                        <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
                            <Text style={[styles.sendBtn, !newComment.trim() && { opacity: 0.5 }]}>
                                Post
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    backdrop: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: "80%",
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 5,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.grey,
        borderRadius: 2,
        opacity: 0.5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 10,
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
        paddingBottom: Platform.OS === 'ios' ? 40 : 12,
        backgroundColor: COLORS.background,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: COLORS.white,
        marginRight: 10,
    },
    sendBtn: {
        color: COLORS.primary,
        fontWeight: "bold",
        fontSize: 16,
    },
});