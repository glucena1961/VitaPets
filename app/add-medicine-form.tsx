
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
  MedicineRecord,
  MedicineDetails,
} from '@/src/data/MedicalRecordService';

interface MedicineFormData {
  name: string;
  dose: string;
  duration: string;
  notes?: string;
  date: Date;
}

export default function AddMedicineForm() {
  const router = useRouter();
      const { t, i18n } = useTranslation();
      const colorScheme = useColorScheme();
      const styles = createStyles(colorScheme);
    
      const { petId, petName, recordId, initialData } = useLocalSearchParams<{ 
        petId: string; 
        petName: string; 
        recordId?: string; 
        initialData?: string 
      }>();
    
      const isEditing = !!recordId;
      const parsedInitialData: MedicineRecord | undefined = initialData ? JSON.parse(initialData) : undefined;
    
      const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<MedicineFormData>({
        defaultValues: {
          name: parsedInitialData?.details.name || '',
          dose: parsedInitialData?.details.dose || '',
          duration: parsedInitialData?.details.duration || '',
          notes: parsedInitialData?.details.notes || '',
          date: parsedInitialData?.date ? new Date(parsedInitialData.date) : new Date(),
        },
      });
    
      const selectedDate = watch('date');
      const [showDatePicker, setShowDatePicker] = useState(false);  useEffect(() => {
    if (!petId) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: 'Pet ID is missing.',
      });
      router.back();
    }
  }, [petId, router, t]);

  const onSubmit = async (data: MedicineFormData) => {
    if (!petId) return;

    const medicineDetails: MedicineDetails = {
      name: data.name,
      dose: data.dose,
      duration: data.duration,
      notes: data.notes,
    };

    const medicineRecord: Omit<MedicineRecord, 'id' | 'petId'> = {
      type: 'medicine',
      date: data.date.toISOString(),
      details: medicineDetails,
    };

    try {
      if (isEditing && recordId && parsedInitialData) {
        const updatedRecord: MedicineRecord = {
          ...parsedInitialData,
          ...medicineRecord,
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
        await saveMedicalRecord(petId, medicineRecord);
        Toast.show({
          type: 'success',
          text1: t('common.success'),
          text2: t('common.save_success_message'),
        });
      }
      router.back();
    } catch (error) {
      console.error('Error saving medicine record:', error);
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('common.save_error_message'),
      });
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || watch('date');
    setShowDatePicker(Platform.OS === 'ios');
    setValue('date', currentDate);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: t(isEditing ? 'add_medicine_form.edit_title' : 'add_medicine_form.title'),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('add_medicine_form.medicine_name')}</ThemedText>
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
                placeholder={t('add_medicine_form.medicine_name')}
                placeholderTextColor={Colors[colorScheme].placeholderText}
              />
            )}
          />
          {errors.name && <ThemedText style={styles.errorText}>{errors.name.message}</ThemedText>}
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('add_medicine_form.dose')}</ThemedText>
          <Controller
            control={control}
            name="dose"
            rules={{ required: t('common.field_required') || 'Field is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder={t('add_medicine_form.dose')}
                placeholderTextColor={Colors[colorScheme].placeholderText}
              />
            )}
          />
          {errors.dose && <ThemedText style={styles.errorText}>{errors.dose.message}</ThemedText>}
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('add_medicine_form.duration')}</ThemedText>
          <Controller
            control={control}
            name="duration"
            rules={{ required: t('common.field_required') || 'Field is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder={t('add_medicine_form.duration')}
                placeholderTextColor={Colors[colorScheme].placeholderText}
              />
            )}
          />
          {errors.duration && <ThemedText style={styles.errorText}>{errors.duration.message}</ThemedText>}
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('add_medicine_form.notes')}</ThemedText>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.multilineInput]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder={t('add_medicine_form.notes')}
                placeholderTextColor={Colors[colorScheme].placeholderText}
                multiline
                numberOfLines={4}
              />
            )}
          />
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText style={styles.label}>{t('add_medicine_form.date')}</ThemedText>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <ThemedText style={styles.datePickerText}>
              {selectedDate.toLocaleDateString(t('common.locale'))}
            </ThemedText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
            />
          )}
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
    color: Colors.light.red,
    fontSize: 12,
    marginTop: 4,
  },
});
