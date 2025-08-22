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
import Home from "./Home.jsx";

export default function LotCalculator() {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const menuItems = [
    { key: "evolutie", label: "Evoluție", icon: "📈", component: <Evolutie /> },
    { key: "lot", label: "Calculator Lot", icon: "📉", component: <Calculator /> },
    { key: "pierdere", label: "Pierdere manuală", icon: "⚙️", component: <Pierdere /> },
    {
      key: "educatie",
      label: "Educație",
      icon: "ℹ️",
      component: <Educatie />,
      isSpecial: true
    },
    {
      key: "training",
      label: "Training",
      icon: "🧑‍🏫",
      component: <Training />,
      isSpecial: true
    },
    { key: "agenda", label: "Agenda ProFX", icon: "🗓️", component: <ProFXSchedule /> },
    { 
      key: "simulare", 
      label: "Afiliere", 
      icon: "💵", 
      component: <Simulare />, 
      isSpecial: true,
      isAfiliere: true
    },
    { key: "raport", label: "Jurnal", icon: "📝", component: <Raport /> },
    { key: "evenimente", label: "Evenimente", icon: "🏝️", component: <Evenimente /> },
    { key: "test", label: "Test", icon: "📋", component: <Test /> },
    { key: "contact", label: "Contact", icon: "💬", component: <Contact /> }
  ];

  // URL parameters logic
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    
    const validTabs = menuItems.map(item => item.key);
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab("home");
    }
  }, []);

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    
    // Scroll la început
    window.scrollTo(0, 0);
    
    setTimeout(() => {
      setActiveTab(newTab);
      
      // Actualizează URL doar dacă nu e home
      const newUrl = new URL(window.location);
      if (newTab === "home") {
        newUrl.searchParams.delete('tab');
      } else {
        newUrl.searchParams.set('tab', newTab);
      }
      window.history.pushState({}, '', newUrl);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  // Funcție pentru a merge la home când se dă click pe logo
  const goToHome = () => {
    handleTabChange("home");
  };

  // Sidebar button component
  const SidebarButton = ({ item }) => {
    const isActive = activeTab === item.key;
    
    return (
      <div className="relative group">
        <button
          onClick={() => handleTabChange(item.key)}
          className={`
            relative w-full flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-300 
            ease-in-out hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
            ${isActive 
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 shadow-amber-300/20 hover:shadow-amber-300/30' 
              : item.isAfiliere
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20 hover:shadow-emerald-500/30'
                : item.isSpecial
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/20 hover:shadow-indigo-500/30'
                  : 'bg-gray-800/80 backdrop-blur-sm text-gray-200 hover:bg-gray-700/80 shadow-gray-700/20 hover:shadow-gray-700/30'
            }
          `}
        >
          <span className="text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center">
            {item.icon}
          </span>
          
          <span className={`
            ml-3 whitespace-nowrap transition-all duration-300 overflow-hidden
            ${isSidebarExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
          `}>
            {item.label}
          </span>
          
          {item.isSpecial && (
            <span className={`
              absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold rounded-full shadow-sm transition-all duration-300
              ${isSidebarExpanded ? 'translate-x-0' : 'translate-x-2'}
              ${item.isAfiliere 
                ? 'text-emerald-100 bg-emerald-500/80'
                : 'text-indigo-100 bg-indigo-500/80'
              }
            `}>
              VIP
            </span>
          )}
        </button>
        
        {/* Tooltip pentru starea collapsed */}
        {!isSidebarExpanded && (
          <div className="
            absolute left-full top-1/2 transform -translate-y-1/2 ml-3 
            px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            pointer-events-none whitespace-nowrap z-50
          ">
            {item.label}
            {item.isSpecial && (
              <span className={`
                ml-2 px-1.5 py-0.5 text-xs font-bold rounded-full
                ${item.isAfiliere 
                  ? 'text-emerald-100 bg-emerald-500/80'
                  : 'text-indigo-100 bg-indigo-500/80'
                }
              `}>
                VIP
              </span>
            )}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 
                          border-4 border-transparent border-r-gray-900"></div>
          </div>
        )}
      </div>
    );
  };

  // Logo Section - clickable
  const LogoSection = ({ isExpanded, onClick }) => (
    <div className="p-4 border-b border-gray-700/50">
      <div 
        className={`
          flex items-center transition-all duration-300 cursor-pointer
          hover:bg-gray-800/50 rounded-xl p-2 -m-2
          ${isExpanded ? 'justify-start' : 'justify-center'}
        `}
        onClick={onClick}
      >
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-gray-900 transition-colors">
          <span className="text-white font-bold text-sm">
            Pro<span className="text-yellow-400">FX</span>
          </span>
        </div>
        <div className={`
          ml-3 transition-all duration-300 overflow-hidden
          ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
        `}>
          <h2 className="font-bold text-white">ProFX Academy</h2>
          <p className="text-xs text-gray-400">Click pentru home</p>
        </div>
      </div>
    </div>
  );

  // Mobile button component
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
    } else if (item.isAfiliere) {
      buttonClasses += ` 
        bg-gradient-to-r from-emerald-600 to-teal-600 text-white 
        shadow-emerald-500/20
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
          <span>{item.icon} {item.label}</span>
          {item.isSpecial && (
            <span className={`
              px-1.5 py-0.5 text-xs font-bold rounded-full shadow-sm
              ${item.isAfiliere 
                ? 'text-emerald-100 bg-emerald-500/80'
                : 'text-indigo-100 bg-indigo-500/80'
              }
            `}>
              VIP
            </span>
          )}
        </span>
      </button>
    );
  };

  const getCurrentComponent = () => {
    if (activeTab === "home") {
      return <Home menuItems={menuItems} onTabSelect={handleTabChange} />;
    }
    
    const currentItem = menuItems.find(item => item.key === activeTab);
    return currentItem ? currentItem.component : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white">
      {/* Desktop Layout cu Sidebar */}
      <div className="hidden lg:flex min-h-screen">
        {/* Sidebar */}
        <div 
          className={`
            fixed left-0 top-0 h-full bg-gray-900/90 backdrop-blur-md border-r border-gray-700/50
            transition-all duration-300 ease-in-out z-40 shadow-2xl
            ${isSidebarExpanded ? 'w-64' : 'w-20'}
          `}
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
        >
          {/* Logo Section - clickable */}
          <LogoSection isExpanded={isSidebarExpanded} onClick={goToHome} />

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <SidebarButton key={item.key} item={item} />
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700/50">
            <div className={`
              text-center transition-all duration-300
              ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}
            `}>
              <p className="text-xs text-gray-500">Învață trading gratuit</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`
          flex-1 transition-all duration-300
          ${isSidebarExpanded ? 'ml-64' : 'ml-20'}
        `}>
          <div className="p-8">
            {/* Header - logo clickable doar pe mobile/tablet */}
            <div className="flex flex-col items-center mb-8">
              <img 
                src={logo} 
                alt="Logo ProFX" 
                className="w-64 md:w-80 h-auto mb-2 transition-all duration-300"
                style={{ maxWidth: "350px" }}
              />
              <span className="text-lg text-gray-300 font-light tracking-wide">
                Învață să tranzacționezi gratuit, de la zero
              </span>
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
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden min-h-screen p-6 md:p-8">
        {/* Header - clickable */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src={logo} 
            alt="Logo ProFX" 
            className="w-64 md:w-80 h-auto mb-2 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
            style={{ maxWidth: "350px" }}
            onClick={goToHome}
          />
          <span className="text-lg md:text-xl text-gray-300 font-light tracking-wide">
            Învață să tranzacționezi gratuit, de la zero
          </span>
          {activeTab === "home" && (
            <p className="text-sm text-gray-400 mt-2">Apasă pe logo oricând pentru a reveni aici</p>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="mb-8">
          <div className="relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-3.5 
                       flex items-center justify-between transition-all duration-300 hover:bg-gray-700/80 
                       shadow-sm hover:shadow-md active:scale-95"
            >
              <span className="font-medium text-gray-200">
                {activeTab === "home" ? "🏠 Home" : 
                 `${menuItems.find(item => item.key === activeTab)?.icon} ${menuItems.find(item => item.key === activeTab)?.label}` || "Selectează opțiunea"}
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

        {/* Content Container */}
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