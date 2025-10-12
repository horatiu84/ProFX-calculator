import React from "react";
import { createPortal } from "react-dom";

export default function VipInfoModal({ open, onClose }) {
  if (!open) return null;

  const modal = (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-0 w-full max-w-2xl overflow-hidden hover:border-amber-400/30 transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 bg-gray-900/60 sticky top-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full grid place-items-center">⭐</div>
              <h2 className="text-lg md:text-xl font-bold text-amber-400">Instrucțiuni Acces VIP ProFX</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none px-2">×</button>
          </div>

          {/* Scrollable content */}
          <div className="px-6 pt-5 pb-4 overflow-y-auto flex-1">
            <div className="bg-gradient-to-r from-yellow-600/10 to-yellow-700/10 p-4 rounded-lg mb-6 border border-yellow-600/20">
              <p className="text-sm text-yellow-100/90">
                Urmați acești pași pentru a obține acces la grupurile de Telegram VIP, unde se tranzacționează LIVE, precum și la sesiunile practice și de backtesting.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">1</div>
                  <h3 className="text-lg font-semibold text-blue-400">Creați cont FPM Trading</h3>
                </div>
                <p className="text-sm mb-3 ml-11 text-gray-300">Creați un cont FPM Trading folosind link-ul oficial:</p>
                <a
                  href="https://smartlnks.com/PROFX-Romania"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors block mb-3 ml-11 font-medium"
                >
                  https://smartlnks.com/PROFX-Romania
                </a>
                <div className="ml-11">
                  <p className="text-sm mb-2 text-gray-300">Tutorial de înregistrare:</p>
                  <a
                    href="https://youtu.be/SnxXpX1Iei8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    https://youtu.be/SnxXpX1Iei8
                  </a>
                </div>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">2</div>
                  <h3 className="text-lg font-semibold text-green-400">Contactați pentru verificare</h3>
                </div>
                <p className="text-sm mb-2 ml-11 text-gray-300">
                  Trimiteți un mesaj către {" "}
                  <a
                    href="https://t.me/sergiucirstea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Sergiu Cirstea
                  </a>{" "}
                  și atașați o captură cu contul vostru activ FPM Trading (demo sau real).
                </p>
                <p className="text-sm ml-11 text-gray-400">După verificare, veți fi adăugați în grupul nostru exclusiv.</p>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">3</div>
                  <h3 className="text-lg font-semibold text-purple-400">Parcurgeți lecțiile gratuite</h3>
                </div>
                <p className="text-sm mb-3 ml-11 text-gray-300">Studiul lecțiilor ProFX este esențial pentru cei care doresc să învețe de la zero:</p>
                <a
                  href="https://profx.ro/#lectii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors ml-11 font-medium"
                >
                  https://profx.ro/#lectii
                </a>
              </div>

              {/* Beneficii VIP îmbunătățite */}
              <div className="relative p-5 rounded-xl border border-amber-400/20 bg-gray-900/40 backdrop-blur-sm shadow-lg">
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/10 via-transparent to-transparent" />
                <h3 className="relative text-lg font-semibold mb-3 text-amber-300">Beneficii Exclusive VIP</h3>
                <p className="relative text-sm mb-4 text-gray-200/90">
                  Prin deschiderea unui cont la FPM Trading folosind link-ul nostru oficial, veți debloca următoarele beneficii:
                </p>
                <div className="relative grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-3 ">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-sm  text-gray-200/90">Acces la grupurile de Telegram VIP cu tranzacționare LIVE</span>
                  </div>
                  <div className="flex items-start gap-3 ">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-sm  text-gray-200/90">Participare la sesiuni practice și de backtesting</span>
                  </div>
                  <div className="flex items-start gap-3 ">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-sm  text-gray-200/90">Suport personalizat și mentorat</span>
                  </div>
                </div>
              </div>

              <div className="text-center bg-gradient-to-r from-blue-600/10 to-blue-700/10 p-5 rounded-xl border border-blue-500/20">
                <p className="text-lg font-semibold text-blue-300 mb-2">Vă așteptăm cu entuziasm în comunitatea noastră!</p>
                <p className="text-yellow-400 font-medium">Echipa ProFX</p>
              </div>
            </div>
          </div>

          {/* Bottom footer with close button */}
          <div className="px-6 pt-4 pb-6 bg-gray-900/60 border-t border-gray-700/50">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/60 text-white rounded-xl hover:bg-gray-700/60 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all shadow-sm"
            >
              Închide
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
