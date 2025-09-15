import { Stack, useLocalSearchParams } from 'expo-router';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, 
  ActivityIndicator, LayoutAnimation, UIManager, Platform, Alert, Share
} from 'react-native';
import { useTranslation, TFunction } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from 'react';
import { getPet } from '../src/data/PetService';
import { Pet } from '../src/data/PetService';
import QRCodeSVG from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DetailRow = ({ label, value }: { label: string; value: string | undefined | null }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || 'N/A'}</Text>
  </View>
);

const formatQrDataAsText = (p: Pet | null, t: TFunction): string => {
  if (!p) return '';
  const NA = t('qrReport.not_available');
  const NONE = t('qrReport.none');
  const report: string[] = [];

  report.push(t('qrReport.basic_info_title'));
  report.push(`${t('qrReport.name')} ${p.basicInfo?.name || NA}`);
  report.push(`${t('qrReport.species')} ${p.basicInfo?.species || NA}`);
  report.push(`${t('qrReport.breed')} ${p.basicInfo?.breed || NA}`);
  report.push(`${t('qrReport.dob')} ${p.basicInfo?.dob || NA}`);
  report.push(`${t('qrReport.sex')} ${p.basicInfo?.sex || NA}`);
  report.push(`${t('qrReport.chipId')} ${p.basicInfo?.chipId || NA}`);
  report.push('');

  report.push(t('qrReport.medical_info_title'));
  report.push(`${t('qrReport.weight')} ${p.medicalInfo?.weightKg || NA} ${t('qrReport.kg')}`);
  report.push(`${t('qrReport.allergies')} ${p.medicalInfo?.allergies || NONE}`);
  report.push(`${t('qrReport.medications')} ${p.medicalInfo?.medications || NONE}`);
  report.push(`${t('qrReport.specialCondition')} ${p.medicalInfo?.specialCondition || NONE}`);
  report.push(`${t('qrReport.others')} ${p.medicalInfo?.others || NONE}`);
  report.push('');

  report.push(t('qrReport.owner_info_title'));
  report.push(`${t('qrReport.ownerName')} ${p.ownerInfo?.name || NA}`);
  report.push(`${t('qrReport.phone')} ${p.ownerInfo?.phone || NA}`);
  report.push(`${t('qrReport.email')} ${p.ownerInfo?.email || NA}`);

  return report.join('\n');
};

