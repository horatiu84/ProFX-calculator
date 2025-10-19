import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

// Create context
const LanguageContext = createContext();

// Custom hook pentru acces ușor
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Provider component
export const LanguageProvider = ({ children }) => {
  // Încarcă limba din localStorage sau folosește "ro" ca default
  const [language, setLanguageState] = useState(() => {
    const savedLanguage = localStorage.getItem('profx-language');
    return savedLanguage || 'ro';
  });

  // Salvează limba în localStorage când se schimbă
  useEffect(() => {
    localStorage.setItem('profx-language', language);
  }, [language]);

  // Funcție pentru schimbarea limbii
  const setLanguage = (newLanguage) => {
    if (newLanguage === 'ro' || newLanguage === 'en') {
      setLanguageState(newLanguage);
    }
  };

  // Helper function pentru acces ușor la traduceri
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const value = {
    language,
    setLanguage,
    translations: translations[language],
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
