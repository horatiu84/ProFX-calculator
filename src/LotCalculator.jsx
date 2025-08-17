import React, { useState, useEffect } from "react";
import ProFXSchedule from "./ProFXSchedule";
import Educatie from "./educatie";
import Simulare from "./Simulare";
import Raport from "./Raport.jsx";
import Training from "./Training.jsx";
import logo from "../src/logo.jpg";
import Evenimente from "./Evenimente.jsx";
import Contact from "./Contact.jsx";
import Test from "./Test.jsx";
import RoadmapComponent from "./RoadMap.jsx";
import Evolutie from "./Evolutie.jsx";
import Calculator from "./Calculator.jsx";
import Pierdere from "./Pierdere.jsx";

export default function LotCalculator() {
  const [activeTab, setActiveTab] = useState("evolutie");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const menuItems = [
    { key: "evolutie", label: "📈 Evoluție", component: <Evolutie /> },
    { key: "lot", label: "📉 Calculator Lot", component: <Calculator /> },
    { key: "pierdere", label: "⚙️ Pierdere manuală", component: <Pierdere /> },
    {
      key: "educatie",
      label: "ℹ️ Educație",
      component: <Educatie />,
      isSpecial: true
    },
    {
      key: "training",
      label: "🧑‍🏫 Training",
      component: <Training />,
      isSpecial: true
    },
    { key: "agenda", label: "🗓️ Agenda ProFX", component: <ProFXSchedule /> },
    { key: "simulare", label: "💵 Afiliere", component: <Simulare /> },
    { key: "raport", label: "📝 Jurnal", component: <Raport /> },
    { key: "evenimente", label: "🏝️ Evenimente", component: <Evenimente /> },
    { key: "test", label: "📝 Test", component: <Test /> },
    { key: "contact", label: "💬 Contact", component: <Contact /> }
  ];

  // Verifică URL parameters la încărcarea componentei
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    
    const validTabs = menuItems.map(item => item.key);
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  // Actualizează URL-ul când se schimbă tab-ul cu animație
  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return; // Nu face nimic dacă e același tab
    
    setIsTransitioning(true);
    
    // Scurt delay pentru animația de fade out
    setTimeout(() => {
      setActiveTab(newTab);
      
      // Actualizează URL-ul
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('tab', newTab);
      window.history.pushState({}, '', newUrl);
      
      // Scurt delay pentru animația de fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  const renderDesktopButton = (item) => {
    const isActive = activeTab === item.key;
    
    let buttonClasses = `
      relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 
      ease-in-out hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
      border border-transparent
    `;
    
    if (isActive) {
      buttonClasses += ` 
        bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 
        shadow-amber-300/20 hover:shadow-amber-300/30
      `;
    } else if (item.isSpecial) {
      buttonClasses += ` 
        bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
        hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/20
        hover:shadow-indigo-500/30
      `;
    } else {
      buttonClasses += ` 
        bg-gray-800/80 backdrop-blur-sm text-gray-200 
        hover:bg-gray-700/80 shadow-gray-700/20 hover:shadow-gray-700/30
      `;
    }

    return (
      <button
        key={item.key}
        className={buttonClasses}
        onClick={() => handleTabChange(item.key)}
      >
        {item.label}
        {item.isSpecial && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold text-indigo-100 bg-indigo-500/80 rounded-full shadow-sm">VIP</span>
        )}
      </button>
    );
  };

  const renderMobileButton = (item) => {
    const isActive = activeTab === item.key;
    
    let buttonClasses = `
      relative w-full px-4 py-3.5 rounded-lg font-medium transition-all duration-300
      ease-in-out border border-transparent text-left shadow-sm
    `;
    
    if (isActive) {
      buttonClasses += ` 
        bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 
        shadow-amber-300/20
      `;
    } else if (item.isSpecial) {
      buttonClasses += ` 
        bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
        shadow-indigo-500/20
      `;
    } else {
      buttonClasses += ` 
        bg-gray-800/80 backdrop-blur-sm text-gray-200 
        shadow-gray-700/20
      `;
    }

    return (
      <button
        key={item.key}
        className={buttonClasses}
        onClick={() => {
          handleTabChange(item.key);
          setIsMobileMenuOpen(false);
        }}
      >
        <span className="flex items-center justify-between">
          <span>{item.label}</span>
          {item.isSpecial && (
            <span className="px-1.5 py-0.5 text-xs font-bold text-indigo-100 bg-indigo-500/80 rounded-full shadow-sm">VIP</span>
          )}
        </span>
      </button>
    );
  };

  const getCurrentComponent = () => {
    const currentItem = menuItems.find(item => item.key === activeTab);
    return currentItem ? currentItem.component : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <img 
          src={logo} 
          alt="Logo ProFX" 
          className="w-64 md:w-80 h-auto mb-2 transition-all duration-300"
          style={{ maxWidth: "350px" }}
        />
        <span className="text-lg md:text-xl text-gray-300 font-light tracking-wide">
          Învață să tranzacționezi gratuit, de la zero
        </span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block mb-10">
        <div className="flex flex-wrap justify-center gap-3 max-w-7xl mx-auto">
          {menuItems.map(renderDesktopButton)}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden mb-8">
        <div className="relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-3.5 
                     flex items-center justify-between transition-all duration-300 hover:bg-gray-700/80 
                     shadow-sm hover:shadow-md active:scale-95"
          >
            <span className="font-medium text-gray-200">
              {menuItems.find(item => item.key === activeTab)?.label || "Selectează opțiunea"}
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 text-gray-400 ${
                isMobileMenuOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-fadeIn">
              <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
                <div className="max-h-[70vh] overflow-y-auto p-2 space-y-1.5">
                  {menuItems.map(renderMobileButton)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tablet Navigation */}
      <div className="hidden md:block lg:hidden mb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {menuItems.map(renderDesktopButton)}
        </div>
      </div>

      {/* Content Container cu animație */}
      <div className="content-container relative">
        <div 
          className={`transition-all duration-300 ease-out ${
            isTransitioning 
              ? 'opacity-0 translate-y-2 scale-98' 
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          {getCurrentComponent()}
        </div>
        

      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}