import { View, ScrollView, StyleSheet } from "react-native";
import { STORIES } from "@/constants/mock-data";
import Story from "@/components/Story";
import { COLORS } from "@/constants/theme";

export default function StoriesSection() {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {STORIES.map((story) => (
                    <Story key={story.id} item={story} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.surface,
        paddingVertical: 10,
        marginBottom: 5,
    },
    scrollContent: {
        paddingLeft: 16, // відступ зліва
    }
});