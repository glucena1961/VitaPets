import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// Adaptador de almacenamiento personalizado para React Native usando expo-secure-store
const customStorageAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = 'https://khoajtkgemedbzsnskoj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2FqdGtnZW1lZGJ6c25za29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQzNjUsImV4cCI6MjA3MzQ1MDM2NX0.Hz-szxCJUgI0KPmrHhnMiT-qgtWDyiSyjZaAEbFJbCQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Importante para React Native
  },
});
