import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
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
      <Stack.Screen 
        options={{
            title: t('allergy_screen.title', { petName: petName || 'Mascota' }),
            headerBackTitleVisible: false,
        }}
      />
      <View style={styles.container}>
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopWidth: 0,
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