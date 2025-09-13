import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const handleLanguageSelect = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('user-language', lang);
    router.replace('/onboarding');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Bienvenido / Welcome
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Selecciona tu idioma / Select your language
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    marginBottom: 32,
  },
  button: {
    width: '80%',
    marginBottom: 16,
  },
});

export default WelcomeScreen;
