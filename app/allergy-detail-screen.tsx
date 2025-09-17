import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { deleteMedicalRecord } from '../src/data/MedicalRecordService';

const AllergyDetailScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ petId: string, id: string, name: string, date: string, vet?: string, clinic?: string }>();

  const handleEdit = () => {
    router.push({
      pathname: '/add-allergy-form',
      params: { ...params, edit: 'true' },
    });
  };

  const handleDelete = async () => {
    Alert.alert(
      t('allergy_detail_screen.delete_alert_title'),
      t('allergy_detail_screen.delete_alert_message', { name: params.name }),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('common.delete'),
          style: "destructive",
          onPress: async () => {
            try {
              if (!params.petId || !params.id) return;
              await deleteMedicalRecord(params.petId, params.id);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('allergy_detail_screen.title')}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
              <Ionicons name="pencil" size={22} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.label}>{t('allergy_detail_screen.allergy_label')}</Text>
            <Text style={styles.value}>{params.name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>{t('allergy_detail_screen.date_label')}</Text>
            <Text style={styles.value}>{params.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>{t('allergy_detail_screen.vet_label')}</Text>
            <Text style={styles.value}>{params.vet || t('common.not_specified')}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>{t('allergy_detail_screen.clinic_label')}</Text>
            <Text style={styles.value}>{params.clinic || t('common.not_specified')}</Text>
          </View>
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
  },
  headerButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerActions: { flexDirection: 'row' },
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
});

export default AllergyDetailScreen;