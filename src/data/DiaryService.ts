import { supabase } from '../lib/supabase';

// La interfaz refleja la tabla 'diary_entries' en Supabase
export interface DiaryEntry {
  id: string; // UUID
  user_id: string;
  created_at: string;
  title: string;
  date: string; // Formato YYYY-MM-DD
  location?: string;
  content: string;
  sentiment?: string;
}

// El servicio ahora usa Supabase para todas las operaciones CRUD
export const DiaryService = {
  async getDiaryEntries(): Promise<DiaryEntry[]> {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error getting diary entries', error.message);
      return [];
    }
    return data || [];
  },

  async getDiaryEntry(id: string): Promise<DiaryEntry | null> {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting single diary entry', error.message);
      return null;
    }
    return data;
  },

  async saveDiaryEntry(
    entry: Omit<DiaryEntry, 'id' | 'user_id' | 'created_at'>
  ): Promise<DiaryEntry | null> {
    const { data, error } = await supabase
      .from('diary_entries')
      .insert(entry)
      .select()
      .single();

    if (error) {
      console.error('Error saving diary entry', error.message);
      return null;
    }
    return data;
  },

  async updateDiaryEntry(
    id: string,
    updates: Partial<Omit<DiaryEntry, 'id' | 'user_id' | 'created_at'>>
  ): Promise<DiaryEntry | null> {
    const { data, error } = await supabase
      .from('diary_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating diary entry', error.message);
      return null;
    }
    return data;
  },

  async deleteDiaryEntry(id: string): Promise<boolean> {
    const { error } = await supabase.from('diary_entries').delete().eq('id', id);

    if (error) {
      console.error('Error deleting diary entry', error.message);
      return false;
    }
    return true;
  },

  async clearAllDiaryEntries(): Promise<boolean> {
    // RLS se encarga de que solo se borren las entradas del usuario actual.
    const { error } = await supabase.from('diary_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Afecta a todas las filas a las que el usuario tiene acceso

    if (error) {
      console.error('Error clearing all diary entries', error.message);
      return false;
    }
    return true;
  },
};