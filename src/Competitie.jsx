import React, { useState, useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";

const CompetitionBanner = () => {
  const { language, translations } = useLanguage();
  const t = translations;
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
      
      // Data de început a concursului din noiembrie (3 noiembrie 2025, 00:00:00)
      const startDate = new Date(2025, 10, 3, 0, 0, 0); // Month is 0-indexed: 10 = November
      
      // Data de sfârșit a concursului din noiembrie (21 noiembrie 2025, 23:59:59)
      const endDate = new Date(2025, 10, 21, 23, 59, 59);
      
      // Data de început a concursului următor (1 decembrie 2025)
      const nextStartDate = new Date(2025, 11, 1, 0, 0, 0); // 11 = December

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
        return t.timerWaiting;
      case "running":
        return t.timerRunning;
      default:
        return t.timerDefault;
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
    <div key={language} className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl max-w-3xl md:max-w-5xl mx-auto my-10 overflow-hidden hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.01] animate-language-change">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-6 sm:p-8 md:p-10 z-10">
        <div className="flex items-center justify-center mb-6 animate-fade-in-down">
          <span className="text-3xl sm:text-4xl font-bold text-red-500 animate-pulse mr-3">
            🚨
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 tracking-wider text-center">
            {t.title}
          </h2>
          <span className="text-3xl sm:text-4xl font-bold text-red-500 animate-pulse ml-3">
            🚨
          </span>
        </div>
        
        {/* Status indicators */}
        {phase === "waiting" && (
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg animate-pulse mb-3">
              {t.registrationsOpen}
            </div>
            <p className="text-base font-semibold text-green-400 max-w-2xl mx-auto">
              {t.registrationMessage}
            </p>
          </div>
        )}
        
        {phase === "running" && (
          <div className="text-center mb-6">
            <span className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg animate-pulse">
              {t.competitionRunning}
            </span>
          </div>
        )}
        
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-6 tracking-tight animate-fade-in">
          {t.subtitle} <span className="text-blue-400">FPM</span>{" "}
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
              <span className="text-xs sm:text-sm text-black/70 font-semibold">{t.days}</span>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-3 shadow-md">
              <span className="text-2xl sm:text-3xl font-bold text-black">
                {timeLeft.hours}
              </span>
              <span className="text-xs sm:text-sm text-black/70 font-semibold">{t.hours}</span>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-3 shadow-md">
              <span className="text-2xl sm:text-3xl font-bold text-black">
                {timeLeft.minutes}
              </span>
              <span className="text-xs sm:text-sm text-black/70 font-semibold">{t.minutes}</span>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-3 shadow-md">
              <span className="text-2xl sm:text-3xl font-bold text-black">
                {timeLeft.seconds}
              </span>
              <span className="text-xs sm:text-sm text-black/70 font-semibold">{t.seconds}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 text-center mb-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
          {t.description} <b className="text-amber-400">{t.descriptionBold}</b> {t.descriptionContinue}{" "}
          <b>
            <span className="text-blue-400">FPM</span>{" "}
            <span className="text-amber-400">Trading</span>
          </b>
          {t.descriptionEnd}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="https://smartlnks.com/PROFX-Romania"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 border border-blue-400/50"
          >
            {t.createAccountBtn}
          </a>
          <a
            href="https://youtu.be/SnxXpX1Iei8"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-amber-400 to-amber-600 text-black px-6 py-3 rounded-xl font-bold shadow-md hover:from-amber-500 hover:to-amber-700 hover:scale-105 transition-all duration-300 border border-amber-300/50"
          >
            {t.tutorialBtn}
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 animate-fade-in-left">
            <h4 className="font-bold text-amber-400 mb-4 text-center text-lg">
              {t.detailsTitle}
            </h4>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>
                <b className="text-white">{t.accountAmount}</b> {t.accountAmountValue}{" "}
                <span className="uppercase text-green-400 font-bold">{t.accountAmountReal}</span>{" "}
                {t.accountAmountAt} <span className="text-blue-400">FPM</span>{" "}
                <span className="text-amber-400">Trading</span>)
              </li>
              <li>
                <b className="text-white">{t.accountType}</b> {t.accountTypeValue}
              </li>
              <li>
                <b className="text-white">{t.startDate}</b> {t.startDateValue}
              </li>
              <li>
                <b className="text-white">{t.competitionPeriod}</b> {t.competitionPeriodValue}
              </li>
              <li>
                <b className="text-white">{t.drawdown}</b> {t.drawdownValue}{" "}
                <span className="text-gray-400 italic">
                  {t.drawdownRecommendation}
                </span>
              </li>
              <li>
                <b className="text-white">{t.minTransactions}</b> {t.minTransactionsValue}
              </li>
            </ol>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-amber-400/30 transition-all duration-300 hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 animate-fade-in-right">
            <h4 className="font-bold text-amber-400 mb-4 text-center text-lg">
              {t.prizesTitle}
            </h4>
            <ul className="grid grid-cols-1 gap-3 text-gray-300 text-sm md:text-base">
              <li className="flex items-center justify-between bg-gray-700/50 rounded-xl p-3 transition-all duration-200 hover:bg-gray-700 hover:shadow-md border border-gray-600/50">
                <span className="font-bold text-green-400">{t.firstPlace}</span>
                <span className="flex items-center text-white font-bold">
                  1000 $ <span className="ml-2 text-yellow-400">🏆</span>
                </span>
              </li>
              <li className="flex items-center justify-between bg-gray-700/50 rounded-xl p-3 transition-all duration-200 hover:bg-gray-700 hover:shadow-md border border-gray-600/50">
                <span className="font-bold text-green-400">{t.secondPlace}</span>
                <span className="flex items-center text-white font-bold">
                  600 $ <span className="ml-2 text-gray-300">🥈</span>
                </span>
              </li>
              <li className="flex items-center justify-between bg-gray-700/50 rounded-xl p-3 transition-all duration-200 hover:bg-gray-700 hover:shadow-md border border-gray-600/50">
                <span className="font-bold text-green-400">{t.thirdPlace}</span>
                <span className="flex items-center text-white font-bold">
                  400 $ <span className="ml-2 text-amber-500">🥉</span>
                </span>
              </li>
              <li className="flex items-center justify-between bg-gray-700/50 rounded-xl p-3 transition-all duration-200 hover:bg-gray-700 hover:shadow-md border border-gray-600/50">
                <span className="font-bold text-blue-400">{t.fourthFifthPlace}</span>
                <span className="flex items-center text-white">
                  {t.backpackPrize}{" "}
                  <span className="ml-2 text-blue-400">🎒</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mb-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 animate-fade-in-up">
          <h4 className="font-bold text-amber-400 mb-4 text-center text-lg">
            {t.winnerDeterminationTitle}
          </h4>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 pl-2 text-sm md:text-base">
            <li>
              {t.winnerStep1}
            </li>
            <li>
              {t.winnerStep2} <b className="text-white">{t.winnerStep2Bold}</b>{t.winnerStep2Continue}
            </li>
            <li>
              {t.winnerStep3}
            </li>
          </ol>
        </div>
        
        <div className="mb-6 text-center animate-fade-in">
          <span className="text-red-400 font-bold uppercase text-lg block mb-2 animate-bounce">
            {t.myfxbookWarning}
          </span>
          <a
            href="https://www.youtube.com/watch?v=zFLuM0rId-M&t=16s"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline font-semibold hover:text-blue-300 transition-colors duration-200"
          >
            {t.myfxbookVideo}
          </a>
        </div>
        
        <div className="text-center text-gray-300 mb-6 max-w-2xl mx-auto animate-fade-in-up delay-200">
          {t.challengeText}
        </div>
        
        {phase === "waiting" && (
          <div className="text-center bg-gradient-to-r from-blue-900/30 to-green-900/30 rounded-2xl p-6 mb-6 border border-blue-400/30 animate-fade-in-up delay-100">
            <div className="text-lg font-bold text-blue-400 mb-2">
              {t.registerNowTitle}
            </div>
            <div className="text-green-400 font-semibold">
              {t.registerNowMessage}
            </div>
          </div>
        )}
        
        <div className="text-center text-sm text-gray-400 mb-6 animate-fade-in-up delay-300">
          {phase === "waiting" ? (
            <>
              {t.registrationInfo}
              <br />
              <span className="text-blue-400 font-bold">{t.dontMiss}</span>
            </>
          ) : (
            <>
              {t.contactInfo}
            </>
          )}
          <br />
          {t.community} <b className="text-amber-400">PROFX</b>
        </div>
        
        <div className="text-center font-bold text-green-400 text-lg animate-fade-in-up delay-400">
          {t.goodLuck}
          <br />
          <span className="text-amber-400">{t.team}</span>
        </div>
      </div>
    </div>
  );
};

export default CompetitionBanner;
