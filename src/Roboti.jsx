import React, { useState } from "react";
import { Download, Lock, Eye, EyeOff, LogOut, Bot } from "lucide-react";
import { useLanguage } from "./contexts/LanguageContext";

const PASSWORD_KEY = "profx_roboti_access";
const HARDCODED_PASSWORD = "Roboti2026";

// Fișierele din utils/Roboti - titluri derivate din numele fișierelor
const robotiFiles = [
  {
    filename: "AutoSL&BE_v1.72_1.ex5",
    title: "AutoSL & BE v1.72",
    description: "Auto Stop Loss & Break Even Expert Advisor",
  },
  {
    filename: "CustomLevels.ex5",
    title: "Custom Levels",
    description: "Custom Levels Indicator",
  },
  {
    filename: "CandleCountDown - MT5.ex5",
    title: "Candle CountDown - MT5",
    description: "Candle Countdown Timer for MT5",
  },
  {
    filename: "VolumeCalculator.ex5",
    title: "Volume Calculator",
    description: "Volume Calculator Expert Advisor",
  },
];

const Roboti = () => {
  const { translations: t, language } = useLanguage();

  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(() => {
    return sessionStorage.getItem(PASSWORD_KEY) === HARDCODED_PASSWORD;
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === HARDCODED_PASSWORD) {
      sessionStorage.setItem(PASSWORD_KEY, HARDCODED_PASSWORD);
      setAccessGranted(true);
      setError("");
    } else {
      setError(
        language === "ro" ? "Parolă incorectă!" : "Incorrect password!"
      );
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PASSWORD_KEY);
    setAccessGranted(false);
    setPassword("");
  };

  const handleDownload = (filename) => {
    const link = document.createElement("a");
    link.href = new URL(
      `./utils/Roboti/${filename}`,
      import.meta.url
    ).href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ecran de parolă
  if (!accessGranted) {
    return (
      <div
        key={language}
        className="min-h-screen w-full px-6 py-12 flex items-start justify-center animate-language-change"
      >
        <div className="group relative max-w-md w-full bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-amber-400/30 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center">
                <Bot className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-amber-400 mb-2 text-center">
              {language === "ro" ? "Roboți MT5" : "MT5 Robots"}
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              {language === "ro"
                ? "Introdu parola pentru a accesa roboții"
                : "Enter the password to access the robots"}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label className="block text-sm text-gray-400 mb-1">
                  {language === "ro" ? "Parolă" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      language === "ro"
                        ? "Introdu parola..."
                        : "Enter password..."
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 pl-10 pr-10 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full p-3 rounded-xl bg-amber-500/80 hover:bg-amber-400/80 text-gray-900 font-semibold transition-colors"
              >
                {language === "ro" ? "Accesează" : "Access"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Conținut principal
  return (
    <div key={language} className="max-w-6xl mx-auto p-6 animate-language-change">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-2xl mb-6 shadow-xl">
          <Bot className="w-10 h-10 text-amber-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {language === "ro" ? "Roboți" : "Robots"}{" "}
          <span className="text-amber-400">MT5</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {language === "ro"
            ? "Descarcă indicatorii și roboții pentru MetaTrader 5"
            : "Download indicators and robots for MetaTrader 5"}
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white hover:border-red-400/50 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          {language === "ro" ? "Deconectare" : "Logout"}
        </button>
      </div>

      {/* Grid de roboți */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {robotiFiles.map((robot, index) => (
          <div
            key={index}
            className="group bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300 hover:shadow-amber-400/10 hover:shadow-2xl"
          >
            {/* Icon */}
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400/20 to-amber-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🤖</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
              {robot.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4">{robot.description}</p>

            {/* Filename */}
            <p className="text-xs text-gray-500 font-mono bg-gray-900/50 rounded-lg px-3 py-1.5 mb-4 truncate">
              {robot.filename}
            </p>

            {/* Download button */}
            <button
              onClick={() => handleDownload(robot.filename)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 font-semibold rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-400/20"
            >
              <Download className="w-5 h-5" />
              {language === "ro" ? "Descarcă" : "Download"}
            </button>
          </div>
        ))}
      </div>

      {/* Info section */}
      <div className="mt-12 bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-amber-400 mb-3">
          {language === "ro" ? "ℹ️ Cum se instalează" : "ℹ️ How to install"}
        </h3>
        <ol className="text-gray-300 space-y-2 list-decimal list-inside">
          {language === "ro" ? (
            <>
              <li>Descarcă fișierul .ex5 dorit</li>
              <li>Deschide MetaTrader 5</li>
              <li>
                Navighează la{" "}
                <span className="text-amber-400 font-mono">
                  File → Open Data Folder → MQL5 → Experts
                </span>{" "}
                (pentru roboți) sau{" "}
                <span className="text-amber-400 font-mono">Indicators</span>{" "}
                (pentru indicatori)
              </li>
              <li>Copiază fișierul .ex5 în folderul corespunzător</li>
              <li>Restartează MetaTrader 5 sau apasă Refresh în Navigator</li>
            </>
          ) : (
            <>
              <li>Download the desired .ex5 file</li>
              <li>Open MetaTrader 5</li>
              <li>
                Navigate to{" "}
                <span className="text-amber-400 font-mono">
                  File → Open Data Folder → MQL5 → Experts
                </span>{" "}
                (for robots) or{" "}
                <span className="text-amber-400 font-mono">Indicators</span>{" "}
                (for indicators)
              </li>
              <li>Copy the .ex5 file to the appropriate folder</li>
              <li>Restart MetaTrader 5 or press Refresh in Navigator</li>
            </>
          )}
        </ol>
      </div>
    </div>
  );
};

export default Roboti;
