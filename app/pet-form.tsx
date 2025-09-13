import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Platform, Image, Share, Alert } from 'react-native';
import { Button, TextInput, List, Appbar, Text, Modal, Portal } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import QRCode from 'react-native-qrcode-svg';
import { getPet, savePet } from '../src/data/PetService';

export default function PetFormScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditMode = !!id;

  const { control, handleSubmit, reset, setValue } = useForm();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [savedPetData, setSavedPetData] = useState(null);
  const viewShotRef = useRef<ViewShot>(null);

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setValue('photoUri', result.assets[0].uri);
    }
  };

  const onSubmit = async (data: any) => {
    const savedPet = await savePet(data);
    setSavedPetData(savedPet);
    setModalVisible(true);
  };

  const onSaveToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant permission to save to your photo library.');
        return;
      }

      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        await MediaLibrary.createAssetAsync(uri);
        Alert.alert('Saved!', 'QR code saved to your photo library.');
      }
    } catch (error) {
      console.error('Error saving QR code', error);
      Alert.alert('Error', 'Could not save QR code.');
    }
  };

  const onShare = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        await Share.share({ url: uri });
      }
    } catch (error) {
      console.error('Error sharing QR code', error);
    }
  };

  const onCloseModal = () => {
    setModalVisible(false);
    router.back();
  };

  const renderInput = (name: string, label: string) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          label={label}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          style={styles.input}
        />
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={isEditMode ? t('pet_form.edit_title') : t('pet_form.add_title')} />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          <Button icon="camera" mode="outlined" onPress={pickImage} style={styles.imageButton}>
            {t('pet_form.add_photo_button')}
          </Button>
        </View>
        <List.AccordionGroup>
          <List.Accordion title={t('pet_form.basic_info_section')} id="1">
            {renderInput('basicInfo.name', t('pet_form.name'))}
            {renderInput('basicInfo.dob', t('pet_form.dob'))}
            {renderInput('basicInfo.species', t('pet_form.species'))}
            {renderInput('basicInfo.breed', t('pet_form.breed'))}
            {renderInput('basicInfo.sex', t('pet_form.sex'))}
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
          </List.Accordion>
          <List.Accordion title={t('pet_form.owner_info_section')} id="3">
            {renderInput('ownerInfo.name', t('pet_form.owner_name'))}
            {renderInput('ownerInfo.phone', t('pet_form.phone'))}
            {renderInput('ownerInfo.email', t('pet_form.email'))}
          </List.Accordion>
        </List.AccordionGroup>
        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.saveButton}>
          {t('pet_form.save_button')}
        </Button>
      </ScrollView>
      <Portal>
        <Modal visible={modalVisible} onDismiss={onCloseModal} contentContainerStyle={styles.modalContainer}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
            <View style={styles.qrContainer}>
              {savedPetData && (
                <QRCode
                  value={JSON.stringify(savedPetData)}
                  size={250}
                />
              )}
            </View>
          </ViewShot>
          <Button onPress={onSaveToGallery} style={styles.modalButton}>Save to Gallery</Button>
          <Button onPress={onShare} style={styles.modalButton}>Share</Button>
          <Button onPress={onCloseModal} style={styles.modalButton}>Close</Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  input: {
    marginBottom: 8,
  },
  saveButton: {
    marginVertical: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  imageButton: {
    width: '60%',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  modalButton: {
    marginTop: 10,
    width: '80%',
  },
});
