
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { Stack, useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getMedicalRecords, ParasiteTreatmentRecord } from '@/src/data/MedicalRecordService';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function ParasiteTreatmentScreen() {
  const router = useRouter();
  const { petId, petName } = useLocalSearchParams<{ petId: string; petName: string }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const [treatments, setTreatments] = useState<ParasiteTreatmentRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (petId) {
        const fetchTreatments = async () => {
          const records = await getMedicalRecords(petId);
          const parasiteTreatmentRecords = records.filter(
            (rec) => rec.type === 'parasite_treatment'
          ) as ParasiteTreatmentRecord[];
          setTreatments(parasiteTreatmentRecords);
        };
        fetchTreatments();
      }
    }, [petId])
  );

  const renderTreatmentItem = ({ item }: { item: ParasiteTreatmentRecord }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        router.push({
          pathname: '/parasite-treatment-detail-screen',
          params: { petId, recordId: item.id },
        });
      }}
    >
      <View style={styles.iconContainer}>
        <IconSymbol name="medication" size={30} color={Colors[colorScheme].icon} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.treatmentName}>{item.details.name}</ThemedText>
          <ThemedText style={styles.dateText}>
            {t('parasite_treatment_screen.last_dose_label')} {item.details.lastDoseDate}
          </ThemedText>
        </View>
        <ThemedText style={styles.nextDoseText}>
          {t('parasite_treatment_screen.next_dose_label')} {item.details.nextDoseDate}
        </ThemedText>
      </View>
      <IconSymbol name="chevron_right" size={24} color={Colors[colorScheme].gray} />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: t('parasite_treatment_screen.title', { petName }) }} />
      
      <FlatList
        data={treatments}
        renderItem={renderTreatmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText>{t('parasite_treatment_screen.no_treatments_message')}</ThemedText>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            router.push({ pathname: '/add-parasite-treatment-form', params: { petId, petName } });
          }}
        >
          <IconSymbol name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>{t('parasite_treatment_screen.add_button')}</Text>
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
    paddingBottom: 100, // Espacio para el footer
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors[colorScheme].inputBorder,
    padding: 16,
    transitionProperty: 'all',
    transitionDuration: '200ms',
    backgroundColor: Colors[colorScheme].card,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors[colorScheme].inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  cardContent: {
    flexGrow: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors[colorScheme].text,
  },
  dateText: {
    fontSize: 12,
    color: Colors[colorScheme].secondaryText,
  },
  nextDoseText: {
    fontSize: 14,
    color: Colors[colorScheme].secondaryText,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors[colorScheme].background,
    borderTopWidth: 1,
    borderTopColor: Colors[colorScheme].border,
  },
  addButton: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: Colors[colorScheme].blue,
    height: 56,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
