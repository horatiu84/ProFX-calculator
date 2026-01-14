import { useState, useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import { Book, ChevronDown, ChevronUp, Download, User } from "lucide-react";
import jsPDF from "jspdf";

const Biblia = () => {
  const { language, translations } = useLanguage();
  const t = translations.biblia;
  const [expandedSection, setExpandedSection] = useState(null);
  
  // State pentru numele cursantului
  const [studentName, setStudentName] = useState(() => {
    const saved = localStorage.getItem('bibliaStudentName');
    return saved || '';
  });
  
  // State pentru progresul fiecărui principiu (0-100%)
  const [principleProgress, setPrincipleProgress] = useState(() => {
    const saved = localStorage.getItem('bibliaProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Asigură-te că avem exact 20 elemente, completând cu 0 pentru cele noi
      return [...parsed, ...Array(Math.max(0, 20 - parsed.length)).fill(0)].slice(0, 20);
    }
    return Array(20).fill(0);
  });

  // Salvare automată în localStorage
  useEffect(() => {
    localStorage.setItem('bibliaProgress', JSON.stringify(principleProgress));
  }, [principleProgress]);

  useEffect(() => {
    localStorage.setItem('bibliaStudentName', studentName);
  }, [studentName]);

  const updateProgress = (index, value) => {
    const newProgress = [...principleProgress];
    newProgress[index] = parseInt(value);
    setPrincipleProgress(newProgress);
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

  const principleIcons = ["🚫", "⚔️", "🔄", "😰", "💰", "🎯", "📝", "⚡", "⏳", "🧘", "💪", "📚", "🎓", "🌱", "🧠", "📖", "🎭", "🎯", "💼", "🌊"];
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
    { color: "from-slate-500/20 to-gray-500/20", borderColor: "border-slate-500/30" },
    { color: "from-yellow-500/20 to-orange-500/20", borderColor: "border-yellow-500/30" },
    { color: "from-lime-500/20 to-green-500/20", borderColor: "border-lime-500/30" },
    { color: "from-emerald-500/20 to-teal-500/20", borderColor: "border-emerald-500/30" },
    { color: "from-cyan-500/20 to-blue-500/20", borderColor: "border-cyan-500/30" },
    { color: "from-sky-500/20 to-indigo-500/20", borderColor: "border-sky-500/30" },
    { color: "from-indigo-500/20 to-purple-500/20", borderColor: "border-indigo-500/30" },
    { color: "from-violet-500/20 to-purple-500/20", borderColor: "border-violet-500/30" },
    { color: "from-fuchsia-500/20 to-pink-500/20", borderColor: "border-fuchsia-500/30" },
    { color: "from-pink-500/20 to-rose-500/20", borderColor: "border-pink-500/30" },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  // Funcție pentru normalizarea diacriticelor românești pentru PDF
  const normalizeDiacritics = (text) => {
    const diacriticsMap = {
      'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't',
      'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T'
    };
    return text.replace(/[ăâîșțĂÂÎȘȚ]/g, match => diacriticsMap[match] || match);
  };

  // Funcție pentru exportul PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

    // Helper pentru adăugare pagină nouă
    const checkPageBreak = (neededSpace = 15) => {
      if (yPosition + neededSpace > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Helper pentru desenare dreptunghi cu fundal
    const drawBox = (y, height, color) => {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(margin - 2, y - 5, pageWidth - 2 * margin + 4, height, 'F');
    };

    // Header
    doc.setFontSize(22);
    doc.setTextColor(251, 191, 36);
    doc.text(normalizeDiacritics(t.title), pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Nume cursant
    if (studentName) {
      doc.setFontSize(14);
      doc.setTextColor(80, 80, 80);
      doc.text(`${normalizeDiacritics(language === 'ro' ? 'Cursant' : 'Student')}: ${normalizeDiacritics(studentName)}`, margin, yPosition);
      yPosition += 10;
    }

    // Data export
    const exportDate = new Date().toLocaleDateString(language === 'ro' ? 'ro-RO' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`${normalizeDiacritics(language === 'ro' ? 'Data exportului' : 'Export date')}: ${normalizeDiacritics(exportDate)}`, margin, yPosition);
    yPosition += 15;

    // Progres general - cu fundal discret
    drawBox(yPosition, 18, [245, 245, 245]);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${normalizeDiacritics(language === 'ro' ? 'Progres general' : 'Overall progress')}: ${overallProgress}%`, margin, yPosition);
    yPosition += 7;
    doc.text(`${normalizeDiacritics(language === 'ro' ? 'Principii completate' : 'Completed principles')}: ${completedCount}/${totalPrinciples}`, margin, yPosition);
    yPosition += 15;

    // Principii principale
    doc.setFontSize(16);
    doc.setTextColor(251, 191, 36);
    doc.text(normalizeDiacritics(language === 'ro' ? 'Principii Principale' : 'Main Principles'), margin, yPosition);
    yPosition += 10;

    t.principles.forEach((principle, index) => {
      checkPageBreak(30);
      
      // Fundal discret pentru fiecare principiu
      drawBox(yPosition, 22, [250, 250, 250]);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${normalizeDiacritics(principle.title)}`, margin, yPosition);
      yPosition += 7;
      
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const subtitleLines = doc.splitTextToSize(normalizeDiacritics(principle.subtitle), pageWidth - 2 * margin - 5);
      doc.text(subtitleLines, margin + 3, yPosition);
      yPosition += subtitleLines.length * 5 + 3;
      
      // Progres cu culoare
      doc.setFontSize(11);
      const progress = principleProgress[index];
      if (progress >= 75) doc.setTextColor(34, 197, 94); // Verde
      else if (progress >= 50) doc.setTextColor(234, 179, 8); // Galben
      else if (progress >= 25) doc.setTextColor(249, 115, 22); // Portocaliu
      else doc.setTextColor(239, 68, 68); // Rosu
      
      doc.setFont(undefined, 'bold');
      doc.text(`${normalizeDiacritics(language === 'ro' ? 'Progres' : 'Progress')}: ${progress}%`, margin + 3, yPosition);
      doc.setFont(undefined, 'normal');
      yPosition += 12;
    });

    // Footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `${normalizeDiacritics(language === 'ro' ? 'Pagina' : 'Page')} ${i} ${normalizeDiacritics(language === 'ro' ? 'din' : 'of')} ${totalPages} | (c) ProFX Academy`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Salvare PDF
    const fileName = studentName 
      ? `Biblia_Traderului_${normalizeDiacritics(studentName).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      : `Biblia_Traderului_${new Date().toISOString().split('T')[0]}.pdf`;
    
    doc.save(fileName);
  };

  // Calculează progresul general
  const totalPrinciples = principleProgress.length;
  const overallProgress = Math.round(
    principleProgress.reduce((acc, val) => acc + val, 0) / principleProgress.length
  );

  const completedCount = principleProgress.filter(p => p === 100).length;

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
                  {completedCount} din {totalPrinciples} principii stăpânite
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* === CELE TREI CURSE MORTALE === */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 mb-4">
              Cele Trei Curse Mortale ale Traderului
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-sm md:text-base">
              Înainte de a vorbi despre succes, trebuie să înțelegem cele mai periculoase capcane psihologice care sabotează majoritatea traderilor. 
              Aceste trei comportamente emoționale sunt responsabile pentru mai multe pierderi decât orice strategie greșită.
            </p>
          </div>

          <div className="space-y-6">
            {/* Principiile 0, 1, 2 - FOMO, Răzbunare, Overtrading */}
            {t.principles.slice(0, 3).map((principle, idx) => (
              <div
                key={idx}
                className={`group relative bg-gray-900/50 backdrop-blur-sm border ${principleColors[idx].borderColor} rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${principleColors[idx].color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                <div className="relative z-10 p-6 md:p-8">
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleSection(idx)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl md:text-5xl">{principleIcons[idx]}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl md:text-3xl font-bold text-white">
                            {idx + 1}. {principle.title}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            principleProgress[idx] < 25 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            principleProgress[idx] < 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                            principleProgress[idx] < 75 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            principleProgress[idx] < 100 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {principleProgress[idx]}%
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm md:text-base italic">
                          {principle.subtitle}
                        </p>
                        <div className="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getProgressColor(principleProgress[idx])} transition-all duration-500`}
                            style={{ width: `${principleProgress[idx]}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 text-amber-400 hover:text-amber-300 transition-colors">
                      {expandedSection === idx ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  {expandedSection === idx && (
                    <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-500">
                      <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                        <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                          {principle.content}
                        </p>
                      </div>

                      <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30">
                        <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                          <span>📊</span> Progresul Tău
                        </h3>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={principleProgress[idx]}
                          onChange={(e) => updateProgress(idx, e.target.value)}
                          className="w-full mb-4 cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, 
                              ${principleProgress[idx] < 25 ? '#ef4444' : 
                                principleProgress[idx] < 50 ? '#f97316' : 
                                principleProgress[idx] < 75 ? '#eab308' : '#22c55e'} 0%, 
                              ${principleProgress[idx] < 25 ? '#dc2626' : 
                                principleProgress[idx] < 50 ? '#ea580c' : 
                                principleProgress[idx] < 75 ? '#ca8a04' : '#16a34a'} ${principleProgress[idx]}%, 
                              #374151 ${principleProgress[idx]}%, 
                              #374151 100%)`
                          }}
                        />

                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>0% - {principle.progressLabels.min}</span>
                          <span className="font-bold text-lg text-white">{principleProgress[idx]}%</span>
                          <span>100% - {principle.progressLabels.max}</span>
                        </div>
                        <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(principleProgress[idx])} transition-all duration-500 rounded-full`}
                            style={{ width: `${principleProgress[idx]}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
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

        {/* === FRICA ȘI LĂCOMIA === */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mb-4">
              Frica și Lăcomia: Cei Doi Dușmani Interiori
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-sm md:text-base">
              Aceste două emoții primare controlează majoritatea deciziilor proaste în trading. 
              Învață să le recunoști și să le gestionezi pentru a obține control complet asupra performanței tale.
            </p>
          </div>

          <div className="space-y-6">
            {/* Principiile 3, 4 - Frica, Lăcomia */}
            {t.principles.slice(3, 5).map((principle, idx) => {
              const actualIdx = idx + 3;
              return (
                <div
                  key={actualIdx}
                  className={`group relative bg-gray-900/50 backdrop-blur-sm border ${principleColors[actualIdx].borderColor} rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${principleColors[actualIdx].color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  
                  <div className="relative z-10 p-6 md:p-8">
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => toggleSection(actualIdx)}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl md:text-5xl">{principleIcons[actualIdx]}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                              {actualIdx + 1}. {principle.title}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              principleProgress[actualIdx] < 25 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              principleProgress[actualIdx] < 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              principleProgress[actualIdx] < 75 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              principleProgress[actualIdx] < 100 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {principleProgress[actualIdx]}%
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm md:text-base italic">
                            {principle.subtitle}
                          </p>
                          <div className="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500`}
                              style={{ width: `${principleProgress[actualIdx]}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 text-amber-400 hover:text-amber-300 transition-colors">
                        {expandedSection === actualIdx ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>

                    {expandedSection === actualIdx && (
                      <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-500">
                        <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                          <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {principle.content}
                          </p>
                        </div>

                        <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30">
                          <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                            <span>📊</span> Progresul Tău
                          </h3>

                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={principleProgress[actualIdx]}
                            onChange={(e) => updateProgress(actualIdx, e.target.value)}
                            className="w-full mb-4 cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, 
                                ${principleProgress[actualIdx] < 25 ? '#ef4444' : 
                                  principleProgress[actualIdx] < 50 ? '#f97316' : 
                                  principleProgress[actualIdx] < 75 ? '#eab308' : '#22c55e'} 0%, 
                                ${principleProgress[actualIdx] < 25 ? '#dc2626' : 
                                  principleProgress[actualIdx] < 50 ? '#ea580c' : 
                                  principleProgress[actualIdx] < 75 ? '#ca8a04' : '#16a34a'} ${principleProgress[actualIdx]}%, 
                                #374151 ${principleProgress[actualIdx]}%, 
                                #374151 100%)`
                            }}
                          />

                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>0% - {principle.progressLabels.min}</span>
                            <span className="font-bold text-lg text-white">{principleProgress[actualIdx]}%</span>
                            <span>100% - {principle.progressLabels.max}</span>
                          </div>
                          <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500 rounded-full`}
                              style={{ width: `${principleProgress[actualIdx]}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === MENTALITATEA CORECTĂ: PRINCIPIUL 6 === */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
              Mentalitatea Corectă: Performanță, Nu Bani
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
              Acesta este principiul esențial care trebuie înțeles pentru succesul pe termen lung.
            </p>
          </div>

          <div className="space-y-6">
            {t.principles.slice(5, 6).map((principle, idx) => {
              const actualIdx = idx + 5;
              return (
                <div
                  key={actualIdx}
                  className={`group relative bg-gray-900/50 backdrop-blur-sm border ${principleColors[actualIdx].borderColor} rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${principleColors[actualIdx].color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  
                  <div className="relative z-10 p-6 md:p-8">
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => toggleSection(actualIdx)}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl md:text-5xl">{principleIcons[actualIdx]}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                              {actualIdx + 1}. {principle.title}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              principleProgress[actualIdx] < 25 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              principleProgress[actualIdx] < 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              principleProgress[actualIdx] < 75 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                              {getProgressLabel(principleProgress[actualIdx])}
                            </span>
                          </div>
                          <p className="text-amber-400/90 font-medium text-base md:text-lg mb-4">
                            {principle.subtitle}
                          </p>
                          <div className="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500`}
                              style={{ width: `${principleProgress[actualIdx]}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 text-amber-400 hover:text-amber-300 transition-colors">
                        {expandedSection === actualIdx ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>

                    {expandedSection === actualIdx && (
                      <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-500">
                        <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                          <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {principle.content}
                          </p>
                        </div>

                        <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30">
                          <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                            <span>📊</span> Progresul Tău
                          </h3>

                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={principleProgress[actualIdx]}
                            onChange={(e) => updateProgress(actualIdx, e.target.value)}
                            className="w-full mb-4 cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, 
                                ${principleProgress[actualIdx] < 25 ? '#ef4444' : 
                                  principleProgress[actualIdx] < 50 ? '#f97316' : 
                                  principleProgress[actualIdx] < 75 ? '#eab308' : '#22c55e'} 0%, 
                                ${principleProgress[actualIdx] < 25 ? '#dc2626' : 
                                  principleProgress[actualIdx] < 50 ? '#ea580c' : 
                                  principleProgress[actualIdx] < 75 ? '#ca8a04' : '#16a34a'} ${principleProgress[actualIdx]}%, 
                                #374151 ${principleProgress[actualIdx]}%, 
                                #374151 100%)`
                            }}
                          />

                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>0% - {principle.progressLabels.min}</span>
                            <span className="font-bold text-lg text-white">{principleProgress[actualIdx]}%</span>
                            <span>100% - {principle.progressLabels.max}</span>
                          </div>
                          <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500 rounded-full`}
                              style={{ width: `${principleProgress[actualIdx]}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === PILONII FUNDAMENTALI AI SUCCESULUI === */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 mb-4">
              Pilonii Fundamentali ai Succesului
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
              Aceste patru principii formează fundația oricărui trader de succes. Fără ele, nicio strategie sau analiză tehnică nu va putea compensa lipsa de disciplină și organizare.
            </p>
          </div>

          <div className="space-y-6">
            {t.principles.slice(6, 10).map((principle, idx) => {
              const actualIdx = idx + 6;
            return (
              <div
                key={actualIdx}
                className={`group relative bg-gray-900/50 backdrop-blur-sm border ${principleColors[actualIdx].borderColor} rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${principleColors[actualIdx].color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                <div className="relative z-10 p-6 md:p-8">
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleSection(actualIdx)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl md:text-5xl">{principleIcons[actualIdx]}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl md:text-3xl font-bold text-white">
                            {actualIdx + 1}. {principle.title}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            principleProgress[actualIdx] < 25 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            principleProgress[actualIdx] < 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                            principleProgress[actualIdx] < 75 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            principleProgress[actualIdx] < 100 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {principleProgress[actualIdx]}%
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm md:text-base italic">
                          {principle.subtitle}
                        </p>
                        <div className="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500`}
                            style={{ width: `${principleProgress[actualIdx]}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 text-amber-400 hover:text-amber-300 transition-colors">
                      {expandedSection === actualIdx ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  {expandedSection === actualIdx && (
                    <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-500">
                      <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                        <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                          {principle.content}
                        </p>
                      </div>

                      <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30">
                        <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                          <span>📊</span> Progresul Tău
                        </h3>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={principleProgress[actualIdx]}
                          onChange={(e) => updateProgress(actualIdx, e.target.value)}
                          className="w-full mb-4 cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, 
                              ${principleProgress[actualIdx] < 25 ? '#ef4444' : 
                                principleProgress[actualIdx] < 50 ? '#f97316' : 
                                principleProgress[actualIdx] < 75 ? '#eab308' : '#22c55e'} 0%, 
                              ${principleProgress[actualIdx] < 25 ? '#dc2626' : 
                                principleProgress[actualIdx] < 50 ? '#ea580c' : 
                                principleProgress[actualIdx] < 75 ? '#ca8a04' : '#16a34a'} ${principleProgress[actualIdx]}%, 
                              #374151 ${principleProgress[actualIdx]}%, 
                              #374151 100%)`
                          }}
                        />

                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>0% - {principle.progressLabels.min}</span>
                          <span className="font-bold text-lg text-white">{principleProgress[actualIdx]}%</span>
                          <span>100% - {principle.progressLabels.max}</span>
                        </div>
                        <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500 rounded-full`}
                            style={{ width: `${principleProgress[actualIdx]}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </div>

        {/* === REGULA DE AUR: STAREA EMOȚIONALĂ === */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-gray-400 to-zinc-400 mb-4">
              Regula de Aur: Starea Emoțională
            </h2>
            <p className="text-gray-400 text-lg">Starea ta = Performanța ta</p>
          </div>

          <div className="space-y-6">
            {t.principles.slice(10, 11).map((principle, idx) => {
              const actualIdx = idx + 10;
              return (
                <div
                  key={actualIdx}
                  className={`group relative bg-gray-900/50 backdrop-blur-sm border ${principleColors[actualIdx]?.borderColor || 'border-gray-700/50'} rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${principleColors[actualIdx]?.color || 'from-gray-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  
                  <div className="relative z-10 p-6 md:p-8">
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => toggleSection(actualIdx)}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl md:text-5xl">{principleIcons[actualIdx] || '💪'}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                              {actualIdx + 1}. {principle.title}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              principleProgress[actualIdx] < 25 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              principleProgress[actualIdx] < 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              principleProgress[actualIdx] < 75 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                              {getProgressLabel(principleProgress[actualIdx])}
                            </span>
                          </div>
                          <p className="text-amber-400/90 font-medium text-base md:text-lg mb-4">
                            {principle.subtitle}
                          </p>
                        </div>
                      </div>
                  <div className={`transform transition-transform duration-300 ${expandedSection === actualIdx ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-6 h-6 text-amber-400" />
                  </div>
                </div>

                {expandedSection === actualIdx && (
                  <div className="mt-6 pt-6 border-t border-gray-700/50 space-y-6">
                    <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                      {principle.content}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-medium">{principle.progressLabels?.min || 'Începător'}</span>
                        <span className="text-amber-400 font-bold">{principleProgress[actualIdx]}%</span>
                        <span className="text-gray-400 font-medium">{principle.progressLabels?.max || 'Stăpânit'}</span>
                      </div>
                      
                      <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500 rounded-full`}
                          style={{ width: `${principleProgress[actualIdx]}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                      
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={principleProgress[actualIdx]}
                        onChange={(e) => updateProgress(actualIdx, parseInt(e.target.value))}
                        className="w-full h-3 bg-transparent rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* === CONSTRUIEȘTE-ȚI FUNDAȚIA: OBICEIURI ȘI PRACTICĂ === */}
    <div className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 mb-4">
          Construiește-ți Fundația: Obiceiuri și Practică
        </h2>
      </div>

      <div className="space-y-6">
        {t.principles.slice(11, 15).map((principle, idx) => {
          const actualIdx = idx + 11;
              return (
                <div
                  key={actualIdx}
                  className={`group relative bg-gray-900/50 backdrop-blur-sm border ${principleColors[actualIdx]?.borderColor || 'border-gray-700/50'} rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${principleColors[actualIdx]?.color || 'from-gray-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  
                  <div className="relative z-10 p-6 md:p-8">
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => toggleSection(actualIdx)}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl md:text-5xl">{principleIcons[actualIdx] || '📚'}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                              {actualIdx + 1}. {principle.title}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              principleProgress[actualIdx] < 25 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              principleProgress[actualIdx] < 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              principleProgress[actualIdx] < 75 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                              {getProgressLabel(principleProgress[actualIdx])}
                            </span>
                          </div>
                          <p className="text-amber-400/90 font-medium text-base md:text-lg mb-4">
                            {principle.subtitle}
                          </p>
                          <div className="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500`}
                              style={{ width: `${principleProgress[actualIdx]}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 text-amber-400 hover:text-amber-300 transition-colors">
                        {expandedSection === actualIdx ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>

                    {expandedSection === actualIdx && (
                      <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-500">
                        <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                          <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {principle.content}
                          </p>
                        </div>

                        <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30">
                          <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                            <span>📊</span> Progresul Tău
                          </h3>

                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={principleProgress[actualIdx]}
                            onChange={(e) => updateProgress(actualIdx, e.target.value)}
                            className="w-full mb-4 cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, 
                                ${principleProgress[actualIdx] < 25 ? '#ef4444' : 
                                  principleProgress[actualIdx] < 50 ? '#f97316' : 
                                  principleProgress[actualIdx] < 75 ? '#eab308' : '#22c55e'} 0%, 
                                ${principleProgress[actualIdx] < 25 ? '#dc2626' : 
                                  principleProgress[actualIdx] < 50 ? '#ea580c' : 
                                  principleProgress[actualIdx] < 75 ? '#ca8a04' : '#16a34a'} ${principleProgress[actualIdx]}%, 
                                #374151 ${principleProgress[actualIdx]}%, 
                                #374151 100%)`
                            }}
                          />

                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>0% - {principle.progressLabels.min}</span>
                            <span className="font-bold text-lg text-white">{principleProgress[actualIdx]}%</span>
                            <span>100% - {principle.progressLabels.max}</span>
                          </div>
                          <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500 rounded-full`}
                              style={{ width: `${principleProgress[actualIdx]}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === MONITORIZARE ȘI AUTOCUNOAȘTERE === */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
              Monitorizare și Autocunoaștere
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
              Tradingul este un joc psihologic mai mult decât unul tehnic. Cunoașterea de sine și monitorizarea constantă a comportamentului sunt esențiale pentru evoluție și consistență.
            </p>
          </div>

          <div className="space-y-6">
            {t.principles.slice(15, 18).map((principle, idx) => {
              const actualIdx = idx + 15;
              return (
                <div
                  key={actualIdx}
                  className={`group relative bg-gray-900/50 backdrop-blur-sm border ${principleColors[actualIdx]?.borderColor || 'border-gray-700/50'} rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${principleColors[actualIdx]?.color || 'from-gray-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  
                  <div className="relative z-10 p-6 md:p-8">
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => toggleSection(actualIdx)}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl md:text-5xl">{principleIcons[actualIdx] || '🧠'}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                              {actualIdx + 1}. {principle.title}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              principleProgress[actualIdx] < 25 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              principleProgress[actualIdx] < 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              principleProgress[actualIdx] < 75 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                              {getProgressLabel(principleProgress[actualIdx])}
                            </span>
                          </div>
                          <p className="text-amber-400/90 font-medium text-base md:text-lg mb-4">
                            {principle.subtitle}
                          </p>
                          <div className="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500`}
                              style={{ width: `${principleProgress[actualIdx]}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 text-amber-400 hover:text-amber-300 transition-colors">
                        {expandedSection === actualIdx ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>

                    {expandedSection === actualIdx && (
                      <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-500">
                        <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                          <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {principle.content}
                          </p>
                        </div>

                        <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30">
                          <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                            <span>📊</span> Progresul Tău
                          </h3>

                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={principleProgress[actualIdx]}
                            onChange={(e) => updateProgress(actualIdx, e.target.value)}
                            className="w-full mb-4 cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, 
                                ${principleProgress[actualIdx] < 25 ? '#ef4444' : 
                                  principleProgress[actualIdx] < 50 ? '#f97316' : 
                                  principleProgress[actualIdx] < 75 ? '#eab308' : '#22c55e'} 0%, 
                                ${principleProgress[actualIdx] < 25 ? '#dc2626' : 
                                  principleProgress[actualIdx] < 50 ? '#ea580c' : 
                                  principleProgress[actualIdx] < 75 ? '#ca8a04' : '#16a34a'} ${principleProgress[actualIdx]}%, 
                                #374151 ${principleProgress[actualIdx]}%, 
                                #374151 100%)`
                            }}
                          />

                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>0% - {principle.progressLabels.min}</span>
                            <span className="font-bold text-lg text-white">{principleProgress[actualIdx]}%</span>
                            <span>100% - {principle.progressLabels.max}</span>
                          </div>
                          <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500 rounded-full`}
                              style={{ width: `${principleProgress[actualIdx]}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === RELAȚIA CU PIERDERILE ȘI PROFITURILE === */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-purple-400 mb-4">
              Relația cu Pierderile și Profiturile
            </h2>
          </div>

          <div className="space-y-6">
            {t.principles.slice(18).map((principle, idx) => {
              const actualIdx = idx + 18;
              return (
                <div
                  key={actualIdx}
                  className={`group relative bg-gray-900/50 backdrop-blur-sm border ${principleColors[actualIdx]?.borderColor || 'border-gray-700/50'} rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${principleColors[actualIdx]?.color || 'from-gray-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  
                  <div className="relative z-10 p-6 md:p-8">
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => toggleSection(actualIdx)}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl md:text-5xl">{principleIcons[actualIdx] || '💼'}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                              {actualIdx + 1}. {principle.title}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              principleProgress[actualIdx] < 25 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              principleProgress[actualIdx] < 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              principleProgress[actualIdx] < 75 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                              {getProgressLabel(principleProgress[actualIdx])}
                            </span>
                          </div>
                          <p className="text-amber-400/90 font-medium text-base md:text-lg mb-4">
                            {principle.subtitle}
                          </p>
                          <div className="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500`}
                              style={{ width: `${principleProgress[actualIdx]}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 text-amber-400 hover:text-amber-300 transition-colors">
                        {expandedSection === actualIdx ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>

                    {expandedSection === actualIdx && (
                      <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-500">
                        <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                          <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {principle.content}
                          </p>
                        </div>

                        <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30">
                          <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                            <span>📊</span> Progresul Tău
                          </h3>

                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={principleProgress[actualIdx]}
                            onChange={(e) => updateProgress(actualIdx, e.target.value)}
                            className="w-full mb-4 cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, 
                                ${principleProgress[actualIdx] < 25 ? '#ef4444' : 
                                  principleProgress[actualIdx] < 50 ? '#f97316' : 
                                  principleProgress[actualIdx] < 75 ? '#eab308' : '#22c55e'} 0%, 
                                ${principleProgress[actualIdx] < 25 ? '#dc2626' : 
                                  principleProgress[actualIdx] < 50 ? '#ea580c' : 
                                  principleProgress[actualIdx] < 75 ? '#ca8a04' : '#16a34a'} ${principleProgress[actualIdx]}%, 
                                #374151 ${principleProgress[actualIdx]}%, 
                                #374151 100%)`
                            }}
                          />

                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>0% - {principle.progressLabels.min}</span>
                            <span className="font-bold text-lg text-white">{principleProgress[actualIdx]}%</span>
                            <span>100% - {principle.progressLabels.max}</span>
                          </div>
                          <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(principleProgress[actualIdx])} transition-all duration-500 rounded-full`}
                              style={{ width: `${principleProgress[actualIdx]}%` }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ProFx Army: Codul Traderului de Elită */}
        <div className="mt-16 mb-12">
          <div className="relative bg-gradient-to-br from-amber-900/20 via-gray-900/50 to-gray-900/50 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
            
            <div className="relative z-10 space-y-8">
              {/* Titlu principal */}
              <div className="text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 mb-4">
                  ProFx Army: Codul Traderului de Elită
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
              </div>

              {/* Conținut */}
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg md:text-xl text-center font-medium text-amber-400/90">
                  Aceste 19 principii nu sunt simple sugestii – sunt legile nescrise ale traderilor profesioniști care obțin rezultate constante. Fiecare regulă a fost învățată prin experiență, pierderi și eșecuri.
                </p>

                <div className="border-t border-b border-amber-500/20 py-6 my-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-amber-400 mb-4 text-center">
                    Drumul către Măiestrie
                  </h3>
                  <p className="text-base md:text-lg text-center">
                    Tradingul nu este despre a avea dreptate tot timpul. Este despre disciplină, răbdare, autocunoaștere și capacitatea de a executa planul în mod consistent, indiferent de circumstanțe.
                  </p>
                </div>

                <p className="text-base md:text-lg">
                  Fiecare trader de succes a trecut prin aceleași provocări pe care le înfrunți tu acum. Diferența constă în perseverență, disciplină și dedicarea de a urma aceste principii zi de zi, lună de lună, an de an.
                </p>

                <p className="text-base md:text-lg">
                  Nu căuta scurtături. Nu căuta sisteme magice. Construiește-ți fundația psihologică solidă, respectă procesul și lasă timpul să lucreze în favoarea ta. Succesul în trading este o maratonă, nu un sprint.
                </p>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mt-8">
                  <p className="text-lg md:text-xl font-bold text-amber-400 text-center">
                    Acum înțelegi regulile. Acum începe adevărata muncă: aplicarea lor zilnică până devin parte din tine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Name & Export Section */}
        <div className="mt-12 mb-8">
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 md:p-8 hover:border-blue-400/50 transition-all duration-500 hover:scale-[1.01] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Download className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl md:text-2xl font-bold text-blue-400">
                  {language === 'ro' ? 'Exportă Progresul' : 'Export Progress'}
                </h3>
              </div>

              <div className="space-y-6">
                {/* Input pentru nume */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4" />
                    {language === 'ro' ? 'Numele Cursantului' : 'Student Name'}
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={language === 'ro' ? 'Introdu numele tău...' : 'Enter your name...'}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 hover:bg-gray-700/50 transition-all duration-300"
                  />
                </div>

                {/* Buton export */}
                <button
                  onClick={exportToPDF}
                  disabled={!studentName.trim()}
                  className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform flex items-center justify-center gap-3 ${
                    studentName.trim()
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-blue-500/50'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-5 h-5" />
                  {language === 'ro' ? 'Exportă PDF' : 'Export PDF'}
                </button>

                {!studentName.trim() && (
                  <p className="text-sm text-gray-500 italic">
                    {language === 'ro' 
                      ? '💡 Adaugă numele tău pentru a exporta raportul în format PDF' 
                      : '💡 Add your name to export the report as PDF'}
                  </p>
                )}

                <div className="pt-4 border-t border-gray-700/50">
                  <p className="text-xs text-gray-400">
                    {language === 'ro'
                      ? '📄 PDF-ul va conține toate principiile, progresul tău actual, numele și data exportului.'
                      : '📄 The PDF will contain all principles, your current progress, name and export date.'}
                  </p>
                </div>
              </div>
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
