import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter, useSegments, Slot } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

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
            if (currentSegment !== '(tabs)') {
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