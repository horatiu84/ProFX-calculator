import React from "react";
import { useLanguage } from "./contexts/LanguageContext";

const BrasovEvent = () => {
  const { language } = useLanguage();

  const content = {
    ro: {
      title: "Mastermind ProFX",
      subtitle: "Iași",
      date: "28 Martie 2026 de la ora 10:00",
      location: "Hotel Pleiada, Iași",
      hero: "O zi intensivă, practică şi plină de informații aplicabile",
      intro:
        "Un nou MasterClass dedicat celor care vor mai mult de la trading: claritate în strategie, disciplină în execuție şi o înțelegere reală a etapelor prin care trece un trader până la consistență. 📈",
      benefits: [
        "Claritate în strategie",
        "Disciplină în execuție",
        "Comunitate în creştere",
      ],
      mainMessage:
        "Continuăm turul național. Ne vedem pe 28 martie la Iaşi!",
      description:
        "Va fi o zi intensivă, practică şi plină de informații aplicabile — alături de o comunitate care creşte de la un oraş la altul.",
      dayTitle: "O zi întreagă în care:",
      points: [
        "Înțelegi etapele reale prin care trece un trader până la consistență",
        "Descoperi strategii clare, aplicate de traderi activi",
        "Te conectezi cu o comunitate care creşte de la un oraş la altul",
      ],
      free: "Totul Gratuit",
      freeDesc:
        "fără costuri ascunse. Doar educație reală și o experiență intensă care îți poate schimba modul de a privi tradingul.",
      limited: "Locurile sunt limitate",
      registerButton: "Înscrie-te Acum",
      registerInfo: "Înscrierile sunt deschise! Locurile sunt limitate.",
      whatToExpect: "Ce vei avea de câștigat?",
      expectations: [
        "Vei învăța Bazele Tradingului",
        "Vei învăța cum să folosești aplicațiile",
        "Vei descoperi cum poți câștiga o vacanță la Roma pentru 2 persoane ✈️",
        "Vei afla cum participi la competiția lunară cu premii de 2.000€ 🎉",
        "Vei învăța psihologie în trading",
        "Vei putea pune întrebări într-o sesiune Q&A",
      ],
      callToAction: "Dacă ești din Iași sau din apropiere, e momentul să faci pasul următor.",
      venueTitle: "Locația Evenimentului",
      venueHotel: "Hotel Pleiada",
      venueAddress: "Iași, România",
      venueMapLink: "https://maps.google.com/?q=Hotel+Pleiada+Iasi",
      venueMapLabel: "Deschide în Google Maps",
    },
    en: {
      title: "ProFX Mastermind",
      subtitle: "Iași",
      date: "March 2026 (Details coming soon)",
      location: "Location to be confirmed",
      hero: "An intensive, practical day packed with actionable insights",
      intro:
        "A new MasterClass for those who want more from trading: clarity in strategy, discipline in execution, and a real understanding of every stage a trader goes through to reach consistency. 📈",
      benefits: [
        "Clarity in strategy",
        "Discipline in execution",
        "A growing community",
      ],
      mainMessage:
        "We continue the national tour. See you on March 28th in Iaşi!",
      description:
        "It will be an intensive, practical day full of actionable information — alongside a community that grows from city to city.",
      dayTitle: "A full day where you will:",
      points: [
        "Understand the real stages every trader goes through to reach consistency",
        "Discover clear strategies used by active traders",
        "Connect with a community that grows from city to city",
      ],
      free: "Completely Free",
      freeDesc:
        "no hidden costs. Just real education and an intense experience that can change the way you look at trading.",
      limited: "Limited seats available",
      registerButton: "Register Now",
      registerInfo: "Registration is open! Limited spots available.",
      whatToExpect: "What will you gain?",
      expectations: [
        "You will learn the Trading Basics",
        "You will learn how to use the applications",
        "You will discover how to win a vacation to Rome for 2 people ✈️",
        "You will learn how to join the monthly competition with prizes worth €2,000 🎉",
        "You will learn trading psychology",
        "You will be able to ask questions in a Q&A session",
      ],
      callToAction: "If you're from Iaşi or nearby, now is the time to take the next step.",
      venueTitle: "Event Venue",
      venueHotel: "Hotel Pleiada",
      venueAddress: "Iași, Romania",
      venueMapLink: "https://maps.google.com/?q=Hotel+Pleiada+Iasi",
      venueMapLabel: "Open in Google Maps",
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Hero Section with Image */}
      <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
        <img
          src="/Iasi.jpg"
          alt="Iași Event"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-16">
          <div className="text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-2 md:mb-4">
              {t.title} <span className="text-amber-400">{t.subtitle}</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="flex items-center gap-2 text-lg md:text-xl text-emerald-400">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-semibold">{t.date}</span>
              </div>
              <span className="hidden md:inline text-gray-400">|</span>
              <div className="flex items-center gap-2 text-lg md:text-xl text-blue-400">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-semibold">{t.location}</span>
              </div>
            </div>
            <p className="text-base md:text-xl text-gray-200 font-medium">
              {t.hero}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">

              {/* Venue Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row">
            {/* Hotel Photo */}
            <div className="relative md:w-2/5 h-56 md:h-auto overflow-hidden">
              <img
                src="/Pleiada.jpg"
                alt="Hotel Pleiada Iași"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent md:bg-gradient-to-r"></div>
            </div>
            {/* Venue Info */}
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
              <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-2">
                📍 {t.venueTitle}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {t.venueHotel}
              </h3>
              <p className="text-gray-400 text-base md:text-lg mb-6">{t.venueAddress}</p>
              <a
                href={t.venueMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm md:text-base font-medium transition-colors group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="group-hover:underline">{t.venueMapLabel}</span>
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        {/* Intro Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-10 mb-8 md:mb-12">
          <p className="text-lg md:text-2xl text-gray-200 text-center mb-6 md:mb-8 leading-relaxed">
            {t.intro}
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {t.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30 rounded-xl p-4 md:p-6 text-center"
              >
                <div className="text-3xl md:text-4xl mb-3">
                  {idx === 0 ? "📊" : idx === 1 ? "🤝" : "🎯"}
                </div>
                <p className="text-sm md:text-base text-gray-200 font-medium">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Message */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6 md:p-10 mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-4 md:mb-6 text-center">
            💡 {t.mainMessage}
          </h2>
          <p className="text-base md:text-xl text-gray-200 leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* What You'll Get */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-10 mb-8 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-6 md:mb-8 text-center">
            {t.dayTitle}
          </h3>
          <div className="space-y-4 md:space-y-6">
            {t.points.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-base md:text-xl text-gray-200 pt-1">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What to Expect Section */}
        <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/30 rounded-2xl p-6 md:p-10 mb-8 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-amber-400 mb-6 md:mb-8 text-center">
            {t.whatToExpect}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {t.expectations.map((expectation, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-gray-800/30 rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/40 transition-all"
              >
                <div className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/40">
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                  {expectation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Free Banner */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-green-600/20 border-2 border-emerald-500/50 rounded-2xl p-6 md:p-10 mb-8 md:mb-12 text-center">
          <h3 className="text-3xl md:text-5xl font-bold text-emerald-400 mb-3 md:mb-4">
            ✨ {t.free} ✨
          </h3>
          <p className="text-lg md:text-2xl text-gray-200 font-medium">
            {t.freeDesc}
          </p>
        </div>

        {/* Registration CTA */}
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-2 border-amber-500/50 rounded-2xl p-6 md:p-10 mb-8 md:mb-12 text-center">
          <h3 className="text-2xl md:text-4xl font-bold text-amber-400 mb-4 md:mb-6">
            🎯 {t.limited}
          </h3>
          <p className="text-base md:text-xl text-gray-200 mb-3 md:mb-4">
            {t.registerInfo}
          </p>
          <p className="text-sm md:text-base text-amber-300/80 italic mb-6 md:mb-8">
            {t.callToAction}
          </p>
          <a
            href="https://linktr.ee/profxromania?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZnRzaAQRgGVleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaerG2Q0QNvA-ncrlYr4vlYzje940VYaMbE7D0bk_LS2I4zGMZ1s7NAk5HTlYw_aem_7CATgdzh2vwk87cOFRXCaA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>{t.registerButton}</span>
          </a>
        </div>

        {/* Additional Info */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="inline-flex flex-col md:flex-row items-center gap-3 md:gap-6 text-gray-400 text-sm md:text-base">
            <div className="flex items-center gap-2">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {language === "ro" ? "10:00 - 18:00" : "10:00 AM - 6:00 PM"}
              </span>
            </div>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center gap-2">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>{language === "ro" ? "Networking" : "Networking"}</span>
            </div>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center gap-2">
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span>{language === "ro" ? "Trading" : "Trading"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrasovEvent;
