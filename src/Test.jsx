import React, { useEffect, useMemo, useState } from "react";

/**
 * ProFX – Inflation & Forex Quiz (10 questions) – with Ratings & Timer Summary
 *  - Categories: <30% Slab, <60% Mediocru, <90% Bun, 100% Top
 *  - If timer is on, show finishing time
 */

const brand = {
  accentText: "text-amber-400",
  accentBg: "bg-amber-500",
  accentRing: "ring-amber-500",
  card: "rounded-2xl shadow-lg border border-white/10 bg-zinc-900/70 backdrop-blur",
  subtle: "text-zinc-300/90",
};

// ──────────────────────────────────────────────────────────────────────────────
// Data – 10 questions based on the "Curs Inflatie Forex" PDF
// ──────────────────────────────────────────────────────────────────────────────

const BASE_QUESTIONS = [
  {
    id: "q1",
    prompt: "Ce descrie cel mai bine inflația într-o economie?",
    choices: [
      { id: "a", text: "Scăderea susținută a prețurilor și creșterea puterii de cumpărare" },
      { id: "b", text: "Creșterea generală și susținută a prețurilor bunurilor și serviciilor" },
      { id: "c", text: "Creșterea salariilor în ritm cu productivitatea" },
      { id: "d", text: "Reducerea masei monetare în circulație" },
    ],
    answerId: "b",
    explanation: "Inflația = creșterea susținută a prețurilor; erodează puterea de cumpărare.",
  },
  {
    id: "q2",
    prompt: "Care indicator este cel mai folosit pentru a măsura inflația la consumatori?",
    choices: [
      { id: "a", text: "PPI (Indicele Prețurilor Producătorilor)" },
      { id: "b", text: "PIB (Produsul Intern Brut)" },
      { id: "c", text: "IPC (Indicele Prețurilor de Consum)" },
      { id: "d", text: "Rata șomajului" },
    ],
    answerId: "c",
    explanation: "IPC măsoară variația medie a prețurilor unui coș de bunuri și servicii; Core CPI exclude alimentele și energia.",
  },
  {
    id: "q3",
    prompt: "Inflația prin cerere (demand-pull) apare atunci când…",
    choices: [
      { id: "a", text: "costurile de producție cresc brusc" },
      { id: "b", text: "cererea totală depășește capacitatea de producție a economiei" },
      { id: "c", text: "banca centrală reduce rata dobânzii" },
      { id: "d", text: "moneda se apreciază pe piețele externe" },
    ],
    answerId: "b",
    explanation: "Demand-pull = prea mulți bani urmăresc prea puține bunuri; presiunea vine din partea cererii agregate.",
  },
  {
    id: "q4",
    prompt: "Ce descrie corect disinflația?",
    choices: [
      { id: "a", text: "Prețurile scad pe scară largă (opusul inflației)" },
      { id: "b", text: "Prețurile cresc, dar într-un ritm mai lent decât înainte" },
      { id: "c", text: "Creștere economică negativă cu inflație ridicată" },
      { id: "d", text: "Înghețarea prețurilor de către guvern" },
    ],
    answerId: "b",
    explanation: "Disinflația = încetinirea ritmului de creștere a prețurilor, nu scăderea lor efectivă (aceea ar fi deflație).",
  },
  {
    id: "q5",
    prompt: "Care este particularitatea stagflației?",
    choices: [
      { id: "a", text: "Inflație scăzută, șomaj redus, creștere rapidă" },
      { id: "b", text: "Inflație ridicată, stagnare/contracție economică și șomaj mare" },
      { id: "c", text: "Deflație persistentă cu cerere ridicată" },
      { id: "d", text: "Aprecierea monedei și exporturi în creștere" },
    ],
    answerId: "b",
    explanation: "Stagflația combină inflație ridicată cu creștere economică slabă și șomaj ridicat; exemplu clasic: criza petrolului din 1973.",
  },
  {
    id: "q6",
    prompt: "Cum afectează de obicei o inflație ridicată cursul unei monede, prin reacția băncii centrale?",
    choices: [
      { id: "a", text: "Banca centrală scade rata dobânzii, iar moneda se depreciază" },
      { id: "b", text: "Banca centrală crește rata dobânzii, ceea ce poate întări moneda" },
      { id: "c", text: "Nu există nicio legătură între dobânzi și cursul valutar" },
      { id: "d", text: "Banca centrală tipărește bani pentru a aprecia moneda" },
    ],
    answerId: "b",
    explanation: "Ratele mai mari atrag capital străin în căutare de randamente, crescând cererea pentru monedă și aprecierea ei.",
  },
  {
    id: "q7",
    prompt: "Care dintre următoarele este ADEVĂRAT despre deflație?",
    choices: [
      { id: "a", text: "Este mereu benefică pe termen lung" },
      { id: "b", text: "Se manifestă prin creșterea generală a prețurilor" },
      { id: "c", text: "Poate declanșa amânarea consumului și o spirală economică negativă" },
      { id: "d", text: "Nu are legătură cu șomajul" },
    ],
    answerId: "c",
    explanation: "Deflația reduce consumul (oamenii așteaptă prețuri și mai mici), ceea ce poate tăia producția și crește șomajul.",
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
    explanation: "Inflație galopantă/pe alocuri hiperinflație în Turcia în perioada 2021-2023.",
  },
  {
    id: "q9",
    prompt: "Ce *combină* o analiză Forex informată despre inflație?",
    choices: [
      { id: "a", text: "Doar analiza tehnică; fundamentalul e opțional" },
      { id: "b", text: "Doar analiza fundamentală; tehnicul distrage" },
      { id: "c", text: "Atât analiza fundamentală (CPI, PPI, dobânzi) cât și analiza tehnică" },
      { id: "d", text: "Exclusiv știri politice" },
    ],
    answerId: "c",
    explanation: "îmbinarea fundamentalului (date de inflație, decizii de dobândă) cu tehnicul (modele de preț/indicatori).",
  },
  {
    id: "q10",
    prompt: "Care dintre următoarele *nu* este un exemplu de disinflație?",
    choices: [
      { id: "a", text: "Rata inflației scade de la 10% la 5%" },
      { id: "b", text: "Rata inflației scade de la 5% la 2%" },
      { id: "c", text: "Prețurile scad efectiv în medie în economie" },
      { id: "d", text: "Banca centrală ridică dobânzile, iar creșterea prețurilor încetinește" },
    ],
    answerId: "c",
    explanation: "Când prețurile scad efectiv vorbim de deflație, nu de disinflație. Disinflația = încetinirea ritmului de creștere a prețurilor.",
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "profx-inflation-quiz-v3";
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
    } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
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
  return <span className={`px-2 py-1 rounded-md text-xs font-semibold ${map[tone] || map.neutral}`}>{children}</span>;
};

