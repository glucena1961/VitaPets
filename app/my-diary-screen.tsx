
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// Mock data for diary entries
const diaryEntries = [
  {
    id: '1',
    title: 'Visita al veterinario',
    date: '2024-01-15',
    location: 'Clínica Veterinaria Central',
  },
  {
    id: '2',
    title: 'Paseo en el parque',
    date: '2024-01-10',
    location: 'Parque de las Mascotas',
  },
  {
    id: '3',
    title: 'Baño en casa',
    date: '2024-01-05',
    location: 'Casa',
  },
];

export default function MyDiaryScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const styles = createStyles(colorScheme);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.mainContent}>
        {diaryEntries.map(entry => (
          <View key={entry.id} style={styles.card}>
            <ThemedText type="subtitle">{entry.title}</ThemedText>
            <ThemedText style={styles.cardSubtitle}>
              {entry.date} - {entry.location}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.createButton} onPress={() => router.push('/add-diary-entry-form')}>
          <ThemedText style={styles.createButtonText}>Crear Entrada</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark' | null) => {
  const theme = Colors[colorScheme ?? 'light'];
  return StyleSheet.create({
    screen: {
      flex: 1,
    },
    mainContent: {
      padding: 16,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      // Shadow for iOS
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
      // Elevation for Android
      elevation: 1,
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
      marginTop: 4,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },
    createButton: {
      height: 48,
      backgroundColor: theme.tint,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    createButtonText: {
        color: theme.background, // Assuming tint is a solid color, text on it should be contrasting
        fontWeight: 'bold',
        fontSize: 16,
    },
  });
};
