import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./db/FireBase.js";
import FlipCard from "./FlipCard";
import FormularInscriere from "./components/FormularInscriere";
import { useLanguage } from './contexts/LanguageContext';

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PASSWORD_KEY = "profx_access_password";

const PDFViewerModal = ({ isOpen, onClose, pdfTitle, pdfFile }) => {
  const { translations: t, language } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [defaultTabs[0], defaultTabs[1]],
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
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

  const toggleFullscreen = () => setIsFullscreen((s) => !s);

  const handleDocumentLoadError = (error) => {
    console.error("PDF load error:", error);
    setPdfError(t.pdfLoadErrorMessage);
  };

  if (!isOpen) return null;

  return createPortal(
    <div key={language} className="fixed inset-0 z-50 flex items-center justify-center animate-language-change">
      <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative flex flex-col w-full h-[90%] max-w-6xl max-h-[90vh] rounded-xl overflow-hidden transition-all duration-300 shadow-2xl ${isFullscreen ? "w-screen h-screen rounded-none" : "mx-4"}`}>
        <div className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">📚</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white truncate max-w-[40ch]">{pdfTitle}</h3>
              <p className="text-sm text-gray-400">{t.trainingMaterials}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={toggleFullscreen} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0-6l-6 6M21 3l-6 6m0-6l6 6M3 21l6-6m0 6l-6-6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l6 6M20 8V4m0 0h-4m4 0l-6 6M4 16v4m0 0h4m-4 0l6-6M20 16v4m0 0h-4m4 0l-6-6" />
                )}
              </svg>
            </button>
            <button onClick={handleDownload} className="bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 px-4 py-2 rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t.download}</span>
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                  <h3 className="text-xl font-bold text-white mb-2">{t.pdfLoadError}</h3>
                  <p className="text-gray-400 mb-4 max-w-md">{pdfError}</p>
                  <button onClick={() => window.location.reload()} className="mt-4 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-amber-400 transition-colors">
                    {t.retry}
                  </button>
                </div>
              </div>
            ) : (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} onDocumentLoadError={handleDocumentLoadError} />
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
  const { translations: t, language } = useLanguage();
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const savedPassword = sessionStorage.getItem(PASSWORD_KEY);
    if (savedPassword) verifyPassword(savedPassword);
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
          setError(t.wrongPassword);
        }
      } else {
        setError(t.passwordNotAvailable);
      }
    } catch (err) {
      console.error("Eroare la verificarea parolei:", err);
      setError(t.verificationError);
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

  const toggleSignup = () => setShowSignup(!showSignup);

  const beginnerLinks = [
    { title: t.beginnerLink1, url: "https://youtube.com/@profx-romania?si=wA7daxrGD2nedUBj" },
    { title: t.beginnerLink2, url: "https://youtu.be/lfh3VtQnL-4" },
    { title: t.beginnerLink3, url: "https://youtu.be/6VlTjwkCMUY?si=Jwj892KeW2ySAvxd" },
    { title: t.beginnerLink4, url: "https://youtu.be/phhoKeZH44k?si=OH46WM0V3o6NUpAB" },
  ];

  const advancedGeneralLinks = [
    { title: t.advancedLink1, url: "https://youtu.be/fBqbevzaIaU?si=Mkhv_hpvNa-H_JsL" },
    { title: t.advancedLink2, url: "https://youtu.be/92jGomG6dnA" },
    { title: t.advancedLink3, url: "https://youtu.be/gJV8eGQTE3I" },
    { title: t.advancedLink4, url: "https://youtu.be/3Wa8vkqHiFg?si=Bohn8hbXmt54L7lv" },
    { title: t.advancedLink5, url: "https://youtu.be/yYkRlBA_cHs?si=2Ax-urncY2_Kzs2O" },
    { title: t.advancedLink6, url: "https://youtu.be/iBy8WbNq9bs?si=Uryhns8QgR79ekbr" },
    { title: t.advancedLink7, url: "https://youtu.be/Ai10kdtbNvM?si=xBMzktL-xp5xAvK8" },
    { title: t.advancedLink8, url: "https://youtu.be/iuv_itQfepM?si=ccaph62qj29LMgRZ" },
    { title: t.advancedLink9, url: "https://youtu.be/Lqsq3aF_sKw?si=PKpQ3QOwclYwGSEO" },
    { title: t.advancedLink10, url: "https://youtu.be/jbZwc7KCOiw?si=BOHXtNDyUnmKuO2G" },
    { title: t.advancedLink11, url: "https://youtu.be/UsPmwdhrl_M?si=leP1b7fzCtkuhw90" },
    { title: t.advancedLink12, url: "https://youtu.be/FA8f9cco2xw?si=QHM45E6gRjjWOVR7" },
    { title: t.advancedLink13, url: "https://youtu.be/20dxanOrkUI?si=alOYeIumDYs8ucla" },
    { title: t.advancedLink14, url: "https://youtu.be/31RKuSQZKOg?si=L5kZFkpuERPO9fBI" },
    { title: t.advancedLink15, url: "https://youtu.be/Z-jQjTuotso?si=oJR6Mq9GMuHzoJ3N" },
  ];

  const backtestingLinks = [
    { title: t.backtestingLink1, url: "https://youtu.be/x7LwzhMsbvo" },
    { title: t.backtestingLink2, url: "https://www.youtube.com/live/rd9Sy8nLlM8?si=Jj3vhPsEGDkGzsC8" },
    { title: t.backtestingLink3, url: "https://youtu.be/TsCk6YDlJVs?si=l-n_VhvZ0ta92Qqt" },
    { title: t.backtestingLink4, url: "https://youtu.be/5NEbOwgwkUc?si=jm5XkdP4DGfVvXNg" },
    { title: t.backtestingLink5, url: "https://youtu.be/-5Z7re53Uf8?si=37vS7j6RD5C_Nz8E" },
    { title: t.backtestingLink6, url: "https://youtu.be/lpwGUmIFpL0?si=Z3zILXu2_EVSpkPo" },
    { title: t.backtestingLink7, url: "https://youtu.be/IG7DvagZq7I?si=UUJX0kDhnkBDZoyz" },
    { title: t.backtestingLink8, url: "https://youtu.be/pz1V-Vc_JWA?si=qRqH_kljeQNbPfwI" },
    { title: t.backtestingLink9, url: "https://youtu.be/OioK9t2lc8M" },
    { title: t.backtestingLink10, url: "https://youtu.be/RjdGXZxft5s?si=dAFFjSmwY95u7Dvm" },
  ];

  const macroeconomieLinks = [
    { title: t.macroLink1, url: "https://youtu.be/IPtfRhvQJgs?si=dRMTSPR9yPZ9Ap6f" },
    { title: t.macroLink2, url: "https://youtu.be/4f7-xg7lRhI?si=2oherYO-dG4QxQAs" },
  ];

  const materialeLinks = [
    { title: t.resourceLink1, url: "https://sirbudcfx.blogspot.com/2025/06/ce-este-un-model-de-tip-cupa-si-maner.html" },
    { title: t.resourceLink2, url: "https://sirbudcfx.blogspot.com/2025/07/head-and-shoulders-pattern-in-aceasta.html" },
    { title: t.resourceLink3, url: "https://youtu.be/K4diseWETYQ?si=Tc6tHJSVAGmEYN6i" },
    { title: t.resourceLink4, url: "https://youtu.be/soJP3FEIY08" },
    { title: t.resourceLink5, url: "https://youtu.be/Bg39Knd1HEk?si=QFcwESFRKd5JUEs9" },
    { title: t.resourceLink6, url: "/Curs Inflatie Forex.pdf", type: "pdf" },
    { title: t.resourceLink7, url: "/Indicatori Macroeconomici.pdf", type: "pdf" },
    { title: t.resourceLink8, url: "/Intelegerea PIB-ului.pdf", type: "pdf" },
  ];

  const analizeSaptamanale = [
    { title: t.weeklyLink1, url: "https://youtu.be/e2z0ecJj2pQ?si=Pwu51YoUXXt82XHL" },
    { title: t.weeklyLink2, url: "https://youtu.be/0ujRUpll_Ao?si=ryhpYYbq3xn0ZMm7" },
    { title: t.weeklyLink3, url: "https://youtu.be/chmtZv2jwig?si=aGicjTJnVgtIMNZu" },
    { title: t.weeklyLink4, url: "https://www.youtube.com/live/4qv1wE8ymZk?si=nnBhpd_-_D_glKK1" },
    { title: t.weeklyLink5, url: "https://www.youtube.com/live/MEt8JQiJx_c?si=IvLP8IcP-zVPPmSH" },
    { title: t.weeklyLink6, url: "https://www.youtube.com/live/C9-kU10dIws?si=2zuFh_WAyiPNeiOd" },
  ];

  if (!accessGranted) {
    return (
      <div key={language} className="min-h-screen w-full px-6 py-12 flex items-start justify-center animate-language-change">
        <div className="group relative max-w-md w-full bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-400/30 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">{t.accessTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">{t.passwordLabel}</label>
                <input type="password" placeholder={t.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/40 transition" />
              </div>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full p-3 rounded-xl bg-blue-600/80 hover:bg-blue-500/80 text-white font-semibold transition-colors">{t.accessButton}</button>
            </form>
            <button onClick={toggleSignup} className="w-full p-3 rounded-xl bg-emerald-600/80 hover:bg-emerald-500/80 text-white font-semibold transition-colors mb-4">
              {showSignup ? t.signupButtonHide : t.signupButtonShow}
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
    <div key={language} className="min-h-screen w-full px-6 py-8 animate-language-change">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
         
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {t.mainTitle} <span className="text-[#d4af37]">{t.mainTitleHighlight}</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t.mainSubtitle}{" "}
            <span className="text-[#d4af37] font-semibold">{t.priceAction}</span> {t.qaSessions}
          </p>
        </div>

        <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-12 hover:border-yellow-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 text-center">
            <p className="text-xl text-gray-300 font-semibold mb-2">{t.motivational1}</p>
            <p className="text-2xl text-yellow-400 font-bold italic">{t.motivational2}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 mb-6">
          {/* Începători */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-emerald-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-xl font-bold text-yellow-400 mb-4 relative z-10">{t.beginnersTitle}</h2>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {beginnerLinks.map((item, idx) => (
                <li key={idx} className="text-gray-300 text-sm">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-emerald-300 underline underline-offset-4 transition-colors font-medium ml-2">
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
          {/* Avansați */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-xl font-bold text-yellow-400 mb-4 relative z-10">{t.advancedTitle}</h2>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {advancedGeneralLinks.map((item, idx) => (
                <li key={idx} className="text-gray-300 text-sm">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-300 underline underline-offset-4 transition-colors font-medium ml-2">
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 mb-6">
          {/* Sesiuni Backtesting */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-xl font-bold text-yellow-400 mb-4 relative z-10">{t.backtestingTitle}</h2>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {backtestingLinks.map((item, idx) => (
                <li key={idx} className="text-gray-300 text-sm">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-300 underline underline-offset-4 transition-colors font-medium ml-2">
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Macroeconomie */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-xl font-bold text-yellow-400 mb-4 relative z-10">{t.macroeconomicsTitle}</h2>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {macroeconomieLinks.map((item, idx) => (
                <li key={idx} className="text-gray-300 text-sm">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-300 underline underline-offset-4 transition-colors font-medium ml-2">
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 mb-6">
          {/* Resurse și Articole */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-orange-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-xl font-bold text-yellow-400 mb-4 relative z-10">{t.resourcesTitle}</h2>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {materialeLinks.map((item, idx) => (
                <li key={idx} className="text-gray-300 text-sm">
                  {item.type === "pdf" ? (
                    <button onClick={() => setActiveModal({ title: item.title, file: item.url })} className="text-gray-300 hover:text-orange-300 underline underline-offset-4 transition-colors font-medium ml-2 inline-flex items-center gap-1 cursor-pointer">
                      {item.title}
                      <span className="text-xs">📄</span>
                    </button>
                  ) : (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-300 underline underline-offset-4 transition-colors font-medium ml-2">
                      {item.title}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>
          {/* Analiză săptămânală macroeconomie */}
          <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-pink-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-xl font-bold text-yellow-400 mb-4 relative z-10">{t.weeklyAnalysisTitle}</h2>
            <ol className="space-y-3 list-decimal list-inside relative z-10">
              {analizeSaptamanale.map((item, idx) => (
                <li key={idx} className="text-gray-300 text-sm">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-300 underline underline-offset-4 transition-colors font-medium ml-2">
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Final Message */}
        <div className="group relative max-w-7xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 hover:border-yellow-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-center relative z-10">
            <p className="text-2xl text-gray-300 font-semibold mb-2">{t.finalMessage1}</p>
            <p className="text-2xl text-yellow-400 font-bold mb-6">{t.finalMessage2}</p>
            <button onClick={handleLogout} className="inline-flex items-center px-6 py-3 bg-gray-800/50 border border-red-400/30 text-red-300 hover:border-red-400/50 hover:text-red-200 rounded-xl transition-all duration-200">
              {t.logoutButton}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8">
          <FlipCard />
        </div>
      </div>

      <PDFViewerModal isOpen={!!activeModal} onClose={() => setActiveModal(null)} pdfTitle={activeModal?.title} pdfFile={activeModal?.file} />
    </div>
  );
};

export default Training;