import { getPets, savePet, getPet, deletePet, Pet } from './PetService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock de AsyncStorage para aislar las pruebas del almacenamiento real del dispositivo
beforeEach(async () => {
  // Limpiamos el mock de AsyncStorage antes de cada prueba
  await AsyncStorage.clear();
});

describe('PetService', () => {
  it('debe devolver un array vacío cuando no hay mascotas', async () => {
    const pets = await getPets();
    expect(pets).toEqual([]);
  });

  it('debe guardar una mascota y poder recuperarla', async () => {
    const mockPet: Partial<Pet> = {
      basicInfo: { name: 'Fido', species: 'Perro' },
    };

    const savedPet = await savePet(mockPet);

    // Verificamos que la mascota guardada tenga un id
    expect(savedPet).toBeDefined();
    expect(savedPet?.id).toBeDefined();

    const retrievedPet = await getPet(savedPet!.id);

    // Verificamos que la mascota recuperada sea la misma que guardamos
    expect(retrievedPet).toBeDefined();
    expect(retrievedPet?.basicInfo.name).toBe('Fido');
  });

  it('debe actualizar una mascota existente', async () => {
    const mockPet: Partial<Pet> = {
      basicInfo: { name: 'Mishi', species: 'Gato' },
    };
    const savedPet = await savePet(mockPet);
    
    const updatedPetData = { ...savedPet, basicInfo: { ...savedPet!.basicInfo, name: 'Mishifus' } };

    await savePet(updatedPetData);
    const retrievedPet = await getPet(savedPet!.id);

    expect(retrievedPet?.basicInfo.name).toBe('Mishifus');
  });

  it('debe eliminar una mascota', async () => {
    const mockPet: Partial<Pet> = {
      basicInfo: { name: 'Nemo', species: 'Pez' },
    };
    const savedPet = await savePet(mockPet);
    expect(savedPet).toBeDefined();

    await deletePet(savedPet!.id);
    const retrievedPet = await getPet(savedPet!.id);

    expect(retrievedPet).toBeNull();
  });
});
