
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { getVetResponse } from '../services/GeminiService';
import i18n from '../lib/i18n'; // Import i18n

interface Message {
  query: string;
  response: string;
}

interface AIConversationContextType {
  conversation: Message;
  isLoading: boolean;
  setQuery: (query: string) => void;
  handleSend: () => Promise<void>;
  clearConversation: () => void;
}

const AIConversationContext = createContext<AIConversationContextType | undefined>(undefined);

export const AIConversationProvider = ({ children }: { children: ReactNode }) => {
  const [conversation, setConversation] = useState<Message>({ query: '', response: '' });
  const [isLoading, setIsLoading] = useState(false);

  const setQuery = (query: string) => {
    setConversation(prev => ({ ...prev, query }));
  };

  const handleSend = async () => {
    if (!conversation.query.trim() || isLoading) return;

    setIsLoading(true);
    setConversation(prev => ({ ...prev, response: '' }));
    try {
      const currentLanguage = i18n.language === 'es' ? 'Spanish' : 'English';
      const languageInstruction = `Please respond in ${currentLanguage}.\n\n`;
      const fullQuery = languageInstruction + conversation.query;

      const aiResponse = await getVetResponse(fullQuery);
      setConversation(prev => ({ ...prev, response: aiResponse }));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo obtener una respuesta de la IA.");
      setConversation(prev => ({ ...prev, response: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    if (isLoading) return;
    setConversation({ query: '', response: '' });
  };

  return (
    <AIConversationContext.Provider
      value={{
        conversation,
        isLoading,
        setQuery,
        handleSend,
        clearConversation,
      }}
    >
      {children}
    </AIConversationContext.Provider>
  );
};

export const useAIConversation = () => {
  const context = useContext(AIConversationContext);
  if (context === undefined) {
    throw new Error('useAIConversation must be used within a AIConversationProvider');
  }
  return context;
};
