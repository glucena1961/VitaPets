import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { Colors } from '../constants/Colors';
import { IconSymbol } from '../components/ui/IconSymbol';
import { getMedicalRecords, saveMedicalRecord, updateMedicalRecord, deleteMedicalRecord, ExamRecord, ExamDetails } from '../src/data/MedicalRecordService';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';
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
type FormData = ExamDetails & { date: string };

export default function AddExamForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ petId: string; examId?: string; petName: string }>();
  const { petId, examId } = params;

  const isEditingOrViewing = !!examId;
  const [isEditable, setIsEditable] = useState(!isEditingOrViewing);
  const [currentExam, setCurrentExam] = useState<ExamRecord | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<FormData>();
  const dateValue = watch('date');
  const attachmentUri = watch('attachmentUri');

  useEffect(() => {
    const loadExam = async () => {
      if (!petId || !examId) return;
      const records = await getMedicalRecords(petId);
      const exam = records.find(rec => rec.id === examId) as ExamRecord | undefined;
      if (exam) {
        setCurrentExam(exam);
        reset({ ...exam.details, date: exam.date });
      } else {
        Toast.show({ type: 'error', text1: t('common.error'), text2: 'Exam record not found.' });
        router.back();
      }
    };
    if (isEditingOrViewing) {
      loadExam();
    } else {
      setValue('date', formatDateForStorage(new Date()));
    }
  }, [isEditingOrViewing, petId, examId, reset, router, t, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!petId) return;
    const { date, ...details } = data;
    try {
      if (currentExam) {
        const updatedRecord: ExamRecord = { ...currentExam, date, details };
        await updateMedicalRecord(petId, updatedRecord);
      } else {
        const newRecord: Omit<ExamRecord, 'id' | 'petId'> = { type: 'exam', date, details };
        await saveMedicalRecord(petId, newRecord);
      }
      Toast.show({ type: 'success', text1: t('common.success'), text2: t('common.save_success_message') });
      router.back();
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: t('common.error'), text2: t('common.save_error_message') });
    }
  };

  const handleDelete = async () => {
    if (!petId || !currentExam) return;
    Alert.alert(
      t('exam_detail_screen.delete_alert_title'),
      t('exam_detail_screen.delete_alert_message', { name: currentExam.details.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedicalRecord(petId, currentExam.id);
              if (currentExam.details.attachmentUri) {
                await FileSystem.deleteAsync(currentExam.details.attachmentUri);
              }
              Toast.show({ type: 'success', text1: t('common.success'), text2: t('common.delete_success_message') });
              router.back();
            } catch (error) {
              console.error(error);
              Toast.show({ type: 'error', text1: t('common.error'), text2: t('exam_detail_screen.delete_error_message') });
            }
          },
        },
      ]
    );
  };

  const handlePickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const permanentDir = FileSystem.documentDirectory + 'attachments/';
        await FileSystem.makeDirectoryAsync(permanentDir, { intermediates: true });
        const permanentUri = permanentDir + asset.name;
        await FileSystem.copyAsync({ from: asset.uri, to: permanentUri });
        setValue('attachmentUri', permanentUri, { shouldValidate: true, shouldDirty: true });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Toast.show({ type: 'error', text1: t('common.error'), text2: 'Failed to attach document.' });
    }
  }, [setValue, t]);

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
      <View style={styles.readOnlyField}><Text style={styles.fieldValue}>{value || t('common.not_specified')}</Text></View>
    </View>
  );

  const renderEditableField = (name: keyof Omit<ExamDetails, 'attachmentUri'>, label: string, placeholder: string, multiline = false) => (
    <Controller control={control} name={name} render={({ field: { onChange, onBlur, value } }) => (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput style={[styles.input, multiline && styles.multilineInput]} onBlur={onBlur} onChangeText={onChange} value={value as string} placeholder={placeholder} placeholderTextColor={Colors.light.gray} multiline={multiline} />
      </View>
    )} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: t(isEditingOrViewing ? 'exam_detail_screen.title' : 'add_exam_form.title'), headerBackTitleVisible: false, headerRight: () => (isEditingOrViewing && !isEditable ? <View style={styles.headerButtons}><TouchableOpacity onPress={() => setIsEditable(true)} style={styles.headerButton}><IconSymbol name="edit" size={24} color={Colors.light.text} /></TouchableOpacity><TouchableOpacity onPress={handleDelete} style={styles.headerButton}><IconSymbol name="delete" size={24} color={Colors.light.red} /></TouchableOpacity></View> : null) }} />
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
        {isEditable ? (
          <>
            {renderEditableField('name', t('add_exam_form.exam_name'), t('add_exam_form.exam_name_placeholder'))}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{t('add_exam_form.date')}</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputAsButton}><Text style={styles.dateText}>{formatDateForDisplay(dateValue)}</Text></TouchableOpacity>
            </View>
            {showDatePicker && <DateTimePicker value={dateValue ? new Date(dateValue) : new Date()} mode="date" display="default" onChange={onDateChange} />}
            {renderEditableField('results', t('add_exam_form.results'), '', true)}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{t('add_exam_form.attachments')}</Text>
              {attachmentUri ? (
                <View style={styles.attachmentInfo}><Text style={styles.attachmentText} numberOfLines={1}>{attachmentUri.split('/').pop()}</Text><TouchableOpacity onPress={() => setValue('attachmentUri', undefined)}><IconSymbol name="close" size={20} color={Colors.light.gray} /></TouchableOpacity></View>
              ) : (
                <TouchableOpacity style={styles.attachmentBox} onPress={handlePickDocument}><View style={styles.attachmentInner}><IconSymbol name="cloud_upload" size={40} color={Colors.light.gray} /><Text style={styles.attachmentBoxText}>{t('add_exam_form.upload_prompt')}</Text></View></TouchableOpacity>
              )}
            </View>
          </>
        ) : (
          <>
            {renderField(t('add_exam_form.exam_name'), currentExam?.details.name)}
            {renderField(t('add_exam_form.date'), formatDateForDisplay(currentExam?.date))}
            {renderField(t('add_exam_form.results'), currentExam?.details.results)}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{t('add_exam_form.attachments')}</Text>
              {currentExam?.details.attachmentUri ? (
                <TouchableOpacity style={styles.attachmentInfo} onPress={() => Linking.openURL(currentExam.details.attachmentUri!)}><Text style={styles.attachmentText} numberOfLines={1}>{currentExam.details.attachmentUri.split('/').pop()}</Text></TouchableOpacity>
              ) : (
                renderField(t('add_exam_form.attachments'), t('common.not_specified'))
              )}
            </View>
          </>
        )}
      </ScrollView>
      {isEditable && <View style={styles.footer}><TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}><Text style={styles.saveButtonText}>{t('common.save')}</Text></TouchableOpacity></View>}
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
  attachmentBox: { alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: Colors.light.background, borderRadius: 8, borderWidth: 2, borderColor: Colors.light.border, borderStyle: 'dashed' },
  attachmentInner: { alignItems: 'center', gap: 8 },
  attachmentBoxText: { color: Colors.light.gray, fontSize: 16, fontWeight: '500' },
  attachmentInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.light.white, borderWidth: 1, borderColor: Colors.light.border, borderRadius: 8, padding: 16, minHeight: 50 },
  attachmentText: { flex: 1, fontSize: 16, color: Colors.light.text },
});