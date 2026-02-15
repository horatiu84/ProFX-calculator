import React from "react";

const LeaduriTab = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="relative w-full max-w-lg">
        {/* Glow effect behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl blur-lg opacity-30 animate-pulse" />

        {/* Main card */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-yellow-500/30 rounded-2xl p-10 text-center shadow-2xl">
          {/* Icon */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/25">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3">
            Managementul Leadurilor
          </h2>

          {/* Description */}
          <p className="text-gray-400 mb-8 leading-relaxed">
            Sistemul de leaduri a fost mutat pe o platformă dedicată pentru o
            experiență mai bună și funcționalități avansate.
          </p>

          {/* CTA Button */}
          <a
            href="https://profx-mentori.netlify.app/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Accesează Platforma
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          {/* Subtle footer note */}
          <p className="mt-6 text-xs text-gray-500">
            profx-mentori.netlify.app
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaduriTab;
