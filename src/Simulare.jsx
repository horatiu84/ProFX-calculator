import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Simulare() {
  const [price, setPrice] = useState(20);
  const [activeClients, setActiveClients] = useState(3);

  // Noul model de afiliere
  const affiliateLevels = [
    { name: "STARTER", commission: 0, minClients: 3, maxClients: 3, description: "Abonamentul tău Gratuit" },
    { name: "SILVER", commission: 0.15, minClients: 4, maxClients: 19, description: "15%" },
    { name: "GOLD", commission: 0.20, minClients: 20, maxClients: 49, description: "20%" },
    { name: "PLATINUM", commission: 0.25, minClients: 50, maxClients: 99, description: "25%" },
    { name: "ELITE", commission: 0, minClients: 100, maxClients: Infinity, description: "Deal Personalizat" },
  ];

  // Determină nivelul curent bazat pe clienți activi
  const getCurrentLevel = () => {
    // Sub 3 clienți activi - niciun nivel activ
    if (activeClients < 3) {
      return null;
    }
    
    for (let i = affiliateLevels.length - 1; i >= 0; i--) {
      if (activeClients >= affiliateLevels[i].minClients) {
        return affiliateLevels[i];
      }
    }
    return null;
  };

  const currentLevel = getCurrentLevel();
  const monthlyRevenue = currentLevel ? currentLevel.commission * price * activeClients : 0;
  const yearlyRevenue = monthlyRevenue * 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto pt-10 space-y-6 text-white px-4 pb-10">
        <Card className="bg-[#1a1d29] border border-gray-700 shadow-2xl">
          <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-blue-400">
              ProFX Affiliate Program
            </h1>
            <h2 className="text-2xl font-semibold text-yellow-400">
              Transformă influența ta în venit pasiv lunar
            </h2>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto mt-4">
              Programul de afiliere ProFX este creat pentru creatori de conținut, lideri de comunități, traderi și parteneri care doresc să genereze un venit recurent, promovând unul dintre cele mai puternice ecosisteme de trading din România.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              Cum Funcționează?
            </h3>
            <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0 text-sm">
              <div className="flex-1 text-center">
                <div className="text-blue-400 font-semibold mb-1">Recomandă ProFX</div>
                <div className="text-gray-300 text-xs md:text-sm">Promovează platforma</div>
              </div>
              <div className="text-yellow-400 text-2xl transform md:rotate-0 rotate-90">→</div>
              <div className="flex-1 text-center">
                <div className="text-blue-400 font-semibold mb-1">Oamenii se înscriu</div>
                <div className="text-gray-300 text-xs md:text-sm">Clienți noi</div>
              </div>
              <div className="text-yellow-400 text-2xl transform md:rotate-0 rotate-90">→</div>
              <div className="flex-1 text-center">
                <div className="text-blue-400 font-semibold mb-1">Primești comision lunar recurent</div>
                <div className="text-gray-300 text-xs md:text-sm">Simplu. Transparent. Scalabil.</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Preț abonament lunar ($)
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

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Număr clienți activi
              </label>
              <Input
                type="number"
                value={activeClients === "" ? "" : activeClients}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") setActiveClients("");
                  else setActiveClients(parseInt(val) < 0 ? 0 : parseInt(val));
                }}
                className="w-full bg-gray-800 text-white border-gray-600"
              />
            </div>
          </div>

          {/* Piramida nivelurilor */}
          <div className="pt-6 pb-8 bg-gradient-to-b from-gray-900/50 to-transparent rounded-lg">
            <h3 className="text-xl font-bold text-center text-yellow-400 mb-8">
              Nivelurile Programului
            </h3>
            
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-8 max-w-6xl mx-auto bg-[#0a0e1a]/60 rounded-xl p-6 md:p-8 overflow-hidden">
              {/* Piramida - Layout similar cu imaginea - ascunsă pe mobile */}
              <div className="hidden md:flex relative flex-col items-center gap-3 flex-shrink-0 md:ml-16 md:mr-8" style={{ maxWidth: '320px' }}>
                {/* STARTER - Vârful (Triunghi) */}
                <div 
                  className={`relative flex items-center justify-center ${
                    currentLevel?.name === "STARTER" 
                      ? "shadow-2xl" 
                      : ""
                  }`}
                  style={{
                    width: '90px',
                    height: '90px',
                    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                    background: currentLevel?.name === "STARTER" 
                      ? 'linear-gradient(to bottom, #bfdbfe, #93c5fd)' 
                      : 'linear-gradient(to bottom, #dbeafe, #bfdbfe)',
                  }}
                >
                  <div className="text-blue-700/70 text-2xl mt-6">👤</div>
                </div>

                {/* SILVER - Trapez 1 */}
                <div 
                  className={`relative flex items-center justify-center ${
                    currentLevel?.name === "SILVER" 
                      ? "shadow-2xl" 
                      : ""
                  }`}
                  style={{
                    width: '180px',
                    height: '90px',
                    clipPath: 'polygon(22% 0%, 78% 0%, 100% 100%, 0% 100%)',
                    background: currentLevel?.name === "SILVER" 
                      ? 'linear-gradient(to bottom, #60a5fa, #3b82f6)' 
                      : 'linear-gradient(to bottom, #93c5fd, #60a5fa)',
                  }}
                >
                  <div className="text-slate-200 text-3xl drop-shadow-lg">⚪</div>
                </div>

                {/* GOLD - Trapez 2 */}
                <div 
                  className={`relative flex items-center justify-center ${
                    currentLevel?.name === "GOLD" 
                      ? "shadow-2xl" 
                      : ""
                  }`}
                  style={{
                    width: '275px',
                    height: '90px',
                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                    background: currentLevel?.name === "GOLD" 
                      ? 'linear-gradient(to bottom, #2563eb, #1d4ed8)' 
                      : 'linear-gradient(to bottom, #3b82f6, #2563eb)',
                  }}
                >
                  <div className="text-yellow-400/90 text-3xl">🟨</div>
                </div>

                {/* PLATINUM - Trapez 3 */}
                <div 
                  className={`relative flex items-center justify-center ${
                    currentLevel?.name === "PLATINUM" 
                      ? "shadow-2xl" 
                      : ""
                  }`}
                  style={{
                    width: '370px',
                    height: '90px',
                    clipPath: 'polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)',
                    background: currentLevel?.name === "PLATINUM" 
                      ? 'linear-gradient(to bottom, #1e40af, #1e3a8a)' 
                      : 'linear-gradient(to bottom, #2563eb, #1e40af)',
                  }}
                >
                  <div className="text-cyan-200/90 text-3xl">💎</div>
                </div>

                {/* ELITE - Baza (Trapez mare) */}
                <div 
                  className={`relative flex items-center justify-center ${
                    currentLevel?.name === "ELITE" 
                      ? "shadow-2xl" 
                      : ""
                  }`}
                  style={{
                    width: '450px',
                    height: '90px',
                    clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)',
                    background: currentLevel?.name === "ELITE" 
                      ? 'linear-gradient(to bottom, #1e3a8a, #1e293b)' 
                      : 'linear-gradient(to bottom, #1e40af, #1e3a8a)',
                  }}
                >
                  <div className="text-orange-400/90 text-3xl">👑</div>
                </div>
              </div>

              {/* Textele pe dreapta - aliniate cu fiecare nivel */}
              <div className="flex flex-col justify-start mt-0 flex-1 max-w-md md:ml-4 w-full">
                {affiliateLevels.map((level, index) => {
                  const isCurrentLevel = currentLevel?.name === level.name;
                  // Ajustăm padding-ul pentru a alinia cu nivelele piramidei doar pe desktop
                  const topPaddings = ['0px', '90px', '180px', '270px', '360px'];
                  
                  return (
                    <div
                      key={level.name}
                      className={`p-4 rounded-lg border-l-4 transition-all duration-300 mb-5 ${
                        isCurrentLevel
                          ? "bg-yellow-900/30 border-yellow-400 shadow-lg md:scale-105"
                          : "bg-gray-800/50 border-gray-600"
                      }`}
                      style={{
                        marginTop: index === 0 ? `${topPaddings[0]}` : '0'
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-lg font-bold ${
                          isCurrentLevel ? "text-yellow-400" : "text-blue-300"
                        }`}>
                          {level.name}
                          {level.name !== "STARTER" && level.name !== "ELITE" && ` - ${level.description}`}
                        </h4>
                        {isCurrentLevel && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
                            Curent
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">
                        {level.name === "STARTER" ? (
                          "3 clienți activi = Abonamentul tău Gratuit"
                        ) : level.name === "ELITE" ? (
                          "100+ clienți activi - Deal Personalizat"
                        ) : level.name === "SILVER" ? (
                          "3-20 clienți activi"
                        ): level.name === "GOLD" ? (
                          "20-50 clienți activi"
                        ) : (
                          `50-100 clienți activi`
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rezultate calcule */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-lg space-y-4 mt-6">
            <h3 className="text-2xl font-bold text-center text-yellow-400">
              Rezultatele Tale
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-300 text-sm mb-1">Clienți Activi</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {activeClients}
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-300 text-sm mb-1">Nivel Actual</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {currentLevel ? currentLevel.name : "Niciun nivel activ"}
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-300 text-sm mb-1">Venit Lunar Recurent</div>
                <div className="text-2xl font-bold text-green-400">
                  {!currentLevel 
                    ? "$0"
                    : currentLevel.name === "ELITE" 
                    ? "Personalizat" 
                    : `$${monthlyRevenue.toFixed(0)}`}
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-gray-300 text-sm mb-1">Venit Anual Estimat</div>
                <div className="text-2xl font-bold text-blue-400">
                  {!currentLevel 
                    ? "$0"
                    : currentLevel.name === "ELITE" 
                    ? "Personalizat" 
                    : `$${yearlyRevenue.toFixed(0)}`}
                </div>
              </div>
            </div>

            {currentLevel && currentLevel.commission > 0 && (
              <div className="text-center text-gray-300 text-sm mt-4">
                Comision per client: <span className="font-bold text-yellow-400">${(currentLevel.commission * price).toFixed(2)}/lună</span> ({(currentLevel.commission * 100).toFixed(0)}%)
              </div>
            )}
          </div>

          {/* Beneficii */}
          <div className="bg-gray-800 p-6 rounded-lg mt-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              De Ce Să Devii Affiliate ProFX?
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>Comision recurent lunar</strong> - Câștig continuu din abonamentele active</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>Ecosistem complet, ușor de promovat</strong> - Platformă premium pentru traderi</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>Conținut educațional premium</strong> - Materiale de calitate pentru clienți</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>O comunitate mare și activă (1500+ membri)</strong> - Bază solidă de utilizatori</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>Materiale de marketing oferite de ProFX</strong> - Suport complet pentru promovare</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>Evenimente, bonusuri, promo-uri exclusive</strong> - Oportunități speciale pentru afiliați</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>Oportunitate reală de venit pasiv la scară mare</strong> - Potențial nelimitat de câștig</span>
              </li>
            </ul>
          </div>

          {/* Exemple de scenarii */}
          <div className="bg-gray-800 p-6 rounded-lg mt-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              Exemple de Scenarii
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white border border-gray-700">
                <thead className="bg-gray-900 text-yellow-400">
                  <tr>
                    <th className="p-3 border border-gray-600 text-left">Nivel</th>
                    <th className="p-3 border border-gray-600 text-center">Clienți Activi</th>
                    <th className="p-3 border border-gray-600 text-center">Comision</th>
                    <th className="p-3 border border-gray-600 text-right">Venit Lunar</th>
                    <th className="p-3 border border-gray-600 text-right">Venit Anual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 border border-gray-700 font-semibold">STARTER</td>
                    <td className="p-3 border border-gray-700 text-center">3</td>
                    <td className="p-3 border border-gray-700 text-center">Abonament Gratuit</td>
                    <td className="p-3 border border-gray-700 text-right text-gray-400">-</td>
                    <td className="p-3 border border-gray-700 text-right text-gray-400">-</td>
                  </tr>
                  <tr className="border-t border-gray-700 bg-gray-700/30">
                    <td className="p-3 border border-gray-700 font-semibold">SILVER</td>
                    <td className="p-3 border border-gray-700 text-center">10</td>
                    <td className="p-3 border border-gray-700 text-center">15%</td>
                    <td className="p-3 border border-gray-700 text-right text-green-400">${(0.15 * price * 10).toFixed(0)}</td>
                    <td className="p-3 border border-gray-700 text-right text-blue-400">${(0.15 * price * 10 * 12).toFixed(0)}</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 border border-gray-700 font-semibold">GOLD</td>
                    <td className="p-3 border border-gray-700 text-center">30</td>
                    <td className="p-3 border border-gray-700 text-center">20%</td>
                    <td className="p-3 border border-gray-700 text-right text-green-400">${(0.20 * price * 30).toFixed(0)}</td>
                    <td className="p-3 border border-gray-700 text-right text-blue-400">${(0.20 * price * 30 * 12).toFixed(0)}</td>
                  </tr>
                  <tr className="border-t border-gray-700 bg-gray-700/30">
                    <td className="p-3 border border-gray-700 font-semibold">PLATINUM</td>
                    <td className="p-3 border border-gray-700 text-center">75</td>
                    <td className="p-3 border border-gray-700 text-center">25%</td>
                    <td className="p-3 border border-gray-700 text-right text-green-400">${(0.25 * price * 75).toFixed(0)}</td>
                    <td className="p-3 border border-gray-700 text-right text-blue-400">${(0.25 * price * 75 * 12).toFixed(0)}</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 border border-gray-700 font-semibold">ELITE</td>
                    <td className="p-3 border border-gray-700 text-center">100+</td>
                    <td className="p-3 border border-gray-700 text-center">Personalizat</td>
                    <td className="p-3 border border-gray-700 text-right text-yellow-400">Custom</td>
                    <td className="p-3 border border-gray-700 text-right text-yellow-400">Custom</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </CardContent>
      </Card>
      </div>
    </div>
  );
}
