import { View, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/src/context/AuthContext';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { sendPasswordResetEmail } = useAuth();
  const router = useRouter();
  const errorColor = useThemeColor({}, 'error');
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: any) => {
    const { error } = await sendPasswordResetEmail(data.email);

    if (error) {
      Toast.show({
        type: 'error',
        text1: t('auth.forgotPassword.errorTitle', 'Error'),
        text2: error.message,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: t('auth.forgotPassword.successTitle', 'Petición enviada'),
        text2: t('auth.forgotPassword.successMessage', 'Si el email existe, recibirás un enlace para resetear tu contraseña.'),
      });
      router.push('/(auth)/login');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('auth.forgotPassword.title', 'Recuperar Contraseña')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        {t('auth.forgotPassword.subtitle', 'Introduce tu email y te enviaremos un enlace para resetear tu contraseña.')}
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
            label={t('auth.forgotPassword.emailLabel', 'Email')}
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

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.button}
      >
        {t('auth.forgotPassword.submitButton', 'Enviar Email de Recuperación')}
      </Button>

      <View style={styles.linksContainer}>
        <Link href="/(auth)/login">
          <ThemedText type="link" style={styles.link}>
            {t('auth.forgotPassword.backToLoginLink', 'Volver a Iniciar Sesión')}
          </ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
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
