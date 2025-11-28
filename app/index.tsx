import { ConvexAndClerkProvider } from "@/providers/ConvexAndClerkProvider";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <ConvexAndClerkProvider>
      <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
    </ConvexAndClerkProvider>
  );
}
