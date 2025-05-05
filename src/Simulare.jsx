import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Simulare() {
  const [price, setPrice] = useState(78);
  const [affiliateCounts, setAffiliateCounts] = useState({
    L1: 100,
    L2: 100,
    L3: 100,
    L4: 200,
    L5: 400,
  });

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
                  <span>{level === "L1" ? "direcți" : "indirecți"}</span>{" "}
                  {level}:
                </label>
                <Input
                  type="number"
                  value={
                    affiliateCounts[level] === "" ? "" : affiliateCounts[level]
                  }
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
                      <span className="text-green-400">
                        ${Math.round(total)} {" "}
                      </span>
                    </span>
                    <span className="text-blue-300 font-semibold">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <div className=" text-center text-lg font-bold">
              <span className="text-white">Total cash flow:</span>{" "}
              <span className="text-blue-400 font-bold text-xl">
                ${Math.round(totalCashflow)}
              </span>
            </div>
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
                  <td className="p-2 border border-gray-700 font-semibold">
                    Preț
                  </td>
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
                    <tr
                      key={label}
                      className="text-center border-t border-gray-700"
                    >
                      <td className="p-2 border border-gray-700">{label}</td>
                      <td className="p-2 border border-gray-700">
                        ${amount.toFixed(1)}
                      </td>
                      <td className="p-2 border border-gray-700">
                        {percentage.toFixed(2)}%
                      </td>
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
