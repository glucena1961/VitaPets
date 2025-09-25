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

  const handleSetFontSize = (size: FontSize) => {
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
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
