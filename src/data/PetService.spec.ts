
import { getPets, savePet, getPet, deletePet, Pet } from './PetService';
import { supabase } from '../lib/supabase';

// Mock del cliente de Supabase - Versión Mejorada y Encadenable
const mockFns = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  eq: jest.fn(),
  single: jest.fn(),
};

jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockFns),
  },
}));

beforeEach(() => {
  // Resetear todos los mocks antes de cada prueba
  jest.clearAllMocks();
  // Asegurar que las funciones encadenables se devuelvan a sí mismas para permitir el encadenamiento
  mockFns.select.mockReturnThis();
  mockFns.insert.mockReturnThis();
  mockFns.update.mockReturnThis();
  mockFns.delete.mockReturnThis();
  mockFns.eq.mockReturnThis();
});

describe('PetService con Supabase Mock', () => {
  it('debe devolver un array vacío cuando no hay mascotas', async () => {
    mockFns.select.mockResolvedValueOnce({ data: [], error: null });
    const pets = await getPets();
    expect(supabase.from).toHaveBeenCalledWith('pets');
    expect(mockFns.select).toHaveBeenCalledWith('*');
    expect(pets).toEqual([]);
  });

  it('debe devolver una mascota por id', async () => {
    const mockPet: Pet = { id: '123', name: 'Fido', species: 'Perro', user_id: 'abc', created_at: new Date().toISOString() };
    mockFns.single.mockResolvedValueOnce({ data: mockPet, error: null });

    const pet = await getPet('123');

    expect(supabase.from).toHaveBeenCalledWith('pets');
    expect(mockFns.select).toHaveBeenCalledWith('*');
    expect(mockFns.eq).toHaveBeenCalledWith('id', '123');
    expect(mockFns.single).toHaveBeenCalled();
    expect(pet).toEqual(mockPet);
  });

  it('debe crear una nueva mascota', async () => {
    const newPetData = { name: 'Mishi', species: 'Gato' };
    const createdPet: Pet = { ...newPetData, id: '456', user_id: 'abc', created_at: new Date().toISOString() };
    mockFns.single.mockResolvedValueOnce({ data: createdPet, error: null });

    const result = await savePet(newPetData);

    expect(supabase.from).toHaveBeenCalledWith('pets');
    expect(mockFns.insert).toHaveBeenCalledWith(newPetData);
    expect(result).toEqual(createdPet);
  });

  it('debe actualizar una mascota existente', async () => {
    const petToUpdate = { id: '789', name: 'Mishifus', species: 'Gato' };
    const updatedPet: Pet = { ...petToUpdate, user_id: 'abc', created_at: new Date().toISOString() };
    mockFns.single.mockResolvedValueOnce({ data: updatedPet, error: null });

    const result = await savePet(petToUpdate);

    expect(supabase.from).toHaveBeenCalledWith('pets');
    expect(mockFns.update).toHaveBeenCalledWith({ name: 'Mishifus', species: 'Gato', photo_uri: undefined });
    expect(mockFns.eq).toHaveBeenCalledWith('id', '789');
    expect(result).toEqual(updatedPet);
  });

  it('debe eliminar una mascota', async () => {
    mockFns.eq.mockResolvedValueOnce({ error: null });

    const result = await deletePet('123');

    expect(supabase.from).toHaveBeenCalledWith('pets');
    expect(mockFns.delete).toHaveBeenCalled();
    expect(mockFns.eq).toHaveBeenCalledWith('id', '123');
    expect(result).toBe(true);
  });

  it('debe devolver null si hay un error al obtener una mascota', async () => {
    const error = { message: 'Error simulado' };
    mockFns.single.mockResolvedValueOnce({ data: null, error });

    const pet = await getPet('123');
    expect(pet).toBeNull();
  });
});
