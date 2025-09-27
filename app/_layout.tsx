import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { I18nextProvider } from 'react-i18next';
import i18n, { resources } from '../src/lib/i18n';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import { FontSizeProvider } from '@/src/contexts/FontSizeContext';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import NavigationTitle from '@/components/NavigationTitle';

// Prevenir que la pantalla de splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    async function prepare() {
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
    prepare();
  }, []);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded && i18nInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, i18nInitialized]);

  if (!fontsLoaded || !i18nInitialized) {
    return null; // Muestra la pantalla de splash mientras se cargan fuentes e i18n
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <FontSizeProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <MainLayout />
          </ThemeProvider>
        </FontSizeProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

function MainLayout() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;

    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  }, [isAuthLoading, isAuthenticated]);

  if (isAuthLoading) {
    return null;
  }

  return (
    <>
      <Stack>
        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="allergy-screen" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.allergies'} /> }} />
            <Stack.Screen name="add-allergy-form" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.add_allergy'} /> }} />
            <Stack.Screen name="allergy-detail-screen" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.allergy_detail'} /> }} />
            <Stack.Screen name="surgery-screen" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.surgeries'} /> }} />
            <Stack.Screen name="add-surgery-form" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.add_surgery'} /> }} />
            <Stack.Screen name="exam-screen" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.exams'} /> }} />
            <Stack.Screen name="add-exam-form" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.add_exam'} /> }} />
            <Stack.Screen name="medicine-screen" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.medicines'} /> }} />
            <Stack.Screen name="add-medicine-form" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.add_medicine'} /> }} />
            <Stack.Screen name="medicine-detail-screen" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.medicine_detail'} /> }} />
            <Stack.Screen name="parasite-treatment-screen" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.parasite_treatments'} /> }} />
            <Stack.Screen name="add-parasite-treatment-form" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.add_parasite_treatment'} /> }} />
            <Stack.Screen name="parasite-treatment-detail-screen" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.parasite_treatment_detail'} /> }} />
            <Stack.Screen name="terms-and-conditions" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.terms'} /> }} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.login'} /> }} />
            <Stack.Screen name="register" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.register'} /> }} />
            <Stack.Screen name="forgot-password" options={{ headerTitle: () => <NavigationTitle i18nKey={'screen_titles.forgot_password'} /> }} />
          </Stack.Group>
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </>
  );
}
