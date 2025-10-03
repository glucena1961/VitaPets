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

    // Define cuáles son las pantallas de autenticación
    const isAuthScreen = segments.includes('login') || segments.includes('register') || segments.includes('onboarding');

    // Si el usuario está autenticado pero está en una pantalla de auth, lo llevamos a la app.
    if (isAuthenticated && isAuthScreen) {
      router.replace('/(tabs)');
    } 
    // Si el usuario NO está autenticado y NO está en una pantalla de auth, lo llevamos al login.
    else if (!isAuthenticated && !isAuthScreen) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
      <Stack key={i18n.language} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="register" />
        <Stack.Screen name="pet-form" />
        <Stack.Screen name="pet-qr-detail" />
        <Stack.Screen name="my-diary-screen" options={{ title: t('diary.title'), headerShown: true }} />
        <Stack.Screen name="add-diary-entry-form" options={{ title: t('diary.add_title'), headerShown: true }} />
        <Stack.Screen name="diary-entry-detail-screen" options={{ title: t('diary.detail_title'), headerShown: true }} />
        <Stack.Screen name="ai-consultation-screen" options={{ title: t('ai.title'), headerShown: true }} />
        <Stack.Screen name="community-screen" options={{ title: t('community.title'), headerShown: true }} />
        <Stack.Screen name="post-detail-screen" options={{ title: t('community.post_detail_title'), headerShown: true }} />
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
