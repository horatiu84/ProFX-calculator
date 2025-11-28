import React, { useEffect, useMemo, useState } from "react";
import BuyStopTrainer from "./components/BuyStopTrainer";
import BuyTPSLTrainer from "./components/TpSlTrainer";
import { useLanguage } from "./contexts/LanguageContext";
import { BASE_QUESTIONS } from "./data/quizData";
import { BASE_QUESTIONS_EN } from "./data/quizDataEN";

// ──────────────────────────────────────────────────────────────────────────────
// Brand style
// ──────────────────────────────────────────────────────────────────────────────
const brand = {
  accentText: "text-amber-400",
  accentBg: "bg-amber-500",
  accentRing: "ring-amber-500",
  // Glassmorphism card base similar cu Evolutie.jsx
  card:
    "group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden shadow-lg",
  subtle: "text-zinc-300/90",
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
    rose: "bg-transparent text-gray-400 border border-gray-500/30",
    amber: "bg-transparent text-amber-400 border border-amber-500/30",
    sky: "bg-transparent text-white border border-white/20",
    emerald: "bg-transparent text-gray-300 border border-gray-500/30",
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
const Card = ({ className = "", children, accent = "amber" }) => {
  const accentMap = {
    amber: "from-amber-500/5",
    blue: "from-blue-500/5",
    emerald: "from-emerald-500/5",
    sky: "from-sky-500/5",
  };
  const fromClass = accentMap[accent] || accentMap.amber;
  return (
    <div className={`${brand.card} ${className}`}>
      {/* Background gradient effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${fromClass} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Button = ({ className = "", children, ...props }) => (
  <button
    className={`px-4 py-2 rounded-xl font-semibold border border-gray-600/50 bg-gray-800/50 text-white hover:bg-gray-700/50 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Ghost = ({ className = "", children, ...props }) => (
  <button
    className={`px-3 py-2 rounded-xl border border-gray-600/50 bg-gray-800/30 hover:bg-gray-700/30 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all duration-300 ${className}`}
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
function verdict(pct, chapter, t) {
  if (chapter === "inflatie") {
    if (pct < 30)
      return {
        label: t.verdictWeak,
        tone: "rose",
        line: t.inflationWeakMsg,
      };
    if (pct < 60)
      return {
        label: t.verdictMediacre,
        tone: "amber",
        line: t.inflationMediacreMsg,
      };
    if (pct < 90)
      return {
        label: t.verdictGood,
        tone: "sky",
        line: t.inflationGoodMsg,
      };
    if (pct < 100)
      return {
        label: t.verdictExcellent,
        tone: "emerald",
        line: t.inflationExcellentMsg,
      };
    return {
      label: t.verdictTop,
      tone: "gold",
      line: t.inflationTopMsg,
    };
  } else {
    if (pct < 30)
      return {
        label: t.verdictWeak,
        tone: "rose",
        line: t.genericWeakMsg,
      };
    if (pct < 60)
      return {
        label: t.verdictMediacre,
        tone: "amber",
        line: t.genericMediacreMsg,
      };
    if (pct < 90)
      return {
        label: t.verdictGood,
        tone: "sky",
        line: t.genericGoodMsg,
      };
    if (pct < 100)
      return {
        label: t.verdictExcellent,
        tone: "emerald",
        line: t.genericExcellentMsg,
      };
    return {
      label: t.verdictTop,
      tone: "gold",
      line: t.genericTopMsg,
    };
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────────────────────
const Test = () => {
  const { language, translations } = useLanguage();
  const t = translations;
  
  // Select quiz data based on current language
  const QUIZ_DATA = language === 'en' ? BASE_QUESTIONS_EN : BASE_QUESTIONS;
  
  const [chapter, setChapter] = usePersistentState(
    `${STORAGE_KEY}:chapter`,
    "inflatie"
  );
  const currentChapter = QUIZ_DATA[chapter];

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
          <Card key={q.id} className="p-4" accent="emerald">
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 h-6 w-6 shrink-0 rounded-full ${
                  ok ? "bg-white" : "bg-red-500"
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
    <div key={language} className="max-w-4xl mx-auto p-4 sm:p-6 text-zinc-100 animate-language-change">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight`}>
          <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            {t.test.quizTitle} {currentChapter.title}
          </span>
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2 relative">
            <span className={brand.subtle}>{t.test.chapter}</span>
            {/* Custom Glassmorphism Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-gray-900/30 backdrop-blur-lg rounded-xl px-4 py-2.5 border border-gray-700/40 text-white hover:bg-gray-900/50 hover:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-amber-500/20 font-medium flex items-center gap-2 min-w-[220px] justify-between"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
                }}
              >
                <span>{currentChapter.title}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  {/* Backdrop to close dropdown when clicking outside */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setDropdownOpen(false)}
                  />
                  
                  {/* Menu Items */}
                  <div className="absolute top-full left-0 mt-2 min-w-[220px] bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/80 shadow-2xl shadow-black/50 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    {Object.entries(QUIZ_DATA).map(([key, { title }]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setChapter(key);
                          resetAll();
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 transition-all duration-200 font-medium ${
                          chapter === key 
                            ? 'bg-amber-500/90 text-white font-bold shadow-lg' 
                            : 'text-gray-200 hover:bg-gray-700/80 hover:text-white'
                        }`}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-amber-500"
              checked={withTimer}
              onChange={(e) => setWithTimer(e.target.checked)}
            />
            <span className={brand.subtle}>{t.test.timer}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-amber-500"
              checked={compact}
              onChange={(e) => setCompact(e.target.checked)}
            />
            <span className={brand.subtle}>{t.test.compact}</span>
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
  <Card className="p-4 sm:p-6 mb-4" accent="amber">
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
                        ? "bg-white/5 border-white/30"
                        : ""
                    } ${
                      show && selected && !correct
                        ? "bg-red-500/10 border-red-500/50"
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
              <div className="mt-2 p-3 rounded-xl bg-gray-800/40 border border-gray-600/40">
                <p className="text-sm">
                  <span className="font-semibold">{t.test.explanation}</span>{" "}
                  {current.explanation}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className={`text-sm ${brand.subtle}`}>
                {t.test.currentScore}{" "}
                <span className="font-semibold text-white">{correctCount}</span>{" "}
                {t.test.of} {total}
              </div>
              <div className="flex items-center gap-2">
                <Ghost onClick={resetAll}>{t.test.restart}</Ghost>
                <Button
                  onClick={handleNext}
                  disabled={!showFeedback}
                  className="bg-amber-600 border-amber-600 text-white font-bold hover:bg-amber-500"
                >
                  {idx + 1 < total ? t.next : t.finish}
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
                <h3 className="text-xl font-bold">{t.test.finalResult}</h3>
                <p className={brand.subtle + " text-sm"}>
                  {t.test.answeredCorrectly}{" "}
                  <span className="font-semibold text-white">
                    {correctCount}
                  </span>{" "}
                  {t.test.outOf} <span className="font-semibold text-white">{total}</span>{" "}
                  {t.test.questions} (
                  <span className="font-semibold text-white">{scorePct}%</span>
                  ).
                  {withTimer && (
                    <>
                      {" "}
                      {t.test.completedIn}{" "}
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
              const v = verdict(scorePct, chapter, t);
              return (
                <Card className="p-4" accent="sky">
                  <div className="flex items-center gap-3">
                    <Badge tone={v.tone}>{v.label}</Badge>
                    <p className="text-sm">{v.line}</p>
                  </div>
                </Card>
              );
            })()}

            <div className="flex items-center gap-2">
              <Ghost onClick={resetAll}>{t.test.retakeQuiz}</Ghost>
            </div>
            <div className="pt-2">
              <h4 className="font-semibold mb-2">
                {t.test.reviewAll}
              </h4>
              <ReviewList />
            </div>
          </div>
        )}
      </Card>

      {/* Tips */}
      <Card className="p-4 sm:p-6" accent="blue">
        <h4 className="font-semibold mb-2">{t.test.usageTips}</h4>
        <ul className={`list-disc pl-5 space-y-1 text-sm ${brand.subtle}`}>
          <li>
            {t.test.tip1} <span className="font-mono">1–4</span> {t.test.tip1Continue}
          </li>
          <li>
            <span className="font-mono">Enter</span> {t.test.tip2}
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
      <div style={{ padding: 16, marginBottom: 60 }}>
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
      <BuyTPSLTrainer />
    </div>
  );
};

export default Test;
