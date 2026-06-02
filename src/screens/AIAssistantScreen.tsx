import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, Mic } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

export function AIAssistantScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [message, setMessage] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-space-black"
    >
      <View className="pt-14 pb-4 px-6 bg-deep-navy border-b border-text-secondary/10 flex-row justify-between items-center">
        <Text className="text-text-primary text-xl font-bold">Assistente IA</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VoiceChat')}>
          <Mic color="#FF9A2E" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="mb-6">
          <View className="bg-deep-navy p-4 rounded-2xl rounded-tl-sm self-start max-w-[85%] border border-copper-glow/20 shadow-sm shadow-copper-glow/5">
            <Text className="text-text-primary">Olá! Como você está se sentindo neste ciclo?</Text>
            <Text className="text-text-secondary text-xs mt-2 text-right">10:42</Text>
          </View>
        </View>

        <View className="mb-6">
          <View className="bg-solar-amber/90 p-4 rounded-2xl rounded-tr-sm self-end max-w-[85%]">
            <Text className="text-space-black font-medium">Estou um pouco cansado hoje. O sono não foi muito bom.</Text>
            <Text className="text-space-black/70 text-xs mt-2 text-right">10:45</Text>
          </View>
        </View>

        <View className="mb-6">
          <View className="bg-deep-navy p-4 rounded-2xl rounded-tl-sm self-start max-w-[85%] border border-copper-glow/20">
            <Text className="text-text-primary">Entendo. A privação de sono pode afetar bastante o humor. Gostaria de iniciar um exercício de respiração rápida para ajudar a recarregar as energias, ou prefere apenas conversar?</Text>
            <Text className="text-text-secondary text-xs mt-2 text-right">10:45</Text>
          </View>
        </View>
      </ScrollView>

      <View className="px-4 py-4 bg-deep-navy border-t border-text-secondary/10 flex-row items-center gap-3">
        <TextInput 
          className="flex-1 bg-space-black text-text-primary px-4 py-3 rounded-full border border-text-secondary/20"
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#AEB8C7"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity className="w-12 h-12 bg-solar-amber rounded-full items-center justify-center">
          <Send color="#05070B" size={20} className="ml-1" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
