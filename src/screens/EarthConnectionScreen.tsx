import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Mail, Image as ImageIcon } from 'lucide-react-native';

export function EarthConnectionScreen() {
  return (
    <ScrollView className="flex-1 bg-space-black" contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text className="text-text-primary text-3xl font-bold mb-2">Conexão com a Terra</Text>
      <Text className="text-text-secondary mb-8">Mensagens e lembranças de casa para reduzir a sensação de isolamento.</Text>

      <Text className="text-text-primary font-bold text-xl mb-4">Mensagens Recentes</Text>
      
      <View className="bg-deep-navy rounded-2xl p-5 mb-4 border border-text-secondary/10">
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-10 h-10 rounded-full bg-copper-glow/20 items-center justify-center">
            <Text className="text-copper-glow font-bold">F</Text>
          </View>
          <View>
            <Text className="text-text-primary font-bold">Família</Text>
            <Text className="text-text-secondary text-xs">Ontem, 18:30 (Horário da Terra)</Text>
          </View>
        </View>
        <Text className="text-text-secondary leading-5">
          "Oi! Estamos todos bem por aqui. O cachorro sente sua falta. Continue focado e saiba que estamos torcendo por você!"
        </Text>
      </View>

      <View className="bg-deep-navy rounded-2xl p-5 mb-8 border border-text-secondary/10">
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-10 h-10 rounded-full bg-solar-amber/20 items-center justify-center">
            <Text className="text-solar-amber font-bold">C</Text>
          </View>
          <View>
            <Text className="text-text-primary font-bold">Controle da Missão</Text>
            <Text className="text-text-secondary text-xs">Hoje, 08:00</Text>
          </View>
        </View>
        <Text className="text-text-secondary leading-5">
          "Parabéns pelo progresso na última fase. Seu relatório foi recebido com sucesso. Lembre-se de descansar."
        </Text>
      </View>

      <Text className="text-text-primary font-bold text-xl mb-4">Lembranças</Text>
      
      <View className="flex-row flex-wrap gap-4">
        <View className="w-[47%] h-32 bg-deep-navy rounded-2xl border border-text-secondary/10 items-center justify-center">
          <ImageIcon color="#AEB8C7" size={32} />
          <Text className="text-text-secondary text-xs mt-2">Formatura.jpg</Text>
        </View>
        <View className="w-[47%] h-32 bg-deep-navy rounded-2xl border border-text-secondary/10 items-center justify-center">
          <ImageIcon color="#AEB8C7" size={32} />
          <Text className="text-text-secondary text-xs mt-2">Viagem_Praia.jpg</Text>
        </View>
      </View>
      
    </ScrollView>
  );
}
