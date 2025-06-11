import { enUS, fr, arDZ } from 'date-fns/locale';

const localeMap = {
  en: enUS,
  fr: fr,
  ar: arDZ,
};

export const getDateFnsLocale = (appLocale) => {
  return localeMap[appLocale] || enUS; 
};