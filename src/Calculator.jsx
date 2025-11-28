import React, { useState, useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";

const Calculator = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [accountSize, setAccountSize] = useState("");
  const [riskPerTrade, setRiskPerTrade] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [selectedPair, setSelectedPair] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pipLotInput, setPipLotInput] = useState(0.01);
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
    const parts = formattedNumber.split(".");

    // Adaugă puncte ca separatori de mii
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Înlocuiește punctul zecimal cu virgula
    return parts.join(",");
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div key={language} className="max-w-7xl mx-auto animate-language-change">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600/50 hover:border-gray-500 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Înapoi la Calculatoare</span>
          </button>
        )}
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <CalculatorIcon />
            <h1 className="text-4xl font-bold text-white ml-3">
              {t('calculator.title')} <span className="text-yellow-400">{t('calculator.titleHighlight')}</span>
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {t('calculator.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden shadow-2xl">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">
                  {t('calculator.inputTitle')}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Pair Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    {t('calculator.pairLabel')}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-4 text-left shadow-lg hover:bg-gray-650 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 flex items-center justify-between text-white"
                    >
                      <span
                        className={
                          selectedPair ? "text-white" : "text-gray-400"
                        }
                      >
                        {selectedPair || t('calculator.pairPlaceholder')}
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
                              placeholder={t('calculator.searchPlaceholder')}
                              className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-gray-400 bg-gray-800"
                            />
                          </div>
                        </div>

                        {Object.entries(tradingPairs).map(
                          ([category, pairs]) => (
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
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    {t('calculator.accountSizeLabel')}
                  </label>
                  <input
                    type="number"
                    value={accountSize}
                    onChange={(e) => setAccountSize(e.target.value)}
                    placeholder={t('calculator.accountSizePlaceholder')}
                    className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 hover:bg-gray-700/50 text-white placeholder-gray-400 transition-all duration-300"
                  />
                </div>

                {/* Risk Per Trade */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    {t('calculator.riskPerTradeLabel')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={riskPerTrade}
                    onChange={(e) => setRiskPerTrade(e.target.value)}
                    placeholder={t('calculator.riskPerTradePlaceholder')}
                    className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 hover:bg-gray-700/50 text-white placeholder-gray-400 transition-all duration-300"
                  />
                </div>

                {/* Stop Loss */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    {t('calculator.stopLossLabel')}
                  </label>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder={t('calculator.stopLossPlaceholder')}
                    className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 hover:bg-gray-700/50 text-white placeholder-gray-400 transition-all duration-300"
                  />
                </div>

                {/* Take Profit */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    {t('calculator.takeProfitLabel')}
                  </label>
                  <input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder={t('calculator.takeProfitPlaceholder')}
                    className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 hover:bg-gray-700/50 text-white placeholder-gray-400 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Results Section */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-green-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden shadow-2xl">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">{t('calculator.resultsTitle')}</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">
                      {t('calculator.lotSizeLabel')}
                    </span>
                    <span className="text-2xl font-bold text-amber-400">
                      {formatNumber(results.lotSize)} {t('calculator.lotSizeUnit')}
                    </span>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">
                      {t('calculator.stopLossValueLabel')}
                    </span>
                    <span className="text-2xl font-bold text-red-400">
                      -${formatNumber(results.stopLossValue)}
                    </span>
                  </div>
                </div>

                {takeProfit && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">
                        {t('calculator.takeProfitValueLabel')}
                      </span>
                      <span className="text-2xl font-bold text-white">
                        +${formatNumber(results.takeProfitValue)}
                      </span>
                    </div>
                  </div>
                )}

                {takeProfit && results.stopLossValue > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">
                        {t('calculator.riskRewardLabel')}
                      </span>
                      <span className="text-2xl font-bold text-amber-400">
                        1:
                        {formatNumber(
                          results.takeProfitValue / results.stopLossValue
                        )}
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
                        {t('calculator.pairInfoTitle')} {selectedPair}
                      </span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <p>
                        {t('calculator.categoryLabel')}{" "}
                        <span className="text-yellow-400">
                          {allPairs[selectedPair].category}
                        </span>
                      </p>
                      <p>
                        {t('calculator.pipValueLabel')}{" "}
                        <span className="text-amber-400">
                          ${allPairs[selectedPair].pipValue}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
        
          </div>
        </div>

        {/* How to Use Section */}

        <div className="mb-8 mt-10 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
              <div className="w-3 h-3"></div>
              📖 {t('calculator.howToUseTitle')}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-gray-300">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-400 mb-3">
                  {t('calculator.step1Title')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      1
                    </span>
                    <div>
                      <span className="font-semibold text-white">
                        {t('calculator.step1Point1Title')}
                      </span>
                      <p className="text-sm text-gray-400">
                        {t('calculator.step1Point1Desc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      2
                    </span>
                    <div>
                      <span className="font-semibold text-white">
                        {t('calculator.step1Point2Title')}
                      </span>
                      <p className="text-sm text-gray-400">
                        {t('calculator.step1Point2Desc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      3
                    </span>
                    <div>
                      <span className="font-semibold text-white">
                        {t('calculator.step1Point3Title')}
                      </span>
                      <p className="text-sm text-gray-400">
                        {t('calculator.step1Point3Desc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-500 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      4
                    </span>
                    <div>
                      <span className="font-semibold text-white">
                        {t('calculator.step1Point4Title')}
                      </span>
                      <p className="text-sm text-gray-400">
                        {t('calculator.step1Point4Desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t('calculator.step2Title')}
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <span className="font-semibold text-red-400">
                      {t('calculator.step2Point1Title')}
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      {t('calculator.step2Point1Desc')}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <span className="font-semibold text-amber-400">
                      {t('calculator.step2Point2Title')}
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      {t('calculator.step2Point2Desc')}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <span className="font-semibold text-yellow-400">
                      {t('calculator.step2Point3Title')}
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      {t('calculator.step2Point3Desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-600">
              <h4 className="font-bold text-orange-300 mb-3 flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                {t('calculator.importantTitle')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-start">
                  <span className="text-orange-400 font-bold mr-2">•</span>
                  <span>
                    {t('calculator.importantPoint1')}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-400 font-bold mr-2">•</span>
                  <span>
                    {t('calculator.importantPoint2')}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-400 font-bold mr-2">•</span>
                  <span>
                    {t('calculator.importantPoint3')}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-orange-400 font-bold mr-2">•</span>
                  <span>
                    {t('calculator.importantPoint4')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Note - Scroll to Pip Calculator */}
        <div className="mt-12 mb-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/40 via-cyan-900/40 to-blue-900/40 border-2 border-cyan-400/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  💡 {t('calculator.infoNoteTitle')}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t('calculator.infoNoteText')}{" "}
                  <span className="font-bold text-white">
                    {t('calculator.infoNoteBold')}
                  </span>{" "}
                  {t('calculator.infoNoteText2')}
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-amber-400 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Pip Information and Calculator Section */}
        <div className="mt-12 space-y-8">
          {/* Pip Information Card */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden shadow-2xl">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">
                  {t('calculator.pipInfoTitle')}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    {t('calculator.pipInfoText1')}
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {t('calculator.pipInfoText2')}{" "}
                    <span className="text-amber-400 font-semibold">{t('calculator.pipInfoText2Highlight')}</span>{" "}
                    {t('calculator.pipInfoText2End')}
                  </p>
                  <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                    <p className="text-amber-300">
                      <strong>{t('calculator.pipInfoExample')}</strong> {t('calculator.pipInfoExampleText')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <svg
                      className="w-6 h-6 text-amber-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <h3 className="text-xl font-bold text-white">
                      {t('calculator.pipValueTitle')}
                    </h3>
                  </div>
                  <p className="text-gray-300">
                    {t('calculator.pipValueText1')}
                  </p>
                  <p className="text-gray-300">
                    {t('calculator.pipValueText2')}{" "}
                    <span className="text-amber-400 font-semibold">{t('calculator.pipValueHighlight')}</span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pip Calculator */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-cyan-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden shadow-2xl">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">
                  {t('calculator.pipCalculatorTitle')}
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-gray-300 font-medium mb-3">
                    {t('calculator.pipCalculatorLabel')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="w-full p-4 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 hover:bg-gray-700/50 transition-all duration-300"
                    value={pipLotInput}
                    onChange={(e) =>
                      setPipLotInput(parseFloat(e.target.value) || 0.01)
                    }
                  />
                  <div className="mt-4 p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                    <p className="text-amber-300 text-lg">
                      {t('calculator.pipCalculatorValue')}{" "}
                      <span className="text-2xl font-bold text-white">
                        {(pipLotInput * 10).toFixed(2)} USD
                      </span>
                    </p>
                  </div>
                </div>

                {/* Lot Size Table */}
                <div className="overflow-hidden rounded-xl border border-gray-600">
                  <table className="w-full text-sm text-white">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="p-3 text-left font-semibold text-yellow-400">
                          {t('calculator.tableHeaderLots')}
                        </th>
                        <th className="p-3 text-left font-semibold text-yellow-400">
                          {t('calculator.tableHeaderPipValue')}
                        </th>
                        <th className="p-3 text-left font-semibold text-yellow-400">
                          {t('calculator.tableHeader10Pips')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800/50">
                      {[
                        ["0.01", "0.1 USD", "1 USD"],
                        ["0.05", "0.5 USD", "5 USD"],
                        ["0.10", "1 USD", "10 USD"],
                        ["0.20", "2 USD", "20 USD"],
                        ["0.50", "5 USD", "50 USD"],
                        ["1.00", "10 USD", "100 USD"],
                        ["1.25", "12.5 USD", "125 USD"],
                        ["1.50", "15 USD", "150 USD"],
                        ["1.75", "17.5 USD", "175 USD"],
                        ["2.00", "20 USD", "200 USD"],
                      ].map(([lot, value, example], idx) => (
                        <tr
                          key={idx}
                          className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="p-3 font-medium">{lot}</td>
                          <td className="p-3 text-white">{value}</td>
                          <td className="p-3 text-yellow-400">{example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
