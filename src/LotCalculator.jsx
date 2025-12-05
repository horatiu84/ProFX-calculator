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
import Concurs from "./Concurs.jsx";
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
import Biblia from "./Biblia.jsx";
import ProFXbook from "./ProFXbook.jsx";
import Calculatoare from "./Calculatoare.jsx";
import "./LotCalculator.css";

// Simple SVG Icon Components
const Icons = {
  TrendingUp: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  TrendingDown: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  ),
  Settings: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  BookOpen: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Users: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Camera: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  DocumentText: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Trophy: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  TrophyCup: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v7a7 7 0 01-14 0V5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v6m-3 0h6M19 8h1a2 2 0 010 4h-1M5 8H4a2 2 0 000 4h1" />
    </svg>
  ),
  Flag: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  ),
  ClipboardList: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  ChatAlt: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  Newspaper: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
  ChartBar: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  AcademicCap: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  Calculator: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  QuestionMarkCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  LightningBolt: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  UserGroup: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Beaker: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  Book: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Home: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  ClipboardCheck: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Chip: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  )
};

// Brain Loading Screen Component
const BrainLoadingScreen = ({ onLoadingComplete = () => console.log("Loading complete!") }) => {
  const { translations } = useLanguage();
  const t = translations.menu;
  
  const [progress, setProgress] = useState(0);
  const [showItems, setShowItems] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);

  const menuItems = [
    { key: "evolutie", label: t.evolutie, icon: <Icons.TrendingUp className="w-6 h-6" />, angle: 0 },
    { key: "lot", label: t.lot, icon: <Icons.TrendingDown className="w-6 h-6" />, angle: 32.7 },
    { key: "pierdere", label: t.pierdere, icon: <Icons.Settings className="w-6 h-6" />, angle: 65.4 },
    { key: "educatie", label: t.educatie, icon: <Icons.BookOpen className="w-6 h-6" />, angle: 98.1 },
    { key: "training", label: t.training, icon: <Icons.Users className="w-6 h-6" />, angle: 130.8 },
    { key: "agenda", label: t.agenda, icon: <Icons.Calendar className="w-6 h-6" />, angle: 163.5 },
    { key: "galerie", label: t.galerie, icon: <Icons.Camera className="w-6 h-6" />, angle: 196.2 },
    { key: "raport", label: t.raport, icon: <Icons.DocumentText className="w-6 h-6" />, angle: 228.9 },
    { key: "concurs", label: t.concurs, icon: <Icons.TrophyCup className="w-6 h-6" />, angle: 261.6 },
    { key: "evenimente", label: t.evenimente, icon: <Icons.Flag className="w-6 h-6" />, angle: 294.3 },
    { key: "test", label: t.test, icon: <Icons.ClipboardList className="w-6 h-6" />, angle: 327 },
    { key: "contact", label: t.contact, icon: <Icons.ChatAlt className="w-6 h-6" />, angle: 359.7 },
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

      <style>{`
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
    education: false,
    wall: false
  });
  const [expandedSubGroups, setExpandedSubGroups] = useState({});

  // Structura nouă de meniu cu grupuri și submeniuri
  const menuGroups = [
    {
      key: "wall",
      label: "WALL",
      tag: "FREE",
      icon: <Icons.Newspaper className="w-5 h-5" />,
      color: "green",
      isGroup: true,
      hasSubmenu: true,
      items: [
        { key: "stiri", label: "News & Announcements", icon: <Icons.Newspaper className="w-5 h-5" />, component: <Stiri />, color: "green" },
        { key: "galerie", label: "Photos", icon: <Icons.Camera className="w-5 h-5" />, component: <EventPhotoGallery />, color: "green" },
        { key: "evenimente", label: "Events / Bootcamps", icon: <Icons.Flag className="w-5 h-5" />, component: <Evenimente />, color: "green" }
      ]
    },
    {
      key: "dashboard",
      label: "DASHBOARD",
      tag: "ARMY",
      icon: <Icons.ChartBar className="w-5 h-5" />,
      color: "yellow",
      isGroup: true,
      hasSubmenu: true,
      items: [
        { key: "agenda", label: "Program ProFx", icon: <Icons.Calendar className="w-5 h-5" />, component: <ProFXSchedule />, color: "yellow" },
        { key: "performance", label: "My Performance", icon: <Icons.TrendingUp className="w-5 h-5" />, component: <ProFXbook />, color: "yellow" },
        { key: "biblia", label: "Trader's Bible", icon: <Icons.Book className="w-5 h-5" />, component: <Biblia />, color: "yellow" },
        { key: "mentor", label: "I Am Mentor", icon: <Icons.Users className="w-5 h-5" />, component: <TradingJournal />, color: "yellow" },
        { key: "calculatoare", label: "Calculatoare", icon: <Icons.Calculator className="w-5 h-5" />, component: null, color: "yellow" }
      ]
    },
    {
      key: "education",
      label: "EDUCATION",
      tag: "VIP",
      icon: <Icons.AcademicCap className="w-5 h-5" />,
      color: "purple",
      isGroup: true,
      hasSubmenu: true,
      items: [
        { key: "educatie", label: "Curs BASIC", icon: <Icons.BookOpen className="w-5 h-5" />, component: <Educatie />, color: "purple" },
        { key: "training", label: "Curs Avansați", icon: <Icons.Users className="w-5 h-5" />, component: <Training />, color: "purple" },
        { key: "test", label: "Curs Macro", icon: <Icons.ChartBar className="w-5 h-5" />, component: <Test />, color: "purple" },
        { key: "clase", label: "Curs Psihologie", icon: <Icons.UserGroup className="w-5 h-5" />, component: <ProFXChecklist />, color: "purple" },
        { key: "clase-algo", label: "Curs Algo", icon: <Icons.Chip className="w-5 h-5" />, component: <ProFXChecklist />, color: "purple" },
        { key: "pdfs", label: "PDFs", icon: <Icons.ClipboardList className="w-5 h-5" />, component: <Test />, color: "purple" },
        { key: "how-to", label: "How To", icon: <Icons.QuestionMarkCircle className="w-5 h-5" />, component: <HowTo />, color: "purple" },
        { key: "training-extra", label: "Training", icon: <Icons.LightningBolt className="w-5 h-5" />, component: <Training />, color: "purple" }
      ]
    },
    {
      key: "feedback",
      label: "FEEDBACK",
      tag: "FREE",
      icon: <Icons.ChatAlt className="w-5 h-5" />,
      color: "free",
      isGroup: false,
      component: <Contact />
    },
    {
      key: "concurs",
      label: "CONCURS",
      tag: "FREE",
      icon: <Icons.TrophyCup className="w-5 h-5" />,
      color: "concurs",
      isGroup: false,
      component: <Concurs />,
      subtitle: "Competiție lunară"
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

  // Toggle sub-group expansion
  const toggleSubGroup = (subGroupKey) => {
    setExpandedSubGroups(prev => ({
      ...prev,
      [subGroupKey]: !prev[subGroupKey]
    }));
  };

  // Show loading screen
  if (isLoading) {
    return <BrainLoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  // Helper function pentru culorile tag-urilor
  const getTagColor = (tag) => {
    switch(tag) {
      case 'FREE':
        return 'text-green-400 border border-green-400/30 bg-transparent';
      case 'VIP':
        return 'text-purple-400 border border-purple-400/30 bg-transparent';
      case 'ARMY':
        return 'text-amber-400 border border-amber-400/30 bg-transparent';
      default:
        return 'text-gray-400 border border-gray-400/30 bg-transparent';
    }
  };

  // Sidebar button component
  const SidebarButton = ({ item }) => {
    const isActive = activeTab === item.key;
    
    // Stil uniform pentru toate butoanele - glassmorphism
    const getColorClasses = () => {
      if (isActive) {
        return 'bg-white/10 backdrop-blur-sm text-white shadow-lg';
      }
      return 'bg-transparent text-gray-400 hover:bg-white/5 hover:backdrop-blur-sm hover:text-gray-200';
    };
    
    return (
      <div className="relative group">
        <button
          onClick={() => handleTabChange(item.key)}
          className={`
            relative w-full flex items-center gap-3 rounded-md font-normal transition-all duration-200 
            ease-in-out overflow-visible text-sm
            ${item.tag ? 'px-3 py-2.5 pt-2.5' : 'px-3 py-2'}
            ${getColorClasses()}
          `}
        >
          {/* Tag în colțul stânga sus pentru itemii cu tag */}
          {item.tag && isSidebarExpanded && (
            <span className={`absolute -top-2 -left-2 px-2 py-0.5 text-[9px] font-bold tracking-wider
                           rounded transform -rotate-12 z-20
                           ${getTagColor(item.tag)}`}>
              {item.tag}
            </span>
          )}
          
          <span className="flex-shrink-0 flex items-center justify-center z-10 text-gray-300 group-hover:text-gray-100 transition-colors duration-200">
            {item.icon}
          </span>
          
          <span className={`
            flex-1 whitespace-nowrap transition-all duration-300 overflow-hidden text-left z-10 font-normal
            ${isSidebarExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
          `}>
            {item.label}
          </span>
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
    
    // Stil uniform pentru header-ul grupului - glassmorphism
    const getGroupColor = () => {
      return 'bg-white/5 backdrop-blur-sm';
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
            relative w-full flex items-center justify-between px-3 py-2 rounded-md font-medium 
            transition-all duration-200 ease-in-out overflow-visible text-xs
            ${getGroupColor()} text-gray-300 hover:bg-white/10 hover:backdrop-blur-sm hover:text-white
          `}
        >
          {/* Tag în colțul stânga sus */}
          {group.tag && isSidebarExpanded && (
            <span className={`absolute -top-2 -left-2 px-2 py-0.5 text-[9px] font-bold tracking-wider
                           rounded transform -rotate-12 z-10
                           ${getTagColor(group.tag)}`}>
              {group.tag}
            </span>
          )}
          
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 flex items-center justify-center text-gray-300 group-hover:text-gray-100 transition-colors duration-200">
              {group.icon}
            </span>
            <span className={`
              text-xs whitespace-nowrap transition-all duration-300 overflow-hidden uppercase tracking-wider
              ${isSidebarExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
            `}>
              {group.label}
            </span>
          </div>
          {isSidebarExpanded && (
            <span className={`transform transition-transform duration-300 text-xs ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          )}
        </button>

        {/* Submenu Items */}
        <div className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded && isSidebarExpanded ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}
        `}>
          <div className="ml-2 space-y-1 border-l-2 border-white/5 pl-3">
            {group.items.map((item) => {
              // Dacă e sub-grup cu dropdown (ex: My Performance, Calculatoare)
              if (item.isSubGroup && item.hasSubmenu && item.items) {
                const isSubGroupExpanded = expandedSubGroups[item.key];
                return (
                  <div key={item.key} className="space-y-1">
                    {/* Buton pentru sub-grup - clickable cu dropdown */}
                    <button
                      onClick={() => toggleSubGroup(item.key)}
                      className={`
                        w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md font-normal 
                        transition-all duration-200 ease-in-out text-sm
                        bg-transparent text-gray-400 hover:bg-white/5 hover:backdrop-blur-sm hover:text-gray-200
                      `}
                    >
                      <div className="flex items-center">
                        <span className="text-base flex-shrink-0 w-6 h-6 flex items-center justify-center">
                          {item.icon}
                        </span>
                        <span className="ml-2.5">{item.label}</span>
                      </div>
                      <span className={`transform transition-transform duration-300 text-xs ${isSubGroupExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    
                    {/* Items din sub-grup */}
                    <div className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isSubGroupExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}
                    `}>
                      <div className="space-y-1 ml-3">
                        {item.items.map((subItem) => (
                          <SidebarButton key={subItem.key} item={subItem} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              // Item normal
              return <SidebarButton key={item.key} item={item} />;
            })}
          </div>
        </div>
      </div>
    );
  };

  // Logo Section - clickable
  const LogoSection = ({ isExpanded, onClick }) => (
    <div className="p-3 border-b border-white/5 backdrop-blur-sm">
      <div 
        className={`
          flex items-center transition-all duration-300 cursor-pointer
          hover:bg-white/5 rounded-lg p-2 -m-2
          ${isExpanded ? 'justify-start' : 'justify-center'}
        `}
        onClick={onClick}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0 hover:border-white/20 transition-all duration-300">
          <span className="text-white font-bold text-xs">
            Pro<span className="text-amber-400">FX</span>
          </span>
        </div>
        <div className={`
          ml-2.5 transition-all duration-300 overflow-hidden
          ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
        `}>
          <h2 className="font-semibold text-white text-sm">ProFX Academy</h2>
          <p className="text-[10px] text-gray-400">{t.clickForHome}</p>
        </div>
      </div>
    </div>
  );

  // Mobile button component
  const renderMobileButton = (item) => {
    const isActive = activeTab === item.key;
    
    let buttonClasses = `
      relative w-full px-4 py-3.5 rounded-lg font-medium transition-all duration-200
      ease-in-out text-left shadow-sm overflow-hidden flex items-center justify-between
    `;
    
    if (isActive) {
      buttonClasses += ` 
        bg-gray-700/80 text-white border-l-4 border-l-blue-500
      `;
    } else {
      buttonClasses += ` 
        bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 hover:text-white border-l-4 border-l-transparent
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
        {/* Tag în colțul stânga sus pentru mobile */}
        {item.tag && (
          <span className={`absolute -top-1.5 -left-1.5 px-2 py-0.5 text-[9px] font-bold tracking-wider
                         rounded transform -rotate-12 z-10
                         ${getTagColor(item.tag)}`}>
            {item.tag}
          </span>
        )}
        <span className="flex items-center gap-3">
          <span className="text-gray-300">{item.icon}</span>
          <span>{item.label}</span>
        </span>
      </button>
    );
  };

  const getCurrentComponent = () => {
    if (activeTab === "home") {
      return <Home menuItems={menuItems} onTabSelect={handleTabChange} />;
    }
    
    // Special handling pentru Calculatoare - afișează cardurile
    if (activeTab === "calculatoare") {
      return <Calculatoare onSelectCalculator={handleTabChange} />;
    }
    
    // Pentru calculatoarele individuale - cu buton Back
    if (activeTab === "lot") {
      return <Calculator onBack={() => handleTabChange("calculatoare")} />;
    }
    if (activeTab === "evolutie") {
      return <Evolutie onBack={() => handleTabChange("calculatoare")} />;
    }
    if (activeTab === "raport-calc") {
      return <Raport onBack={() => handleTabChange("calculatoare")} />;
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
      fixed left-0 top-0 h-full bg-gray-900/30 backdrop-blur-xl border-r border-gray-700/30
      transition-all duration-500 ease-in-out z-40 shadow-2xl flex flex-col
      ${isSidebarExpanded ? 'w-64' : 'w-20'}
    `}
    onMouseEnter={() => setIsSidebarExpanded(true)}
    onMouseLeave={() => setIsSidebarExpanded(false)}
  >
    {/* Logo Section - clickable */}
    <LogoSection isExpanded={isSidebarExpanded} onClick={goToHome} />

    {/* Navigation Items - Scrollable only when expanded and needed */}
    <nav className={`
      flex-1 p-3 pt-2 transition-all duration-300
      ${isSidebarExpanded ? 'overflow-y-auto scrollbar-none' : 'overflow-hidden'}
    `}>
      <div className="space-y-1">
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
          className="w-80 md:w-[280px] h-auto mb-2 transition-all duration-300"
          style={{ maxWidth: "320px" }}
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
            className="w-80 md:w-[420px] h-auto mb-2 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
            style={{ maxWidth: "450px" }}
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
              <span className="font-medium text-gray-200 flex items-center gap-2">
                {activeTab === "home" ? (
                  <>
                    <Icons.Home className="w-5 h-5" />
                    <span>Home</span>
                  </>
                ) : 
                 <>{menuItems.find(item => item.key === activeTab)?.icon} {menuItems.find(item => item.key === activeTab)?.label}</> || "Selectează opțiunea"}
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

      <style>{`
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
