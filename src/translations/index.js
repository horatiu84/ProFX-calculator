// Centralizare pentru toate traducerile
// Import toate fișierele de traduceri
import { commonTranslations } from './common';
import { menuTranslations } from './menu';
import { homeTranslations } from './home';
import { evolutieTranslations } from './evolutie';
import { investmentCalculatorTranslations } from './investmentCalculator';
import { profxbookTranslations } from './profxbook';
import { programTranslations } from './program';

// Funcție helper pentru a combina traducerile
const mergeTranslations = (...translations) => {
  const merged = { ro: {}, en: {} };
  
  translations.forEach(translation => {
    merged.ro = { ...merged.ro, ...translation.ro };
    merged.en = { ...merged.en, ...translation.en };
  });
  
  return merged;
};

// Export toate traducerile combinate
export const translations = mergeTranslations(
  commonTranslations,
  menuTranslations,
  homeTranslations,
  evolutieTranslations,
  investmentCalculatorTranslations,
  profxbookTranslations,
  programTranslations
);

// Export individual pentru debugging sau utilizare selectivă
export {
  commonTranslations,
  menuTranslations,
  homeTranslations,
  evolutieTranslations,
  investmentCalculatorTranslations,
  profxbookTranslations,
  programTranslations,
};
