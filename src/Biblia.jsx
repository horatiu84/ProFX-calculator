import { useState, useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import { Book, ChevronDown, ChevronUp } from "lucide-react";

const Biblia = () => {
  const { language, translations } = useLanguage();
  const t = translations.biblia;
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedEssential, setExpandedEssential] = useState(null);
  
  // State pentru progresul fiecărui principiu (0-100%)
  const [principleProgress, setPrincipleProgress] = useState(() => {
    const saved = localStorage.getItem('bibliaProgress');
    return saved ? JSON.parse(saved) : Array(10).fill(0);
  });

  // State pentru progresul principiilor esențiale (quickTips)
  const [essentialProgress, setEssentialProgress] = useState(() => {
    const saved = localStorage.getItem('bibliaEssentialProgress');
    if (saved) return JSON.parse(saved);
    // Numărul de quickTips poate varia, deci inițializăm dinamic
    return Array(20).fill(0); // Maximum 20 pentru siguranță
  });

  // Salvare automată în localStorage
  useEffect(() => {
    localStorage.setItem('bibliaProgress', JSON.stringify(principleProgress));
  }, [principleProgress]);

  useEffect(() => {
    localStorage.setItem('bibliaEssentialProgress', JSON.stringify(essentialProgress));
  }, [essentialProgress]);

  const updateProgress = (index, value) => {
    const newProgress = [...principleProgress];
    newProgress[index] = parseInt(value);
    setPrincipleProgress(newProgress);
  };

  const updateEssentialProgress = (index, value) => {
    const newProgress = [...essentialProgress];
    newProgress[index] = parseInt(value);
    setEssentialProgress(newProgress);
  };

  const getProgressColor = (value) => {
    if (value < 25) return 'from-red-500 to-red-600';
    if (value < 50) return 'from-orange-500 to-orange-600';
    if (value < 75) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getProgressLabel = (value) => {
    if (value < 25) return '🔴 Început';
    if (value < 50) return '🟠 În progres';
    if (value < 75) return '🟡 Bine';
    if (value < 100) return '🟢 Foarte bine';
    return '✅ Perfect';
  };

  const principleIcons = ["🚫", "⚔️", "🔄", "😰", "💰", "🎯", "📝", "⚡", "⏳", "🎯"];
  const principleColors = [
    { color: "from-red-500/20 to-orange-500/20", borderColor: "border-red-500/30" },
    { color: "from-purple-500/20 to-pink-500/20", borderColor: "border-purple-500/30" },
    { color: "from-blue-500/20 to-cyan-500/20", borderColor: "border-blue-500/30" },
    { color: "from-gray-500/20 to-slate-500/20", borderColor: "border-gray-500/30" },
    { color: "from-green-500/20 to-emerald-500/20", borderColor: "border-green-500/30" },
    { color: "from-amber-500/20 to-yellow-500/20", borderColor: "border-amber-500/30" },
    { color: "from-indigo-500/20 to-violet-500/20", borderColor: "border-indigo-500/30" },
    { color: "from-rose-500/20 to-red-500/20", borderColor: "border-rose-500/30" },
    { color: "from-teal-500/20 to-cyan-500/20", borderColor: "border-teal-500/30" },
    { color: "from-orange-500/20 to-amber-500/20", borderColor: "border-orange-500/30" },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const toggleEssential = (id) => {
    setExpandedEssential(expandedEssential === id ? null : id);
  };

  // Calculează progresul general (inclusiv principiile esențiale)
  const totalPrinciples = principleProgress.length + t.quickTips.length;
  const allProgress = [...principleProgress, ...essentialProgress.slice(0, t.quickTips.length)];
  const overallProgress = Math.round(
    allProgress.reduce((acc, val) => acc + val, 0) / allProgress.length
  );

  const completedCount = allProgress.filter(p => p === 100).length;

  return (
    <div className="min-h-screen text-white py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto" key={language}>
        {/* Header */}
        <div className="text-center mb-12 animate-language-change">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Book className="w-12 h-12 md:w-16 md:h-16 text-amber-400" />
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400">
              {t.title}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Overall Progress Dashboard */}
        <div className="mb-12 group relative bg-gray-900/50 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-6 md:p-8 hover:border-amber-400/50 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-amber-400 mb-2">Progres General</h3>
              <p className="text-gray-400 text-sm">Aplicarea principiilor din Biblia Traderului</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* Circular Progress */}
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallProgress / 100)}`}
                    className={`${
                      overallProgress < 25 ? 'text-red-500' :
                      overallProgress < 50 ? 'text-orange-500' :
                      overallProgress < 75 ? 'text-yellow-500' : 'text-green-500'
                    } transition-all duration-1000`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{overallProgress}%</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-gray-300">
                  {getProgressLabel(overallProgress)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {completedCount} din {allProgress.length} principii stăpânite
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Principles */}
        <div className="space-y-6 mb-12">
          {t.principles.map((principle, index) => (
            <div
              key={index}
              className={`group relative bg-gray-900/50 backdrop-blur-sm border ${principleColors[index].borderColor} rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${principleColors[index].color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              
              <div className="relative z-10 p-6 md:p-8">
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-4xl md:text-5xl">{principleIcons[index]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                          {principle.title}
                        </h2>
                        {/* Progress Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          principleProgress[index] < 25 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          principleProgress[index] < 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          principleProgress[index] < 75 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          principleProgress[index] < 100 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {principleProgress[index]}%
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm md:text-base italic">
                        {principle.subtitle}
                      </p>
                      {/* Mini Progress Bar */}
                      <div className="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getProgressColor(principleProgress[index])} transition-all duration-500`}
                          style={{ width: `${principleProgress[index]}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 text-amber-400 hover:text-amber-300 transition-colors">
                    {expandedSection === index ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {expandedSection === index && (
                  <div className="mt-6 pt-6 border-t border-gray-700/50 animate-fade-in space-y-6">
                    <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                      {principle.content}
                    </p>

                    {/* Progress Tracker */}
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-gray-300">
                          Progresul tău în aplicarea acestui principiu
                        </label>
                        <span className="text-sm font-semibold text-amber-400">
                          {getProgressLabel(principleProgress[index])}
                        </span>
                      </div>

                      {/* Slider */}
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={principleProgress[index]}
                          onChange={(e) => updateProgress(index, e.target.value)}
                          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
                          style={{
                            background: `linear-gradient(to right, 
                              ${principleProgress[index] < 25 ? '#ef4444' : 
                                principleProgress[index] < 50 ? '#f97316' : 
                                principleProgress[index] < 75 ? '#eab308' : '#22c55e'} 0%, 
                              ${principleProgress[index] < 25 ? '#dc2626' : 
                                principleProgress[index] < 50 ? '#ea580c' : 
                                principleProgress[index] < 75 ? '#ca8a04' : '#16a34a'} ${principleProgress[index]}%, 
                              #374151 ${principleProgress[index]}%, 
                              #374151 100%)`
                          }}
                        />

                        {/* Progress Bar with Percentage */}
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>0% - {principle.progressLabels.min}</span>
                            <span className="font-bold text-lg text-white">{principleProgress[index]}%</span>
                            <span>100% - {principle.progressLabels.max}</span>
                          </div>                        {/* Visual Progress Bar */}
                        <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(principleProgress[index])} transition-all duration-500 rounded-full`}
                            style={{ width: `${principleProgress[index]}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Essential Principles Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💡</span>
            <h2 className="text-2xl md:text-3xl font-bold text-amber-400">
              {t.essentialPrinciples}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.quickTips.map((tip, index) => (
              <div
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-amber-400/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 p-4">
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleEssential(index)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-amber-400 font-bold text-lg min-w-[28px]">
                          {index + 1}.
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed flex-1">
                              {tip}
                            </p>
                            {/* Progress Badge */}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                              essentialProgress[index] < 25 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              essentialProgress[index] < 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              essentialProgress[index] < 75 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              essentialProgress[index] < 100 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {essentialProgress[index]}%
                            </span>
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="h-1 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getProgressColor(essentialProgress[index])} transition-all duration-500`}
                              style={{ width: `${essentialProgress[index]}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <button className="text-amber-400 hover:text-amber-300 transition-colors flex-shrink-0">
                        {expandedEssential === index ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Progress Tracker for Essential Tips */}
                  {expandedEssential === index && (
                    <div className="mt-4 pt-4 border-t border-gray-700/50 animate-fade-in">
                      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-xs font-medium text-gray-400">
                            Progresul tău
                          </label>
                          <span className="text-xs font-semibold text-amber-400">
                            {getProgressLabel(essentialProgress[index])}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={essentialProgress[index]}
                            onChange={(e) => updateEssentialProgress(index, e.target.value)}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, 
                                ${essentialProgress[index] < 25 ? '#ef4444' : 
                                  essentialProgress[index] < 50 ? '#f97316' : 
                                  essentialProgress[index] < 75 ? '#eab308' : '#22c55e'} 0%, 
                                ${essentialProgress[index] < 25 ? '#dc2626' : 
                                  essentialProgress[index] < 50 ? '#ea580c' : 
                                  essentialProgress[index] < 75 ? '#ca8a04' : '#16a34a'} ${essentialProgress[index]}%, 
                                #374151 ${essentialProgress[index]}%, 
                                #374151 100%)`
                            }}
                          />

                          <div className="flex items-center justify-between text-[10px] text-gray-500">
                            <span>0%</span>
                            <span className="font-bold text-sm text-white">{essentialProgress[index]}%</span>
                            <span>100%</span>
                          </div>

                          {/* Visual Progress Bar */}
                          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(essentialProgress[index])} transition-all duration-500 rounded-full`}
                              style={{ width: `${essentialProgress[index]}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-12 text-center">
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8 hover:border-amber-400/50 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 animate-language-change">
              <p className="text-xl md:text-2xl font-bold text-amber-400 mb-4 group-hover:text-amber-300 transition-colors duration-300">
                "{t.footerQuote}"
              </p>
              <p className="text-gray-400 italic">
                {t.footerAuthor}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biblia;

// Stiluri CSS pentru slider personalizat
const styles = `
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease;
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.8);
  }

  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    border: none;
    transition: all 0.2s ease;
  }

  input[type="range"]::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.8);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
