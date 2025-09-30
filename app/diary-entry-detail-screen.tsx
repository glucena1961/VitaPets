import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useDiary } from '@/src/contexts/DiaryContext';
import { IconSymbol } from '@/components/ui/IconSymbol';

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
        <ThemedText type="title" style={styles.title}>{entry.title}</ThemedText>
        <ThemedText style={styles.subtitle}>{t('diary_detail.date_label')}: {entry.date}</ThemedText>
        <ThemedText style={styles.subtitle}>{t('diary_detail.location_label')}: {entry.location}</ThemedText>
        <ThemedText style={styles.subtitle}>{t('diary_detail.sentiment_label')}: {entry.sentiment}</ThemedText>
        <ThemedText style={styles.content}>{entry.content}</ThemedText>
      </ScrollView>
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
