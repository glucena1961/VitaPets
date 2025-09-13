import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';

// Aprovechamos el autocompletado y la validación de tipos de TypeScript
// usando el tipo Theme que nos provee la librería.

export const lightTheme: Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac4', // 'accent' está obsoleto, se usa 'secondary'
    background: '#f6f6f6',
    surface: '#ffffff',
    onSurface: '#000000', // 'text' está obsoleto, se usa 'onSurface'
  },
};

export const darkTheme: Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#bb86fc',
    secondary: '#03dac6', // 'accent' está obsoleto, se usa 'secondary'
    background: '#121212',
    surface: '#1e1e1e',
    onSurface: '#ffffff', // 'text' está obsoleto, se usa 'onSurface'
  },
};
