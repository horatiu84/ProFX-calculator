import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { db } from "./db/FireBase";
import { doc, getDoc } from "firebase/firestore";
import {
  BookOpen,
  Calculator,
  Download,
  Video,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import FormularInscriere from "./components/FormularInscriere";

// Import CSS-urile necesare pentru PDF viewer
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PASSWORD_KEY = "profx_educatie_access";

// -----------------------------
// PDFViewerModal (folosește createPortal)
// -----------------------------
const PDFViewerModal = ({ isOpen, onClose, pdfTitle, pdfFile }) => {
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
      alert('Eroare la descărcare. Verifică dacă fișierul există.');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen((s) => !s);
  };

  const handleDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    setPdfError('Nu s-a putut încărca PDF-ul. Verifică dacă fișierul există în folderul public/');
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
              <span className="text-sm font-bold text-gray-900">📚</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white truncate max-w-[40ch]">{pdfTitle}</h3>
              <p className="text-sm text-gray-400">Materiale Educative ProFX</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={isFullscreen ? 'Ieșire fullscreen' : 'Fullscreen'}
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
              <span>Descarcă</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Închide"
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
                  <h3 className="text-xl font-bold text-white mb-2">Eroare la încărcarea PDF-ului</h3>
                  <p className="text-gray-400 mb-4 max-w-md">{pdfError}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Verifică dacă fișierul există în:</p>
                    <p className="font-mono bg-gray-800 p-2 rounded">{pdfFile}</p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-amber-400 transition-colors"
                  >
                    Reîncearcă
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
                          <h3 className="text-xl font-bold text-white mb-2">Fișier PDF invalid</h3>
                          <p className="text-gray-400">Nu s-a putut procesa fișierul PDF.</p>
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
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");
  const [pipLotInput, setPipLotInput] = useState(0.01);
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
          setError("Documentul de acces nu a fost găsit.");
        }
      } catch (error) {
        console.error("Eroare la accesarea parolei:", error);
        setError("Eroare la verificarea parolei. Încearcă din nou.");
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
      setError("Parolă greșită. Încearcă din nou.");
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
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">
          Acces Materiale Educaționale ProFX
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Introdu parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Accesează
          </button>
        </form>
        <button
          onClick={toggleSignup}
          className="w-full mt-3 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {showSignup ? "Ascunde Înscriere" : "Înscrie-te"}
        </button>
        {showSignup && <FormularInscriere />}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-2xl mb-6 shadow-xl">
          <span className="text-4xl">🎓</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Materiale Educative <span className="text-amber-400">ProFX</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Descoperă cunoștințele fundamentale pentru trading și dezvoltă-ți abilitățile cu materialele noastre educative complete.
        </p>
      </div>

      {/* Pip Information Card */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 mb-12 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mr-4 hover:bg-amber-400/20 transition-all duration-300">
            <BarChart3 className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Ce sunt pipsii pe XAUUSD?
          </h2>
        </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Pipul este o unitate mică folosită pentru a măsura mișcarea
              prețului.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Pe XAUUSD (aur), un pip reprezintă o schimbare de{" "}
              <span className="text-amber-400 font-semibold">0.1</span> în
              prețul aurului.
            </p>
            <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
              <p className="text-amber-300">
                <strong>Exemplu:</strong> Dacă prețul aurului crește de la
                1980.00 la 1980.10, atunci s-a mișcat 1 pip.
              </p>
            </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
                <h3 className="text-xl font-bold text-white">
                  Valoarea unui pip
                </h3>
              </div>
              <p className="text-slate-300">
                Valoarea pipului variază în funcție de dimensiunea lotului
                tranzacționat.
              </p>
              <p className="text-slate-300">
                Un lot standard (1 lot) = 100 uncii de aur, iar valoarea unui
                pip pentru 1 lot este de{" "}
                <span className="text-green-400 font-semibold">10 USD</span>.
              </p>
            </div>
          </div>
        </div>

      {/* Pip Calculator */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 mb-12 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mr-4 hover:bg-amber-400/20 transition-all duration-300">
            <Calculator className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Calculator Pip</h2>
        </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
            <label className="block text-gray-300 font-medium mb-3">
              Introdu valoarea lotului:
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="w-full p-4 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50"
              value={pipLotInput}
              onChange={(e) =>
                setPipLotInput(parseFloat(e.target.value) || 0.01)
              }
            />
            <div className="mt-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
              <p className="text-amber-300 text-lg">
                Valoare pip:{" "}
                <span className="text-2xl font-bold text-white">
                  {(pipLotInput * 10).toFixed(2)} USD
                </span>
              </p>
            </div>
            </div>

            {/* Lot Size Table */}
            <div className="overflow-hidden rounded-xl border border-slate-600">
              <table className="w-full text-sm text-white">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="p-3 text-left font-semibold text-yellow-400">
                      Loturi
                    </th>
                    <th className="p-3 text-left font-semibold text-yellow-400">
                      Valoare pip
                    </th>
                    <th className="p-3 text-left font-semibold text-yellow-400">
                      10 pipsi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/50">
                  {[
                    ["0.01", "0.1 USD", "1 USD"],
                    ["0.05", "0.5 USD", "5 USD"],
                    ["0.10", "1 USD", "10 USD"],
                    ["0.20", "2 USD", "20 USD"],
                    ["0.50", "5 USD", "50 USD"],
                    ["1.00", "10 USD", "100 USD"],
                    ["1.25", "12.5 USD", "125 USD"],
                    ["1.50", "15 USD", "150 USD"],
                    ["1.75", "17.5 USD", "175 USD"],
                    ["2.00", "20 USD", "200 USD"],
                  ].map(([lot, value, example], idx) => (
                    <tr
                      key={idx}
                      className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="p-3 font-medium">{lot}</td>
                      <td className="p-3 text-green-400">{value}</td>
                      <td className="p-3 text-yellow-400">{example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* Videos Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mr-4 hover:bg-amber-400/20 transition-all duration-300">
              <Video className="w-6 h-6 text-amber-400" />
            </div>
              <h2 className="text-xl font-bold text-white">
                Ghid Video pentru folosirea aplicației MT5
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
                Deschide în YouTube
              </a>
            </div>
          </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mr-4 hover:bg-amber-400/20 transition-all duration-300">
              <Video className="w-6 h-6 text-amber-400" />
            </div>
              <h2 className="text-xl font-bold text-white">
                Cum funcționează trailing stop
              </h2>
            </div>
            <video controls className="w-full rounded-xl shadow-lg">
              <source src="/trailing stop.mp4" type="video/mp4" />
              Browserul tău nu suportă redarea video.
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
            MT5 pe Android
          </h2>
            <video
              controls
              className="w-full max-w-xl mx-auto aspect-video rounded-xl shadow-lg"
            >
              <source src="/tudor android.mp4" type="video/mp4" />
              Browserul tău nu suportă redarea video.
            </video>
          </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center mr-3 hover:bg-amber-400/20 transition-all duration-300">
              <Video className="w-5 h-5 text-amber-400" />
            </div>
            MT5 pe iPhone
          </h2>
            <video
              controls
              className="w-full max-w-xl mx-auto aspect-video rounded-xl shadow-lg"
            >
              <source src="/tudor iphone.mp4" type="video/mp4" />
              Browserul tău nu suportă redarea video.
            </video>
          </div>
        </div>

      {/* Course Downloads */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 mb-12 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mr-4 hover:bg-amber-400/20 transition-all duration-300">
            <BookOpen className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Lecții în format PDF</h2>
        </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                title: "Lecția 1 - Introducere",
                file: "/Curs ProFX - Lectia 1.pdf",
              },
              {
                title: "Lecția 2 - Grafice. Lumânări",
                file: "/Curs ProFX - Lectia 2.pdf",
              },
              {
                title: "Lecția 3 - Trenduri",
                file: "/Curs ProFX - Lectia 3.pdf",
              },
              {
                title: "Lecția 4 - Acțiunea Prețului",
                file: "/Curs ProFX - Lectia 4.pdf",
              },
              {
                title: "Lecția 5 - Risk Management",
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
                  <span>Vizualizează</span>
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
                  <span>Descarcă</span>
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
          Resurse Adiționale PDF
        </h2>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                title: "Dicționarul ProFX",
                file: "/Dictionar ProFX.pdf",
                iconColor: "text-green-400",
              },
              {
                title: "Ghid folosire MT5 mobile",
                file: "/Ghid folosire mt5.pdf",
                iconColor: "text-purple-400",
              },
              {
                title: "Ghid conectare MT5 mobile",
                file: "/Ghid conectare MT5.pdf",
                iconColor: "text-orange-400",
              },
              {
                title: "Introducere în Formațiile de Lumânări",
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
                  <span>Vizualizează</span>
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
                  <span>Descarcă</span>
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
          Ieși din sesiune
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
