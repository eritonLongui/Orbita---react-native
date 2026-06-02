import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TrendingUp, AlertCircle } from 'lucide-react-native';

export function EmotionalInsightsScreen() {
  return (
    <ScrollView className="flex-1 bg-space-black" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text className="text-text-primary text-3xl font-bold mb-2">Insights</Text>
      <Text className="text-text-secondary mb-8">Compreenda seus padrões emocionais ao longo da missão.</Text>

      <View className="bg-solar-amber/10 rounded-2xl p-5 mb-8 border border-solar-amber/30 flex-row gap-4 items-start">
        <View className="w-10 h-10 rounded-full bg-solar-amber/20 items-center justify-center mt-1">
          <TrendingUp color="#FF9A2E" size={20} />
        </View>
        <View className="flex-1">
          <Text className="text-text-primary font-bold text-lg mb-1">Tendência Positiva</Text>
          <Text className="text-text-secondary leading-5">Nas últimas duas semanas, seus níveis de energia aumentaram em dias com mais de 7 horas de sono contínuo. Continue assim!</Text>
        </View>
      </View>

      <Text className="text-text-primary font-bold text-xl mb-4">Humor da Semana</Text>
      <View className="bg-deep-navy rounded-2xl p-6 mb-8 border border-text-secondary/10">
        {/* Placeholder for Chart */}
        <View className="h-40 flex-row items-end justify-between px-2">
          {[40, 60, 50, 80, 70, 90, 85].map((height, i) => (
            <View key={i} className="items-center gap-2">
              <View className="w-8 bg-copper-glow rounded-t-sm" style={{ height: `${height}%` }} />
              <Text className="text-text-secondary text-xs">{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text className="text-text-primary font-bold text-xl mb-4">Correlações</Text>
      <View className="flex-row gap-4 mb-4">
        <View className="flex-1 bg-deep-navy p-4 rounded-xl border border-text-secondary/10 items-center">
          <Text className="text-text-secondary text-xs mb-2">Exercício + Humor</Text>
          <Text className="text-solar-amber font-bold text-2xl">+45%</Text>
        </View>
        <View className="flex-1 bg-deep-navy p-4 rounded-xl border border-text-secondary/10 items-center">
          <Text className="text-text-secondary text-xs mb-2">Estresse + Foco</Text>
          <Text className="text-copper-glow font-bold text-2xl">-12%</Text>
        </View>
      </View>
      
    </ScrollView>
  );
}
