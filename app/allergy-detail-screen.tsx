import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { deleteMedicalRecord, getMedicalRecord, MedicalRecord } from '../src/data/MedicalRecordService';

const AllergyDetailScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { petId, id } = useLocalSearchParams<{ petId: string, id: string }>();

  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecord = async () => {
      if (petId && id) {
        try {
          const fetchedRecord = await getMedicalRecord(petId, id);
          setMedicalRecord(fetchedRecord);
        } catch (error) {
          console.error("Failed to fetch medical record:", error);
          Alert.alert(t('common.error'), t('allergy_detail_screen.fetch_error_message'));
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    loadRecord();
  }, [petId, id]);

  const handleEdit = () => {
    if (medicalRecord) {
      router.push({
        pathname: '/add-allergy-form',
        params: { petId: medicalRecord.pet_id, id: medicalRecord.id, edit: 'true' },
      });
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      t('allergy_detail_screen.delete_alert_title'),
      t('allergy_detail_screen.delete_alert_message', { name: medicalRecord?.details.name }),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('common.delete'),
          style: "destructive",
          onPress: async () => {
            try {
              if (!petId || !id) return;
              await deleteMedicalRecord(id);
              Alert.alert(t('common.success'), t('allergy_detail_screen.delete_success_message'));
              router.back();
            } catch (error) {
              Alert.alert(t('common.error'), t('allergy_detail_screen.delete_error_message'));
            }
          },
        },
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
            <Ionicons name="pencil" size={22} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleEdit, handleDelete]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  if (!medicalRecord) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
        <Text>{t('allergy_detail_screen.record_not_found')}</Text>
      </SafeAreaView>
    );
  }

  // Asumiendo que medicalRecord.details es AllergyDetails
  const allergyDetails = medicalRecord.details as AllergyDetails;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.label}>{t('allergy_detail_screen.allergy_label')}</Text>
            <Text style={styles.value}>{allergyDetails.name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>{t('allergy_detail_screen.date_label')}</Text>
            <Text style={styles.value}>{medicalRecord.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>{t('allergy_detail_screen.vet_label')}</Text>
            <Text style={styles.value}>{allergyDetails.vet || t('common.not_specified')}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>{t('allergy_detail_screen.clinic_label')}</Text>
            <Text style={styles.value}>{allergyDetails.clinic || t('common.not_specified')}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  headerActions: { flexDirection: 'row' },
  headerButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  contentContainer: { padding: 20 },
  detailItem: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#374151',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllergyDetailScreen;