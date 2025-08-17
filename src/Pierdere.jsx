import React, { useState, useEffect } from "react";

export default function Pierdere() {
  const [slPips, setSlPips] = useState(50);
  const [customLotRaw, setCustomLotRaw] = useState("0.01");
  const [customLot, setCustomLot] = useState(0);
  const [accountSize, setAccountSize] = useState(1000); // Mărimea contului independentă

  // Effect pentru actualizarea lotului când se schimbă input-ul
  useEffect(() => {
    const parsed = parseFloat(customLotRaw);
    setCustomLot(!isNaN(parsed) ? parsed : 0);
  }, [customLotRaw]);

  // Calcularea pierderii
  const calculatedLoss = (customLot * slPips * 10).toFixed(2);
  const lossPercentage = accountSize > 0 ? ((calculatedLoss / accountSize) * 100).toFixed(2) : 0;
  const isHighRisk = accountSize > 0 && calculatedLoss / accountSize > 0.01;

  // Funcții helper pentru input-uri
  const handleSlPipsChange = (e) => {
    const value = e.target.value;
    setSlPips(value === "" ? 0 : Number(value));
  };

  const handleLotChange = (e) => {
    setCustomLotRaw(e.target.value);
  };

  const handleLotBlur = () => {
    if (customLotRaw === "") setCustomLotRaw("0");
  };

  // Funcție pentru resetarea valorilor
  const resetValues = () => {
    setSlPips(50);
    setCustomLotRaw("0.01");
    setAccountSize(1000);
  };

  // Calcularea unor exemple rapide
  const quickExamples = [
    { lot: 0.01, pips: 50 },
    { lot: 0.05, pips: 30 },
    { lot: 0.1, pips: 20 },
    { lot: 0.2, pips: 15 }
  ].map(example => ({
    ...example,
    loss: (example.lot * example.pips * 10).toFixed(2),
    percentage: accountSize > 0 ? (((example.lot * example.pips * 10) / accountSize) * 100).toFixed(2) : 0
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">⚙️ Calculator Pierdere Manuală</h2>
      
      {/* Input pentru mărimea contului */}
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
          Introdu mărimea contului pentru calcularea procentajului de risc
        </p>
      </div>

      {/* Calculator principal */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6">
        {/* Input pentru SL pips */}
        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium">La câți pips este Stop Loss?</label>
          <input
            type="number"
            className="w-full p-3 bg-yellow-200 text-black font-bold text-center rounded-lg text-xl"
            value={slPips === 0 ? "" : slPips}
            onChange={handleSlPipsChange}
            placeholder="Introdu pips SL"
          />
        </div>

        {/* Input pentru lot */}
        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium">Cu ce lot intri în tranzacție?</label>
          <input
            type="text"
            inputMode="decimal"
            className="w-full p-3 bg-yellow-200 text-black font-bold text-center rounded-lg text-xl"
            value={customLotRaw}
            onChange={handleLotChange}
            onBlur={handleLotBlur}
            placeholder="0.01"
          />
        </div>

        {/* Rezultatul pierderii */}
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium">Pierderea estimată:</label>
          <div
            className={`w-full p-4 text-center font-bold text-2xl rounded-lg transition-all duration-300 ${
              isHighRisk 
                ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50" 
                : "bg-green-200 text-black"
            }`}
          >
            ${calculatedLoss}
          </div>
        </div>

        {/* Informații despre procentajul pierderii */}
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <p className="text-lg mb-2">
            Procentajul pierderii: 
            <span className={`font-bold ml-2 text-xl ${
              parseFloat(lossPercentage) > 2 ? 'text-red-400' :
              parseFloat(lossPercentage) > 1 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {lossPercentage > 2000 ? "0.00" : lossPercentage}%
            </span>
          </p>
          
          {isHighRisk && accountSize > 0 && (
            <p className="text-red-400 text-sm animate-pulse">
              ⚠️ ATENȚIE: Risc prea mare! Pierderea depășește 1% din cont
            </p>
          )}
          
          {parseFloat(lossPercentage) <= 1 && accountSize > 0 && (
            <p className="text-green-400 text-sm">
              ✅ Risc acceptabil - sub 1% din cont
            </p>
          )}

          {accountSize === 0 && (
            <p className="text-yellow-400 text-sm">
              ⚠️ Introdu mărimea contului pentru calcularea procentajului
            </p>
          )}
        </div>
      </div>

      {/* Butoane de acțiuni */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={resetValues}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          🔄 Reset valori
        </button>
      </div>

      {/* Sfaturi */}
      <div className="mt-6 bg-blue-900 bg-opacity-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">💡 Sfaturi pentru managementul riscului:</h4>
        <ul className="text-sm space-y-1 text-gray-200">
          <li>• Niciodată nu risca mai mult de 1-2% din cont pe un trade</li>
          <li>• Dacă rezultatul devine roșu, redu lotul sau ajusteaza SL</li>
          <li>• Verifică întotdeauna calculele înainte de a deschide poziția</li>
          <li>• Un SL mai mare nu înseamnă întotdeauna un risc mai mare dacă ajustezi lotul</li>
          <li>• Consistența în managementul riscului este cheia succesului pe termen lung</li>
        </ul>
      </div>
    </div>
  );
}