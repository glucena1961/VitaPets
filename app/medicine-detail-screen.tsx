
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
  MedicineRecord,
} from '@/src/data/MedicalRecordService';

export default function MedicineDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const { petId, recordId } = useLocalSearchParams<{ petId: string; recordId: string }>();
  const [medicine, setMedicine] = useState<MedicineRecord | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (petId && recordId) {
        const fetchMedicine = async () => {
          try {
            const records = await getMedicalRecords(petId);
            const foundMedicine = records.find(
              (rec) => rec.id === recordId && rec.type === 'medicine'
            ) as MedicineRecord | undefined;

            if (foundMedicine) {
              setMedicine(foundMedicine);
            } else {
              Toast.show({
                type: 'error',
                text1: t('common.error'),
                text2: t('common.record_not_found'), // Necesita traducción
              });
              router.back();
            }
          } catch (error) {
            console.error('Error fetching medicine record:', error);
            Toast.show({
              type: 'error',
              text1: t('common.error'),
              text2: t('common.fetch_error'), // Necesita traducción
            });
            router.back();
          }
        };
        fetchMedicine();
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
      t('medicine_detail_screen.delete_alert_title'),
      t('medicine_detail_screen.delete_alert_message', { name: medicine?.details.name || '' }),
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
              console.error('Error deleting medicine record:', error);
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

  if (!medicine) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: t('medicine_detail_screen.title') }} />
        <ThemedText style={styles.loadingText}>{t('common.loading')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: t('medicine_detail_screen.title'),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/add-medicine-form',
                    params: { petId, recordId: medicine.id, initialData: JSON.stringify(medicine) },
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
        <ThemedText style={styles.label}>{t('add_medicine_form.medicine_name')}</ThemedText>
        <ThemedText style={styles.value}>{medicine.details.name}</ThemedText>
      </View>

      <View style={styles.detailCard}>
        <ThemedText style={styles.label}>{t('add_medicine_form.dose')}</ThemedText>
        <ThemedText style={styles.value}>{medicine.details.dose}</ThemedText>
      </View>

      <View style={styles.detailCard}>
        <ThemedText style={styles.label}>{t('medicine_detail_screen.duration_label')}</ThemedText>
        <ThemedText style={styles.value}>{medicine.details.duration}</ThemedText>
      </View>

      <View style={styles.detailCard}>
        <ThemedText style={styles.label}>{t('medicine_detail_screen.date_label')}</ThemedText>
        <ThemedText style={styles.value}>
          {new Date(medicine.date).toLocaleDateString(t('common.locale'))}
        </ThemedText>
      </View>

      {medicine.details.notes && (
        <View style={styles.detailCard}>
          <ThemedText style={styles.label}>{t('medicine_detail_screen.notes_label')}</ThemedText>
          <ThemedText style={styles.value}>{medicine.details.notes}</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
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
    backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors[colorScheme].inputBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
