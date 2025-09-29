import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useDiary } from '@/src/contexts/DiaryContext';

export default function DiaryEntryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const { diaryEntries, deleteDiaryEntry } = useDiary();

  const entry = diaryEntries.find(e => e.id === id);

  if (!entry) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">{t('diary_detail.not_found')}</ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <ThemedText style={styles.buttonText}>{t('common.back')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      t('diary_detail.delete_alert_title'),
      t('diary_detail.delete_alert_message', { title: entry.title }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDiaryEntry(entry.id);
              Alert.alert(t('common.success'), t('common.delete_success_message'));
              router.back();
            } catch (error) {
              Alert.alert(t('common.error'), t('common.delete_error_message'));
              console.error('Error deleting entry:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>{entry.title}</ThemedText>
        <ThemedText style={styles.subtitle}>{t('diary_detail.date_label')}: {entry.date}</ThemedText>
        <ThemedText style={styles.subtitle}>{t('diary_detail.location_label')}: {entry.location}</ThemedText>
        <ThemedText style={styles.subtitle}>{t('diary_detail.sentiment_label')}: {entry.sentiment}</ThemedText>
        <ThemedText style={styles.content}>{entry.content}</ThemedText>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => router.push({ pathname: '/add-diary-entry-form', params: { id: entry.id } })}
        >
          <ThemedText style={styles.buttonText}>{t('common.edit')}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <ThemedText style={styles.buttonText}>{t('common.delete')}</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark' | null) => {
  const theme = Colors[colorScheme ?? 'light'];
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100, // Space for buttons
    },
    title: {
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 5,
      opacity: 0.8,
    },
    content: {
      fontSize: 16,
      marginTop: 20,
      lineHeight: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      borderTopWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
    },
    editButton: {
      backgroundColor: theme.tint,
    },
    deleteButton: {
      backgroundColor: '#FF3B30',
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
};
