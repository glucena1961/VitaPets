import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { I18nextProvider } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '../hooks/useColorScheme';
import { lightTheme, darkTheme } from '../src/constants/theme';
import i18next from '../src/lib/i18n';
import NavigationTitle from '../components/NavigationTitle';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Componente de navegación principal.
function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          headerTitle: () => <NavigationTitle i18nKey="app.name" />,
          headerLeft: () => null,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// Componente que maneja la carga de recursos y el estado de la UI.
function AppContent() {
  const colorScheme = useColorScheme();
  const [isI18nReady, setI18nReady] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        const savedLanguage = await AsyncStorage.getItem('user-language');
        if (savedLanguage) {
          await i18next.changeLanguage(savedLanguage);
        }
      } catch (e) {
        console.warn('Error loading language:', e);
      } finally {
        setI18nReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isI18nReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isI18nReady]);

  if (!loaded || !isI18nReady) {
    return null; // Muestra la splash screen mientras se carga todo.
  }

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={navigationTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}

// El componente raíz que provee todos los contextos.
export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18next}>
      <AppContent />
      <Toast />
    </I18nextProvider>
  );
}