
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/Colors';
import { IconSymbol } from '../components/ui/IconSymbol';
import { getMedicalRecords, ExamRecord } from '../src/data/MedicalRecordService';

export default function ExamScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { petName, petId } = useLocalSearchParams<{ petName: string; petId: string }>();

  const [exams, setExams] = useState<ExamRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadExams = async () => {
        if (!petId) return;
        try {
          const records = await getMedicalRecords(petId);
          const examRecords = records.filter(
            (rec): rec is ExamRecord => rec.type === 'exam'
          );
          setExams(examRecords);
        } catch (error) {
          console.error('Failed to load exams:', error);
        }
      };

      loadExams();
    }, [petId])
  );

  const renderItem = ({ item }: { item: ExamRecord }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push({
        pathname: '/add-exam-form', // This file will be created next
        params: { petId, petName, examId: item.id },
      })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.details.name}</Text>
        <Text style={styles.cardSubtitle}>{item.date}</Text>
      </View>
      <IconSymbol name="chevron.right" size={24} color={Colors.light.gray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: t('exam_screen.title', { petName }),
          headerBackTitleVisible: false,
        }}
      />
      <FlatList
        data={exams}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('exam_screen.no_exams_message')}</Text> 
          </View>
        )}
      />
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push({
            pathname: '/add-exam-form', // This file will be created next
            params: { petId, petName },
          })}
        >
          <Text style={styles.addButtonText}>{t('exam_screen.add_button')}</Text>
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
