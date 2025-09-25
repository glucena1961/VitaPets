import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

export default function TermsAndConditionsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: t('settings.terms_screen_title') });
  }, [navigation, t]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <ThemedText>{t('terms_and_conditions.content')}</ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
});
