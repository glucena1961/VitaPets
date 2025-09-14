import { Stack } from 'expo-router';

// Layout para el grupo de rutas de autenticación
export default function AuthLayout() {
  // Oculta la cabecera para todas las pantallas en este grupo
  return <Stack screenOptions={{ headerShown: false }} />;
}
