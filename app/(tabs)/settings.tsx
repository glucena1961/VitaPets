import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/src/context/AuthContext';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { signOut } = useAuth();

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    // Guardamos la preferencia de idioma para futuras sesiones
    await AsyncStorage.setItem('user-language', lang);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>{t('tabs.settings', 'Ajustes')}</ThemedText>
      
      <View style={styles.section}>
        <ThemedText type="subtitle">{t('settings.language.title', 'Idioma')}</ThemedText>
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={() => changeLanguage('es')} style={styles.button}>
            Español
          </Button>
          <Button mode="outlined" onPress={() => changeLanguage('en')} style={styles.button}>
            English
          </Button>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">{t('settings.account.title', 'Cuenta')}</ThemedText>
        <Button mode="contained" onPress={signOut} style={styles.button}>
          {t('settings.account.signOut', 'Cerrar Sesión')}
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
});