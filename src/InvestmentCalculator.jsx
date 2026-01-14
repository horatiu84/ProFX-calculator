import { useState } from "react";
import { useLanguage } from "./contexts/LanguageContext";

export default function InvestmentCalculator() {
  const { language, translations } = useLanguage();
  const t = translations.investmentCalculator;

  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [rate, setRate] = useState("");
  const [result, setResult] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [showMonthly, setShowMonthly] = useState(false);

  // Formatare număr în stil românesc: 1.020.674,70
  const formatRomanianNumber = (num) => {
    const numStr = parseFloat(num).toFixed(2);
    const [integerPart, decimalPart] = numStr.split('.');
    
    // Adaugă punct ca separator de mii
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Înlocuiește punctul zecimal cu virgulă
    return `${formattedInteger},${decimalPart}`;
  };

  const calculateGrowth = () => {
    const principal = parseFloat(amount);
    const period = parseInt(months, 10);
    const growthRate = parseFloat(rate) / 100;

    if (principal > 0 && period >= 0 && growthRate >= 0) {
      const growthFactor = 1 + growthRate;
      const total = principal * Math.pow(growthFactor, period);
      setResult(total.toFixed(2));

      // Calculate monthly breakdown
      const monthly = [];
      for (let i = 1; i <= period; i++) {
        const monthValue = principal * Math.pow(growthFactor, i);
        monthly.push({
          month: i,
          value: monthValue.toFixed(2)
        });
      }
      setMonthlyData(monthly);
      setShowMonthly(false); // Reset to collapsed when new calculation
    }
  };

  return (
    <div key={language} className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 max-w-md mx-auto hover:border-yellow-400/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/10 overflow-hidden animate-language-change mb-[15px]">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <h2 className="text-xl font-semibold mb-4 text-center text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">{t.title}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-300 font-medium">{t.initialAmount}</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 hover:bg-gray-700/50 transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-gray-300 font-medium">{t.numberOfMonths}</label>
            <input
              type="number"
              min="0"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 hover:bg-gray-700/50 transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-gray-300 font-medium">{t.monthlyGrowthRate}</label>
            <input
              type="number"
              min="1"
              max="100"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 hover:bg-gray-700/50 transition-all duration-300"
            />
          </div>
        </div>
        
        <button 
          onClick={calculateGrowth}
          className="w-full mt-6 py-3 px-4 bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 hover:bg-gray-600/80 hover:border-yellow-400/50 text-white rounded-xl shadow-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 group"
        >
          <span className="group-hover:text-yellow-400 transition-colors duration-300">🧮</span>
          <span className="group-hover:text-yellow-400 transition-colors duration-300">{t.calculate}</span>
        </button>
        
        {result && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-xl">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">{t.result}</h3>
            <p className="text-gray-300 text-sm mb-2">
              {t.resultDescription} <strong className="text-yellow-400">{months}</strong> {t.months} {t.withMonthlyGrowth} <strong className="text-yellow-400">{rate}%</strong>:
            </p>
            <p className="text-2xl font-bold text-green-400 text-center">{formatRomanianNumber(result)} $</p>
            
            {monthlyData.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowMonthly(!showMonthly)}
                  className="w-full py-2 px-4 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/30 hover:border-yellow-400/30 text-gray-300 hover:text-yellow-400 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>{showMonthly ? "▼" : "▶"}</span>
                  <span>{showMonthly ? language === 'ro' ? 'Ascunde detalii lunare' : 'Hide monthly details' : language === 'ro' ? 'Arată detalii lunare' : 'Show monthly details'}</span>
                </button>
                
                {showMonthly && (
                  <div className="mt-3 max-h-64 overflow-y-auto space-y-2">
                    {monthlyData.map((data) => (
                      <div key={data.month} className="flex justify-between items-center p-2 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-colors duration-200">
                        <span className="text-gray-400 text-sm">
                          {language === 'ro' ? 'Luna' : 'Month'} {data.month}
                        </span>
                        <span className="text-green-400 font-semibold">{formatRomanianNumber(data.value)} $</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
