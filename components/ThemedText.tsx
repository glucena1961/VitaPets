import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useFontSize } from '../src/contexts/FontSizeContext'; // Importar useFontSize

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const { getFontSizeIncrement } = useFontSize(); // Usar el hook de tamaño de fuente

  const dynamicStyles = StyleSheet.create({
    default: {
      fontSize: getFontSizeIncrement(16),
      lineHeight: getFontSizeIncrement(24),
    },
    defaultSemiBold: {
      fontSize: getFontSizeIncrement(16),
      lineHeight: getFontSizeIncrement(24),
      fontWeight: '600',
    },
    title: {
      fontSize: getFontSizeIncrement(24),
      lineHeight: getFontSizeIncrement(24),
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: getFontSizeIncrement(20),
      fontWeight: 'bold',
    },
    link: {
      lineHeight: getFontSizeIncrement(30),
      fontSize: getFontSizeIncrement(16),
      color: '#0a7ea4',
    },
  });

  return (
    <Text
      style={[
        { color },
        type === 'default' ? dynamicStyles.default : undefined,
        type === 'title' ? dynamicStyles.title : undefined,
        type === 'defaultSemiBold' ? dynamicStyles.defaultSemiBold : undefined,
        type === 'subtitle' ? dynamicStyles.subtitle : undefined,
        type === 'link' ? dynamicStyles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

