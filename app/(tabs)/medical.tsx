import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function MedicalScreen() {
  const { t } = useTranslation();
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>{t('medical_screen.title')}</ThemedText>
      <ThemedText>{t('medical_screen.description')}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginTop: 24,
    marginBottom: 16,
  },
});
