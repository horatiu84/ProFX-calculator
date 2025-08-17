import React, { useState, useEffect } from 'react';

const RoadmapComponent = () => {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [hoveredStep, setHoveredStep] = useState(null);

  const roadmapSteps = [
    { 
      id: 1, 
      title: "Cursuri pentru Avansati", 
      side: "right", 
      bgColor: "bg-teal-400",
      icon: "✏️",
      description: "Incepem cursurile si le mentinem pe o perioada nedeterminata",
      date: "01.09.2025"
    },
    { 
      id: 2, 
      title: "Cursuri de Psihologie", 
      side: "left", 
      bgColor: "bg-slate-500",
      icon: "💬",
      description: "Incepem cursurile si le mentinem pe o perioada nedeterminata",
      date: "01.10.2025"
    },
    { 
      id: 3, 
      title: "Cursuri AlgoTrading", 
      side: "right", 
      bgColor: "bg-red-500",
      icon: "⏰",
      description: "Incepem cursurile si le mentinem pe o perioada nedeterminata",
      date: "01.10.2025"
    },
    { 
      id: 4, 
      title: "Cursuri Social Trading", 
      side: "left", 
      bgColor: "bg-slate-500",
      icon: "⚙️",
      description: "Incepem cursurile si le mentinem pe o perioada nedeterminata",
      date: "01.10.2025"
    },
    { 
      id: 5, 
      title: "Clase 20 studenti", 
      side: "right", 
      bgColor: "bg-orange-400",
      icon: "🎯",
      description: "Incepem clasele si le mentinem pe o perioada nedeterminata",
      date: "01.11.2025"
    },
    { 
      id: 6, 
      title: "Proprietary desk", 
      side: "left", 
      bgColor: "bg-slate-500",
      icon: "📄",
      description: "Incepem proiectul si il mentinem pana in anul 2100",
      date: "01.11.2025"
    },
    { 
      id: 7, 
      title: "Sesiuni Live Level 3", 
      side: "right", 
      bgColor: "bg-cyan-400",
      icon: "🎓",
      description: "Incepem sesiunile si le mentinem pe o perioada nedeterminata",
      date: "01.12.2025"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSteps(prev => {
        if (prev < roadmapSteps.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  const resetAnimation = () => {
    setVisibleSteps(0);
  };

  return (
    <div className="max-w-4xl mx-auto bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 to-amber-700 bg-clip-text text-transparent text-center mb-8 md:mb-16">
          Proiecte propuse
        </h1>
        
        <div className="relative flex flex-col items-center">
          {/* Central vertical line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-1 bg-gray-700 z-0 hidden md:block" 
               style={{height: `${roadmapSteps.length * 140}px`}}></div>
          
          {roadmapSteps.map((step, index) => (
            <div key={step.id} className="relative w-full max-w-3xl">
              
              {/* Step container */}
              <div
                className={`relative flex flex-col md:flex-row items-center justify-center mb-12 md:mb-24 transition-all duration-700 ease-out transform ${
                  index < visibleSteps 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                } ${
                /* dacă acesta este pasul hoverat, ridică-l peste restul */
                hoveredStep?.id === step.id ? 'z-50' : ''
              }`}
              >
                {/* Mobile Layout */}
                <div className="md:hidden w-full flex flex-col items-center text-center space-y-4">
                  {/* Step number circle */}
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-xl border-4 border-gray-600">
                    <span className="text-white font-bold text-lg">{step.id}</span>
                  </div>
                  
                  {/* Content container */}
                  <div 
                    onMouseEnter={() => setHoveredStep(step)}
                    onMouseLeave={() => setHoveredStep(null)}
                    className={`${step.bgColor} text-white px-6 py-3 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 relative`}
                  >
                    <span className="font-medium text-base">{step.title}</span>
                    
                    {/* Mobile hover tooltip with dynamic positioning */}
                    {hoveredStep && hoveredStep.id === step.id && (
                      <div className={`absolute ${
                        index >= roadmapSteps.length - 2 
                          ? 'bottom-full mb-3' 
                          : 'top-full mt-3'
                      } left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-xl z-150 w-72 border border-gray-700 max-w-[90vw]`}>
                        <div className="text-center">
                          <div className="mb-3">
                            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                              <span className="text-xl">{step.icon}</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                          <p className="text-sm text-gray-300 mb-3">{step.description}</p>
                          <div className="border-t pt-2">
                            <span className="font-semibold text-white">{step.date}</span>
                          </div>
                        </div>
                        {/* Dynamic arrow */}
                        <div className={`absolute ${
                          index >= roadmapSteps.length - 2 
                            ? 'top-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-800' 
                            : 'bottom-full border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-800'
                        } left-1/2 transform -translate-x-1/2 w-0 h-0`}></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex md:w-full md:items-center md:justify-center">
                  {/* Left side content */}
                  <div className="w-1/2 flex justify-end pr-8">
                    {step.side === "left" && (
                      <div 
                        onMouseEnter={() => setHoveredStep(step)}
                        onMouseLeave={() => setHoveredStep(null)}
                        className={`${step.bgColor} text-white px-6 py-4 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 relative`}
                      >
                        <span className="font-medium text-lg whitespace-nowrap">{step.title}</span>
                        
                        {/* Desktop hover tooltip with dynamic positioning */}
                        {hoveredStep && hoveredStep.id === step.id && (
                          <div className={`absolute ${
                            index >= roadmapSteps.length - 2 
                              ? 'bottom-full mb-2' 
                              : 'top-full mt-2'
                          } left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-xl z-150 w-64 border border-gray-700`}>
                            <div className="text-center">
                              <div className="mb-3">
                                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                                  <span className="text-xl">{step.icon}</span>
                                </div>
                              </div>
                              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                              <p className="text-sm text-gray-300 mb-3">{step.description}</p>
                              <div className="border-t pt-2">
                                <span className="font-semibold text-white">{step.date}</span>
                              </div>
                            </div>
                            {/* Dynamic arrow */}
                            <div className={`absolute ${
                              index >= roadmapSteps.length - 2 
                                ? 'top-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-800' 
                                : 'bottom-full border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-800'
                            } left-1/2 transform -translate-x-1/2 w-0 h-0`}></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Center circle with number */}
                  <div className="relative z-20">
                    <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center shadow-xl border-4 border-gray-600">
                      <span className="text-white font-bold text-xl">{step.id}</span>
                    </div>
                  </div>

                  {/* Right side content */}
                  <div className="w-1/2 flex justify-start pl-8">
                    {step.side === "right" && (
                      <div 
                        onMouseEnter={() => setHoveredStep(step)}
                        onMouseLeave={() => setHoveredStep(null)}
                        className={`${step.bgColor} text-white px-6 py-4 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 relative`}
                      >
                        <span className="font-medium text-lg whitespace-nowrap">{step.title}</span>
                        
                        {/* Desktop hover tooltip with dynamic positioning */}
                        {hoveredStep && hoveredStep.id === step.id && (
                          <div className={`absolute ${
                            index >= roadmapSteps.length - 2 
                              ? 'bottom-full mb-2' 
                              : 'top-full mt-2'
                          } left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-xl z-150 w-64 border border-gray-700`}>
                            <div className="text-center">
                              <div className="mb-3">
                                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                                  <span className="text-xl">{step.icon}</span>
                                </div>
                              </div>
                              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                              <p className="text-sm text-gray-300 mb-3">{step.description}</p>
                              <div className="border-t pt-2">
                                <span className="font-semibold text-white">{step.date}</span>
                              </div>
                            </div>
                            {/* Dynamic arrow */}
                            <div className={`absolute ${
                              index >= roadmapSteps.length - 2 
                                ? 'top-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-800' 
                                : 'bottom-full border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-800'
                            } left-1/2 transform -translate-x-1/2 w-0 h-0`}></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapComponent;