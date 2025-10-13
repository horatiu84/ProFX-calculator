import React, { useState, useEffect } from "react";

const CompetitionBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [phase, setPhase] = useState(""); // "waiting", "running", "ended"

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      
      // Data de început a concursului curent (1 a lunii curente)
      const startDate = new Date(currentYear, currentMonth, 1, 0, 0, 0);
      
      // Data de sfârșit a concursului curent (24 a lunii curente, 23:59:59)
      const endDate = new Date(currentYear, currentMonth, 24, 23, 59, 59);
      
      // Data de început a concursului următor (1 a lunii următoare)
      const nextStartDate = new Date(currentYear, currentMonth + 1, 1, 0, 0, 0);

      let targetDate;
      let currentPhase;

      if (now < startDate) {
        // Înainte de începerea concursului
        targetDate = startDate;
        currentPhase = "waiting";
      } else if (now >= startDate && now <= endDate) {
        // În timpul concursului
        targetDate = endDate;
        currentPhase = "running";
      } else {
        // După terminarea concursului, așteaptă următorul
        targetDate = nextStartDate;
        currentPhase = "waiting";
      }

      setPhase(currentPhase);

      const timeDifference = targetDate - now;

      if (timeDifference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  // Funcție pentru a obține textul corespunzător fazei
  const getTimerText = () => {
    switch (phase) {
      case "waiting":
        return "Timp rămas până începe concursul:";
      case "running":
        return "Timp rămas până la finalul concursului:";
      default:
        return "Timp rămas:";
    }
  };

  // Funcție pentru a obține culoarea corespunzătoare fazei
  const getTimerColor = () => {
    switch (phase) {
      case "waiting":
        return "text-blue-800";
      case "running":
        return "text-red-800";
      default:
        return "text-indigo-800";
    }
  };

  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl max-w-3xl md:max-w-5xl mx-auto my-10 overflow-hidden hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.01]">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-6 sm:p-8 md:p-10 z-10">
        <div className="flex items-center justify-center mb-6 animate-fade-in-down">
          <span className="text-3xl sm:text-4xl font-bold text-red-500 animate-pulse mr-3">
            🚨
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 tracking-wider text-center">
            START 1 A FIECĂREI LUNI!
          </h2>
          <span className="text-3xl sm:text-4xl font-bold text-red-500 animate-pulse ml-3">
            🚨
          </span>
        </div>
        
        {/* Status indicators */}
        {phase === "waiting" && (
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg animate-pulse mb-3">
              ✅ ÎNSCRIERILE SUNT DESCHISE! ✅
            </div>
            <p className="text-base font-semibold text-green-400 max-w-2xl mx-auto">
              🎯 Completează formularul de mai jos pentru a te înscrie la următorul concurs și să-ți asiguri locul în competiție!
            </p>
          </div>
        )}
        
        {phase === "running" && (
          <div className="text-center mb-6">
            <span className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg animate-pulse">
              🔥 CONCURSUL ESTE ÎN DESFĂȘURARE! 🔥
            </span>
          </div>
        )}
        
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-6 tracking-tight animate-fade-in">
          Trading Competition ProFX & <span className="text-blue-400">FPM</span>{" "}
          <span className="text-amber-400">Trading</span>
        </h3>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 max-w-lg mx-auto mb-6 shadow-lg border border-gray-600/50 text-center transform transition-all duration-300 hover:scale-105 hover:border-amber-400/50">
          <h4 className={`font-bold mb-4 text-lg ${
            phase === "waiting" ? "text-blue-400" : 
            phase === "running" ? "text-red-400" : 
            "text-amber-400"
          }`}>
            {getTimerText()}
          </h4>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <div className="flex flex-col items-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-3 shadow-md">
              <span className="text-2xl sm:text-3xl font-bold text-black">
                {timeLeft.days}
              </span>
              <span className="text-xs sm:text-sm text-black/70 font-semibold">Zile</span>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-3 shadow-md">
              <span className="text-2xl sm:text-3xl font-bold text-black">
                {timeLeft.hours}
              </span>
              <span className="text-xs sm:text-sm text-black/70 font-semibold">Ore</span>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-3 shadow-md">
              <span className="text-2xl sm:text-3xl font-bold text-black">
                {timeLeft.minutes}
              </span>
              <span className="text-xs sm:text-sm text-black/70 font-semibold">Minute</span>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-3 shadow-md">
              <span className="text-2xl sm:text-3xl font-bold text-black">
                {timeLeft.seconds}
              </span>
              <span className="text-xs sm:text-sm text-black/70 font-semibold">Secunde</span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-center mb-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
          ProFX vă invită să participați la <b className="text-amber-400">TRADING COMPETITION</b> în
          parteneriat cu{" "}
          <b>
            <span className="text-blue-400">FPM</span>{" "}
            <span className="text-amber-400">Trading</span>
          </b>
          , unde vă puteți testa strategiile și abilitățile într-un mediu real,
          cu șanse de a câștiga premii atractive!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="https://smartlnks.com/PROFX-Romania"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 border border-blue-400/50"
          >
            👉 Creează cont FPM Trading
          </a>
          <a
            href="https://youtu.be/SnxXpX1Iei8"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-amber-400 to-amber-600 text-black px-6 py-3 rounded-xl font-bold shadow-md hover:from-amber-500 hover:to-amber-700 hover:scale-105 transition-all duration-300 border border-amber-300/50"
          >
            ▶ Tutorial înregistrare
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 animate-fade-in-left">
            <h4 className="font-bold text-amber-400 mb-4 text-center text-lg">
              Detalii & Condiții de participare:
            </h4>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>
                <b className="text-white">Suma contului:</b> minim 100 USD (cont{" "}
                <span className="uppercase text-green-400 font-bold">REAL</span>{" "}
                la <span className="text-blue-400">FPM</span>{" "}
                <span className="text-amber-400">Trading</span>)
              </li>
              <li>
                <b className="text-white">Tipul contului:</b> Standard sau Raw
              </li>
              <li>
                <b className="text-white">Data de start:</b> Începe în prima zi a fiecărei luni
              </li>
              <li>
                <b className="text-white">Perioada concursului:</b> 3 săptămâni (până pe 24 a lunii)
              </li>
              <li>
                <b className="text-white">Drawdown:</b> LIBER{" "}
                <span className="text-gray-400 italic">
                  (recomandăm cât mai mic)
                </span>
              </li>
              <li>
                <b className="text-white">Număr minim tranzacții:</b> 20/lună luate în minim 14 zile
              </li>
            </ol>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-amber-400/30 transition-all duration-300 hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 animate-fade-in-right">
            <h4 className="font-bold text-amber-400 mb-4 text-center text-lg">
              Premii:
            </h4>
            <ul className="grid grid-cols-1 gap-3 text-gray-300 text-sm md:text-base">
              <li className="flex items-center justify-between bg-gray-700/50 rounded-xl p-3 transition-all duration-200 hover:bg-gray-700 hover:shadow-md border border-gray-600/50">
                <span className="font-bold text-green-400">Locul 1:</span>
                <span className="flex items-center text-white font-bold">
                  1000 $ <span className="ml-2 text-yellow-400">🏆</span>
                </span>
              </li>
              <li className="flex items-center justify-between bg-gray-700/50 rounded-xl p-3 transition-all duration-200 hover:bg-gray-700 hover:shadow-md border border-gray-600/50">
                <span className="font-bold text-green-400">Locul 2:</span>
                <span className="flex items-center text-white font-bold">
                  600 $ <span className="ml-2 text-gray-300">🥈</span>
                </span>
              </li>
              <li className="flex items-center justify-between bg-gray-700/50 rounded-xl p-3 transition-all duration-200 hover:bg-gray-700 hover:shadow-md border border-gray-600/50">
                <span className="font-bold text-green-400">Locul 3:</span>
                <span className="flex items-center text-white font-bold">
                  400 $ <span className="ml-2 text-amber-500">🥉</span>
                </span>
              </li>
              <li className="flex items-center justify-between bg-gray-700/50 rounded-xl p-3 transition-all duration-200 hover:bg-gray-700 hover:shadow-md border border-gray-600/50">
                <span className="font-bold text-blue-400">Locul 4 & 5:</span>
                <span className="flex items-center text-white">
                  Travel Backpack FPM Trading{" "}
                  <span className="ml-2 text-blue-400">🎒</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mb-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 animate-fade-in-up">
          <h4 className="font-bold text-amber-400 mb-4 text-center text-lg">
            Cum se stabilește câștigătorul:
          </h4>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 pl-2 text-sm md:text-base">
            <li>
              Se verifică dacă potențialii câștigători au respectat condițiile
              de participare.
            </li>
            <li>
              Se verifică <b className="text-white">raportul PROFIT/DRAWDOWN</b>. Cine are raportul cel
              mai mare câștigă.
            </li>
            <li>
              Dacă mai mulți concurenți au același raport, departajarea se face
              pe baza drawdown-ului (mai mic = avantaj).
            </li>
          </ol>
        </div>
        
        <div className="mb-6 text-center animate-fade-in">
          <span className="text-red-400 font-bold uppercase text-lg block mb-2 animate-bounce">
            🚨 Toată lumea trebuie să își lege contul la MyFXbook! 🚨
          </span>
          <a
            href="https://www.youtube.com/watch?v=zFLuM0rId-M&t=16s"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline font-semibold hover:text-blue-300 transition-colors duration-200"
          >
            MyFXbook Video
          </a>
        </div>
        
        <div className="text-center text-gray-300 mb-6 max-w-2xl mx-auto animate-fade-in-up delay-200">
          Vă așteptăm să vă alăturați acestei provocări și să demonstrați că
          știți să gestionați riscul și să vă maximizați profitul!
        </div>
        
        {phase === "waiting" && (
          <div className="text-center bg-gradient-to-r from-blue-900/30 to-green-900/30 rounded-2xl p-6 mb-6 border border-blue-400/30 animate-fade-in-up delay-100">
            <div className="text-lg font-bold text-blue-400 mb-2">
              📝 Înscrie-te ACUM pentru următorul concurs!
            </div>
            <div className="text-green-400 font-semibold">
              Completează formularul de mai jos și asigură-ți locul în competiție! 🎯
            </div>
          </div>
        )}
        
        <div className="text-center text-sm text-gray-400 mb-6 animate-fade-in-up delay-300">
          {phase === "waiting" ? (
            <>
              Pentru înscriere completează formularul de mai jos!
              <br />
              <span className="text-blue-400 font-bold">Nu rata șansa de a participa!</span>
            </>
          ) : (
            <>
              Pentru informații suplimentare, contactează echipa ProFX!
            </>
          )}
          <br />
          Comunitatea <b className="text-amber-400">PROFX</b>
        </div>
        
        <div className="text-center font-bold text-green-400 text-lg animate-fade-in-up delay-400">
          Mult succes și tranzacții profitabile!
          <br />
          <span className="text-amber-400">Echipa ProFX</span>
        </div>
      </div>
    </div>
  );
};

export default CompetitionBanner;
