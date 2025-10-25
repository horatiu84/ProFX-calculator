import React from "react";
import { useLanguage } from './contexts/LanguageContext';

const FlipCard = () => {
  const { translations: t, language } = useLanguage();
  
  return (
    <div key={language} className="flex justify-center items-center py-10 animate-language-change">
      <div className="group [perspective:1000px] w-[370px] h-[355px]">
        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Fața cardului */}
          <div className="absolute w-full h-full bg-gradient-to-br from-slate-800/50 to-slate-900/40 backdrop-blur-md rounded-2xl border-2 border-yellow-500/40 shadow-2xl shadow-black/20 flex flex-col justify-start items-start px-6 py-5 text-left text-slate-200 [backface-visibility:hidden] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/3 before:to-transparent before:rounded-2xl before:pointer-events-none">
            <h2 className="text-xl font-bold text-yellow-400 mb-3 relative z-10 drop-shadow-md">
              {t.frontTitle}
            </h2>
            <ol className="list-decimal text-sm text-slate-300 pl-4 space-y-2 relative z-10">
              <li>
                <strong className="text-slate-100 drop-shadow-sm">{t.rule1Label}</strong> {t.rule1Text}
              </li>
              <li>
                <strong className="text-slate-100 drop-shadow-sm">{t.rule2Label}</strong> {t.rule2Text}
              </li>
              <li>
                <strong className="text-slate-100 drop-shadow-sm">{t.rule3Label}</strong>{" "}
                {t.rule3Text}
              </li>
              <li>
                <strong className="text-slate-100 drop-shadow-sm">{t.rule4Label}</strong> {t.rule4Text}
              </li>
              <li>
                <strong className="text-slate-100 drop-shadow-sm">
                  {t.rule5Label}
                </strong>
                <ul className="list-disc pl-5 mt-1 text-slate-400">
                  <li>{t.federalFundsRate}</li>
                  <li>{t.nfpUnemployment}</li>
                  <li>{t.cpi}</li>
                </ul>
              </li>
            </ol>
          </div>

          {/* Spatele cardului */}
          <div className="absolute w-full h-full bg-gradient-to-br from-slate-800/50 to-slate-900/40 backdrop-blur-md rounded-2xl border-2 border-blue-400/50 shadow-2xl shadow-black/20 px-6 py-5 text-sm text-slate-100 [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/3 before:to-transparent before:rounded-2xl before:pointer-events-none">
            <h3 className="text-lg font-bold text-blue-400 mb-2 text-center relative z-10 drop-shadow-md">
              {t.backTitle}
            </h3>
            <p className="mb-2 text-slate-200 relative z-10">
              🎯 <strong className="text-yellow-400 drop-shadow-sm">{t.riskPerTrade}</strong>
              <br />
              🔁 {t.maxTrades}
            </p>
            <ul className="list-disc pl-5 text-slate-300 space-y-2 relative z-10">
              <li>
                {t.strategy1} <strong className="text-slate-100 drop-shadow-sm">{t.strategy1Pips}</strong>{t.strategy1Action}
              </li>
              <li>
                <strong className="text-slate-100 drop-shadow-sm">{t.strategy2Pips}</strong>{t.strategy2Action}
                <br />
                <em className="text-sm text-slate-400">
                  {t.strategy2Note}
                </em>
              </li>
              <li>
                {t.strategy3} <strong className="text-slate-100 drop-shadow-sm">{t.strategy3Pips}</strong>{t.strategy3Action}
              </li>
              <li>
                {t.strategy4Label}
                <br />
                {t.strategy4Option1}
                <br />{t.strategy4Option2}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
