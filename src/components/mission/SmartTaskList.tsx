import { Check } from 'phosphor-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Text, XStack, YStack } from 'tamagui';
import { ORBIT_AREAS } from '../../constants/orbitAreas';
import { DailyTask } from '../../types';
import { OrbitaCard } from '../ui/OrbitaCard';
import { SectionTitle } from '../ui/SectionTitle';

interface SmartTaskListProps {
  tasks: DailyTask[];
  checkInDone: boolean;
  onPressCheckIn: () => void;
  onToggleTask: (taskId: string) => void;
}

function AnimatedCheckIcon({ done }: { done: boolean }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (done) {
      scale.value = withSequence(
        withTiming(1.35, { duration: 150, easing: Easing.out(Easing.back(3)) }),
        withTiming(1, { duration: 200, easing: Easing.inOut(Easing.quad) }),
      );
    }
  }, [done, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (done) {
    return (
      <Animated.View
        style={[
          {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#34D399',
            alignItems: 'center',
            justifyContent: 'center',
          },
          animStyle,
        ]}
      >
        <Check size={14} color="#fff" weight="bold" />
      </Animated.View>
    );
  }

  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#6B7280',
      }}
    />
  );
}

function areaLabel(area: DailyTask['area']): string {
  return ORBIT_AREAS.find((a) => a.type === area)?.label ?? area;
}

export function SmartTaskList({
  tasks,
  checkInDone,
  onPressCheckIn,
  onToggleTask,
}: SmartTaskListProps) {
  return (
    <YStack gap="$3">
      <SectionTitle>Lista de tarefas</SectionTitle>

      {!checkInDone ? (
        <Pressable onPress={onPressCheckIn} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
          <OrbitaCard>
            <XStack gap="$3" items="center" width="100%">
              <AnimatedCheckIcon done={false} />
              <YStack flex={1} gap="$2">
                <Text fontSize={15} fontWeight="600" color="$text">
                  Fazer check-in de hoje
                </Text>
                <Text fontSize={13} color="$textMuted" lineHeight={18}>
                  Alguns minutos para atualizar sua órbita e receber tarefas do dia.
                </Text>
              </YStack>
            </XStack>
          </OrbitaCard>
        </Pressable>
      ) : tasks.length === 0 ? (
        <OrbitaCard>
          <Text fontSize={14} color="$textMuted" lineHeight={20}>
            Check-in feito! Suas tarefas personalizadas aparecerão aqui em instantes.
          </Text>
        </OrbitaCard>
      ) : (
        tasks.map((task) => (
          <Pressable
            key={task.id}
            onPress={() => onToggleTask(task.id)}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <OrbitaCard>
              <XStack gap="$3" items="center" width="100%">
                <AnimatedCheckIcon done={task.done} />
                <YStack flex={1} gap="$2">
                  <Text
                    fontSize={11}
                    fontWeight="700"
                    color="$textMuted"
                    letterSpacing={0.8}
                    textTransform="uppercase"
                  >
                    {areaLabel(task.area)}
                  </Text>
                  <Text
                    fontSize={15}
                    fontWeight="600"
                    color="$text"
                    lineHeight={21}
                    style={task.done ? { textDecorationLine: 'line-through', opacity: 0.6 } : undefined}
                  >
                    {task.title}
                  </Text>
                </YStack>
              </XStack>
            </OrbitaCard>
          </Pressable>
        ))
      )}
    </YStack>
  );
}
