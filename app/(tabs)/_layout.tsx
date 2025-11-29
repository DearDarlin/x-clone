// стас, для тебе підказки по коду

import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false, // приховуємо хедер
                tabBarActiveTintColor: '#1DA1F2', // активна - блакитна
                tabBarInactiveTintColor: '#657786', // неактивна - сіра
                tabBarStyle: {
                    backgroundColor: '#000000', // темна тема (чорний фон)
                    borderTopWidth: 0.5,
                    borderTopColor: '#333',
                    height: 70,
                    paddingBottom: 20,
                },
                tabBarShowLabel: false, // прибираємо підписи
            }}>

            {/* 1. Головна */}
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => <MaterialIcons name="home" size={30} color={color} />,
                }}
            />

            {/* 2. Створити */}
            <Tabs.Screen
                name="create"
                options={{
                    tabBarIcon: ({ color }) => <MaterialIcons name="add-circle-outline" size={28} color={color} />,
                }}
            />

            {/* 3. Сповіщення */}
            <Tabs.Screen
                name="notifications"
                options={{
                    tabBarIcon: ({ color }) => <MaterialIcons name="notifications-none" size={28} color={color} />,
                }}
            />

            {/* 4. Профіль */}
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color }) => <MaterialIcons name="person-outline" size={28} color={color} />,
                }}
            />
        </Tabs>
    );
}