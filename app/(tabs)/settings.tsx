import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useFontSize } from '@/src/contexts/FontSizeContext';
import { ThemedText } from '@/components/ThemedText';

// Define el tipo para un solo ítem de ajuste
type SettingItemProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  subLabel?: string;
  color?: string;
  onPress: () => void;
};

// Componente reutilizable para cada fila de ajuste
const SettingItem = ({ icon, label, subLabel, color = '#20df6c', onPress }: SettingItemProps) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.itemContainer, pressed && styles.itemPressed]}>
    <MaterialIcons name={icon} size={24} color={color} />
    <ThemedText style={[styles.itemLabel, { color: color === '#ef4444' ? '#ef4444' : '#1f2937' }]}>{label}</ThemedText>
    {subLabel && <ThemedText style={styles.subLabel}>{subLabel}</ThemedText>}
    <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
  </Pressable>
);

function SettingsContent() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { fontSize, setFontSize } = useFontSize();

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  // Datos para los ítems de ajuste
  const settingsData = [
    {
      icon: 'format-size' as const,
      label: t('settings.font_size'),
      onPress: () => { /* Lógica de navegación futura */ },
      renderCustomContent: () => (
        <View style={styles.fontSizeButtonsContainer}>
          <Pressable
            onPress={() => setFontSize('normal')}
            style={({ pressed }) => [
              styles.fontSizeButton,
              fontSize === 'normal' && styles.fontSizeButtonActive,
              pressed && styles.fontSizeButtonPressed,
            ]}
          >
            <ThemedText style={[
              styles.fontSizeButtonText,
              fontSize === 'normal' && styles.fontSizeButtonTextActive,
            ]}>{t('settings.font_size_normal')}</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setFontSize('medium')}
            style={({ pressed }) => [
              styles.fontSizeButton,
              fontSize === 'medium' && styles.fontSizeButtonActive,
              pressed && styles.fontSizeButtonPressed,
            ]}
          >
            <ThemedText style={[
              styles.fontSizeButtonText,
              fontSize === 'medium' && styles.fontSizeButtonTextActive,
            ]}>{t('settings.font_size_medium')}</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setFontSize('large')}
            style={({ pressed }) => [
              styles.fontSizeButton,
              fontSize === 'large' && styles.fontSizeButtonActive,
              pressed && styles.fontSizeButtonPressed,
            ]}
          >
            <ThemedText style={[
              styles.fontSizeButtonText,
              fontSize === 'large' && styles.fontSizeButtonTextActive,
            ]}>{t('settings.font_size_large')}</ThemedText>
          </Pressable>
        </View>
      ),
    },
    {
      icon: 'language' as const,
      label: t('settings.language_change'),
      subLabel: i18n.language === 'es' ? 'Español' : 'English',
      onPress: handleLanguageChange,
    },
    {
      icon: 'description' as const,
      label: t('settings.terms_and_conditions'),
      onPress: () => router.push('/terms-and-conditions'),
    },
    {
      icon: 'logout' as const,
      label: t('settings.logout'),
      color: '#ef4444', // Color rojo para logout
      onPress: () => { /* Lógica de logout futura */ },
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainContent}>
        {settingsData.map((item, index) => (
          <React.Fragment key={index}>
            <SettingItem
              icon={item.icon}
              label={item.label}
              color={item.color}
              onPress={item.onPress}
            />
            {item.renderCustomContent && item.renderCustomContent()}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

export default function SettingsScreen() {
  return (
    <SettingsContent />
  );
}

// Estilos traducidos de Tailwind CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  mainContent: {
    padding: 16,
    gap: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemPressed: {
    backgroundColor: '#f3f4f6',
  },
  itemLabel: {
    flex: 1,
    fontWeight: '500',
  },
  subLabel: {
    color: '#9ca3af',
    fontWeight: '400',
  },
  fontSizeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  fontSizeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  fontSizeButtonActive: {
    backgroundColor: '#20df6c',
  },
  fontSizeButtonPressed: {
    opacity: 0.7,
  },
  fontSizeButtonText: {
    fontWeight: '500',
    color: '#4b5563',
  },
  fontSizeButtonTextActive: {
    color: '#ffffff',
  },
});