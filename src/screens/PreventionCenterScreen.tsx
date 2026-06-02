import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ShieldAlert, Wind, PhoneCall, HeartPulse } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

export function PreventionCenterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView className="flex-1 bg-space-black" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <View className="flex-row items-center gap-4 mb-8">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-deep-navy items-center justify-center border border-text-secondary/20"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-text-secondary text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-text-primary text-3xl font-bold">Prevenção</Text>
      </View>

      <View className="bg-copper-glow/10 rounded-2xl p-6 mb-8 border border-copper-glow/30 items-center text-center">
        <View className="w-16 h-16 rounded-full bg-copper-glow/20 items-center justify-center mb-4">
          <ShieldAlert color="#D9772B" size={32} />
        </View>
        <Text className="text-text-primary text-xl font-bold mb-2">Sinal de Alerta Detectado</Text>
        <Text className="text-text-secondary text-center leading-5 mb-4">
          A IA notou um aumento na sua frequência vocal e padrões de estresse nas últimas 24h. Recomendamos uma intervenção rápida.
        </Text>
      </View>

      <Text className="text-text-primary font-bold text-xl mb-4">Ações Imediatas</Text>

      <TouchableOpacity className="flex-row items-center bg-deep-navy rounded-2xl p-5 mb-4 border border-text-secondary/10">
        <View className="w-12 h-12 rounded-full bg-solar-amber/20 items-center justify-center mr-4">
          <Wind color="#FF9A2E" size={24} />
        </View>
        <View className="flex-1">
          <Text className="text-text-primary font-bold text-lg">Respiração Guiada</Text>
          <Text className="text-text-secondary text-sm">Protocolo 4-7-8 (3 minutos)</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center bg-deep-navy rounded-2xl p-5 mb-4 border border-text-secondary/10">
        <View className="w-12 h-12 rounded-full bg-solar-amber/20 items-center justify-center mr-4">
          <HeartPulse color="#FF9A2E" size={24} />
        </View>
        <View className="flex-1">
          <Text className="text-text-primary font-bold text-lg">Pausa Sensorial</Text>
          <Text className="text-text-secondary text-sm">Redução de estímulos visuais e auditivos.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center bg-space-black rounded-2xl p-5 mt-4 border border-copper-glow">
        <View className="w-12 h-12 rounded-full bg-copper-glow/20 items-center justify-center mr-4">
          <PhoneCall color="#D9772B" size={24} />
        </View>
        <View className="flex-1">
          <Text className="text-copper-glow font-bold text-lg">Contato de Emergência</Text>
          <Text className="text-text-secondary text-sm">Falar com profissional da saúde.</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
