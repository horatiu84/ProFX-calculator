import React, { useState, useEffect } from "react";

const riskLabels = ["1%", "1.5%", "2%", "2.5%", "3%", "3.5%"];
const riskValues = [0.01, 0.015, 0.02, 0.025, 0.03, 0.035];

export default function LotCalculator() {
  const [selectedPips, setSelectedPips] = useState(10);
  const [selectedRiskIndex, setSelectedRiskIndex] = useState(0);
  const [startOfDay, setStartOfDay] = useState(() => Number(localStorage.getItem("startOfDay")) || 1645);
  const [endOfDay, setEndOfDay] = useState(() => Number(localStorage.getItem("endOfDay")) || 1645);
  const [startOfWeek, setStartOfWeek] = useState(() => Number(localStorage.getItem("startOfWeek")) || 1000);
  const [endOfWeek, setEndOfWeek] = useState(() => Number(localStorage.getItem("endOfWeek")) || 1034);

  useEffect(() => {
    localStorage.setItem("startOfDay", startOfDay);
    localStorage.setItem("endOfDay", endOfDay);
    localStorage.setItem("startOfWeek", startOfWeek);
    localStorage.setItem("endOfWeek", endOfWeek);
  }, [startOfDay, endOfDay, startOfWeek, endOfWeek]);

  const riskPercent = riskValues[selectedRiskIndex];
  const points = selectedPips * 10;
  const lotSize = (startOfDay * riskPercent) / points;

  const dayChange = startOfDay > 0 ? (((endOfDay - startOfDay) / startOfDay) * 100).toFixed(2) : "0.00";
  const weekChange = startOfWeek > 0 ? (((endOfWeek - startOfWeek) / startOfWeek) * 100).toFixed(2) : "0.00";

  const dynamicLosses = riskValues.map((risk) => ({
    label: `${(risk * 100).toFixed(1)}%`,
    value: (startOfDay * risk).toFixed(2)
  }));

  const roundedLot = Math.ceil(lotSize * 1000) / 1000;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center">
          <span className="text-4xl font-light text-white">Pro</span>
          <span className="ml-2 text-4xl font-bold px-2 bg-yellow-500 text-black rounded">FX</span>
        </div>
        <span className="text-xl text-gray-400 mt-2">Calcul lot</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <label className="block mb-2">Suma început zi:</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-800 text-white rounded mb-4"
            value={startOfDay}
            onChange={(e) => setStartOfDay(e.target.value === '' ? '' : Number(e.target.value))} onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}}
          />
          <label className="block mb-2">Suma final zi:</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-800 text-white rounded mb-4"
            value={endOfDay}
            onChange={(e) => setEndOfDay(e.target.value === '' ? '' : Number(e.target.value))} onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}}
          />
          <h2 className="text-lg">Procentaj zi</h2>
          <p className="text-xl font-bold text-yellow-400">{dayChange}%</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <label className="block mb-2">Suma început săptămână:</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-800 text-white rounded mb-4"
            value={startOfWeek}
            onChange={(e) => setStartOfWeek(e.target.value === '' ? '' : Number(e.target.value))} onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}}
          />
          <label className="block mb-2">Suma final săptămână:</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-800 text-white rounded mb-4"
            value={endOfWeek}
            onChange={(e) => setEndOfWeek(e.target.value === '' ? '' : Number(e.target.value))} onFocus={(e) => { if (e.target.value === '0') e.target.select(); }}}
          />
          <h2 className="text-lg">Procentaj săptămână</h2>
          <p className="text-xl font-bold text-yellow-400">{weekChange}%</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-center">Calculator Lot</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block mb-2">Selectează Pips SL:</label>
          <select
            className="w-full p-2 bg-gray-800 text-white rounded"
            value={selectedPips}
            onChange={(e) => setSelectedPips(Number(e.target.value))}
          >
            {[10, 15, 20, 25, 30, 35, 40].map((pips) => (
              <option key={pips} value={pips}>
                {pips} Pips ({pips * 10} Puncte)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Selectează Risc:</label>
          <select
            className="w-full p-2 bg-gray-800 text-white rounded"
            value={selectedRiskIndex}
            onChange={(e) => setSelectedRiskIndex(Number(e.target.value))}
          >
            {riskLabels.map((label, idx) => (
              <option key={idx} value={idx}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-xl mb-2">Rezultat</h2>
        <p className="text-2xl font-bold text-yellow-400">
          Lot recomandat: {roundedLot.toFixed(3)}
        </p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📉 Posibile pierderi (în funcție de suma început zi)</h2>
        <ul className="list-disc list-inside space-y-1">
          {dynamicLosses.map((item, idx) => (
            <li key={idx}>
              <span className="text-yellow-300">Risc {item.label}:</span> {item.value} EUR
            </li>
          ))}
        </ul>
        <button
          className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow"
          onClick={() => {
            localStorage.removeItem("startOfDay");
            localStorage.removeItem("endOfDay");
            localStorage.removeItem("startOfWeek");
            localStorage.removeItem("endOfWeek");
            setStartOfDay(0);
            setEndOfDay(0);
            setStartOfWeek(0);
            setEndOfWeek(0);
          }}
        >
          Reset date salvate
        </button>
      </div>
    </div>
  );
}
