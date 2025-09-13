import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import NavigationTitle from '@/components/NavigationTitle'; // Importamos el nuevo componente

// Un componente simple para el icono de la pestaña
function TabBarIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} name={name} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="index" // Asumiendo que index.tsx es la pantalla "Principal"
        options={{
          title: 'Principal',
          headerTitle: () => <NavigationTitle i18nKey="tabs.home" />,
          tabBarLabel: ({ color }) => <NavigationTitle i18nKey="tabs.home" style={{ color }} />,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Mis Mascotas',
          headerTitle: () => <NavigationTitle i18nKey="tabs.pets" />,
          tabBarLabel: ({ color }) => <NavigationTitle i18nKey="tabs.pets" style={{ color }} />,
          tabBarIcon: ({ color }) => <TabBarIcon name="paw" color={color} />,
        }}
      />
      <Tabs.Screen
        name="medical"
        options={{
          title: 'Expediente',
          headerTitle: () => <NavigationTitle i18nKey="tabs.medical" />,
          tabBarLabel: ({ color }) => <NavigationTitle i18nKey="tabs.medical" style={{ color }} />,
          tabBarIcon: ({ color }) => <TabBarIcon name="medkit" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          headerTitle: () => <NavigationTitle i18nKey="tabs.settings" />,
          tabBarLabel: ({ color }) => <NavigationTitle i18nKey="tabs.settings" style={{ color }} />,
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}