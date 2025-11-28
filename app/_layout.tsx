import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";




export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </ClerkAndConvexProvider>
  );
}    
