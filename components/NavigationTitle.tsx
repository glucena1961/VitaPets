import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useTranslation } from 'react-i18next';

interface NavigationTitleProps extends TextProps {
  i18nKey: string;
}

/**
 * Componente reutilizable para títulos de navegación que reaccionan
 * a los cambios de idioma de i18next.
 */
const NavigationTitle = ({ i18nKey, style, ...props }: NavigationTitleProps) => {
  const { t } = useTranslation();
  return <Text style={style} {...props}>{t(i18nKey)}</Text>;
};

export default NavigationTitle;
