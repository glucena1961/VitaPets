import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleContinue = () => {
    // Usamos replace para que el usuario no pueda "volver" a la pantalla de onboarding
    router.replace('/(tabs)/pets');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        ¡Bienvenido a VitaPet!
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Mantén el historial médico de tu mascota siempre a mano.
      </Text>
      <Button 
        mode="contained" 
        onPress={handleContinue} 
        style={styles.button}
      >
        Comenzar
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
    marginTop: 20,
    width: '80%',
  },
});