import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      await signUp({ email, password, fullName });
      Alert.alert('Registro exitoso', 'Se ha enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada para activar tu cuenta.');
      // Opcional: redirigir a login después del registro exitoso
      router.push('/login');
    } catch (error: any) {
      Alert.alert('Error en el registro', error.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor={styles.placeholder.color}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={styles.placeholder.color}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={styles.placeholder.color}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor={styles.placeholder.color}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ¿Ya tienes una cuenta?{' '}
          <Text style={styles.link} onPress={() => router.push('/login')}>
            Iniciar sesión
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Estilos basados en la configuración de Tailwind del HTML
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8', // background-light
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24, // p-6
  },
  formContainer: {
    width: '100%',
    maxWidth: 384, // max-w-sm
    gap: 16, // space-y-4
  },
  input: {
    width: '100%',
    padding: 16, // p-4
    backgroundColor: '#e5e7eb', // foreground-light
    borderRadius: 12, // rounded-lg
    fontSize: 16,
    color: '#111c21', // text-black dark:text-white (usamos light)
  },
  placeholder: {
    color: '#6b7280', // placeholder-content-light
  },
  button: {
    width: '100%',
    maxWidth: 384, // max-w-sm
    backgroundColor: '#19a1e6', // bg-primary
    paddingVertical: 16, // py-4
    borderRadius: 12, // rounded-lg
    marginTop: 24, // AÃ±adido para separar del formulario
  },
  buttonDisabled: {
    backgroundColor: '#19a1e6/90', // Simula hover:bg-primary/90
  },
  buttonText: {
    color: '#ffffff', // text-white
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  footer: {
    padding: 16, // p-4
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14, // text-sm
    color: '#6b7280', // text-content-light
  },
  link: {
    fontWeight: '500', // font-medium
    color: '#19a1e6', // text-primary
  },
});