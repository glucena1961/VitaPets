import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { DiaryEntry, DiaryService } from '../data/DiaryService';

interface DiaryContextType {
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => Promise<void>;
  updateDiaryEntry: (entry: DiaryEntry) => Promise<void>;
  deleteDiaryEntry: (id: string) => Promise<void>;
  isLoading: boolean;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

interface DiaryProviderProps {
  children: ReactNode;
}

export const DiaryProvider: React.FC<DiaryProviderProps> = ({ children }) => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDiaryEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const entries = await DiaryService.getDiaryEntries();
      setDiaryEntries(entries);
    } catch (error) {
      console.error('Failed to load diary entries', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiaryEntries();
  }, [loadDiaryEntries]);

  const addDiaryEntry = useCallback(async (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
    try {
      await DiaryService.saveDiaryEntry(entry);
      await loadDiaryEntries(); // RELOAD the list
    } catch (error) {
      console.error('Failed to add diary entry', error);
      throw error;
    }
  }, [loadDiaryEntries]);

  const updateDiaryEntry = useCallback(async (entry: DiaryEntry) => {
    try {
      // Correctly pass id and updates to the service
      await DiaryService.updateDiaryEntry(entry.id, entry);
      await loadDiaryEntries(); // RELOAD the list
    } catch (error) {
      console.error('Failed to update diary entry', error);
      throw error;
    }
  }, [loadDiaryEntries]);

  const deleteDiaryEntry = useCallback(async (id: string) => {
    try {
      await DiaryService.deleteDiaryEntry(id);
      await loadDiaryEntries(); // RELOAD the list
    } catch (error) {
      console.error('Failed to delete diary entry', error);
      throw error;
    }
  }, [loadDiaryEntries]);

  const value = {
    diaryEntries,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    isLoading,
  };

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};
