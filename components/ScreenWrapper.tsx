import { StyleSheet, ViewStyle, Animated, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";

const { width, height } = Dimensions.get("window");

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const ScreenWrapper = ({ children, style }: ScreenWrapperProps) => {
    const moveAnim1 = useRef(new Animated.Value(0)).current;
    const moveAnim2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(moveAnim1, {
                    toValue: 1,
                    duration: 6000,
                    useNativeDriver: true,
                }),
                Animated.timing(moveAnim1, {
                    toValue: 0,
                    duration: 6000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(moveAnim2, {
                    toValue: 1,
                    duration: 8000, // 8 секунд
                    useNativeDriver: true,
                }),
                Animated.timing(moveAnim2, {
                    toValue: 0,
                    duration: 8000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const translateY1 = moveAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200], // вниз
    });

    const translateX1 = moveAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 100], // вправо
    });

    const translateY2 = moveAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -150], // вгору
    });

    const translateX2 = moveAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100], // вліво
    });

    return (
        <View style={styles.container}>
            {/* темний фон */}
            <LinearGradient
                colors={['#0f2027', '#203a43', '#2c5364']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.backgroundObjects}>
                {/* куля 1: */}
                <Animated.View
                    style={[
                        styles.blob,
                        {
                            backgroundColor: '#4c669f',
                            top: -100,
                            left: -50,
                            transform: [
                                { translateY: translateY1 },
                                { translateX: translateX1 },
                                { scale: 1.5 }
                            ]
                        },
                    ]}
                />

                {/* куля 2: */}
                <Animated.View
                    style={[
                        styles.blob,
                        {
                            backgroundColor: '#1fa2ff',
                            bottom: -100,
                            right: -50,
                            opacity: 0.25,
                            transform: [
                                { translateY: translateY2 },
                                { translateX: translateX2 },
                                { scale: 1.8 }
                            ]
                        },
                    ]}
                />
            </View>

            <SafeAreaView style={[styles.safeArea, style]}>
                <StatusBar style="light" />
                {children}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f2027',
    },
    safeArea: {
        flex: 1,
    },
    backgroundObjects: {
        ...StyleSheet.absoluteFillObject, // займання всього екрану
        overflow: 'hidden',
        zIndex: 0,
    },
    blob: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.3,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 50,
        elevation: 10,
    },
});