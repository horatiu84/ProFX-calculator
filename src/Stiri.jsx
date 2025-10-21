import React, { useState, useEffect } from "react";
import NewsCard from "./components/NewsCard";
import NewsModal from "./components/NewsModal";
import { newsArticles } from "./data/newsData";
import { useLanguage } from "./contexts/LanguageContext";

const Stiri = () => {
  const { language, translations } = useLanguage();
  const t = translations.stiri;
  
  const [selectedNews, setSelectedNews] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Helper function pentru a obține textul în limba corectă
  const getLocalizedField = (field) => {
    if (typeof field === 'object' && field !== null) {
      return field[language] || field.ro;
    }
    return field;
  };

  useEffect(() => {
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const newsId = urlParams.get('stire');
      
      if (newsId) {
        const news = newsArticles.find(article => article.id === parseInt(newsId));
        if (news) {
          setSelectedNews(news);
        }
      }
    };

    checkUrlParams();

    const handlePopState = () => {
      checkUrlParams();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleCopyLink = (newsId) => {
    const url = `${window.location.origin}${window.location.pathname}?stire=${newsId}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Eroare la copierea linkului:', err);
    });
  };

  const handleCloseModal = () => {
    setSelectedNews(null);
    window.history.pushState({}, '', window.location.pathname);
  };

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
          🔥 {t.importantBadge}
        </span>
      );
    }
    return null;
  };

  return (
    <div key={language} className="min-h-screen text-white p-3 sm:p-6 animate-language-change">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 text-center hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-3">
                <span className="text-4xl md:text-5xl">📰</span>
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  {t.pageTitle}
                </span>
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                {t.pageSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((news) => (
            <NewsCard 
              key={news.id} 
              news={news} 
              onSelect={setSelectedNews}
              getCategoryColor={getCategoryColor}
              getImportanceBadge={getImportanceBadge}
              getLocalizedField={getLocalizedField}
            />
          ))}
        </div>

        {newsArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-gray-400 text-lg">
              {t.noNews}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {t.comeBackSoon}
            </p>
          </div>
        )}

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

      {selectedNews && (
        <NewsModal 
          news={selectedNews} 
          onClose={handleCloseModal}
          handleCopyLink={handleCopyLink}
          copySuccess={copySuccess}
          getCategoryColor={getCategoryColor}
          getImportanceBadge={getImportanceBadge}
          getLocalizedField={getLocalizedField}
        />
      )}
    </div>
  );
};

export default Stiri;
