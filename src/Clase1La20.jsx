import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

const ProFXChecklist = () => {
  const STORAGE_KEY = "profx-checklist-progress";
  const SESSION_KEY = "profx-checklist-auth";
  const CORRECT_PASSWORD = "mentori";

  // Verifică dacă userul este autentificat în sesiunea curentă
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Încarcă progresul salvat din localStorage
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Error loading progress:", error);
      return {};
    }
  });

  // Salvează progresul în localStorage de fiecare dată când se modifică
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }, [checkedItems]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Parolă incorectă. Încearcă din nou.");
      setPassword("");
    }
  };

  // Dacă nu este autentificat, afișează formularul de parolă
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/Chart.png')` }}
        />
        <div className="fixed inset-0 bg-gradient-to-br from-gray-950/95 via-black/90 to-gray-950/95" />
        <div className="relative z-10 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 shadow-2xl max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <span className="text-4xl">🎯</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Acces Clasa 1 La 20
          </h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Introdu parola pentru a accesa Clasa 1 la 20
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Introdu parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all"
              autoFocus
            />
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 hover:scale-105 active:scale-95"
            >
              Accesează Clasa 1 La 20
            </button>
          </form>
        </div>
      </div>
    );
  }

  const checklistData = [
    {
      id: "broker",
      title: "Cum faci cont la broker (FPM Trading) live și demo",
      subtasks: [
        "Simulare creare cont",
        "Ne logăm în contul educatorului și facem un cont demo",
        "Cum facem un cont real",
        "Notăm datele contului real și demo",
        "Avem acces la suport live în limba română dacă întâmpinăm probleme în platforma FPM Trading",
      ],
    },
    {
      id: "download",
      title:
        "Descărcare MT5 pe telefon (Android și iOS) și pe desktop (Windows și Mac)",
      subtasks: [
        "De unde descărcăm platforma FPM Trading?",
        "Link cu tutoriale cum descărcăm și instalăm platforma de trading - https://app.profx.ro/?tab=educatie",
      ],
    },
    {
      id: "login",
      title: "Cum te loghezi pe MT5",
      subtasks: [],
    },
    {
      id: "platforms",
      title: "Explicare platforme MT5 și TradingView",
      subtasks: [
        "Aranjarea și explicarea panourilor",
        "Funcționalitatea butoanelor pe care le folosim mai des",
        "Intervalele temporare",
        "Instrumente și perechi valutare ce se pot tranzacționa",
        "Cum deschidem un grafic",
        "De unde intrăm în tranzacții",
      ],
    },
    {
      id: "candles",
      title: "Ce sunt lumânările?",
      subtasks: [],
    },
    {
      id: "costs",
      title: "Costuri de tranzacționare",
      subtasks: ["Spread", "Comision", "Swap"],
    },
    {
      id: "leverage",
      title: "Ce este levierul și lotul de tranzacționare?",
      subtasks: [],
    },
    {
      id: "sessions",
      title: "Sesiunile de tranzacționare",
      subtasks: [
        "Exemplu pe TradingView cu indicator sesiuni de tranzacționare",
      ],
    },
    {
      id: "structure",
      title: "Suport, rezistență și structura pieței",
      subtasks: ["Trend ascendent", "Trend descendent", "Consolidare"],
    },
    {
      id: "risk",
      title:
        "Managementul riscului - Cel mai important capitol după psihologie",
      subtasks: [
        "Lecția 6 - YouTube Tutorial: https://www.youtube.com/watch?v=KiNxfiHhU8I&t=50s",
        "Cum să îți protejezi capitalul pentru a nu pierde contul și a tranzacționa pe termen lung",
        "Nu risca niciodată mai mult de 1–2% din capital pe un singur trade",
        "Folosește mereu stop loss",
        "Nu intra în piață fără un plan clar unde ieși dacă ideea se invalidează",
        "Acceptă că vei avea pierderi. Sunt parte din joc – important este să fie mici",
        "Construiește-ți disciplina. Respectă regulile chiar și atunci când emoțiile îți spun altceva",
        "Ține un jurnal de tranzacționare. Notează ce faci și învață din greșeli",
        "Conservă capitalul. Obiectivul nr. 1 nu e să faci bani repede, ci să înveți",
      ],
    },
    {
      id: "videos",
      title: "De urmărit lecțiile basic gratuite 1–10 pe YouTube",
      subtasks: [],
    },
    {
      id: "feedback",
      title:
        "La sfârșitul fiecărei clase - curricula + înregistrare + feedback",
      subtasks: [],
    },
  ];

  const toggleItem = (itemId, subtaskIndex = null) => {
    setCheckedItems((prev) => {
      const updated = { ...prev };

      // Dacă se bifează un subtask
      if (subtaskIndex !== null) {
        const key = `${itemId}-${subtaskIndex}`;
        updated[key] = !prev[key];
        const item = checklistData.find((i) => i.id === itemId);
        if (item && item.subtasks.length > 0) {
          const allSubtasksChecked = item.subtasks.every((_, idx) =>
            updated[`${itemId}-${idx}`]
          );
          updated[itemId] = allSubtasksChecked;
        }
      } else {
        const newState = !prev[itemId];
        updated[itemId] = newState;
        const item = checklistData.find((i) => i.id === itemId);
        if (item && item.subtasks.length > 0) {
          item.subtasks.forEach((_, idx) => {
            updated[`${item.id}-${idx}`] = newState;
          });
        }
      }
      return updated;
    });
  };

  const resetProgress = () => {
    setCheckedItems({});
  };

  const getProgress = () => {
    let total = checklistData.length;
    checklistData.forEach((item) => {
      total += item.subtasks.length;
    });
    const completed = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  // ✅ Funcție care transformă linkurile în clickable
  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300 transition"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/Chart.png')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950/90 via-black/90 to-gray-950/90" />
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-8 mb-4 sm:mb-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">📚</span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-white mb-1">
                    Clasa 1 la 20
                  </h1>
                  <p className="text-sm sm:text-base text-gray-300">
                    Parcurge toate elementele pentru a finaliza modulul
                  </p>
                </div>
              </div>
              <button
                onClick={resetProgress}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95 text-sm sm:text-base w-full sm:w-auto"
              >
                Reset Progres
              </button>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 sm:mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-300">
                  Progres general
                </span>
                <span className="text-xs sm:text-sm font-bold text-yellow-400">
                  {getProgress()}%
                </span>
              </div>
              <div className="w-full h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>
          </div>
          {/* Checklist */}
          <div className="space-y-3 sm:space-y-4">
            {checklistData.map((item, index) => (
              <div
                key={item.id}
                className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 shadow-xl hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg border-2 transition-all duration-300 flex items-center justify-center mt-0.5 sm:mt-1 ${
                      checkedItems[item.id]
                        ? "bg-gradient-to-br from-green-400 to-emerald-500 border-green-400 shadow-lg shadow-green-500/50"
                        : "border-gray-500 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/30"
                    }`}
                  >
                    {checkedItems[item.id] && (
                      <Check
                        className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                        {index + 1}
                      </span>
                      <h3
                        className={`text-base sm:text-lg font-semibold transition-all duration-300 break-words ${
                          checkedItems[item.id]
                            ? "text-gray-500 line-through opacity-60"
                            : "text-white"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                    {item.subtasks.length > 0 && (
                      <div className="mt-3 sm:mt-4 ml-9 sm:ml-11 space-y-2">
                        {item.subtasks.map((subtask, subIndex) => (
                          <div
                            key={subIndex}
                            className="flex items-start gap-2 sm:gap-3"
                          >
                            <button
                              onClick={() => toggleItem(item.id, subIndex)}
                              className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center mt-0.5 ${
                                checkedItems[`${item.id}-${subIndex}`]
                                  ? "bg-gradient-to-br from-blue-400 to-cyan-500 border-blue-400 shadow-md shadow-blue-500/50"
                                  : "border-gray-600 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/30"
                              }`}
                            >
                              {checkedItems[`${item.id}-${subIndex}`] && (
                                <Check
                                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                                  strokeWidth={3}
                                />
                              )}
                            </button>
                            <span
                              className={`text-xs sm:text-sm transition-all duration-300 break-words ${
                                checkedItems[`${item.id}-${subIndex}`]
                                  ? "text-gray-600 line-through opacity-50"
                                  : "text-gray-300"
                              }`}
                            >
                              {renderTextWithLinks(subtask)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Footer Note */}
          <div className="mt-6 sm:mt-8 backdrop-blur-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20 p-4 sm:p-6 shadow-xl">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-lg sm:text-xl">💡</span>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-yellow-400 mb-2">
                  Important!
                </h4>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  <strong className="text-white">RISK MANAGEMENT</strong> si{" "}
                  <strong className="text-white">PSIHOLOGIA</strong> in trading
                  vor fi doua subiecte importante pe care le vom trata cu mare
                  atentie in proiectul{" "}
                  <strong className="text-yellow-400">Army</strong> in care
                  puteti sa intrati dupa ce ati terminat proiectul 1:20
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProFXChecklist;
