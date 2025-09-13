import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { I18nextProvider, useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import { lightTheme, darkTheme } from '../src/constants/theme';
import i18next from '../src/lib/i18n';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: true, 
          title: t('tabs.title'), // Título general para la sección de pestañas
          headerLeft: () => null, // Opcional: para quitar el botón de "atrás"
        }} 
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // 1. Cargar idioma guardado
        const savedLanguage = await AsyncStorage.getItem('user-language');
        if (savedLanguage) {
          await i18next.changeLanguage(savedLanguage);
        }
        // Aquí se podrían precargar otras cosas (datos de usuario, etc)
      } catch (e) {
        console.warn(e);
      } finally {
        // 3. Marcar la app como lista
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isReady]);

  if (!loaded || !isReady) {
    return null; // Muestra la splash screen nativa mientras no esté todo listo
  }

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <I18nextProvider i18n={i18next}>
      <PaperProvider theme={theme}>
        <ThemeProvider value={navigationTheme}>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </I18nextProvider>
  );
}