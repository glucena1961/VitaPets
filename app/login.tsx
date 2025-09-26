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
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('login.errorTitle'), t('login.errorEmptyFields'));
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      // La redirección es manejada automáticamente por el RootLayout
    } catch (error: any) {
      Alert.alert(t('login.errorTitle'), error.message || t('login.errorUnexpected'));
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
            <Text style={styles.title}>{t('login.title')}</Text>
            <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder={t('login.emailPlaceholder')}
              placeholderTextColor="#9ca3af" // content-dark
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder={t('login.passwordPlaceholder')}
              placeholderTextColor="#9ca3af" // content-dark
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity onPress={() => Alert.alert(t('common.notImplemented'))}>
              <Text style={styles.forgotPassword}>{t('login.forgotPassword')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? t('login.loading') : t('login.loginButton')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('login.noAccount')}{' '}
              <Text style={styles.link} onPress={() => router.push('/register')}>
                {t('login.registerLink')}
              </Text>
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
    padding: 16, // p-4
  },
  header: {
    alignItems: 'center',
    marginBottom: 32, // mb-8
  },
  title: {
    fontSize: 30, // text-3xl
    fontWeight: 'bold',
    marginTop: 8, // mt-2
    color: '#101c22',
  },
  subtitle: {
    color: 'rgba(16,28,34,0.6)', // text-black/60
    fontSize: 16,
  },
  form: {
    width: '100%',
    maxWidth: 384, // max-w-sm
    gap: 16, // space-y-4
  },
  input: {
    width: '100%',
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: '#d1d5db', // border-zinc-300
    backgroundColor: '#ffffff', // bg-white
    padding: 12, // p-3
    color: '#101c22',
    fontSize: 16,
  },
  forgotPassword: {
    textAlign: 'right',
    fontSize: 14, // text-sm
    color: '#13a4ec', // text-primary
  },
  button: {
    width: '100%',
    borderRadius: 8, // rounded-lg
    backgroundColor: '#13a4ec', // bg-primary
    paddingVertical: 12, // py-3
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#ffffff', // text-white
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    marginTop: 24, // mt-6
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(16,28,34,0.6)', // text-black/60
  },
  link: {
    fontWeight: 'bold',
    color: '#13a4ec', // text-primary
  },
});