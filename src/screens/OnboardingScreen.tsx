import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

export function OnboardingScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-space-black p-6 justify-between">
      <View className="flex-1 justify-center items-center">
        <View className="w-64 h-64 bg-deep-navy rounded-full border border-copper-glow/30 items-center justify-center mb-10">
          <Text className="text-text-secondary text-center px-8">
            [Ilustração de um astronauta ou nave espacial]
          </Text>
        </View>
        <Text className="text-text-primary text-2xl font-bold text-center mb-4">
          Bem-vindo à Orbita
        </Text>
        <Text className="text-text-secondary text-center text-base px-4 leading-6">
          Seu suporte emocional para missões de longa duração. Estamos aqui para ouvir, compreender e orientar você a qualquer momento.
        </Text>
      </View>
      
      <TouchableOpacity 
        className="bg-solar-amber py-4 rounded-xl items-center shadow-lg shadow-solar-amber/30 mb-8"
        onPress={() => navigation.replace('MainTabs')}
      >
        <Text className="text-space-black font-bold text-lg">Iniciar Jornada</Text>
      </TouchableOpacity>
    </View>
  );
}
