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
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">📈 Evoluție Zilnică</h3>
          
          <label className="block mb-2">Suma început zi:</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-800 text-white rounded mb-4"
            value={startOfDay}
            onChange={(e) => setStartOfDay(e.target.value === "" ? "" : Number(e.target.value))}
            onFocus={(e) => {
              if (e.target.value === "0") e.target.select();
            }}
          />
          
          <label className="block mb-2">Suma final zi:</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-800 text-white rounded mb-4"
            value={endOfDay}
            onChange={(e) => setEndOfDay(e.target.value === "" ? "" : Number(e.target.value))}
            onFocus={(e) => {
              if (e.target.value === "0") e.target.select();
            }}
          />
          
          <div className="text-center">
            <h2 className="text-lg">Procentaj zi</h2>
            <p className={`text-2xl font-bold ${parseFloat(dayChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {dayChange}%
            </p>
          </div>
        </div>

        {/* Card săptămânal */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">📊 Evoluție Săptămânală</h3>
          
          <label className="block mb-2">Suma început săptămână:</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-800 text-white rounded mb-4"
            value={startOfWeek}
            onChange={(e) => setStartOfWeek(e.target.value === "" ? "" : Number(e.target.value))}
            onFocus={(e) => {
              if (e.target.value === "0") e.target.select();
            }}
          />
          
          <label className="block mb-2">Suma final săptămână:</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-800 text-white rounded mb-4"
            value={endOfWeek}
            onChange={(e) => setEndOfWeek(e.target.value === "" ? "" : Number(e.target.value))}
            onFocus={(e) => {
              if (e.target.value === "0") e.target.select();
            }}
          />
          
          <div className="text-center">
            <h2 className="text-lg">Procentaj săptămână</h2>
            <p className={`text-2xl font-bold ${parseFloat(weekChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {weekChange}%
            </p>
          </div>
        </div>
      </div>

      {/* Card pentru trade individual */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">💰 Profit per trade</h2>
        
        <label className="block mb-2">Suma început trade:</label>
        <input
          type="number"
          className="w-full p-2 bg-gray-800 text-white rounded mb-4"
          value={startOfTrade}
          onChange={(e) => setStartOfTrade(e.target.value === "" ? "" : Number(e.target.value))}
          onFocus={(e) => {
            if (e.target.value === "0") e.target.select();
          }}
        />
        
        <label className="block mb-2">Suma după trade:</label>
        <input
          type="number"
          className="w-full p-2 bg-gray-800 text-white rounded mb-4"
          value={endOfTrade}
          onChange={(e) => setEndOfTrade(e.target.value === "" ? "" : Number(e.target.value))}
          onFocus={(e) => {
            if (e.target.value === "0") e.target.select();
          }}
        />
        
        <div className="text-center">
          <h2 className="text-lg">Procentaj trade</h2>
          <p className={`text-2xl font-bold ${parseFloat(tradeChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {tradeChange}%
          </p>
        </div>
      </div>

      {/* Buton reset */}
      <div className="text-center mb-10">
        <button
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow transition-colors"
          onClick={resetLocalData}
        >
          🗑️ Reset toate datele
        </button>
      </div>

      {/* Investment Calculator */}
      <div>
        <InvestmentCalculator />
      </div>
    </div>
  );
}