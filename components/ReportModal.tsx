import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// список причин для скарги
const REPORT_REASONS = [
    "Це спам",
    "Голі зображення чи сексуальна активність",
    "Ненависть чи ненависна символіка",
    "Насильство чи небезпечні організації",
    "Булінг чи переслідування",
    "Фальшива інформація",
];

interface ReportModalProps {
    visible: boolean;
    onClose: () => void;
    postId: string;
    onReportSubmitted: () => void; // функція, яку викликаємо після успіху
}

export default function ReportModal({ visible, onClose, postId, onReportSubmitted }: ReportModalProps) {
    const sendReport = useMutation(api.reports.sendReport);

    const handleReport = async (reason: string) => {
        try {
            await sendReport({ postId: postId as any, reason });
            // викликаємо функцію, яка сховає пост і покаже повідомлення
            onReportSubmitted();
            onClose();
        } catch (error) {
            Alert.alert("Помилка", "Щось пішло не так. Спробуйте ще раз.");
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Скарга</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>Чому ви скаржите цей пост?</Text>

                    <FlatList
                        data={REPORT_REASONS}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.reasonItem}
                                onPress={() => handleReport(item)}
                            >
                                <Text style={styles.reasonText}>{item}</Text>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    container: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        maxHeight: "80%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.background,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.white,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.white,
        padding: 16,
    },
    reasonItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.background,
    },
    reasonText: {
        color: COLORS.white,
        fontSize: 16,
    },
});