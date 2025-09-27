import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/src/lib/supabase';
import Toast from 'react-native-toast-message';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: t('forgot_password.errorTitle'),
        text2: t('forgot_password.errorEmptyField'),
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: '' // Opcional: redirigir a una URL específica tras el reseteo
      });

      if (error) throw error;

      Toast.show({
        type: 'success',
        text1: t('forgot_password.successTitle'),
        text2: t('forgot_password.successMessage'),
      });
      // Opcionalmente, redirigir a login tras un tiempo
      setTimeout(() => router.push('/login'), 3000);

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('forgot_password.errorTitle'),
        text2: error.message || t('common.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('forgot_password.title')}</Text>
            <Text style={styles.subtitle}>{t('forgot_password.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder={t('forgot_password.emailPlaceholder')}
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handlePasswordReset}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? t('common.loading') : t('forgot_password.buttonText')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.link} onPress={() => router.back()}>
              {t('forgot_password.backToLogin')}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8', // background-light
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#101c22',
  },
  subtitle: {
    color: 'rgba(16,28,34,0.6)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    width: '100%',
    maxWidth: 384,
    gap: 24,
  },
  input: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    padding: 12,
    color: '#101c22',
    fontSize: 16,
  },
  button: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#13a4ec', // primary
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  link: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#13a4ec', // primary
  },
});
