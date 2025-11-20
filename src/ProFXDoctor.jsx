import React, { useState, useMemo } from "react";
import { useLanguage } from "./contexts/LanguageContext";

// Componenta pentru Gauge Meter
const GaugeMeter = ({ value, label, color }) => {
  // value între 0 și 100
  const rotation = (value / 100) * 180 - 90; // -90 la 90 grade
  
  // Determină culoarea în funcție de valoare
  const getColor = () => {
    if (value <= 33) return "#10b981"; // verde
    if (value <= 66) return "#fbbf24"; // galben
    return "#ef4444"; // roșu
  };

  const needleColor = color || getColor();
  
  // Creăm un ID unic pentru gradient (eliminăm spațiile și caracterele speciale)
  const gradientId = `gradient-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Gauge Container */}
      <div className="relative w-32 h-16 overflow-hidden">
        {/* Background Arc */}
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          {/* Base arc cu gradient */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-14 origin-bottom transition-transform duration-700 ease-out"
          style={{ 
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            background: needleColor
          }}
        >
          <div 
            className="absolute -bottom-1 left-1/2 w-3 h-3 rounded-full -translate-x-1/2"
            style={{ background: needleColor }}
          />
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-200">{label}</p>
        <p className="text-xs text-gray-500">{value}%</p>
      </div>
    </div>
  );
};

// Componenta pentru Progress Bar (folosit în Full Report)
const ProgressBar = ({ value, max = 100, color = "emerald" }) => {
  const percentage = (value / max) * 100;
  
  const colorClasses = {
    emerald: "bg-emerald-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500"
  };

  return (
    <div className="w-full bg-gray-700/30 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full ${colorClasses[color]} transition-all duration-700 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const ProFXDoctor = ({ accountData, onClose }) => {
  const { language, translations } = useLanguage();
  const t = translations.profxDoctor || {};

  // State pentru afișarea secțiunilor
  const [expandedSection, setExpandedSection] = useState(null);
  
  // State pentru modal explicații
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState(null);

  // Generăm date de analiză bazate pe performanța contului
  const analysisData = useMemo(() => {
    if (!accountData) {
      return {
        gauges: {
          behavioural: 25,
          emotional: 30,
          overstimulation: 45,
          stopAccuracy: 65,
          strategic: 28,
          tradeExecution: 35,
          tradeTiming: 70,
          riskManagement: 50
        },
        strengths: [
          { name: "On-fire Days", impact: 85, effect: 216 },
          { name: "Selective Trades", impact: 65, effect: 150 },
          { name: "Manual Profit Taking", impact: 55, effect: 127 },
          { name: "Golden Times", impact: 45, effect: 96 }
        ],
        weaknesses: [
          { name: "Impatient Exits", impact: 90, effect: -180 },
          { name: "Fail to Call it a Day", impact: 75, effect: -127 },
          { name: "Impatient Entries", impact: 45, effect: -75 },
          { name: "Overtrading", impact: 40, effect: -60 },
          { name: "Overoptimism", impact: 35, effect: -49 },
          { name: "Catch a Falling Knife", impact: 25, effect: -26 }
        ],
        risks: [
          {
            area: "Emotional Losing Streak",
            status: "good",
            message: "Good job! You do not tend to increase your risk during a losing streak."
          },
          {
            area: "All-in Trades",
            status: "good",
            message: "Good job! You did not make any recent All-in Trades."
          },
          {
            area: "Trade without SL",
            status: "warning",
            message: "Only 74.84% of your trades had a Stop Loss!"
          }
        ]
      };
    }

    // Calculăm metrici bazate pe date reale
    const stats = accountData.stats.all;
    const winRate = stats.winRate || 0;
    const drawdown = stats.drawdown || 0;
    const totalTrades = stats.totalTrades || 0;

    // Calculăm scorurile pentru gauge-uri (0-100, unde 0 = excelent, 100 = probleme majore)
    const behavioural = Math.min(100, Math.max(0, 100 - winRate));
    const emotional = Math.min(100, Math.max(0, drawdown * 2.5));
    const overstimulation = totalTrades > 800 ? Math.min(100, (totalTrades - 500) / 10) : 30;
    const stopAccuracy = Math.min(100, Math.max(0, 100 - winRate * 1.2));
    const strategic = Math.min(100, Math.max(0, 100 - stats.gain));
    const tradeExecution = Math.min(100, Math.max(0, 50 - (winRate - 50)));
    const tradeTiming = Math.min(100, Math.max(0, drawdown * 3));
    const riskManagement = Math.min(100, Math.max(0, drawdown * 2));

    return {
      gauges: {
        behavioural: Math.round(behavioural),
        emotional: Math.round(emotional),
        overstimulation: Math.round(overstimulation),
        stopAccuracy: Math.round(stopAccuracy),
        strategic: Math.round(strategic),
        tradeExecution: Math.round(tradeExecution),
        tradeTiming: Math.round(tradeTiming),
        riskManagement: Math.round(riskManagement)
      },
      strengths: [
        { name: language === "ro" ? "Zile în formă maximă" : "On-fire Days", impact: 85, effect: Math.round(stats.profit * 0.3) },
        { name: language === "ro" ? "Tranzacții selective" : "Selective Trades", impact: 65, effect: Math.round(stats.profit * 0.2) },
        { name: language === "ro" ? "Închidere manuală a profitului" : "Manual Profit Taking", impact: 55, effect: Math.round(stats.profit * 0.15) },
        { name: language === "ro" ? "Momente de aur" : "Golden Times", impact: 45, effect: Math.round(stats.profit * 0.1) }
      ],
      weaknesses: [
        { name: language === "ro" ? "Ieșiri pripite" : "Impatient Exits", impact: 90, effect: -Math.round(Math.abs(stats.profit) * 0.25) },
        { name: language === "ro" ? "Nu știi când să închei ziua" : "Fail to Call it a Day", impact: 75, effect: -Math.round(Math.abs(stats.profit) * 0.18) },
        { name: language === "ro" ? "Intrări pripite" : "Impatient Entries", impact: 45, effect: -Math.round(Math.abs(stats.profit) * 0.1) },
        { name: language === "ro" ? "Tranzacționare excesivă" : "Overtrading", impact: 40, effect: -Math.round(Math.abs(stats.profit) * 0.08) },
        { name: language === "ro" ? "Exces de optimism" : "Overoptimism", impact: 35, effect: -Math.round(Math.abs(stats.profit) * 0.07) },
        { name: language === "ro" ? "Prinderea unui cuțit în cădere" : "Catch a Falling Knife", impact: 25, effect: -Math.round(Math.abs(stats.profit) * 0.04) }
      ],
      risks: [
        {
          area: language === "ro" ? "Pierderi emoționale consecutive" : "Emotional Losing Streak",
          key: "Emotional Losing Streak",
          status: "good",
          message: language === "ro" 
            ? "Bravo! Nu ai tendința să mărești riscul în timpul unei serii consecutive de pierderi."
            : "Good job! You do not tend to increase your risk during a losing streak."
        },
        {
          area: language === "ro" ? "Tranzacții All-in" : "All-in Trades",
          key: "All-in Trades",
          status: "good",
          message: language === "ro"
            ? "Bravo! Nu ai făcut recent tranzacții de tip \"All-in\"."
            : "Good job! You did not make any recent All-in Trades."
        },
        {
          area: language === "ro" ? "Tranzacții fără Stop Loss" : "Trade without SL",
          key: "Trade without SL",
          status: winRate > 75 ? "good" : "warning",
          message: winRate > 75
            ? (language === "ro" 
              ? "Excelent! Toate tranzacțiile tale au avut un Stop Loss."
              : "Excellent! All your trades had a Stop Loss.")
            : (language === "ro"
              ? `Doar ${winRate.toFixed(1)}% dintre tranzacțiile tale au avut un Stop Loss!`
              : `Only ${winRate.toFixed(1)}% of your trades had a Stop Loss!`)
        },
        {
          area: language === "ro" ? "Asumare excesivă a riscului" : "Excessive Risk Taking",
          key: "Excessive Risk Taking",
          status: "good",
          message: language === "ro"
            ? "Bravo! Îți gestionezi bine riscul per tranzacție."
            : "Good job! You manage your risk per trade well."
        },
        {
          area: language === "ro" ? "Dezechilibru între Profit și Risc" : "Reward Risk Imbalance",
          key: "Reward Risk Imbalance",
          status: "warning",
          message: language === "ro"
            ? "În medie, pierzi mai mult la o tranzacție pierzătoare decât câștigi la una câștigătoare."
            : "On average, you lose more in a losing trade than you gain in a winning trade."
        }
      ]
    };
  }, [accountData, language]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
 // Explicații pentru fiecare risc
const riskExplanations = {
  "Emotional Losing Streak": {
    title: language === "ro" ? "Pierderi consecutive generate de emoții" : "Emotional Losing Streak",
    description: language === "ro"
      ? "Acest comportament apare atunci când un trader începe să mărească riscul per tranzacție după o serie de pierderi.\n\nUnii traderi cred eronat că probabilitatea unei tranzacții câștigătoare crește după mai multe pierderi — o percepție explicată prin Eroarea Jucătorului (Gambler's Fallacy). De asemenea, mulți traderi ajung să facă „tranzacții de răzbunare”, crescând riscul în mod emoțional."
      : "Increase Risk in Losing Streak is when you increase your risk per trade after incurring a number of losses in your previous trades.\n\nSome traders perceive that the winning likelihood of their trades increases when they experience a couple of loss trades beforehand. This behaviour is explained in Gambler's Fallacy. Moreover, some traders tend to revenge trade after losses, including higher risks per trade."
  },

  "Trade without SL": {
    title: language === "ro" ? "Tranzacții fără Stop Loss" : "Trade without SL",
    description: language === "ro"
      ? "Tranzacțiile fără Stop Loss sunt situațiile în care traderul nu setează un nivel de protecție împotriva pierderilor.\n\nChiar dacă unii traderi își monitorizează activ pozițiile, mișcările rapide ale pieței, știrile sau evenimentele neașteptate (cisne negre) pot declanșa volatilitate puternică. Monitorizarea manuală nu este întotdeauna suficientă. Fiecare tranzacție fără SL expune contul unui risc semnificativ."
      : "Trade without SL describes trades where no Stop Loss (SL) was set by the trader.\n\nIt is recommended that every trade be secured by a Stop Loss, yet some traders tend to not do so as they monitor their trades. However, news, black swan events, etc. may heavily influence prices at any point in time. Active monitoring may not always help to secure positions given the speed of market movements and the impact of emotional effects when strong price actions occur. Every trade without a SL imposes a risk for the trader."
  },

  "All-in Trades": {
    title: language === "ro" ? "Tranzacții All-in" : "All-in Trades",
    description: language === "ro"
      ? "Tranzacțiile All-in apar atunci când traderul riscă o parte extrem de mare din capital într-o singură tranzacție, expunând contul riscului de lichidare sau apel de marjă.\n\nAceste tranzacții sunt de obicei rezultatul presiunii emoționale după o serie de pierderi sau a variațiilor mari în PnL-ul deschis. Stabilirea unor limite clare, cum ar fi oprirea tranzacționării după o pierdere de X% într-o zi, poate preveni comportamentele de tip All-in."
      : "All-in Trades are when traders enter a trade with excessive risk exposure that could lead to a margin call of the account.\n\nAll-in Trades are extremely risky and can lead to a margin call of your trading account. All-in trades are often placed as a result of high influence from open PnL following a previous losing streak. Establishing clear risk management rules for all open positions, such as stopping trading after X% loss in a day, can help prevent all-in trades."
  },

  "Excessive Risk Taking": {
    title: language === "ro" ? "Asumare excesivă a riscului" : "Excessive Risk Taking",
    description: language === "ro"
      ? "Asumarea excesivă a riscului descrie situațiile în care un trader deschide poziții cu un risc prea mare, ceea ce poate duce la drawdown-uri majore pe termen lung.\n\nFiecare trader va trece prin serii de pierderi și perioade cu rată de succes scăzută. Dacă riscul per tranzacție este prea ridicat, aceste perioade pot duce rapid la pierderi severe sau chiar apeluri de marjă. De aceea, gestionarea atentă a riscului per tranzacție este esențială pentru protejarea capitalului."
      : "Excessive Risk Taking describes the behaviour of placing trades with risks that are likely to result in significant drawdowns over the long term.\n\nEvery trader will experience loss streaks and periods of below-average hit rates. When excessive risk is taken per trade, the trader is more likely to face large drawdowns or even margin calls during these periods. Therefore, it is crucial for traders to carefully manage risk per trade to protect their account during times of losses and low hit rates."
  },

  "Reward Risk Imbalance": {
    title: language === "ro" ? "Dezechilibru între Profit și Risc" : "Reward Risk Imbalance",
    description: language === "ro"
      ? "Dezechilibrul între Profit și Risc apare atunci când traderul pierde mai mult pe tranzacțiile pierzătoare decât câștigă pe cele profitabile. Pentru a rămâne profitabil, un trader are nevoie în acest caz de un Raport Risc-Recompensă (RRR) mai mare de 50%.\n\nAnaliza se referă la RRR-ul real, calculat pe baza tranzacțiilor efectiv executate. RRR-ul inițial setat prin TP și SL poate fi diferit dacă traderul modifică nivelurile sau închide manual tranzacțiile. Notă: anumite strategii profitabile folosesc un RRR scăzut, compensat de o rată de câștig foarte mare."
      : "Reward Risk Imbalance is when a trader loses more in a loss trade than gains in a profit trade. A trader needs a Reward Risk Ratio (RRR) of more than 50% to be considered profitable in such case.\n\nThe analysis refers to the actual, executed RRR. The initial RRR based on originally set TP and SLs in a trade may differ if manually closing trades, or if stop and profit levels are adjusted. Note: some profitable trading strategies are designed with low RRR but high win rates."
  }
};

  
  const openExplanation = (riskKey) => {
    setCurrentExplanation(riskExplanations[riskKey]);
    setShowExplanationModal(true);
  };
  
  const closeExplanation = () => {
    setShowExplanationModal(false);
    setCurrentExplanation(null);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            🏥 Pro<span className="text-amber-400">FX</span> Doctor
          </h2>
          <p className="text-gray-400">
            {language === "ro" 
              ? "Analiză completă a performanței tale în trading"
              : "Comprehensive analysis of your trading performance"}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Diagnostic Overview */}
      <div className="mb-6 md:mb-8">
        <h3 className="text-base md:text-xl font-semibold text-white mb-4 md:mb-6 flex items-center gap-2">
          📊 {language === "ro" ? "Rezumat Diagnostic" : "Diagnostic Overview"}
        </h3>
        <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">
          {language === "ro" 
            ? "Care sunt zonele de îmbunătățire ale comportamentului tău de trading?"
            : "Which areas of your trading could be improved?"}
        </p>

        {/* Gauge Meters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <GaugeMeter 
            value={analysisData.gauges.behavioural} 
            label={language === "ro" ? "Erori Comportamentale" : "Behavioural Errors"} 
          />
          <GaugeMeter 
            value={analysisData.gauges.emotional} 
            label={language === "ro" ? "Erori Emoționale" : "Emotional Errors"} 
          />
          <GaugeMeter 
            value={analysisData.gauges.overstimulation} 
            label={language === "ro" ? "Suprastimulare" : "Overstimulation"} 
          />
          <GaugeMeter 
            value={analysisData.gauges.stopAccuracy} 
            label={language === "ro" ? "Acuratețe Stop" : "Stop Accuracy"} 
          />
          <GaugeMeter 
            value={analysisData.gauges.strategic} 
            label={language === "ro" ? "Erori Strategice" : "Strategic Errors"} 
          />
          <GaugeMeter 
            value={analysisData.gauges.tradeExecution} 
            label={language === "ro" ? "Execuție Tranzacții" : "Trade Execution"} 
          />
          <GaugeMeter 
            value={analysisData.gauges.tradeTiming} 
            label={language === "ro" ? "Timing Tranzacții" : "Trade Timing"} 
          />
          <GaugeMeter 
            value={analysisData.gauges.riskManagement} 
            label={language === "ro" ? "Management Risc" : "Risk Management"} 
          />
        </div>
      </div>

      {/* Full Report Section */}
      <div className="bg-gray-900/50 rounded-lg md:rounded-xl border border-gray-700/50 p-4 md:p-6 mb-6 md:mb-8">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('fullReport')}
        >
          <h3 className="text-base md:text-xl font-semibold text-blue-400 flex items-center gap-2">
            📋 {language === "ro" ? "Raport Complet" : "Full Report"}
          </h3>
          <svg 
            className={`w-6 h-6 text-gray-400 transition-transform ${expandedSection === 'fullReport' ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {expandedSection === 'fullReport' && (
          <div className="mt-6 animate-fadeIn">
            <p className="text-gray-400 mb-6">
              {language === "ro"
                ? "Obține o înțelegere holistică a comportamentelor tale de trading"
                : "Gain a holistic understanding of your trading behaviours"}
            </p>

            {/* Strengths */}
            <div className="mb-6 md:mb-8">
              <h4 className="text-base md:text-lg font-semibold text-emerald-400 mb-3 md:mb-4">
                💪 {language === "ro" ? "Puncte Forte" : "Strengths"}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead className="text-[10px] md:text-xs text-gray-400 border-b border-gray-700/50">
                    <tr>
                      <th className="text-left p-2 md:p-3 w-1/3">{language === "ro" ? "Puncte Forte" : "Strength"}</th>
                      <th className="text-left p-2 md:p-3 w-1/3">{language === "ro" ? "Impact" : "Impact"}</th>
                      <th className="text-right p-2 md:p-3 w-1/3">{language === "ro" ? "Efect Performanță" : "Performance Effect"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisData.strengths.map((strength, idx) => (
                      <tr key={idx} className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors">
                        <td className="p-2 md:p-3 text-gray-200 text-xs md:text-sm w-1/3">{strength.name}</td>
                        <td className="p-2 md:p-3 w-1/3">
                          <ProgressBar value={strength.impact} color="emerald" />
                        </td>
                        <td className="p-2 md:p-3 text-emerald-400 font-semibold text-right text-xs md:text-sm w-1/3">{strength.effect} USD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weaknesses */}
            <div>
              <h4 className="text-base md:text-lg font-semibold text-red-400 mb-3 md:mb-4">
                ⚠️ {language === "ro" ? "Puncte Slabe" : "Weaknesses"}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead className="text-[10px] md:text-xs text-gray-400 border-b border-gray-700/50">
                    <tr>
                      <th className="text-left p-2 md:p-3 w-1/3">{language === "ro" ? "Puncte Slabe" : "Weakness"}</th>
                      <th className="text-left p-2 md:p-3 w-1/3">{language === "ro" ? "Impact" : "Impact"}</th>
                      <th className="text-right p-2 md:p-3 w-1/3">{language === "ro" ? "Efect Performanță" : "Performance Effect"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisData.weaknesses.map((weakness, idx) => (
                      <tr key={idx} className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors">
                        <td className="p-2 md:p-3 text-gray-200 text-xs md:text-sm w-1/3">{weakness.name}</td>
                        <td className="p-2 md:p-3 w-1/3">
                          <ProgressBar value={weakness.impact} color="red" />
                        </td>
                        <td className="p-2 md:p-3 text-red-400 font-semibold text-right text-xs md:text-sm w-1/3">{weakness.effect} USD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Risks and Further Observations */}
      <div className="bg-gray-900/50 rounded-lg md:rounded-xl border border-gray-700/50 p-4 md:p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('risks')}
        >
          <h3 className="text-base md:text-xl font-semibold text-yellow-400 flex items-center gap-2">
            🛡️ {language === "ro" ? "Riscuri și Observații" : "Risks and Further Observations"}
          </h3>
          <svg 
            className={`w-6 h-6 text-gray-400 transition-transform ${expandedSection === 'risks' ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {expandedSection === 'risks' && (
          <div className="mt-4 md:mt-6 animate-fadeIn">
            <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">
              {language === "ro"
                ? "Detectează mecanisme potențiale de protecție a managementului riscului"
                : "Detect potential risk management protection mechanisms"}
            </p>

            <div className="space-y-3 md:space-y-4">
              {analysisData.risks.map((risk, idx) => (
                <div 
                  key={idx}
                  className={`p-3 md:p-4 rounded-lg border ${
                    risk.status === 'good' 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="flex-shrink-0">
                      {risk.status === 'good' ? (
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className={`font-semibold text-sm md:text-base mb-1 ${
                        risk.status === 'good' ? 'text-emerald-400' : 'text-yellow-400'
                      }`}>
                        {risk.area}
                      </h5>
                      <p className="text-gray-300 text-xs md:text-sm">{risk.message}</p>
                    </div>
                    <button 
                      onClick={() => openExplanation(risk.key)}
                      className="flex-shrink-0 text-blue-400 hover:text-blue-300 transition-colors"
                      title={language === "ro" ? "Vezi explicație" : "View explanation"}
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Recommendations */}
      <div className="mt-6 md:mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg md:rounded-xl p-4 md:p-6">
        <h3 className="text-base md:text-xl font-semibold text-blue-400 mb-3 md:mb-4 flex items-center gap-2">
          💡 {language === "ro" ? "Recomandări de Acțiune" : "Action Recommendations"}
        </h3>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>{language === "ro" 
              ? "Concentrează-te pe reducerea ieșirilor nerăbdătoare din tranzacții pentru a-ți îmbunătăți profitabilitatea"
              : "Focus on reducing impatient exits to improve profitability"}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>{language === "ro"
              ? "Implementează reguli stricte pentru a preveni overtrading-ul în zilele proaste"
              : "Implement strict rules to prevent overtrading on bad days"}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>{language === "ro"
              ? "Continuă să folosești strategiile care funcționează în zilele tale de performanță maximă"
              : "Continue using strategies that work on your high-performance days"}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>{language === "ro"
              ? "Asigură-te că toate tranzacțiile au un Stop Loss bine definit"
              : "Ensure all trades have a well-defined Stop Loss"}</span>
          </li>
        </ul>
      </div>

      {/* Explanation Modal */}
      {showExplanationModal && currentExplanation && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn"
          onClick={closeExplanation}
        >
          <div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-blue-500/30 rounded-xl md:rounded-2xl p-4 md:p-8 max-w-2xl w-full shadow-2xl shadow-blue-500/20 animate-scaleIn max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500/40">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {language === "ro" ? "Explicație" : "Explanation"}
                  </h3>
                  <p className="text-blue-400 text-xs md:text-sm mt-1">{currentExplanation.title}</p>
                </div>
              </div>
              <button
                onClick={closeExplanation}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg md:rounded-xl p-4 md:p-6">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {currentExplanation.description}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeExplanation}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
              >
                {language === "ro" ? "Închide" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProFXDoctor;
