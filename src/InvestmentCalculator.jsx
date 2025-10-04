import { useState } from "react";

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [rate, setRate] = useState("");
  const [result, setResult] = useState(null);

  const calculateGrowth = () => {
    const principal = parseFloat(amount);
    const period = parseInt(months, 10);
    const growthRate = parseFloat(rate) / 100;

    if (principal > 0 && period >= 0 && growthRate >= 0) {
      const growthFactor = 1 + growthRate;
      const total = principal * Math.pow(growthFactor, period);
      setResult(total.toFixed(2));
    }
  };

  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 max-w-md mx-auto hover:border-yellow-400/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/10 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <h2 className="text-xl font-semibold mb-4 text-center text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">📊 Simulare Creștere Lunară</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-300 font-medium">Suma inițială ($):</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 hover:bg-gray-700/50 transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-gray-300 font-medium">Număr de luni:</label>
            <input
              type="number"
              min="0"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="w-full p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 hover:bg-gray-700/50 transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-gray-300 font-medium">Procent de creștere lunară (%):</label>
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
          <span className="group-hover:text-yellow-400 transition-colors duration-300">Calculează</span>
        </button>
        
        {result && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-xl">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Rezultat:</h3>
            <p className="text-gray-300 text-sm mb-2">
              Valoarea contului după <strong className="text-yellow-400">{months}</strong> luni cu o creștere lunară de <strong className="text-yellow-400">{rate}%</strong>:
            </p>
            <p className="text-2xl font-bold text-green-400 text-center">{result}$</p>
          </div>
        )}
      </div>
    </div>
  );
}
