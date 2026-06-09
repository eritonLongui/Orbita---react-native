import { StatusBar } from "expo-status-bar";
import { MotiView } from "moti";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { YStack } from "tamagui";

import { AppBackground } from "../../components/ui/AppBackground";
import { OrbitaLogo } from "../../components/ui/OrbitaLogo";

interface SplashScreenProps {
  onFinish: () => void;
}

/**
 * Componente que cria a sensação abstrata de gravidade e navegação.
 * Expande e dissipa anéis concêntricos suavemente.
 */
function OrbitalPulse({ delay, size }: { delay: number; size: number }) {
  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.4,
      }}
      animate={{
        opacity: [0, 0.08, 0], // Aparece sutilmente no meio da expansão e some
        scale: 1.8,
      }}
      transition={{
        type: "timing",
        duration: 6000,
        easing: Easing.out(Easing.cubic),
        delay,
        loop: true,
      }}
      style={[
        styles.orbitalRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Aumentamos ligeiramente o tempo para permitir que a coreografia de entrada
    // e o primeiro ciclo de respiração do Zero-G sejam apreciados pelo usuário.
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AppBackground>
      <StatusBar style="light" />

      <YStack
        flex={1}
        justify="center"
        items="center"
        pt={insets.top}
        pb={insets.bottom}
      >
        {/* Sistema Orbital de Fundo */}
        <OrbitalPulse delay={0} size={280} />
        <OrbitalPulse delay={2000} size={280} />
        <OrbitalPulse delay={4000} size={280} />

        {/* Contêiner do Logo com entrada física premium */}
        <MotiView
          from={{
            opacity: 0,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 90,
            mass: 1.2,
          }}
        >
          {/* Efeito Zero-G Contínuo */}
          <MotiView
            from={{
              translateY: -5,
            }}
            animate={{
              translateY: 5,
            }}
            transition={{
              type: "timing",
              duration: 4000, // Ciclo muito mais longo para parecer massa, não mola
              easing: Easing.inOut(Easing.sin),
              loop: true,
              repeatReverse: true,
            }}
          >
            <OrbitaLogo size={120} />
          </MotiView>
        </MotiView>
      </YStack>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  orbitalRing: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#4B8BFF",
    backgroundColor: "transparent",
  },
});
