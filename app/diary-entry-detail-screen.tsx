import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Text } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useDiary } from '@/src/contexts/DiaryContext';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Replicated from the form screen for consistency
const sentiments = [
  { emoji: '🤩', labelKey: 'diary_form.sentiment_excited' },
  { emoji: '😊', labelKey: 'diary_form.sentiment_happy' },
  { emoji: '😢', labelKey: 'diary_form.sentiment_sad' },
  { emoji: '😠', labelKey: 'diary_form.sentiment_angry' },
];

export default function DiaryEntryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colorScheme);
  const { diaryEntries, deleteDiaryEntry } = useDiary();

  const entry = diaryEntries.find(e => e.id === id);

  // Find the sentiment object that matches the entry's sentiment text
  const sentiment = sentiments.find(s => t(s.labelKey) === entry?.sentiment);

  const handleDelete = () => {
    if (!entry) return;
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

  const handleEdit = () => {
    if (!entry) return;
    router.push({ pathname: '/add-diary-entry-form', params: { id: entry.id } });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
            <IconSymbol name="edit" size={24} color={theme.tint} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
            <IconSymbol name="delete" size={24} color={theme.red} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, entry, colorScheme]);

  if (!entry) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">{t('diary_detail.not_found')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <ThemedText type="title" style={styles.title}>{entry.title}</ThemedText>
          
          <View style={styles.infoRow}>
            <IconSymbol name="calendar" size={16} color={theme.icon} style={styles.infoIcon} />
            <ThemedText style={styles.infoText}>{entry.date}</ThemedText>
          </View>

          {entry.location && (
            <View style={styles.infoRow}>
              <IconSymbol name="location" size={16} color={theme.icon} style={styles.infoIcon} />
              <ThemedText style={styles.infoText}>{entry.location}</ThemedText>
            </View>
          )}

          <View style={styles.separator} />

          <ThemedText style={styles.content}>{entry.content}</ThemedText>

          {sentiment && (
            <View style={styles.sentimentContainer}>
              <Text style={styles.sentimentEmoji}>{sentiment.emoji}</Text>
              <ThemedText style={styles.sentimentLabel}>{t(sentiment.labelKey)}</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark' | null) => {
  const theme = Colors[colorScheme ?? 'light'];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 16,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      marginBottom: 16,
      textAlign: 'center',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoIcon: {
      marginRight: 8,
    },
    infoText: {
      fontSize: 16,
      opacity: 0.8,
    },
    separator: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 16,
    },
    content: {
      fontSize: 17,
      lineHeight: 25,
      textAlign: 'justify',
    },
    sentimentContainer: {
      marginTop: 24,
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.tint + '15', // Tint with low opacity
      borderRadius: 10,
    },
    sentimentEmoji: {
      fontSize: 48,
    },
    sentimentLabel: {
      marginTop: 8,
      fontSize: 16,
      fontWeight: 'bold',
      textTransform: 'capitalize',
    },
    headerRightContainer: {
      flexDirection: 'row',
      gap: 20,
      marginRight: 15,
    },
    headerButton: {
      padding: 5,
    },
  });
};
