import React from 'react';
import { XStack, YStack } from 'tamagui';

function chunkItems<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

interface TwoColumnGridProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  gap?: number;
}

export function TwoColumnGrid<T>({
  items,
  keyExtractor,
  renderItem,
  gap = 12,
}: TwoColumnGridProps<T>) {
  const rows = chunkItems(items, 2);

  return (
    <YStack gap={gap} width="100%">
      {rows.map((row, rowIndex) => (
        <XStack key={`row-${rowIndex}`} gap={gap} width="100%">
          {row.map((item) => (
            <YStack key={keyExtractor(item)} flex={1} minW={0}>
              {renderItem(item)}
            </YStack>
          ))}
          {row.length === 1 ? <YStack flex={1} minW={0} /> : null}
        </XStack>
      ))}
    </YStack>
  );
}
