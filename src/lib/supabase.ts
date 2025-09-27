import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://khoajtkgemedbzsnskoj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2FqdGtnZW1lZGJ6c25za29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQzNjUsImV4cCI6MjA3MzQ1MDM2NX0.Hz-szxCJUgI0KPmrHhnMiT-qgtWDyiSyjZaAEbFJbCQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Usar AsyncStorage para evitar el límite de tamaño de SecureStore
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Importante para React Native
  },
});
