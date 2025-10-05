import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MedicalRecord, getMedicalRecords } from '../src/data/MedicalRecordService';

const AllergyScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { petId, petName } = useLocalSearchParams<{ petId: string; petName: string }>();

  const [allergies, setAllergies] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          petId: petId,
          id: item.id,
        }
      })}
    >
      <Text style={styles.itemName}>{item.details.name}</Text>
      <Text style={styles.itemDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('allergy_screen.no_allergies', { petName: petName })}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
            title: t('allergy_screen.title', { petName: petName || 'Mascota' }),
            headerBackTitleVisible: false,
        }}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={allergies}
          renderItem={renderAllergyItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={ListEmptyComponent}
          style={{ flex: 1 }} // Asegura que la lista ocupe el espacio disponible
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push({ pathname: '/add-allergy-form', params: { petId, petName } })}>
          <Text style={styles.addButtonText}>{t('allergy_screen.add_button')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#FFFFFF' 
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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