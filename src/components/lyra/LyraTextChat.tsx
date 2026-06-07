import React, { useEffect, useState, useRef } from 'react';
import { FlatList, Image, View } from 'react-native';
import { Text, YStack, XStack } from 'tamagui';
import { ChatMessage } from '../../hooks/useLyraTextChat';

interface LyraTextChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

function formatMessageTime(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isYesterday) {
    return `Ontem ${date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  }
  
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.isUser;
  
  return (
    <YStack mb="$3" px="$3">
      <XStack justify={isUser ? 'flex-end' : 'flex-start'} mb="$1">
        <YStack
          style={{ maxWidth: '85%' }}
          bg={isUser ? '$primary' : '$glassButton'}
          borderColor={isUser ? 'transparent' : '$glassBorder'}
          borderWidth={isUser ? 0 : 1}
          rounded="$md"
          px="$3"
          py="$2"
          borderBottomRightRadius={isUser ? '$1' : '$md'}
          borderBottomLeftRadius={isUser ? '$md' : '$1'}
        >
          {message.imageUri ? (
            <Image
              source={{ uri: message.imageUri }}
              style={{
                width: 180,
                height: 180,
                borderRadius: 10,
                marginBottom: message.text && message.text !== '📷 Foto' ? 8 : 0,
              }}
              resizeMode="cover"
            />
          ) : null}
          {message.text && message.text !== '📷 Foto' ? (
            <Text
              fontSize={14}
              color={isUser ? 'white' : '$text'}
              lineHeight={18}
            >
              {message.text}
            </Text>
          ) : null}
        </YStack>
      </XStack>
      <XStack justify={isUser ? 'flex-end' : 'flex-start'}>
        <Text
          fontSize={11}
          color="$textSubtle"
          style={{ textAlign: isUser ? 'right' : 'left' }}
          px="$1"
        >
          {formatMessageTime(message.timestamp)}
        </Text>
      </XStack>
    </YStack>
  );
}

function TypingIndicator() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <YStack mb="$3" px="$3">
      <XStack justify="flex-start" mb="$1">
        <YStack
          bg="$glassButton"
          borderColor="$glassBorder"
          borderWidth={1}
          rounded="$md"
          px="$3"
          py="$2"
          borderBottomLeftRadius="$1"
          style={{ minHeight: 38 }}
          justify="center"
        >
          <XStack items="center" gap="$1">
            <Text fontSize={14} color="$textMuted">
              Lyra está digitando
            </Text>
            <Text fontSize={14} color="$textMuted" style={{ minWidth: 20 }}>
              {dots}
            </Text>
          </XStack>
        </YStack>
      </XStack>
    </YStack>
  );
}

export function LyraTextChat({ messages, isLoading }: LyraTextChatProps) {
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll para a nova mensagem
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Auto-scroll quando está carregando (nova mensagem chegando)
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isLoading]);

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <ChatBubble message={item} />
  );

  const keyExtractor = (item: ChatMessage) => item.id;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: messages.length === 0 ? 'center' : 'flex-end',
          paddingTop: 16,
          paddingBottom: 8,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        ListEmptyComponent={() => (
          <YStack items="center" justify="center" flex={1} px="$4">
            <Text fontSize={16} color="$textMuted" style={{ textAlign: 'center' }} mb="$2">
              Converse com a Lyra por texto
            </Text>
            <Text fontSize={13} color="$textSubtle" style={{ textAlign: 'center' }} lineHeight={18}>
              Digite sua mensagem abaixo para começar uma conversa
            </Text>
          </YStack>
        )}
        ListFooterComponent={isLoading ? TypingIndicator : undefined}
      />
    </View>
  );
}