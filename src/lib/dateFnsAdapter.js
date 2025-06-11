import { setDefaultOptions } from 'date-fns';
import { enUS, fr, arDZ } from 'date-fns/locale';

const locales = {
  en: enUS,
  fr: fr,
  ar: arDZ,
};

export const initDateFnsLocale = (localeIdentifier) => {
  const selectedLocale = locales[localeIdentifier] || enUS;
  setDefaultOptions({ locale: selectedLocale });
};

export const getDateFnsLocale = (localeIdentifier) => {
  return locales[localeIdentifier] || enUS;
};