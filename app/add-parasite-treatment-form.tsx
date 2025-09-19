
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  saveMedicalRecord,
  updateMedicalRecord,
  ParasiteTreatmentRecord,
  ParasiteTreatmentDetails,
} from '@/src/data/MedicalRecordService';

interface ParasiteTreatmentFormData {
  name: string;
  lastDoseDate: Date;
  nextDoseDate: Date;
  notes?: string;
}

export default function AddParasiteTreatmentForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const { petId, petName, recordId, initialData } = useLocalSearchParams<{ 
    petId: string; 
    petName: string; 
    recordId?: string; 
    initialData?: string 
  }>();

  const isEditing = !!recordId;
  const parsedInitialData: ParasiteTreatmentRecord | undefined = initialData ? JSON.parse(initialData) : undefined;

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ParasiteTreatmentFormData>({
    defaultValues: {
      name: parsedInitialData?.details.name || '',
      lastDoseDate: parsedInitialData?.details.lastDoseDate ? new Date(parsedInitialData.details.lastDoseDate) : new Date(),
      nextDoseDate: parsedInitialData?.details.nextDoseDate ? new Date(parsedInitialData.details.nextDoseDate) : new Date(),
      notes: parsedInitialData?.details.notes || '',
    },
  });

  const selectedLastDoseDate = watch('lastDoseDate');
  const selectedNextDoseDate = watch('nextDoseDate');
  const [showLastDoseDatePicker, setShowLastDoseDatePicker] = useState(false);
  const [showNextDoseDatePicker, setShowNextDoseDatePicker] = useState(false);

  useEffect(() => {
    if (!petId) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: 'Pet ID is missing.',
      });
      router.back();
    }
  }, [petId, router, t]);

  const onSubmit = async (data: ParasiteTreatmentFormData) => {
    if (!petId) return;

    const parasiteTreatmentDetails: ParasiteTreatmentDetails = {
      name: data.name,
      lastDoseDate: data.lastDoseDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
      nextDoseDate: data.nextDoseDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
      notes: data.notes,
    };

    const parasiteTreatmentRecord: Omit<ParasiteTreatmentRecord, 'id' | 'petId'> = {
      type: 'parasite_treatment',
      date: new Date().toISOString(), // La fecha del registro es la actual
      details: parasiteTreatmentDetails,
    };

    try {
      if (isEditing && recordId && parsedInitialData) {
        const updatedRecord: ParasiteTreatmentRecord = {
          ...parsedInitialData,
          ...parasiteTreatmentRecord,
          id: recordId,
          petId: petId,
        };
        await updateMedicalRecord(petId, updatedRecord);
        Toast.show({
          type: 'success',
          text1: t('common.success'),
          text2: t('common.save_success_message'),
        });
      } else {
        await saveMedicalRecord(petId, parasiteTreatmentRecord);
        Toast.show({
          type: 'success',
          text1: t('common.success'),
          text2: t('common.save_success_message'),
        });
      }
      router.back();
    } catch (error) {
      console.error('Error saving parasite treatment record:', error);
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('common.save_error_message'),
      });
    }
  };

  const onChangeLastDoseDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || watch('lastDoseDate');
    setShowLastDoseDatePicker(Platform.OS === 'ios');
    setValue('lastDoseDate', currentDate);
  };

  const onChangeNextDoseDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || watch('nextDoseDate');
    setShowNextDoseDatePicker(Platform.OS === 'ios');
    setValue('nextDoseDate', currentDate);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: t(isEditing ? 'add_parasite_treatment_form.edit_title' : 'add_parasite_treatment_form.title'),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('add_parasite_treatment_form.treatment_name')}</ThemedText>
          <Controller
            control={control}
            name="name"
            rules={{ required: t('common.field_required') || 'Field is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder={t('add_parasite_treatment_form.treatment_name')}
                placeholderTextColor={Colors[colorScheme].placeholderText}
              />
            )}
          />
          {errors.name && <ThemedText style={styles.errorText}>{errors.name.message}</ThemedText>}
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('add_parasite_treatment_form.last_dose_date')}</ThemedText>
          <TouchableOpacity onPress={() => setShowLastDoseDatePicker(true)} style={styles.datePickerButton}>
            <ThemedText style={styles.datePickerText}>
              {selectedLastDoseDate.toLocaleDateString(t('common.locale'))}
            </ThemedText>
          </TouchableOpacity>
          {showLastDoseDatePicker && (
            <DateTimePicker
              value={selectedLastDoseDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeLastDoseDate}
            />
          )}
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('add_parasite_treatment_form.next_dose_date')}</ThemedText>
          <TouchableOpacity onPress={() => setShowNextDoseDatePicker(true)} style={styles.datePickerButton}>
            <ThemedText style={styles.datePickerText}>
              {selectedNextDoseDate.toLocaleDateString(t('common.locale'))}
            </ThemedText>
          </TouchableOpacity>
          {showNextDoseDatePicker && (
            <DateTimePicker
              value={selectedNextDoseDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeNextDoseDate}
            />
          )}
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('add_parasite_treatment_form.notes')}</ThemedText>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.multilineInput]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder={t('add_parasite_treatment_form.notes')}
                placeholderTextColor={Colors[colorScheme].placeholderText}
                multiline
                numberOfLines={4}
              />
            )}
          />
        </ThemedView>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
          <ThemedText style={styles.saveButtonText}>{t('common.save')}</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, // Espacio para el botón de guardar si es fijo
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors[colorScheme].text,
  },
  input: {
    backgroundColor: Colors[colorScheme].inputBackground,
    color: Colors[colorScheme].inputText,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors[colorScheme].inputBorder,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    backgroundColor: Colors[colorScheme].inputBackground,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors[colorScheme].inputBorder,
  },
  datePickerText: {
    fontSize: 16,
    color: Colors[colorScheme].inputText,
  },
  saveButton: {
    backgroundColor: Colors[colorScheme].blue,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors[colorScheme].red,
    fontSize: 12,
    marginTop: 4,
  },
});
