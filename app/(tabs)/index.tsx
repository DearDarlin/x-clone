import { View, Text } from 'react-native';
import { authStyles } from '../../styles/auth.styles';

export default function Feed() {
    return (
        <View style={authStyles.container}>
            <Text style={authStyles.text}>Ти увійшов! Це головна!</Text>
        </View>
    );
}