import {
  getMedicalRecords,
  saveMedicalRecord,
  deleteMedicalRecord,
  updateMedicalRecord,
  AllergyRecord,
  MedicalRecord
} from './MedicalRecordService';
import { supabase } from '../lib/supabase';

// Mock del cliente de Supabase
const mockFns = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  eq: jest.fn(),
  single: jest.fn(),
  order: jest.fn(),
};

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockFns),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  // Asegurar encadenamiento
  Object.values(mockFns).forEach(mockFn => mockFn.mockReturnThis());
});

describe('MedicalRecordService con Supabase Mock', () => {
  const mockPetId = 'pet-123';
  const mockUserId = 'user-abc';
  const mockAllergyRecord: AllergyRecord = {
    id: 'rec-abc',
    pet_id: mockPetId,
    user_id: mockUserId,
    created_at: new Date().toISOString(),
    type: 'allergy',
    date: '2025-10-04',
    details: { name: 'Polen' },
  };

  it('debe obtener los registros médicos para una mascota', async () => {
    mockFns.order.mockResolvedValueOnce({ data: [mockAllergyRecord], error: null });

    const records = await getMedicalRecords(mockPetId);

    expect(supabase.from).toHaveBeenCalledWith('medical_records');
    expect(mockFns.select).toHaveBeenCalledWith('*');
    expect(mockFns.eq).toHaveBeenCalledWith('pet_id', mockPetId);
    expect(mockFns.order).toHaveBeenCalledWith('date', { ascending: false });
    expect(records).toEqual([mockAllergyRecord]);
  });

  it('debe guardar un nuevo registro médico', async () => {
    const newRecordData: Omit<MedicalRecord, 'id' | 'pet_id' | 'user_id' | 'created_at'> = {
      type: 'surgery',
      date: '2025-10-05',
      details: { name: 'Esterilización' },
    };
    const savedRecord = { ...newRecordData, id: 'rec-def', pet_id: mockPetId, user_id: mockUserId, created_at: '...' };
    mockFns.single.mockResolvedValueOnce({ data: savedRecord, error: null });

    const result = await saveMedicalRecord(mockPetId, newRecordData);

    expect(supabase.from).toHaveBeenCalledWith('medical_records');
    expect(mockFns.insert).toHaveBeenCalledWith({ ...newRecordData, pet_id: mockPetId });
    expect(result).toEqual(savedRecord);
  });

  it('debe eliminar un registro médico', async () => {
    mockFns.eq.mockResolvedValueOnce({ error: null });

    const result = await deleteMedicalRecord('rec-abc');

    expect(supabase.from).toHaveBeenCalledWith('medical_records');
    expect(mockFns.delete).toHaveBeenCalled();
    expect(mockFns.eq).toHaveBeenCalledWith('id', 'rec-abc');
    expect(result).toBe(true);
  });

  it('debe actualizar un registro médico', async () => {
    const updates = { date: '2025-10-06' };
    const updatedRecord = { ...mockAllergyRecord, ...updates };
    mockFns.single.mockResolvedValueOnce({ data: updatedRecord, error: null });

    const result = await updateMedicalRecord('rec-abc', updates);

    expect(supabase.from).toHaveBeenCalledWith('medical_records');
    expect(mockFns.update).toHaveBeenCalledWith(updates);
    expect(mockFns.eq).toHaveBeenCalledWith('id', 'rec-abc');
    expect(result).toEqual(updatedRecord);
  });

  it('debe devolver un array vacío si hay un error al obtener registros', async () => {
    mockFns.order.mockResolvedValueOnce({ data: null, error: new Error('DB Error') });
    const records = await getMedicalRecords(mockPetId);
    expect(records).toEqual([]);
  });
});
