import React from "react";
import { useLanguage } from "./contexts/LanguageContext";

const Raport = () => {
  const { translations, language } = useLanguage();
  const t = translations;

  const rapoarte = [
    { label: t.raportMay, href: "/Rapoarte/RaportMai.html" },
    { label: t.raportJune, href: "/Rapoarte/RaportIunie.html" },
    { label: t.raportJuly, href: "/Rapoarte/RaportIulie.html" },
    { label: t.raportAugust, href: "/Rapoarte/RaportAugust.html" },
    { label: t.raportSeptember, href: "/Rapoarte/RaportSeptembrie.html" },
  ];

  return (
    <div key={language} className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-10 max-w-md mx-auto hover:border-blue-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden animate-language-change">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <h2 className="text-xl font-semibold mb-6 text-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
          {t.raportTitle}
        </h2>

        <div className="space-y-3">
          {rapoarte.map((r) => (
            <p key={r.href} className="flex justify-center">
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl shadow-md transition duration-300 hover:bg-gray-700/50 hover:border-blue-400/50 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                {r.label}
              </a>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Raport;
