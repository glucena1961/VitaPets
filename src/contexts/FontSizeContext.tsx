import React, { createContext, useState, useContext, ReactNode } from 'react';

type FontSize = 'normal' | 'medium' | 'large';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  getFontSizeIncrement: (baseSize: number) => number;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

interface FontSizeProviderProps {
  children: ReactNode;
}

export const FontSizeProvider = ({ children }: FontSizeProviderProps) => {
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  console.log('FontSizeProvider initialized with fontSize:', fontSize); // Debug log

  const handleSetFontSize = (size: FontSize) => {
    console.log('setFontSize called with:', size); // Debug log
    setFontSize(size);
  };

  const getFontSizeIncrement = (baseSize: number): number => {
    let newSize = baseSize;
    switch (fontSize) {
      case 'normal':
        newSize = baseSize;
        break;
      case 'medium':
        newSize = baseSize + 2;
        break;
      case 'large':
        newSize = baseSize + 4;
        break;
    }
    console.log(`Calculating font size for base ${baseSize} with current fontSize ${fontSize}: ${newSize}`); // Debug log
    return newSize;
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize: handleSetFontSize, getFontSizeIncrement }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    console.error('useFontSize must be used within a FontSizeProvider'); // Debug log
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
