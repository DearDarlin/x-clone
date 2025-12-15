import { View, ScrollView} from "react-native";
import { STORIES } from "@/constants/mock-data";
import Story from "@/components/Story";
import { COLORS } from "@/constants/theme";
import { styles } from '@/styles/feed.styles';

export default function StoriesSection() {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesContainer}
            >
                {STORIES.map((story) => (
                    <Story key={story.id} item={story} />
                ))}
            </ScrollView>
        </View>
    );
}

