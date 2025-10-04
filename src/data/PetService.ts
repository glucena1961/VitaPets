import { supabase } from '../lib/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

// La interfaz ahora refleja la estructura COMPLETA y PLANA de la tabla 'pets'
export interface Pet {
  id: string;
  user_id: string;
  created_at: string;
  name: string;
  species?: string;
  photo_uri?: string;
  breed?: string;
  dob?: string;
  sex?: string;
  chip_id?: string;
  weight_kg?: string;
  allergies?: string;
  medications?: string;
  special_condition?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
}

// Tipos que representan la data anidada que viene del formulario de la UI
interface PetFormInput {
  id?: string;
  photo_uri?: string;
  basicInfo?: { [key: string]: any };
  medicalInfo?: { [key: string]: any };
  ownerInfo?: { [key: string]: any };
}


// Obtiene todas las mascotas del usuario autenticado.
export const getPets = async (): Promise<Pet[]> => {
  const { data, error } = await supabase.from('pets').select('*');

  if (error) {
    console.error('Error fetching pets:', error.message);
    return [];
  }

  return data || [];
};

// Obtiene una mascota específica por su ID.
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

// Guarda (crea o actualiza) una mascota, actuando como ADAPTADOR
export const savePet = async (petInput: PetFormInput): Promise<Pet | null> => {
  // 1. Aplanar el objeto de entrada del formulario a la estructura de la DB
  const flatPetData = {
    name: petInput.basicInfo?.name,
    species: petInput.basicInfo?.species,
    breed: petInput.basicInfo?.breed,
    dob: petInput.basicInfo?.dob,
    sex: petInput.basicInfo?.sex,
    chip_id: petInput.basicInfo?.chipId,
    photo_uri: petInput.photo_uri,
    weight_kg: petInput.medicalInfo?.weightKg,
    allergies: petInput.medicalInfo?.allergies,
    medications: petInput.medicalInfo?.medications,
    special_condition: petInput.medicalInfo?.specialCondition,
    owner_name: petInput.ownerInfo?.name,
    owner_phone: petInput.ownerInfo?.phone,
    owner_email: petInput.ownerInfo?.email,
  };

  if (petInput.id) {
    // 2. Actualizar mascota existente
    const { data, error }: PostgrestSingleResponse<Pet> = await supabase
      .from('pets')
      .update(flatPetData)
      .eq('id', petInput.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating pet:', error.message);
      return null;
    }
    return data;

  } else {
    // 3. Crear nueva mascota
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated to create a pet');

    const dataToInsert = { ...flatPetData, user_id: user.id };

    const { data, error }: PostgrestSingleResponse<Pet> = await supabase
      .from('pets')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating pet:', error.message);
      return null;
    }
    return data;
  }
};

// Elimina una mascota por su ID.
export const deletePet = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('pets').delete().eq('id', id);

  if (error) {
    console.error('Error deleting pet:', error.message);
    return false;
  }

  return true;
};