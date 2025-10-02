import { Stack, useRouter, useSegments } from 'expo-router';
import { Providers } from '../components/Providers';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../src/contexts/AuthContext';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="register" />
        <Stack.Screen name="pet-form" />
        <Stack.Screen name="pet-qr-detail" />
        <Stack.Screen name="my-diary-screen" options={{ title: 'Diario Mis Mascotas', headerShown: true }} />
        <Stack.Screen name="add-diary-entry-form" options={{ title: 'Crear Entrada', headerShown: true }} />
        <Stack.Screen name="diary-entry-detail-screen" options={{ title: 'Detalle de Entrada', headerShown: true }} />
        <Stack.Screen name="ai-consultation-screen" options={{ title: 'Consulta con la IA', headerShown: true }} />
        <Stack.Screen name="community-screen" options={{ title: 'Comunidad', headerShown: true }} />
        <Stack.Screen name="post-detail-screen" options={{ title: 'Publicación', headerShown: true }} />
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
