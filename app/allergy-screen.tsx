
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MedicalRecord, getMedicalRecords } from '../src/data/MedicalRecordService';

const AllergyScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { petId, petName } = useLocalSearchParams<{ petId: string; petName: string }>();

  const [allergies, setAllergies] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useFocusEffect se ejecuta cada vez que la pantalla entra en foco.
  // Es ideal para recargar datos cuando volvemos de otra pantalla (como el formulario de añadir).
  useFocusEffect(
    useCallback(() => {
      const loadAllergies = async () => {
        if (petId) {
          setIsLoading(true);
          const allRecords = await getMedicalRecords(petId);
          const allergyRecords = allRecords.filter(record => record.type === 'allergy');
          setAllergies(allergyRecords);
          setIsLoading(false);
        }
      };

      loadAllergies();
    }, [petId])
  );

  const renderAllergyItem = ({ item }: { item: MedicalRecord }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => router.push({
        pathname: '/allergy-detail-screen',
        params: { 
          petId: petId, // <-- Añadido
          id: item.id, 
          name: item.details.name, 
          date: item.date, 
          vet: item.details.vet, 
          clinic: item.details.clinic 
        }
      })}
    >
      <Text style={styles.itemName}>{item.details.name}</Text>
      <Text style={styles.itemDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay alergias registradas para {petName}.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {t('allergy_screen.title', { petName: petName || 'Mascota' })}
          </Text>
          <View style={styles.headerButton} />{/* Placeholder for balance */}
        </View>

        {/* Main Content */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={allergies}
            renderItem={renderAllergyItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={ListEmptyComponent}
          />
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push({ pathname: '/add-allergy-form', params: { petId, petName } })}>
            <Text style={styles.addButtonText}>{t('allergy_screen.add_button')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  headerButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginHorizontal: 8,
  },
  listContent: { flexGrow: 1, padding: 16 },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemName: { fontSize: 16, color: '#111827' },
  itemDate: { fontSize: 14, color: '#6B7280' },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default AllergyScreen;
