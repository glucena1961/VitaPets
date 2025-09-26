import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n, { resources } from '../src/lib/i18n';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import { FontSizeProvider } from '@/src/contexts/FontSizeContext';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';

// Prevenir que la pantalla de splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

// Componente que envuelve la lógica principal para asegurar que i18n esté listo
function AppWrapper() {
  const [isI18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    const initializeI18n = async () => {
      const storedLang = await AsyncStorage.getItem('selectedLanguage');
      const lng = storedLang || 'es';
      
      await i18n.init({
        compatibilityJSON: 'v3',
        resources,
        lng,
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
      });
      
      setI18nInitialized(true);
    };

    initializeI18n();
  }, []);

  if (!isI18nInitialized) {
    return null; // Muestra Splash Screen hasta que el idioma esté listo
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </I18nextProvider>
  );
}

export default function RootLayout() {
  return (
    <>
      <AppWrapper />
      <Toast />
    </>
  );
}

function AppContent() {
  const colorScheme = useColorScheme();
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { i18n } = useTranslation(); // Hook para re-renderizar en cambio de idioma
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();

  useEffect(() => {
    if (loaded && !isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isAuthLoading]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  if (!loaded || isAuthLoading) {
    return null;
  }

  return (
    <FontSizeProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {isAuthenticated ? (
            <Stack.Group>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="allergy-screen" options={{ title: 'Alergias' }} />
              <Stack.Screen name="add-allergy-form" options={{ title: 'Añadir Alergia' }} />
              <Stack.Screen name="allergy-detail-screen" options={{ title: 'Detalle de Alergia' }} />
              <Stack.Screen name="surgery-screen" options={{ title: 'Cirugías' }} />
              <Stack.Screen name="add-surgery-form" options={{ title: 'Añadir Cirugía' }} />
              <Stack.Screen name="exam-screen" options={{ title: 'Exámenes' }} />
              <Stack.Screen name="add-exam-form" options={{ title: 'Añadir Examen' }} />
              <Stack.Screen name="medicine-screen" options={{ title: 'Medicamentos' }} />
              <Stack.Screen name="add-medicine-form" options={{ title: 'Añadir Medicamento' }} />
              <Stack.Screen name="medicine-detail-screen" options={{ title: 'Detalle de Medicamento' }} />
              <Stack.Screen name="parasite-treatment-screen" options={{ title: 'Tratamiento Parásitos' }} />
              <Stack.Screen name="add-parasite-treatment-form" options={{ title: 'Añadir Tratamiento' }} />
              <Stack.Screen name="parasite-treatment-detail-screen" options={{ title: 'Detalle del Tratamiento' }} />
              <Stack.Screen name="terms-and-conditions" />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ title: 'Iniciar Sesión' }} />
              <Stack.Screen name="register" options={{ title: 'Registrarse' }} />
            </Stack.Group>
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </FontSizeProvider>
  );
}