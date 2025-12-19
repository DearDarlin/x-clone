import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback
} from "react-native";
import { styles } from "@/styles/create.styles";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ScreenWrapper } from "@/components/ScreenWrapper";

export default function CreateScreen() {
    const router = useRouter();
    const { user } = useUser();

    const [caption, setCaption] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isSharing, setIsSharing] = useState(false);

    const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
    const createPost = useMutation(api.posts.createPost);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            quality: 1, // найвища якість
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleShare = async () => {
        if (!selectedImage && caption.trim().length === 0) return;

        Keyboard.dismiss(); //щоб можна було після того як написав, нажати на любу точку, і клавіатура сховалась

        try {
            setIsSharing(true);
            let storageId = undefined;

            if (selectedImage) {
                const uploadUrl = await generateUploadUrl();
                const response = await fetch(selectedImage);
                const blob = await response.blob();

                const result = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": "image/jpeg" },
                    body: blob,
                });

                if (!result.ok) throw new Error("Upload failed");
                const json = await result.json();
                storageId = json.storageId;
            }

            await createPost({ storageId, caption });

            setSelectedImage(null);
            setCaption("");
            router.push("/(tabs)");

        } catch (error) {
            console.error("Error sharing post:", error);
            alert("Failed to create post.");
        } finally {
            setIsSharing(false);
        }
    };

    // продовження того, шо зверху на рахунок клавіатури
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        // SafeAreaView, що шапка не залізе на верх екрану
        <ScreenWrapper>

            {/*1. HEADER}
            {/* завжди доступний */}
            <View style={[styles.header, { marginTop: 0, borderBottomWidth: 0 }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color={COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.shareButton,
                        (isSharing || (!selectedImage && caption.trim().length === 0)) && styles.shareButtonDisabled
                    ]}
                    disabled={isSharing || (!selectedImage && caption.trim().length === 0)}
                    onPress={handleShare}
                >
                    {isSharing ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.shareText}>Post</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* основний контент ( 2 ) */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.content}>

                            {/* Блок з аватаром і текстом */}
                            <View style={[styles.inputSection, { marginBottom: 10 }]}>
                                <Image
                                    source={user?.imageUrl}
                                    style={styles.userAvatar}
                                    contentFit="cover"
                                    transition={200}
                                />
                                <TextInput
                                    style={[styles.captionInput, { maxHeight: 150 }]}
                                    placeholder="Add a caption..."
                                    placeholderTextColor={COLORS.grey}
                                    multiline
                                    value={caption}
                                    onChangeText={setCaption}
                                    editable={!isSharing}
                                    autoFocus={true}
                                />
                            </View>

                            {/* Блок з фото (якщо вибрано) */}
                            {selectedImage && (
                                <View style={[styles.imageSection, { marginTop: 0 }]}>
                                    <Image
                                        source={selectedImage}
                                        style={styles.previewImage}
                                        contentFit="cover"
                                        transition={200}
                                    />
                                    {/* Кнопка видалити фото */}
                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            borderRadius: 20,
                                            padding: 4
                                        }}
                                        onPress={() => setSelectedImage(null)}
                                    >
                                        <Ionicons name="close" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Кнопка додати фото (якщо ще немає) */}
                            {!selectedImage && (
                                <TouchableOpacity
                                    onPress={pickImage}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 16,
                                        borderTopWidth: 0.5,
                                        borderTopColor: COLORS.surface
                                    }}
                                >
                                    <Ionicons name="image-outline" size={24} color={COLORS.primary} />
                                    <Text style={{ color: COLORS.primary, marginLeft: 10, fontWeight: '600' }}>
                                        Add Photo
                                    </Text>
                                </TouchableOpacity>
                            )}

                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}