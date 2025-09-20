
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '../src/lib/i18n'; // Importar la instancia de i18n

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleLanguageSelect = (lang: 'es' | 'en') => {
    i18n.changeLanguage(lang);
    // Usamos replace para que el usuario no pueda "volver" a la pantalla de onboarding
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        {t('welcome.title')}
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        {t('welcome.select_language')}
      </Text>
      
      <Button 
        mode="contained" 
        onPress={() => handleLanguageSelect('es')} 
        style={styles.button}
      >
        Español
      </Button>

      <Button 
        mode="contained" 
        onPress={() => handleLanguageSelect('en')} 
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
    textAlign: 'center',
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    width: '80%',
  },
});
