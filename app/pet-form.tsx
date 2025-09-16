import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Platform, Image, Share, Alert, Pressable } from 'react-native';
import { Button, TextInput, List, Appbar, Text, Modal, Portal } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import QRCode from 'react-native-qrcode-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { getPet, savePet } from '../src/data/PetService';

export default function PetFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditMode = !!id;

  const { control, handleSubmit, reset, setValue, watch } = useForm();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [savedPetData, setSavedPetData] = useState(null);
  const viewShotRef = useRef<ViewShot>(null);

  // State for Date Picker
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dobValue = watch('basicInfo.dob');

  useEffect(() => {
    const loadPetData = async () => {
      if (isEditMode) {
        const petData = await getPet(id as string);
        if (petData) {
          reset(petData);
          if (petData.photoUri) {
            setImageUri(petData.photoUri);
          }
        }
      }
    };
    loadPetData();
  }, [id, isEditMode, reset]);

  // --- Image Picker Logic ---
  const pickImage = async () => {
    // ... (código existente)
  };
  const takePhoto = async () => {
    // ... (código existente)
  };
  const selectImage = () => {
    // ... (código existente)
  };

  // --- Date Picker Logic ---
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    // Formatear fecha a DD/MM/YYYY
    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate().toString().padStart(2, '0') + '/' + (tempDate.getMonth() + 1).toString().padStart(2, '0') + '/' + tempDate.getFullYear();
    setValue('basicInfo.dob', fDate);
  };

  // --- Form Submission ---
  const onSubmit = async (data: any) => {
    try {
      await savePet({ ...data, photoUri: imageUri });
      Toast.show({
        type: 'success',
        text1: t('common.success'),
        text2: isEditMode ? t('pet_form.update_success_message') : t('pet_form.add_success_message'),
      });
      router.back(); // Vuelve a la pantalla anterior
    } catch (error) {
      console.error("Error saving pet:", error);
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('pet_form.error_message'),
      });
    }
  };

  // --- QR Code Logic ---
  const onSaveToGallery = async () => { /* ... */ };
  const onShare = async () => { /* ... */ };
  const onCloseModal = () => {
    setModalVisible(false);
    router.back();
  };

  // --- Render Functions ---
  const renderInput = (name: string, label: string, placeholder?: string) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          label={label}
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          style={styles.input}
        />
      )}
    />
  );

  const renderPicker = (name: string, label: string, items: { label: string; value: string }[]) => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange}>
            {items.map(item => <Picker.Item key={item.value} label={item.label} value={item.value} />)}
          </Picker>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={isEditMode ? t('pet_form.edit_title') : t('pet_form.add_title')} />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        {/* ... (Image Picker View) ... */}
        <List.AccordionGroup>
          <List.Accordion title={t('pet_form.basic_info_section')} id="1">
            {renderInput('basicInfo.name', t('pet_form.name'))}
            <Pressable onPress={() => setShowDatePicker(true)}>
              <View pointerEvents="none">
                <TextInput
                  label={t('pet_form.dob')}
                  value={dobValue}
                  editable={false}
                  style={styles.input}
                />
              </View>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={'date'}
                display="default"
                onChange={onDateChange}
              />
            )}
            {renderInput('basicInfo.species', t('pet_form.species'))}
            {renderInput('basicInfo.breed', t('pet_form.breed'))}
            {renderPicker('basicInfo.sex', t('pet_form.sex'), [
              { label: t('pet_form.sex_options.male'), value: 'male' },
              { label: t('pet_form.sex_options.female'), value: 'female' },
            ])}
            {renderInput('basicInfo.color', t('pet_form.color'))}
            {renderInput('basicInfo.markings', t('pet_form.markings'))}
            {renderInput('basicInfo.chipId', t('pet_form.chip_id'))}
          </List.Accordion>
          <List.Accordion title={t('pet_form.medical_info_section')} id="2">
            {renderInput('medicalInfo.weightKg', t('pet_form.weight_kg'))}
            {renderInput('medicalInfo.heightCm', t('pet_form.height_cm'))}
            {renderInput('medicalInfo.allergies', t('pet_form.allergies'))}
            {renderInput('medicalInfo.medications', t('pet_form.medications'))}
            {renderInput('medicalInfo.specialCondition', t('pet_form.special_condition'))}
            {renderPicker('medicalInfo.neuteredStatus', t('pet_form.others'), [
              { label: t('pet_form.others_options.none'), value: 'none' },
              { label: t('pet_form.others_options.spayed'), value: 'spayed' },
              { label: t('pet_form.others_options.neutered'), value: 'neutered' },
            ])}
          </List.Accordion>
          <List.Accordion title={t('pet_form.owner_info_section')} id="3">
            {renderInput('ownerInfo.name', t('pet_form.owner_name'))}
            {renderInput('ownerInfo.phone', t('pet_form.phone'), '+xx xxx xxx xxxx')}
            {renderInput('ownerInfo.email', t('pet_form.email'))}
          </List.Accordion>
        </List.AccordionGroup>
        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.saveButton}>
          {t('pet_form.save_button')}
        </Button>
      </ScrollView>
      {/* ... (Modal QR Code) ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (estilos existentes)
  pickerContainer: {
    marginHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 8,
  },
  pickerLabel: {
    color: '#666666',
    fontSize: 12,
    paddingTop: 6,
    paddingLeft: 12,
  },
  input: {
    backgroundColor: 'transparent', // Para que se vea bien el input no editable
  },
  saveButton: {
    marginVertical: 24,
    width: '60%', // Ajustado al 60%
    alignSelf: 'center', // Lo centramos
  },
});