
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { getMedicalRecords, saveMedicalRecord, updateMedicalRecord, deleteMedicalRecord, VaccineRecord } from '@/src/data/MedicalRecordService';
import { IconSymbol } from '@/components/ui/IconSymbol';

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateString; // Fallback to original string if format is unexpected
  }
};

export default function AddVaccineFormScreen() {
  const router = useRouter();
  const { petId, petName, recordId } = useLocalSearchParams<{ petId: string; petName: string; recordId?: string }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const [isEditMode, setIsEditMode] = useState(!recordId);
  const [formData, setFormData] = useState<Partial<VaccineRecord['details'] & { date: string }>>({
    name: '',
    date: new Date().toISOString().split('T')[0],
    nextDoseDate: '',
    lot: '',
  });

  const [showPicker, setShowPicker] = useState(false);
  const [dateFieldToEdit, setDateFieldToEdit] = useState<'date' | 'nextDoseDate' | null>(null);

  useEffect(() => {
    if (recordId) {
      const fetchRecord = async () => {
        const records = await getMedicalRecords(petId);
        const vaccine = records.find(r => r.id === recordId) as VaccineRecord | undefined;
        if (vaccine) {
          setFormData({ ...vaccine.details, date: vaccine.date });
        } else {
          Toast.show({ type: 'error', text1: t('common.error'), text2: t('common.record_not_found') });
          router.back();
        }
      };
      fetchRecord();
    }
  }, [recordId, petId]);

  const handleSave = async () => {
    if (!formData.name) {
      Alert.alert(t('common.error'), t('common.field_required'));
      return;
    }

    try {
      const recordData = {
        type: 'vaccine' as const,
        date: formData.date || new Date().toISOString().split('T')[0],
        details: {
          name: formData.name,
          nextDoseDate: formData.nextDoseDate || '',
          lot: formData.lot || '',
        },
      };

      if (recordId) {
        await updateMedicalRecord(petId, { ...recordData, id: recordId, petId });
      } else {
        await saveMedicalRecord(petId, recordData);
      }

      Toast.show({ type: 'success', text1: t('common.success'), text2: t('common.save_success_message') });
      router.back();
    } catch (error) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: t('common.save_error_message') });
      console.error(error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('delete_vaccine_alert.title'),
      t('delete_vaccine_alert.message', { name: formData.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedicalRecord(petId, recordId!);
              Toast.show({ type: 'success', text1: t('common.success'), text2: t('common.delete_success_message') });
              router.push({ pathname: '/vaccine-screen', params: { petId, petName } });
            } catch (error) {
              Toast.show({ type: 'error', text1: t('common.error'), text2: t('common.save_error_message') });
            }
          },
        },
      ]
    );
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate && dateFieldToEdit) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, [dateFieldToEdit]: isoDate }));
    }
  };

  const showDatepickerFor = (field: 'date' | 'nextDoseDate') => {
    setDateFieldToEdit(field);
    setShowPicker(true);
  };

  const renderTextField = (label: string, value: string | undefined, key: keyof typeof formData, placeholder: string) => (
    <View style={styles.fieldContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {isEditMode ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => setFormData(prev => ({ ...prev, [key]: text }))}
          placeholder={placeholder}
          placeholderTextColor={Colors[colorScheme].placeholderText}
        />
      ) : (
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{value || t('common.not_specified')}</Text>
        </View>
      )}
    </View>
  );

  const renderDateField = (label: string, value: string | undefined, key: 'date' | 'nextDoseDate') => (
    <View style={styles.fieldContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {isEditMode ? (
        <TouchableOpacity style={styles.input} onPress={() => showDatepickerFor(key)}>
          <Text style={styles.dateText}>{formatDate(value) || t('common.not_specified')}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.readOnlyField}>
          <Text style={styles.readOnlyText}>{formatDate(value) || t('common.not_specified')}</Text>
        </View>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: recordId ? t('add_vaccine_form.edit_title') : t('add_vaccine_form.add_title'),
          headerRight: () => (
            recordId ? (
              <View style={styles.headerButtons}>
                {!isEditMode && (
                  <TouchableOpacity onPress={() => setIsEditMode(true)} style={styles.headerButton}>
                    <IconSymbol name="edit" size={24} color={Colors[colorScheme].tint} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                  <IconSymbol name="delete" size={24} color={Colors[colorScheme].red} />
                </TouchableOpacity>
              </View>
            ) : null
          )
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderTextField(t('add_vaccine_form.name'), formData.name, 'name', 'e.g., Rabies')}
        {renderDateField(t('add_vaccine_form.date'), formData.date, 'date')}
        {renderDateField(t('add_vaccine_form.next_dose_date'), formData.nextDoseDate, 'nextDoseDate')}
        {renderTextField(t('add_vaccine_form.lot'), formData.lot, 'lot', '12345-ABC')}
      </ScrollView>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(formData[dateFieldToEdit!] || new Date())}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {isEditMode && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  fieldContainer: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: {
    backgroundColor: Colors[colorScheme].inputBackground,
    color: Colors[colorScheme].inputText,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors[colorScheme].inputBorder,
    fontSize: 16,
    justifyContent: 'center',
  },
  dateText: {
    color: Colors[colorScheme].inputText,
    fontSize: 16,
  },
  readOnlyField: {
    backgroundColor: Colors[colorScheme].inputBackground,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors[colorScheme].inputBorder,
  },
  readOnlyText: { color: Colors[colorScheme].secondaryText, fontSize: 16 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors[colorScheme].background,
    borderTopWidth: 1,
    borderTopColor: Colors[colorScheme].border,
  },
  saveButton: {
    backgroundColor: Colors[colorScheme].blue,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  headerButtons: { flexDirection: 'row', gap: 16 },
  headerButton: { padding: 4 },
});
