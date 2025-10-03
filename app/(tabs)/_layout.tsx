import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import NavigationTitle from '@/components/NavigationTitle'; // Importamos el nuevo componente

// Un componente simple para el icono de la pestaña
function TabBarIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} name={name} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="index" // Asumiendo que index.tsx es la pantalla "Principal"
        options={{
          title: t('tabs.home'),
          tabBarLabel: ({ color }) => <NavigationTitle i18nKey="tabs.home" style={{ color, fontSize: 12 }} />,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: t('tabs.pets'),
          tabBarLabel: ({ color }) => <NavigationTitle i18nKey="tabs.pets" style={{ color, fontSize: 12 }} />,
          tabBarIcon: ({ color }) => <TabBarIcon name="paw" color={color} />,
        }}
      />
      <Tabs.Screen
        name="medical"
        options={{
          title: t('tabs.medical'),
          tabBarLabel: ({ color }) => <NavigationTitle i18nKey="tabs.medical" style={{ color, fontSize: 12 }} />,
          tabBarIcon: ({ color }) => <TabBarIcon name="medkit" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarLabel: ({ color }) => <NavigationTitle i18nKey="tabs.settings" style={{ color, fontSize: 12 }} />,
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}