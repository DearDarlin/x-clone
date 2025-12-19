import { api } from '@/convex/_generated/api';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function InitialLayout() {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const segments = useSegments();
    const router = useRouter();

    const createUser = useMutation(api.users.createUser);

    useEffect(() => {
        if (isSignedIn && user) {
            const generatedUsername = user.username || user.primaryEmailAddress?.emailAddress.split('@')[0] || "user";

            createUser({
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress || "",
                fullname: user.fullName || "User Name",
                image: user.imageUrl,
                bio: "Hey there!",
                username: generatedUsername,
            }).catch((err) => {
            });
        }
    }, [isSignedIn, user]);

    useEffect(() => {
        if (!isLoaded) return;
        const currentSegment = segments ? segments[0] : undefined;

        console.log("NAV CHECK:", { isSignedIn, currentSegment });

        if (isSignedIn) {
            if (currentSegment !== '(tabs)' && currentSegment !== 'user') {
                router.replace('/(tabs)');
            }
        } else if (!isSignedIn) {
            if (currentSegment !== '(auth)') {
                router.replace('/(auth)/login');
            }
        }
    }, [isSignedIn, isLoaded, segments]);

    if (!isLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <ActivityIndicator size="large" color="#1DA1F2" />
            </View>
        );
    }

    return <Slot />;
}