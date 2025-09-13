import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore - react-native-uuid no tiene tipos actualizados, ignoramos el error.
import uuid from 'react-native-uuid';

const APPOINTMENTS_STORAGE_KEY = 'VitaPet:appointments';

// Definimos la estructura de una cita
export interface Appointment {
  id: string;
  petId: string; // Clave foránea para asociar con una mascota
  date: string; // Opcionalmente, podría ser un objeto Date
  type: 'Vaccine' | 'Deworming' | 'MedicalVisit'; // Tipo de cita
  notes: string;
}

export const getAppointments = async (petId: string): Promise<Appointment[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const allAppointments: Appointment[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    // Filtra las citas que corresponden al ID de la mascota
    return allAppointments.filter(appt => appt.petId === petId);
  } catch (e) {
    console.error('Error fetching appointments', e);
    return [];
  }
};

export const saveAppointment = async (appointment: Partial<Appointment>): Promise<Appointment | undefined> => {
  try {
    const jsonValue = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const allAppointments: Appointment[] = jsonValue != null ? JSON.parse(jsonValue) : [];

    if (appointment.id) {
      // Actualizar cita existente
      const index = allAppointments.findIndex((a) => a.id === appointment.id);
      if (index > -1) {
        allAppointments[index] = appointment as Appointment;
      }
    } else {
      // Crear nueva cita
      const newAppointment = { ...appointment, id: uuid.v4() as string } as Appointment;
      allAppointments.push(newAppointment);
      appointment = newAppointment;
    }
    const newJsonValue = JSON.stringify(allAppointments);
    await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, newJsonValue);
    return appointment as Appointment;
  } catch (e) {
    console.error('Error saving appointment', e);
  }
};

export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    const jsonValue = await AsyncStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const allAppointments: Appointment[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    const filteredAppointments = allAppointments.filter((appt) => appt.id !== id);
    const newJsonValue = JSON.stringify(filteredAppointments);
    await AsyncStorage.setItem(APPOINTMENTS_STORAGE_KEY, newJsonValue);
  } catch (e) {
    console.error('Error deleting appointment', e);
  }
};
