
import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import i18n, { resources } from '@/src/lib/i18n';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { FontSizeProvider } from '@/src/contexts/FontSizeContext';

// Este componente interno maneja la lógica de carga y el splash screen
function SplashController({ children }: { children: React.ReactNode }) {
  const { isLoading: isAuthLoading } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [i18nInitialized, setI18nInitialized] = useState(false);

  // Efecto para inicializar i18n
  useEffect(() => {
    async function prepareI18n() {
      try {
        const storedLang = await AsyncStorage.getItem('selectedLanguage');
        const lng = storedLang || 'es';
        await i18n.init({
          compatibilityJSON: 'v3',
          resources,
          lng,
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
        });
      } catch (e) {
        console.warn('Error initializing i18n:', e);
      } finally {
        setI18nInitialized(true);
      }
    }
    prepareI18n();
  }, []);

  // Efecto para manejar errores de fuentes
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Efecto para ocultar el Splash Screen
  useEffect(() => {
    if (fontsLoaded && i18nInitialized && !isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, i18nInitialized, isAuthLoading]);

  // Mientras algo carga, no se renderiza nada, mostrando el splash screen nativo
  if (!fontsLoaded || !i18nInitialized || isAuthLoading) {
    return null;
  }

  // Cuando todo está listo, renderiza los hijos (la app)
  return <>{children}</>;
}

// El componente que exportamos, con todos los proveedores
export function Providers({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <FontSizeProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <SplashController>{children}</SplashController>
            <Toast />
          </ThemeProvider>
        </FontSizeProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}
