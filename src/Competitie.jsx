import React, { useState, useEffect } from "react";

const CompetitionBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const endDate = new Date("2025-08-22T23:59:00");

    const updateTimer = () => {
      const now = new Date();
      const timeDifference = endDate - now;

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

  return (
    <div className="relative bg-gradient-to-br from-blue-100 via-indigo-100 to-yellow-200 rounded-3xl shadow-xl max-w-3xl md:max-w-5xl  mx-auto my-10 overflow-hidden border border-blue-300 transition-all duration-300 hover:shadow-2xl">
      {/* Subtle background animation */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))] opacity-50 animate-pulse-slow"></div>

      <div className="relative p-6 sm:p-8 md:p-10">
        <div className="flex items-center justify-center mb-4 animate-fade-in-down">
          <span className="text-3xl sm:text-4xl font-bold text-red-600 animate-pulse mr-3">
            🚨
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900 tracking-wider text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            START 1 A FIECAREI LUNI!
          </h2>
          <span className="text-3xl sm:text-4xl font-bold text-red-600 animate-pulse ml-3">
            🚨
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-800 text-center mb-4 tracking-tight animate-fade-in">
          Trading Competition ProFX & FPMarkets
        </h3>
        <div className="bg-white/90 rounded-xl p-4 sm:p-6 max-w-lg mx-auto mb-6 shadow-lg border border-indigo-200 text-center transform transition-all duration-300 hover:scale-105">
          <h4 className="font-bold text-indigo-800 mb-2 text-lg">
            Timp rămas până la finalul concursului:
          </h4>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <div className="flex flex-col items-center bg-yellow-400 rounded-lg p-2 animate-bounce-slow">
              <span className="text-2xl sm:text-3xl font-bold text-blue-900">
                {timeLeft.days}
              </span>
              <span className="text-xs sm:text-sm text-gray-600">Zile</span>
            </div>
            <div className="flex flex-col items-center bg-yellow-400 rounded-lg p-2 animate-bounce-slow delay-100">
              <span className="text-2xl sm:text-3xl font-bold text-blue-900">
                {timeLeft.hours}
              </span>
              <span className="text-xs sm:text-sm text-gray-600">Ore</span>
            </div>
            <div className="flex flex-col items-center bg-yellow-400 rounded-lg p-2 animate-bounce-slow delay-200">
              <span className="text-2xl sm:text-3xl font-bold text-blue-900">
                {timeLeft.minutes}
              </span>
              <span className="text-xs sm:text-sm text-gray-600">Minute</span>
            </div>
            <div className="flex flex-col items-center bg-yellow-400 rounded-lg p-2 animate-bounce-slow delay-300">
              <span className="text-2xl sm:text-3xl font-bold text-blue-900">
                {timeLeft.seconds}
              </span>
              <span className="text-xs sm:text-sm text-gray-600">Secunde</span>
            </div>
          </div>
        </div>
        <p className="text-gray-800 text-center mb-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
          ProFX vă invită să participați la <b>TRADING COMPETITION</b> în
          parteneriat cu <b>FPMarkets</b>, unde vă puteți testa strategiile și
          abilitățile într-un mediu real, cu șanse de a câștiga premii
          atractive!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="https://smartlnks.com/ProFx"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 hover:scale-110 transition-transform duration-300 ease-in-out transform animate-pulse-slow"
          >
            👉 Creează cont FPMarkets
          </a>
          <a
            href="https://youtu.be/5Ov5OR4kEOw"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold shadow-md hover:bg-yellow-500 hover:scale-110 transition-transform duration-300 ease-in-out transform animate-pulse-slow"
          >
            ▶ Tutorial înregistrare
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/90 rounded-xl p-5 shadow-md border border-indigo-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-left">
            <h4 className="font-bold text-indigo-800 mb-3 text-center text-lg">
              Detalii & Condiții de participare:
            </h4>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 text-sm md:text-base">
              <li>
                <b>Suma contului:</b> minim 100 USD (cont{" "}
                <span className="uppercase text-green-700 font-bold">REAL</span>{" "}
                la FP Markets)
              </li>
              <li>
                <b>Tipul contului:</b> Standard sau Raw
              </li>
              <li>
                <b>Data de start:</b> Începe în prima zi a fiecărei luni
              </li>
              <li>
                <b>Perioada concursului:</b> 3 săptămâni
              </li>
              <li>
                <b>Drawdown:</b> LIBER{" "}
                <span className="text-gray-500 italic">
                  (recomandăm cât mai mic)
                </span>
              </li>
              <li>
                <b>Număr minim tranzacții:</b> 20/lună luate în minim 14 zile
              </li>
            </ol>
          </div>
          <div className="bg-yellow-50/90 rounded-xl p-5 shadow-md border border-yellow-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-right">
            <h4 className="font-bold text-yellow-700 mb-3 text-center text-lg">
              Premii:
            </h4>
            <ul className="grid grid-cols-1 gap-4 text-gray-800 text-sm md:text-base">
              <li className="flex items-center justify-between bg-white/50 rounded-lg p-3 transition-all duration-200 hover:bg-white hover:shadow-md">
                <span className="font-bold text-green-700">Locul 1:</span>
                <span className="flex items-center">
                  1000 $ <span className="ml-2 text-yellow-500">🏆</span>
                </span>
              </li>
              <li className="flex items-center justify-between bg-white/50 rounded-lg p-3 transition-all duration-200 hover:bg-white hover:shadow-md">
                <span className="font-bold text-green-700">Locul 2:</span>
                <span className="flex items-center">
                  600 $ <span className="ml-2 text-gray-400">🥈</span>
                </span>
              </li>
              <li className="flex items-center justify-between bg-white/50 rounded-lg p-3 transition-all duration-200 hover:bg-white hover:shadow-md">
                <span className="font-bold text-green-700">Locul 3:</span>
                <span className="flex items-center">
                  400 $ <span className="ml-2 text-amber-600">🥉</span>
                </span>
              </li>
              <li className="flex items-center justify-between bg-white/50 rounded-lg p-3 transition-all duration-200 hover:bg-white hover:shadow-md">
                <span className="font-bold text-blue-700">Locul 4 & 5:</span>
                <span className="flex items-center">
                  Travel Backpack FPMarkets{" "}
                  <span className="ml-2 text-blue-500">🎒</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-6 bg-indigo-50/90 rounded-xl p-5 shadow-md border border-indigo-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up">
          <h4 className="font-bold text-indigo-900 mb-2 text-center text-lg">
            Cum se stabilește câștigătorul:
          </h4>
          <ol className="list-decimal list-inside text-gray-700 space-y-2 pl-2 text-sm md:text-base">
            <li>
              Se verifică dacă potențialii câștigători au respectat condițiile
              de participare.
            </li>
            <li>
              Se verifică <b>raportul PROFIT/DRAWDOWN</b>. Cine are raportul cel
              mai mare câștigă.
            </li>
            <li>
              Dacă mai mulți concurenți au același raport, departajarea se face
              pe baza drawdown-ului (mai mic = avantaj).
            </li>
          </ol>
        </div>
        <div className="mb-6 text-center animate-fade-in">
          <span className="text-red-700 font-bold uppercase text-lg block mb-2 animate-bounce">
            🚨 Toată lumea trebuie să își lege contul la MyFXbook! 🚨
          </span>
          <a
            href="https://www.youtube.com/watch?v=zFLuM0rId-M&t=16s"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-700 underline font-semibold hover:text-indigo-900 transition-colors duration-200"
          >
            MyFXbook Video
          </a>
        </div>
        <div className="text-center text-gray-800 mb-4 max-w-2xl mx-auto animate-fade-in-up delay-200">
          Vă așteptăm să vă alăturați acestei provocări și să demonstrați că
          știți să gestionați riscul și să vă maximizați profitul!
        </div>
        <div className="text-center text-sm text-gray-700 mb-4 animate-fade-in-up delay-300">
          Pentru înscriere și detalii suplimentare, contactați-l pe {" "}
          <a
            href="https://t.me/JohnPometcu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-700 underline font-bold hover:text-yellow-900 transition"
          >
             John Pometcu
          </a>
          <br />
          Comunitatea <b>PROFX</b>
        </div>
        <div className="text-center font-bold text-green-700 text-lg animate-fade-in-up delay-400">
          Mult succes și tranzacții profitabile!
          <br />
          Echipa ProFX
        </div>
      </div>
    </div>
  );
};

export default CompetitionBanner;
