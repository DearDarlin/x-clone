import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useSSO, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Linking } from 'react-native';

const { width, height } = Dimensions.get('window');

// фон
const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2940&auto=format&fit=crop';


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
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* зображення  */}
            <Image
                source={{ uri: BACKGROUND_IMAGE }}
                style={styles.backgroundImage}
                contentFit="cover"
                transition={600} // перехід при завантаженні
            />

            {/*затемнення */}
            <View style={styles.darkOverlay} />

            <SafeAreaView style={styles.contentContainer}>
                <View style={styles.header}>
                    <Ionicons name="logo-twitter" size={60} color="#ffffff" />
                </View>

                <View style={styles.mainContent}>
                    <Text style={styles.title}>
                        Спілкуйся з мамою{'\n'}і з іншими людьми.
                    </Text>
                    <Text style={styles.subtitle}>
                        Не треба платити мільйони.{"\n"}У нас усе безкоштовно!
                    </Text>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={onPress}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="logo-google" size={24} color="black" style={styles.btnIcon} />
                        <Text style={styles.googleButtonText}>
                            Увійти через Google
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.termsText}>
                        Продовжуючи, ви погоджуєтесь з нашими{' '}
                        <Text
                            style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}
                            onPress={() => Linking.openURL('https://x.com/tos')}
                        >
                            Умовами та Політикою конфіденційності.
                        </Text>
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0c29',
    },
    backgroundImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: height,
    },
    darkOverlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height: height,
        // яскравість
        // 0.3 - світліше, 0.7 - темніше. 
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        paddingTop: 50,
    },
    mainContent: {
        justifyContent: 'center',
        paddingBottom: 50,
    },
    title: {
        fontSize: 46,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 15,
        lineHeight: 52,
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    subtitle: {
        fontSize: 22,
        fontWeight: '500',
        color: '#E0E0E0',
        maxWidth: '80%',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    footer: {
        paddingBottom: 50,
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 35,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    btnIcon: {
        marginRight: 12,
    },
    googleButtonText: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    termsText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
