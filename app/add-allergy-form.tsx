import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { AllergyDetails, MedicalRecord, saveMedicalRecord, updateMedicalRecord } from '../src/data/MedicalRecordService';
import { Colors } from '../constants/Colors';

// --- Component ---
type FormData = AllergyDetails;

const AddAllergyFormScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ petId: string, id?: string, name?: string, date?: string, vet?: string, clinic?: string, edit?: string }>();

  const isEditMode = params.edit === 'true';

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: {
      name: '',
      vet: '',
      clinic: '',
    }
  });

  // El parámetro 'date' no es parte de AllergyDetails, se maneja por separado.
  const [date, setDate] = React.useState(params.date || '');

  useEffect(() => {
    const loadAllergyData = async () => {
      if (isEditMode && params.petId && params.id) {
        const fetchedRecord = await getMedicalRecord(params.petId, params.id);
        if (fetchedRecord) {
          // Asumiendo que fetchedRecord.details es AllergyDetails
          const allergyDetails = fetchedRecord.details as AllergyDetails;
          reset(allergyDetails);
          setDate(fetchedRecord.date); // Actualizar el estado local de la fecha
        }
      }
    };
    loadAllergyData();
  }, [isEditMode, params, reset]);

  const onSubmit = async (data: FormData) => {
    if (!params.petId) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: 'Pet ID is missing.' });
      return;
    }
    if (!data.name || !date) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: 'Allergy name and date are required.' });
      return;
    }

    // Formatear la fecha a YYYY-MM-DD para la base de datos
    const [day, month, year] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    try {
      let result: MedicalRecord | null = null;
      if (isEditMode && params.id) {
        const updatedRecord: MedicalRecord = {
          id: params.id,
          pet_id: params.petId,
          type: 'allergy',
          date: formattedDate,
          details: data,
        };
        result = await updateMedicalRecord(params.petId, updatedRecord);
      } else {
        const newRecord: Omit<MedicalRecord, 'id' | 'user_id' | 'created_at'> = {
          pet_id: params.petId,
          type: 'allergy',
          date: formattedDate,
          details: data,
        };
        result = await saveMedicalRecord(params.petId, newRecord);
      }

      if (result) {
        Toast.show({ type: 'success', text1: t('common.success'), text2: t('common.save_success_message') });
        router.back(); // Solo necesita un back, ya que el focus effect recargará la lista.
      } else {
        // Si result es null, significa que hubo un error en el servicio pero no lanzó excepción
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
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('add_allergy_form.allergy_name')}</Text>
                <TextInput style={styles.input} value={value} onBlur={onBlur} onChangeText={onChange} placeholder={t('add_allergy_form.allergy_name_placeholder')} placeholderTextColor="#A1A1AA" />
              </View>
            )}
          />
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('add_allergy_form.date')}</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="DD/MM/YYYY" placeholderTextColor="#A1A1AA" />
          </View>
           <Controller
            control={control}
            name="vet"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('add_allergy_form.vet_name')}</Text>
                <TextInput style={styles.input} value={value} onBlur={onBlur} onChangeText={onChange} placeholder="Dr. Javier Ortiz" placeholderTextColor="#A1A1AA" />
              </View>
            )}
          />
           <Controller
            control={control}
            name="clinic"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('add_allergy_form.clinic_name')}</Text>
                <TextInput style={styles.input} value={value} onBlur={onBlur} onChangeText={onChange} placeholder="Clínica La Arboleda" placeholderTextColor="#A1A1AA" />
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
});

export default AddAllergyFormScreen;