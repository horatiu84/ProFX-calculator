import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLanguage } from "./contexts/LanguageContext";
import Dashboard from "./db/Dashboard";
import LotCalculator from "./LotCalculator";
import ProFXbook from "./ProFXbook";

export default function App() {
  const { language, setLanguage } = useLanguage();

  return (
    <Router>
      {/* Global Language Selector - Better positioned for mobile and desktop */}
      <div className="relative">
        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
          <div className="flex items-center gap-1 md:gap-2">
            <span className="text-[10px] text-gray-500 hidden md:inline">
              {language === "ro" ? "Limba" : "Lang"}
            </span>
            <div className="flex gap-1 bg-gray-800/80 backdrop-blur-sm rounded-md md:rounded-lg p-0.5 md:p-1 border border-gray-700/50 shadow-lg">
              <button
                onClick={() => setLanguage("ro")}
                className={`
                  px-2 py-0.5 md:px-2.5 md:py-1 rounded text-[10px] md:text-xs font-semibold transition-all duration-300 
                  flex items-center justify-center
                  ${language === "ro"
                    ? "bg-amber-500 text-gray-900 shadow-md"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                  }
                `}
                title="Română"
              >
                RO
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`
                  px-2 py-0.5 md:px-2.5 md:py-1 rounded text-[10px] md:text-xs font-semibold transition-all duration-300
                  flex items-center justify-center
                  ${language === "en"
                    ? "bg-amber-500 text-gray-900 shadow-md"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                  }
                `}
                title="English"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<LotCalculator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profxbook" element={<ProFXbook />} />
      </Routes>
    </Router>
  );
}

