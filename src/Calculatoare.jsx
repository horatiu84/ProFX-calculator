import React from "react";
import { useLanguage } from "./contexts/LanguageContext";

// Simple SVG Icon Components
const TrendingDownIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CalculatorIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const LightBulbIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const Calculatoare = ({ onSelectCalculator }) => {
  const { translations } = useLanguage();

  const calculators = [
    {
      key: "lot",
      title: "Calculator LOT",
      icon: <TrendingDownIcon />,
      description: "Calculează dimensiunea optimă a lotului pentru tranzacțiile tale"
    },
    {
      key: "evolutie",
      title: "Calculator Evoluție",
      icon: <TrendingUpIcon />,
      description: "Vizualizează evoluția contului și proiecțiile de creștere"
    },
    {
      key: "raport-calc",
      title: "Jurnal Tranzacții ProFX",
      icon: <DocumentTextIcon />,
      description: "Vezi rapoartele lunare complete ale tranzacțiilor ProFX"
    }
  ];

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center">
          <div className="flex justify-center mb-4 text-amber-400">
            <CalculatorIcon />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
            Calculatoare ProFX
          </h1>
          <p className="text-gray-400 text-lg">
            Selectează calculatorul de care ai nevoie pentru analiza ta
          </p>
        </div>
      </div>

      {/* Calculator Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {calculators.map((calc) => (
          <div
            key={calc.key}
            onClick={() => onSelectCalculator(calc.key)}
            className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 
                     cursor-pointer transition-all duration-500 hover:scale-[1.02] overflow-hidden
                     hover:border-amber-400/50 shadow-2xl"
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className="mb-6 transform group-hover:scale-110 transition-all duration-300 text-gray-400 group-hover:text-amber-400">
                {calc.icon}
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-amber-400 transition-colors duration-300">
                {calc.title}
              </h2>

              {/* Description */}
              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
                {calc.description}
              </p>

              {/* Arrow indicator */}
              <div className="flex items-center text-gray-400 group-hover:text-amber-400 font-medium transition-colors duration-300">
                <span className="mr-2">Deschide</span>
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 rounded-tr-xl border-gray-700/30 group-hover:border-amber-400/40 transition-colors duration-300"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 rounded-bl-xl border-gray-700/30 group-hover:border-amber-400/40 transition-colors duration-300"></div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto mt-12 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-amber-400/50 transition-all duration-500">
        <div className="flex items-start gap-4">
          <div className="text-amber-400 flex-shrink-0">
            <LightBulbIcon />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-amber-400 mb-2">Sfat ProFX</h3>
            <p className="text-gray-400 leading-relaxed">
              Folosește calculatoarele în mod regulat pentru a-ți optimiza strategia de trading. 
              Calculatorul LOT te ajută să gestionezi riscul, Evoluția îți arată progresul.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculatoare;
