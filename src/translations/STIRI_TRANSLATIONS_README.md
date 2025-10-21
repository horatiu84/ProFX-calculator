# Sistem de Traduceri pentru Componenta Stiri

## Structură

Componenta Stiri (News) folosește un sistem complet de traduceri pentru română (RO) și engleză (EN).

### Fișiere implicate:

1. **src/translations/stiri.js** - Conține traducerile pentru interfață
2. **src/data/newsData.js** - Conține articolele de știri cu traduceri
3. **src/Stiri.jsx** - Componenta principală
4. **src/components/NewsCard.jsx** - Card pentru preview articol
5. **src/components/NewsModal.jsx** - Modal pentru articol complet

## Cum funcționează

### 1. Traduceri UI (stiri.js)

```javascript
export const stiriTranslations = {
  ro: {
    stiri: {
      pageTitle: "Știri & Noutăți",
      readMore: "Citește mai mult",
      // ... alte traduceri
    }
  },
  en: {
    stiri: {
      pageTitle: "News & Updates",
      readMore: "Read more",
      // ... alte traduceri
    }
  }
};
```

**Utilizare în componente:**
```javascript
const { translations } = useLanguage();
const t = translations.stiri;

<h1>{t.pageTitle}</h1>
<button>{t.readMore}</button>
```

### 2. Traduceri Articole (newsData.js)

Fiecare articol are câmpuri separate pentru RO și EN:

```javascript
{
  id: 1,
  title: {
    ro: "Prețul aurului...",
    en: "Gold price..."
  },
  date: {
    ro: "21 Octombrie 2025",
    en: "October 21, 2025"
  },
  content: {
    ro: `Text în română...`,
    en: `Text in English...`
  },
  // ... alte câmpuri
}
```

### 3. Funcția Helper: getLocalizedField()

Definită în **Stiri.jsx** și transmisă la componentele copil:

```javascript
const getLocalizedField = (field) => {
  if (typeof field === 'object' && field !== null) {
    return field[language] || field.ro;
  }
  return field;
};
```

**Utilizare:**
```javascript
<h3>{getLocalizedField(news.title)}</h3>
<p>{getLocalizedField(news.excerpt)}</p>
```

## Adăugarea unui nou articol

Pentru a adăuga un nou articol tradus:

```javascript
{
  id: 5, // ID unic
  title: {
    ro: "Titlu în română",
    en: "Title in English"
  },
  date: {
    ro: "Data în română",
    en: "Date in English"
  },
  category: "Metale Prețioase", // Categoria se traduce automat din stiri.js
  image: "https://...", // URL imagine
  excerpt: {
    ro: "Scurt rezumat în română...",
    en: "Short summary in English..."
  },
  content: {
    ro: `**Conținut complet în română**
    
Folosește **bold** pentru text îngroșat.

• Bullet points funcționează
• Automat în ambele limbi`,
    en: `**Full content in English**
    
Use **bold** for bold text.

• Bullet points work
• Automatically in both languages`
  },
  tags: ["Tag1", "Tag2", "Tag3"], // Tag-urile rămân la fel în ambele limbi
  author: {
    ro: "Echipa ProFX",
    en: "ProFX Team"
  },
  importance: "high" // "high" sau omis
}
```

## Categorii disponibile

Categoriile sunt traduse automat în `stiri.js`:

- **Metale Prețioase** → Precious Metals
- **Forex** → Forex
- **Cripto** → Crypto
- **Acțiuni** → Stocks
- **Economie** → Economy

## Formatare Text

Conținutul articolelor suportă:

1. **Text bold**: `**text îngroșat**`
2. **Titluri**: O linie întreagă cu `**Titlu**`
3. **Bullet points**: Încep cu `• `

**Exemplu:**
```markdown
**Titlu Principal**

Paragraph normal cu **cuvinte bold** în mijloc.

**Listă de puncte:**

• **Primul punct** cu text bold
• Al doilea punct normal
• **Al treilea punct**
```

## Animații

Componenta folosește animația `animate-language-change` pentru tranziții smooth când se schimbă limba.

Definită în **index.css**:
```css
@keyframes languageTransition {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-language-change {
  animation: languageTransition 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Flux de Date

```
User schimbă limba → LanguageContext actualizează state
    ↓
Stiri.jsx primește language din context
    ↓
getLocalizedField() selectează textul corect (ro/en)
    ↓
Props transmise la NewsCard și NewsModal
    ↓
Render cu text în limba selectată
```

## Best Practices

1. **Consistență**: Păstrează aceeași structură pentru toate articolele
2. **Completitudine**: Asigură-te că toate câmpurile au traducere în ambele limbi
3. **Formatare**: Respectă sintaxa **bold** și bullet points
4. **Testing**: Verifică cum arată articolul în ambele limbi
5. **Fallback**: `getLocalizedField()` returnează automat RO dacă EN lipsește

## Debugging

Dacă traducerile nu funcționează:

1. Verifică că `stiriTranslations` este importat în `translations/index.js`
2. Verifică că `useLanguage()` este apelat corect
3. Verifică structura obiectelor din `newsData.js` (trebuie `{ro: "", en: ""}`)
4. Verifică console-ul pentru erori JavaScript
5. Verifică că props `getLocalizedField` este transmis corect

## Exemplu Complet

Vezi articolul ID 4 din `newsData.js` pentru un exemplu complet de articol tradus cu toate elementele de formatare.
