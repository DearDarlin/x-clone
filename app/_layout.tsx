import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import InitialLayout from '../components/InitialLayout';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { InitialProfileSetup } from "@/components/InitialProfileSetup";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

WebBrowser.maybeCompleteAuthSession();

SplashScreen.preventAutoHideAsync().catch(() => { });

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const tokenCache = {
  async getToken(key: string) {
    try {
      return Platform.OS === 'web' ? null : await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return Platform.OS === 'web' ? undefined : await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
if (!publishableKey) throw new Error('Missing Publishable Key');

function RootContent() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const user = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : 'skip');

  if (!isLoaded) {
    return <View style={styles.fullscreen} />;
  }

  if (!isSignedIn) {
    return <InitialLayout />;
  }
  if (user === undefined) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={styles.loader.color}/>
      </View>
    );
  }

  if (user === null) {
    return <InitialProfileSetup />;
  }
  return <InitialLayout />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf')
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <SafeAreaProvider>
            <View style={styles.root}>
              <RootContent />
            </View>
          </SafeAreaProvider>
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
  },

  fullscreen: {
    flex: 1,
    backgroundColor: 'black',
  },

  center: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loader: {
    color: '#1DA1F2',
  },
});
