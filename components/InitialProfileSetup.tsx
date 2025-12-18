import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { COLORS } from '@/constants/theme';
import { BlurView } from 'expo-blur';

export const InitialProfileSetup = () => {
    const { isLoaded, isSignedIn, userId, signOut } = useAuth();
    const { user } = useUser();

    const currentUserFromConvex = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : 'skip');
    const createUser = useMutation(api.users.createUser);
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.fullName) setFullname(user.fullName);
            const defaultNick = user.username || user.primaryEmailAddress?.emailAddress.split('@')[0] || '';
            setUsername(defaultNick);
        }
    }, [user]);

    if (!isLoaded || !isSignedIn) return null;
    if (currentUserFromConvex === undefined) return null;
    if (currentUserFromConvex !== null) return null;

    const handleCreateUser = async () => {
        const nameToSave = fullname.trim();
        const usernameToSave = username.trim();

        if (nameToSave.length < 3 || usernameToSave.length < 3) {
            Alert.alert("Помилка", "Ім'я та нікнейм — мінімум 3 символи");
            return;
        }

        setLoading(true);
        try {
            await createUser({
                fullname: nameToSave,
                username: usernameToSave,
                email: user?.primaryEmailAddress?.emailAddress || '',
                image: user?.imageUrl || '',
                clerkId: userId!,
                bio: "Hey there!",
            });
        } catch (error) {
            console.error("Error creating profile:", error);
            Alert.alert("Помилка", "Можливо, такий нікнейм вже зайнятий.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={true} transparent={true} animationType="fade">
            <BlurView intensity={100} tint="dark" style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Створіть профіль</Text>

                    <Text style={styles.subtitle}>Оберіть нікнейм</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ваше ім'я"
                        placeholderTextColor="#666"
                        value={fullname}
                        onChangeText={setFullname}
                    />

                    <Text style={styles.subtitle}>Як вас звати?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="username"
                        placeholderTextColor="#666"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleCreateUser} disabled={loading}>
                        {loading ? <ActivityIndicator color="black" /> : <Text style={styles.buttonText}>Почати</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginTop: 20 }} onPress={() => signOut()}>
                        <Text style={{ color: 'red', fontSize: 14 }}>Вийти з акаунту</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.9)' },
    content: { width: '85%', backgroundColor: '#151515', padding: 30, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
    title: { fontSize: 22, fontWeight: 'bold', color: COLORS.white, marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#888', marginBottom: 5, alignSelf: 'flex-start', marginLeft: 5 },
    input: { width: '100%', backgroundColor: '#222', color: COLORS.white, padding: 15, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#444', marginBottom: 15 },
    button: { width: '100%', backgroundColor: COLORS.white, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonText: { color: 'black', fontWeight: 'bold', fontSize: 16 }
});