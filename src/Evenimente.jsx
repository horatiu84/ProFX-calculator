import React, { useState } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import BrasovEvent from "./Brasov";
import BootcampRoma from "./BootcampRoma";

const Evenimente = () => {
  const { language } = useLanguage();
  const [activeEvent, setActiveEvent] = useState("bootcamp");

  const tabs = [
    {
      key: "bootcamp",
      label: language === "ro" ? "Bootcamp Roma" : "Rome Bootcamp",
      icon: "🇮🇹",
      accent: "amber",
    },
    {
      key: "mastermind",
      label: language === "ro" ? "Mastermind Iași" : "Mastermind Iași",
      icon: "🇷🇴",
      accent: "blue",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Event Switcher */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveEvent(tab.key)}
                className={`
                  flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base
                  transition-all duration-300 border
                  ${
                    activeEvent === tab.key
                      ? tab.accent === "amber"
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-lg shadow-amber-500/10"
                        : "bg-blue-500/15 border-blue-500/40 text-blue-400 shadow-lg shadow-blue-500/10"
                      : "bg-gray-800/40 border-gray-700/30 text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 hover:border-gray-600/50"
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div>
        {activeEvent === "bootcamp" && <BootcampRoma />}
        {activeEvent === "mastermind" && <BrasovEvent />}
      </div>
    </div>
  );
};

export default Evenimente;
