
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const sentiments = [
  { emoji: '🤩', label: 'Excitado' },
  { emoji: '😊', label: 'Feliz' },
  { emoji: '😢', label: 'Triste' },
  { emoji: '😠', label: 'Enojado' },
];

export default function AddDiaryEntryForm() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('Feliz');

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Título de la Entrada</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Título de la aventura de hoy"
            placeholderTextColor={styles.placeholder.color}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Fecha</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={styles.placeholder.color}
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Lugar</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Parque para perros"
            placeholderTextColor={styles.placeholder.color}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Contenido del Diario</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escribe aquí los detalles del día de tu mascota..."
            placeholderTextColor={styles.placeholder.color}
            multiline
            numberOfLines={6}
            value={content}
            onChangeText={setContent}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Sentimiento</ThemedText>
          <View style={styles.sentimentsContainer}>
            {sentiments.map(sentiment => (
              <TouchableOpacity
                key={sentiment.label}
                style={[
                  styles.sentimentButton,
                  selectedSentiment === sentiment.label && styles.sentimentButtonSelected,
                ]}
                onPress={() => setSelectedSentiment(sentiment.label)}
              >
                <Text style={styles.sentimentEmoji}>{sentiment.emoji}</Text>
                <ThemedText style={styles.sentimentLabel}>{sentiment.label}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
          <ThemedText style={styles.saveButtonText}>Guardar Entrada</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark' | null) => {
  const theme = Colors[colorScheme ?? 'light'];
  return StyleSheet.create({
    screen: { flex: 1 },
    scrollContainer: { padding: 16, paddingBottom: 100 },
    formGroup: { marginBottom: 24 },
    label: { opacity: 0.8, marginBottom: 8, fontWeight: '500' },
    input: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      height: 48,
      fontSize: 16,
      color: theme.text,
    },
    textArea: {
      height: 120,
      textAlignVertical: 'top',
      paddingTop: 12,
    },
    placeholder: { color: theme.text, opacity: 0.5 },
    sentimentsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    sentimentButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
      backgroundColor: theme.card,
      borderWidth: 2,
      borderColor: 'transparent',
      marginHorizontal: 4,
    },
    sentimentButtonSelected: {
      borderColor: theme.tint,
      backgroundColor: theme.tint + '20', // Tint with 20% opacity
    },
    sentimentEmoji: { fontSize: 32 },
    sentimentLabel: { fontSize: 12, marginTop: 4 },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderColor: theme.border,
    },
    saveButton: {
      backgroundColor: theme.tint,
      height: 48,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButtonText: {
      color: theme.background,
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
};
