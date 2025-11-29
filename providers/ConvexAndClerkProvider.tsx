// import { ClerkProvider, useAuth,ClerkLoaded } from "@clerk/clerk-expo";
// import { ConvexProviderWithClerk } from "convex/react-clerk";
// import {ConvexReactClient} from"convex/react"

// import * as SecureStore from 'expo-secure-store';
// import { Platform } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';

// WebBrowser.maybeCompleteAuthSession();

// const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
//   unsavedChangesWarning: false,
// });

// const tokenCache = {
//   async getToken(key: string) {
//     try {
//       if (Platform.OS === 'web') return null;
//       return await SecureStore.getItemAsync(key);
//     } catch (err) {
//       return null;
//     }
//   },
//   async saveToken(key: string, value: string) {
//     try {
//       if (Platform.OS === 'web') return;
//       return await SecureStore.setItemAsync(key, value);
//     } catch (err) {
//       return;
//     }
//   },
// };

// const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

// if (!publishableKey) {
//   throw new Error('Missing Publishable Key');
// }

// export const ConvexAndClerkProvider=({children}:{children:React.ReactNode})=>{
    
//     return(
//         <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
//             <ClerkLoaded>
//             <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
//                 {children}
//             </ConvexProviderWithClerk>
//             </ClerkLoaded>
//         </ClerkProvider>
//     )
// }