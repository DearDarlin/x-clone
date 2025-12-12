import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import InitialLayout from '../components/InitialLayout';
import {useFonts} from 'expo-font'
import { useCallback } from 'react';
import { SplashScreen } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const tokenCache = {
  async getToken(key: string) {
    try {
      if (Platform.OS === 'web') return null;
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      if (Platform.OS === 'web') return;
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Missing Publishable Key');
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Medium':require('../assets/images/Fonts/JetBrainsMono-Medium.ttf'),
    'SpaceMono-Regular':require('../assets/images/Fonts/SpaceMono-Regular.ttf')
  })

  const OnLayoutRootView = useCallback(async ()=> {
    if(fontsLoaded) await SplashScreen.hideAsync();
  },[fontsLoaded]
)

if(!fontsLoaded) return null

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <SafeAreaProvider onLayout={OnLayoutRootView}>
            <InitialLayout />
          </SafeAreaProvider>
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

// обновлено