# ProFX Doctor - Documentație

## Descriere

ProFX Doctor este o componentă de analiză a performanței de trading care oferă un diagnostic detaliat al comportamentului traderului. Componenta analizează datele contului și identifică punctele forte, punctele slabe și zonele de risc.

## Funcționalități

### 1. Diagnostic Overview (Rezumat Diagnostic)
- **8 Gauge Meters** care vizualizează diferite categorii de erori:
  - Behavioural Errors (Erori Comportamentale)
  - Emotional Errors (Erori Emoționale)
  - Overstimulation (Suprastimulare)
  - Stop Accuracy (Acuratețe Stop)
  - Strategic Errors (Erori Strategice)
  - Trade Execution (Execuție Tranzacții)
  - Trade Timing (Timing Tranzacții)
  - Risk Management (Management Risc)

Fiecare gauge arată un scor între 0-100:
- 0-33%: Verde (bun)
- 34-66%: Galben (atenție)
- 67-100%: Roșu (problemă)

### 2. Full Report (Raport Complet)
Secțiune expandabilă care include:

#### Strengths (Puncte Forte)
Tabel cu:
- Numele comportamentului pozitiv
- Impact (progress bar)
- Performance Effect (efect în USD)
- Buton de detalii

Exemple:
- On-fire Days (Zile de Performanță Maximă)
- Selective Trades (Tranzacții Selective)
- Manual Profit Taking (Realizare Manuală de Profit)
- Golden Times (Momente de Aur)

#### Weaknesses (Puncte Slabe)
Tabel cu:
- Numele comportamentului negativ
- Impact (progress bar roșu)
- Performance Effect (pierdere în USD)
- Buton de detalii

Exemple:
- Impatient Exits (Ieșiri Nerăbdătoare)
- Fail to Call it a Day (Eșec în Oprirea Zilei)
- Impatient Entries (Intrări Nerăbdătoare)
- Overtrading
- Overoptimism
- Catch a Falling Knife (Prinderea Cuțitului în Cădere)

### 3. Risks and Further Observations (Riscuri și Observații)
Secțiune expandabilă care include:

Zone de risc analizate:
- **Emotional Losing Streak**: Tendința de a crește riscul în timpul pierderilor
- **All-in Trades**: Detectarea tranzacțiilor cu risc foarte mare
- **Trade without SL**: Procentul de tranzacții fără Stop Loss

Fiecare risc afișează:
- Status (✓ bun / ⚠️ atenție)
- Mesaj descriptiv
- Buton de detalii

### 4. Action Recommendations (Recomandări de Acțiune)
Secțiune finală cu recomandări practice:
- Reducerea ieșirilor nerăbdătoare
- Prevenirea overtrading-ului
- Continuarea strategiilor de succes
- Asigurarea folosirii Stop Loss-ului

## Integrare

### În ProFXbook
Componenta este accesibilă prin butonul "Accesează ProFX Doctor" plasat după secțiunea de calendar:

```jsx
<button onClick={() => setShowDoctor(!showDoctor)}>
  {showDoctor ? "Ascunde ProFX Doctor" : "Accesează ProFX Doctor"}
</button>

{showDoctor && (
  <ProFXDoctor 
    accountData={currentAccountData}
    onClose={() => setShowDoctor(false)}
  />
)}
```

### Props
- `accountData`: Obiect cu datele contului (stats, monthlyData, growthData)
- `onClose`: Funcție callback pentru închiderea componentei (opțional)

## Analiza Datelor

### Calculul Scorurilor pentru Gauge-uri
Scorurile sunt calculate automat bazate pe:
- **Win Rate**: Influențează Behavioural Errors, Stop Accuracy, Trade Execution
- **Drawdown**: Influențează Emotional Errors, Trade Timing, Risk Management
- **Total Trades**: Influențează Overstimulation
- **Gain %**: Influențează Strategic Errors

Formula generală:
```javascript
score = Math.min(100, Math.max(0, calculatedValue))
```

### Calculul Strengths și Weaknesses
Efectul în USD este calculat proporțional cu profitul total:
- **Strengths**: 10-30% din profit atribuit fiecărui punct forte
- **Weaknesses**: 4-25% din pierderi atribuite fiecărui punct slab

### Analiza Riscurilor
- **Good**: Comportament pozitiv detectat
- **Warning**: Problemă identificată care necesită atenție

## Design și Stilizare

### Culori
- Verde (`#10b981`): Comportament bun, profit, succes
- Galben (`#fbbf24`): Atenție, avertisment
- Roșu (`#ef4444`): Probleme, pierderi
- Albastru (`#3b82f6`): Informații, acțiuni
- Mov (`#a855f7`): Accent, recomandări

### Animații
- **fadeIn**: Animație de apariție pentru secțiuni expandabile
- **Gauge needle**: Tranziție smooth pentru acul indicator (700ms ease-out)
- **Hover effects**: Tranziții pentru elemente interactive

### Responsive Design
- Grid adaptat pentru mobile (1 coloană) și desktop (2-4 coloane)
- Tabele scrollabile pe dispozitive mici
- Butoane și controale adaptate pentru touch

## Traduceri

Toate textele sunt traduse în:
- **Română** (ro)
- **Engleză** (en)

Fișier: `src/translations/profxDoctor.js`

Exemplu de utilizare:
```javascript
import { useLanguage } from "./contexts/LanguageContext";

const { language, translations } = useLanguage();
const t = translations.profxDoctor || {};

<h2>{t.title}</h2>
```

## Extensibilitate

### Adăugarea de noi metrici
1. Adaugă în `gauges` obiect:
```javascript
newMetric: Math.round(calculatedValue)
```

2. Adaugă GaugeMeter în JSX:
```jsx
<GaugeMeter 
  value={analysisData.gauges.newMetric} 
  label={language === "ro" ? "Metrica Nouă" : "New Metric"} 
/>
```

### Adăugarea de noi Strengths/Weaknesses
1. Adaugă în array-ul `strengths` sau `weaknesses`:
```javascript
{ name: "New Behavior", impact: 75, effect: 150 }
```

2. Adaugă traduceri în `profxDoctor.js`:
```javascript
newBehavior: "Comportament Nou"
```

### Adăugarea de noi riscuri
```javascript
{
  area: "New Risk Area",
  status: "good" | "warning",
  message: "Description message"
}
```

## Performance

- Toate calculele sunt făcute cu `useMemo` pentru optimizare
- Animațiile sunt optimizate cu `transform` și `opacity`
- Componenta se renderează doar când este vizibilă (conditional rendering)

## Suport Browser

Compatibil cu:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Demo și Testing

Pentru testare, componenta generează date demo dacă `accountData` este null:
- Scoruri aleatorii pentru gauge-uri
- Lista predefinită de strengths și weaknesses
- 3 zone de risc cu statusuri predefinite

## Întreținere

### Actualizarea valorilor
Pentru ajustarea sensibilității analizei, modifică multiplicatorii în calculele scorurilor:
```javascript
const emotional = Math.min(100, Math.max(0, drawdown * 2.5)); // Modifică 2.5
```

### Actualizarea mesajelor
Editează fișierul `src/translations/profxDoctor.js` pentru a modifica textele.

---

**Versiune**: 1.0.0  
**Ultimul Update**: Noiembrie 2024  
**Autor**: ProFX Team
