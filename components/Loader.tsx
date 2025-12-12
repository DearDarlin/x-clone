import { ActivityIndicator, View, StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export default function Loader() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
});