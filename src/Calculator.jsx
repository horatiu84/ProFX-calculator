import React, { useState } from "react";

const riskLabels = ["0.5%", "1%", "1.5%", "2%", "2.5%", "3%", "3.5%"];
const riskValues = [0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035];

export default function Calculator() {
  const [selectedPips, setSelectedPips] = useState(10);
  const [selectedRiskIndex, setSelectedRiskIndex] = useState(0);
  const [accountSize, setAccountSize] = useState(1000);

  // Calcularea lotului
  const riskPercent = riskValues[selectedRiskIndex];
  const points = selectedPips * 10;
  const lotSize = accountSize > 0 ? (accountSize * riskPercent) / points : 0;
  // Rotunjire în jos la 2 zecimale pentru managementul riscului
  const roundedLot = Math.floor(lotSize * 100) / 100;

  // Calcularea posibilelor pierderi
  const dynamicLosses = riskValues.map((risk) => ({
    label: `${(risk * 100).toFixed(1)}%`,
    value: (accountSize * risk).toFixed(2),
  }));

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">📉 Calculator Lot</h2>
      
      {/* Informație despre mărimea contului cu input editabil */}
      <div className="text-center mb-6 p-4 bg-gray-800 rounded-lg">
        <label className="block mb-2 text-lg font-medium">Mărimea contului ($):</label>
        <input
          type="number"
          className="w-full max-w-xs mx-auto p-3 bg-gray-700 text-white text-center rounded-lg text-xl font-bold"
          value={accountSize}
          onChange={(e) => setAccountSize(e.target.value === "" ? 0 : Number(e.target.value))}
          placeholder="Introdu mărimea contului"
          min="0"
        />
        <p className="text-sm text-gray-400 mt-2">
          Introdu mărimea contului tău pentru calcularea precisă a lotului
        </p>
      </div>

      {/* Controale pentru calculare */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Selectare pips */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <label className="block mb-3 text-lg font-medium">Selectează Pips SL:</label>
          <select
            className="w-full p-3 bg-gray-800 text-white rounded-lg text-lg"
            value={selectedPips}
            onChange={(e) => setSelectedPips(Number(e.target.value))}
          >
            {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((pips) => (
              <option key={pips} value={pips}>
                {pips} Pips ({pips * 10} Puncte)
              </option>
            ))}
          </select>
        </div>

        {/* Selectare risc */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <label className="block mb-3 text-lg font-medium">Selectează Risc:</label>
          <select
            className="w-full p-3 bg-gray-800 text-white rounded-lg text-lg"
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

      {/* Rezultatul calculării */}
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg mb-10 text-center">
        <h3 className="text-xl mb-4">🎯 Rezultat</h3>
        <div className="text-4xl font-bold text-yellow-400 mb-2">
          {accountSize > 0 ? roundedLot.toFixed(2) : "0.00"}
        </div>
        <p className="text-lg text-gray-300">Lot recomandat</p>
        
        {accountSize > 0 && (
          <div className="mt-4 text-sm text-gray-400">
            <p>Pentru {selectedPips} pips SL și {riskLabels[selectedRiskIndex]} risc</p>
            <p>Pierderea maximă: <span className="text-red-400 font-bold">${(accountSize * riskPercent).toFixed(2)}</span></p>
            <div className="mt-3 p-3 bg-blue-800 bg-opacity-50 rounded border-l-4 border-blue-400">
              <p className="text-blue-200 text-xs">
                ⚠️ Lotul este rotunjit în jos pentru un management mai bun al riscului
              </p>
            </div>
          </div>
        )}

        {accountSize === 0 && (
          <p className="text-red-400 text-sm mt-4">
            ⚠️ Introdu mărimea contului pentru a calcula lotul
          </p>
        )}
      </div>

      {/* Tabelul cu posibile pierderi */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">📉 Posibile pierderi pentru diferite niveluri de risc</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dynamicLosses.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-lg ${
                idx === selectedRiskIndex 
                  ? 'bg-yellow-600 text-black font-bold' 
                  : 'bg-gray-700'
              }`}
            >
              <div className="text-lg font-semibold">Risc {item.label}</div>
              <div className="text-xl">${item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition-colors"
            onClick={() => {
              setSelectedPips(10);
              setSelectedRiskIndex(0);
              setAccountSize(1000);
            }}
          >
            🔄 Reset calculator
          </button>
        </div>
      </div>

      {/* Sfaturi și informații */}
      <div className="bg-blue-900 bg-opacity-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">💡 Sfaturi pentru managementul riscului:</h3>
        <ul className="space-y-2 text-sm">
          <li>• Niciodată nu risca mai mult de 1-1.5% din cont pe un singur trade</li>
          <li>• Calculează întotdeauna lotul în funcție de distanța până la stop loss</li>
          <li>• Lotul este rotunjit în jos pentru a nu depăși riscul calculat</li>
          <li>• Verifică de două ori calculele înainte de a deschide poziția</li>
          <li>• Respectă întotdeauna planul de trading și nu te lăsa ghidat de emoții</li>
        </ul>
      </div>
    </div>
  );
}