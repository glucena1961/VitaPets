import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { I18nextProvider } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/useColorScheme';
import { lightTheme, darkTheme } from '../src/constants/theme';
import i18next from '../src/lib/i18n';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import NavigationTitle from '@/components/NavigationTitle';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Componente de navegación con lógica de redirección (Guardián de rutas)
function RootLayoutNav() {
  const { session, loading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return; // No hacer nada mientras se carga la sesión

    const inAuthGroup = segments[0] === '(auth)';

    // Si no hay sesión y no estamos en el grupo auth, redirigir a login.
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
    // Si hay sesión y estamos en el grupo auth, redirigir a la app principal.
    else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, authLoading, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          headerTitle: () => <NavigationTitle i18nKey="app.name" />,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// Componente que maneja la carga de todos los recursos antes de mostrar la UI
function AppContent() {
  const colorScheme = useColorScheme();
  const [isI18nReady, setI18nReady] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { loading: authLoading } = useAuth(); // Esperar también la carga de la sesión

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

  // Ocultar Splash Screen solo cuando fuentes, i18n y sesión de auth estén listos
  useEffect(() => {
    if (loaded && isI18nReady && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isI18nReady, authLoading]);

  // Mientras algo se esté cargando, la Splash Screen sigue visible
  if (!loaded || !isI18nReady || authLoading) {
    return null;
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

// Componente Raíz que provee todos los contextos a la aplicación
export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18next}>
      <AuthProvider>
        <AppContent />
        <Toast />
      </AuthProvider>
    </I18nextProvider>
  );
}