// UI primitives
const Card = ({ className = "", children }) => (
  <div className={`${brand.card} ${className}`}>{children}</div>
);

const Button = ({ className = "", children, ...props }) => (
  <button
    className={`px-4 py-2 rounded-xl font-semibold border border-white/10 bg-zinc-800/70 hover:bg-zinc-800 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >{children}</button>
);

const Ghost = ({ className = "", children, ...props }) => (
  <button className={`px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 ${className}`} {...props}>{children}</button>
);

const Progress = ({ value }) => (
  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
    <div className={`h-full ${brand.accentBg}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

// Verdict helper
function verdict(pct) {
  if (pct < 30) return { label: "Slab", tone: "rose", line: "E ok, abia începi. Reia pe scurt: definiția inflației, CPI vs Core CPI, tipuri (disinflație/deflație) și legătura dobânzi–monedă." };
  if (pct < 60) return { label: "Mediocru", tone: "amber", line: "Progres vizibil. Încă 10 minute de recap pe stagflație și mecanismul ratei dobânzii te duc peste 60%." };
  if (pct < 90) return { label: "Bun", tone: "sky", line: "Foarte bine! Mai finisează nuanțele (ex: disinflație vs deflație) și ești gata de next level." };
  if (pct < 100) return { label: "Excelent", tone: "emerald", line: "Aproape perfect. Un mic refresh la exemple (Turcia 2021–2023) și e 10/10." };
  return { label: "Top", tone: "gold", line: "Legendă 🏆 – ai stăpânit complet lecția. Treci liniștit la capitolul următor." };
}

// ──────────────────────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────────────────────
const Test = () => {
  const [withTimer, setWithTimer] = usePersistentState(`${STORAGE_KEY}:withTimer`, false);
  const [secondsLeft, setSecondsLeft] = usePersistentState(`${STORAGE_KEY}:secondsLeft`, TOTAL_SECONDS);
  const [compact, setCompact] = usePersistentState(`${STORAGE_KEY}:compact`, false);

  const [seed] = usePersistentState(`${STORAGE_KEY}:seed`, Math.floor(Math.random() * 1_000_000));
  const questions = useMemo(() => {
    void seed; return shuffle(BASE_QUESTIONS).map((q) => ({ ...q, choices: shuffle(q.choices) }));
  }, [seed]);

  const [idx, setIdx] = usePersistentState(`${STORAGE_KEY}:idx`, 0);
  const [answers, setAnswers] = usePersistentState(`${STORAGE_KEY}:answers`, {});
  const [showFeedback, setShowFeedback] = usePersistentState(`${STORAGE_KEY}:showFeedback`, false);
  const [finished, setFinished] = usePersistentState(`${STORAGE_KEY}:finished`, false);

  const current = questions[idx];
  const total = questions.length;
  const correctCount = useMemo(() => Object.entries(answers).reduce((acc, [qid, choiceId]) => {
    const q = questions.find((x) => x.id === qid);
    return acc + (q && q.answerId === choiceId ? 1 : 0);
  }, 0), [answers, questions]);

  // Timer
  useEffect(() => {
    if (!withTimer || finished) return;
    if (secondsLeft <= 0) { setFinished(true); return; }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [withTimer, finished, secondsLeft]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (finished) return;
      if (["1", "2", "3", "4"].includes(e.key)) {
        const pos = parseInt(e.key, 10) - 1; const choice = current?.choices[pos];
        if (choice) handleAnswer(choice.id);
      }
      if (e.key === "Enter" && showFeedback) handleNext();
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [current, finished, showFeedback]);

  const handleAnswer = (choiceId) => {
    if (!current || answers[current.id]) return;
    setAnswers({ ...answers, [current.id]: choiceId });
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (idx + 1 < total) setIdx(idx + 1); else setFinished(true);
  };

  const resetAll = () => {
    setIdx(0); setAnswers({}); setShowFeedback(false); setFinished(false); setSecondsLeft(TOTAL_SECONDS);
  };

  const pct = (Object.keys(answers).length / total) * 100;
  const scorePct = Math.round((correctCount / total) * 100);
  const timeFmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const timeSpent = withTimer ? (TOTAL_SECONDS - secondsLeft) : null;

  const ReviewList = () => (
    <div className="space-y-6">
      {questions.map((q, i) => {
        const user = answers[q.id]; const ok = user === q.answerId;
        return (
          <Card key={q.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className={`mt-1 h-6 w-6 shrink-0 rounded-full ${ok ? "bg-emerald-500" : "bg-rose-500"}`} />
              <div className="space-y-2">
                <h4 className="font-semibold">{i + 1}. {q.prompt}</h4>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {q.choices.map((c) => (
                    <li key={c.id} className={`rounded-lg border px-3 py-2 ${c.id === q.answerId ? "border-emerald-500" : "border-white/10"} ${c.id === user ? `ring-2 ring-offset-2 ${brand.accentRing}` : ""}`}>
                      <span className="opacity-80">{c.text}</span>
                    </li>
                  ))}
                </ul>
                <p className={`text-sm ${brand.subtle}`}><span className="font-semibold">Explicație:</span> {q.explanation}</p>
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
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight`}>
          <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Quiz: Inflație & Forex</span>
        </h2>
        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="accent-amber-500" checked={withTimer} onChange={(e) => setWithTimer(e.target.checked)} />
            <span className={brand.subtle}>Timer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="accent-amber-500" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
            <span className={brand.subtle}>Compact</span>
          </label>
          {withTimer && !finished && (
            <span className={`font-mono px-2 py-1 rounded-md border ${secondsLeft < 30 ? "animate-pulse border-rose-500" : "border-white/10"}`}>{timeFmt(secondsLeft)}</span>
          )}
        </div>
      </div>

      {/* Main card */}
      <Card className="p-4 sm:p-6 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Progress value={finished ? 100 : pct} />
          <span className={`text-sm ${brand.subtle} whitespace-nowrap`}>{Math.min(idx + 1, total)} / {total}</span>
        </div>
        {!finished ? (
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold">{current.prompt}</h3>
            <div className={`grid grid-cols-1 ${compact ? "" : "sm:grid-cols-2"} gap-3`}>
              {current.choices.map((c, i) => {
                const selected = answers[current.id] === c.id;
                const correct = c.id === current.answerId;
                const show = showFeedback;
                return (
                  <Button
                    key={c.id}
                    onClick={() => handleAnswer(c.id)}
                    disabled={!!answers[current.id]}
                    className={`justify-start text-left ${selected ? `ring-2 ${brand.accentRing} ring-offset-0` : ""} ${show && correct ? "bg-emerald-600/15 border-emerald-500" : ""} ${show && selected && !correct ? "bg-rose-600/15 border-rose-500" : ""}`}
                  >
                    <span className={`text-sm ${brand.subtle} mr-2`}>{i + 1}.</span> {c.text}
                  </Button>
                );
              })}
            </div>

            {showFeedback && (
              <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm"><span className="font-semibold">Explicație:</span> {current.explanation}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className={`text-sm ${brand.subtle}`}>Scor curent: <span className="font-semibold text-white">{correctCount}</span> / {total}</div>
              <div className="flex items-center gap-2">
                <Ghost onClick={resetAll}>Restart</Ghost>
                <Button onClick={handleNext} disabled={!showFeedback} className="bg-amber-600 border-amber-600 text-white font-bold hover:bg-amber-500">{idx + 1 < total ? "Următorul" : "Finalizează"}</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-500 text-black grid place-items-center font-bold">{correctCount}</div>
              <div>
                <h3 className="text-xl font-bold">Rezultat final</h3>
                <p className={brand.subtle + " text-sm"}>Ai răspuns corect la <span className="font-semibold text-white">{correctCount}</span> din <span className="font-semibold text-white">{total}</span> întrebări (<span className="font-semibold text-white">{scorePct}%</span>).
                  {withTimer && (
                    <> Ai terminat în <span className="font-mono text-white">{timeFmt(Math.max(0, timeSpent || 0))}</span>.</>
                  )}
                </p>
              </div>
            </div>

            {/* Verdict row */}
            {(() => { const v = verdict(scorePct); return (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Badge tone={v.tone}>{v.label}</Badge>
                  <p className="text-sm">{v.line}</p>
                </div>
              </Card>
            ); })()}

            <div className="flex items-center gap-2">
              <Ghost onClick={resetAll}>Refă quiz-ul</Ghost>
            </div>
            <div className="pt-2">
              <h4 className="font-semibold mb-2">Revizuiește toate întrebările</h4>
              <ReviewList />
            </div>
          </div>
        )}
      </Card>

      {/* Tips */}
      <Card className="p-4 sm:p-6">
        <h4 className="font-semibold mb-2">Sfaturi de utilizare</h4>
        <ul className={`list-disc pl-5 space-y-1 text-sm ${brand.subtle}`}>
          <li>Poți apăsa tastele <span className="font-mono">1–4</span> pentru a alege rapid un răspuns.</li>
          <li><span className="font-mono">Enter</span> trece la următoarea întrebare după ce se afișează feedback-ul.</li>
          <li>Activează <span className={brand.accentText}>Timer</span> pentru o experiență mai „exam-like”.</li>
          <li>Activează <span className={brand.accentText}>Compact</span> pentru layout pe o singură coloană - valabil doar pentru desktop/laptop.</li>
        </ul>
      </Card>
    </div>
  );
};

export default Test;
