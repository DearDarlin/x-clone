import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false, // приховуємо хедер
                tabBarActiveTintColor: '#1DA1F2', // активна - блакитна
                tabBarInactiveTintColor: '#b0b3b8', // трохи світліший сірий


                tabBarBackground: () => (
                    <BlurView
                        intensity={80}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />
                ),

                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 80,
                    paddingTop: 10,
                },
                tabBarShowLabel: false,
            }}>

            {/* головна */}
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => <MaterialIcons name="home" size={30} color={color} />,
                }}
            />

            {/*  пошук (може реалізую, якщо буде час) */}
            <Tabs.Screen
                name="search"
                options={{
                    href: null,
                }}
            />

            {/* створити */}
            <Tabs.Screen
                name="create"
                options={{
                    tabBarIcon: ({ color }) => <MaterialIcons name="add-circle-outline" size={30} color={color} />,
                }}
            />

            {/* сповіщення */}
            <Tabs.Screen
                name="notifications"
                options={{
                    tabBarIcon: ({ color }) => <MaterialIcons name="notifications-none" size={30} color={color} />,
                }}
            />

            {/* приховати bookmarks файл з табів, оскільки доступ через профіль */}
            <Tabs.Screen
                name="bookmarks"
                options={{
                    href: null,
                }}
            />



            {/* профіль */}
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color }) => <MaterialIcons name="person-outline" size={30} color={color} />,
                }}
            />
        </Tabs>
    );
}