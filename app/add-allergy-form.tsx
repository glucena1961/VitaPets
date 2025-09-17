
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AllergyDetails, MedicalRecord, saveMedicalRecord, updateMedicalRecord } from '../src/data/MedicalRecordService';

const AddAllergyFormScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ petId: string, id?: string, name?: string, date?: string, vet?: string, clinic?: string, edit?: string }>();

  const isEditMode = params.edit === 'true';

  const [allergy, setAllergy] = useState('');
  const [date, setDate] = useState('');
  const [vet, setVet] = useState('');
  const [clinic, setClinic] = useState('');

  useEffect(() => {
    if (isEditMode) {
      setAllergy(params.name || '');
      setDate(params.date || '');
      setVet(params.vet || '');
      setClinic(params.clinic || '');
    }
  }, [isEditMode]);

  const handleSave = async () => {
    if (!params.petId) {
      Alert.alert('Error', 'No se ha proporcionado un ID de mascota.');
      return;
    }
    if (!allergy || !date) {
      Alert.alert('Campos requeridos', 'El nombre de la alergia y la fecha son obligatorios.');
      return;
    }

    const allergyDetails: AllergyDetails = { name: allergy, vet: vet, clinic: clinic };

    try {
      if (isEditMode && params.id) {
        // Modo Edición
        const updatedRecord: MedicalRecord = {
          id: params.id,
          petId: params.petId,
          type: 'allergy',
          date: date,
          details: allergyDetails,
        };
        await updateMedicalRecord(params.petId, updatedRecord);
      } else {
        // Modo Creación
        const newRecord: Omit<MedicalRecord, 'id' | 'petId'> = {
          type: 'allergy',
          date: date,
          details: allergyDetails,
        };
        await saveMedicalRecord(params.petId, newRecord);
      }
      // Navegar dos veces para volver a la lista de alergias
      if (router.canGoBack()) router.back();
      if (router.canGoBack()) router.back();

    } catch (error) {
      Alert.alert('Error al guardar', 'No se pudo guardar el registro. Intente de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {isEditMode ? t('add_allergy_form.edit_title') : t('add_allergy_form.title')}
          </Text>
          <View style={styles.headerButton} />
        </View>

        <ScrollView style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('add_allergy_form.allergy_name')}</Text>
            <TextInput style={styles.input} value={allergy} onChangeText={setAllergy} placeholder={t('add_allergy_form.allergy_name_placeholder')} placeholderTextColor="#A1A1AA" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('add_allergy_form.date')}</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="DD/MM/YYYY" placeholderTextColor="#A1A1AA" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('add_allergy_form.vet_name')}</Text>
            <TextInput style={styles.input} value={vet} onChangeText={setVet} placeholder="Dr. Javier Ortiz" placeholderTextColor="#A1A1AA" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('add_allergy_form.clinic_name')}</Text>
            <TextInput style={styles.input} value={clinic} onChangeText={setClinic} placeholder="Clínica La Arboleda" placeholderTextColor="#A1A1AA" />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#111827' },
  formContainer: { flex: 1, padding: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 16, color: '#111827' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  saveButton: { backgroundColor: '#3B82F6', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default AddAllergyFormScreen;
