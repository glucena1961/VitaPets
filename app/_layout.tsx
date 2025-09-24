import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/lib/i18n';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/useColorScheme';
import { FontSizeProvider } from '@/src/contexts/FontSizeContext'; // Importar FontSizeProvider

// Prevenir que la pantalla de splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
      <Toast />
    </I18nextProvider>
  );
}

function AppContent() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <FontSizeProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* Configuración de títulos según instrucción directa */}
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

          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </FontSizeProvider>
  );
}