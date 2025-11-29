import { View, Text, Button } from 'react-native';
import { useClerk } from '@clerk/clerk-expo';
import { authStyles } from '../../styles/auth.styles';

export default function Feed() {
    const { signOut } = useClerk();
    return (
        <View style={authStyles.container}>
            <Text style={authStyles.text}>Ти увійшов! Це головна.</Text>
            <Button title="Вийти" color="red" onPress={() => signOut()} />
        </View>
    );
}