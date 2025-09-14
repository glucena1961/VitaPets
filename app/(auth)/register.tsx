import { View, StyleSheet, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/src/context/AuthContext';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const router = useRouter();
  const errorColor = useThemeColor({}, 'error');
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: any) => {
    const { data: resultData, error } = await signUp({ email: data.email, password: data.password });

    if (error) {
      Toast.show({
        type: 'error',
        text1: t('auth.register.errorTitle', 'Error en el registro'),
        text2: error.message,
      });
    } else if (resultData.user) {
      Toast.show({
        type: 'success',
        text1: t('auth.register.successTitle', 'Registro exitoso'),
        text2: t('auth.register.successMessage', 'Por favor, revisa tu email para confirmar tu cuenta.'),
      });
      router.push('/(auth)/login');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>
          {t('auth.register.title', 'Crear Cuenta')}
        </ThemedText>

        <Controller
          control={control}
          rules={{
            required: t('auth.validation.emailRequired', 'El email es obligatorio.'),
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: t('auth.validation.emailInvalid', 'El formato del email no es válido.'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t('auth.register.emailLabel', 'Email')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.email}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
          name="email"
        />
        {errors.email && <ThemedText style={[styles.errorText, { color: errorColor }]}>{errors.email.message}</ThemedText>}

        <Controller
          control={control}
          rules={{
            required: t('auth.validation.passwordRequired', 'La contraseña es obligatoria.'),
            minLength: {
              value: 6,
              message: t('auth.validation.passwordLength', 'La contraseña debe tener al menos 6 caracteres.'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t('auth.register.passwordLabel', 'Contraseña')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.password}
              secureTextEntry
              style={styles.input}
            />
          )}
          name="password"
        />
        {errors.password && <ThemedText style={[styles.errorText, { color: errorColor }]}>{errors.password.message}</ThemedText>}

        <Controller
          control={control}
          rules={{
            required: t('auth.validation.confirmPasswordRequired', 'Debes confirmar la contraseña.'),
            validate: value => value === password || t('auth.validation.passwordsDoNotMatch', 'Las contraseñas no coinciden.'),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t('auth.register.confirmPasswordLabel', 'Confirmar Contraseña')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.confirm_password}
              secureTextEntry
              style={styles.input}
            />
          )}
          name="confirm_password"
        />
        {errors.confirm_password && <ThemedText style={[styles.errorText, { color: errorColor }]}>{errors.confirm_password.message}</ThemedText>}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.button}
        >
          {t('auth.register.submitButton', 'Crear Cuenta')}
        </Button>

        <View style={styles.linksContainer}>
          <Link href="/(auth)/login">
            <ThemedText type="link" style={styles.link}>
              {t('auth.register.backToLoginLink', '¿Ya tienes una cuenta? Inicia sesión')}
            </ThemedText>
          </Link>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  linksContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  link: {
    marginVertical: 8,
  },
  errorText: {
    marginBottom: 8,
    marginLeft: 4,
  },
});