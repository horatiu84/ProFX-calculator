import React, { useState, useEffect } from "react";

const Calculator = () => {
  const [accountSize, setAccountSize] = useState("");
  const [riskPerTrade, setRiskPerTrade] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [selectedPair, setSelectedPair] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [results, setResults] = useState({
    lotSize: 0,
    stopLossValue: 0,
    takeProfitValue: 0,
    riskAmount: 0,
  });

  // Previne modificarea valorilor cu scroll wheel pe input-urile numerice
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.target.type === "number") {
        e.target.blur();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Icons ca SVG inline
  const ChevronDownIcon = () => (
    <svg
      className="h-5 w-5 text-gray-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  const SearchIcon = () => (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  const CalculatorIcon = () => (
    <svg
      className="h-6 w-6 text-yellow-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );

  // Date pentru perechile valutare cu valorile pip-ului (conform tabelului ProFX)
  const tradingPairs = {
    Commodities: {
      XAUUSD: { pipValue: 10, pipLocation: 2 },
      XTIUSD: { pipValue: 10, pipLocation: 2 },
      XAGUSD: { pipValue: 50, pipLocation: 3 },
    },
    "Forex Majors": {
      AUDUSD: { pipValue: 10, pipLocation: 4 },
      EURUSD: { pipValue: 10, pipLocation: 4 },
      GBPUSD: { pipValue: 10, pipLocation: 4 },
      NZDUSD: { pipValue: 10, pipLocation: 4 },
      USDCAD: { pipValue: 6.93, pipLocation: 4 },
      USDCHF: { pipValue: 11.08, pipLocation: 4 },
      USDJPY: { pipValue: 6.65, pipLocation: 2 },
    },
    "Forex Cross": {
      AUDCAD: { pipValue: 6.93, pipLocation: 4 },
      AUDCHF: { pipValue: 11.08, pipLocation: 4 },
      AUDJPY: { pipValue: 6.65, pipLocation: 2 },
      AUDNZD: { pipValue: 5.6, pipLocation: 4 },
      CADCHF: { pipValue: 11.08, pipLocation: 4 },
      CADJPY: { pipValue: 6.65, pipLocation: 2 },
      CHFJPY: { pipValue: 6.65, pipLocation: 2 },
      EURAUD: { pipValue: 6.21, pipLocation: 4 },
      EURCAD: { pipValue: 6.93, pipLocation: 4 },
      EURCHF: { pipValue: 11.08, pipLocation: 4 },
      EURGBP: { pipValue: 12.6, pipLocation: 4 },
      EURJPY: { pipValue: 6.65, pipLocation: 2 },
      EURNZD: { pipValue: 5.6, pipLocation: 4 },
      GBPAUD: { pipValue: 6.21, pipLocation: 4 },
      GBPCAD: { pipValue: 6.93, pipLocation: 4 },
      GBPCHF: { pipValue: 11.08, pipLocation: 4 },
      GBPJPY: { pipValue: 6.65, pipLocation: 2 },
      GBPNZD: { pipValue: 5.6, pipLocation: 4 },
      NZDCAD: { pipValue: 6.93, pipLocation: 4 },
      NZDCHF: { pipValue: 11.08, pipLocation: 4 },
      NZDJPY: { pipValue: 6.65, pipLocation: 2 },
    },
    Indices: {
      US30: { pipValue: 1, pipLocation: 0 },
      US500: { pipValue: 1, pipLocation: 0 },
      NAS100: { pipValue: 1, pipLocation: 0 },
      DE30: { pipValue: 1, pipLocation: 0 },
      UK100: { pipValue: 1, pipLocation: 0 },
    },
  };

  // Flatten toate perechile pentru search
  const allPairs = Object.entries(tradingPairs).reduce(
    (acc, [category, pairs]) => {
      Object.entries(pairs).forEach(([pair, data]) => {
        acc[pair] = { ...data, category };
      });
      return acc;
    },
    {}
  );

  // Calculul dimensiunii poziției
  const calculatePosition = () => {
    if (!accountSize || !riskPerTrade || !stopLoss || !selectedPair) {
      return;
    }

    const pairData = allPairs[selectedPair];
    if (!pairData) return;

    const accountValue = parseFloat(accountSize);
    const riskPercent = parseFloat(riskPerTrade) / 100;
    const slPips = parseFloat(stopLoss);
    const tpPips = parseFloat(takeProfit) || 0;

    const riskAmount = accountValue * riskPercent;
    const pipValuePerStandardLot = pairData.pipValue;
    const calculatedLotSize = riskAmount / (slPips * pipValuePerStandardLot);
    const roundedLotSize = Math.round(calculatedLotSize * 100) / 100;

    const stopLossValue = roundedLotSize * slPips * pipValuePerStandardLot;
    const takeProfitValue =
      tpPips > 0 ? roundedLotSize * tpPips * pipValuePerStandardLot : 0;

    setResults({
      lotSize: roundedLotSize,
      stopLossValue,
      takeProfitValue,
      riskAmount,
    });
  };

  useEffect(() => {
    calculatePosition();
  }, [accountSize, riskPerTrade, stopLoss, takeProfit, selectedPair]);

  const handlePairSelect = (pair) => {
    setSelectedPair(pair);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  // Funcție pentru formatarea numerelor cu separatori de mii
  const formatNumber = (number, decimals = 2) => {
    if (isNaN(number) || number === 0) return "0,00";
    
    const formattedNumber = number.toFixed(decimals);
    const parts = formattedNumber.split('.');
    
    // Adaugă puncte ca separatori de mii
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Înlocuiește punctul zecimal cu virgula
    return parts.join(',');
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <CalculatorIcon />
            <h1 className="text-4xl font-bold text-white ml-3">
              Calculator <span className="text-yellow-400">Lot</span>
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Calculează dimensiunea optimă a lot-ului pentru fiecare tranzacție
            bazată pe riscul dorit
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
              <h2 className="text-2xl font-bold text-white">
                Parametri de intrare
              </h2>
            </div>

            <div className="space-y-6">
              {/* Pair Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Perechea valutară / Instrumentul
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-4 text-left shadow-lg hover:bg-gray-650 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 flex items-center justify-between text-white"
                  >
                    <span
                      className={selectedPair ? "text-white" : "text-gray-400"}
                    >
                      {selectedPair || "Selectează instrumentul..."}
                    </span>
                    <ChevronDownIcon />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-20 mt-2 w-full bg-gray-700 shadow-2xl max-h-80 rounded-xl py-2 text-base overflow-auto border border-gray-600">
                      <div className="sticky top-0 bg-gray-700 p-3 border-b border-gray-600">
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <SearchIcon />
                          </div>
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Caută instrumentul..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400 bg-gray-800"
                          />
                        </div>
                      </div>

                      {Object.entries(tradingPairs).map(([category, pairs]) => (
                        <div key={category}>
                          <div className="px-4 py-2 text-xs font-bold text-yellow-400 bg-gray-800 sticky top-16 border-b border-gray-600">
                            {category}
                          </div>
                          {Object.keys(pairs)
                            .filter((pair) =>
                              pair
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            )
                            .map((pair) => (
                              <button
                                key={pair}
                                onClick={() => handlePairSelect(pair)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none text-white transition-colors duration-200"
                              >
                                {pair}
                              </button>
                            ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Account Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Mărimea contului ($)
                </label>
                <input
                  type="number"
                  value={accountSize}
                  onChange={(e) => setAccountSize(e.target.value)}
                  placeholder="10000"
                  className="w-full px-4 py-4 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400 bg-gray-700 shadow-lg transition-all duration-200"
                />
              </div>

              {/* Risk Per Trade */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Risc per trade (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPerTrade}
                  onChange={(e) => setRiskPerTrade(e.target.value)}
                  placeholder="2"
                  className="w-full px-4 py-4 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400 bg-gray-700 shadow-lg transition-all duration-200"
                />
              </div>

              {/* Stop Loss */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Stop Loss (pips)
                </label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-4 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400 bg-gray-700 shadow-lg transition-all duration-200"
                />
              </div>

              {/* Take Profit */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Take Profit (pips) - opțional
                </label>
                <input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-4 border border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400 bg-gray-700 shadow-lg transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">Rezultate</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">
                      Mărimea lotului:
                    </span>
                    <span className="text-2xl font-bold text-blue-400">
                      {formatNumber(results.lotSize)} loturi
                    </span>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">
                      Valoarea Stop Loss:
                    </span>
                    <span className="text-2xl font-bold text-red-400">
                      -${formatNumber(results.stopLossValue)}
                    </span>
                  </div>
                </div>

                {takeProfit && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">
                        Valoarea Take Profit:
                      </span>
                      <span className="text-2xl font-bold text-green-400">
                        +${formatNumber(results.takeProfitValue)}
                      </span>
                    </div>
                  </div>
                )}

                {takeProfit && results.stopLossValue > 0 && (
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-300 font-medium">
                        Raportul Risk/Reward:
                      </span>
                      <span className="text-2xl font-bold text-yellow-400">
                        1:
                        {formatNumber(results.takeProfitValue / results.stopLossValue)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {selectedPair && allPairs[selectedPair] && (
                <div className="mt-6 p-6 bg-gray-700/50 rounded-xl border border-gray-600">
                  <div className="text-sm text-gray-300">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                      <span className="font-semibold text-white">
                        Informații despre {selectedPair}
                      </span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <p>
                        Categoria:{" "}
                        <span className="text-yellow-400">
                          {allPairs[selectedPair].category}
                        </span>
                      </p>
                      <p>
                        Valoare pip per 1 lot:{" "}
                        <span className="text-green-400">
                          ${allPairs[selectedPair].pipValue}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Formula explanation */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="font-bold text-gray-200 mb-4 flex items-center">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                Formula utilizată:
              </h3>
              <div className="text-sm font-mono bg-gray-900 text-green-400 p-4 rounded-lg border border-gray-600">
                Lot Size = Risc ($) ÷ (SL pips x Valoare pip per lot)
              </div>
            </div>
          </div>
        </div>

        {/* How to Use Section */}

        <div className="mb-8 mt-10 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
              <div className="w-3 h-3"></div>
              📖 Cum să folosești calculatorul
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-gray-300">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-300 mb-3">
                  Pasul 1: Completează datele
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      1
                    </span>
                    <div>
                      <span className="font-semibold text-white">
                        Selectează instrumentul:
                      </span>
                      <p className="text-sm text-gray-400">
                        Alege perechea valutară sau instrumentul pe care vrei să
                        îl tranzacționezi (EUR/USD, Gold, etc.)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      2
                    </span>
                    <div>
                      <span className="font-semibold text-white">
                        Mărimea contului:
                      </span>
                      <p className="text-sm text-gray-400">
                        Introdu valoarea totală a contului tău de trading în
                        dolari americani
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      3
                    </span>
                    <div>
                      <span className="font-semibold text-white">
                        Riscul per trade:
                      </span>
                      <p className="text-sm text-gray-400">
                        Setează procentul din cont pe care ești dispus să îl
                        riști (recomandat: 1-1.5%)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      4
                    </span>
                    <div>
                      <span className="font-semibold text-white">
                        Stop Loss:
                      </span>
                      <p className="text-sm text-gray-400">
                        Distanța în pips până la nivelul unde vei închide
                        poziția la pierdere
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-300 mb-3">
                  Pasul 2: Interpretează rezultatele
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <span className="font-semibold text-red-400">
                      Valoarea Stop Loss:
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      Suma exactă în dolari pe care o vei pierde dacă se atinge
                      Stop Loss-ul
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <span className="font-semibold text-blue-400">
                      Mărimea lotului:
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      Dimensiunea poziției calculate pentru a respecta riscul
                      stabilit
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <span className="font-semibold text-yellow-400">
                      Risk/Reward:
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      Raportul dintre profit potențial și pierderea maximă{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-600">
              <h4 className="font-bold text-orange-300 mb-3 flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                Important de reținut:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-start">
                  <span className="text-orange-400 font-bold mr-2">•</span>
                  <span>
                    Calculatorul folosește valorile pip corecte pentru fiecare
                    instrument
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-400 font-bold mr-2">•</span>
                  <span>
                    Stop Loss-ul trebuie să fie bazat pe analiza tehnică, nu pe
                    distanță arbitrară
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-400 font-bold mr-2">•</span>
                  <span>
                    Verifică întotdeauna calculele înainte de a deschide poziția
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-400 font-bold mr-2">•</span>
                  <span>
                    Respectă disciplina și nu modifica lotul pe baza emoțiilor
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;