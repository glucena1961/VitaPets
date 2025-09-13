import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore - react-native-uuid no tiene tipos actualizados, ignoramos el error.
import uuid from 'react-native-uuid';

const PETS_STORAGE_KEY = 'VitaPet:pets';

// Definimos la estructura de una mascota para usarla en todo el servicio.
export interface Pet {
  id: string;
  photoUri?: string; // Campo opcional para la URI de la foto
  basicInfo: {
    name: string;
    species: string;
    // ... otros campos que se añadirán desde el formulario
  };
  // ... otras secciones como 'medicalInfo', etc.
}

export const getPets = async (): Promise<Pet[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PETS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error fetching pets', e);
    return [];
  }
};

export const getPet = async (id: string): Promise<Pet | null> => {
  try {
    const pets = await getPets();
    return pets.find((pet) => pet.id === id) || null;
  } catch (e) {
    console.error('Error fetching pet', e);
    return null;
  }
};

// Usamos Partial<Pet> para el parámetro porque al crear una nueva mascota,
// el 'id' no existirá todavía.
export const savePet = async (pet: Partial<Pet>): Promise<Pet | undefined> => {
  try {
    const pets = await getPets();
    if (pet.id) {
      // Update existing pet
      const index = pets.findIndex((p) => p.id === pet.id);
      if (index > -1) {
        pets[index] = pet as Pet; // Asumimos que el objeto completo está presente
      }
    } else {
      // Create new pet
      const newPet = { ...pet, id: uuid.v4() as string } as Pet;
      pets.push(newPet);
      pet = newPet; // Asignamos el nuevo objeto para devolverlo con el id
    }
    const jsonValue = JSON.stringify(pets);
    await AsyncStorage.setItem(PETS_STORAGE_KEY, jsonValue);
    return pet as Pet;
  } catch (e) {
    console.error('Error saving pet', e);
  }
};

export const deletePet = async (id: string): Promise<void> => {
  try {
    const pets = await getPets();
    const filteredPets = pets.filter((pet) => pet.id !== id);
    const jsonValue = JSON.stringify(filteredPets);
    await AsyncStorage.setItem(PETS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error deleting pet', e);
  }
};
