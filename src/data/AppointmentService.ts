import { supabase } from '../lib/supabase';

// Estructura de una cita, alineada con la tabla de Supabase
export interface Appointment {
  id: string;
  pet_id: string;
  user_id: string;
  created_at: string;
  date: string; // TIMESTAMPTZ se maneja como string en JS
  type: 'Vaccine' | 'Deworming' | 'MedicalVisit';
  notes: string;
}

/**
 * Obtiene todas las citas para una mascota específica.
 */
export const getAppointments = async (petId: string): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('pet_id', petId)
    .order('date', { ascending: false });

  if (error) {
    console.error(`Error fetching appointments for pet ${petId}:`, error.message);
    return [];
  }
  return data || [];
};

/**
 * Guarda una nueva cita para una mascota.
 */
export const saveAppointment = async (
  appointment: Omit<Appointment, 'id' | 'user_id' | 'created_at'>
): Promise<Appointment | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...appointment, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Error saving appointment:', error.message);
    return null;
  }
  return data;
};

/**
 * Actualiza una cita existente.
 */
export const updateAppointment = async (
  appointmentId: string,
  updates: Partial<Omit<Appointment, 'id' | 'pet_id' | 'user_id' | 'created_at'>>
): Promise<Appointment | null> => {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating appointment ${appointmentId}:`, error.message);
    return null;
  }
  return data;
};

/**
 * Elimina una cita específica.
 */
export const deleteAppointment = async (appointmentId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId);

  if (error) {
    console.error(`Error deleting appointment ${appointmentId}:`, error.message);
    return false;
  }
  return true;
};