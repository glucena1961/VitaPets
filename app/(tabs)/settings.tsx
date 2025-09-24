import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define el tipo para un solo ítem de ajuste
type SettingItemProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  color?: string;
  onPress: () => void;
};

// Componente reutilizable para cada fila de ajuste
const SettingItem = ({ icon, label, color = '#20df6c', onPress }: SettingItemProps) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.itemContainer, pressed && styles.itemPressed]}>
    <MaterialIcons name={icon} size={24} color={color} />
    <Text style={[styles.itemLabel, { color: color === '#ef4444' ? '#ef4444' : '#1f2937' }]}>{label}</Text>
    <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
  </Pressable>
);

export default function SettingsScreen() {
  const router = useRouter();

  // Datos para los ítems de ajuste
  const settingsData = [
    {
      icon: 'format-size' as const,
      label: 'Tamaño de Fuente',
      onPress: () => { /* Lógica de navegación futura */ },
    },
    {
      icon: 'language' as const,
      label: 'Cambio de Idioma',
      onPress: () => { /* Lógica de navegación futura */ },
    },
    {
      icon: 'description' as const,
      label: 'Términos y Condiciones',
      onPress: () => { /* Lógica de navegación futura */ },
    },
    {
      icon: 'logout' as const,
      label: 'Cerrar Sesión',
      color: '#ef4444', // Color rojo para logout
      onPress: () => { /* Lógica de logout futura */ },
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainContent}>
        {settingsData.map((item, index) => (
          <SettingItem
            key={index}
            icon={item.icon}
            label={item.label}
            color={item.color}
            onPress={item.onPress}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// Estilos traducidos de Tailwind CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // bg-gray-50
  },
  mainContent: {
    padding: 16, // p-4
    gap: 16, // space-y-4
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff', // bg-white
    padding: 16, // p-4
    borderRadius: 8, // rounded-lg
    gap: 16, // gap-4
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2, // Sombra sutil
  },
  itemPressed: {
    backgroundColor: '#f3f4f6', // Corresponde a hover:bg-gray-100
  },
  itemLabel: {
    flex: 1,
    fontSize: 16, // text-base
    fontWeight: '500', // font-medium
  },
});