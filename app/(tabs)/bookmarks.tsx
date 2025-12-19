import { Loader } from '@/components/Loader';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/feed.styles';
import { MaterialIcons } from '@expo/vector-icons';
import { useConvexAuth, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { ScrollView, Text, View } from 'react-native';

export default function BookmarksScreen() {
    const { isAuthenticated } = useConvexAuth();
    const bookmarks = useQuery(api.bookmarks.getBookmarkedPosts, isAuthenticated ? {} : 'skip');

    if (bookmarks === undefined) return <Loader />;
    if (!bookmarks || bookmarks.length === 0) return <NoBookmarksFound />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bookmarks</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 8, flexDirection: 'row', flexWrap: 'wrap' }}>
                {bookmarks.map((post) => {
                    if (!post) return null;
                    return (
                        <View key={post._id} style={{ padding: 2, width: '33.33%' }}>
                            <Image
                                source={{ uri: post.imageUrl }}
                                style={{ width: '100%', aspectRatio: 1 }}
                                contentFit="cover"
                                transition={200}
                                cachePolicy={'memory-disk'}
                            />
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

function NoBookmarksFound() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.background,
            }}
        >
            <MaterialIcons name="collections-bookmark" size={74} color={COLORS.primary} />
            <Text style={{ color: COLORS.primary, fontSize: 22, marginTop: 12 }}>Поки що порожньо</Text>
            <Text style={{ color: COLORS.grey, marginTop: 6 }}>Збережені пости з'являться тут</Text>
        </View>
    );
}