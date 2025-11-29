import { View, Text, Button } from 'react-native';
import { useClerk } from '@clerk/clerk-expo';

export default function ProfileScreen() {
    const { signOut } = useClerk();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Мій профіль</Text>
            <Button title="Вийти" color="red" onPress={() => signOut()} />
        </View>
    );
}