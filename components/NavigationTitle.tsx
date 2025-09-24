import React from 'react';
import { type TextProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/ThemedText';

interface NavigationTitleProps extends TextProps {
  i18nKey: string;
}

/**
 * Componente reutilizable para títulos de navegación que reaccionan
 * a los cambios de idioma de i18next.
 */
const NavigationTitle = ({ i18nKey, style, ...props }: NavigationTitleProps) => {
  const { t } = useTranslation();
  return <ThemedText style={style} {...props}>{t(i18nKey)}</ThemedText>;
};

export default NavigationTitle;
