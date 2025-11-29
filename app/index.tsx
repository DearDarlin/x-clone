<<<<<<< HEAD
import { Redirect } from "expo-router";
 
=======
import { View, ActivityIndicator } from 'react-native';
>>>>>>> yaroslav

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/*...*/}
      <ActivityIndicator size="large" />
    </View>
  );
}