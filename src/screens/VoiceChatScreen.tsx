import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { X } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

export function VoiceChatScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View className="flex-1 bg-space-black items-center justify-center">
      <TouchableOpacity 
        className="absolute top-14 right-6 w-10 h-10 rounded-full bg-deep-navy items-center justify-center border border-text-secondary/20"
        onPress={() => navigation.goBack()}
      >
        <X color="#AEB8C7" size={24} />
      </TouchableOpacity>

      <View className="items-center mb-16">
        <Text className="text-text-secondary text-lg mb-2">Assistente Ativo</Text>
        <Text className="text-text-primary text-2xl font-bold text-center px-8">
          "Estou ouvindo. Pode falar..."
        </Text>
      </View>

      <View className="items-center justify-center">
        <Animated.View 
          style={{ transform: [{ scale: pulseAnim }] }}
          className="absolute w-64 h-64 rounded-full bg-solar-amber/5"
        />
        <Animated.View 
          style={{ transform: [{ scale: pulseAnim }] }}
          className="absolute w-48 h-48 rounded-full bg-solar-amber/10"
        />
        <Animated.View 
          style={{ transform: [{ scale: pulseAnim }] }}
          className="absolute w-32 h-32 rounded-full bg-solar-amber/20"
        />
        <TouchableOpacity className="w-24 h-24 rounded-full bg-solar-amber items-center justify-center shadow-lg shadow-solar-amber/50">
          {/* Animated sound waves simulation could go here */}
          <View className="flex-row items-center justify-center gap-1">
            <View className="w-1.5 h-8 bg-space-black rounded-full" />
            <View className="w-1.5 h-12 bg-space-black rounded-full" />
            <View className="w-1.5 h-6 bg-space-black rounded-full" />
            <View className="w-1.5 h-10 bg-space-black rounded-full" />
            <View className="w-1.5 h-7 bg-space-black rounded-full" />
          </View>
        </TouchableOpacity>
      </View>
      
      <Text className="text-text-secondary absolute bottom-16">Toque para pausar</Text>
    </View>
  );
}
