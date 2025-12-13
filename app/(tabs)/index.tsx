import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { COLORS } from '@/constants/theme';
import Post from '../../components/Post';
import { SafeAreaView } from 'react-native-safe-area-context';
import StoriesSection from '../../components/StoriesSection';

export default function Feed() {
    const posts = useQuery(api.posts.get);

    if (posts === undefined) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#1DA1F2" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <Post post={item} />}
                // сторіс зверху 
                ListHeaderComponent={<StoriesSection />}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: 'white', fontSize: 18 }}>Поки що тут пусто</Text>
                        <Text style={{ color: 'gray', marginTop: 10 }}>Створи перший пост!</Text>
                    </View>
                )}

                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
});