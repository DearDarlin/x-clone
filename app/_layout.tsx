import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

import InitialLayout from "../components/InitialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";

WebBrowser.maybeCompleteAuthSession();

const tokenCache = {
  async getToken(key: string) {
    try {
      if (Platform.OS === "web") return null;
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      if (Platform.OS === "web") return;
      await SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
        <InitialLayout />
      </SafeAreaView>
    </ClerkAndConvexProvider>
  );
}
