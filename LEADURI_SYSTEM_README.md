# 🎯 Sistem de Gestionare Leaduri - Documentație Completă

## 📋 Prezentare Generală

Sistemul de gestionare leaduri implementează un **flow complet** pentru alocarea, confirmarea și tracking-ul leadurilor către mentori, conform schemei logice furnizate.

---

## 🔄 Flow-ul Complet (Conform Schemei)

```
┌─────────────────────────────────────────────────┐
│ 1. ÎNCĂRCARE LEADURI                            │
│    - Import Excel (bulk)                        │
│    - Adăugare manuală (individual)             │
│    Status: NEALOCAT                             │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 2. ALOCARE FIFO (20-30 leaduri/mentor)        │
│    - Mentor available = false (BUSY)           │
│    - Status lead: ALOCAT                       │
│    - dataAlocare: NOW                          │
│    - dataTimeout: NOW + 6h                     │
│    - Istoric mentori actualizat                │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 3. CONFIRMARE (în 6h)                          │
│    ✅ CONFIRMĂ → status: CONFIRMAT             │
│    ❌ REFUZĂ → status: NECONFIRMAT + re-alocare│
│    ⏰ TIMEOUT → auto-NECONFIRMAT + re-alocare  │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 4. SESIUNE 1:20                                │
│    🏆 SUCCESS → status: COMPLET                │
│    👻 NO-SHOW → status: NO_SHOW + re-alocare   │
└─────────────────────────────────────────────────┘
```

---

## 📊 Statusuri Leaduri

### Status Principal (field: `status`)

| Status | Descriere | Culoare | Icon |
|--------|-----------|---------|------|
| `nealocat` | Lead încărcat, în așteptare | 🟡 Yellow | ⏳ |
| `alocat` | Alocat către mentor, în așteptare confirmare (6h) | 🔵 Blue | 🎯 |
| `confirmat` | Mentor a confirmat că leadul participă | 🟢 Green | ✅ |
| `neconfirmat` | Lead refuzat sau timeout 6h | 🔴 Red | ❌ |
| `no_show` | Lead confirmat dar nu s-a prezentat | 🟠 Orange | 👻 |
| `complet` | Sesiune 1:20 finalizată cu succes | 🟣 Purple | 🏆 |

### Status Sesiune 1:20 (field: `statusOneToTwenty`)

- `pending` - În așteptare
- `confirmed` - Confirmat pentru sesiune
- `no_show` - Nu s-a prezentat
- `completed` - Sesiune finalizată

---

## 🗄️ Structura Datelor

### Lead (Firestore Collection: `leaduri`)

```javascript
{
  // Date de bază
  nume: "Ion Popescu",
  telefon: "+40741234567",
  email: "ion@example.com",
  
  // Status workflow
  status: "alocat", // nealocat | alocat | confirmat | neconfirmat | no_show | complet
  
  // Tracking alocare
  mentorAlocat: "sergiu", // ID mentor
  dataAlocare: Timestamp, // Când a fost alocat
  dataTimeout: Timestamp, // Când expiră cele 6h (dataAlocare + 6h)
  dataConfirmare: Timestamp | null, // Când a fost confirmat/refuzat
  
  // Tracking sesiune 1:20
  statusOneToTwenty: "pending", // pending | confirmed | no_show | completed
  dataOneToTwenty: Timestamp | null, // Data sesiunii
  
  // Istoric și re-alocări
  numarReAlocari: 0, // Câte ori a fost re-alocat
  istoricMentori: ["sergiu", "eli"], // Lista mentorilor anteriori
  motivNeconfirmare: "Timeout 6h" | "Lead-ul a refuzat" | null,
  
  // Metadata
  createdAt: Timestamp,
  alocareId: "abc123" // Referință către document din collection 'alocari'
}
```

### Mentor (Firestore Collection: `mentori`)

```javascript
{
  id: "sergiu", // ID fix din MENTORI_DISPONIBILI
  nume: "Sergiu",
  available: true, // false = BUSY (are leaduri alocate)
  leaduriAlocate: 25, // Total leaduri alocate
  ordineCoada: 0, // Poziția în coada FIFO
  ultimulOneToTwenty: Timestamp | null, // Ultima sesiune 1:20
  createdAt: Timestamp
}
```

---

## ⚙️ Funcții Principale

### 1. Import Leaduri

