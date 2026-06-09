import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Text, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { getInsightIcon } from '../../utils/insightIcon';

const SCREEN_WIDTH = Dimensions.get('window').width;
/** Mesmo inset horizontal do ScreenWrapper (px="$4") */
const SCREEN_PADDING = 16;
const CARD_GAP = 12;
const PEEK = 52;

function getCardWidth(insightCount: number) {
  if (insightCount <= 1) return SCREEN_WIDTH - SCREEN_PADDING * 2;
  return SCREEN_WIDTH - SCREEN_PADDING - PEEK;
}

interface InsightsCarouselProps {
  insights: string[];
}

export function InsightsCarousel({ insights }: InsightsCarouselProps) {
  const cardWidth = getCardWidth(insights.length);
  const snapInterval = cardWidth + CARD_GAP;

  if (!insights.length) return null;

  return (
    <YStack style={styles.fullBleed}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {insights.map((insight, i) => {
          const Icon = getInsightIcon(insight, i);
          const isLast = i === insights.length - 1;
          return (
            <View
              key={i}
              style={[styles.card, { width: cardWidth }, isLast && styles.cardLast]}
            >
              <YStack gap="$3" p="$4">
                <Icon size={36} color={themeColors.primarySoft} weight="duotone" />
                <Text fontSize={15} fontWeight="600" color="$text" lineHeight={22}>
                  {insight}
                </Text>
              </YStack>
            </View>
          );
        })}
      </ScrollView>
    </YStack>
  );
}

const styles = StyleSheet.create({
  fullBleed: {
    marginHorizontal: -SCREEN_PADDING,
  },
  scrollContent: {
    paddingLeft: SCREEN_PADDING,
    paddingRight: SCREEN_PADDING,
  },
  card: {
    marginRight: CARD_GAP,
    borderRadius: 14,
    backgroundColor: themeColors.surface,
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
    minHeight: 140,
  },
  cardLast: {
    marginRight: 0,
  },
});
