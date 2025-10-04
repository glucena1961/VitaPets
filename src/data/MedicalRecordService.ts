import { supabase } from '../lib/supabase';

// --- INTERFACES Y TIPOS (sin cambios) ---

export type MedicalRecordType = 'allergy' | 'vaccine' | 'surgery' | 'exam' | 'parasite_treatment' | 'medicine';

export interface AllergyDetails {
  name: string;
  vet?: string;
  clinic?: string;
}

export interface SurgeryDetails {
  name:string;
  vet?: string;
  clinic?: string;
  notes?: string;
}

export interface ExamDetails {
  name: string;
  vet?: string;
  clinic?: string;
  results?: string;
  attachmentUri?: string;
}

export interface MedicineDetails {
  name: string;
  dose: string;
  duration: string;
  notes?: string;
}

export interface ParasiteTreatmentDetails {
  name: string;
  lastDoseDate: string;
  nextDoseDate: string;
  notes?: string;
}

export interface VaccineDetails {
  name: string;
  nextDoseDate: string;
  lot?: string;
}

export interface BaseMedicalRecord {
  id: string;
  pet_id: string;
  user_id: string;
  created_at: string;
  type: MedicalRecordType;
  date: string;
}

export interface AllergyRecord extends BaseMedicalRecord {
  type: 'allergy';
  details: AllergyDetails;
}

export interface SurgeryRecord extends BaseMedicalRecord {
  type: 'surgery';
  details: SurgeryDetails;
}

export interface ExamRecord extends BaseMedicalRecord {
  type: 'exam';
  details: ExamDetails;
}

export interface MedicineRecord extends BaseMedicalRecord {
  type: 'medicine';
  details: MedicineDetails;
}

export interface ParasiteTreatmentRecord extends BaseMedicalRecord {
  type: 'parasite_treatment';
  details: ParasiteTreatmentDetails;
}

export interface VaccineRecord extends BaseMedicalRecord {
  type: 'vaccine';
  details: VaccineDetails;
}

export type MedicalRecord = AllergyRecord | SurgeryRecord | ExamRecord | MedicineRecord | ParasiteTreatmentRecord | VaccineRecord;


// --- FUNCIONES DEL SERVICIO (Refactorizadas para Supabase) ---

/**
 * Obtiene todos los registros médicos para una mascota específica, ordenados por fecha.
 */
export const getMedicalRecords = async (petId: string): Promise<MedicalRecord[]> => {
  const { data, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('pet_id', petId)
    .order('date', { ascending: false });

  if (error) {
    console.error(`Error fetching medical records for pet ${petId}:`, error.message);
    return [];
  }
  return data as MedicalRecord[] || [];
};

/**
 * Guarda un nuevo registro médico para una mascota.
 */
export const saveMedicalRecord = async (
  petId: string,
  record: Omit<MedicalRecord, 'id' | 'pet_id' | 'user_id' | 'created_at'>
): Promise<MedicalRecord | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('medical_records')
    .insert({ ...record, pet_id: petId, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error(`Error saving medical record for pet ${petId}:`, error.message);
    return null;
  }
  return data as MedicalRecord | null;
};

/**
 * Elimina un registro médico específico.
 */
export const deleteMedicalRecord = async (recordId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('medical_records')
    .delete()
    .eq('id', recordId);

  if (error) {
    console.error(`Error deleting medical record ${recordId}:`, error.message);
    return false;
  }
  return true;
};

/**
 * Actualiza un registro médico existente.
 */
export const updateMedicalRecord = async (
  recordId: string,
  updates: Partial<Omit<MedicalRecord, 'id' | 'pet_id' | 'user_id' | 'created_at'>>
): Promise<MedicalRecord | null> => {
  const { data, error } = await supabase
    .from('medical_records')
    .update(updates)
    .eq('id', recordId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating medical record ${recordId}:`, error.message);
    return null;
  }
  return data as MedicalRecord | null;
};