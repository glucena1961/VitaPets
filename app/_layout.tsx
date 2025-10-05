import { Stack, useRouter, useSegments } from 'expo-router';
import { Providers } from '../components/Providers';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../src/contexts/AuthContext';
import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { t, i18n } = useTranslation(); // Hook para traducciones y el objeto i18n

  useEffect(() => {
    if (isLoading) return;

    const isAuthScreen = segments.includes('login') || segments.includes('register') || segments.includes('onboarding');

    if (isAuthenticated && isAuthScreen) {
      router.replace('/(tabs)');
    } 
    else if (!isAuthenticated && !isAuthScreen) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
      <Stack key={i18n.language}>
        {/* Las pantallas que no deben mostrar header lo especifican individualmente */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />

        {/* El resto de las pantallas mostrarán el header por defecto */}
        <Stack.Screen name="pet-form" />
        <Stack.Screen name="pet-qr-detail" />
        <Stack.Screen name="my-diary-screen" options={{ title: t('diary.title') }} />
        <Stack.Screen name="add-diary-entry-form" options={{ title: t('diary.add_title') }} />
        <Stack.Screen name="diary-entry-detail-screen" options={{ title: t('diary.detail_title') }} />
        <Stack.Screen name="ai-consultation-screen" options={{ title: t('ai.title') }} />
        <Stack.Screen name="community-screen" options={{ title: t('community.title') }} />
        <Stack.Screen name="post-detail-screen" options={{ title: t('community.post_detail_title') }} />

        {/* Declaración explícita de las pantallas del historial médico */}
        <Stack.Screen name="allergy-screen" />
        <Stack.Screen name="surgery-screen" />
        <Stack.Screen name="exam-screen" />
        <Stack.Screen name="medicine-screen" />
        <Stack.Screen name="parasite-treatment-screen" />
        <Stack.Screen name="vaccine-screen" />
        <Stack.Screen name="allergy-detail-screen" />

      </Stack>
  );
}

export default function RootLayout() {
  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}