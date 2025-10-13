import React, { useState } from "react";

const Stiri = () => {
  const [selectedNews, setSelectedNews] = useState(null);

  // Array cu știrile - poate fi extins în viitor
  const newsArticles = [
    {
      id: 1,
      title: "Aurul depășește 4.100$ pe uncie - un nou record istoric!",
      date: "13 Octombrie 2025",
      category: "Metale Prețioase",
      image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80",
      excerpt: "Piața metalelor prețioase a luat din nou foc! Luni, prețul aurului a urcat cu peste 2%, atingând un nou maxim istoric...",
      content: `Piața metalelor prețioase a luat din nou foc! 
Luni, prețul aurului a urcat cu peste 2%, atingând un nou maxim istoric de peste 4.100 dolari pe uncie.

**Ce a determinat această creștere spectaculoasă?**

În principal, tensiunile comerciale dintre Statele Unite și China, care s-au accentuat după ce președintele american Donald Trump a anunțat noi tarife de 100% pentru importurile chineze. Decizia vine ca reacție la restricțiile impuse de Beijing asupra exporturilor de pământuri rare – materiale esențiale pentru industria tehnologică.

În astfel de momente, investitorii tind să caute „active de refugiu", adică instrumente considerate mai sigure în perioade de instabilitate. Iar aurul este, de secole, cel mai cunoscut dintre ele.

**Pe lângă aur, și alte metale prețioase au înregistrat creșteri:**

• **Argintul:** +3,67%, până la 51,99 $/uncie
• **Platina:** +2,53%, până la 1.662,33 $/uncie
• **Paladiul:** +3,06%, până la 1.453,59 $/uncie

**Această evoluție confirmă un lucru simplu, dar important:**
👉 Când piețele devin incerte, investitorii caută stabilitate.

Aurul nu e doar un metal strălucitor, ci și un barometru al încrederii economice globale.`,
      tags: ["Aur", "XAUUSD", "Metale", "Trading"],
      author: "Echipa ProFX",
      importance: "high" // high, medium, low
    },
    // ... mai multe știri aici în viitor
  ];

  const getCategoryColor = (category) => {
    const colors = {
      "Metale Prețioase": "from-amber-400 to-yellow-600",
      "Forex": "from-blue-400 to-blue-600",
      "Cripto": "from-purple-400 to-purple-600",
      "Acțiuni": "from-green-400 to-green-600",
      "Economie": "from-red-400 to-red-600",
    };
    return colors[category] || "from-gray-400 to-gray-600";
  };

  const getImportanceBadge = (importance) => {
    if (importance === "high") {
      return (
        <span className="px-2 py-1 bg-red-500/20 border border-red-400/50 text-red-400 text-xs font-bold rounded-full uppercase flex items-center gap-1">
          🔥 Important
        </span>
      );
    }
    return null;
  };

  const NewsCard = ({ news }) => (
    <div
      onClick={() => setSelectedNews(news)}
      className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(news.category)} text-white text-xs font-bold rounded-full shadow-lg`}>
            {news.category}
          </span>
        </div>

        {/* Importance badge */}
        {news.importance === "high" && (
          <div className="absolute top-4 right-4">
            {getImportanceBadge(news.importance)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-6 z-10">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span>📅 {news.date}</span>
          <span>•</span>
          <span>✍️ {news.author}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300 line-clamp-2">
          {news.title}
        </h3>

        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {news.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {news.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-800/50 border border-gray-600/50 text-gray-300 text-xs rounded-lg hover:border-amber-400/50 transition-colors duration-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-amber-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
            Citește mai mult →
          </span>
        </div>
      </div>
    </div>
  );

  const NewsModal = ({ news, onClose }) => (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <div className="flex items-start justify-center min-h-screen py-8">
        <div
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-4xl w-full shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Image */}
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-900/80 hover:bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-white text-xl transition-all duration-300 hover:scale-110"
            >
              ×
            </button>

            {/* Category and Importance */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(news.category)} text-white text-xs font-bold rounded-full shadow-lg`}>
                {news.category}
              </span>
              {getImportanceBadge(news.importance)}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <span>📅 {news.date}</span>
              <span>•</span>
              <span>✍️ {news.author}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-6">
              {news.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {news.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800/50 border border-gray-600/50 text-gray-300 text-sm rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Article content */}
            <div className="prose prose-invert max-w-none">
              {news.content.split('\n').map((paragraph, index) => {
                // Handle bold text
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-xl font-bold text-amber-400 mt-6 mb-3">
                      {paragraph.replace(/\*\*/g, '')}
                    </h3>
                  );
                }
                // Handle bullet points
                if (paragraph.startsWith('•')) {
                  return (
                    <p key={index} className="text-gray-300 leading-relaxed mb-2 pl-4">
                      {paragraph}
                    </p>
                  );
                }
                // Regular paragraphs
                if (paragraph.trim()) {
                  return (
                    <p key={index} className="text-gray-300 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>

            {/* Bottom info card */}
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
              <p className="text-sm text-gray-300 text-center">
                💡 <span className="font-semibold">Tip ProFX:</span> Urmărește constant știrile economice pentru a înțelege mai bine mișcările pieței!
              </p>
            </div>

            {/* Close button at bottom */}
            <div className="mt-6">
              <button
                onClick={onClose}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all duration-200 border border-gray-600"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 text-center hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-3">
                📰 Știri & Noutăți
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Rămâi la curent cu cele mai importante evenimente din lumea financiară și piețele globale
              </p>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>

        {/* Empty state pentru viitor */}
        {newsArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-gray-400 text-lg">
              Momentan nu există știri disponibile.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Revino curând pentru cele mai noi actualizări!
            </p>
          </div>
        )}

        {/* Info card */}
        <div className="mt-8 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="text-lg font-bold text-amber-400 mb-2">
                De ce sunt importante știrile economice?
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Știrile și evenimentele macroeconomice au un impact direct asupra piețelor financiare. 
                Înțelegerea contextului economic te ajută să iei decizii mai informate în trading și să 
                anticipezi mișcările majore ale pieței. Urmărește constant această secțiune pentru a 
                rămâne la curent!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for full article */}
      {selectedNews && (
        <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </div>
  );
};

export default Stiri;
