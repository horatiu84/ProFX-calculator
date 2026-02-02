import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "./contexts/LanguageContext";

const Raport = () => {
  const { translations, language } = useLanguage();
  const t = translations;
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Rapoarte organizate pe ani
  const rapoartePerAn = {
    2026: [
      { label: t.raportFebruary || "Februarie", href: "/Rapoarte/ProFX_Journal_Februarie_2026.pdf", type: "pdf" },
    ],
    2025: [
      { label: t.raportMay, href: "/Rapoarte/RaportMai.html", type: "html" },
      { label: t.raportJune, href: "/Rapoarte/RaportIunie.html", type: "html" },
      { label: t.raportJuly, href: "/Rapoarte/RaportIulie.html", type: "html" },
      { label: t.raportAugust, href: "/Rapoarte/RaportAugust.html", type: "html" },
      { label: t.raportSeptember, href: "/Rapoarte/RaportSeptembrie.html", type: "html" },
      { label: t.raportOctober, href: "/Rapoarte/RaportOctombrie.html", type: "html" },
      { label: t.raportNovember, href: "/Rapoarte/RaportNoiembrie.html", type: "html" },
      { label: t.raportDecember, href: "/Rapoarte/RaportDecembrie.html", type: "html" },
    ],
  };

  const handleReportClick = (raport, e) => {
    if (raport.type === "pdf") {
      e.preventDefault();
      setSelectedPdf(raport);
    }
    // Pentru HTML, link-ul va funcționa normal (target="_blank")
  };

  const closePdfViewer = () => {
    setSelectedPdf(null);
  };

  // Sortează anii în ordine descrescătoare (cel mai recent primul)
  const aniSortati = Object.keys(rapoartePerAn).sort((a, b) => b - a);

  return (
    <div key={language} className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-10 max-w-2xl mx-auto overflow-hidden animate-language-change">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <h2 className="text-2xl font-semibold mb-8 text-center text-blue-400 transition-colors duration-300">
          {t.raportTitle}
        </h2>

        <div className="space-y-8">
          {aniSortati.map((an) => (
            <div key={an} className="group">
              {/* Titlu an */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                <h3 className="px-4 text-lg font-semibold text-gray-300 group-hover:text-blue-300 transition-colors duration-300">
                  📅 {an}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              </div>

              {/* Lista rapoarte pentru acest an */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rapoartePerAn[an].map((r) => (
                  <div key={r.href} className="flex justify-center">
                    <a
                      href={r.href}
                      target={r.type === "html" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => handleReportClick(r, e)}
                      className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-600/50 text-white text-center rounded-xl shadow-md transition duration-300 hover:bg-gray-700/50 hover:border-blue-400/50 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {r.type === "pdf" && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
                        </svg>
                      )}
                      {r.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Viewer Modal - Using Portal */}
      {selectedPdf && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="w-full h-full max-w-6xl max-h-[95vh] my-4 flex flex-col bg-gray-900 rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gray-900 px-6 py-4 border-b border-gray-700 flex-shrink-0 rounded-t-lg">
            <h3 className="text-xl font-semibold text-white flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
              </svg>
              {selectedPdf.label}
            </h3>
            <div className="flex items-center gap-3">
              <a
                href={selectedPdf.href}
                download
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t.download || "Download"}
              </a>
              <button
                onClick={closePdfViewer}
                className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors duration-200"
                aria-label="Close"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 w-full overflow-hidden rounded-b-lg">
            <iframe
              src={`${selectedPdf.href}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              className="w-full h-full border-0"
              title={selectedPdf.label}
            />
          </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Raport;
