import { ChatText, Microphone } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

export type LyraMode = 'voice' | 'text';

interface LyraModeTabsProps {
  mode: LyraMode;
  onModeChange: (mode: LyraMode) => void;
}

const MODES: { key: LyraMode; label: string; Icon: typeof Microphone }[] = [
  { key: 'voice', label: 'Voz', Icon: Microphone },
  { key: 'text', label: 'Texto', Icon: ChatText },
];

export function LyraModeTabs({ mode, onModeChange }: LyraModeTabsProps) {
  return (
    <View style={styles.container}>
      <XStack gap="$1" p="$1">
        {MODES.map(({ key, label, Icon }) => {
          const selected = mode === key;
          return (
            <YStack
              key={key}
              flex={1}
              py="$2.5"
              rounded={999}
              bg={selected ? '$primaryBg' : 'transparent'}
              borderWidth={selected ? 1 : 0}
              borderColor={selected ? '$primary' : 'transparent'}
              items="center"
              justify="center"
              pressStyle={{ opacity: 0.85 }}
              onPress={() => onModeChange(key)}
            >
              <XStack items="center" gap="$2">
                <Icon
                  size={18}
                  color={selected ? themeColors.primarySoft : themeColors.textMuted}
                  weight={selected ? 'fill' : 'regular'}
                />
                <Text
                  fontSize={14}
                  fontWeight="700"
                  style={{ color: selected ? themeColors.primarySoft : themeColors.textMuted }}
                >
                  {label}
                </Text>
              </XStack>
            </YStack>
          );
        })}
      </XStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
    backgroundColor: themeColors.glass,
    overflow: 'hidden',
  },
});
