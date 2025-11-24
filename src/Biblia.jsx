import { useState } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import { Book, ChevronDown, ChevronUp } from "lucide-react";

const Biblia = () => {
  const { language, translations } = useLanguage();
  const t = translations.biblia;
  const [expandedSection, setExpandedSection] = useState(null);

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
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {principle.title}
                      </h2>
                      <p className="text-gray-400 text-sm md:text-base italic">
                        {principle.subtitle}
                      </p>
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
                  <div className="mt-6 pt-6 border-t border-gray-700/50 animate-fade-in">
                    <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                      {principle.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Tips Section */}
        <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-6 md:p-8 hover:border-amber-400/50 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">💡</span>
              <h2 className="text-2xl md:text-3xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
                {t.essentialPrinciples}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.quickTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-amber-400/50 transition-all duration-300 group/tip hover:bg-gray-800/50"
                >
                  <div className="text-amber-400 font-bold text-lg group-hover/tip:scale-110 transition-transform min-w-[28px]">
                    {index + 1}.
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed flex-1">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
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
