import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {ConvexReactClient} from"convex/react"

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
export const ConvexAndClerkProvider=({children}:{children:React.ReactNode})=>{
    
    return(
        <ClerkProvider publishableKey={'pk_test_aW5mb3JtZWQtZmluY2gtNTguY2xlcmsuYWNjb3VudHMuZGV2JA'}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}