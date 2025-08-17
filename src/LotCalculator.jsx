import React, { useState } from "react";
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
    //{ key: "roadmap", label: "🎯 RoadMap", component: <RoadmapComponent /> },
    { key: "contact", label: "💬 Contact", component: <Contact /> }
  ];

  const renderDesktopButton = (item) => {
    const isActive = activeTab === item.key;
    
    let buttonClasses = `
      relative px-4 py-2 rounded-lg font-medium transition-all duration-200 
      hover:scale-105 border
    `;
    
    if (isActive) {
      buttonClasses += ` 
        bg-yellow-500 text-black border-yellow-400 shadow-md
      `;
    } else if (item.isSpecial) {
      buttonClasses += ` 
        bg-gradient-to-r from-purple-600 to-purple-700 text-white 
        hover:from-purple-500 hover:to-purple-600 border-purple-500
      `;
    } else {
      buttonClasses += ` 
        bg-gray-800 text-white hover:bg-gray-700 border-gray-700
      `;
    }

    return (
      <button
        key={item.key}
        className={buttonClasses}
        onClick={() => setActiveTab(item.key)}
      >
        {item.label}
        {item.isSpecial && (
          <span className="absolute -top-0.5 right-3 w-2 h-2 text-xs  text-black rounded-full">VIP</span>
        )}
      </button>
    );
  };

  const renderMobileButton = (item) => {
    const isActive = activeTab === item.key;
    
    let buttonClasses = `
      relative w-full px-4 py-3 rounded-lg font-medium transition-all duration-200
      border text-left
    `;
    
    if (isActive) {
      buttonClasses += ` 
        bg-yellow-500 text-black border-yellow-400
      `;
    } else if (item.isSpecial) {
      buttonClasses += ` 
        bg-gradient-to-r from-purple-600 to-purple-700 text-white 
        border-purple-500
      `;
    } else {
      buttonClasses += ` 
        bg-gray-800 text-white border-gray-700
      `;
    }

    return (
      <button
        key={item.key}
        className={buttonClasses}
        onClick={() => {
          setActiveTab(item.key);
          setIsMobileMenuOpen(false);
        }}
      >
        <span className="flex items-center justify-between">
          <span>{item.label}</span>
          {item.isSpecial && (
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
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
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <img 
          src={logo} 
          alt="Logo ProFX" 
          className="w-80 md:w-96 h-auto" 
          style={{ width: "350px" }}
        />
        <span className="text-xl text-gray-400 mt-2 text-center">
          Învață să tranzacționezi gratuit, de la zero
        </span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {menuItems.map(renderDesktopButton)}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden mb-8">
        <div className="relative">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 
                     flex items-center justify-between transition-colors hover:bg-gray-700"
          >
            <span className="font-medium">
              {menuItems.find(item => item.key === activeTab)?.label || "Selectează opțiunea"}
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isMobileMenuOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50">
              <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {menuItems.map(renderMobileButton)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tablet Navigation */}
      <div className="hidden md:block lg:hidden mb-8">
        <div className="grid grid-cols-2 gap-2 max-w-4xl mx-auto">
          {menuItems.map(renderDesktopButton)}
        </div>
      </div>

      {/* Content Container */}
      <div className="content-container">
        {getCurrentComponent()}
      </div>
    </div>
  );
}