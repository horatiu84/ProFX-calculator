import React, { useState, useRef, useEffect } from "react";
import FormularComentarii from "./components/FormularComentarii";
import ListaComentarii from "./components/ListaComentarii";

// Array cu știrile - definit în afara componentei pentru stabilitate
const newsArticles = [
    {
      id: 3,
      title: "Aurul trece de 4.200$: scenariul bullish se confirmă!",
      date: "15 Octombrie 2025",
      category: "Metale Prețioase",
      image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80",
      excerpt: "Cu doar câteva ore în urmă scriam că aurul se apropie de 4.200$, iar acum acest prag a fost depășit! XAU/USD a atins 4.218$ în sesiunea europeană...",
      content: `**De la anticipare la confirmare**

Cu doar câteva ore în urmă scriam că aurul se apropie periculos de nivelul istoric de 4.200 de dolari pe uncie — iar acum, acest prag a fost depășit. 

În sesiunea europeană din **15 octombrie 2025**, cotarea **XAU/USD** a urcat rapid până la **4.218 dolari**, un nou maxim absolut în istoria pieței metalelor prețioase.

**De ce continuă aurul să explodeze?**

Mișcarea ascendentă a venit exact după ce analiștii avertizau că „drumul cel mai ușor pentru aur rămâne în sus" — și realitatea le dă dreptate.

**Trei factori cheie:**

• **Așteptările tot mai mari privind reducerile de dobândă ale Rezervei Federale**, care scad randamentele obligațiunilor și fac aurul mai atractiv

• **Escaladarea tensiunilor comerciale SUA–China** și incertitudinile legate de posibila prelungire a blocajului guvernamental american

• **Cererea record din partea băncilor centrale**, în special Asia și Orientul Mijlociu, care continuă să își mărească rezervele

**Reacția Bank of America**

Într-un moment simbolic, **Bank of America** și-a reafirmat proiecția îndrăzneață:

📊 **Target 2026: 5.000 USD/uncie**
📈 **Medie anuală: ~4.400 USD**

Potrivit analizei, dezechilibrele fiscale, datoria publică uriașă și politicile monetare relaxate vor menține aurul pe o traiectorie ascendentă în următorii ani.

**Impactul în România**

Și în România, efectele se văd clar:

🇷🇴 **Gramul de aur: 589 lei** - nou record istoric conform BNR

📊 Magazinele specializate și platformele de investiții raportează un **volum de tranzacții dublu** față de media lunii septembrie.

**Ce urmează?**

**Analiza tehnică indică un scenariu optimist:**

✅ **Rezistențe următoare:** 4.280–4.300 USD
✅ **Support principal:** 4.100 USD
✅ **Trend:** Super-bullish confirmat

O menținere peste 4.200 USD ar putea deschide calea spre noi maxime istorice, în timp ce o eventuală corecție spre 4.100 USD ar putea fi tratată de investitori ca o nouă oportunitate de acumulare.

**Concluzie**

Aurul a confirmat astăzi ceea ce piața anticipa zilnic de aproape o săptămână: **intrarea într-o nouă etapă „super-bullish"**. 

Cu factorii macroeconomici, geopolitici și monetari perfect aliniați, metalul prețios își consolidează titlul de **refugiu suprem** într-o lume financiară plină de incertitudini.

💡 **Pentru traderi:** Acest breakout peste 4.200$ este un semnal tehnic major. Monitorizați volumele și respectați întotdeauna managementul riscului!`,
      tags: ["Aur", "XAUUSD", "Fed", "Bank of America", "Metale"],
      author: "Echipa ProFX",
      importance: "high"
    },
    {
      id: 2,
      title: "Aurul explodează către 4.200$ - Bank of America prevede 5.000$!",
      date: "15 Octombrie 2025",
      category: "Metale Prețioase",
      image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80",
      excerpt: "Aurul a atins un nou maxim istoric de 4.190$ pe uncie, apropiindu-se de pragul psihologic de 4.200$. Instituții majore estimează 5.000$ pentru 2026...",
      content: `**Aurul a atins un nou maxim istoric!**

În dimineața zilei de 15 octombrie 2025, XAUUSD a depășit pragul de **4.190 USD pe uncie**, apropiindu-se rapid de **4.200 USD** — un nivel fără precedent în istoria pieței metalelor prețioase.

**De ce explodează aurul acum?**

Trei factori principali alimentează această rally impresionant:

**1. Anticiparea reducerii ratelor dobânzilor de către Fed**
• Scade atractivitatea obligațiunilor
• Investitorii caută alternative mai profitabile
• Aurul devine mai atractiv ca activ de refugiu

**2. Tensiuni comerciale SUA-China în creștere**
• Războiul comercial se intensifică
• Incertitudine pe piețele globale
• Investitorii fug spre siguranță

**3. Fluxuri record către active de refugiu**
• Context geopolitic instabil
• Incertitudini economice globale
• Cerere instituțională masivă pentru aur

**Ce spun experții?**

**Bank of America** a revizuit estimările pentru prețul aurului:

📊 **Target 2026: 5.000 USD/uncie**

Această prognoză reflectă optimismul pe termen mediu al analiștilor, care văd în aur unul dintre cele mai solide investiții în contextul economic actual.

**Celelalte metale prețioase urcă și ele:**

• **Argintul** înregistrează creșteri puternice, susținute de cererea industrială crescută
• **Platina și paladiul** beneficiază de interesul investitorilor pentru întregul sector al metalelor prețioase

**Ce urmează?**

✅ **Scenariul bull:** O consolidare peste 4.200$ ar putea deschide calea către noi maxime istorice

⚠️ **Riscuri:** Corecții temporare sunt posibile, piața fiind sensibilă la:
• Deciziile Rezervei Federale
• Datele despre inflație
• Evoluția tensiunilor comerciale globale

**Concluzie:** Aurul confirmă din nou rolul său de "activ de refugiu suprem" în perioade de incertitudine. Pentru traderi, este esențial să monitorizeze atent nivelul de 4.200$ - un breakout confirmat ar putea semnala un nou val de creștere!`,
      tags: ["Aur", "XAUUSD", "Fed", "Bank of America", "Metale"],
      author: "Echipa ProFX",
      importance: "high"
    },
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

const Stiri = () => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Detectează dacă există un link de știre în URL la încărcare și la schimbări
  useEffect(() => {
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const newsId = urlParams.get('stire');
      
      console.log('Checking URL params:', newsId); // Debug
      
      if (newsId) {
        const news = newsArticles.find(article => article.id === parseInt(newsId));
        console.log('Found news:', news); // Debug
        if (news) {
          setSelectedNews(news);
        }
      }
    };

    // Check imediat la montare
    checkUrlParams();

    // Listener pentru schimbări în URL (back/forward browser)
    const handlePopState = () => {
      checkUrlParams();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Funcție pentru copierea linkului
  const handleCopyLink = (newsId) => {
    const url = `${window.location.origin}${window.location.pathname}?stire=${newsId}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(err => {
      console.error('Eroare la copierea linkului:', err);
    });
  };

  // Funcție pentru închiderea modalului și curățarea URL-ului
  const handleCloseModal = () => {
    setSelectedNews(null);
    // Curăță URL-ul de parametrii
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
          🔥 Important
        </span>
      );
    }
    return null;
  };

  const NewsCard = ({ news }) => {
    return (
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
  };

  const NewsModal = ({ news, onClose }) => {
    const [showComments, setShowComments] = useState(false);
    const commentsRef = useRef(null);
    const modalRef = useRef(null);
    const modalContainerRef = useRef(null);

    // Scroll la modal când se deschide
    React.useEffect(() => {
      if (modalContainerRef.current) {
        // Scroll smooth la containerul modalului când se montează
        modalContainerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, []);

    const handleToggleComments = (e) => {
      e.preventDefault();
      
      if (!showComments) {
        // Salvăm poziția curentă de scroll ÎNAINTE de a schimba state-ul
        const currentScroll = modalRef.current?.scrollTop || 0;
        
        setShowComments(true);
        
        // Folosim requestAnimationFrame pentru a rula după ce React face update
        requestAnimationFrame(() => {
          // Restaurăm imediat poziția de scroll
          if (modalRef.current) {
            modalRef.current.scrollTop = currentScroll;
          }
          
          // Apoi facem scroll smooth către comentarii
          setTimeout(() => {
            commentsRef.current?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest'
            });
          }, 100);
        });
      } else {
        setShowComments(false);
      }
    };

    return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div ref={modalContainerRef} className="flex items-center justify-center min-h-screen py-8">
        <div
          ref={modalRef}
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
            <div className="flex flex-wrap gap-2 mb-4">
              {news.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800/50 border border-gray-600/50 text-gray-300 text-sm rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Buton Copiază Link */}
            <div className="mb-6">
              <button
                onClick={() => handleCopyLink(news.id)}
                className="group relative px-4 py-2 bg-blue-500/10 border border-blue-400/30 text-blue-400 rounded-xl shadow-md transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-400/50 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/50 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="font-semibold text-sm">
                  {copySuccess ? '✓ Link copiat!' : 'Copiază link'}
                </span>
              </button>
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

            {/* Secțiune comentarii */}
            <div className="mt-8 space-y-6">
              <hr className="border-gray-700/50" />
              
              {/* Buton pentru afișare/ascundere comentarii */}
              <div className="flex justify-center">
                <button
                  onClick={handleToggleComments}
                  className="group relative px-6 py-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl shadow-md transition-all duration-300 hover:bg-gray-700/50 hover:border-amber-400/50 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400/50 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-300 ${showComments ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <span className="font-semibold">
                    {showComments ? 'Ascunde comentariile' : 'Vezi comentariile'}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-300 ${showComments ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Afișare comentarii și formular doar dacă showComments este true */}
              {showComments && (
                <div ref={commentsRef} className="space-y-6 animate-fadeIn">
                  {/* Afișare comentarii existente */}
                  <ListaComentarii newsId={news.id} />
                  
                  {/* Formular pentru adăugare comentariu */}
                  <FormularComentarii newsId={news.id} />
                </div>
              )}
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
  };

  return (
    <div className="min-h-screen text-white p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 text-center hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-3">
                <span className="text-4xl md:text-5xl">📰</span>
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Știri & Noutăți
                </span>
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
        <NewsModal 
          news={selectedNews} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Stiri;
