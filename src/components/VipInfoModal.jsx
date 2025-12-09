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
                📢 Pași pentru activarea abonamentului ProFX – VIP 2.0
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">1</div>
                  <h3 className="text-lg font-semibold text-blue-400">Creează contul ProFX + plătește abonamentul</h3>
                </div>
                <a
                  href="https://profx.ro/register/?lid=5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors block mb-3 ml-11 font-medium"
                >
                  👉 https://profx.ro/register/?lid=5
                </a>
                <div className="ml-11">
                  <p className="text-sm mb-2 text-gray-300">Pașii necesari să intri în comunitatea ProFX - 2.0 🚨</p>
                  <p className="text-sm mb-2 text-gray-300">🎥 Tutorial:</p>
                  <a
                    href="https://youtu.be/-Q4DVz-BvE4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    https://youtu.be/-Q4DVz-BvE4
                  </a>
                </div>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">2</div>
                  <h3 className="text-lg font-semibold text-green-400">Creează/confirmă contul FPM Trading</h3>
                </div>
                <a
                  href="https://smartlnks.com/PROFX-Romania"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors block mb-3 ml-11 font-medium"
                >
                  👉 https://smartlnks.com/PROFX-Romania
                </a>
                <p className="text-sm ml-11 text-gray-300">
                  Apoi trimite un mesaj lui{" "}
                  <a
                    href="https://t.me/sergiucirstea"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    Sergiu Cîrstea
                  </a>{" "}
                  cu o poză a contului tău activ (demo sau real).
                </p>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">3</div>
                  <h3 className="text-lg font-semibold text-purple-400">Deschide Bot-ul ProFX Membership</h3>
                </div>
                <a
                  href="https://t.me/profxromaniaMembership_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors ml-11 font-medium block mb-3"
                >
                  👉 https://t.me/profxromaniaMembership_bot
                </a>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">4</div>
                  <h3 className="text-lg font-semibold text-amber-400">Scrie comanda</h3>
                </div>
                <div className="ml-11 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700/50">
                  <code className="text-green-400 font-mono">/start</code>
                </div>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">5</div>
                  <h3 className="text-lg font-semibold text-cyan-400">Introdu emailul</h3>
                </div>
                <p className="text-sm ml-11 text-gray-300">
                  Folosește emailul cu care te-ai înregistrat pe ProFX (Pasul 1).
                </p>
              </div>

              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">6</div>
                  <h3 className="text-lg font-semibold text-pink-400">Introdu parola ProFX</h3>
                </div>
                <p className="text-sm ml-11 text-gray-300 mb-3">
                  Parola folosită la crearea contului (Pasul 1).
                </p>
                <div className="ml-11 bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                  <p className="text-sm text-green-300 font-medium">
                    ✅ Dacă abonamentul este activ:
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Vei primi automat linkul pentru grupul ProFX – VIP Telegram.
                  </p>
                </div>
              </div>

              <div className="text-center bg-gradient-to-r from-blue-600/10 to-purple-700/10 p-6 rounded-xl border border-blue-500/30">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                  🎉 Bine ai venit în ProFX – VIP 2.0! 🚀
                </p>
                <p className="text-yellow-400 font-medium mt-3">Echipa ProFX</p>
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
