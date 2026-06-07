import { Info } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface InfoTooltipProps {
  text: string;
  align?: 'left' | 'right';
}

export function InfoTooltip({ text, align = 'left' }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Mais informações"
      >
        <Info size={16} color={themeColors.textMuted} />
      </Pressable>
      {open ? (
        <View style={[styles.bubble, align === 'right' ? styles.bubbleRight : styles.bubbleLeft]}>
          <Text fontSize={12} color="$textMuted" lineHeight={17}>
            {text}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    top: 24,
    zIndex: 10,
    width: 220,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(20, 22, 30, 0.96)',
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
  },
  bubbleLeft: {
    left: -8,
  },
  bubbleRight: {
    right: -8,
  },
});
