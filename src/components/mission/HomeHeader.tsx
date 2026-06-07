import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { formatHomeDateTime } from '../../utils/greeting';

interface HomeHeaderProps {
  name: string;
  photoUrl?: string | null;
}

export function HomeHeader({ name, photoUrl }: HomeHeaderProps) {
  const [dateTime, setDateTime] = useState(() => formatHomeDateTime());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(formatHomeDateTime()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const initial = name.charAt(0).toUpperCase() || 'O';

  return (
    <XStack gap="$3" items="center">
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={{ width: 52, height: 52, borderRadius: 26 }}
        />
      ) : (
        <YStack
          width={52}
          height={52}
          rounded={999}
          bg="$primaryBg"
          borderWidth={1}
          borderColor="$glassBorder"
          items="center"
          justify="center"
        >
          <Text fontSize={20} fontWeight="700" color="$primary">
            {initial}
          </Text>
        </YStack>
      )}

      <YStack flex={1} gap="$1">
        <Text fontSize={22} fontWeight="800" color="$text">
          Olá, {name}
        </Text>
        <XStack items="center" gap="$2" flexWrap="wrap">
          <Text
            fontSize={13}
            fontWeight="800"
            style={{ color: themeColors.text, letterSpacing: 0.8 }}
          >
            {dateTime.datePart}
          </Text>
          <Text fontSize={13} fontWeight="700" style={{ color: themeColors.textMuted }}>
            |
          </Text>
          <Text
            fontSize={13}
            fontWeight="800"
            style={{ color: themeColors.primarySoft, letterSpacing: 0.8 }}
          >
            {dateTime.timePart}
          </Text>
        </XStack>
      </YStack>
    </XStack>
  );
}
