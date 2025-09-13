import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        {t('home.welcome')}
      </Text>
      <Button
        mode="contained"
        icon="plus-circle"
        onPress={() => router.push('/pet-form')}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        {t('home.add_pet_button')}
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
  },
  title: {
    marginBottom: 32,
  },
  button: {
    width: '90%',
  },
  buttonContent: {
    paddingVertical: 10,
  },
});