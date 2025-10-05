import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Button } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { AllergyDetails, MedicalRecord, getMedicalRecord, saveMedicalRecord, updateMedicalRecord } from '../src/data/MedicalRecordService';
import { Colors } from '../constants/Colors';

type FormData = AllergyDetails;

const AddAllergyFormScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ petId: string, id?: string, edit?: string }>();

  const isEditMode = params.edit === 'true';

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: {
      name: '',
      vet: '',
      clinic: '',
    }
  });

  // --- State para el DatePicker ---
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadAllergyData = async () => {
      if (isEditMode && params.petId && params.id) {
        const fetchedRecord = await getMedicalRecord(params.petId, params.id);
        if (fetchedRecord) {
          const allergyDetails = fetchedRecord.details as AllergyDetails;
          reset(allergyDetails);
          // Si la fecha viene de la DB, es una string YYYY-MM-DD. Convertir a objeto Date.
          // Se añade T00:00:00 para evitar problemas de zona horaria al parsear.
          setDate(new Date(fetchedRecord.date + 'T00:00:00'));
        }
      }
    };
    loadAllergyData();
  }, [isEditMode, params, reset]);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onSubmit = async (data: FormData) => {
    if (!params.petId) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: 'Pet ID is missing.' });
      return;
    }
    if (!data.name) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: 'Allergy name and date are required.' });
      return;
    }

    // --- Formateo Robusto de Fecha ---
    // Convierte la fecha a una cadena en formato YYYY-MM-DD en UTC.
    const formattedDate = date.toISOString().split('T')[0];

    try {
      // Objeto base con los datos comunes
      const recordData = {
        type: 'allergy' as 'allergy',
        date: formattedDate,
        details: data,
      };

      let result: MedicalRecord | null = null;
      if (isEditMode && params.id) {
        // Para actualizar, pasamos el ID del registro y el objeto de datos
        result = await updateMedicalRecord(params.id, recordData);
      } else {
        // Para guardar, pasamos el ID de la mascota y el objeto de datos por separado
        result = await saveMedicalRecord(params.petId, recordData);
      }

      if (result) {
        Toast.show({ type: 'success', text1: t('common.success'), text2: t('common.save_success_message') });
        router.back();
      } else {
        Toast.show({ type: 'error', text1: t('common.error'), text2: t('common.save_error_message') });
      }

    } catch (error) {
      console.error("Error saving medical record:", error);
      Toast.show({ type: 'error', text1: t('common.error'), text2: t('common.save_error_message') });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{
            title: isEditMode ? t('add_allergy_form.edit_title') : t('add_allergy_form.title'),
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
        }}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.formContainer}>
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('add_allergy_form.allergy_name')}</Text>
                <TextInput style={styles.input} value={value} onBlur={onBlur} onChangeText={onChange} placeholder={t('add_allergy_form.allergy_name_placeholder')} placeholderTextColor="#A1A1AA" />
              </View>
            )}
          />
          
          {/* --- Nuevo Campo de Fecha --- */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('add_allergy_form.date')}</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerButtonText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

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

           <Controller
            control={control}
            name="vet"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('add_allergy_form.vet_name')}</Text>
                <TextInput style={styles.input} value={value || ''} onBlur={onBlur} onChangeText={onChange} placeholder="Dr. Javier Ortiz" placeholderTextColor="#A1A1AA" />
              </View>
            )}
          />
           <Controller
            control={control}
            name="clinic"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('add_allergy_form.clinic_name')}</Text>
                <TextInput style={styles.input} value={value || ''} onBlur={onBlur} onChangeText={onChange} placeholder="Clínica La Arboleda" placeholderTextColor="#A1A1AA" />
              </View>
            )}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
            <Text style={styles.saveButtonText}>{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  formContainer: { flex: 1, padding: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 16, color: '#111827' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', backgroundColor: '#FFFFFF' },
  saveButton: { backgroundColor: '#3B82F6', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  datePickerButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#111827',
  },
});

export default AddAllergyFormScreen;
