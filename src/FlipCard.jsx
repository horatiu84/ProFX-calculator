import React from "react";

const FlipCard = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="group [perspective:1000px] w-[370px] h-[355px]">
        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Fața cardului */}
          <div className="absolute w-full h-full bg-gradient-to-br from-slate-800/50 to-slate-900/40 backdrop-blur-md rounded-2xl border-2 border-yellow-500/40 shadow-2xl shadow-black/20 flex flex-col justify-start items-start px-6 py-5 text-left text-slate-200 [backface-visibility:hidden] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/3 before:to-transparent before:rounded-2xl before:pointer-events-none">
            <h2 className="text-xl font-bold text-yellow-400 mb-3 relative z-10 drop-shadow-md">
              📜 5 REGULI DE AUR ÎN TRADING
            </h2>
            <ol className="list-decimal text-sm text-slate-300 pl-4 space-y-2 relative z-10">
              <li>
                <strong className="text-slate-100 drop-shadow-sm">Spune-ți:</strong> Nu Over
                Trading!!!!
              </li>
              <li>
                <strong className="text-slate-100 drop-shadow-sm">Spune-ți:</strong> Nu Over
                Risc!!!!
              </li>
              <li>
                <strong className="text-slate-100 drop-shadow-sm">Risc maxim pe un Trade:</strong>{" "}
                max 1,5% din cont
              </li>
              <li>
                <strong className="text-slate-100 drop-shadow-sm">Zi proastă?</strong> Închide ziua
                la MAXIM -3%
              </li>
              <li>
                <strong className="text-slate-100 drop-shadow-sm">
                  Traderii fără experiență NU tranzacționează știri:
                </strong>
                <ul className="list-disc pl-5 mt-1 text-slate-400">
                  <li>Federal Funds Rate</li>
                  <li>NFP + Unemployment Rate</li>
                  <li>CPI</li>
                </ul>
              </li>
            </ol>
          </div>

          {/* Spatele cardului */}
          <div className="absolute w-full h-full bg-gradient-to-br from-slate-800/50 to-slate-900/40 backdrop-blur-md rounded-2xl border-2 border-blue-400/50 shadow-2xl shadow-black/20 px-6 py-5 text-sm text-slate-100 [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/3 before:to-transparent before:rounded-2xl before:pointer-events-none">
            <h3 className="text-lg font-bold text-blue-400 mb-2 text-center relative z-10 drop-shadow-md">
              STRATEGIA ÎN EXECUȚIE
            </h3>
            <p className="mb-2 text-slate-200 relative z-10">
              🎯 <strong className="text-yellow-400 drop-shadow-sm">RISC / TRADE = 1%</strong>
              <br />
              🔁 MAXIM 3 Traduri / zi
            </p>
            <ul className="list-disc pl-5 text-slate-300 space-y-2 relative z-10">
              <li>
                La peste <strong className="text-slate-100 drop-shadow-sm">12 pips</strong>: mut SL
                la BE
              </li>
              <li>
                <strong className="text-slate-100 drop-shadow-sm">15-20 pips</strong>: securizez
                între 50-75%
                <br />
                <em className="text-sm text-slate-400">
                  (în funcție de criterii discutate în training)
                </em>
              </li>
              <li>
                La peste <strong className="text-slate-100 drop-shadow-sm">50 pips</strong>:
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
