
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  getMedicalRecords,
  deleteMedicalRecord,
  ParasiteTreatmentRecord,
} from '@/src/data/MedicalRecordService';

export default function ParasiteTreatmentDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const { petId, recordId } = useLocalSearchParams<{ petId: string; recordId: string }>();
  const [treatment, setTreatment] = useState<ParasiteTreatmentRecord | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (petId && recordId) {
        const fetchTreatment = async () => {
          try {
            const records = await getMedicalRecords(petId);
            const foundTreatment = records.find(
              (rec) => rec.id === recordId && rec.type === 'parasite_treatment'
            ) as ParasiteTreatmentRecord | undefined;

            if (foundTreatment) {
              setTreatment(foundTreatment);
            } else {
              Toast.show({
                type: 'error',
                text1: t('common.error'),
                text2: t('common.record_not_found'),
              });
              router.back();
            }
          } catch (error) {
            console.error('Error fetching parasite treatment record:', error);
            Toast.show({
              type: 'error',
              text1: t('common.error'),
              text2: t('common.fetch_error'),
            });
            router.back();
          }
        };
        fetchTreatment();
      } else {
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: 'Pet ID or Record ID is missing.',
        });
        router.back();
      }
    }, [petId, recordId, router, t])
  );

  const handleDelete = () => {
    if (!petId || !recordId) return;

    Alert.alert(
      t('parasite_treatment_detail_screen.delete_alert_title'),
      t('parasite_treatment_detail_screen.delete_alert_message', { name: treatment?.details.name || '' }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          onPress: async () => {
            try {
              await deleteMedicalRecord(petId, recordId);
              Toast.show({
                type: 'success',
                text1: t('common.success'),
                text2: t('common.delete_success_message'),
              });
              router.back();
            } catch (error) {
              console.error('Error deleting parasite treatment record:', error);
              Toast.show({
                type: 'error',
                text1: t('common.error'),
                text2: t('common.delete_error_message'),
              });
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!treatment) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: t('parasite_treatment_detail_screen.title') }} />
        <ThemedText style={styles.loadingText}>{t('common.loading')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: t('parasite_treatment_detail_screen.title'),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/add-parasite-treatment-form',
                    params: { petId, recordId: treatment.id, initialData: JSON.stringify(treatment) },
                  })
                }
                style={styles.headerButton}
              >
                <IconSymbol name="edit" size={24} color={Colors[colorScheme].tint} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                <IconSymbol name="delete" size={24} color={Colors[colorScheme].red} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={styles.detailCard}>
        <View style={styles.detailCardHeader}>
          <View style={styles.iconCircle}>
            <IconSymbol name="medication" size={30} color={Colors[colorScheme].icon} />
          </View>
          <View>
            <ThemedText style={styles.treatmentName}>{treatment.details.name}</ThemedText>
            <ThemedText style={styles.treatmentType}>{t('medical_history.categories.parasite_treatment')}</ThemedText>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <ThemedText style={styles.label}>{t('parasite_treatment_detail_screen.last_dose_date_label')}</ThemedText>
            <ThemedText style={styles.value}>{new Date(treatment.details.lastDoseDate).toLocaleDateString(t('common.locale'))}</ThemedText>
          </View>
          <View style={styles.infoCard}>
            <ThemedText style={styles.label}>{t('parasite_treatment_detail_screen.next_dose_date_label')}</ThemedText>
            <ThemedText style={styles.value}>{new Date(treatment.details.nextDoseDate).toLocaleDateString(t('common.locale'))}</ThemedText>
          </View>
          {treatment.details.notes && (
            <View style={styles.infoCard}>
              <ThemedText style={styles.label}>{t('parasite_treatment_detail_screen.notes_label')}</ThemedText>
              <ThemedText style={styles.value}>{treatment.details.notes}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].background,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
  headerRightContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  headerButton: {
    marginLeft: 15,
  },
  detailCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors[colorScheme].inputBorder,
    padding: 16,
    backgroundColor: Colors[colorScheme].card,
  },
  detailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors[colorScheme].inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  treatmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors[colorScheme].text,
  },
  treatmentType: {
    fontSize: 14,
    color: Colors[colorScheme].secondaryText,
  },
  infoSection: {
    spaceY: 12,
  },
  infoCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors[colorScheme].inputBorder,
    padding: 12,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors[colorScheme].text,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: Colors[colorScheme].secondaryText,
  },
});
