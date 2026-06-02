import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CheckCircle2, Circle, Droplets, Moon, ActivitySquare } from 'lucide-react-native';

export function DailyRoutineScreen() {
  return (
    <ScrollView className="flex-1 bg-space-black" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text className="text-text-primary text-3xl font-bold mb-2">Rotina do Dia</Text>
      <Text className="text-text-secondary mb-8">Mantenha a estabilidade comportamental completando suas metas diárias.</Text>

      <View className="bg-deep-navy rounded-2xl p-5 mb-6 border border-text-secondary/10">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <Moon color="#AEB8C7" size={24} />
            <Text className="text-text-primary font-bold text-lg">Sono Mínimo</Text>
          </View>
          <CheckCircle2 color="#FF9A2E" size={24} />
        </View>
        <Text className="text-text-secondary text-sm">Registrado: 7h 20m de sono. Meta de 7h atingida.</Text>
      </View>

      <View className="bg-deep-navy rounded-2xl p-5 mb-6 border border-text-secondary/10">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <Droplets color="#AEB8C7" size={24} />
            <Text className="text-text-primary font-bold text-lg">Hidratação</Text>
          </View>
          <Text className="text-text-secondary">3/8 Copos</Text>
        </View>
        <View className="flex-row justify-between">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <View key={i} className={`w-8 h-8 rounded-full items-center justify-center ${i <= 3 ? 'bg-solar-amber/20' : 'bg-space-black border border-text-secondary/20'}`}>
              <Droplets color={i <= 3 ? '#FF9A2E' : '#AEB8C7'} size={14} />
            </View>
          ))}
        </View>
      </View>

      <Text className="text-text-primary font-bold text-xl mb-4 mt-2">Atividades Agendadas</Text>

      <TouchableOpacity className="flex-row items-center bg-deep-navy rounded-2xl p-4 mb-3 border border-text-secondary/10">
        <CheckCircle2 color="#FF9A2E" size={24} className="mr-4" />
        <View className="flex-1">
          <Text className="text-text-secondary text-xs">08:00 - Concluído</Text>
          <Text className="text-text-primary font-medium">Check-in Emocional Matinal</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center bg-deep-navy rounded-2xl p-4 mb-3 border border-copper-glow/50 shadow-sm shadow-copper-glow/10">
        <Circle color="#FF9A2E" size={24} className="mr-4" />
        <View className="flex-1">
          <Text className="text-solar-amber text-xs">14:00 - Agora</Text>
          <Text className="text-text-primary font-medium">Exercício Físico (Treino Resistivo)</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center bg-space-black rounded-2xl p-4 mb-3 border border-text-secondary/20 opacity-70">
        <Circle color="#AEB8C7" size={24} className="mr-4" />
        <View className="flex-1">
          <Text className="text-text-secondary text-xs">20:00 - Pendente</Text>
          <Text className="text-text-primary font-medium">Meditação e Respiração Guiada</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
