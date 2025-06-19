import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const correctPassword = "simulare";
const PASSWORD_KEY = "simulare_access_password";

export default function Simulare() {
  // 🔒 Parolă + acces
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");

  // ✅ Toate hook-urile sus, indiferent dacă accesul e permis sau nu
  const [price, setPrice] = useState(78);
  const [affiliateCounts, setAffiliateCounts] = useState({
    L1: 100,
    L2: 100,
    L3: 100,
    L4: 200,
    L5: 400,
  });

  useEffect(() => {
    const savedPassword = sessionStorage.getItem(PASSWORD_KEY);
    if (savedPassword === correctPassword) {
      setAccessGranted(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      sessionStorage.setItem(PASSWORD_KEY, correctPassword);
      setAccessGranted(true);
      setError("");
    } else {
      setError("Parolă greșită. Încearcă din nou.");
    }
  };

  const commissionRates = {
    L1: 26 / 78,
    L2: 15 / 78,
    L3: 8 / 78,
    L4: 4 / 78,
    L5: 3 / 78,
  };

  const commissions = Object.entries(commissionRates).map(([level, rate]) => {
    const commissionPerSale = parseFloat((rate * price).toFixed(2));
    const total = commissionPerSale * affiliateCounts[level];
    const percentage = (rate * 100).toFixed(2);
    return {
      level,
      commissionPerSale,
      total,
      percentage,
      count: affiliateCounts[level],
    };
  });

  const totalCashflow = commissions.reduce((sum, c) => sum + c.total, 0);

  const handleAffiliateChange = (level, value) => {
    const numeric = parseInt(value);
    const corrected = value === "" ? "" : numeric < 0 ? 0 : numeric;
    setAffiliateCounts((prev) => ({
      ...prev,
      [level]: corrected,
    }));
  };

  // 🔐 Formular de parolă dacă accesul nu e permis
  if (!accessGranted) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-gray-900 p-6 rounded-xl shadow-lg text-white">
        <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">
          Acces Simulare Afiliere
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Introdu parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 text-white border-gray-700"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Accesează
          </button>
        </form>
      </div>
    );
  }

  // ✅ Componenta principală dacă accesul e permis
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6 text-white px-4">
      <Card className="bg-[#0d1117] border border-gray-700">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-yellow-400 text-center">
            Simulare Afiliere ProFX
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Preț abonament ($)
            </label>
            <Input
              type="number"
              value={price === "" ? "" : price}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") setPrice("");
                else setPrice(parseFloat(val) < 0 ? 0 : parseFloat(val));
              }}
              className="w-full bg-gray-800 text-white border-gray-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(affiliateCounts).map((level) => (
              <div key={level}>
                <label className="block text-sm font-medium mb-1 text-white">
                  Afiliați{" "}
                  <span>{level === "L1" ? "direcți" : "indirecți"}</span> {level}:
                </label>
                <Input
                  type="number"
                  value={affiliateCounts[level] === "" ? "" : affiliateCounts[level]}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleAffiliateChange(
                      level,
                      val === "" ? "" : parseInt(val) < 0 ? 0 : parseInt(val)
                    );
                  }}
                  className="w-full bg-gray-800 text-white border-gray-600"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-2 flex flex-col items-center">
            <div
              className="text-center font-semibold text-white bg-gray-800 transition duration-300 hover:bg-yellow-700 hover:scale-[1.015] hover:shadow-md"
              style={{
                width: `47%`,
                marginLeft: `10px`,
                marginRight: `10px`,
                paddingTop: `25px`,
                paddingBottom: `10px`,
                clipPath: "polygon(50% 0%, 50% 0%, 100% 100%, 0% 100%)",
              }}
            >
              <div className="flex flex-col sm:inline text-center">
                <span>
                  <span className="text-white-400">Pro </span>
                  <span className="text-yellow-300">FX</span>
                </span>
              </div>
            </div>

            {commissions.map(({ level, total, percentage }, index) => {
              const padding = 12;
              return (
                <div
                  key={level}
                  className="text-center font-semibold text-white bg-gray-800 transition duration-300 hover:bg-yellow-700 hover:scale-[1.015] hover:shadow-md"
                  style={{
                    width: `${60 + index * 10}%`,
                    marginLeft: `${index * 5}px`,
                    marginRight: `${index * 5}px`,
                    paddingTop: `${padding}px`,
                    paddingBottom: `${padding}px`,
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  <div className="flex flex-col sm:inline text-center">
                    <span>
                      <span className="text-yellow-300">{level}</span>:{" "}
                      <span className="text-green-400">${Math.round(total)} </span>
                    </span>
                    <span className="text-blue-300 font-semibold">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center text-lg font-bold">
            <span className="text-white">Total cash flow:</span>{" "}
            <span className="text-blue-400 font-bold text-xl">
              ${Math.round(totalCashflow)}
            </span>
          </div>

          <div className="pt-10">
            <h3 className="text-white text-lg font-semibold mb-2">
              Exemplu pentru un singur afiliat:
            </h3>
            <table className="w-full text-sm text-white border border-gray-700">
              <thead className="bg-gray-900 text-yellow-400">
                <tr>
                  <th className="p-2 border border-gray-600">Afilere</th>
                  <th className="p-2 border border-gray-600">$</th>
                  <th className="p-2 border border-gray-600">%</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center border-t border-gray-700">
                  <td className="p-2 border border-gray-700 font-semibold">Preț</td>
                  <td className="p-2 border border-gray-700">${price}</td>
                  <td className="p-2 border border-gray-700">100%</td>
                </tr>
                {Object.entries({
                  ProFX: 22,
                  L1: 26,
                  L2: 15,
                  L3: 8,
                  L4: 4,
                  L5: 3,
                }).map(([label, value]) => {
                  const percentage = (value / 78) * 100;
                  const amount = (value / 78) * price;
                  return (
                    <tr key={label} className="text-center border-t border-gray-700">
                      <td className="p-2 border border-gray-700">{label}</td>
                      <td className="p-2 border border-gray-700">${amount.toFixed(1)}</td>
                      <td className="p-2 border border-gray-700">{percentage.toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
