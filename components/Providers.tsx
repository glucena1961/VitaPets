import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import i18n from '@/src/lib/i18n';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { FontSizeProvider } from '@/src/contexts/FontSizeContext';
import { DiaryProvider } from '@/src/contexts/DiaryContext';
import { AIConversationProvider } from '@/src/contexts/AIConversationContext';

// Este componente maneja la lógica del Splash Screen, ocultándolo solo cuando las fuentes y la autenticación han cargado.
function SplashController({ children }: { children: React.ReactNode }) {
  const { isLoading: isAuthLoading } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded && !isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isAuthLoading]);

  if (!fontsLoaded || isAuthLoading) {
    return null; // No renderiza nada hasta que todo esté listo
  }

  return <>{children}</>;
}

// El componente Providers ahora anida correctamente cada proveedor para asegurar la estabilidad del estado.
export function Providers({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <FontSizeProvider>
            <DiaryProvider>
              <AIConversationProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  <SplashController>
                    {children}
                  </SplashController>
                  <Toast />
                </ThemeProvider>
              </AIConversationProvider>
            </DiaryProvider>
          </FontSizeProvider>
        </AuthProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}