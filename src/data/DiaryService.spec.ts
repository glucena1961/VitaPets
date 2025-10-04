import { DiaryService, DiaryEntry } from './DiaryService';
import { supabase } from '../lib/supabase';

// Mock del cliente de Supabase - Versión Definitiva
const mockFns = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  eq: jest.fn(),
  single: jest.fn(),
  order: jest.fn(),
  neq: jest.fn(),
};

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockFns),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  // Configurar todas las funciones para que devuelvan el mismo objeto, permitiendo el encadenamiento.
  Object.values(mockFns).forEach(mockFn => {
    mockFn.mockReturnThis();
  });
});

describe('DiaryService con Supabase Mock', () => {
  it('debe obtener todas las entradas del diario, ordenadas', async () => {
    const mockEntries: DiaryEntry[] = [
      { id: '1', title: 'Test 1', date: '2025-10-04', content: '...', user_id: 'u1', created_at: '...', location: 'loc1', sentiment: 'happy' },
    ];
    // La última función en la cadena (.order) es la que debe resolver la promesa.
    mockFns.order.mockResolvedValueOnce({ data: mockEntries, error: null });

    const entries = await DiaryService.getDiaryEntries();

    expect(supabase.from).toHaveBeenCalledWith('diary_entries');
    expect(mockFns.select).toHaveBeenCalledWith('*');
    expect(mockFns.order).toHaveBeenCalledWith('date', { ascending: false });
    expect(entries).toEqual(mockEntries);
  });

  it('debe guardar una nueva entrada', async () => {
    const newEntryData = { title: 'Nuevo Día', content: 'Contenido', date: '2025-10-05' };
    const createdEntry: DiaryEntry = { ...newEntryData, id: '2', user_id: 'u1', created_at: '...' };
    // La última función en la cadena (.single) resuelve la promesa.
    mockFns.single.mockResolvedValueOnce({ data: createdEntry, error: null });

    const result = await DiaryService.saveDiaryEntry(newEntryData);

    expect(supabase.from).toHaveBeenCalledWith('diary_entries');
    expect(mockFns.insert).toHaveBeenCalledWith(newEntryData);
    expect(result).toEqual(createdEntry);
  });

  it('debe actualizar una entrada existente', async () => {
    const updates = { title: 'Título Actualizado' };
    const updatedEntry: DiaryEntry = { id: '1', title: 'Título Actualizado', date: '2025-10-04', content: '...', user_id: 'u1', created_at: '...' };
    mockFns.single.mockResolvedValueOnce({ data: updatedEntry, error: null });

    const result = await DiaryService.updateDiaryEntry('1', updates);

    expect(supabase.from).toHaveBeenCalledWith('diary_entries');
    expect(mockFns.update).toHaveBeenCalledWith(updates);
    expect(mockFns.eq).toHaveBeenCalledWith('id', '1');
    expect(result).toEqual(updatedEntry);
  });

  it('debe eliminar una entrada', async () => {
    // La última función en la cadena (.eq) resuelve la promesa.
    mockFns.eq.mockResolvedValueOnce({ error: null });

    const result = await DiaryService.deleteDiaryEntry('1');

    expect(supabase.from).toHaveBeenCalledWith('diary_entries');
    expect(mockFns.delete).toHaveBeenCalled();
    expect(mockFns.eq).toHaveBeenCalledWith('id', '1');
    expect(result).toBe(true);
  });

  it('debe devolver null si hay un error al guardar', async () => {
    const error = { message: 'Error de Inserción' };
    mockFns.single.mockResolvedValueOnce({ data: null, error });

    const result = await DiaryService.saveDiaryEntry({ title: 'T', content: 'C', date: '2025-01-01' });
    expect(result).toBeNull();
  });
});