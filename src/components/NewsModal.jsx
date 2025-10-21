import React, { useState, useRef, useEffect } from "react";
import FormularComentarii from "./FormularComentarii";
import ListaComentarii from "./ListaComentarii";
import { useLanguage } from "../contexts/LanguageContext";

const NewsModal = ({ news, onClose, handleCopyLink, copySuccess, getCategoryColor, getImportanceBadge, getLocalizedField }) => {
  const { translations } = useLanguage();
  const t = translations.stiri;
  
  const [showComments, setShowComments] = useState(false);
  const commentsRef = useRef(null);
  const modalRef = useRef(null);
  const modalContainerRef = useRef(null);

  // Scroll la modal când se deschide
  useEffect(() => {
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

  // Funcție pentru procesarea conținutului cu bold
  const renderContent = (content) => {
    const localizedContent = getLocalizedField(content);
    return localizedContent.split('\n').map((paragraph, index) => {
      // Handle bold text as headings (full line bold)
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="text-xl font-bold text-amber-400 mt-6 mb-3">
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        );
      }
      
      // Handle bullet points
      if (paragraph.startsWith('•')) {
        // Process bold within bullet points
        const parts = paragraph.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className="text-gray-300 leading-relaxed mb-2 pl-4">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={i} className="font-bold text-white">
                    {part.replace(/\*\*/g, '')}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      }
      
      // Regular paragraphs with inline bold support
      if (paragraph.trim()) {
        // Split by bold markers **text**
        const parts = paragraph.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className="text-gray-300 leading-relaxed mb-4">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={i} className="font-bold text-white">
                    {part.replace(/\*\*/g, '')}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      }
      return null;
    });
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
              alt={getLocalizedField(news.title)}
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
                {t.categories[news.category] || news.category}
              </span>
              {getImportanceBadge(news.importance)}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <span>📅 {getLocalizedField(news.date)}</span>
              <span>•</span>
              <span>✍️ {t.author}: {getLocalizedField(news.author)}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-6">
              {getLocalizedField(news.title)}
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
                  {copySuccess ? t.linkCopied : t.copyLink}
                </span>
              </button>
            </div>

            {/* Article content */}
            <div className="prose prose-invert max-w-none">
              {renderContent(news.content)}
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
                    {showComments ? t.hideComments : t.showComments}
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
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
