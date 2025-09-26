import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '../src/lib/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const selectLanguageAndNavigate = async (lang: 'es' | 'en') => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem('selectedLanguage', lang);
      router.replace('/login');
    } catch (e) {
      console.error("Failed to save language or navigate", e);
      // Fallback navigation in case storage fails
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {fontFamily: 'SpaceMono'}]}>
        {t('welcome.title')}
      </Text>
      <Text style={[styles.subtitle, {fontFamily: 'SpaceMono'}]}>
        {t('welcome.select_language')}
      </Text>
      
      <Button 
        mode="contained" 
        onPress={() => selectLanguageAndNavigate('es')} 
        style={styles.button}
      >
        Español
      </Button>

      <Button 
        mode="contained" 
        onPress={() => selectLanguageAndNavigate('en')} 
        style={styles.button}
      >
        English
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f6f7f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    width: '80%',
  },
});
