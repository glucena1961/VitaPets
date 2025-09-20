
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { getPets, Pet } from '../../src/data/PetService';

const MedicalHistoryScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>();
  const [selectedPetData, setSelectedPetData] = useState<Pet | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const loadPets = async () => {
      const storedPets = await getPets();
      setPets(storedPets);
    };

    loadPets();
  }, []);

  const handlePetSelection = (petId: string | undefined) => {
    setSelectedPetId(petId);
    if (petId) {
      const petObject = pets.find(p => p.id === petId);
      setSelectedPetData(petObject || null);
    } else {
      setSelectedPetData(null);
    }
  };

  const medicalCategories = [
    'allergies',
    'surgeries',
    'exams',
    'medicines',
    'parasite_treatment',
    'vaccines',
  ];

  const handleCategoryPress = (category: string) => {
    if (!selectedPetData) {
      return; // Safeguard
    }

    const paths: { [key: string]: string } = {
      allergies: '/allergy-screen',
      surgeries: '/surgery-screen',
      exams: '/exam-screen',
      medicines: '/medicine-screen',
      parasite_treatment: '/parasite-treatment-screen',
      vaccines: '/vaccine-screen',
      // Futuras pantallas se pueden añadir aquí
    };

    const path = paths[category];

    if (path) {
      router.push({
        pathname: path,
        params: { petId: selectedPetData.id, petName: selectedPetData.basicInfo.name },
      });
    } else {
      console.log(`Navegación para la categoría '${category}' aún no implementada.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPetId}
            onValueChange={(itemValue) => handlePetSelection(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label={t('medical_history.select_pet')} value={undefined} />
            {pets.map((pet) => (
              <Picker.Item key={pet.id} label={pet.basicInfo.name || 'Sin nombre'} value={pet.id} />
            ))}
          </Picker>
        </View>

        {/* El título ahora se maneja en el encabezado del navegador */}

        <View style={styles.buttonsContainer}>
          {medicalCategories.map((category) => (
            <TouchableOpacity 
              key={category} 
              style={styles.button} 
              onPress={() => handleCategoryPress(category)}
              disabled={!selectedPetId}
            >
              <Text style={[styles.buttonText, !selectedPetId && styles.disabledText]}>
                {t(`medical_history.categories.${category}`)}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={!selectedPetId ? '#D1D5DB' : '#6b7280'} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  pickerContainer: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    ...Platform.select({
      ios: { padding: 0 },
      android: { paddingHorizontal: 10 },
    }),
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 120 : 50,
    color: '#111827',
  },
  pickerItem: {
    height: 120,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#111827',
    fontStyle: 'italic',
  },
  buttonsContainer: {
    spaceY: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#374151',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});

export default MedicalHistoryScreen;
