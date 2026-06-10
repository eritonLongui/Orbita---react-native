import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

/** Esconde a tab bar enquanto a tela modal (ex.: preview de onboarding) está em foco. */
export function useHideTabBarWhileFocused() {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const tabNav = navigation.getParent()?.getParent();
      if (!tabNav) return;

      tabNav.setOptions({ tabBarStyle: { display: 'none' } });
      return () => {
        tabNav.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation]),
  );
}
