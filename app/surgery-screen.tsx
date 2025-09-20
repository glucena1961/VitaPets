import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/Colors';
import { IconSymbol } from '../components/ui/IconSymbol';
import { getMedicalRecords, SurgeryRecord } from '../src/data/MedicalRecordService';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SurgeryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { petName, petId } = useLocalSearchParams<{ petName: string; petId: string }>();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

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
        <ThemedText style={styles.cardTitle}>{item.details.name}</ThemedText>
        <ThemedText style={styles.cardSubtitle}>{item.date}</ThemedText>
        <ThemedText style={styles.cardSubtitle}>
          {item.details.vet || ''}{item.details.vet && item.details.clinic ? ', ' : ''}{item.details.clinic || ''}
        </ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={24} color={Colors[colorScheme].gray} />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
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
            <ThemedText style={styles.emptyText}>{t('no_surgeries_message')}</ThemedText> 
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
          <IconSymbol name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>{t('surgery_screen.add_button')}</Text>
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
  listContentContainer: {
    padding: 16,
    paddingBottom: 100, // To avoid footer overlap
  },
  card: {
    backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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