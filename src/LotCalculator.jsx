import React, { useState, useEffect } from "react";
import ProFXSchedule from "./ProFXSchedule";

const riskLabels = ["0.5%", "1%", "1.5%", "2%", "2.5%", "3%", "3.5%"];
const riskValues = [0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035];

export default function LotCalculator() {
  const [pipLotInput, setPipLotInput] = useState(0.01);

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
        <div className="flex items-center">
          <span className="text-4xl font-light text-white">Pro</span>
          <span className="ml-2 text-4xl font-bold px-2 bg-yellow-500 text-black rounded animate-pulse">
            FX
          </span>
        </div>
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
            activeTab === "agenda"
              ? "bg-yellow-500 text-black"
              : "bg-gray-800 text-white"
          }`}
          onClick={() => setActiveTab("agenda")}
        >
          🗓️ Agenda ProFX
        </button>
      </div>

      {activeTab === "agenda" && <ProFXSchedule />}

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
        </div>
      )}
      {activeTab === "educatie" && (
        <div>
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">
              ℹ️ Ce sunt pipsii pe XAUUSD?
            </h2>
            <p className="mb-2">
              Pipul este o unitate mică folosită pentru a măsura mișcarea
              prețului.
            </p>
            <p className="mb-2">
              Pe XAUUSD (aur), un pip reprezintă o schimbare de 0.1 în prețul
              aurului. De exemplu:
            </p>
            <p className="mb-4">
              Dacă prețul aurului crește de la 1980.00 la 1980.10, atunci s-a
              mișcat 1 pip.
            </p>

            <h2 className="text-xl font-bold mb-2">💡 Valoarea unui pip</h2>
            <p>
              Valoarea pipului variază în funcție de dimensiunea lotului
              tranzacționat.
            </p>
            <p>
              Un lot standard (1 lot) = 100 uncii de aur, iar valoarea unui pip
              pentru 1 lot este de 10 USD.
            </p>

            <h2 className="text-xl font-bold mt-6 mb-2">
              📊 Exemple de dimensiuni de loturi
            </h2>
            <table className="w-full text-sm text-left text-white border border-gray-700">
              <thead className="bg-gray-800 text-yellow-300">
                <tr>
                  <th className="p-2 border border-gray-700">
                    Loturi (mărime)
                  </th>
                  <th className="p-2 border border-gray-700">
                    Valoare unui pip (USD)
                  </th>
                  <th className="p-2 border border-gray-700">
                    Exemplu: 10 pipsi câștigați/pierduți
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["0.01", "0.1 USD", "10 pipsi = 1 USD"],
                  ["0.05", "0.5 USD", "10 pipsi = 5 USD"],
                  ["0.10", "1 USD", "10 pipsi = 10 USD"],
                  ["0.20", "2 USD", "10 pipsi = 20 USD"],
                  ["0.50", "5 USD", "10 pipsi = 50 USD"],
                  ["1", "10 USD", "10 pipsi = 100 USD"],
                  ["1.25", "12.5 USD", "10 pipsi = 125 USD"],
                  ["1.50", "15 USD", "10 pipsi = 150 USD"],
                  ["1.75", "17.5 USD", "10 pipsi = 175 USD"],
                  ["2", "20 USD", "10 pipsi = 200 USD"],
                ].map(([lot, value, example], idx) => (
                  <tr key={idx} className="border-t border-gray-700">
                    <td className="p-2 border border-gray-700">{lot}</td>
                    <td className="p-2 border border-gray-700">{value}</td>
                    <td className="p-2 border border-gray-700">{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-xl font-bold mt-10 mb-4">
              📌 Calculează valoarea pip-ului
            </h2>
            <div className="mb-4">
              <label className="block mb-2">
                Introdu valoarea lotului (ex: 0.05):
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="w-full p-2 bg-gray-800 text-white rounded"
                value={pipLotInput}
                onChange={(e) => setPipLotInput(e.target.value)}
              />
            </div>
            <p className="text-yellow-400 text-lg">
              Valoare pip estimată:{" "}
              <strong>{(pipLotInput * 10).toFixed(2)}</strong> USD
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">
              🎥 Ghid Video pentru folosirea aplicației MT5
            </h2>
            <div className="text-center">
              <a
                href="https://www.youtube.com/watch?v=WwX5oC1dKIw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-yellow-500 text-black rounded shadow hover:bg-yellow-400"
              >
                🔗 Deschide videoclipul în YouTube
              </a>
            </div>
          </div>
          <div className="text-center mt-6">
            <a
              href="/Ghid folosire mt5.pdf"
              download
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
            >
              📥 Descarcă ghidul de folosire MT5 mobile
            </a>
          </div>
          <div className="text-center mt-6">
            <a
              href="/Ghid conectare MT5.pdf"
              download
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
            >
              📥 Descarcă ghidul de conectare MT5 mobile
            </a>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 mt-10 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">
              🎬 Videoclip: Cum funcționează trailing stop
            </h2>
            <video controls className="w-full rounded-lg">
              <source src="/trailing stop.mp4" type="video/mp4" />
              Browserul tău nu suportă redarea video.
            </video>
          </div>
        </div>
      )}

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
            *Dacă devine roșu, e mai mult de 1% pierderea
          </p>
          
            <p className="italic text-sm text-gray-400 mt-2">Mărimea contului este valoarea sumei început zi : <span className="font-bold">{startOfDay}</span> $ </p>
          
        </div>
      )}

      {activeTab === "lot" && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center ">
            Calculator Lot
          </h2>
          <div className="text-center mb-4">
            <p className="italic">Mărimea contului este valoarea sumei început zi : <span className="font-bold">{startOfDay}</span> $ </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block mb-2">Selectează Pips SL:</label>
              <select
                className="w-full p-2 bg-gray-800 text-white rounded"
                value={selectedPips}
                onChange={(e) => setSelectedPips(Number(e.target.value))}
              >
                {[10, 15, 20, 25, 30, 35, 40, 50].map((pips) => (
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
