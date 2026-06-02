import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Mic, ShieldAlert, Activity } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView className="flex-1 bg-space-black" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-text-secondary text-sm">Missão Dia 42</Text>
          <Text className="text-text-primary text-2xl font-bold">Olá, Comandante</Text>
        </View>
        <TouchableOpacity 
          className="w-12 h-12 rounded-full bg-deep-navy border border-copper-glow/50 items-center justify-center"
          onPress={() => navigation.navigate('PreventionCenter')}
        >
          <ShieldAlert color="#FF9A2E" size={24} />
        </TouchableOpacity>
      </View>

      {/* Main Action - Voice Chat */}
      <TouchableOpacity 
        className="bg-deep-navy rounded-3xl p-6 mb-6 border border-solar-amber/20 items-center shadow-lg shadow-solar-amber/5"
        onPress={() => navigation.navigate('VoiceChat')}
      >
        <View className="w-20 h-20 rounded-full bg-solar-amber/10 items-center justify-center mb-4">
          <View className="w-16 h-16 rounded-full bg-solar-amber/20 items-center justify-center">
            <View className="w-12 h-12 rounded-full bg-solar-amber items-center justify-center shadow-lg shadow-solar-amber/50">
              <Mic color="#05070B" size={24} />
            </View>
          </View>
        </View>
        <Text className="text-text-primary text-xl font-bold mb-2">Vamos conversar?</Text>
        <Text className="text-text-secondary text-center">Toque para iniciar um diálogo com seu copiloto emocional.</Text>
      </TouchableOpacity>

      {/* Quick Status */}
      <View className="flex-row space-x-4 mb-6 gap-4">
        <View className="flex-1 bg-deep-navy rounded-2xl p-4 border border-text-secondary/10">
          <Text className="text-text-secondary text-xs mb-1">Status Emocional</Text>
          <Text className="text-copper-glow font-bold text-lg">Estável</Text>
        </View>
        <View className="flex-1 bg-deep-navy rounded-2xl p-4 border border-text-secondary/10">
          <Text className="text-text-secondary text-xs mb-1">Qualidade do Sono</Text>
          <Text className="text-text-primary font-bold text-lg">7h 20m</Text>
        </View>
      </View>

      {/* Next Routine */}
      <View className="bg-deep-navy rounded-2xl p-5 border border-text-secondary/10 mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-text-primary font-bold text-lg">Próxima Atividade</Text>
          <Activity color="#AEB8C7" size={20} />
        </View>
        <Text className="text-solar-amber font-bold mb-1">14:00 - Exercício Físico</Text>
        <Text className="text-text-secondary text-sm">Treino resistivo de 45 minutos para manutenção muscular.</Text>
      </View>
    </ScrollView>
  );
}
