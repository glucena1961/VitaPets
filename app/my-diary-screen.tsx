
import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useDiary } from '@/src/contexts/DiaryContext';

export default function MyDiaryScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const styles = createStyles(colorScheme);
  const { diaryEntries, isLoading } = useDiary();

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText>{t('common.loading')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.mainContent}>
        {diaryEntries.length === 0 ? (
          <ThemedText style={styles.noEntriesText}>{t('diary.no_entries')}</ThemedText>
        ) : (
          diaryEntries.map(entry => (
            <TouchableOpacity key={entry.id} style={styles.card} onPress={() => router.push({ pathname: '/diary-entry-detail-screen', params: { id: entry.id } })}>
              <ThemedText type="subtitle">{entry.title}</ThemedText>
              <ThemedText style={styles.cardSubtitle}>
                {entry.date} - {entry.location}
              </ThemedText>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.createButton} onPress={() => router.push('/add-diary-entry-form')}>
          <ThemedText style={styles.createButtonText}>{t('diary.create_entry')}</ThemedText>
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainContent: {
      padding: 16,
      flexGrow: 1,
    },
    noEntriesText: {
      textAlign: 'center',
      marginTop: 50,
      opacity: 0.7,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
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
        color: theme.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
  });
};
