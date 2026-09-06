import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeLanguage } from './config';

export function LocaleHygiene() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = normalizeLanguage(i18n.language);
    document.title = t('meta.title');
  }, [i18n.language, t]);

  return null;
}