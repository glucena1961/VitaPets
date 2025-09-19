
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { Colors } from '../constants/Colors';
import { IconSymbol } from '../components/ui/IconSymbol';
import { getMedicalRecords, saveMedicalRecord, updateMedicalRecord, deleteMedicalRecord, SurgeryRecord, SurgeryDetails } from '../src/data/MedicalRecordService';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

// --- Helper Functions ---
const formatDateForDisplay = (isoDate?: string): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateForStorage = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// --- Component ---
type FormData = SurgeryDetails & { date: string };

export default function AddSurgeryForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ petId: string; surgeryId?: string; petName: string }>();
  const { petId, surgeryId } = params;

  const isEditingOrViewing = !!surgeryId;
  const [isEditable, setIsEditable] = useState(!isEditingOrViewing);
  const [currentSurgery, setCurrentSurgery] = useState<SurgeryRecord | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<FormData>();
  const dateValue = watch('date');

  useEffect(() => {
    const loadSurgery = async () => {
      if (!petId || !surgeryId) return;
      const records = await getMedicalRecords(petId);
      const surgery = records.find(rec => rec.id === surgeryId) as SurgeryRecord | undefined;
      if (surgery) {
        setCurrentSurgery(surgery);
        reset({ ...surgery.details, date: surgery.date });
      } else {
        Alert.alert(t('common.error'), 'Surgery record not found.');
        router.back();
      }
    };
    if (isEditingOrViewing) {
      loadSurgery();
    } else {
      setValue('date', formatDateForStorage(new Date()));
    }
  }, [isEditingOrViewing, petId, surgeryId, reset, router, t, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!petId) return;
    const { date, ...details } = data;
    try {
      if (currentSurgery) {
        const updatedRecord: SurgeryRecord = { ...currentSurgery, date, details };
        await updateMedicalRecord(petId, updatedRecord);
      } else {
        const newRecord: Omit<SurgeryRecord, 'id' | 'petId'> = { type: 'surgery', date, details };
        await saveMedicalRecord(petId, newRecord);
      }
      Alert.alert(t('common.success'), t('common.save_success_message'));
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert(t('common.error'), t('common.save_error_message'));
    }
  };

  const handleDelete = async () => {
    if (!petId || !currentSurgery) return;
    Alert.alert(
      t('surgery_detail_screen.delete_alert_title'),
      t('surgery_detail_screen.delete_alert_message', { name: currentSurgery.details.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedicalRecord(petId, currentSurgery.id);
              Alert.alert(t('common.success'), t('common.delete_success_message'));
              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert(t('common.error'), t('surgery_detail_screen.delete_error_message'));
            }
          },
        },
      ]
    );
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setValue('date', formatDateForStorage(selectedDate), { shouldValidate: true, shouldDirty: true });
    }
  };

  // --- Render Functions ---
  const renderField = (label: string, value?: string) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.readOnlyField}>
        <Text style={styles.fieldValue}>{value || t('common.not_specified')}</Text>
      </View>
    </View>
  );

  const renderEditableField = (name: keyof SurgeryDetails, label: string, placeholder: string, multiline = false) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, multiline && styles.multilineInput]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value as string}
            placeholder={placeholder}
            placeholderTextColor={Colors.light.gray}
            multiline={multiline}
          />
        </View>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: t(isEditingOrViewing ? 'surgery_detail_screen.title' : 'add_surgery_form.title'),
          headerBackTitleVisible: false,
          headerRight: () => (
            isEditingOrViewing && !isEditable ? (
              <View style={styles.headerButtons}>
                <TouchableOpacity onPress={() => setIsEditable(true)} style={styles.headerButton}>
                  <IconSymbol name="edit" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                  <IconSymbol name="delete" size={24} color={Colors.light.red} />
                </TouchableOpacity>
              </View>
            ) : null
          ),
        }}
      />
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
        {isEditable ? (
          <>
            {renderEditableField('name', t('add_surgery_form.surgery_name'), t('add_surgery_form.surgery_name_placeholder'))}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{t('add_surgery_form.date')}</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputAsButton}>
                <Text style={styles.dateText}>{formatDateForDisplay(dateValue)}</Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={dateValue ? new Date(dateValue) : new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            {renderEditableField('vet', t('add_surgery_form.vet_name'), 'Dr. Smith')}
            {renderEditableField('clinic', t('add_surgery_form.clinic_name'), 'Veterinary Clinic')}
            {renderEditableField('notes', t('add_surgery_form.notes'), '', true)}
          </>
        ) : (
          <>
            {renderField(t('add_surgery_form.surgery_name'), currentSurgery?.details.name)}
            {renderField(t('add_surgery_form.date'), formatDateForDisplay(currentSurgery?.date))}
            {renderField(t('add_surgery_form.vet_name'), currentSurgery?.details.vet)}
            {renderField(t('add_surgery_form.clinic_name'), currentSurgery?.details.clinic)}
            {renderField(t('add_surgery_form.notes'), currentSurgery?.details.notes)}
          </>
        )}
      </ScrollView>
      {isEditable && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
            <Text style={styles.saveButtonText}>{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  scrollContainer: { flex: 1 },
  scrollContentContainer: { padding: 24, paddingBottom: 100 },
  fieldContainer: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: 'bold', color: Colors.light.text, marginBottom: 8 },
  readOnlyField: { backgroundColor: Colors.light.white, borderWidth: 1, borderColor: Colors.light.border, borderRadius: 8, padding: 16, minHeight: 50, justifyContent: 'center' },
  fieldValue: { fontSize: 16, color: Colors.light.gray },
  input: { backgroundColor: Colors.light.white, borderWidth: 1, borderColor: Colors.light.border, borderRadius: 8, padding: 16, fontSize: 16, color: Colors.light.text, minHeight: 50 },
  multilineInput: { minHeight: 120, textAlignVertical: 'top' },
  inputAsButton: { backgroundColor: Colors.light.white, borderWidth: 1, borderColor: Colors.light.border, borderRadius: 8, padding: 16, minHeight: 50, justifyContent: 'center' },
  dateText: { fontSize: 16, color: Colors.light.text },
  footer: { padding: 16, backgroundColor: Colors.light.white, borderTopWidth: 1, borderColor: Colors.light.border },
  saveButton: { backgroundColor: Colors.light.tint, borderRadius: 8, padding: 16, alignItems: 'center' },
  saveButtonText: { color: Colors.light.white, fontSize: 16, fontWeight: 'bold' },
  headerButtons: { flexDirection: 'row' },
  headerButton: { paddingHorizontal: 10 },
});
