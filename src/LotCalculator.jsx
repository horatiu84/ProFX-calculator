import React, { useState, useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import ProFXSchedule from "./ProFXSchedule";
import Educatie from "./educatie";
import Simulare from "./Simulare";
import Raport from "./Raport.jsx";
import Training from "./Training.jsx";
import Stiri from "./Stiri.jsx";
import logo from "../src/logo.png";
import brainIcon from "../src/brainIcon.png";
import Evenimente from "./Evenimente.jsx";
import Contact from "./Contact.jsx";
import Test from "./Test.jsx";
import RoadmapComponent from "./RoadMap.jsx";
import Evolutie from "./Evolutie.jsx";
import Calculator from "./Calculator.jsx";
import Pierdere from "./Pierdere.jsx";
import Home from "./Home.jsx";
import EventPhotoGallery from "./Galerie.jsx";
import HowTo from "./HowTo.jsx";
import ProFXChecklist from "./Clase1La20.jsx";
import TradingJournal from "./Jurnal.jsx";
import "./LotCalculator.css";

// Brain Loading Screen Component
const BrainLoadingScreen = ({ onLoadingComplete = () => console.log("Loading complete!") }) => {
  const { translations } = useLanguage();
  const t = translations.menu;
  
  const [progress, setProgress] = useState(0);
  const [showItems, setShowItems] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);

  const menuItems = [
    { key: "evolutie", label: t.evolutie, icon: "📈", angle: 0 },
    { key: "lot", label: t.lot, icon: "📉", angle: 32.7 },
    { key: "pierdere", label: t.pierdere, icon: "⚙️", angle: 65.4 },
    { key: "educatie", label: t.educatie, icon: "ℹ️", angle: 98.1 },
    { key: "training", label: t.training, icon: "🧑‍🏫", angle: 130.8 },
    { key: "agenda", label: t.agenda, icon: "🗓️", angle: 163.5 },
    { key: "galerie", label: t.galerie, icon: "📷", angle: 196.2 },
    { key: "raport", label: t.raport, icon: "📝", angle: 228.9 },
    { key: "evenimente", label: t.evenimente, icon: "🏝️", angle: 261.6 },
    { key: "test", label: t.test, icon: "📋", angle: 294.3 },
    { key: "contact", label: t.contact, icon: "💬", angle: 327 },
  ];

  useEffect(() => {
    // Prima fază: arată creierul
    const timer1 = setTimeout(() => {
      setShowItems(true);
      
      // Fă elementele să apară progresiv, una câte una - 4 secunde total
      menuItems.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * 300); // 12 elemente × 300ms = 3.6 secunde
      });
    }, 500);

    // Progres gradual pentru 4 secunde total
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            onLoadingComplete();
          }, 500);
          return 100;
        }
        return prev + 2.5; // 100 / (4000ms / 100ms) = 2.5 pentru 4 secunde
      });
    }, 100);

    return () => {
      clearTimeout(timer1);
      clearInterval(progressTimer);
    };
  }, [onLoadingComplete]);

  // Funcție pentru a calcula raza bazată pe dimensiunea ecranului
  const getRadius = () => {
    if (typeof window === 'undefined') return 140;
    const width = window.innerWidth;
    if (width <= 480) return 110; // telefoane mici - mărit de la 80
    if (width <= 640) return 130; // telefoane mari - mărit de la 100
    if (width <= 768) return 150; // tablet portrait - mărit de la 120
    if (width <= 1024) return 160; // tablet landscape - mărit de la 140
    return 180; // desktop - mărit de la 170
  };

  const radius = getRadius();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Background neural network effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-radial from-amber-400/20 via-transparent to-transparent"></div>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main container - centrat perfect pe ecran */}
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
        
        {/* Container pentru orbit - flexibil și centrat */}
        <div className="relative flex-1 flex items-center justify-center">
          <div 
            className="relative"
            style={{
              width: `${radius * 2 + 160}px`, // mai mult spațiu pentru toate elementele
              height: `${radius * 2 + 160}px`,
              maxWidth: '95vw', // puțin mai mult spațiu pe mobil
              maxHeight: '75vh' // puțin mai mult spațiu vertical
            }}
          >
            
            {/* Brain in center - poziție absolută în centrul containerului */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                {/* Brain glow effect */}
                <div className="absolute inset-0 bg-gradient-radial from-amber-400/40 via-amber-400/20 to-transparent rounded-full blur-xl scale-150 animate-pulse"></div>
                
                {/* Brain icon with pulsing effect */}
                <div className={`
                  filter drop-shadow-2xl transition-all duration-1000 flex items-center justify-center
                  ${showItems ? 'animate-pulse scale-110' : 'scale-100'}
                `}>
                  <img 
                    src={brainIcon}
                    alt="Brain Icon"
                    className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 object-contain"
                    style={{ 
                      filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>

                {/* Neural activity circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border-2 border-amber-400/30 animate-ping"
                      style={{
                        width: `${60 + i * 30}px`,
                        height: `${60 + i * 30}px`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Menu items orbiting around brain */}
            {showItems && menuItems.map((item, index) => {
              const isVisible = visibleItems.includes(index);
              const angle = (item.angle * Math.PI) / 180;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div key={item.key} className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {/* Connection line to brain */}
                  {isVisible && (
                    <div
                      className="absolute bg-gradient-to-r from-amber-400/60 to-amber-400/10 animate-pulse-slow"
                      style={{
                        width: `${radius}px`,
                        height: '1.5px',
                        left: '0px',
                        top: '0px',
                        transformOrigin: '0 50%',
                        transform: `rotate(${item.angle}deg)`,
                        filter: 'drop-shadow(0 0 3px rgba(251, 191, 36, 0.3))',
                        animationDelay: `${index * 0.1}s`,
                        opacity: isVisible ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out, transform 0.7s ease-out',
                        transitionDelay: `${index * 36}ms`,
                        zIndex: 1
                      }}
                    />
                  )}

                  {/* Menu item */}
                  <div
                    className={`
                      absolute flex flex-col items-center transition-all duration-700 ease-out z-10
                      ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}
                    `}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                      transitionDelay: `${index * 36}ms`
                    }}
                  >
                    {/* Item glow */}
                    <div className="absolute inset-0 bg-gradient-radial from-amber-400/20 via-transparent to-transparent rounded-full blur-lg scale-150"></div>
                    
                    {/* Item container - responsive sizing */}
                    <div className="relative bg-gray-800/70 backdrop-blur-sm rounded-lg p-1 xs:p-1.5 sm:p-2 md:p-2.5 border border-amber-400/20 shadow-lg hover:scale-110 transition-transform">
                      <div className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl mb-1 filter drop-shadow-sm">
                        {item.icon}
                      </div>
                      <div className="text-xs xs:text-xs sm:text-xs md:text-xs text-amber-200 font-medium text-center whitespace-nowrap max-w-8 xs:max-w-10 sm:max-w-12 md:max-w-16 truncate">
                        {item.label}
                      </div>
                    </div>

                    {/* Floating particles around item */}
                    {isVisible && [...Array(2)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-amber-400/40 rounded-full animate-float-slow"
                        style={{
                          left: `${Math.random() * 40 - 20}px`,
                          top: `${Math.random() * 40 - 20}px`,
                          animationDelay: `${Math.random() * 3}s`,
                          animationDuration: `${3 + Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Neural network connections background */}
            {showItems && (
              <div className="absolute inset-0 pointer-events-none">
                {menuItems.map((item, i) => (
                  menuItems.slice(i + 1).map((item2, j) => {
                    const actualJ = i + 1 + j;
                    if (Math.random() > 0.2) return null; // Mai puține conexiuni
                    
                    const centerX = radius + 60; // centrul containerului
                    const centerY = radius + 60;
                    const x1 = centerX + Math.cos((item.angle * Math.PI) / 180) * radius;
                    const y1 = centerY + Math.sin((item.angle * Math.PI) / 180) * radius;
                    const x2 = centerX + Math.cos((item2.angle * Math.PI) / 180) * radius;
                    const y2 = centerY + Math.sin((item2.angle * Math.PI) / 180) * radius;

                    const bothVisible = visibleItems.includes(i) && visibleItems.includes(actualJ);

                    return bothVisible ? (
                      <svg 
                        key={`${i}-${actualJ}`} 
                        className="absolute inset-0 w-full h-full"
                      >
                        <line
                          x1={x1} y1={y1}
                          x2={x2} y2={y2}
                          stroke="rgba(251, 191, 36, 0.06)"
                          strokeWidth="0.8"
                          className="animate-pulse-slow"
                          style={{ 
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: '4s'
                          }}
                        />
                      </svg>
                    ) : null;
                  })
                )).flat().filter(Boolean)}
              </div>
            )}
          </div>
        </div>

        {/* ProFX Logo and progress - fixat în partea de jos */}
        <div className="text-center w-full max-w-md py-4">
          <div className="mb-4">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              Pro<span className="text-amber-400">FX</span> Academy
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">Inițializare sistem de învățare...</p>
          </div>

          {/* Progress bar */}
          <div className="w-32 xs:w-40 sm:w-48 md:w-56 lg:w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-amber-400 text-sm font-medium">
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbit-item {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3) rotate(-10deg);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-8px) rotate(180deg);
            opacity: 0.6;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .animate-orbit-item {
          animation: orbit-item 1s ease-out forwards;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        /* Breakpoint extra small pentru telefoane foarte mici */
        @media (min-width: 375px) {
          .xs\\:w-10 { width: 2.5rem; }
          .xs\\:h-10 { height: 2.5rem; }
          .xs\\:w-16 { width: 4rem; }
          .xs\\:h-16 { height: 4rem; }
          .xs\\:w-40 { width: 10rem; }
          .xs\\:p-1\\.5 { padding: 0.375rem; }
          .xs\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
          .xs\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
          .xs\\:text-xs { font-size: 0.75rem; line-height: 1rem; }
          .xs\\:max-w-10 { max-width: 2.5rem; }
        }
      `}</style>
    </div>
  );
};


export default function LotCalculator() {
  const { translations } = useLanguage();
  const t = translations.menu;

  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({
    dashboard: false,
    education: false
  });

  // Structura nouă de meniu cu grupuri și submeniuri
  const menuGroups = [
    {
      key: "wall",
      label: "THE WALL",
      icon: "📰",
      color: "green",
      isGroup: true,
      hasSubmenu: true,
      items: [
        { key: "stiri", label: "News & Announcements", icon: "📰", component: <Stiri />, color: "green" },
        { key: "galerie", label: "Photos", icon: "📷", component: <EventPhotoGallery />, color: "green" },
        { key: "evenimente", label: "Events / Postanunci", icon: "🏝️", component: <Evenimente />, color: "green" }
      ]
    },
    {
      key: "dashboard",
      label: "ONLY DASHBOARD",
      icon: "📊",
      color: "yellow",
      isGroup: true,
      hasSubmenu: true,
      items: [
        { key: "agenda", label: "Program ProFx", icon: "🗓️", component: <ProFXSchedule />, color: "yellow" },
        { key: "evolutie", label: "My Performance", icon: "📈", component: <Evolutie />, color: "yellow" },
        { key: "raport", label: "The Table", icon: "📊", component: <Raport />, color: "yellow" },
        { key: "jurnal", label: "I Am Mentor", icon: "📓", component: <TradingJournal />, color: "yellow" },
        { 
          key: "calculatoare", 
          label: "Calculatoare", 
          icon: "🧮", 
          color: "yellow",
          isSubGroup: true,
          items: [
            { key: "agenda-stats", label: "Trading Stats", icon: "📊", component: <ProFXSchedule />, color: "red" },
            { key: "jurnal-2", label: "My Journal", icon: "📓", component: <TradingJournal />, color: "red" },
            { key: "pierdere", label: "Trade Medic", icon: "⚙️", component: <HowTo />, color: "red" },
            { key: "lot", label: "Calc LOT", icon: "📉", component: <Calculator />, color: "red" },
            { key: "evolutie-2", label: "Evolutie", icon: "📈", component: <Evolutie />, color: "red" },
            { key: "raport-2", label: "Raports", icon: "📝", component: <Raport />, color: "red" }
          ]
        }
      ]
    },
    {
      key: "education",
      label: "VIP EDUCATION",
      icon: "🎓",
      color: "yellow",
      isGroup: true,
      hasSubmenu: true,
      items: [
        { key: "educatie", label: "Curs BASIC", icon: "📚", component: <Educatie />, isSpecial: true, color: "yellow" },
        { key: "training", label: "Curs Avansați", icon: "🧑‍🏫", component: <Training />, isSpecial: true, color: "yellow" },
        { key: "test", label: "Curs Macro", icon: "📊", component: <Test />, color: "yellow" },
        { key: "clase", label: "Curs 1:20", icon: "👥", component: <ProFXChecklist />, color: "yellow" },
        { key: "clase-algo", label: "Curs AlgoTrading", icon: "🤖", component: <ProFXChecklist />, color: "yellow" },
        { key: "dd-a", label: "DD-A", icon: "📋", component: <Test />, color: "yellow" },
        { key: "how-to", label: "How To", icon: "❓", component: <HowTo />, color: "yellow" },
        { key: "training-extra", label: "Training", icon: "💪", component: <Training />, color: "yellow" }
      ]
    },
    {
      key: "feedback",
      label: "FREE FEEDBACK",
      icon: "💬",
      color: "free",
      isGroup: false,
      component: <Contact />
    },
    {
      key: "concurs",
      label: "FREE CONCURS",
      icon: "🏆",
      color: "free",
      isGroup: false,
      component: <Evenimente />,
      subtitle: "Mgmt & Broker în concurs"
    }
  ];

  // Flatten all menu items pentru compatibilitate cu codul existent
  const menuItems = menuGroups.reduce((acc, group) => {
    if (group.isGroup && group.items) {
      group.items.forEach(item => {
        if (item.items) {
          // Sub-subgroup items
          item.items.forEach(subItem => acc.push(subItem));
        } else {
          acc.push(item);
        }
      });
    } else if (group.component) {
      acc.push(group);
    }
    return acc;
  }, []);

  // URL parameters logic
  useEffect(() => {
    // Only run URL logic after loading is complete
    if (!isLoading) {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      const stireId = urlParams.get('stire'); // Check pentru știre
      
      // Dacă există parametru ?stire=, deschide tab-ul Știri
      if (stireId) {
        console.log('Detected stire parameter:', stireId);
        setActiveTab("stiri");
        return;
      }
      
      const validTabs = menuItems.map(item => item.key);
      if (tab && validTabs.includes(tab)) {
        setActiveTab(tab);
      } else {
        setActiveTab("home");
      }
    }
  }, [isLoading]);

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

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

  // Toggle group expansion
  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Show loading screen
  if (isLoading) {
    return <BrainLoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  // Sidebar button component
  const SidebarButton = ({ item }) => {
    const isActive = activeTab === item.key;
    
    // Color scheme based on item color
    const getColorClasses = () => {
      if (isActive) {
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-400/30 hover:shadow-amber-400/50 border border-amber-300/50';
      }
      
      switch(item.color) {
        case 'green':
          return 'bg-gradient-to-r from-emerald-500/80 to-teal-600/80 text-white hover:from-emerald-500 hover:to-teal-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 border border-emerald-400/30';
        case 'yellow':
          return 'bg-gradient-to-r from-yellow-500/80 to-amber-600/80 text-black hover:from-yellow-500 hover:to-amber-600 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 border border-yellow-400/30';
        case 'red':
          return 'bg-gradient-to-r from-red-500/80 to-rose-600/80 text-white hover:from-red-500 hover:to-rose-600 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 border border-red-400/30';
        default:
          if (item.isAfiliere) {
            return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 border border-emerald-400/30';
          }
          if (item.isSpecial) {
            return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 border border-indigo-400/30';
          }
          return 'bg-gray-800/50 backdrop-blur-sm text-gray-200 hover:bg-gray-700/50 hover:border-amber-400/50 shadow-md border border-gray-700/50';
      }
    };
    
    return (
      <div className="relative group">
        <button
          onClick={() => handleTabChange(item.key)}
          className={`
            relative w-full flex items-center px-3 py-2.5 rounded-xl font-medium transition-all duration-300 
            ease-in-out hover:scale-105 active:scale-95 overflow-visible
            ${getColorClasses()}
          `}
        >
          <span className="text-lg flex-shrink-0 w-6 h-6 flex items-center justify-center z-10">
            {item.icon}
          </span>
          
          <span className={`
            ml-3 text-sm whitespace-nowrap transition-all duration-300 overflow-hidden z-10
            ${isSidebarExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
          `}>
            {item.label}
          </span>
          
          {/* VIP Badge  */}
          {item.isSpecial && (
            <span className={`
              absolute -top-1.5 -right-3 px-1.5  text-xs font-bold rounded-full shadow-lg transition-all duration-300
              ${isSidebarExpanded ? 'translate-x-0' : 'translate-x-0'}
              ${item.isAfiliere 
                ? 'text-emerald-100 bg-emerald-500/90 border border-emerald-400/50'
                : 'text-indigo-100 bg-indigo-500/90 border border-indigo-400/50'
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
                  ? 'text-emerald-100 bg-emerald-500/90 border border-emerald-400/50'
                  : 'text-indigo-100 bg-indigo-500/90 border border-indigo-400/50'
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

  // Menu Group Component - pentru grupuri cu submeniuri
  const MenuGroup = ({ group }) => {
    const isExpanded = expandedGroups[group.key];
    const hasSubmenu = group.hasSubmenu && group.items;
    
    // Color scheme for group header
    const getGroupColor = () => {
      switch(group.color) {
        case 'green':
          return 'from-emerald-500 to-teal-600 border-emerald-400/50';
        case 'yellow':
          return 'from-yellow-500 to-amber-600 border-yellow-400/50';
        case 'free':
          return 'from-blue-500 to-cyan-600 border-blue-400/50';
        default:
          return 'from-gray-600 to-gray-700 border-gray-500/50';
      }
    };

    // Dacă nu e grup sau nu are submeniu, afișează direct componenta
    if (!group.isGroup || !hasSubmenu) {
      if (group.component) {
        return <SidebarButton item={group} />;
      }
      return null;
    }

    return (
      <div className="mb-2">
        {/* Group Header */}
        <button
          onClick={() => toggleGroup(group.key)}
          className={`
            w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold 
            transition-all duration-300 ease-in-out hover:scale-105 active:scale-95
            bg-gradient-to-r ${getGroupColor()} text-white shadow-lg
          `}
        >
          <div className="flex items-center">
            <span className="text-lg flex-shrink-0 w-6 h-6 flex items-center justify-center">
              {group.icon}
            </span>
            <span className={`
              ml-3 text-sm whitespace-nowrap transition-all duration-300 overflow-hidden uppercase tracking-wider
              ${isSidebarExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
            `}>
              {group.label}
            </span>
          </div>
          {isSidebarExpanded && (
            <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          )}
        </button>

        {/* Submenu Items */}
        <div className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded && isSidebarExpanded ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
        `}>
          <div className="ml-2 space-y-1 border-l-2 border-gray-600/30 pl-2">
            {group.items.map((item) => {
              // Dacă e sub-subgroup (ex: Calculatoare)
              if (item.isSubGroup && item.items) {
                return (
                  <div key={item.key} className="mb-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-3">
                      {item.label}
                    </div>
                    <div className="space-y-1">
                      {item.items.map((subItem) => (
                        <SidebarButton key={subItem.key} item={subItem} />
                      ))}
                    </div>
                  </div>
                );
              }
              return <SidebarButton key={item.key} item={item} />;
            })}
          </div>
        </div>
      </div>
    );
  };

  // Logo Section - clickable
  const LogoSection = ({ isExpanded, onClick }) => (
    <div className="p-4 border-b border-gray-700/50">
      <div 
        className={`
          flex items-center transition-all duration-300 cursor-pointer
          hover:bg-gray-800/50 hover:border-amber-400/30 rounded-xl p-2 -m-2 border border-transparent
          ${isExpanded ? 'justify-start' : 'justify-center'}
        `}
        onClick={onClick}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-xl flex items-center justify-center flex-shrink-0 hover:border-amber-400/50 transition-all duration-300 shadow-md">
          <span className="text-white font-bold text-sm">
            Pro<span className="text-amber-400">FX</span>
          </span>
        </div>
        <div className={`
          ml-3 transition-all duration-300 overflow-hidden
          ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
        `}>
          <h2 className="font-bold text-white">ProFX Academy</h2>
          <p className="text-xs text-gray-400">{t.clickForHome}</p>
        </div>
      </div>
    </div>
  );

  // Mobile button component
  const renderMobileButton = (item) => {
    const isActive = activeTab === item.key;
    
    let buttonClasses = `
      relative w-full px-4 py-3.5 rounded-xl font-medium transition-all duration-300
      ease-in-out text-left shadow-md overflow-hidden
    `;
    
    if (isActive) {
      buttonClasses += ` 
        bg-gradient-to-r from-amber-400 to-amber-600 text-black 
        shadow-amber-400/30 border border-amber-300/50
      `;
    } else if (item.isAfiliere) {
      buttonClasses += ` 
        bg-gradient-to-r from-emerald-500 to-teal-600 text-white 
        shadow-emerald-500/30 border border-emerald-400/30
      `;
    } else if (item.isSpecial) {
      buttonClasses += ` 
        bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
        shadow-indigo-500/30 border border-indigo-400/30
      `;
    } else {
      buttonClasses += ` 
        bg-gray-800/50 backdrop-blur-sm text-gray-200 
        hover:bg-gray-700/50 hover:border-amber-400/50 border border-gray-700/50
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
          <span className="flex items-center gap-2">{item.icon} {item.label}</span>
          {item.isSpecial && (
            <span className={`
              px-2 py-0.5 text-xs font-bold rounded-full shadow-sm
              ${item.isAfiliere 
                ? 'text-white bg-emerald-600/90 border border-emerald-400/50'
                : 'text-white bg-indigo-600/90 border border-indigo-400/50'
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
    <div className="lot-calculator-app min-h-screen text-white">
{/* Desktop Layout cu Sidebar */}
<div className="hidden lg:flex min-h-screen">
  {/* Sidebar */}
  <div 
    className={`
      fixed left-0 top-0 h-full bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50
      transition-all duration-500 ease-in-out z-40 shadow-2xl flex flex-col
      hover:bg-gray-900/60 hover:border-amber-400/30
      ${isSidebarExpanded ? 'w-64' : 'w-20'}
    `}
    onMouseEnter={() => setIsSidebarExpanded(true)}
    onMouseLeave={() => setIsSidebarExpanded(false)}
  >
    {/* Logo Section - clickable */}
    <LogoSection isExpanded={isSidebarExpanded} onClick={goToHome} />

    {/* Navigation Items - Scrollable only when expanded and needed */}
    <nav className={`
      flex-1 p-4 transition-all duration-300
      ${isSidebarExpanded ? 'overflow-y-auto scrollbar-none' : 'overflow-hidden'}
    `}>
      <div className="space-y-2">
        {menuGroups.map((group) => (
          <MenuGroup key={group.key} group={group} />
        ))}
      </div>
    </nav>

    {/* Footer - Always visible at bottom */}
    <div className="p-4 border-t border-gray-700/50 flex-shrink-0 bg-gray-800/30 backdrop-blur-sm">
      <div className={`
        text-center transition-all duration-300
        ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}
      `}>
        <p className="text-xs text-gray-400">{t.learnTradingShort}</p>
      </div>
    </div>
  </div>

  {/* Main Content Area */}
  <div className="flex-1 mt-5 ml-20 transition-all duration-300">
    <div className="">
      {/* Header - logo clickable doar pe mobile/tablet */}
      <div className="flex flex-col items-center mb-8">
        <img 
          src={logo} 
          alt="Logo ProFX" 
          className="w-64 md:w-80 h-auto mb-2 transition-all duration-300"
          style={{ maxWidth: "350px" }}
        />
        <span className="text-lg text-gray-300 font-light tracking-wide">
          {t.learnTradingFree}
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
      <div className="lg:hidden min-h-screen p-3 md:p-3">
        {/* Header - clickable */}
        <div className="flex flex-col items-center mb-8 mt-8 md:mt-6">
          <img 
            src={logo} 
            alt="Logo ProFX" 
            className="w-64 md:w-80 h-auto mb-2 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
            style={{ maxWidth: "350px" }}
            onClick={goToHome}
          />
          <span className="text-lg md:text-xl text-gray-300 font-light tracking-wide">
            {t.learnTradingFree}
          </span>
          {activeTab === "home" && (
            <p className="text-sm text-gray-400 mt-2">{t.clickLogoToReturn}</p>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="mb-8">
          <div className="relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-3.5 
                       flex items-center justify-between transition-all duration-300 hover:bg-gray-700/50 
                       hover:border-amber-400/50 shadow-md hover:shadow-lg active:scale-95"
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
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
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