export default function PetQRDetailScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { t } = useTranslation();
  const qrCodeRef = useRef(null);

  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataVisible, setIsDataVisible] = useState(false);

  useEffect(() => {
    const loadPetData = async () => {
      if (petId) {
        try {
          const fetchedPet = await getPet(petId);
          setPet(fetchedPet);
        } catch (error) {
          console.error("Failed to fetch pet data:", error);
          setPet(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    loadPetData();
  }, [petId]);

  const toggleDataVisibility = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(400, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity));
    setIsDataVisible(!isDataVisible);
  };

  const handleDownload = async () => {
    try {
      if (!qrCodeRef.current) return;
      const uri = await captureRef(qrCodeRef, { format: 'png', quality: 1.0, height: 1080, width: 1080 });
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permissions.gallery_denied_title'), t('permissions.gallery_denied_message'));
        return;
      }
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert(t('common.success'), t('qrDetail.download_success_message'));
    } catch (error) {
      console.error('Error al descargar el QR:', error);
      Alert.alert(t('common.error'), t('qrDetail.download_error_message'));
    }
  };

  const handleShare = async () => {
    try {
      if (!qrCodeRef.current) return;
      const uri = await captureRef(qrCodeRef, { format: 'png', quality: 1.0 });
      await Share.share({ title: t('qrDetail.share_title', { petName: pet?.basicInfo.name }), url: uri });
    } catch (error) {
      console.error('Error al compartir el QR:', error);
      Alert.alert(t('common.error'), t('qrDetail.share_error_message'));
    }
  };

  if (isLoading) {
    return <View style={[styles.container, styles.centerContent]}><ActivityIndicator size="large" color="#20DF6C" /></View>;
  }

  if (!pet) {
    return <View style={[styles.container, styles.centerContent]}><Text>{t('common.pet_not_found')}</Text></View>;
  }

  const petName = pet.basicInfo?.name || t('pet_form.unnamed');
  const petBreed = pet.basicInfo?.breed || t('pet_form.no_species');
  const petAvatar = pet.photoUri ? { uri: pet.photoUri } : require('../assets/images/icon.png');
  const instructionText = t('qrDetail.scanInstruction', { petName: petName });
  const qrData = formatQrDataAsText(pet, t);

  return (
    <>
      <Stack.Screen options={{ title: t('qrDetail.title'), headerBackTitle: t('common.back') }} />
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Image source={petAvatar} style={styles.avatar} />
            <View style={styles.qrIconBadge}><Ionicons name="qr-code-outline" size={18} color="white" /></View>
          </View>
          <Text style={styles.petName}>{petName}</Text>
          <Text style={styles.petBreed}>{petBreed}</Text>
        </View>

        <View style={styles.qrSection}>
          <View style={styles.qrCard}>
            <View ref={qrCodeRef} collapsable={false} style={{ backgroundColor: 'white', padding: 16 }}>
              <QRCodeSVG value={qrData} size={200} backgroundColor="white" color="black" />
            </View>
          </View>
          <Text style={styles.instructionText}>{instructionText}</Text>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonSecondary} onPress={toggleDataVisibility}>
                <Ionicons name="eye-outline" size={20} color="#333" />
                <Text style={styles.buttonTextSecondary}>{t('qrDetail.viewButton')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={20} color="#333" />
                <Text style={styles.buttonTextSecondary}>{t('qrDetail.shareButton')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={handleDownload}>
                <Ionicons name="download-outline" size={20} color="#333" />
                <Text style={styles.buttonTextSecondary}>{t('qrDetail.downloadButton')}</Text>
            </TouchableOpacity>
        </View>

        {isDataVisible && (
          <View style={styles.detailsContainer}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="paw-outline" size={22} color="#495057" />
                <Text style={styles.sectionTitle}>{t('pet_form.basic_info_section')}</Text>
              </View>
              <DetailRow label={t('pet_form.name')} value={pet.basicInfo.name} />
              <DetailRow label={t('pet_form.species')} value={pet.basicInfo.species} />
              <DetailRow label={t('pet_form.breed')} value={pet.basicInfo.breed} />
              <DetailRow label={t('pet_form.dob')} value={pet.basicInfo.dob} />
              <DetailRow label={t('pet_form.sex')} value={pet.basicInfo.sex} />
              <DetailRow label={t('pet_form.chip_id')} value={pet.basicInfo.chipId} />
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="medkit-outline" size={22} color="#495057" />
                <Text style={styles.sectionTitle}>{t('pet_form.medical_info_section')}</Text>
              </View>
              <DetailRow label={t('pet_form.weight_kg')} value={pet.medicalInfo?.weightKg ? `${pet.medicalInfo.weightKg} kg` : undefined} />
              <DetailRow label={t('pet_form.allergies')} value={pet.medicalInfo?.allergies} />
              <DetailRow label={t('pet_form.medications')} value={pet.medicalInfo?.medications} />
              <DetailRow label={t('pet_form.special_condition')} value={pet.medicalInfo?.specialCondition} />
              <DetailRow label={t('pet_form.others')} value={pet.medicalInfo?.others} />
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-circle-outline" size={22} color="#495057" />
                <Text style={styles.sectionTitle}>{t('pet_form.owner_info_section')}</Text>
              </View>
              <DetailRow label={t('pet_form.owner_name')} value={pet.ownerInfo?.name} />
              <DetailRow label={t('pet_form.phone')} value={pet.ownerInfo?.phone} />
              <DetailRow label={t('pet_form.email')} value={pet.ownerInfo?.email} />
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  headerContainer: { alignItems: 'center', padding: 24 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 112, height: 112, borderRadius: 56, borderWidth: 4, borderColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5 },
  qrIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#20DF6C', padding: 6, borderRadius: 15, borderWidth: 2, borderColor: 'white' },
  petName: { fontSize: 24, fontWeight: 'bold', marginTop: 16, color: '#212529' },
  petBreed: { fontSize: 16, color: '#6C757D' },
  qrSection: { alignItems: 'center', paddingHorizontal: 24, marginTop: 8 },
  qrCard: { backgroundColor: 'white', borderRadius: 24, padding: 12, width: '100%', maxWidth: 340, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, alignItems: 'center', justifyContent: 'center', aspectRatio: 1 },
  instructionText: { textAlign: 'center', color: '#6C757D', marginTop: 24, paddingHorizontal: 16, maxWidth: 380, fontSize: 16, lineHeight: 24 },
  buttonContainer: { padding: 24, paddingTop: 16, gap: 16, maxWidth: 340, width: '100%', alignSelf: 'center' },
  buttonSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E9ECEF', paddingVertical: 16, borderRadius: 50, gap: 10 },
  buttonTextSecondary: { color: '#212529', fontWeight: 'bold', fontSize: 16 },
  detailsContainer: { marginHorizontal: 24, marginBottom: 24, padding: 16, backgroundColor: 'white', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: '#F1F3F5', paddingBottom: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#343A40' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  detailLabel: { fontSize: 14, color: '#6C757D' },
  detailValue: { fontSize: 14, color: '#212529', fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
});