**Excel:**
```javascript
parseExcelFile(file) → leaduriValide[]
handleUploadLeaduri() → Încarcă în Firestore
```

**Manual:**
```javascript
handleAddManualLead() → Adaugă 1 lead
```

### 2. Alocare FIFO

```javascript
alocaLeaduriAutomata()
// - Filtrează leaduri nealocate
// - Sortează mentori după ordineCoada
// - Alocă 20-30 leaduri/mentor (FIFO)
// - Setează mentor.available = false (BUSY)
// - Calculează dataTimeout (NOW + 6h)
```

### 3. Verificare Timeout (Automată la fiecare fetch)

```javascript
fetchLeaduri()
// - Verifică leaduri cu status ALOCAT
// - Dacă (NOW - dataAlocare) >= 6h
// - Marchează automat ca NECONFIRMAT
// - Gata pentru re-alocare
```

**⚠️ IMPORTANT:** În viitor, această logică va fi mutată în **Firebase Cloud Function** (scheduled job la fiecare 30 min).

### 4. Acțiuni Mentor

```javascript
handleConfirmLead(leadId) // ✅ Confirmă participare
handleRejectLead(leadId)  // ❌ Refuză sau nu răspunde
handleNoShowLead(leadId)  // 👻 Nu s-a prezentat la sesiune
handleCompleteLead(leadId) // 🏆 Sesiune finalizată cu succes
handleReallocateLead(leadId) // 🔄 Re-alocă către alt mentor
```

---

## 🎨 UI Components

### Dashboard Statistici

```
┌─────────────────────────────────────────────┐
│ 📊 Statistici Generale                      │
│ ┌───────┬───────┬───────┬───────┬───────┐  │
│ │ Total │ Nealo │ Aloca │ Conf  │ Compl │  │
│ │  150  │  50   │  30   │  20   │  40   │  │
│ └───────┴───────┴───────┴───────┴───────┘  │
│                                             │
│ Rată conversie: 27% (40/150)               │
└─────────────────────────────────────────────┘
```

### Card Mentor

```
┌─────────────────────────┐
│     👤 Sergiu            │
│   Poziție: #1           │
│                         │
│   Total: 25             │
│   Alocate: 10 🔵        │
│   Confirmate: 8 🟢      │
│   Complete: 7 🟣        │
│                         │
│   [ ✗ Busy ]            │
│   [Update 1:20]         │
└─────────────────────────┘
```

### Tabel Leaduri - Acțiuni Dinamice

**Lead ALOCAT:**
- `✅ Confirmă` - Marchează confirmat
- `❌ Refuză` - Marchează neconfirmat
- Timer: `⏰ 4h 23m` (timp rămas până la timeout)

**Lead CONFIRMAT:**
- `🏆 Complet` - Sesiune finalizată
- `👻 No-Show` - Nu s-a prezentat

**Lead NECONFIRMAT/NO_SHOW:**
- `🔄 Re-alocă` - Alocă către alt mentor

---

## 🔮 Migrare Viitoare către Firebase Functions

### Cod Pregătit pentru Migrare

Toate funcțiile critice sunt marcate cu comentarii:

```javascript
// === VERIFICARE AUTOMATĂ TIMEOUT (VA FI MUTATĂ ÎN FIREBASE FUNCTION) ===
```

### Plan de Migrare

**Faza 2: Firebase Functions (când upgrade la Premium)**

```javascript
// functions/index.js

// Job programat - rulează la fiecare 30 minute
exports.checkLeadTimeouts = functions.pubsub
  .schedule('every 30 minutes')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    const timeout6h = 6 * 60 * 60 * 1000;
    
    // Găsește leaduri cu timeout expirat
    const snapshot = await db.collection('leaduri')
      .where('status', '==', 'alocat')
      .get();
    
    let leaduriExpirate = 0;
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      const lead = doc.data();
      const dataAlocare = lead.dataAlocare.toDate();
      const timeDiff = now.toDate() - dataAlocare;
      
      if (timeDiff >= timeout6h) {
        batch.update(doc.ref, {
          status: 'neconfirmat',
          motivNeconfirmare: 'Timeout 6h - fără confirmare de la mentor',
          dataTimeout: now
        });
        leaduriExpirate++;
      }
    });
    
    if (leaduriExpirate > 0) {
      await batch.commit();
      console.log(`✅ ${leaduriExpirate} leaduri marcate ca expirate`);
    }
    
    return null;
  });

// Email automat de confirmare (BONUS)
exports.sendConfirmationEmail = functions.firestore
  .document('leaduri/{leadId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Dacă status a trecut de la nealocat → alocat
    if (before.status === 'nealocat' && after.status === 'alocat') {
      // Trimite email către mentor
      // ...cod email...
    }
  });
```

