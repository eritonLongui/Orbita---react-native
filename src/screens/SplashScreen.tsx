import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export function SplashScreen({ navigation }: Props) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        navigation.replace('Onboarding');
      }, 1500);
    });
  }, [fadeAnim, navigation]);

  return (
    <View className="flex-1 bg-space-black items-center justify-center">
      <Animated.View style={{ opacity: fadeAnim }} className="items-center">
        <View className="w-24 h-24 rounded-full bg-deep-navy border-2 border-solar-amber items-center justify-center mb-6 shadow-lg shadow-solar-amber/20">
          <Text className="text-solar-amber text-4xl font-bold">O</Text>
        </View>
        <Text className="text-text-primary text-3xl font-bold tracking-widest mb-2">ORBITA</Text>
        <Text className="text-text-secondary text-sm tracking-widest">SEU COPILOTO EMOCIONAL</Text>
      </Animated.View>
    </View>
  );
}
