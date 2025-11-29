import { View, Text, Button } from 'react-native';
import { useSSO, useAuth } from '@clerk/clerk-expo';
import React from 'react';
import { authStyles } from '../../styles/auth.styles';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const { startSSOFlow } = useSSO();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const onPress = React.useCallback(async () => {
        if (isSignedIn) return router.replace('/(tabs)');

        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_google' });
            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
            }
        } catch (err: any) {
            console.error('OAuth error:', err);
            if (JSON.stringify(err).includes('session_exists') || JSON.stringify(err).includes('already signed in')) {
                router.replace('/(tabs)');
            }
        }
    }, [isSignedIn]);

    return (
        <View style={authStyles.container}>
            <Text style={authStyles.text}>Twitter Clone Login</Text>
            <View style={authStyles.btnContainer}>
                <Button title="Увійти через Google" onPress={onPress} />
            </View>
        </View>
    );
}