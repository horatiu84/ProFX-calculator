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
    <div className="calculator-container">
      <h2>Simulare Creștere Lunară</h2>
      <div className="input-group">
        <label>
          Suma inițială ($):
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Număr de luni:
          <input
            type="number"
            min="0"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Procent de creștere lunară (%):
          <input
            type="number"
            min="1"
            max="100"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </label>
      </div>
      <button className="calc-btn" onClick={calculateGrowth}>
        Calculează
      </button>
      {result && (
        <div className="result">
          <h3>Rezultat:</h3>
          <p>
            Valoarea contului după <strong>{months}</strong> luni cu o creștere lunară de <strong>{rate}%</strong>: <br />
            <span className="total">{result}$</span>
          </p>
        </div>
      )}
      <style jsx>{`
        .calculator-container {
          background: #181e2a;
          color: #fff;
          border-radius: 12px;
          padding: 32px 24px;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 400px;
          margin: 24px auto 0 auto;
        }
        .calculator-container label {
          color: #fff;
          font-weight: 500;
          margin-bottom: 8px;
          display: block;
        }
        .calculator-container input {
          background: #232a3b;
          color: #fff;
          border: 1.5px solid #2b3244;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 1rem;
          margin-bottom: 18px;
          width: 100%;
          box-sizing: border-box;
        }
        .calculator-container h2 {
          color: #fff;
          margin-bottom: 20px;
        }
        .calculator-container .result {
          color: #ffd700;
          font-weight: bold;
          margin-top: 16px;
        }
        .calc-btn {
          background: #ffd700;
          color: #181e2a;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 1rem;
          padding: 12px 24px;
          width: 100%;
          margin: 10px 0 20px 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .calc-btn:hover {
          background: #ffea80;
          transform: translateY(-1px);
        }
        .calc-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
