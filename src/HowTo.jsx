import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useLanguage } from './contexts/LanguageContext';

// Import CSS-urile necesare
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// -----------------------------
// PDFViewerModal (folosește createPortal)
// -----------------------------
const PDFViewerModal = ({ isOpen, onClose, pdfTitle, pdfFile, translations }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const t = translations;

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Thumbnails
      defaultTabs[1], // Bookmarks
    ],
  });

  // Închide modal cu Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Previne scroll-ul pe body când modal-ul e deschis
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setPdfError(null); // reset error when opening
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = pdfFile;
      link.download = (pdfTitle || 'document').replace(/\s+/g, '_') + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert(t.downloadError);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen((s) => !s);
  };

  const handleDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    setPdfError(t.errorMessage);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative flex flex-col w-full h-[90%] max-w-6xl max-h-[90vh] rounded-xl overflow-hidden transition-all duration-300 shadow-2xl
          ${isFullscreen ? 'w-screen h-screen rounded-none' : 'mx-4'}`}
        role="dialog"
        aria-modal="true"
        aria-label={pdfTitle || 'PDF Viewer'}
      >
        {/* Header */}
        <div className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">📖</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white truncate max-w-[40ch]">{pdfTitle}</h3>
              <p className="text-sm text-gray-400">{t.howTo.pdfViewer}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={isFullscreen ? t.fullscreenExit : t.fullscreen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0-6l-6 6M21 3l-6 6m0-6l6 6M3 21l6-6m0 6l-6-6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l6 6M20 8V4m0 0h-4m4 0l-6 6M4 16v4m0 0h4m-4 0l6-6M20 16v4m0 0h-4m4 0l-6-6" />
                )}
              </svg>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 px-4 py-2 rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t.howTo.download}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={t.howTo.close}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 bg-gray-900/50 backdrop-blur-sm overflow-auto">
          <div className="h-full">
            {pdfError ? (
              /* Error State */
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.howTo.errorLoading}</h3>
                  <p className="text-gray-400 mb-4 max-w-md">{pdfError}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>{t.howTo.errorVerify}</p>
                    <p className="font-mono bg-gray-800 p-2 rounded">{pdfFile}</p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-amber-400 transition-colors"
                  >
                    {t.howTo.retryButton}
                  </button>
                </div>
              </div>
            ) : (
              /* PDF Viewer */
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div
                  className="h-full pdf-viewer-dark"
                  style={{
                    backgroundColor: '#1f2937',
                    '--rpv-core-primary-color': '#f59e0b',
                    '--rpv-core-text-primary-color': '#ffffff',
                    '--rpv-core-text-secondary-color': '#d1d5db',
                    '--rpv-core-background-color': '#1f2937',
                    '--rpv-core-secondary-color': '#374151',
                    '--rpv-core-border-color': '#4b5563',
                    '--rpv-core-menu-background-color': '#374151',
                    '--rpv-core-menu-text-color': '#ffffff',
                  }}
                >
                  <Viewer
                    fileUrl={pdfFile}
                    plugins={[defaultLayoutPluginInstance]}
                    theme="dark"
                    onDocumentLoadError={handleDocumentLoadError}
                    renderError={(error) => (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center p-8">
                          <div className="text-6xl mb-4">❌</div>
                          <h3 className="text-xl font-bold text-white mb-2">{t.howTo.invalidPDF}</h3>
                          <p className="text-gray-400">{t.howTo.invalidPDFMessage}</p>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </Worker>
            )}
          </div>
        </div>


      </div>
    </div>,
    document.body
  );
};

// -----------------------------
// HowTo component (pagina cu ghiduri)
// -----------------------------
const HowTo = () => {
  const { language, translations } = useLanguage();
  const t = translations;
  const [downloadingItem, setDownloadingItem] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const handleViewPDF = (guide) => {
    setActiveModal(guide);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleDownload = (fileName, displayName) => {
    setDownloadingItem(fileName);

    setTimeout(() => {
      try {
        const link = document.createElement('a');
        link.href = fileName;
        link.download = displayName.replace(/\s+/g, '_') + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download error:', error);
        alert(t.howTo.downloadError);
      }
      setDownloadingItem(null);
    }, 1500);
  };

  // Verifică dacă PDF-urile sunt disponibile (nefolosit în UI dar util)
  const checkPDFAvailability = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  const guides = [
    {
      id: 1,
      title: t.howTo.guide1Title,
      description: t.howTo.guide1Description,
      fileName: '/pdfs/Ghid conectare MT5.pdf',
      pdfFile: '/pdfs/Ghid conectare MT5.pdf',
      icon: '🔗',
      color: 'from-blue-600 to-cyan-600',
      hoverColor: 'from-blue-500 to-cyan-500',
      features: [t.howTo.guide1Feature1, t.howTo.guide1Feature2, t.howTo.guide1Feature3],
      difficulty: t.howTo.difficultyBeginner,
    },
    {
      id: 2,
      title: t.howTo.guide2Title,
      description: t.howTo.guide2Description,
      fileName: '/pdfs/Ghid folosire mt5.pdf',
      pdfFile: '/pdfs/Ghid folosire mt5.pdf',
      icon: '📱',
      color: 'from-emerald-600 to-teal-600',
      hoverColor: 'from-emerald-500 to-teal-500',
      features: [t.howTo.guide2Feature1, t.howTo.guide2Feature2, t.howTo.guide2Feature3],
      difficulty: t.howTo.difficultyBeginner,
    },
    {
      id: 3,
      title: t.howTo.guide3Title,
      description: t.howTo.guide3Description,
      fileName: '/pdfs/Dictionar ProFX.pdf',
      pdfFile: '/pdfs/Dictionar ProFX.pdf',
      icon: '📖',
      color: 'from-purple-600 to-indigo-600',
      hoverColor: 'from-purple-500 to-indigo-500',
      features: [t.howTo.guide3Feature1, t.howTo.guide3Feature2, t.howTo.guide3Feature3],
      difficulty: t.howTo.difficultyAll,
    },
  ];

  const getDifficultyColor = (difficulty) => {
    if (difficulty === t.howTo.difficultyBeginner) {
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    } else if (difficulty === t.howTo.difficultyIntermediate) {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    } else if (difficulty === t.howTo.difficultyAdvanced) {
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    } else {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div key={language} className="min-h-screen p-6 animate-language-change">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
      

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t.howTo.mainTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">{t.howTo.mainTitleHighlight}</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t.howTo.subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-2">{t.howTo.stat1Value}</div>
            <div className="text-gray-300">{t.howTo.stat1Label}</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-2">{t.howTo.stat2Value}</div>
            <div className="text-gray-300">{t.howTo.stat2Label}</div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-2">{t.howTo.stat3Value}</div>
            <div className="text-gray-300">{t.howTo.stat3Label}</div>
          </div>
        </div>

        {/* Ghiduri Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <div
              key={guide.id}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 
                       hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl 
                       hover:shadow-amber-500/10 overflow-hidden"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${guide.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-xl">{guide.icon}</span>
                  </div>

                  <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                    {guide.difficulty}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                  {guide.title}
                </h3>

                <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                  {guide.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {guide.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded-lg text-xs border border-gray-700/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {/* View PDF Button */}
                  <button
                    onClick={() => handleViewPDF(guide)}
                    className="flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 
                             flex items-center justify-center space-x-2 group-hover:shadow-lg
                             bg-gray-700/80 text-gray-200 hover:bg-gray-600/80 border border-gray-600/50 hover:border-gray-500/50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{t.howTo.viewButton}</span>
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(guide.pdfFile, guide.title)}
                    disabled={downloadingItem === guide.fileName}
                    className={`
                      flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 
                      flex items-center justify-center space-x-2 group-hover:shadow-lg
                      ${downloadingItem === guide.fileName
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : `bg-gradient-to-r ${guide.color} hover:${guide.hoverColor} text-white hover:scale-[1.02] active:scale-95 shadow-lg`
                      }
                    `}
                  >
                    {downloadingItem === guide.fileName ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                        <span>{t.howTo.downloadingButton}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{t.howTo.downloadButton}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-400/5 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">{t.howTo.tipsTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">{t.howTo.tip1Title}</h4>
                  <p className="text-gray-400 text-sm">{t.howTo.tip1Description}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">{t.howTo.tip2Title}</h4>
                  <p className="text-gray-400 text-sm">{t.howTo.tip2Description}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">{t.howTo.tip3Title}</h4>
                  <p className="text-gray-400 text-sm">{t.howTo.tip3Description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {activeModal && (
        <PDFViewerModal
          isOpen={!!activeModal}
          onClose={handleCloseModal}
          pdfTitle={activeModal.title}
          pdfFile={activeModal.pdfFile}
          translations={t}
        />
      )}
    </div>
  );
};

export default HowTo;
