import React, { useEffect, useMemo, useState } from "react";
import BuyStopTrainer from "./components/BuyStopTrainer";

// ──────────────────────────────────────────────────────────────────────────────
// Brand style
// ──────────────────────────────────────────────────────────────────────────────
const brand = {
  accentText: "text-amber-400",
  accentBg: "bg-amber-500",
  accentRing: "ring-amber-500",
  card: "rounded-2xl shadow-lg border border-white/10 bg-zinc-900/70 backdrop-blur",
  subtle: "text-zinc-300/90",
};

// ──────────────────────────────────────────────────────────────────────────────
// Questions per chapter
// ──────────────────────────────────────────────────────────────────────────────
const BASE_QUESTIONS = {
  lectia1: {
    id: "lectia1",
    title: "Introducere în Forex",
    questions: [
      {
        id: "l1q1",
        prompt: "Ce înseamnă termenul 'Forex'?",
        choices: [
          { id: "a", text: "Piața de schimb valutar" },
          { id: "b", text: "Piața de acțiuni" },
          { id: "c", text: "Un tip de criptomonedă" },
          { id: "d", text: "O bursă de mărfuri" },
        ],
        answerId: "a",
        explanation:
          "Forex vine de la 'Foreign Exchange', piața globală de schimb valutar.",
      },
      {
        id: "l1q2",
        prompt: "Ce se tranzacționează pe piața Forex?",
        choices: [
          { id: "a", text: "Acțiuni" },
          { id: "b", text: "Valute" },
          { id: "c", text: "Obligațiuni" },
          { id: "d", text: "Mărfuri" },
        ],
        answerId: "b",
        explanation: "Pe piața Forex se tranzacționează valute.",
      },
      {
        id: "l1q3",
        prompt: "Care este cea mai lichidă piață financiară din lume?",
        choices: [
          { id: "a", text: "Piața de acțiuni" },
          { id: "b", text: "Piața Forex" },
          { id: "c", text: "Piața criptomonedelor" },
          { id: "d", text: "Piața imobiliară" },
        ],
        answerId: "b",
        explanation:
          "Piața Forex este cea mai lichidă, cu un volum zilnic de peste 6 trilioane USD.",
      },
      {
        id: "l1q4",
        prompt: "Cum se formează perechile valutare?",
        choices: [
          { id: "a", text: "Din două acțiuni listate" },
          { id: "b", text: "Din două monede" },
          { id: "c", text: "Dintr-o monedă și o marfă" },
          { id: "d", text: "Dintr-o criptomonedă și o acțiune" },
        ],
        answerId: "b",
        explanation:
          "Perechile valutare sunt formate din două monede, una de bază și una cotată.",
      },
      {
        id: "l1q5",
        prompt: "Ce reprezintă 'spread'-ul pe piața Forex?",
        choices: [
          {
            id: "a",
            text: "Diferența dintre prețul de cumpărare și cel de vânzare",
          },
          { id: "b", text: "Comisionul brokerului" },
          { id: "c", text: "Rata dobânzii" },
          { id: "d", text: "Taxa pe tranzacții" },
        ],
        answerId: "a",
        explanation: "Spread-ul este diferența dintre prețul Bid și Ask.",
      },
      {
        id: "l1q6",
        prompt: "Ce rol are efectul de levier (leverage) pe piața Forex?",
        choices: [
          { id: "a", text: "Reduce riscul tranzacției" },
          {
            id: "b",
            text: "Permite controlul unei poziții mai mari decât capitalul propriu",
          },
          { id: "c", text: "Crește spread-ul" },
          { id: "d", text: "Reduce lichiditatea" },
        ],
        answerId: "b",
        explanation:
          "Levierul permite tranzacționarea unor volume mai mari decât capitalul disponibil.",
      },
      {
        id: "l1q7",
        prompt: "Ce înseamnă 'lot' în tranzacționarea Forex?",
        choices: [
          { id: "a", text: "Unitatea de măsură a volumului tranzacției" },
          { id: "b", text: "Comisionul brokerului" },
          { id: "c", text: "O pereche valutară" },
          { id: "d", text: "Un ordin de piață" },
        ],
        answerId: "a",
        explanation:
          "Un lot este unitatea standardizată a volumului tranzacției în Forex.",
      },
      {
        id: "l1q8",
        prompt: "Ce este o poziție long?",
        choices: [
          { id: "a", text: "Vânzarea unei valute" },
          { id: "b", text: "Cumpărarea unei valute" },
          { id: "c", text: "Închiderea unei tranzacții" },
          { id: "d", text: "Tranzacție pe termen scurt" },
        ],
        answerId: "b",
        explanation:
          "Poziția long înseamnă cumpărarea unei monede, anticipând creșterea acesteia.",
      },
      {
        id: "l1q9",
        prompt: "Ce este o poziție short?",
        choices: [
          { id: "a", text: "Cumpărarea unei valute" },
          { id: "b", text: "Vânzarea unei valute" },
          { id: "c", text: "O tranzacție de acoperire" },
          { id: "d", text: "O tranzacție fără levier" },
        ],
        answerId: "b",
        explanation:
          "Poziția short înseamnă vânzarea unei monede, anticipând scăderea acesteia.",
      },
      {
        id: "l1q10",
        prompt: "Care este scopul analizei tehnice pe piața Forex?",
        choices: [
          { id: "a", text: "Determinarea valorii reale a unei companii" },
          {
            id: "b",
            text: "Identificarea tendințelor și oportunităților de tranzacționare",
          },
          { id: "c", text: "Stabilirea politicii monetare" },
          { id: "d", text: "Calcularea PIB-ului" },
        ],
        answerId: "b",
        explanation:
          "Analiza tehnică ajută la identificarea tendințelor și a momentelor optime de intrare/ieșire.",
      },
    ],
  },

  lectia2: {
    id: "lectia2",
    title: "Grafice și Lumânări",
    questions: [
      {
        id: "l2q1",
        prompt:
          "Care este principalul avantaj al graficului cu lumânări japoneze față de alte tipuri de grafice?",
        choices: [
          {
            id: "a",
            text: "Oferă o imagine clară a trendului doar pe termen lung",
          },
          { id: "b", text: "Este cel mai simplu tip de grafic" },
          {
            id: "c",
            text: "Oferă cea mai bogată informație dintr-o privire, inclusiv emoțiile pieței",
          },
          { id: "d", text: "Arată doar prețul de închidere" },
        ],
        answerId: "c",
        explanation:
          "Graficele cu lumânări sunt preferate deoarece transmit rapid informații complete și emoțiile pieței.",
      },
      {
        id: "l2q2",
        prompt: "Cine a inventat metoda graficului cu lumânări japoneze?",
        choices: [
          { id: "a", text: "Charles Dow" },
          { id: "b", text: "Steve Nison" },
          { id: "c", text: "Munehisa Homma" },
          { id: "d", text: "Jesse Livermore" },
        ],
        answerId: "c",
        explanation:
          "Munehisa Homma, un negustor de orez din Japonia secolului XVIII, a creat metoda lumânărilor japoneze.",
      },
      {
        id: "l2q3",
        prompt: "Ce informații oferă corpul unei lumânări?",
        choices: [
          { id: "a", text: "Maximul și minimul perioadei" },
          { id: "b", text: "Prețul de deschidere și cel de închidere" },
          { id: "c", text: "Doar prețul de închidere" },
          { id: "d", text: "Doar prețul de deschidere" },
        ],
        answerId: "b",
        explanation:
          "Corpul unei lumânări arată distanța dintre prețul de deschidere și cel de închidere.",
      },
      {
        id: "l2q4",
        prompt: "Ce semnifică o lumânare Doji?",
        choices: [
          { id: "a", text: "Presiune puternică din partea cumpărătorilor" },
          { id: "b", text: "Presiune puternică din partea vânzătorilor" },
          { id: "c", text: "Indecizie în piață, posibilă inversare" },
          { id: "d", text: "Confirmarea unui trend existent" },
        ],
        answerId: "c",
        explanation:
          "Lumânarea Doji indică indecizie în piață și poate semnala o posibilă inversare.",
      },
      {
        id: "l2q5",
        prompt:
          "Ce tip de grafic este cel mai simplu și arată doar prețul de închidere?",
        choices: [
          { id: "a", text: "Grafic cu lumânări" },
          { id: "b", text: "Grafic cu bare" },
          { id: "c", text: "Grafic cu linie" },
          { id: "d", text: "Grafic cu puncte" },
        ],
        answerId: "c",
        explanation:
          "Graficul cu linie leagă doar prețurile de închidere, oferind o imagine simplă a trendului.",
      },
      {
        id: "l2q6",
        prompt:
          "Ce timeframe oferă cea mai detaliată imagine asupra mișcărilor prețului?",
        choices: [
          { id: "a", text: "W1" },
          { id: "b", text: "M15" },
          { id: "c", text: "D1" },
          { id: "d", text: "MN" },
        ],
        answerId: "b",
        explanation:
          "Pe timeframe-uri mici, precum M15, vezi detalii ale mișcărilor prețului.",
      },
      {
        id: "l2q7",
        prompt:
          "Ce model de lumânări indică o posibilă inversare bearish într-un trend ascendent?",
        choices: [
          { id: "a", text: "Hammer" },
          { id: "b", text: "Shooting Star" },
          { id: "c", text: "Bullish Engulfing" },
          { id: "d", text: "Morning Star" },
        ],
        answerId: "b",
        explanation:
          "Shooting Star apare în trend ascendent și semnalează o posibilă inversare bearish.",
      },
      {
        id: "l2q8",
        prompt: "Ce înseamnă corelarea timeframe-urilor (Top-Down Analysis)?",
        choices: [
          { id: "a", text: "Compararea mai multor instrumente financiare" },
          {
            id: "b",
            text: "Analiza trendului mare pe timeframe-uri mari și confirmarea pe timeframe-uri mici",
          },
          { id: "c", text: "Verificarea simultană a volumului și a prețului" },
          { id: "d", text: "Alternarea între grafice cu lumânări și cu bare" },
        ],
        answerId: "b",
        explanation:
          "Top-Down Analysis înseamnă să vezi trendul general pe TF-uri mari și să confirmi intrarea pe TF-uri mici.",
      },
      {
        id: "l2q9",
        prompt:
          "Ce tipar de lumânări este format din trei lumânări verzi consecutive, cu maxime și minime tot mai mari?",
        choices: [
          { id: "a", text: "Three White Soldiers" },
          { id: "b", text: "Three Black Crows" },
          { id: "c", text: "Morning Star" },
          { id: "d", text: "Evening Star" },
        ],
        answerId: "a",
        explanation:
          "Three White Soldiers indică un semn clar de forță bullish.",
      },
      {
        id: "l2q10",
        prompt: "Ce indică tiparul Bearish Engulfing?",
        choices: [
          { id: "a", text: "Posibilă continuare a trendului ascendent" },
          { id: "b", text: "Posibilă inversare bearish" },
          { id: "c", text: "Piață laterală" },
          { id: "d", text: "Confirmarea unui suport" },
        ],
        answerId: "b",
        explanation:
          "Bearish Engulfing este un tipar care semnalează o posibilă inversare bearish.",
      },
    ],
  },
  lectia3: {
    id: "lectia3",
    title: "Trenduri",
    questions: [
      {
        id: "l3q1",
        prompt: "Ce este un trend în analiza pieței Forex?",
        choices: [
          { id: "a", text: "O variație aleatorie a prețului" },
          {
            id: "b",
            text: "Direcția generală a mișcării prețului pe un anumit interval de timp",
          },
          { id: "c", text: "Un tip de indicator tehnic" },
          { id: "d", text: "O metodă de calcul a inflației" },
        ],
        answerId: "b",
        explanation:
          "Un trend este direcția generală în care se mișcă prețul pe un anumit interval de timp – ascendent, descendent sau lateral.",
      },
      {
        id: "l3q2",
        prompt: "Cum se recunoaște un trend ascendent (Bullish)?",
        choices: [
          { id: "a", text: "Maxime și minime din ce în ce mai mici" },
          { id: "b", text: "Structură cu higher highs și higher lows" },
          { id: "c", text: "Lipsa unei direcții clare" },
          { id: "d", text: "Prețul se menține într-un canal orizontal" },
        ],
        answerId: "b",
        explanation:
          "Trendul ascendent are maxime și minime din ce în ce mai mari, confirmate de respingeri din zonele de suport.",
      },
      {
        id: "l3q3",
        prompt: "Ce caracterizează un trend descendent (Bearish)?",
        choices: [
          { id: "a", text: "Prețul crește constant" },
          { id: "b", text: "Prețul se menține între două limite fixe" },
          { id: "c", text: "Structură cu lower highs și lower lows" },
          { id: "d", text: "Volum scăzut pe scădere" },
        ],
        answerId: "c",
        explanation:
          "Un trend descendent are maxime și minime din ce în ce mai mici, confirmate de respingeri din zonele de rezistență.",
      },
      {
        id: "l3q4",
        prompt: "Cum recunoști un trend lateral (consolidare)?",
        choices: [
          { id: "a", text: "Maxime și minime aproximativ egale" },
          { id: "b", text: "Prețul urcă treptat" },
          { id: "c", text: "Structură cu higher highs și higher lows" },
          { id: "d", text: "Volum în creștere" },
        ],
        answerId: "a",
        explanation:
          "Un trend lateral are maxime și minime aproximativ egale și se formează între o zonă de suport și una de rezistență.",
      },
      {
        id: "l3q5",
        prompt: "Ce este suportul pe un grafic?",
        choices: [
          { id: "a", text: "Un nivel unde prețul se oprește din creștere" },
          {
            id: "b",
            text: "O zonă unde cererea e suficient de mare pentru a opri scăderea prețului",
          },
          { id: "c", text: "O linie trasată aleator pe grafic" },
          { id: "d", text: "O zonă unde presiunea de vânzare crește" },
        ],
        answerId: "b",
        explanation:
          "Suportul este ca o „podea” invizibilă unde cererea împiedică scăderea suplimentară a prețului.",
      },
      {
        id: "l3q6",
        prompt: "Ce este rezistența pe un grafic?",
        choices: [
          { id: "a", text: "O zonă unde cererea este mare" },
          {
            id: "b",
            text: "Un nivel unde prețul se oprește din creștere și poate scădea",
          },
          { id: "c", text: "O zonă de acumulare" },
          { id: "d", text: "Un indicator tehnic" },
        ],
        answerId: "b",
        explanation:
          "Rezistența este ca un „tavan” invizibil unde presiunea de vânzare depășește cererea.",
      },
      {
        id: "l3q7",
        prompt: "Ce se întâmplă dacă suportul este spart?",
        choices: [
          { id: "a", text: "Devine rezistență" },
          { id: "b", text: "Piața intră în consolidare" },
          { id: "c", text: "Prețul revine imediat" },
          { id: "d", text: "Nu are efect" },
        ],
        answerId: "a",
        explanation:
          "Când suportul este spart, acesta devine de obicei rezistență.",
      },
      {
        id: "l3q8",
        prompt: "De ce este importantă corelarea timeframe-urilor?",
        choices: [
          { id: "a", text: "Pentru a desena mai multe linii pe grafic" },
          {
            id: "b",
            text: "Pentru a evita tranzacțiile împotriva trendului de pe timeframe-uri mari",
          },
          { id: "c", text: "Pentru a găsi mai multe oportunități false" },
          { id: "d", text: "Nu are importanță" },
        ],
        answerId: "b",
        explanation:
          "Corelarea timeframe-urilor ajută să tranzacționezi în direcția trendului principal observat pe intervale mai mari.",
      },
      {
        id: "l3q9",
        prompt: "Ce rol are timeframe-ul D1 (daily) în analiză?",
        choices: [
          { id: "a", text: "Detalii pentru intrări rapide" },
          { id: "b", text: "Direcția generală a pieței" },
          { id: "c", text: "Structura medie a trendului" },
          { id: "d", text: "Confirmări pentru intrare" },
        ],
        answerId: "b",
        explanation:
          "Timeframe-ul D1 îți arată tendința principală și direcția generală a pieței.",
      },
      {
        id: "l3q10",
        prompt: "Care este ordinea corectă pentru analiza multi-timeframe?",
        choices: [
          { id: "a", text: "M15 → H1 → H4 → D1" },
          { id: "b", text: "D1 → H4 → H1 → M15" },
          { id: "c", text: "H4 → D1 → M15 → H1" },
          { id: "d", text: "Oricare, nu contează" },
        ],
        answerId: "b",
        explanation:
          "Analiza corectă se face de sus în jos: D1 pentru direcția principală, H4 pentru structură, H1 pentru semnal, M15 pentru precizie.",
      },
    ],
  },
  lectia4: {
    id: "lectia4",
    title: "Acțiunea Prețului",
    questions: [
      {
        id: "pa1",
        prompt: "Ce este acțiunea prețului (price action)?",
        choices: [
          { id: "a", text: "Analiza indicatorilor tehnici complicați" },
          {
            id: "b",
            text: "Analiza doar a mișcării prețului pe grafic, fără indicatori",
          },
          { id: "c", text: "Predicții bazate pe știri economice" },
          { id: "d", text: "Analiza volumului și a ord book-ului" },
        ],
        answerId: "b",
        explanation:
          "Price action înseamnă interpretarea comportamentului pieței doar din lumânări, structuri și reacții, fără indicatori.",
      },
      {
        id: "pa2",
        prompt: "Care este principalul avantaj al price action-ului?",
        choices: [
          { id: "a", text: "Îți permite să reacționezi rapid și informat" },
          { id: "b", text: "Garantează profitul în orice condiții" },
          { id: "c", text: "Elimină complet riscul din trading" },
          { id: "d", text: "Îți permite să tranzacționezi fără plan" },
        ],
        answerId: "a",
        explanation:
          "Price action te ajută să înțelegi povestea graficului în timp real și să iei decizii clare.",
      },
      {
        id: "pa3",
        prompt:
          "Ce tip de reacție apare când prețul testează o zonă dar nu reușește să o spargă?",
        choices: [
          { id: "a", text: "Breakout" },
          { id: "b", text: "False breakout" },
          { id: "c", text: "Reacție clară de respingere" },
          { id: "d", text: "Consolidare" },
        ],
        answerId: "c",
        explanation:
          "O reacție clară de respingere indică lipsa forței de a sparge zona, posibil semnal de inversare.",
      },
      {
        id: "pa4",
        prompt: "Ce este un false breakout (fakeout)?",
        choices: [
          { id: "a", text: "O spargere reală a unei zone importante" },
          {
            id: "b",
            text: "O spargere temporară urmată de revenirea rapidă sub/peste zona spartă",
          },
          { id: "c", text: "O perioadă de consolidare" },
          { id: "d", text: "O mișcare bruscă pe știri" },
        ],
        answerId: "b",
        explanation:
          "False breakout este o spargere aparentă urmată de revenirea rapidă, capcană pentru traderii neatenți.",
      },
      {
        id: "pa5",
        prompt:
          "Cum se numește situația în care prețul sparge o zonă, revine să o testeze și apoi continuă în aceeași direcție?",
        choices: [
          { id: "a", text: "Breakout cu retest" },
          { id: "b", text: "Breakout fără retest" },
          { id: "c", text: "False breakout" },
          { id: "d", text: "Reacție de respingere" },
        ],
        answerId: "a",
        explanation:
          "Breakout-ul cu retest oferă confirmare suplimentară, zona spartă devine suport sau rezistență.",
      },
      {
        id: "pa6",
        prompt: "Ce caracterizează un breakout fără retest?",
        choices: [
          { id: "a", text: "Mișcare lentă și lipsită de volum" },
          {
            id: "b",
            text: "Spargere agresivă, continuare imediată fără revenire",
          },
          { id: "c", text: "O consolidare înainte de spargere" },
          { id: "d", text: "Apariția unui doji" },
        ],
        answerId: "b",
        explanation:
          "Breakout-ul fără retest este o mișcare agresivă, cu volum mare, care nu revine pentru verificarea zonei.",
      },
      {
        id: "pa7",
        prompt: "Care este o eroare comună în analiza acțiunii prețului?",
        choices: [
          { id: "a", text: "Analiza contextului și a trendului" },
          {
            id: "b",
            text: "Intrarea pe baza unei singure lumânări, fără context",
          },
          { id: "c", text: "Corelarea mai multor timeframe-uri" },
          { id: "d", text: "Identificarea zonelor cheie" },
        ],
        answerId: "b",
        explanation:
          "Intrarea fără context, doar pe baza unei lumânări, poate duce la decizii greșite.",
      },
      {
        id: "pa8",
        prompt:
          "Cum trebuie corelate timeframe-urile pentru o analiză corectă?",
        choices: [
          { id: "a", text: "Analiza de jos în sus (M1 → M5 → H1)" },
          { id: "b", text: "Analiza de sus în jos (D1 → H4 → H1 → M15)" },
          { id: "c", text: "Doar pe timeframe-ul de intrare" },
          { id: "d", text: "Indiferent de ordine" },
        ],
        answerId: "b",
        explanation:
          "Analiza corectă se face de sus în jos pentru a înțelege contextul general.",
      },
      {
        id: "pa9",
        prompt: "De ce este importantă confluența în price action?",
        choices: [
          { id: "a", text: "Crește probabilitatea ca semnalul să fie valid" },
          { id: "b", text: "Elimină complet riscul" },
          { id: "c", text: "Face analiza mai simplă" },
          { id: "d", text: "Permite folosirea unui singur indicator" },
        ],
        answerId: "a",
        explanation:
          "Confluența apare când mai multe elemente tehnice indică aceeași direcție, crescând șansele de reușită.",
      },
      {
        id: "pa10",
        prompt: "Ce trebuie să faci dacă piața nu oferă o poveste clară?",
        choices: [
          { id: "a", text: "Forțezi intrarea pentru a prinde mișcarea" },
          { id: "b", text: "Stai pe bară și aștepți un semnal clar" },
          { id: "c", text: "Intrii pe baza unei predicții" },
          { id: "d", text: "Schimbi strategia complet" },
        ],
        answerId: "b",
        explanation:
          "Lipsa răbdării duce la overtrading; e mai bine să aștepți un context clar înainte să intri.",
      },
    ],
  },
  lectia5: {
    id: "lectia5",
    title: "Risk Management",
    questions: [
      {
        id: "rm1",
        prompt:
          "Care este scopul principal al Money Management și Risk Management în trading?",
        choices: [
          { id: "a", text: "Să găsești mereu trade-ul perfect" },
          {
            id: "b",
            text: "Protejarea capitalului și asigurarea supraviețuirii pe termen lung",
          },
          { id: "c", text: "Să obții profit cât mai rapid" },
          { id: "d", text: "Să tranzacționezi fără Stop Loss" },
        ],
        answerId: "b",
        explanation:
          "Scopul principal este protejarea capitalului și asigurarea supraviețuirii pe termen lung, nu profitul rapid.",
      },
      {
        id: "rm2",
        prompt: "Ce înseamnă Money Management (MM)?",
        choices: [
          { id: "a", text: "Controlul pierderii pe fiecare tranzacție" },
          { id: "b", text: "Gestionarea banilor din contul de trading" },
          { id: "c", text: "Stabilirea direcției trendului" },
          { id: "d", text: "Strategia de intrare și ieșire" },
        ],
        answerId: "b",
        explanation:
          "Money Management se referă la gestionarea banilor din cont: cât riști, cu ce lot intri și cât îți permiți să pierzi.",
      },
      {
        id: "rm3",
        prompt: "Ce înseamnă Risk Management (RM)?",
        choices: [
          { id: "a", text: "Alegerea momentului optim de intrare în piață" },
          { id: "b", text: "Controlul pierderii pe fiecare poziție" },
          { id: "c", text: "Creșterea profitului prin scalping" },
          { id: "d", text: "Folosirea exclusivă a indicatorilor tehnici" },
        ],
        answerId: "b",
        explanation:
          "Risk Management înseamnă limitarea pierderilor prin setarea Stop Loss-ului și ajustarea lotului.",
      },
      {
        id: "rm4",
        prompt: "Care este regula de aur ProFX pentru risc per tranzacție?",
        choices: [
          { id: "a", text: "Nu risca mai mult de 5% din cont" },
          { id: "b", text: "Nu risca mai mult de 1% din cont" },
          { id: "c", text: "Nu risca mai mult de 10% din cont" },
          { id: "d", text: "Nu risca mai mult de 0.5% din cont" },
        ],
        answerId: "b",
        explanation:
          "Regula de aur ProFX este să nu riști mai mult de 1% din cont pe un singur trade.",
      },
      {
        id: "rm5",
        prompt: "Care este formula de bază pentru calculul lotului?",
        choices: [
          { id: "a", text: "Lot = Capital / Pips" },
          {
            id: "b",
            text: "Lot = Suma riscată / (Pips × Valoarea pip-ului per lot)",
          },
          { id: "c", text: "Lot = Profit dorit × Pips" },
          { id: "d", text: "Lot = Valoarea pip-ului × SL" },
        ],
        answerId: "b",
        explanation:
          "Formula corectă este: Lot = Suma riscată / (Pips × Valoarea pip-ului per lot).",
      },
      {
        id: "rm6",
        prompt: "Ce caracterizează lotul static?",
        choices: [
          { id: "a", text: "Lotul este ajustat la fiecare tranzacție" },
          {
            id: "b",
            text: "Lotul rămâne mereu același, indiferent de SL și capital",
          },
          { id: "c", text: "Lotul se modifică în funcție de volatilitate" },
          { id: "d", text: "Lotul crește automat la fiecare pierdere" },
        ],
        answerId: "b",
        explanation:
          "Lotul static are aceeași dimensiune indiferent de condițiile pieței, ceea ce duce la risc variabil.",
      },
      {
        id: "rm7",
        prompt: "Ce avantaj major are lotul dinamic?",
        choices: [
          { id: "a", text: "Nu necesită calcule" },
          { id: "b", text: "Menține riscul constant și controlat" },
          { id: "c", text: "Crește mereu dimensiunea poziției" },
          { id: "d", text: "Funcționează doar pe trenduri puternice" },
        ],
        answerId: "b",
        explanation:
          "Lotul dinamic ajustează dimensiunea poziției pentru a menține același risc per tranzacție.",
      },
      {
        id: "rm8",
        prompt:
          "Care dintre acestea este o greșeală comună de risk management?",
        choices: [
          { id: "a", text: "Calcularea lotului înainte de intrare" },
          { id: "b", text: "Trading cu lot la ghici" },
          { id: "c", text: "Folosirea unui calculator de lot" },
          { id: "d", text: "Setarea unui SL clar" },
        ],
        answerId: "b",
        explanation:
          "Tradingul cu lot la ghici înseamnă lipsa unui plan de risc și poate duce la pierderi mari.",
      },
      {
        id: "rm9",
        prompt: "Ce este 'overrisk'-ul?",
        choices: [
          { id: "a", text: "Riscul controlat de 1%" },
          { id: "b", text: "Riscul prea mare pe un singur trade" },
          { id: "c", text: "Folosirea lotului dinamic" },
          { id: "d", text: "Folosirea unui SL prea mic" },
        ],
        answerId: "b",
        explanation:
          "Overrisk înseamnă să riști prea mult din cont pe o singură tranzacție.",
      },
      {
        id: "rm10",
        prompt: "De ce este important Stop Loss-ul?",
        choices: [
          { id: "a", text: "Pentru a limita pierderea pe fiecare trade" },
          { id: "b", text: "Pentru a crește profitul" },
          { id: "c", text: "Pentru a executa ordine instant" },
          { id: "d", text: "Pentru a evita folosirea calculatorului de lot" },
        ],
        answerId: "a",
        explanation:
          "Stop Loss-ul este centura de siguranță a traderului – limitează pierderea și protejează capitalul.",
      },
    ],
  },
  inflatie: {
    id: "inflatie",
    title: "Inflație & Forex",
    questions: [
      {
        id: "q1",
        prompt: "Ce descrie cel mai bine inflația într-o economie?",
        choices: [
          {
            id: "a",
            text: "Scăderea susținută a prețurilor și creșterea puterii de cumpărare",
          },
          {
            id: "b",
            text: "Creșterea generală și susținută a prețurilor bunurilor și serviciilor",
          },
          { id: "c", text: "Creșterea salariilor în ritm cu productivitatea" },
          { id: "d", text: "Reducerea masei monetare în circulație" },
        ],
        answerId: "b",
        explanation:
          "Inflația = creșterea susținută a prețurilor; erodează puterea de cumpărare.",
      },
      {
        id: "q2",
        prompt:
          "Care indicator este cel mai folosit pentru a măsura inflația la consumatori?",
        choices: [
          { id: "a", text: "PPI (Indicele Prețurilor Producătorilor)" },
          { id: "b", text: "PIB (Produsul Intern Brut)" },
          { id: "c", text: "IPC (Indicele Prețurilor de Consum)" },
          { id: "d", text: "Rata șomajului" },
        ],
        answerId: "c",
        explanation:
          "IPC măsoară variația medie a prețurilor unui coș de bunuri și servicii; Core CPI exclude alimentele și energia.",
      },
      {
        id: "q3",
        prompt: "Inflația prin cerere (demand-pull) apare atunci când…",
        choices: [
          { id: "a", text: "costurile de producție cresc brusc" },
          {
            id: "b",
            text: "cererea totală depășește capacitatea de producție a economiei",
          },
          { id: "c", text: "banca centrală reduce rata dobânzii" },
          { id: "d", text: "moneda se apreciază pe piețele externe" },
        ],
        answerId: "b",
        explanation:
          "Demand-pull = prea mulți bani urmăresc prea puține bunuri; presiunea vine din partea cererii agregate.",
      },
      {
        id: "q4",
        prompt: "Ce descrie corect disinflația?",
        choices: [
          { id: "a", text: "Prețurile scad pe scară largă (opusul inflației)" },
          {
            id: "b",
            text: "Prețurile cresc, dar într-un ritm mai lent decât înainte",
          },
          { id: "c", text: "Creștere economică negativă cu inflație ridicată" },
          { id: "d", text: "Înghețarea prețurilor de către guvern" },
        ],
        answerId: "b",
        explanation:
          "Disinflația = încetinirea ritmului de creștere a prețurilor, nu scăderea lor efectivă (aceea ar fi deflație).",
      },
      {
        id: "q5",
        prompt: "Care este particularitatea stagflației?",
        choices: [
          { id: "a", text: "Inflație scăzută, șomaj redus, creștere rapidă" },
          {
            id: "b",
            text: "Inflație ridicată, stagnare/contracție economică și șomaj mare",
          },
          { id: "c", text: "Deflație persistentă cu cerere ridicată" },
          { id: "d", text: "Aprecierea monedei și exporturi în creștere" },
        ],
        answerId: "b",
        explanation:
          "Stagflația combină inflație ridicată cu creștere economică slabă și șomaj ridicat; exemplu clasic: criza petrolului din 1973.",
      },
      {
        id: "q6",
        prompt:
          "Cum afectează de obicei o inflație ridicată cursul unei monede, prin reacția băncii centrale?",
        choices: [
          {
            id: "a",
            text: "Banca centrală scade rata dobânzii, iar moneda se depreciază",
          },
          {
            id: "b",
            text: "Banca centrală crește rata dobânzii, ceea ce poate întări moneda",
          },
          {
            id: "c",
            text: "Nu există nicio legătură între dobânzi și cursul valutar",
          },
          {
            id: "d",
            text: "Banca centrală tipărește bani pentru a aprecia moneda",
          },
        ],
        answerId: "b",
        explanation:
          "Ratele mai mari atrag capital străin în căutare de randamente, crescând cererea pentru monedă și aprecierea ei.",
      },
      {
        id: "q7",
        prompt: "Care dintre următoarele este ADEVĂRAT despre deflație?",
        choices: [
          { id: "a", text: "Este mereu benefică pe termen lung" },
          {
            id: "b",
            text: "Se manifestă prin creșterea generală a prețurilor",
          },
          {
            id: "c",
            text: "Poate declanșa amânarea consumului și o spirală economică negativă",
          },
          { id: "d", text: "Nu are legătură cu șomajul" },
        ],
        answerId: "c",
        explanation:
          "Deflația reduce consumul (oamenii așteaptă prețuri și mai mici), ceea ce poate tăia producția și crește șomajul.",
      },
      {
        id: "q8",
        prompt: "Un exemplu recent de inflație foarte ridicată în 2021-2023 ",
        choices: [
          { id: "a", text: "Elveția" },
          { id: "b", text: "Turcia" },
          { id: "c", text: "Japonia" },
          { id: "d", text: "Canada" },
        ],
        answerId: "b",
        explanation:
          "Inflație galopantă/pe alocuri hiperinflație în Turcia în perioada 2021-2023.",
      },
      {
        id: "q9",
        prompt: "Ce *combină* o analiză Forex informată despre inflație?",
        choices: [
          { id: "a", text: "Doar analiza tehnică; fundamentalul e opțional" },
          { id: "b", text: "Doar analiza fundamentală; tehnicul distrage" },
          {
            id: "c",
            text: "Atât analiza fundamentală (CPI, PPI, dobânzi) cât și analiza tehnică",
          },
          { id: "d", text: "Exclusiv știri politice" },
        ],
        answerId: "c",
        explanation:
          "îmbinarea fundamentalului (date de inflație, decizii de dobândă) cu tehnicul (modele de preț/indicatori).",
      },
      {
        id: "q10",
        prompt: "Care dintre următoarele *nu* este un exemplu de disinflație?",
        choices: [
          { id: "a", text: "Rata inflației scade de la 10% la 5%" },
          { id: "b", text: "Rata inflației scade de la 5% la 2%" },
          { id: "c", text: "Prețurile scad efectiv în medie în economie" },
          {
            id: "d",
            text: "Banca centrală ridică dobânzile, iar creșterea prețurilor încetinește",
          },
        ],
        answerId: "c",
        explanation:
          "Când prețurile scad efectiv vorbim de deflație, nu de disinflație. Disinflația = încetinirea ritmului de creștere a prețurilor.",
      },
    ],
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "profx-quiz-v3";
const TOTAL_SECONDS = 9 * 60;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function usePersistentState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

// Simple badge
const Badge = ({ tone = "neutral", children }) => {
  const map = {
    neutral: "bg-white/10 text-white",
    rose: "bg-rose-500/20 text-rose-300 border border-rose-500/40",
    amber: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
    sky: "bg-sky-500/20 text-sky-300 border border-sky-500/40",
    emerald: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
    gold: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
  };
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-semibold ${
        map[tone] || map.neutral
      }`}
    >
      {children}
    </span>
  );
};

// UI primitives
const Card = ({ className = "", children }) => (
  <div className={`${brand.card} ${className}`}>{children}</div>
);

const Button = ({ className = "", children, ...props }) => (
  <button
    className={`px-4 py-2 rounded-xl font-semibold border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Ghost = ({ className = "", children, ...props }) => (
  <button
    className={`px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Progress = ({ value }) => (
  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
    <div
      className={`h-full ${brand.accentBg}`}
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

// Verdict helper
function verdict(pct, chapter) {
  if (chapter === "inflatie") {
    if (pct < 30)
      return {
        label: "Slab",
        tone: "rose",
        line: "E ok, abia începi. Reia pe scurt: definiția inflației, CPI vs Core CPI, tipuri (disinflație/deflație) și legătura dobânzi–monedă.",
      };
    if (pct < 60)
      return {
        label: "Mediocru",
        tone: "amber",
        line: "Progres vizibil. Încă 10 minute de recap pe stagflație și mecanismul ratei dobânzii te duc peste 60%.",
      };
    if (pct < 90)
      return {
        label: "Bun",
        tone: "sky",
        line: "Foarte bine! Mai finisează nuanțele (ex: disinflație vs deflație) și ești gata de next level.",
      };
    if (pct < 100)
      return {
        label: "Excelent",
        tone: "emerald",
        line: "Aproape perfect. Un mic refresh la exemple (Turcia 2021–2023) și e 10/10.",
      };
    return {
      label: "Top",
      tone: "gold",
      line: "Legendă 🏆 – ai stăpânit complet lecția. Treci liniștit la capitolul următor.",
    };
  } else {
    if (pct < 30)
      return {
        label: "Slab",
        tone: "rose",
        line: "E ok, abia începi. Reia conceptele de bază.",
      };
    if (pct < 60)
      return {
        label: "Mediocru",
        tone: "amber",
        line: "Progres vizibil. Mai exersează pentru a îmbunătăți scorul.",
      };
    if (pct < 90)
      return {
        label: "Bun",
        tone: "sky",
        line: "Foarte bine! Mai finisează nuanțele și ești gata de next level.",
      };
    if (pct < 100)
      return {
        label: "Excelent",
        tone: "emerald",
        line: "Aproape perfect. Un mic refresh și e 10/10.",
      };
    return {
      label: "Top",
      tone: "gold",
      line: "Legendă 🏆 – ai stăpânit complet lecția. Treci liniștit la capitolul următor.",
    };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────────────────────
const Test = () => {
  const [chapter, setChapter] = usePersistentState(
    `${STORAGE_KEY}:chapter`,
    "inflatie"
  );
  const currentChapter = BASE_QUESTIONS[chapter];

  const [withTimer, setWithTimer] = usePersistentState(
    `${STORAGE_KEY}:withTimer`,
    false
  );
  const [secondsLeft, setSecondsLeft] = usePersistentState(
    `${STORAGE_KEY}:secondsLeft`,
    TOTAL_SECONDS
  );
  const [compact, setCompact] = usePersistentState(
    `${STORAGE_KEY}:compact`,
    false
  );

  const [seed, setSeed] = usePersistentState(
    `${STORAGE_KEY}:seed`,
    Math.floor(Math.random() * 1_000_000)
  );
  const questions = useMemo(() => {
    void seed;
    return shuffle(currentChapter.questions).map((q) => ({
      ...q,
      choices: shuffle(q.choices),
    }));
  }, [seed, chapter, currentChapter.questions]);

  const [idx, setIdx] = usePersistentState(`${STORAGE_KEY}:idx`, 0);
  const [answers, setAnswers] = usePersistentState(
    `${STORAGE_KEY}:answers`,
    {}
  );
  const [showFeedback, setShowFeedback] = usePersistentState(
    `${STORAGE_KEY}:showFeedback`,
    false
  );
  const [finished, setFinished] = usePersistentState(
    `${STORAGE_KEY}:finished`,
    false
  );

  const current = questions[idx];
  const total = questions.length;
  const correctCount = useMemo(
    () =>
      Object.entries(answers).reduce((acc, [qid, choiceId]) => {
        const q = questions.find((x) => x.id === qid);
        return acc + (q && q.answerId === choiceId ? 1 : 0);
      }, 0),
    [answers, questions]
  );

  // Timer
  useEffect(() => {
    if (!withTimer || finished) return;
    if (secondsLeft <= 0) {
      setFinished(true);
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [withTimer, finished, secondsLeft, setFinished, setSecondsLeft]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (finished) return;
      if (["1", "2", "3", "4"].includes(e.key)) {
        const pos = parseInt(e.key, 10) - 1;
        const choice = current?.choices[pos];
        if (choice) handleAnswer(choice.id);
      }
      if (e.key === "Enter" && showFeedback) handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, finished, showFeedback]);

  const handleAnswer = (choiceId) => {
    if (!current || answers[current.id]) return;
    setAnswers({ ...answers, [current.id]: choiceId });
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (idx + 1 < total) setIdx(idx + 1);
    else setFinished(true);
  };

  const resetAll = () => {
    setIdx(0);
    setAnswers({});
    setShowFeedback(false);
    setFinished(false);
    setSecondsLeft(TOTAL_SECONDS);
    setSeed(Math.floor(Math.random() * 1_000_000));
  };

  const pct = (Object.keys(answers).length / total) * 100;
  const scorePct = Math.round((correctCount / total) * 100);
  const timeFmt = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const timeSpent = withTimer ? TOTAL_SECONDS - secondsLeft : null;

  const ReviewList = () => (
    <div className="space-y-6">
      {questions.map((q, i) => {
        const user = answers[q.id];
        const ok = user === q.answerId;
        return (
          <Card key={q.id} className="p-4">
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 h-6 w-6 shrink-0 rounded-full ${
                  ok ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <div className="space-y-2">
                <h4 className="font-semibold">
                  {i + 1}. {q.prompt}
                </h4>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {q.choices.map((c) => (
                    <li
                      key={c.id}
                      className={`rounded-lg border px-3 py-2 ${
                        c.id === q.answerId
                          ? "border-emerald-500"
                          : "border-white/10"
                      } ${
                        c.id === user
                          ? `ring-2 ring-offset-2 ${brand.accentRing}`
                          : ""
                      }`}
                    >
                      <span className="opacity-80">{c.text}</span>
                    </li>
                  ))}
                </ul>
                <p className={`text-sm ${brand.subtle}`}>
                  <span className="font-semibold">Explicație:</span>{" "}
                  {q.explanation}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-zinc-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight`}>
          <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Quiz: {currentChapter.title}
          </span>
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className={brand.subtle}>Capitol:</span>
            <select
              value={chapter}
              onChange={(e) => {
                setChapter(e.target.value);
                resetAll();
              }}
              className="bg-zinc-800 rounded px-2 py-1 border border-white/10"
            >
              {Object.entries(BASE_QUESTIONS).map(([key, { title }]) => (
                <option key={key} value={key}>
                  {title}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-amber-500"
              checked={withTimer}
              onChange={(e) => setWithTimer(e.target.checked)}
            />
            <span className={brand.subtle}>Timer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-amber-500"
              checked={compact}
              onChange={(e) => setCompact(e.target.checked)}
            />
            <span className={brand.subtle}>Compact</span>
          </label>
          {withTimer && !finished && (
            <span
              className={`font-mono px-2 py-1 rounded-md border ${
                secondsLeft < 30
                  ? "animate-pulse border-rose-500"
                  : "border-white/10"
              }`}
            >
              {timeFmt(secondsLeft)}
            </span>
          )}
        </div>
      </div>

      {/* Main card */}
      <Card className="p-4 sm:p-6 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Progress value={finished ? 100 : pct} />
          <span className={`text-sm ${brand.subtle} whitespace-nowrap`}>
            {Math.min(idx + 1, total)} / {total}
          </span>
        </div>
        {!finished ? (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">
              {current.prompt}
            </h3>
            <div
              className={`grid grid-cols-1 ${
                compact ? "" : "sm:grid-cols-2"
              } gap-3`}
            >
              {current.choices.map((c, i) => {
                const selected = answers[current.id] === c.id;
                const correct = c.id === current.answerId;
                const show = showFeedback;
                return (
                  <Button
                    key={c.id}
                    onClick={() => handleAnswer(c.id)}
                    disabled={!!answers[current.id]}
                    className={`justify-start text-left ${
                      selected ? `ring-2 ${brand.accentRing} ring-offset-0` : ""
                    } ${
                      show && correct
                        ? "bg-emerald-600/15 border-emerald-500"
                        : ""
                    } ${
                      show && selected && !correct
                        ? "bg-rose-600/15 border-rose-500"
                        : ""
                    }`}
                  >
                    <span className={`text-sm ${brand.subtle} mr-2`}>
                      {i + 1}.
                    </span>{" "}
                    {c.text}
                  </Button>
                );
              })}
            </div>

            {showFeedback && (
              <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm">
                  <span className="font-semibold">Explicație:</span>{" "}
                  {current.explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className={`text-sm ${brand.subtle}`}>
                Scor curent:{" "}
                <span className="font-semibold text-white">{correctCount}</span>{" "}
                / {total}
              </div>
              <div className="flex items-center gap-2">
                <Ghost onClick={resetAll}>Restart</Ghost>
                <Button
                  onClick={handleNext}
                  disabled={!showFeedback}
                  className="bg-amber-600 border-amber-600 text-white font-bold hover:bg-amber-500"
                >
                  {idx + 1 < total ? "Următorul" : "Finalizează"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-500 text-black grid place-items-center font-bold">
                {correctCount}
              </div>
              <div>
                <h3 className="text-xl font-bold">Rezultat final</h3>
                <p className={brand.subtle + " text-sm"}>
                  Ai răspuns corect la{" "}
                  <span className="font-semibold text-white">
                    {correctCount}
                  </span>{" "}
                  din <span className="font-semibold text-white">{total}</span>{" "}
                  întrebări (
                  <span className="font-semibold text-white">{scorePct}%</span>
                  ).
                  {withTimer && (
                    <>
                      {" "}
                      Ai terminat în{" "}
                      <span className="font-mono text-white">
                        {timeFmt(Math.max(0, timeSpent || 0))}
                      </span>
                      .
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Verdict row */}
            {(() => {
              const v = verdict(scorePct, chapter);
              return (
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Badge tone={v.tone}>{v.label}</Badge>
                    <p className="text-sm">{v.line}</p>
                  </div>
                </Card>
              );
            })()}

            <div className="flex items-center gap-2">
              <Ghost onClick={resetAll}>Refă quiz-ul</Ghost>
            </div>
            <div className="pt-2">
              <h4 className="font-semibold mb-2">
                Revizuiește toate întrebările
              </h4>
              <ReviewList />
            </div>
          </div>
        )}
      </Card>

      {/* Tips */}
      <Card className="p-4 sm:p-6">
        <h4 className="font-semibold mb-2">Sfaturi de utilizare</h4>
        <ul className={`list-disc pl-5 space-y-1 text-sm ${brand.subtle}`}>
          <li>
            Poți apăsa tastele <span className="font-mono">1–4</span> pentru a
            alege rapid un răspuns.
          </li>
          <li>
            <span className="font-mono">Enter</span> trece la următoarea
            întrebare după ce se afișează feedback-ul.
          </li>
          <li>
            Activează <span className={brand.accentText}>Timer</span> pentru o
            experiență mai „exam-like”.
          </li>
          <li>
            Activează <span className={brand.accentText}>Compact</span> pentru
            layout pe o singură coloană - valabil doar pentru desktop/laptop.
          </li>
        </ul>
      </Card>
      <div style={{ padding: 16 }}>
        <BuyStopTrainer
          resistance={{
            mode: "pct",
            topPctDesktop: 0.18,
            heightPctDesktop: 0.09,
            topPctMobile: 0.19,
            heightPctMobile: 0.10,
          }}
          aspect={16 / 11}
          enableHaptics
        />
      </div>
    </div>
  );
};

export default Test;
