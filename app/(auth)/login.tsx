import { View, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from 'react-native-paper';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/src/context/AuthContext';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const errorColor = useThemeColor({}, 'error');
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    const { error } = await signIn({ email: data.email, password: data.password });

    if (error) {
      Toast.show({
        type: 'error',
        text1: t('auth.login.errorTitle', 'Error al iniciar sesión'),
        text2: error.message,
      });
    }
    // Si no hay error, el listener del AuthContext se encargará de la redirección
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {t('auth.login.title_v2', 'Login V2')}
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
            label={t('auth.login.emailLabel', 'Email')}
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
            label={t('auth.login.passwordLabel', 'Contraseña')}
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

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.button}
      >
        {t('auth.login.submitButton', 'Iniciar Sesión')}
      </Button>

      <View style={styles.linksContainer}>
        <Link href="/(auth)/register">
          <ThemedText type="link" style={styles.link}>
            {t('auth.login.createAccountLink', 'Crear una cuenta')}
          </ThemedText>
        </Link>
        <Link href="/(auth)/forgot-password">
          <ThemedText type="link" style={styles.link}>
            {t('auth.login.forgotPasswordLink', '¿Olvidaste tu contraseña?')}
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