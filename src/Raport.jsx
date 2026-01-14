import React from "react";
import { useLanguage } from "./contexts/LanguageContext";

const Raport = ({ onBack }) => {
  const { translations, language } = useLanguage();
  const t = translations;

  // Rapoarte organizate pe ani
  const rapoartePerAn = {
    2025: [
      { label: t.raportMay, href: "/Rapoarte/RaportMai.html" },
      { label: t.raportJune, href: "/Rapoarte/RaportIunie.html" },
      { label: t.raportJuly, href: "/Rapoarte/RaportIulie.html" },
      { label: t.raportAugust, href: "/Rapoarte/RaportAugust.html" },
      { label: t.raportSeptember, href: "/Rapoarte/RaportSeptembrie.html" },
      { label: t.raportOctober, href: "/Rapoarte/RaportOctombrie.html" },
      { label: t.raportNovember, href: "/Rapoarte/RaportNoiembrie.html" },
      { label: t.raportDecember, href: "/Rapoarte/RaportDecembrie.html" },
    ],
    // 2026: [
    //   Rapoartele pentru 2026 vor fi adăugate aici
    // ],
  };

  // Sortează anii în ordine descrescătoare (cel mai recent primul)
  const aniSortati = Object.keys(rapoartePerAn).sort((a, b) => b - a);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600/50 hover:border-gray-500 rounded-lg transition-all duration-200 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Înapoi la Calculatoare</span>
        </button>
      )}
      
      <div key={language} className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-10 overflow-hidden animate-language-change">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <h2 className="text-2xl font-semibold mb-8 text-center text-blue-400 transition-colors duration-300">
          {t.raportTitle}
        </h2>

        <div className="space-y-8">
          {aniSortati.map((an) => (
            <div key={an} className="group">
              {/* Titlu an */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                <h3 className="px-4 text-lg font-semibold text-gray-300 group-hover:text-blue-300 transition-colors duration-300">
                  📅 {an}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              </div>

              {/* Lista rapoarte pentru acest an */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rapoartePerAn[an].map((r) => (
                  <div key={r.href} className="flex justify-center">
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-600/50 text-white text-center rounded-xl shadow-md transition duration-300 hover:bg-gray-700/50 hover:border-blue-400/50 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    >
                      {r.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Raport;
