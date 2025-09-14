import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// Adaptador para que Supabase utilice SecureStore de Expo
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Carga las variables de entorno de Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Valida que las variables de entorno estén presentes
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL and Anon Key are missing. Please provide them in a .env file.'
  );
  // En un entorno real, podrías lanzar un error o manejarlo de otra forma
  // throw new Error("Supabase URL and Anon Key must be provided in environment variables.");
}

// Crea y exporta el cliente de Supabase
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
