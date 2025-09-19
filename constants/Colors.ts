/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    blue: '#007AFF', // Un azul vibrante para el tema claro
    gray: '#687076', // Añadir un gris para iconos y bordes
    red: '#FF3B30', // Añadir un rojo para acciones destructivas
    card: '#FFFFFF', // Color de fondo para tarjetas/elementos de lista
    secondaryText: '#687076', // Texto secundario
    tertiaryText: '#AEAEB2', // Texto terciario
    inputBackground: '#F2F2F7', // Fondo de inputs
    inputText: '#11181C', // Texto de inputs
    inputBorder: '#C7C7CC', // Borde de inputs
    placeholderText: '#C7C7CC', // Placeholder de inputs
    border: '#C7C7CC', // Borde general
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    blue: '#0A84FF', // Un azul ligeramente más claro para el tema oscuro
    gray: '#9BA1A6', // Añadir un gris para iconos y bordes
    red: '#FF453A', // Añadir un rojo para acciones destructivas
    card: '#1C1C1E', // Color de fondo para tarjetas/elementos de lista
    secondaryText: '#8E8E93', // Texto secundario
    tertiaryText: '#636366', // Texto terciario
    inputBackground: '#2C2C2E', // Fondo de inputs
    inputText: '#ECEDEE', // Texto de inputs
    inputBorder: '#3A3A3C', // Borde de inputs
    placeholderText: '#8E8E93', // Placeholder de inputs
    border: '#3A3A3C', // Borde general
  },
};
