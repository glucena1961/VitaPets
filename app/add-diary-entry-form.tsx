
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Text, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useDiary } from '@/src/contexts/DiaryContext';

const sentiments = [
  { emoji: '🤩', labelKey: 'diary_form.sentiment_excited' },
  { emoji: '😊', labelKey: 'diary_form.sentiment_happy' },
  { emoji: '😢', labelKey: 'diary_form.sentiment_sad' },
  { emoji: '😠', labelKey: 'diary_form.sentiment_angry' },
];

export default function AddDiaryEntryForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const { addDiaryEntry, diaryEntries, updateDiaryEntry } = useDiary();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date()); // --- MODIFIED: Use Date object
  const [showDatePicker, setShowDatePicker] = useState(false); // --- ADDED: State for picker visibility
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState(sentiments[1].labelKey); // Default to Happy

  useEffect(() => {
    if (isEditing && id) {
      const entryToEdit = diaryEntries.find(entry => entry.id === id);
      if (entryToEdit) {
        setTitle(entryToEdit.title);
        // --- MODIFIED: Parse string date from DB to Date object
        // Se añade T00:00:00 para evitar problemas de zona horaria al parsear.
        setDate(new Date(entryToEdit.date + 'T00:00:00'));
        setLocation(entryToEdit.location);
        setContent(entryToEdit.content);
        const sentimentKey = sentiments.find(s => t(s.labelKey) === entryToEdit.sentiment)?.labelKey;
        if (sentimentKey) {
          setSelectedSentiment(sentimentKey);
        }
      } else {
        Alert.alert(t('common.error'), t('common.record_not_found'));
        router.back();
      }
    }
  }, [isEditing, id, diaryEntries, router, t]);

  // --- ADDED: Handler for date picker
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSaveEntry = async () => {
    // --- MODIFIED: Check title and content only, date is always valid
    if (!title || !content) {
      Alert.alert(t('common.error'), t('common.field_required'));
      return;
    }

    try {
      // --- MODIFIED: Format date object to YYYY-MM-DD string
      const formattedDate = date.toISOString().split('T')[0];

      const entryData = {
        title,
        date: formattedDate,
        location,
        content,
        sentiment: t(selectedSentiment),
      };

      if (isEditing && id) {
        await updateDiaryEntry({ ...entryData, id: id as string });
      } else {
        await addDiaryEntry(entryData);
      }
      Alert.alert(t('common.success'), t('common.save_success_message'));
      router.back();
    } catch (error) {
      Alert.alert(t('common.error'), t('common.save_error_message'));
      console.error('Error saving diary entry:', error);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('diary_form.title_label')}</ThemedText>
          <TextInput
            style={styles.input}
            placeholder={t('diary_form.title_placeholder')}
            placeholderTextColor={styles.placeholder.color}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* --- MODIFIED: Replaced TextInput with DatePicker button --- */}
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('diary_form.date_label')}</ThemedText>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerButtonText}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        {/* --- ADDED: Conditionally rendered DateTimePicker --- */}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('diary_form.location_label')}</ThemedText>
          <TextInput
            style={styles.input}
            placeholder={t('diary_form.location_placeholder')}
            placeholderTextColor={styles.placeholder.color}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('diary_form.content_label')}</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('diary_form.content_placeholder')}
            placeholderTextColor={styles.placeholder.color}
            multiline
            numberOfLines={6}
            value={content}
            onChangeText={setContent}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('diary_form.sentiment_label')}</ThemedText>
          <View style={styles.sentimentsContainer}>
            {sentiments.map(sentiment => (
              <TouchableOpacity
                key={sentiment.labelKey}
                style={[
                  styles.sentimentButton,
                  selectedSentiment === sentiment.labelKey && styles.sentimentButtonSelected,
                ]}
                onPress={() => setSelectedSentiment(sentiment.labelKey)}
              >
                <Text style={styles.sentimentEmoji}>{sentiment.emoji}</Text>
                <ThemedText style={styles.sentimentLabel}>{t(sentiment.labelKey)}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
          <ThemedText style={styles.saveButtonText}>{t('diary_form.save_button')}</ThemedText>
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
    // --- ADDED: Styles for the date picker button ---
    datePickerButton: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      height: 48,
      justifyContent: 'center',
    },
    datePickerButtonText: {
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