---

## 📈 Statistici și Tracking

### Metrici Disponibile

1. **Conversie Globală:** `(Complete / Total) * 100%`
2. **Rată No-Show:** `(No-Show / Confirmate) * 100%`
3. **Timp Mediu Confirmare:** Media între `dataAlocare` și `dataConfirmare`
4. **Performanță Mentor:** Leaduri complete per mentor
5. **Re-alocări:** Leaduri cu `numarReAlocari > 0`

---

## 🚀 Cum se Folosește

### 1. Încarcă Leaduri

**Excel:**
1. Pregătește fișier Excel cu coloane: `Nume`, `Telefon`, `Email`
2. Click `📤 Încarcă Leaduri` → `📁 Excel`
3. Selectează fișier → `Încarcă`

**Manual:**
1. Click `📤 Încarcă Leaduri` → `✍️ Manual`
2. Completează formular
3. Click `Adaugă Lead`

### 2. Alocă către Mentori

1. Așteaptă să ai **minim 20 leaduri nealocate**
2. Click `🎯 Alocă Automat (FIFO)`
3. Sistemul distribuie 20-30 leaduri către fiecare mentor disponibil
4. Mentorii devin automat **BUSY** (unavailable)

### 3. Mentor Contactează Leaduri

1. Mentor vede leadurile în secțiunea "Toate Leadurile"
2. Contactează fiecare lead (telefon/WhatsApp/Telegram)
3. În dashboard, pentru fiecare lead **ALOCAT**:
   - `✅ Confirmă` - dacă leadul acceptă
   - `❌ Refuză` - dacă leadul refuză sau nu răspunde

### 4. După Sesiunea 1:20

Pentru leaduri **CONFIRMATE**, după sesiune:
- `🏆 Complet` - Sesiune reușită
- `👻 No-Show` - Leadul nu s-a prezentat

### 5. Re-alocare

Leaduri **NECONFIRMATE** sau **NO_SHOW** pot fi re-alocate:
- Click `🔄 Re-alocă`
- Sistemul găsește un mentor disponibil
- Leadul primește timeout nou de 6h

---

## ⚠️ Note Importante

### Timeout 6h

- **Pornește** de la momentul alocării (`dataAlocare`)
- **Se verifică** automat la fiecare `fetchLeaduri()`
- **În viitor:** Va fi mutat în Firebase Cloud Function (scheduled job)
- **Timer vizibil** în tabel pentru leaduri ALOCATE

### FIFO (First In, First Out)

- Mentorii sunt sortați după `ordineCoada`
- După alocare, mentorul trece la sfârșitul coadei
- Asigură distribuție echitabilă

### Re-alocări

- Leadurile pot fi re-alocate **oricând**
- Istoric complet în `istoricMentori[]`
- Counter în `numarReAlocari`

---

## 🎯 Best Practices

1. **Verifică dashboard-ul des** - timeout-ul se verifică la fetch
2. **Confirmă rapid** - ai 6h pentru fiecare batch
3. **Urmărește statistici** - rată conversie, no-show
4. **Re-alocă prompt** - leadurile neconfirmate pot fi re-folosite
5. **Backup Excel** - exportă leadurile periodic

---

## 🔧 Configurare

### Constante

```javascript
// Timeout pentru confirmare (6 ore)
const TIMEOUT_6H = 6 * 60 * 60 * 1000;

// Mentori disponibili
const MENTORI_DISPONIBILI = [
  { id: 'sergiu', nume: 'Sergiu' },
  { id: 'eli', nume: 'Eli' },
  { id: 'dan', nume: 'Dan' },
  { id: 'tudor', nume: 'Tudor' },
  { id: 'adrian', nume: 'Adrian' }
];
```

---

## 📞 Support

Pentru întrebări sau probleme:
- Verifică acest README
- Caută comentariile din cod (toate funcțiile sunt documentate)
- Verifică console-ul browser pentru erori

---

**Sistem implementat:** 2 februarie 2026  
**Versiune:** 1.0 (Frontend-Only, pregătit pentru Firebase Functions)  
**Status:** ✅ Production Ready
