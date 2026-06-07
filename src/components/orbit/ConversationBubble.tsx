import React from 'react';
import { Text, YStack } from 'tamagui';

interface ConversationBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ConversationBubble({ role, content }: ConversationBubbleProps) {
  const isUser = role === 'user';

  return (
    <YStack
      self={isUser ? 'flex-end' : 'flex-start'}
      maxW="85%"
      bg={isUser ? '$primaryBg' : '$glass'}
      borderWidth={1}
      borderColor={isUser ? '$primary' : '$glassBorder'}
      rounded="$lg"
      p="$3"
      gap="$1"
    >
      <Text fontSize={12} fontWeight="700" color={isUser ? '$primary' : '$textMuted'}>
        {isUser ? 'Você' : 'Lyra'}
      </Text>
      <Text fontSize={15} color="$text" lineHeight={22}>
        {content}
      </Text>
    </YStack>
  );
}
