import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/Colors';
import { IconSymbol } from '../components/ui/IconSymbol';
import { getMedicalRecords, SurgeryRecord } from '../src/data/MedicalRecordService';

export default function SurgeryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { petName, petId } = useLocalSearchParams<{ petName: string; petId: string }>();

  const [surgeries, setSurgeries] = useState<SurgeryRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadSurgeries = async () => {
        if (!petId) return;
        try {
          const records = await getMedicalRecords(petId);
          const surgeryRecords = records.filter(
            (rec): rec is SurgeryRecord => rec.type === 'surgery'
          );
          setSurgeries(surgeryRecords);
        } catch (error) {
          console.error('Failed to load surgeries:', error);
        }
      };

      loadSurgeries();
    }, [petId])
  );

  const renderItem = ({ item }: { item: SurgeryRecord }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push({
        pathname: '/add-surgery-form',
        params: { petId, petName, surgeryId: item.id },
      })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.details.name}</Text>
        <Text style={styles.cardSubtitle}>{item.date}</Text>
        <Text style={styles.cardSubtitle}>
          {item.details.vet || ''}{item.details.vet && item.details.clinic ? ', ' : ''}{item.details.clinic || ''}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={24} color={Colors.light.gray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: t('surgery_screen.title', { petName }),
          headerBackTitleVisible: false,
        }}
      />
      <FlatList
        data={surgeries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('no_surgeries_message')}</Text> 
          </View>
        )}
      />
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push({
            pathname: '/add-surgery-form',
            params: { petId, petName },
          })}
        >
          <IconSymbol name="add" size={24} color={Colors.light.text} />
          <Text style={styles.addButtonText}>{t('surgery_screen.add_button')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContentContainer: {
    padding: 16,
    paddingBottom: 100, // To avoid footer overlap
  },
  card: {
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: Colors.light.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.light.gray,
  },
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
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.gray,
  },
});