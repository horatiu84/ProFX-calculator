# 🌍 Translations System - ProFX Calculator

## 📁 Structura Folderului

Acest folder conține toate traducerile aplicației, organizate modular pentru o mai bună întreținere.

```
translations/
├── index.js                      # Centralizare - combină toate traducerile
├── common.js                     # Traduceri comune (limba, etc)
├── menu.js                       # Meniul principal
├── home.js                       # Pagina Home
├── evolutie.js                   # Componenta Evolutie
├── investmentCalculator.js       # Calculator Investiții
├── profxbook.js                  # ProFXbook Analytics
├── program.js                    # Program Săptămânal
└── README.md                     # Această documentație
```

## 🎯 Cum să Adaugi Traduceri Noi

### 1. Pentru o componentă nouă

Creează un fișier nou în `translations/`, de exemplu `calculator.js`:

```javascript
// Traduceri pentru componenta Calculator
export const calculatorTranslations = {
  ro: {
    calculator: {
      title: "Calculator Lot",
      balance: "Sold cont",
      // ... alte traduceri
    },
  },
  en: {
    calculator: {
      title: "Lot Calculator",
      balance: "Account Balance",
      // ... alte traduceri
    },
  },
};
```

### 2. Importă în `index.js`

```javascript
import { calculatorTranslations } from './calculator';

export const translations = mergeTranslations(
  commonTranslations,
  menuTranslations,
  // ... alte traduceri existente
  calculatorTranslations  // ← Adaugă aici
);
```

### 3. Folosește în componentă

```javascript
import { useLanguage } from '../contexts/LanguageContext';

function Calculator() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('calculator.title')}</h1>
      <label>{t('calculator.balance')}</label>
    </div>
  );
}
```

## 📝 Convenții

### Naming
- **Fișiere**: `numeComponenta.js` (camelCase)
- **Export**: `numeComponentaTranslations` (camelCase + "Translations")
- **Chei**: folosește puncte pentru nested objects: `'menu.home'`, `'calculator.balance'`

### Structură
```javascript
export const componentaTranslations = {
  ro: {
    componenta: {
      // traduceri în română
    },
  },
  en: {
    componenta: {
      // traduceri în engleză
    },
  },
};
```

## ✅ Avantaje ale acestei structuri

1. **Organizare** - fiecare componentă are propriul fișier
2. **Scalabilitate** - poți adăuga limbi noi ușor
3. **Performanță** - posibilitate de lazy loading în viitor
4. **Colaborare** - fiecare dezvoltator lucrează pe fișierul său
5. **Mentenanță** - găsești rapid traducerile
6. **Un singur Context** - API-ul rămâne simplu (`useLanguage()`, `t('key')`)

## 🔍 Găsirea traducerilor

Pentru a găsi unde e definită o traducere:
1. Identifică categoria (menu, home, calculator, etc)
2. Deschide fișierul corespunzător
3. Caută cheia în obiectul `ro` sau `en`

## 🚀 Extindere viitoare

Dacă vrei să adaugi o limbă nouă (ex: germană):

```javascript
// În fiecare fișier de traduceri
export const menuTranslations = {
  ro: { /* română */ },
  en: { /* engleză */ },
  de: { /* germană */ },  // ← Adaugă aici
};
```

## 📞 Contact

Pentru întrebări sau sugestii despre sistemul de traduceri, contactează echipa de development.
