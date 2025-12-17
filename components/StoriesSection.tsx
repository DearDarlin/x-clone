import { View, ScrollView } from "react-native";
import { STORIES } from "@/constants/mock-data";
import Story from "@/components/Story";
import { styles as feedStyles } from '@/styles/feed.styles';

export default function StoriesSection() {
    return (
        <View style={[feedStyles.container, {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderBottomWidth: 0,
        }]}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={feedStyles.storiesContainer}
            >
                {STORIES.map((story) => (
                    <Story key={story.id} item={story} />
                ))}
            </ScrollView>
        </View>
    );
}