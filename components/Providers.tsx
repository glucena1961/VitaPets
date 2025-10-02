
import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import i18n, { resources } from '@/src/lib/i18n';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { FontSizeProvider } from '@/src/contexts/FontSizeContext';
import { DiaryProvider } from '@/src/contexts/DiaryContext';
import { AIConversationProvider } from '@/src/contexts/AIConversationContext';

// SplashController now only worries about fonts and auth state
function SplashController({ children }: { children: React.ReactNode }) {
  const { isLoading: isAuthLoading } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded && !isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isAuthLoading]);

  if (!fontsLoaded || isAuthLoading) {
    return null; // Keep splash screen visible
  }

  return <>{children}</>;
}

// The main provider component, now handling i18n initialization
export function Providers({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    async function prepareI18n() {
      try {
        const storedLang = await AsyncStorage.getItem('selectedLanguage');
        const lng = storedLang || 'es';
        await i18n.init({
          compatibilityJSON: 'v3',
          resources,
          lng,
          fallbackLng: 'en',
          interpolation: { escapeValue: false },
        });
      } catch (e) {
        console.warn('Error initializing i18n:', e);
      } finally {
        setI18nInitialized(true);
      }
    }
    prepareI18n();
  }, []);

  // Do not render anything until i18n is ready
  if (!i18nInitialized) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <FontSizeProvider>
          <DiaryProvider>
            <AIConversationProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SplashController>{children}</SplashController>
                <Toast />
              </ThemeProvider>
            </AIConversationProvider>
          </DiaryProvider>
        </FontSizeProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}
