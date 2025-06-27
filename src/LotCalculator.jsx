import React, { useState, useEffect } from "react";
import ProFXSchedule from "./ProFXSchedule";
import Educatie from "./educatie";
import Simulare from "./Simulare";
import Raport from "./Raport.jsx";
import Training from "./Training.jsx";
import logo from '../public/logo.jpg';
import InvestmentCalculator from "./InvestmentCalculator.jsx";

const riskLabels = ["0.5%", "1%", "1.5%", "2%", "2.5%", "3%", "3.5%"];
const riskValues = [0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035];

export default function LotCalculator() {
  const [startOfTrade, setStartOfTrade] = useState(() => {
    const saved = localStorage.getItem("startOfTrade");
    return saved !== null ? Number(saved) : 0;
  });
  const [endOfTrade, setEndOfTrade] = useState(() => {
    const saved = localStorage.getItem("endOfTrade");
    return saved !== null ? Number(saved) : 0;
  });
  const tradeChange =
    startOfTrade > 0
      ? (((endOfTrade - startOfTrade) / startOfTrade) * 100).toFixed(2)
      : "0.00";

  const [selectedPips, setSelectedPips] = useState(10);
  const [selectedRiskIndex, setSelectedRiskIndex] = useState(0);
  const [startOfDay, setStartOfDay] = useState(() => {
    const saved = localStorage.getItem("startOfDay");
    return saved !== null ? Number(saved) : 0;
  });
  const [endOfDay, setEndOfDay] = useState(() => {
    const saved = localStorage.getItem("endOfDay");
    return saved !== null ? Number(saved) : 0;
  });
  const [startOfWeek, setStartOfWeek] = useState(() => {
    const saved = localStorage.getItem("startOfWeek");
    return saved !== null ? Number(saved) : 0;
  });
  const [endOfWeek, setEndOfWeek] = useState(() => {
    const saved = localStorage.getItem("endOfWeek");
    return saved !== null ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("startOfDay", startOfDay);
    localStorage.setItem("endOfDay", endOfDay);
  }, [startOfDay, endOfDay]);

  useEffect(() => {
    localStorage.setItem("startOfWeek", startOfWeek);
    localStorage.setItem("endOfWeek", endOfWeek);
  }, [startOfWeek, endOfWeek]);

  const riskPercent = riskValues[selectedRiskIndex];
  const points = selectedPips * 10;
  const lotSize = (startOfDay * riskPercent) / points;
  const roundedLot = Math.ceil(lotSize * 1000) / 1000;

  const dayChange =
    startOfDay > 0
      ? (((endOfDay - startOfDay) / startOfDay) * 100).toFixed(2)
      : "0.00";
  const weekChange =
    startOfWeek > 0
      ? (((endOfWeek - startOfWeek) / startOfWeek) * 100).toFixed(2)
      : "0.00";

  const dynamicLosses = riskValues.map((risk) => ({
    label: `${(risk * 100).toFixed(1)}%`,
    value: (startOfDay * risk).toFixed(2),
  }));

  const resetLocal = () => {
    localStorage.removeItem("startOfDay");
    localStorage.removeItem("endOfDay");
    localStorage.removeItem("startOfWeek");
    localStorage.removeItem("endOfWeek");
    setStartOfDay(0);
    setEndOfDay(0);
    setStartOfWeek(0);
    setEndOfWeek(0);
    localStorage.removeItem("startOfTrade");
    localStorage.removeItem("endOfTrade");
    setStartOfTrade(0);
    setEndOfTrade(0);
  };

  const [slPips, setSlPips] = useState(100);
  const [customLotRaw, setCustomLotRaw] = useState("0.09");
  const [customLot, setCustomLot] = useState(0);

  useEffect(() => {
    const parsed = parseFloat(customLotRaw);
    setCustomLot(!isNaN(parsed) ? parsed : 0);
  }, [customLotRaw]);
  const calculatedLoss = (customLot * slPips * 10).toFixed(2);
  const isHighRisk = startOfDay > 0 && calculatedLoss / startOfDay > 0.01;

  const [activeTab, setActiveTab] = useState("evolutie");

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex flex-col items-center mb-6">
         <img src={logo} alt="Logo ProFX" style={{ width: '350px'}}  />
        <span className="text-xl text-gray-400 mt-2 text-center block">
          Învață să tranzacționezi gratuit, de la zero
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "evolutie"
              ? "bg-yellow-500 text-black"
              : "bg-gray-800 text-white"
          }`}
          onClick={() => setActiveTab("evolutie")}
        >
          📈 Evoluție
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "lot"
              ? "bg-yellow-500 text-black"
              : "bg-gray-800 text-white"
          }`}
          onClick={() => setActiveTab("lot")}
        >
          📉 Calculator Lot
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "pierdere"
              ? "bg-yellow-500 text-black"
              : "bg-gray-800 text-white"
          }`}
          onClick={() => setActiveTab("pierdere")}
        >
          ⚙️ Pierdere manuală
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "educatie"
              ? "bg-yellow-500 text-black"
              : "bg-gray-800 text-white"
          }`}
          onClick={() => setActiveTab("educatie")}
        >
          ℹ️ Educație
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "training"
              ? "bg-yellow-500 text-black"
              : "bg-gray-800 text-white"
          }`}
          onClick={() => setActiveTab("training")}
        >
          🧑‍🏫 Training
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "agenda"
              ? "bg-yellow-500 text-black"
              : "bg-gray-800 text-white"
          }`}
          onClick={() => setActiveTab("agenda")}
        >
          🗓️ Agenda ProFX
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "simulare"
              ? "bg-yellow-500 text-black"
              : "bg-gray-800 text-white"
          }`}
          onClick={() => setActiveTab("simulare")}
        >
          💵 Afiliere
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "raport"
              ? "bg-yellow-500 text-black"
              : "bg-gray-800 text-white"
          }`}
          onClick={() => setActiveTab("raport")}
        >
          📝 Jurnal
        </button>
      </div>

      {activeTab === "agenda" && <ProFXSchedule />}
      {activeTab === "training" && <Training />}
      {activeTab === "simulare" && <Simulare />}
      {activeTab === "raport" && <Raport />}

      {activeTab === "evolutie" && (
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <label className="block mb-2">Suma început zi:</label>
              <input
                type="number"
                className="w-full p-2 bg-gray-800 text-white rounded mb-4"
                value={startOfDay}
                onChange={(e) =>
                  setStartOfDay(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                onFocus={(e) => {
                  if (e.target.value === "0") e.target.select();
                }}
              />
              <label className="block mb-2">Suma final zi:</label>
              <input
                type="number"
                className="w-full p-2 bg-gray-800 text-white rounded mb-4"
                value={endOfDay}
                onChange={(e) =>
                  setEndOfDay(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                onFocus={(e) => {
                  if (e.target.value === "0") e.target.select();
                }}
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
                onChange={(e) =>
                  setStartOfWeek(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                onFocus={(e) => {
                  if (e.target.value === "0") e.target.select();
                }}
              />
              <label className="block mb-2">Suma final săptămână:</label>
              <input
                type="number"
                className="w-full p-2 bg-gray-800 text-white rounded mb-4"
                value={endOfWeek}
                onChange={(e) =>
                  setEndOfWeek(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                onFocus={(e) => {
                  if (e.target.value === "0") e.target.select();
                }}
              />
              <h2 className="text-lg">Procentaj săptămână</h2>
              <p className="text-xl font-bold text-yellow-400">{weekChange}%</p>
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">
              💰 Profit per trade
            </h2>
            <label className="block mb-2">Suma început trade:</label>
            <input
              type="number"
              className="w-full p-2 bg-gray-800 text-white rounded mb-4"
              value={startOfTrade}
              onChange={(e) =>
                setStartOfTrade(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              onFocus={(e) => {
                if (e.target.value === "0") e.target.select();
              }}
            />
            <label className="block mb-2">Suma după trade:</label>
            <input
              type="number"
              className="w-full p-2 bg-gray-800 text-white rounded mb-4"
              value={endOfTrade}
              onChange={(e) =>
                setEndOfTrade(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              onFocus={(e) => {
                if (e.target.value === "0") e.target.select();
              }}
            />
            <h2 className="text-lg">Procentaj trade</h2>
            <p className="text-xl font-bold text-yellow-400">{tradeChange}%</p>
          </div>
          <div>
            <InvestmentCalculator />
          </div>
        </div>
      )}
      {activeTab === "educatie" && <Educatie />}

      {activeTab === "pierdere" && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">
            ⚙️ Pierdere estimată manual
          </h2>
          <label className="block mb-2">La câți pipsi este SL?</label>
          <input
            type="number"
            className="w-full p-2 bg-yellow-200 text-black font-bold text-center rounded mb-4"
            value={slPips === 0 ? "" : slPips}
            onChange={(e) =>
              setSlPips(e.target.value === "" ? 0 : Number(e.target.value))
            }
          />
          <label className="block mb-2">Cu ce lot intru?</label>
          <input
            type="text"
            inputMode="decimal"
            className="w-full p-2 bg-yellow-200 text-black font-bold text-center rounded mb-4"
            value={customLotRaw}
            onChange={(e) => setCustomLotRaw(e.target.value)}
            onBlur={() => {
              if (customLotRaw === "") setCustomLotRaw("0");
            }}
          />
          <label className="block mb-2">Cât e pierderea?</label>
          <div
            className={`w-full p-2 text-center font-bold text-xl rounded transition-all duration-300 ${
              isHighRisk ? "bg-red-500 animate-pulse" : "bg-pink-200 text-black"
            }`}
          >
            ${calculatedLoss}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            *Dacă devine roșu, e mai mult de 1% pierderea, <br></br> pierderea
            actuala este{" "}
            <strong>
              {" "}
              {((calculatedLoss / startOfDay) * 100).toFixed(2) > 2000
                ? 0
                : ((calculatedLoss / startOfDay) * 100).toFixed(2)}
              %
            </strong>
          </p>

          <p className="italic text-sm text-gray-400 mt-2">
            Mărimea contului este valoarea sumei început zi :{" "}
            <span className="font-bold">{startOfDay}</span> ${" "}
          </p>
        </div>
      )}

      {activeTab === "lot" && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center ">
            Calculator Lot
          </h2>
          <div className="text-center mb-4">
            <p className="italic">
              Mărimea contului este valoarea sumei început zi :{" "}
              <span className="font-bold">{startOfDay}</span> ${" "}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block mb-2">Selectează Pips SL:</label>
              <select
                className="w-full p-2 bg-gray-800 text-white rounded"
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

          <div className="bg-gray-800 p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
              📉 Posibile pierderi (în funcție de suma început zi)
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {dynamicLosses.map((item, idx) => (
                <li key={idx}>
                  <span className="text-yellow-300">Risc {item.label}:</span>{" "}
                  {item.value} USD
                </li>
              ))}
            </ul>
            <button
              className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow"
              onClick={resetLocal}
            >
              Reset date salvate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
