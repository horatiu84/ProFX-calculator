import React, { useState, useEffect } from "react";
import InvestmentCalculator from "./InvestmentCalculator.jsx";

export default function Evolutie() {
  // State pentru tracking zilnic
  const [startOfDay, setStartOfDay] = useState(() => {
    const saved = localStorage.getItem("startOfDay");
    return saved !== null ? Number(saved) : 0;
  });
  
  const [endOfDay, setEndOfDay] = useState(() => {
    const saved = localStorage.getItem("endOfDay");
    return saved !== null ? Number(saved) : 0;
  });

  // State pentru tracking săptămânal
  const [startOfWeek, setStartOfWeek] = useState(() => {
    const saved = localStorage.getItem("startOfWeek");
    return saved !== null ? Number(saved) : 0;
  });
  
  const [endOfWeek, setEndOfWeek] = useState(() => {
    const saved = localStorage.getItem("endOfWeek");
    return saved !== null ? Number(saved) : 0;
  });

  // State pentru tracking per trade
  const [startOfTrade, setStartOfTrade] = useState(() => {
    const saved = localStorage.getItem("startOfTrade");
    return saved !== null ? Number(saved) : 0;
  });
  
  const [endOfTrade, setEndOfTrade] = useState(() => {
    const saved = localStorage.getItem("endOfTrade");
    return saved !== null ? Number(saved) : 0;
  });

  // Efecte pentru salvarea în localStorage
  useEffect(() => {
    localStorage.setItem("startOfDay", startOfDay);
    localStorage.setItem("endOfDay", endOfDay);
  }, [startOfDay, endOfDay]);

  useEffect(() => {
    localStorage.setItem("startOfWeek", startOfWeek);
    localStorage.setItem("endOfWeek", endOfWeek);
  }, [startOfWeek, endOfWeek]);

  useEffect(() => {
    localStorage.setItem("startOfTrade", startOfTrade);
    localStorage.setItem("endOfTrade", endOfTrade);
  }, [startOfTrade, endOfTrade]);

  // Calcularea procentajelor
  const dayChange = startOfDay > 0
    ? (((endOfDay - startOfDay) / startOfDay) * 100).toFixed(2)
    : "0.00";

  const weekChange = startOfWeek > 0
    ? (((endOfWeek - startOfWeek) / startOfWeek) * 100).toFixed(2)
    : "0.00";

  const tradeChange = startOfTrade > 0
    ? (((endOfTrade - startOfTrade) / startOfTrade) * 100).toFixed(2)
    : "0.00";

  const resetLocalData = () => {
    localStorage.removeItem("startOfDay");
    localStorage.removeItem("endOfDay");
    localStorage.removeItem("startOfWeek");
    localStorage.removeItem("endOfWeek");
    localStorage.removeItem("startOfTrade");
    localStorage.removeItem("endOfTrade");
    
    setStartOfDay(0);
    setEndOfDay(0);
    setStartOfWeek(0);
    setEndOfWeek(0);
    setStartOfTrade(0);
    setEndOfTrade(0);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Tracking zilnic și săptămânal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Card zilnic */}
        <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-emerald-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-4 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300">📈 Evoluție Zilnică</h3>
          
          <label className="block mb-2 text-gray-300">Suma început zi:</label>
          <input
            type="number"
            className="w-full p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 hover:bg-gray-700/50 transition-all duration-300"
            value={startOfDay}
            onChange={(e) => setStartOfDay(e.target.value === "" ? "" : Number(e.target.value))}
            onFocus={(e) => {
              if (e.target.value === "0") e.target.select();
            }}
          />
          
          <label className="block mb-2 text-gray-300">Suma final zi:</label>
          <input
            type="number"
            className="w-full p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 hover:bg-gray-700/50 transition-all duration-300"
            value={endOfDay}
            onChange={(e) => setEndOfDay(e.target.value === "" ? "" : Number(e.target.value))}
            onFocus={(e) => {
              if (e.target.value === "0") e.target.select();
            }}
          />
          
          <div className="text-center">
            <h2 className="text-lg text-gray-300 mb-2">Procentaj zi</h2>
            <p className={`text-2xl font-bold ${parseFloat(dayChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {dayChange}%
            </p>
          </div>
          </div>
        </div>

        {/* Card săptămânal */}
        <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">📊 Evoluție Săptămânală</h3>
          
          <label className="block mb-2 text-gray-300">Suma început săptămână:</label>
          <input
            type="number"
            className="w-full p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 hover:bg-gray-700/50 transition-all duration-300"
            value={startOfWeek}
            onChange={(e) => setStartOfWeek(e.target.value === "" ? "" : Number(e.target.value))}
            onFocus={(e) => {
              if (e.target.value === "0") e.target.select();
            }}
          />
          
          <label className="block mb-2 text-gray-300">Suma final săptămână:</label>
          <input
            type="number"
            className="w-full p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 hover:bg-gray-700/50 transition-all duration-300"
            value={endOfWeek}
            onChange={(e) => setEndOfWeek(e.target.value === "" ? "" : Number(e.target.value))}
            onFocus={(e) => {
              if (e.target.value === "0") e.target.select();
            }}
          />
          
          <div className="text-center">
            <h2 className="text-lg text-gray-300 mb-2">Procentaj săptămână</h2>
            <p className={`text-2xl font-bold ${parseFloat(weekChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {weekChange}%
            </p>
          </div>
          </div>
        </div>
      </div>

      {/* Card pentru trade individual */}
      <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-10 max-w-md mx-auto hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
        <h2 className="text-xl font-semibold mb-4 text-center text-amber-400 group-hover:text-amber-300 transition-colors duration-300">💰 Profit per trade</h2>
        
        <label className="block mb-2 text-gray-300">Suma început trade:</label>
        <input
          type="number"
          className="w-full p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 hover:bg-gray-700/50 transition-all duration-300"
          value={startOfTrade}
          onChange={(e) => setStartOfTrade(e.target.value === "" ? "" : Number(e.target.value))}
          onFocus={(e) => {
            if (e.target.value === "0") e.target.select();
          }}
        />
        
        <label className="block mb-2 text-gray-300">Suma după trade:</label>
        <input
          type="number"
          className="w-full p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 hover:bg-gray-700/50 transition-all duration-300"
          value={endOfTrade}
          onChange={(e) => setEndOfTrade(e.target.value === "" ? "" : Number(e.target.value))}
          onFocus={(e) => {
            if (e.target.value === "0") e.target.select();
          }}
        />
        
        <div className="text-center">
          <h2 className="text-lg text-gray-300 mb-2">Procentaj trade</h2>
          <p className={`text-2xl font-bold ${parseFloat(tradeChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {tradeChange}%
          </p>
        </div>
        </div>
      </div>

      {/* Buton reset */}
      <div className="text-center mb-10">
        <button
          className="px-6 py-3 bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 hover:bg-gray-600/80 hover:border-red-400/50 text-white rounded-xl shadow-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center space-x-2 mx-auto group"
          onClick={resetLocalData}
        >
          <span className="group-hover:text-red-400 transition-colors duration-300">🗑️</span>
          <span className="group-hover:text-red-400 transition-colors duration-300">Reset toate datele</span>
        </button>
      </div>

      {/* Investment Calculator */}
      <div>
        <InvestmentCalculator />
      </div>
    </div>
  );
}