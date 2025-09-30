import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DiaryEntry {
  id: string;
  title: string;
  date: string;
  location: string;
  content: string;
  sentiment: string;
  createdAt: string;
}

const DIARY_STORAGE_KEY = '@VitaPet:diaryEntries';

export const DiaryService = {
  async getDiaryEntries(): Promise<DiaryEntry[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(DIARY_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error getting diary entries', e);
      return [];
    }
  },

  async saveDiaryEntry(entry: Omit<DiaryEntry, 'id' | 'createdAt'>): Promise<DiaryEntry[]> {
    try {
      const currentEntries = await this.getDiaryEntries();
      const newEntry: DiaryEntry = {
        id: Date.now().toString(), // Simple unique ID
        createdAt: new Date().toISOString(),
        ...entry,
      };
      const updatedEntries = [...currentEntries, newEntry];
      await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(updatedEntries));
      return updatedEntries;
    } catch (e) {
      console.error('Error saving diary entry', e);
      throw e; // Re-throw to handle in UI
    }
  },

  // Optional: Add update and delete functions later if needed
  async updateDiaryEntry(updatedEntry: DiaryEntry): Promise<DiaryEntry[]> {
    try {
      const currentEntries = await this.getDiaryEntries();
      const updatedEntries = currentEntries.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      );
      await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(updatedEntries));
      return updatedEntries;
    } catch (e) {
      console.error('Error updating diary entry', e);
      throw e;
    }
  },

  async deleteDiaryEntry(id: string): Promise<DiaryEntry[]> {
    try {
      const currentEntries = await this.getDiaryEntries();
      const updatedEntries = currentEntries.filter(entry => entry.id !== id);
      await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(updatedEntries));
      return updatedEntries;
    } catch (e) {
      console.error('Error deleting diary entry', e);
      throw e;
    }
  },

  async clearAllDiaryEntries(): Promise<void> {
    try {
      await AsyncStorage.removeItem(DIARY_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing all diary entries', e);
      throw e;
    }
  },
};
