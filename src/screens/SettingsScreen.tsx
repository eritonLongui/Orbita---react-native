import React from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';

export function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-space-black" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text className="text-text-primary text-3xl font-bold mb-8">Configurações</Text>

      <Text className="text-text-secondary font-bold text-sm mb-4 uppercase tracking-wider">Preferências da IA</Text>
      
      <View className="bg-deep-navy rounded-2xl p-5 mb-8 border border-text-secondary/10">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-text-primary font-bold text-lg">Voz da Assistente</Text>
            <Text className="text-text-secondary text-sm">Calma e Clínica</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-text-primary font-bold text-lg">Proatividade</Text>
            <Text className="text-text-secondary text-sm mt-1 max-w-[80%]">A IA iniciará conversas se notar sinais de estresse.</Text>
          </View>
          <Switch 
            value={true} 
            trackColor={{ false: "#05070B", true: "#FF9A2E" }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <Text className="text-text-secondary font-bold text-sm mb-4 uppercase tracking-wider">Sensores e Dados</Text>

      <View className="bg-deep-navy rounded-2xl p-5 border border-text-secondary/10">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-text-primary font-bold text-lg">Monitoramento de Sono</Text>
            <Text className="text-text-secondary text-sm">Integrado ao smartwatch</Text>
          </View>
          <Switch 
            value={true} 
            trackColor={{ false: "#05070B", true: "#FF9A2E" }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-text-primary font-bold text-lg">Modo Anônimo</Text>
            <Text className="text-text-secondary text-sm mt-1 max-w-[80%]">Oculta dados sensíveis dos relatórios gerais.</Text>
          </View>
          <Switch 
            value={false} 
            trackColor={{ false: "#05070B", true: "#FF9A2E" }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
      
    </ScrollView>
  );
}
