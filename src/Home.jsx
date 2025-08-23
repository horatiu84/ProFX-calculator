// Home.jsx
import React from 'react';

const Home = ({ menuItems, onTabSelect }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Bine ai venit la Pro<span className="text-amber-400">FX </span>Academy
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Învață trading simplu, rapid și eficient – totul într-un singur loc. 
          Alege una dintre opțiunile de mai jos pentru a începe călătoria ta în lumea Forex.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => onTabSelect(item.key)}
            className={`
              group relative p-6 rounded-2xl border transition-all duration-300 
              cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95
              ${item.isAfiliere
                ? 'bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border-emerald-500/30 hover:border-emerald-400/50'
                : item.isSpecial 
                  ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30 hover:border-indigo-400/50' 
                  : 'bg-gray-800/50 border-gray-700/50 hover:border-amber-400/50 hover:bg-gray-800/70'
              }
            `}
          >
            {/* Icon și badge VIP */}
            <div className="flex items-start justify-between mb-4">
              <div className={`
                text-4xl p-3 rounded-xl transition-all duration-300 group-hover:scale-110
                ${item.isAfiliere
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg'
                  : item.isSpecial 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg' 
                    : 'bg-gray-700/50 group-hover:bg-amber-400/20'
                }
              `}>
                {item.icon}
              </div>
              
              {item.isSpecial && (
                <span className={`
                  px-2 py-1 text-xs font-bold rounded-full
                  ${item.isAfiliere
                    ? 'text-emerald-100 bg-emerald-500/80'
                    : 'text-indigo-100 bg-indigo-500/80'
                  }
                `}>
                  VIP
                </span>
              )}
            </div>

            {/* Titlu */}
            <h3 className={`
              text-xl font-semibold mb-2 transition-colors duration-300
              ${item.isAfiliere
                ? 'text-emerald-200'
                : item.isSpecial 
                  ? 'text-indigo-200' 
                  : 'text-white group-hover:text-amber-400'
              }
            `}>
              {item.label}
            </h3>

            {/* Descriere */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {getItemDescription(item.key)}
            </p>

            {/* Arrow indicator */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="mt-16 text-center">
        <div className="inline-block p-6 bg-gray-800/30 rounded-2xl border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-2">🎯 Începe călătoria ta</h3>
          <p className="text-gray-300 text-sm max-w-md">
            Selectează orice opțiune de mai sus pentru a accesa conținutul educațional gratuit. 
          </p>
        </div>
      </div>
    </div>
  );
};

// Funcția pentru descrieri
const getItemDescription = (key) => {
  const descriptions = {
    evolutie: "Monitorizează-ți evoluția zilnică, săptămânală și profitul per trade pentru a-ți urmări progresul în timp real",
    lot: "Calculează dimensiunea optimă a lot-ului pentru fiecare tranzacție bazată pe riscul dorit",
    pierdere: "Calculează rapid pierderea potențială și procentajul de risc înainte de a deschide o tranzacție",
    educatie: "Aici găsești lecțiile de bază și ghidurile ProFX - primul pas ca să înțelegi cum funcționează tradingul",
    training: "Aici găsești tot ce ai nevoie pentru a-ți construi disciplina și strategia - de la bazele MT5 până la execuții avansate cu Price Action",
    agenda: "Agenda săptămânală ProFX - ca să știi mereu când e timpul să înveți și să crești alături de noi",
    simulare: "Secțiunea de afiliere este dedicată partenerilor ProFX",
    raport: "Jurnal detaliat lunar al tranzacțiilor ProFX",
    evenimente: "Evenimente speciale, concursuri și bootcamp ProFX",
    test: "Testează-ți cunoștințele cu quiz-uri interactive și primește feedback instant",
    contact: "Ai o idee, o sugestie sau un gând? Spune-ne părerea ta! Feedback-ul tău anonim ne ajută să facem ProFX tot mai bun"
  };
  
  return descriptions[key] || "Explorează această secțiune pentru mai multe informații.";
};

export default Home;
