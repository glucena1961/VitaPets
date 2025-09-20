import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { Stack, useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getMedicalRecords, MedicineRecord } from '@/src/data/MedicalRecordService';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function MedicineScreen() {
  const router = useRouter();
  const { petId, petName } = useLocalSearchParams<{ petId: string; petName: string }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const [medicines, setMedicines] = useState<MedicineRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (petId) {
        const fetchMedicines = async () => {
          const records = await getMedicalRecords(petId);
          const medicineRecords = records.filter(
            (rec) => rec.type === 'medicine'
          ) as MedicineRecord[];
          setMedicines(medicineRecords);
        };
        fetchMedicines();
      }
    }, [petId])
  );

  const renderMedicineItem = ({ item }: { item: MedicineRecord }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        router.push({
          pathname: '/medicine-detail-screen',
          params: { petId, recordId: item.id },
        });
      }}
    >
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardTitle}>{item.details.name}</ThemedText>
        <ThemedText style={styles.cardSubtitle}>{item.details.dose}</ThemedText>
        <ThemedText style={styles.cardSubtitle}>{t('add_medicine_form.duration')}: {item.details.duration}</ThemedText>
      </View>
      <IconSymbol name="chevron_right" size={24} color={Colors[colorScheme].gray} />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: t('medicine_screen.title', { petName }) }} />
      
      <FlatList
        data={medicines}
        renderItem={renderMedicineItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>{t('medicine_screen.no_medicines_message')}</ThemedText>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            router.push({ pathname: '/add-medicine-form', params: { petId, petName } });
          }}
        >
          <IconSymbol name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>{t('medicine_screen.add_button')}</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].card,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors[colorScheme === 'dark' ? 'dark' : 'light'].secondaryText,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.gray,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].border,
  },
  addButton: {
    backgroundColor: Colors[colorScheme].blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});