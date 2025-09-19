
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore - react-native-uuid no tiene tipos actualizados
import uuid from 'react-native-uuid';

// --- INTERFACES Y TIPOS ---

// Define los tipos de registros médicos que manejaremos
export type MedicalRecordType = 'allergy' | 'vaccine' | 'surgery' | 'exam' | 'parasite_treatment' | 'medicine';

// --- Definiciones de Detalles ---

// Define la estructura de los detalles específicos para una alergia
export interface AllergyDetails {
  name: string;
  vet?: string;
  clinic?: string;
}

// Define la estructura de los detalles para una cirugía
export interface SurgeryDetails {
  name: string;
  vet?: string;
  clinic?: string;
  notes?: string;
}

// Define la estructura de los detalles para un examen
export interface ExamDetails {
  name: string;
  vet?: string;
  clinic?: string;
  results?: string;
  attachmentUri?: string;
}

// --- Definiciones de Registros ---

// Estructura base para cualquier registro médico
export interface BaseMedicalRecord {
  id: string; // ID único del registro
  petId: string; // ID de la mascota a la que pertenece
  type: MedicalRecordType; // El tipo de registro
  date: string; // Fecha del registro
}

// Registro de Alergia
export interface AllergyRecord extends BaseMedicalRecord {
  type: 'allergy';
  details: AllergyDetails;
}

// Registro de Cirugía
export interface SurgeryRecord extends BaseMedicalRecord {
  type: 'surgery';
  details: SurgeryDetails;
}

// Registro de Examen
export interface ExamRecord extends BaseMedicalRecord {
  type: 'exam';
  details: ExamDetails;
}

// Unión de todos los tipos de registros médicos posibles
export type MedicalRecord = AllergyRecord | SurgeryRecord | ExamRecord;


// --- FUNCIONES DEL SERVICIO ---

/**
 * Genera la clave única de almacenamiento para los registros médicos de una mascota.
 * @param petId El ID de la mascota.
 * @returns La clave para AsyncStorage (ej. 'VitaPet:medical-records:123-abc')
 */
const getStorageKey = (petId: string) => `VitaPet:medical-records:${petId}`;

/**
 * Obtiene todos los registros médicos para una mascota específica.
 * @param petId El ID de la mascota.
 * @returns Una promesa que se resuelve en un array de registros médicos.
 */
export const getMedicalRecords = async (petId: string): Promise<MedicalRecord[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(getStorageKey(petId));
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error fetching medical records for pet', petId, e);
    return [];
  }
};

/**
 * Guarda un nuevo registro médico para una mascota.
 * @param petId El ID de la mascota.
 * @param record El objeto de registro médico (sin id ni petId, se añaden aquí).
 * @returns Una promesa que se resuelve en el nuevo registro médico con su ID.
 */
export const saveMedicalRecord = async (
  petId: string,
  record: Omit<MedicalRecord, 'id' | 'petId'>
): Promise<MedicalRecord> => {
  try {
    const records = await getMedicalRecords(petId);
    const newRecord = {
      ...record,
      id: uuid.v4() as string,
      petId: petId,
    } as MedicalRecord;

    records.push(newRecord);
    
    const jsonValue = JSON.stringify(records);
    await AsyncStorage.setItem(getStorageKey(petId), jsonValue);
    
    console.log(`Nuevo registro médico guardado para la mascota ${petId}:`, newRecord);
    return newRecord;
  } catch (e) {
    console.error('Error saving medical record for pet', petId, e);
    throw e; // Relanzamos el error para que el formulario pueda manejarlo
  }
};

/**
 * Elimina un registro médico específico.
 * @param petId El ID de la mascota a la que pertenece el registro.
 * @param recordId El ID del registro médico a eliminar.
 * @returns Una promesa que se resuelve cuando la operación se completa.
 */
export const deleteMedicalRecord = async (petId: string, recordId: string): Promise<void> => {
  try {
    const records = await getMedicalRecords(petId);
    const filteredRecords = records.filter((record) => record.id !== recordId);
    const jsonValue = JSON.stringify(filteredRecords);
    await AsyncStorage.setItem(getStorageKey(petId), jsonValue);
    console.log(`Registro médico ${recordId} eliminado para la mascota ${petId}`);
  } catch (e) {
    console.error('Error deleting medical record', recordId, e);
    throw e;
  }
};

/**
 * Actualiza un registro médico existente.
 * @param petId El ID de la mascota.
 * @param updatedRecord El objeto de registro completo, incluyendo su ID.
 * @returns Una promesa que se resuelve con el registro actualizado.
 */
export const updateMedicalRecord = async (petId: string, updatedRecord: MedicalRecord): Promise<MedicalRecord> => {
  try {
    const records = await getMedicalRecords(petId);
    const recordIndex = records.findIndex((record) => record.id === updatedRecord.id);

    if (recordIndex === -1) {
      throw new Error("Record not found for updating");
    }

    records[recordIndex] = updatedRecord;

    const jsonValue = JSON.stringify(records);
    await AsyncStorage.setItem(getStorageKey(petId), jsonValue);

    console.log(`Registro médico ${updatedRecord.id} actualizado para la mascota ${petId}`);
    return updatedRecord;
  } catch (e) {
    console.error('Error updating medical record', updatedRecord.id, e);
    throw e;
  }
};
