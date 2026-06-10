import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack } from 'tamagui';
import {
  ONBOARDING_HEADER_FADE_HEIGHT,
  OnboardingHeaderZone,
} from '../../components/onboarding/OnboardingHeaderZone';
import { themeColors } from '../../constants/theme';
import { AppBackground } from '../../components/ui/AppBackground';
import { OnboardingAreasScreen } from './OnboardingAreasScreen';
import { OnboardingLoopScreen } from './OnboardingLoopScreen';
import { OnboardingLyraScreen } from './OnboardingLyraScreen';
import { OnboardingSetupScreen } from './OnboardingSetupScreen';

interface OnboardingFlowScreenProps {
  onComplete: () => void;
  onClose?: () => void;
  previewMode?: boolean;
}

const PAGE_COUNT = 4;
/** Espaço entre slides ao deslizar — evita corte seco entre páginas. */
const ONBOARDING_PAGE_GAP = 16;
/** Margem horizontal do conteúdo em relação à tela. */
const ONBOARDING_PAGE_INSET = 16;

function isPagerViewAvailable() {
  if (Platform.OS === 'web') return false;
  try {
    return UIManager.getViewManagerConfig?.('RNCViewPager') != null;
  } catch {
    return false;
  }
}

type PagerModule = typeof import('react-native-pager-view');
type PagerRef = InstanceType<PagerModule['default']>;

function loadPagerView(): PagerModule['default'] | null {
  if (!isPagerViewAvailable()) return null;
  try {
    return require('react-native-pager-view').default as PagerModule['default'];
  } catch {
    return null;
  }
}

function OnboardingPage({
  children,
  pageWidth,
  isLast,
  useScrollGap,
}: {
  children: React.ReactNode;
  pageWidth?: number;
  isLast?: boolean;
  useScrollGap?: boolean;
}) {
  return (
    <View
      collapsable={false}
      style={[
        styles.page,
        pageWidth != null ? { width: pageWidth } : undefined,
        useScrollGap && !isLast ? { marginRight: ONBOARDING_PAGE_GAP } : undefined,
      ]}
    >
      <View style={styles.pageInner}>{children}</View>
    </View>
  );
}

export function OnboardingFlowScreen({
  onComplete,
  onClose,
  previewMode = false,
}: OnboardingFlowScreenProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);
  const pageWidth = containerWidth || screenWidth;
  const scrollStride = pageWidth + ONBOARDING_PAGE_GAP;
  const PagerView = useMemo(() => loadPagerView(), []);
  const pagerRef = useRef<PagerRef>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const goToPage = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(PAGE_COUNT - 1, index));
      if (PagerView) {
        pagerRef.current?.setPage(next);
      } else {
        scrollRef.current?.scrollTo({ x: next * scrollStride, animated: true });
      }
      setPage(next);
    },
    [PagerView, scrollStride],
  );

  const handleSetupComplete = useCallback(() => {
    if (previewMode && onClose) {
      onClose();
      return;
    }
    onComplete();
  }, [previewMode, onClose, onComplete]);

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / scrollStride);
      setPage(next);
    },
    [scrollStride],
  );

  // Android: PagerView empilha páginas com flex — ScrollView + snap é estável.
  const usePagerView = Boolean(PagerView && containerWidth > 0 && Platform.OS === 'ios');
  const useScrollGap = !usePagerView && containerWidth > 0;
  const resolvedPageWidth = containerWidth > 0 ? pageWidth : undefined;

  const pages = (
    <>
      <OnboardingPage pageWidth={resolvedPageWidth} useScrollGap={useScrollGap}>
        <OnboardingLoopScreen embedded onContinue={() => goToPage(1)} />
      </OnboardingPage>
      <OnboardingPage pageWidth={resolvedPageWidth} useScrollGap={useScrollGap}>
        <OnboardingAreasScreen embedded onContinue={() => goToPage(2)} />
      </OnboardingPage>
      <OnboardingPage pageWidth={resolvedPageWidth} useScrollGap={useScrollGap}>
        <OnboardingLyraScreen embedded onContinue={() => goToPage(3)} />
      </OnboardingPage>
      <OnboardingPage pageWidth={resolvedPageWidth} useScrollGap={useScrollGap} isLast>
        <OnboardingSetupScreen
          embedded
          onComplete={handleSetupComplete}
          previewMode={previewMode}
        />
      </OnboardingPage>
    </>
  );

  return (
    <AppBackground>
      <StatusBar style="light" />
      <YStack flex={1} pt={insets.top + 12}>
        <YStack px={ONBOARDING_PAGE_INSET}>
          <OnboardingHeaderZone step={page + 1} onClose={onClose} />
        </YStack>

        <View
          style={[styles.pagerHost, { marginTop: -ONBOARDING_HEADER_FADE_HEIGHT }]}
          onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
        >
          {usePagerView ? (
            <PagerView
              ref={pagerRef}
              style={styles.pager}
              initialPage={0}
              scrollEnabled
              overdrag
              pageMargin={ONBOARDING_PAGE_GAP}
              offscreenPageLimit={1}
              onPageSelected={(event) => setPage(event.nativeEvent.position)}
            >
              {pages}
            </PagerView>
          ) : containerWidth > 0 ? (
            <ScrollView
              ref={scrollRef}
              horizontal
              scrollEnabled
              nestedScrollEnabled
              directionalLockEnabled
              decelerationRate="fast"
              snapToInterval={scrollStride}
              snapToAlignment="start"
              disableIntervalMomentum
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScrollEnd}
              style={styles.pager}
              contentContainerStyle={styles.scrollContent}
            >
              {pages}
            </ScrollView>
          ) : null}
        </View>
      </YStack>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  pagerHost: {
    flex: 1,
    overflow: 'hidden',
  },
  pager: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    height: '100%',
  },
  page: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    backgroundColor: themeColors.bg,
  },
  pageInner: {
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: ONBOARDING_PAGE_INSET,
  },
});
