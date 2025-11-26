// Centralizare pentru toate traducerile
// Import toate fișierele de traduceri
import { commonTranslations } from './common';
import { menuTranslations } from './menu';
import { homeTranslations } from './home';
import { evolutieTranslations } from './evolutie';
import { investmentCalculatorTranslations } from './investmentCalculator';
import { profxbookTranslations } from './profxbook';
import { profxDoctor } from './profxDoctor';
import { programTranslations } from './program';
import { calculatorTranslations } from './calculator';
import { stiriTranslations } from './stiri';
import { galerieTranslations } from './galerie';
import { formularFeedbackTranslations } from './formularFeedback';
import { formularConcursTranslations } from './formularConcurs';
import { competitieTranslations } from './competitie';
import { howToTranslations } from './howTo';
import { testTranslations } from './test';
import { jurnalTranslations } from './jurnal';
import { educatieTranslations } from './educatie';
import { trainingTranslations } from './training';
import { flipcardTranslations } from './flipcard';
import { bibliaTranslations } from './biblia';
import { caruselTranslations } from './carusel';

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
  profxDoctor,
  programTranslations,
  calculatorTranslations,
  stiriTranslations,
  galerieTranslations,
  formularFeedbackTranslations,
  formularConcursTranslations,
  competitieTranslations,
  howToTranslations,
  testTranslations,
  jurnalTranslations,
  educatieTranslations,
  trainingTranslations,
  flipcardTranslations,
  bibliaTranslations,
  caruselTranslations
);

// Export individual pentru debugging sau utilizare selectivă
export {
  commonTranslations,
  menuTranslations,
  homeTranslations,
  evolutieTranslations,
  investmentCalculatorTranslations,
  profxbookTranslations,
  profxDoctor,
  programTranslations,
  calculatorTranslations,
  stiriTranslations,
  galerieTranslations,
  formularFeedbackTranslations,
  formularConcursTranslations,
  competitieTranslations,
  howToTranslations,
  testTranslations,
  jurnalTranslations,
  educatieTranslations,
  trainingTranslations,
  flipcardTranslations,
  bibliaTranslations,
  caruselTranslations,
};
