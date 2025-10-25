import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { db } from "./db/FireBase";
import { doc, getDoc } from "firebase/firestore";
import {
  BookOpen,
  Download,
  Video,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";
import FormularInscriere from "./components/FormularInscriere";
import { useLanguage } from './contexts/LanguageContext';

// Import CSS-urile necesare pentru PDF viewer
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PASSWORD_KEY = "profx_educatie_access";

// -----------------------------
// PDFViewerModal (folosește createPortal)
// -----------------------------
const PDFViewerModal = ({ isOpen, onClose, pdfTitle, pdfFile }) => {
  const { translations: t, language } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfError, setPdfError] = useState(null);

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
      alert(t.educatie.downloadError);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen((s) => !s);
  };

  const handleDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    setPdfError(t.educatie.pdfLoadErrorMessage);
  };

  if (!isOpen) return null;

  return createPortal(
    <div key={language} className="fixed inset-0 z-50 flex items-center justify-center animate-language-change">
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
              <span className="text-sm font-bold text-gray-900">📚</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white truncate max-w-[40ch]">{pdfTitle}</h3>
              <p className="text-sm text-gray-400">{t.educatie.pdfViewerTitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={isFullscreen ? t.educatie.fullscreenExit : t.educatie.fullscreen}
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
              <span>{t.educatie.download}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={t.educatie.close}
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
                  <h3 className="text-xl font-bold text-white mb-2">{t.educatie.pdfLoadError}</h3>
                  <p className="text-gray-400 mb-4 max-w-md">{pdfError}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>{t.educatie.checkFileLocation}</p>
                    <p className="font-mono bg-gray-800 p-2 rounded">{pdfFile}</p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-amber-400 transition-colors"
                  >
                    {t.educatie.retry}
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
                          <h3 className="text-xl font-bold text-white mb-2">{t.educatie.invalidPdf}</h3>
                          <p className="text-gray-400">{t.educatie.invalidPdfMessage}</p>
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

const Educatie = () => {
  const { translations: t, language } = useLanguage();
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [correctPassword, setCorrectPassword] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const docRef = doc(db, "settings", "educatieAccess");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const storedPassword = docSnap.data().password;
          setCorrectPassword(storedPassword);
          const savedPassword = sessionStorage.getItem(PASSWORD_KEY);
          if (savedPassword === storedPassword) {
            setAccessGranted(true);
          }
        } else {
          setError(t.educatie.documentNotFound);
        }
      } catch (error) {
        console.error("Eroare la accesarea parolei:", error);
        setError(t.educatie.verificationError);
      }
    };

    fetchPassword();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      sessionStorage.setItem(PASSWORD_KEY, correctPassword);
      setAccessGranted(true);
      setError("");
    } else {
      setError(t.educatie.wrongPassword);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PASSWORD_KEY);
    setAccessGranted(false);
    setPassword("");
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  const handleViewPDF = (pdfData) => {
    setActiveModal(pdfData);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  if (!accessGranted) {
    return (
      <div key={language} className="min-h-screen w-full px-6 py-12 flex items-start justify-center animate-language-change">
        <div className="group relative max-w-md w-full bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-400/30 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">{t.educatie.accessTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t.educatie.passwordLabel}</label>
                <input type="password" placeholder={t.educatie.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/40 transition" />
              </div>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full p-3 rounded-xl bg-blue-600/80 hover:bg-blue-500/80 text-white font-semibold transition-colors">{t.educatie.accessButton}</button>
            </form>
            <button onClick={toggleSignup} className="w-full p-3 rounded-xl bg-emerald-600/80 hover:bg-emerald-500/80 text-white font-semibold transition-colors mb-4">
              {showSignup ? t.educatie.signupButtonHide : t.educatie.signupButtonShow}
            </button>
            {showSignup && (
              <div className="mt-4 bg-gray-800/40 border border-gray-700/40 rounded-xl p-4">
                <FormularInscriere />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={language} className="max-w-6xl mx-auto p-6 animate-language-change">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-2xl mb-6 shadow-xl">
          <span className="text-4xl">🎓</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t.educatie.mainTitle} <span className="text-amber-400">{t.educatie.mainTitleHighlight}</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {t.educatie.mainSubtitle}
        </p>
      </div>

      {/* Videos Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mr-4 hover:bg-amber-400/20 transition-all duration-300">
              <Video className="w-6 h-6 text-amber-400" />
            </div>
              <h2 className="text-xl font-bold text-white">
                {t.educatie.mt5VideoTitle}
              </h2>
            </div>
            <div className="text-center">
              <a
                href="https://www.youtube.com/watch?v=WwX5oC1dKIw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Video className="w-5 h-5 mr-2" />
                {t.educatie.openYoutube}
              </a>
            </div>
          </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mr-4 hover:bg-amber-400/20 transition-all duration-300">
              <Video className="w-6 h-6 text-amber-400" />
            </div>
              <h2 className="text-xl font-bold text-white">
                {t.educatie.trailingStopTitle}
              </h2>
            </div>
            <video controls className="w-full rounded-xl shadow-lg">
              <source src="/trailing stop.mp4" type="video/mp4" />
              {t.educatie.browserNoSupport}
            </video>
          </div>
        </div>

      {/* Mobile Videos */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center mr-3 hover:bg-amber-400/20 transition-all duration-300">
              <Video className="w-5 h-5 text-amber-400" />
            </div>
            {t.educatie.androidTitle}
          </h2>
            <video
              controls
              className="w-full max-w-xl mx-auto aspect-video rounded-xl shadow-lg"
            >
              <source src="/tudor android.mp4" type="video/mp4" />
              {t.educatie.browserNoSupport}
            </video>
          </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center mr-3 hover:bg-amber-400/20 transition-all duration-300">
              <Video className="w-5 h-5 text-amber-400" />
            </div>
            {t.educatie.iphoneTitle}
          </h2>
            <video
              controls
              className="w-full max-w-xl mx-auto aspect-video rounded-xl shadow-lg"
            >
              <source src="/tudor iphone.mp4" type="video/mp4" />
              {t.educatie.browserNoSupport}
            </video>
          </div>
        </div>

      {/* Course Downloads */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 mb-12 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mr-4 hover:bg-amber-400/20 transition-all duration-300">
            <BookOpen className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t.educatie.lessonsTitle}</h2>
        </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                title: t.educatie.lesson1,
                file: "/Curs ProFX - Lectia 1.pdf",
              },
              {
                title: t.educatie.lesson2,
                file: "/Curs ProFX - Lectia 2.pdf",
              },
              {
                title: t.educatie.lesson3,
                file: "/Curs ProFX - Lectia 3.pdf",
              },
              {
                title: t.educatie.lesson4,
                file: "/Curs ProFX - Lectia 4.pdf",
              },
              {
                title: t.educatie.lesson5,
                file: "/Curs ProFX - Lectia 5.pdf",
              },
            ].map((lesson, idx) => (
            <div
              key={idx}
              className="bg-gray-700/50 rounded-2xl border border-gray-600 hover:bg-gray-700/70 transition-all duration-200 transform hover:scale-105 group p-6"
            >
              <h3 className="text-white font-medium mb-4 group-hover:text-amber-400">
                {lesson.title}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {/* View PDF Button */}
                <button
                  onClick={() => handleViewPDF(lesson)}
                  className="flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 
                           flex items-center justify-center space-x-2 group-hover:shadow-lg
                           bg-gray-600/80 text-gray-200 hover:bg-gray-500/80 border border-gray-500/50 hover:border-gray-400/50"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t.educatie.viewButton}</span>
                </button>

                {/* Download Button */}
                <a
                  href={lesson.file}
                  download
                  className="flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 
                           flex items-center justify-center space-x-2 group-hover:shadow-lg
                           bg-amber-500 hover:bg-amber-400 text-gray-900 hover:scale-[1.02] active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.educatie.downloadButton}</span>
                </a>
              </div>
            </div>
            ))}
          </div>
        </div>

      {/* Additional Resources */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 mb-12 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mr-4 hover:bg-amber-400/20 transition-all duration-300">
            <Download className="w-6 h-6 text-amber-400" />
          </div>
          {t.educatie.resourcesTitle}
        </h2>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                title: t.educatie.dictionary,
                file: "/Dictionar ProFX.pdf",
                iconColor: "text-green-400",
              },
              {
                title: t.educatie.mt5MobileGuide,
                file: "/Ghid folosire mt5.pdf",
                iconColor: "text-purple-400",
              },
              {
                title: t.educatie.mt5ConnectionGuide,
                file: "/Ghid conectare MT5.pdf",
                iconColor: "text-orange-400",
              },
              {
                title: t.educatie.candleFormations,
                file: "/ProFX - Introducere-in-Formatiile-de-Lumanari ( Mitica ).pdf",
                iconColor: "text-cyan-400",
              },
            ].map((resource, idx) => (
            <div
              key={idx}
              className="bg-gray-700/50 rounded-2xl border border-gray-600 hover:bg-gray-700/70 hover:scale-105 transition-all duration-200 group p-6"
            >
              <div className="flex items-center mb-4">
                <Download
                  className="w-6 h-6 text-amber-400 mr-4 group-hover:text-white"
                />
                <span className="text-white font-medium group-hover:text-gray-200">
                  {resource.title}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {/* View PDF Button */}
                <button
                  onClick={() => handleViewPDF(resource)}
                  className="flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 
                           flex items-center justify-center space-x-2 group-hover:shadow-lg
                           bg-gray-600/80 text-gray-200 hover:bg-gray-500/80 border border-gray-500/50 hover:border-gray-400/50"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t.educatie.viewButton}</span>
                </button>

                {/* Download Button */}
                <a
                  href={resource.file}
                  download
                  className="flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 
                           flex items-center justify-center space-x-2 group-hover:shadow-lg
                           bg-amber-500 hover:bg-amber-400 text-gray-900 hover:scale-[1.02] active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.educatie.downloadButton}</span>
                </a>
              </div>
            </div>
            ))}
          </div>
        </div>

      {/* Logout Button */}
      <div className="text-center">
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-6 py-3 bg-gray-800/50 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-gray-200 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t.educatie.logoutButton}
        </button>
      </div>

        {/* PDF Viewer Modal */}
        {activeModal && (
          <PDFViewerModal
            isOpen={!!activeModal}
            onClose={handleCloseModal}
            pdfTitle={activeModal.title}
            pdfFile={activeModal.file}
          />
        )}
    </div>
  );
};

export default Educatie;
