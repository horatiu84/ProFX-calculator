# ProFXbook Component - Documentație

## Descriere
Am creat o componentă **ProFXbook.jsx** care este o clonă simplificată a MyFXBook, adaptată la stilul ProFX Academy.

## Caracteristici Implementate

### 1. **Informații Trader**
- Nume trader editabil
- Tip cont (Real/Demo) cu switch rapid
- Badge colorat pentru identificare rapidă

### 2. **Statistici Afișate**
Componenta afișează următoarele statistici în card-uri individuale:
- **Gain**: +80.02%
- **Daily**: 0.11%
- **Monthly**: 3.39%
- **Drawdown**: 44.33%
- **Balance**: $3,781.98
- **Equity**: $3,781.98 (100.00%)
- **Highest**: $3,792.96 (Sep 22)
- **Profit**: $1,440.68
- **Interest**: -$27.11
- **Deposits**: $2,341.30
- **Withdrawals**: $0.00

### 3. **Chart-uri Interactive**

#### Growth Chart (Evoluția Contului)
- Grafic de tip Line Chart
- Afișează evoluția balance-ului de-a lungul timpului
- Culoare verde (#10b981) pentru linia de creștere
- Tooltip personalizat cu informații detaliate

#### Monthly Performance Chart
- Grafic de tip Bar Chart
- Bare colorate diferit pentru profit (verde) și pierdere (roșu)
- Afișează procentajul de return pentru fiecare lună
- Include un rezumat vizual pentru ultimele 5 luni
- Tooltip cu informații despre profit în $ și %

### 4. **Design**
- Fundal gradient consistent cu restul aplicației
- Card-uri cu glassmorphism și hover effects
- Responsive pe toate dimensiunile de ecran
- Culori ProFX: amber (#facc15), emerald (#10b981), red (#ef4444)
- Border-uri animate la hover
- Tooltips custom pentru chart-uri

## Rută
Componenta este accesibilă la URL-ul: **`/profxbook`**

Exemple:
- Local: `http://localhost:5173/profxbook`
- Production: `https://yoursite.com/profxbook`

## Tehnologii Utilizate
- **React** - Framework principal
- **Recharts** - Pentru chart-uri interactive
- **Tailwind CSS** - Pentru styling
- **React Router** - Pentru routing

## Fișiere Modificate
1. **src/ProFXbook.jsx** - Componenta nouă (CREATĂ)
2. **src/App.jsx** - Adăugată ruta `/profxbook`

## Date Demo
Componenta folosește date demo pentru demonstrație. Pentru implementare cu date reale, poți:
1. Conecta un API pentru date live
2. Folosi Firebase/Database pentru stocare
3. Importa date din CSV/JSON

## Personalizare Viitoare

### Date Dinamice
Pentru a face datele dinamice, poți înlocui:
```javascript
const stats = {
  gain: 80.02,
  // ... etc
};
```

Cu date din API sau state management (Redux, Context API, etc.)

### Extinderi Posibile
- Adăugare filtre pentru perioada de timp
- Export rapoarte PDF
- Comparație între mai multe conturi
- Adăugare mai multe chart-uri (profit by currency, win rate, etc.)
- Integrare cu MT5 pentru date real-time

## Utilizare
1. Pornește serverul de development: `npm run dev`
2. Navighează la `/profxbook` în browser
3. Toggle între Real/Demo pentru a vedea cum arată diferit
4. Hover peste chart-uri pentru tooltips interactive
5. Scroll pentru a vedea toate informațiile

## Note
- Componenta NU este parte din meniul principal (conform cerințelor)
- Poate fi accesată direct prin URL
- Păstrează designul consistent cu restul aplicației ProFX
- Responsive și optimizată pentru mobile

---
*Creat pe 17 Octombrie 2025 pentru ProFX Academy*
