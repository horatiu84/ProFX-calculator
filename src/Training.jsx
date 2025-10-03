import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./db/FireBase.js";
import FlipCard from "./FlipCard";
import FormularInscriere from "./components/FormularInscriere";

// Import CSS-urile necesare pentru PDF viewer
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PASSWORD_KEY = "profx_access_password";

// PDFViewerModal component
const PDFViewerModal = ({ isOpen, onClose, pdfTitle, pdfFile }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Thumbnails
      defaultTabs[1], // Bookmarks
    ],
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = (pdfTitle || "document").replace(/\s+/g, "_") + ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((s) => !s);
  };

  const handleDocumentLoadError = (error) => {
    console.error("PDF load error:", error);
    setPdfError(
      "Nu s-a putut încărca PDF-ul. Verifică dacă fișierul există în folderul public/"
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative flex flex-col w-full h-[90%] max-w-6xl max-h-[90vh] rounded-xl overflow-hidden transition-all duration-300 shadow-2xl
          ${isFullscreen ? "w-screen h-screen rounded-none" : "mx-4"}`}
        role="dialog"
        aria-modal="true"
        aria-label={pdfTitle || "PDF Viewer"}
      >
        <div className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">📚</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white truncate max-w-[40ch]">
                {pdfTitle}
              </h3>
              <p className="text-sm text-gray-400">Materiale Training ProFX</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={isFullscreen ? "Ieșire fullscreen" : "Fullscreen"}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isFullscreen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 9l6 6m0-6l-6 6M21 3l-6 6m0-6l6 6M3 21l6-6m0 6l-6-6"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l6 6M20 8V4m0 0h-4m4 0l-6 6M4 16v4m0 0h4m-4 0l6-6M20 16v4m0 0h-4m4 0l-6-6"
                  />
                )}
              </svg>
            </button>
            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 px-4 py-2 rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Descarcă</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Închide"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 bg-gray-900/50 backdrop-blur-sm overflow-auto">
          <div className="h-full">
            {pdfError ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Eroare la încărcarea PDF-ului
                  </h3>
                  <p className="text-gray-400 mb-4 max-w-md">{pdfError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-amber-400 transition-colors"
                  >
                    Reîncearcă
                  </button>
                </div>
              </div>
            ) : (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={pdfFile}
                  plugins={[defaultLayoutPluginInstance]}
                  onDocumentLoadError={handleDocumentLoadError}
                />
              </Worker>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Training = () => {
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const savedPassword = sessionStorage.getItem(PASSWORD_KEY);
    if (savedPassword) {
      verifyPassword(savedPassword);
    }
  }, []);

  const verifyPassword = async (inputPassword) => {
    try {
      const docRef = doc(db, "settings", "trainingAccess");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const storedPassword = docSnap.data().password;
        if (inputPassword === storedPassword) {
          setAccessGranted(true);
          sessionStorage.setItem(PASSWORD_KEY, inputPassword);
          setError("");
        } else {
          setError("Parolă greșită. Încearcă din nou.");
        }
      } else {
        setError("Eroare: parola nu este disponibilă.");
      }
    } catch (err) {
      console.error("Eroare la verificarea parolei:", err);
      setError("Eroare la verificarea parolei. Încearcă din nou.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verifyPassword(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PASSWORD_KEY);
    setAccessGranted(false);
    setPassword("");
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  const beginnerLinks = [
    {
      title: "Lecțiile de la 1 - 10 de pe canalul nostru de Youtube",
      url: "https://youtube.com/@profx-romania?si=wA7daxrGD2nedUBj",
    },
    {
      title: "Prezentare Aplicația MT5",
      url: "https://youtu.be/lfh3VtQnL-4",
    },
    {
      title: "Paternuri",
      url: "https://youtu.be/6VlTjwkCMUY?si=Jwj892KeW2ySAvxd",
    },
    {
      title: "Webinar Incepatori 10/06/2025",
      url: "https://youtu.be/phhoKeZH44k?si=OH46WM0V3o6NUpAB",
    },
  ];

  const advancedGeneralLinks = [
    {
      title: "Cum să executați ideile de Trade ale lui Flaviu",
      url: "https://youtu.be/fBqbevzaIaU?si=Mkhv_hpvNa-H_JsL",
    },
    {
      title: "Strategie executie actiunea pretului si Q&A",
      url: "https://youtu.be/92jGomG6dnA",
    },
    {
      title: "Fakeouts + Q&A (Trader Daniel)",
      url: "https://youtu.be/gJV8eGQTE3I",
    },
    {
      title: "Intrările pe Impuls & liquidity",
      url: "https://youtu.be/3Wa8vkqHiFg?si=Bohn8hbXmt54L7lv",
    },
    {
      title: "Cand dam o a 2a sansa tranzactiei & Market Structure",
      url: "https://youtu.be/yYkRlBA_cHs?si=2Ax-urncY2_Kzs2O",
    },
    {
      title: "Corelarea intre timeframe urile M30 si M15",
      url: "https://youtu.be/iBy8WbNq9bs?si=Uryhns8QgR79ekbr",
    },
    {
      title: "Risk Management 1.0",
      url: "https://youtu.be/Ai10kdtbNvM?si=xBMzktL-xp5xAvK8",
    },
    {
      title: "Risk Management 2.0",
      url: "https://youtu.be/iuv_itQfepM?si=ccaph62qj29LMgRZ",
    },
    {
      title: "Sesiune practica pentru avansati - 10/07/2025",
      url: "https://youtu.be/Lqsq3aF_sKw?si=PKpQ3QOwclYwGSEO",
    },
    {
      title: "Sesiune Practica Mentorat 17.07.2025",
      url: "https://youtu.be/jbZwc7KCOiw?si=BOHXtNDyUnmKuO2G",
    },
    {
      title: " Fakeouts - Cum le poti gestiona si risk Managementul lor",
      url: "https://youtu.be/UsPmwdhrl_M?si=leP1b7fzCtkuhw90",
    },
    ,
    {
      title: "Webinar Eli - Strategia lumanarii pe 15 min si US30",
      url: "https://youtu.be/FA8f9cco2xw?si=QHM45E6gRjjWOVR7",
    },
      {
      title: "Webinar Mihai- Strategia consolidarii pe 15 minute-sesiunea ASIA",
      url: "https://youtu.be/20dxanOrkUI?si=alOYeIumDYs8ucla",
    },
    {
      title: "Cum sa va construiti un Plan de Succes in Trading",
      url: "https://youtu.be/31RKuSQZKOg?si=L5kZFkpuERPO9fBI",
    },
     {
      title: "Planul in executie AVANSAȚI",
      url: "https://youtu.be/Z-jQjTuotso?si=oJR6Mq9GMuHzoJ3N",
    },
  ];

  const backtestingLinks = [
    {
      title: "Webinar backtesting si Q&A - 1",
      url: "https://youtu.be/x7LwzhMsbvo",
    },
    {
      title: "Webinar backtesting si Q&A - 2",
      url: "https://www.youtube.com/live/rd9Sy8nLlM8?si=Jj3vhPsEGDkGzsC8",
    },
    {
      title: "Webinar Backtesting si Q&A + Viziunea ProFx",
      url: "https://youtu.be/TsCk6YDlJVs?si=l-n_VhvZ0ta92Qqt",
    },
    {
      title: "Webinar backtesting + Q&A",
      url: "https://youtu.be/5NEbOwgwkUc?si=jm5XkdP4DGfVvXNg",
    },
    {
      title: "Backtesting Session - 15/06/2025",
      url: "https://youtu.be/-5Z7re53Uf8?si=37vS7j6RD5C_Nz8E",
    },
    {
      title: "Backtesting XauUsd 22.06.2025",
      url: "https://youtu.be/lpwGUmIFpL0?si=Z3zILXu2_EVSpkPo",
    },
    {
      title: "Backtesting Session 06/07/2025",
      url: "https://youtu.be/IG7DvagZq7I?si=UUJX0kDhnkBDZoyz",
    },
    {
      title: "Backtesting Session - 13/07/2025",
      url: "https://youtu.be/pz1V-Vc_JWA?si=qRqH_kljeQNbPfwI",
    },
    {
      title: "Backtesting Session - 03/08/2025",
      url: "https://youtu.be/OioK9t2lc8M",
    },
    {
      title: "Backtesting Session - 17/08/2025",
      url: "https://youtu.be/RjdGXZxft5s?si=dAFFjSmwY95u7Dvm",
    },
  ];

  const macroeconomieLinks = [
    {
      title: "Macroeconomie - Ep.1 Inflatie",
      url: "https://youtu.be/IPtfRhvQJgs?si=dRMTSPR9yPZ9Ap6f",
    },
    {
      title: "Macroeconomie - EP.2 PIB",
      url: "https://youtu.be/4f7-xg7lRhI?si=2oherYO-dG4QxQAs",
    },
  ];

  const materialeLinks = [
    {
      title: "Ce este un model de tip cupă și mâner? - by Daniel Sarbu",
      url: "https://sirbudcfx.blogspot.com/2025/06/ce-este-un-model-de-tip-cupa-si-maner.html",
    },
    {
      title: "Head and shoulders pattern - by Daniel Sarbu",
      url: "https://sirbudcfx.blogspot.com/2025/07/head-and-shoulders-pattern-in-aceasta.html",
    },
    {
      title: "Masterclass Divergențe în Trading - cu Mihai Tiepac",
      url: "https://youtu.be/K4diseWETYQ?si=Tc6tHJSVAGmEYN6i",
    },
    {
      title: "Masterclass 'Divergențe în Trading - 2 -cu Mihai Tiepac",
      url: "https://youtu.be/soJP3FEIY08",
    },
     {
      title: "Podcast Mihai Tiepac cu  Florin Mircea : In trading, NU renunta niciodata",
      url: "https://youtu.be/Bg39Knd1HEk?si=QFcwESFRKd5JUEs9",
    },
    {
      title: "Curs inflatie Forex ",
      url: "/Curs Inflatie Forex.pdf",
      type: "pdf",
    },
    {
      title: "Indicatori Macroeconomici",
      url: "/Indicatori Macroeconomici.pdf",
      type: "pdf",
    },
    {
      title: "Înțelegerea PIB-ului: Coloana vertebral a analizei economice",
      url: "/Intelegerea PIB-ului.pdf",
      type: "pdf",
    },
  ];

  const analizeSaptamanale = [
    {
      title: "Analiza saptamanala 18 08 2025",
      url: "https://youtu.be/e2z0ecJj2pQ?si=Pwu51YoUXXt82XHL",
    },
    {
      title: "Analiza saptamanala 22 08 2025",
      url: "https://youtu.be/0ujRUpll_Ao?si=ryhpYYbq3xn0ZMm7",
    },
    {
      title: "Analiza Saptamanala  25 08 2025",
      url: "https://youtu.be/chmtZv2jwig?si=aGicjTJnVgtIMNZu",
    },
    {
      title: "Analiza Saptamanala 8 Sept 2025",
      url: "https://www.youtube.com/live/4qv1wE8ymZk?si=nnBhpd_-_D_glKK1",
    },
    {
      title: "Analiza Saptamanala 15 Sept 2025",
      url: "https://www.youtube.com/live/MEt8JQiJx_c?si=IvLP8IcP-zVPPmSH",
    },
    {
      title: "Analiza Saptamanala 22 Sept 2025",
      url: "https://www.youtube.com/live/C9-kU10dIws?si=2zuFh_WAyiPNeiOd",
    },
  ];

  if (!accessGranted) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">
          Acces Training ProFX
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
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative rounded-3xl overflow-hidden"
      style={{ backgroundImage: "url(/Background/Background2.jpg)" }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-slate-900/90 to-black/95 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-yellow-400/40 rounded-3xl mb-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_0_rgba(251,191,36,0.4)] transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:rounded-3xl before:pointer-events-none">
            <span className="text-4xl relative z-10">🎯</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Training <span className="text-yellow-400">ProFX</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Cei care v-ați alăturat comunității: aveți aici înregistrarea
            webinariilor despre execuție{" "}
            <span className="text-yellow-400 font-semibold">PRICE ACTION</span>{" "}
            și sesiunile de Q&A!
          </p>
        </div>

        {/* Note Card */}
        <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/70 backdrop-blur-xl rounded-3xl  p-8 mb-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]  hover:shadow-[0_0_40px_0_rgba(251,191,36,0.3)] transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/8 before:via-transparent before:to-transparent before:rounded-3xl before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-yellow-500/5 after:to-transparent after:rounded-3xl after:pointer-events-none">
          <div className="text-center relative z-10">
            <p className="text-xl text-slate-200 font-semibold mb-2 drop-shadow-md">
              Recomandat este să treceți prin ele cu pix și foaie!
            </p>
            <p className="text-2xl text-yellow-400 font-bold italic drop-shadow-lg">
              Note takers are money makers!
            </p>
          </div>
        </div>

        {/* Training Sections Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Începători Section */}
          <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/70 backdrop-blur-xl rounded-3xl  p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]  hover:shadow-[0_0_40px_0_rgba(251,191,36,0.2)] transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/8 before:via-transparent before:to-transparent before:rounded-3xl before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-yellow-500/5 after:to-transparent after:rounded-3xl after:pointer-events-none">
            <div className="flex items-center mb-4 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600/80 to-slate-700/60 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 hover:from-green-500/30 hover:to-green-600/20 transition-all duration-300">
                <span className="text-xl">🟢</span>
              </div>
              <h2 className="text-xl font-bold text-green-400 drop-shadow-md">
                Începători
              </h2>
            </div>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {beginnerLinks.map((item, idx) => (
                <li key={idx} className="text-slate-200 text-sm">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 underline underline-offset-4 transition-colors font-medium ml-2"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Avansați Section */}
          <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/70 backdrop-blur-xl rounded-3xl  p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]  hover:shadow-[0_0_40px_0_rgba(96,165,250,0.2)] transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/8 before:via-transparent before:to-transparent before:rounded-3xl before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-blue-500/5 after:to-transparent after:rounded-3xl after:pointer-events-none">
            <div className="flex items-center mb-4 relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600/80 to-slate-700/60 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 hover:from-blue-500/30 hover:to-blue-600/20 transition-all duration-300 ">
                <span className="text-xl">🟠</span>
              </div>
              <h2 className="text-xl font-bold text-blue-400 drop-shadow-md">
                Avansați - Lecții generale
              </h2>
            </div>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {advancedGeneralLinks.map((item, idx) => (
                <li key={idx} className="text-slate-200 text-sm">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 underline underline-offset-4 transition-colors font-medium ml-2"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Backtesting Section */}
          <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/70 backdrop-blur-xl rounded-3xl  p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]  hover:shadow-[0_0_40px_0_rgba(251,191,36,0.2)] transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/8 before:via-transparent before:to-transparent before:rounded-3xl before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-yellow-500/5 after:to-transparent after:rounded-3xl after:pointer-events-none">
            <div className="flex items-center mb-4 relative z-10">
              <div className="w-10 h-10 bg-slate-700/60 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 hover:bg-cyan-500/20 transition-all duration-300">
                <span className="text-xl">📈</span>
              </div>
              <h2 className="text-xl font-bold text-cyan-400 drop-shadow-md">
                Sesiuni Backtesting
              </h2>
            </div>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {backtestingLinks.map((item, idx) => (
                <li key={idx} className="text-slate-200 text-sm">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors font-medium ml-2"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Macroeconomie Section */}
          <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/70 backdrop-blur-xl rounded-3xl  p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]  hover:shadow-[0_0_40px_0_rgba(96,165,250,0.2)] transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/8 before:via-transparent before:to-transparent before:rounded-3xl before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-blue-500/5 after:to-transparent after:rounded-3xl after:pointer-events-none">
            <div className="flex items-center mb-4 relative z-10">
              <div className="w-10 h-10 bg-slate-700/60 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 hover:bg-purple-500/20 transition-all duration-300">
                <span className="text-xl">🌍</span>
              </div>
              <h2 className="text-xl font-bold text-purple-400 drop-shadow-md">
                Macroeconomie
              </h2>
            </div>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {macroeconomieLinks.map((item, idx) => (
                <li key={idx} className="text-slate-200 text-sm">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors font-medium ml-2"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Materiale Section */}
          <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/70 backdrop-blur-xl rounded-3xl  p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]  hover:shadow-[0_0_40px_0_rgba(251,191,36,0.2)] transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/8 before:via-transparent before:to-transparent before:rounded-3xl before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-yellow-500/5 after:to-transparent after:rounded-3xl after:pointer-events-none">
            <div className="flex items-center mb-4 relative z-10">
              <div className="w-10 h-10 bg-slate-700/60 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 hover:bg-orange-500/20 transition-all duration-300">
                <span className="text-xl">�</span>
              </div>
              <h2 className="text-xl font-bold text-orange-400 drop-shadow-md">
                Resurse și Articole
              </h2>
            </div>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {materialeLinks.map((item, idx) => (
                <li key={idx} className="text-slate-200 text-sm">
                  {item.type === "pdf" ? (
                    <button
                      onClick={() =>
                        setActiveModal({ title: item.title, file: item.url })
                      }
                      className="text-orange-400 hover:text-orange-300 underline underline-offset-4 transition-colors font-medium ml-2 inline-flex items-center gap-1 cursor-pointer"
                    >
                      {item.title}
                      <span className="text-xs">📄</span>
                    </button>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:text-orange-300 underline underline-offset-4 transition-colors font-medium ml-2"
                    >
                      {item.title}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Analize Section */}
          <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/70 backdrop-blur-xl rounded-3xl  p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]  hover:shadow-[0_0_40px_0_rgba(96,165,250,0.2)] transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/8 before:via-transparent before:to-transparent before:rounded-3xl before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-blue-500/5 after:to-transparent after:rounded-3xl after:pointer-events-none">
            <div className="flex items-center mb-4 relative z-10">
              <div className="w-10 h-10 bg-slate-700/60 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3 hover:bg-pink-500/20 transition-all duration-300">
                <span className="text-xl">📊</span>
              </div>
              <h2 className="text-xl font-bold text-pink-400 drop-shadow-md">
                Analiză săptămânală macroeconomie
              </h2>
            </div>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {analizeSaptamanale.map((item, idx) => (
                <li key={idx} className="text-slate-200 text-sm">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:text-pink-300 underline underline-offset-4 transition-colors font-medium ml-2"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/70 backdrop-blur-xl rounded-3xl  p-8 mb-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]  hover:shadow-[0_0_40px_0_rgba(251,191,36,0.3)] transition-all duration-500 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/8 before:via-transparent before:to-transparent before:rounded-3xl before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-yellow-500/5 after:to-transparent after:rounded-3xl after:pointer-events-none">
          <div className="text-center relative z-10">
            <p className="text-2xl text-slate-200 font-semibold mb-2 drop-shadow-md">
              Vizionare productivă!
            </p>
            <p className="text-2xl text-yellow-400 font-bold mb-6 drop-shadow-lg">
              Echipa ProFx!
            </p>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-red-600/30 backdrop-blur-sm border border-red-400/50 text-red-300 hover:bg-red-600/50 hover:text-red-200 rounded-xl transition-all duration-200 shadow-lg"
            >
              Ieși din sesiune
            </button>
          </div>
        </div>

        {/* FlipCard */}
        <div className="mt-8">
          <FlipCard />
        </div>
      </div>

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        pdfTitle={activeModal?.title}
        pdfFile={activeModal?.file}
      />
    </div>
  );
};

export default Training;
