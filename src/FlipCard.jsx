import React from "react";

const FlipCard = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="group [perspective:1000px] w-[370px] h-[330px]">
        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Fața cardului */}
          <div className="absolute w-full h-full bg-[#1e1e2f] rounded-2xl shadow-xl flex flex-col justify-start items-start px-6 py-5 text-left text-gray-200 [backface-visibility:hidden]">
            <h2 className="text-xl font-bold text-yellow-400 mb-3">
              📜 5 REGULI DE AUR ÎN TRADING
            </h2>
            <ol className="list-decimal text-sm text-gray-300 pl-4 space-y-2">
              <li>
                <strong className="text-white">Spune-ți:</strong> Nu Over
                Trading!!!!
              </li>
              <li>
                <strong className="text-white">Spune-ți:</strong> Nu Over
                Risc!!!!
              </li>
              <li>
                <strong className="text-white">Risc maxim pe un Trade:</strong>{" "}
                max 1,5% din cont
              </li>
              <li>
                <strong className="text-white">Zi proastă?</strong> Închide ziua
                la MAXIM -3%
              </li>
              <li>
                <strong className="text-white">
                  Traderii fără experiență NU tranzacționează știri:
                </strong>
                <ul className="list-disc pl-5 mt-1 text-gray-400">
                  <li>Federal Funds Rate</li>
                  <li>NFP + Unemployment Rate</li>
                  <li>CPI</li>
                </ul>
              </li>
            </ol>
          </div>

          {/* Spatele cardului */}
          <div className="absolute w-full h-full bg-[#2a2a3d] rounded-2xl shadow-xl px-6 py-5 text-sm text-gray-100 [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto">
            <h3 className="text-lg font-bold text-blue-400 mb-2 text-center">
              STRATEGIA ÎN EXECUȚIE
            </h3>
            <p className="mb-2 text-gray-200">
              🎯 <strong className="text-yellow-400">RISC / TRADE = 1%</strong>
              <br />
              🔁 MAXIM 3 Traduri / zi
            </p>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li>
                La peste <strong className="text-white">8 pips</strong>: mut SL
                la BE
              </li>
              <li>
                <strong className="text-white">15-20 pips</strong>: securizez
                între 50-75%
                <br />
                <em className="text-sm text-gray-400">
                  (în funcție de criterii discutate în training)
                </em>
              </li>
              <li>
                La peste <strong className="text-white">50 pips</strong>:
                securizez 50% din rest
              </li>
              <li>
                Restul:
                <br />
                - la sfârșitul zilei
                <br />- sau dacă profitul e foarte mare 👉 securizez integral
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
