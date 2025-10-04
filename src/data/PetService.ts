import { supabase } from '../lib/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

// La interfaz ahora refleja la estructura de la tabla 'pets' en Supabase.
export interface Pet {
  id: string; // UUID generado por la DB
  user_id: string; // UUID del usuario propietario
  created_at: string; // Timestamp
  name: string;
  species?: string;
  photo_uri?: string;
}

// Obtiene todas las mascotas del usuario autenticado.
// RLS se encarga de filtrar automáticamente por el user_id.
export const getPets = async (): Promise<Pet[]> => {
  const { data, error } = await supabase.from('pets').select('*');

  if (error) {
    console.error('Error fetching pets:', error.message);
    return [];
  }

  return data || [];
};

// Obtiene una mascota específica por su ID.
// RLS asegura que el usuario solo pueda obtenerla si es el propietario.
export const getPet = async (id: string): Promise<Pet | null> => {
  const { data, error }: PostgrestSingleResponse<Pet> = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching pet:', error.message);
    return null;
  }

  return data;
};

// Guarda (crea o actualiza) una mascota.
// Omitimos 'id', 'user_id', 'created_at' del tipo de entrada para la creación.
export const savePet = async (
  pet: Omit<Partial<Pet>, 'id' | 'user_id' | 'created_at'> & { id?: string }
): Promise<Pet | null> => {
  if (pet.id) {
    // Actualizar mascota existente
    const { data, error }: PostgrestSingleResponse<Pet> = await supabase
      .from('pets')
      .update({
        name: pet.name,
        species: pet.species,
        photo_uri: pet.photo_uri,
      })
      .eq('id', pet.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating pet:', error.message);
    }
    return data ?? null;
  } else {
    // Crear nueva mascota
    // El user_id es añadido por la RLS policy 'WITH CHECK' o se puede añadir manualmente.
    // La DB genera el 'id' y 'created_at'.
    const { data, error }: PostgrestSingleResponse<Pet> = await supabase
      .from('pets')
      .insert(pet)
      .select()
      .single();

    if (error) {
      console.error('Error creating pet:', error.message);
    }
    return data ?? null;
  }
};

// Elimina una mascota por su ID.
// RLS asegura que el usuario solo pueda borrarla si es el propietario.
export const deletePet = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('pets').delete().eq('id', id);

  if (error) {
    console.error('Error deleting pet:', error.message);
    return false;
  }

  return true;
};