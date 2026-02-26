import React, { useState, useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";

const BootcampRoma = () => {
  const { language } = useLanguage();
  const [activeModule, setActiveModule] = useState(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown to May 20, 2026
  useEffect(() => {
    const target = new Date("2026-05-20T09:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const content = {
    ro: {
      badge: "TRADING BOOTCAMP ACCELERATOR",
      title: "Trading Bootcamp",
      titleAccent: "Accelerator",
      location: "Roma, Italia",
      date: "20 - 24 Mai 2026",
      duration: "5 zile intensive",
      heroSubtitle:
        "Fundația ta ca trader începe aici. 5 zile de Trading Live, Dezvoltare Personală, Socializare — alături de mentori experimentați și o comunitate de excepție.",
      countdownTitle: "Bootcamp-ul începe în:",
      days: "Zile",
      hours: "Ore",
      minutes: "Min",
      seconds: "Sec",
      invitatiTitle: "Invitații Noștri",
      invitatiSubtitle:
        "Mentori și traderi profesioniști care îți vor ghida parcursul pe parcursul celor 5 zile.",
      modulesTitle: "Ce Vei Învăța",
      modulesSubtitle:
        "Un curriculum complet, creat să te transforme dintr-un începător într-un trader disciplinat.",
      modules: [
        {
          icon: "📚",
          title: "Lecții de trading cu mentori",
          desc: "Învață direct de la traderi experimentați care activează zilnic pe piețe.",
        },
        {
          icon: "🎯",
          title: "Sesiuni practice de trading",
          desc: "Pune în practică tot ce înveți prin exerciții reale, în timp real.",
        },
        {
          icon: "📡",
          title: "Live trading",
          desc: "Urmărește sesiuni live de tranzacționare și înțelege procesul decizional.",
        },
        {
          icon: "⚡",
          title: "Strategii de trading",
          desc: "Descoperă strategii testate și validate de profesioniști.",
        },
        {
          icon: "🧠",
          title: "Psihologie în trading",
          desc: "Învață să-ți gestionezi emoțiile și să iei decizii raționale sub presiune.",
        },
        {
          icon: "🎓",
          title: "Educație financiară",
          desc: "Construiește o bază solidă de cunoștințe financiare esențiale.",
        },
        {
          icon: "📊",
          title: "Analiză tehnică pas cu pas",
          desc: "Stăpânește instrumentele de analiză tehnică de la zero la avansat.",
        },
        {
          icon: "📋",
          title: "Plan de trading personalizat",
          desc: "Creează-ți propriul plan de trading adaptat stilului tău.",
        },
        {
          icon: "🛡️",
          title: "Risk management aplicat",
          desc: "Protejează-ți capitalul prin tehnici avansate de gestionare a riscului.",
        },
        {
          icon: "🔍",
          title: "Studii de caz reale din piață",
          desc: "Analizează situații reale din piață și învață din ele.",
        },
        {
          icon: "🔄",
          title: "Backtesting ghidat",
          desc: "Testează-ți strategiile pe date istorice cu ghidaj profesionist.",
        },
        {
          icon: "⏰",
          title: "Rutina de trader",
          desc: "Construiește o rutină zilnică care te menține disciplinat și consistent.",
        },
        {
          icon: "💎",
          title: "Controlul emoțiilor în piață",
          desc: "Tehnici practice pentru a rămâne calm și focusat în momentele critice.",
        },
        {
          icon: "🏗️",
          title: "Framework complet de tranzacționare",
          desc: "Un sistem care unește analiza, psihologia și managementul riscului.",
        },
        {
          icon: "🤝",
          title: "Comunitate de traderi",
          desc: "Conectează-te cu traderi la fel ca tine, construiește relații valoroase.",
        },
      ],
      highlightsTitle: "De Ce Roma?",
      highlights: [
        {
          title: "Locație Inspirațională",
          desc: "Un oraș simbol al disciplinei, strategiei și ambiției — cadrul ideal pentru transformare reală.",
          icon: "🏛️",
        },
        {
          title: "Experiență Completă",
          desc: "Trading Live, Dezvoltare Personală, Socializare și MULTĂ Distracție — 5 zile care îți schimbă perspectiva.",
          icon: "🎯",
        },
        {
          title: "Networking de Elită",
          desc: "Intră într-un cerc restrâns de oameni orientați spre performanță și creștere reală.",
          icon: "🌍",
        },
      ],
      ctaTitle: "Ești Pregătit Să Faci Pasul?",
      ctaDesc:
        "Locurile sunt limitate. Asigură-ți locul acum și începe transformarea ta ca trader.",
      ctaButton: "Înscrie-te Acum",
      ctaInfo: "Înscrierile se vor deschide în curând",
    },
    en: {
      badge: "TRADING BOOTCAMP ACCELERATOR",
      title: "Trading Bootcamp",
      titleAccent: "Accelerator",
      location: "Rome, Italy",
      date: "May 20 - 24, 2026",
      duration: "5 intensive days",
      heroSubtitle:
        "Your trading foundation starts here. 5 days of Live Trading, Personal Development, Socializing and A LOT of Fun — alongside experienced mentors and an exceptional community.",
      countdownTitle: "Bootcamp starts in:",
      days: "Days",
      hours: "Hours",
      minutes: "Min",
      seconds: "Sec",
      invitatiTitle: "Our Guests",
      invitatiSubtitle:
        "Professional mentors and traders who will guide your journey throughout the 5 days.",
      modulesTitle: "What You Will Learn",
      modulesSubtitle:
        "A complete curriculum designed to transform you from a beginner into a disciplined trader.",
      modules: [
        {
          icon: "📚",
          title: "Trading lessons with mentors",
          desc: "Learn directly from experienced traders who are active daily in the markets.",
        },
        {
          icon: "🎯",
          title: "Practical trading sessions",
          desc: "Put everything you learn into practice through real exercises, in real time.",
        },
        {
          icon: "📡",
          title: "Live trading",
          desc: "Watch live trading sessions and understand the decision-making process.",
        },
        {
          icon: "⚡",
          title: "Trading strategies",
          desc: "Discover strategies tested and validated by professionals.",
        },
        {
          icon: "🧠",
          title: "Trading psychology",
          desc: "Learn to manage your emotions and make rational decisions under pressure.",
        },
        {
          icon: "🎓",
          title: "Financial education",
          desc: "Build a solid foundation of essential financial knowledge.",
        },
        {
          icon: "📊",
          title: "Step-by-step technical analysis",
          desc: "Master technical analysis tools from zero to advanced.",
        },
        {
          icon: "📋",
          title: "Personalized trading plan",
          desc: "Create your own trading plan adapted to your style.",
        },
        {
          icon: "🛡️",
          title: "Applied risk management",
          desc: "Protect your capital through advanced risk management techniques.",
        },
        {
          icon: "🔍",
          title: "Real market case studies",
          desc: "Analyze real market situations and learn from them.",
        },
        {
          icon: "🔄",
          title: "Guided backtesting",
          desc: "Test your strategies on historical data with professional guidance.",
        },
        {
          icon: "⏰",
          title: "Trader routine",
          desc: "Build a daily routine that keeps you disciplined and consistent.",
        },
        {
          icon: "💎",
          title: "Emotion control in the market",
          desc: "Practical techniques to stay calm and focused in critical moments.",
        },
        {
          icon: "🏗️",
          title: "Complete trading framework",
          desc: "A comprehensive system that integrates all trading components.",
        },
        {
          icon: "🤝",
          title: "Trader community",
          desc: "Connect with traders like you, build valuable relationships.",
        },
      ],
      highlightsTitle: "Why Rome?",
      highlights: [
        {
          title: "Inspirational Location",
          desc: "Rome provides the perfect setting for an intensive learning experience, away from daily routine.",
          icon: "🏛️",
        },
        {
          title: "Total Immersion",
          desc: "Live Trading, Personal Development, Socializing and A LOT of Fun — 5 days that will change your perspective.",
          icon: "🎯",
        },
        {
          title: "Elite Networking",
          desc: "Meet traders from all over Europe and build your professional network.",
          icon: "🌍",
        },
      ],
      ctaTitle: "Are You Ready to Take the Step?",
      ctaDesc:
        "Seats are limited. Secure your spot now and start your transformation as a trader.",
      ctaButton: "Register Now",
      ctaInfo: "Registration will open soon",
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      {/* Hero Section */}
      <div className="relative w-full min-h-[100vh] flex flex-col justify-between px-4 pt-16 pb-12 overflow-hidden">
        {/* Background image */}
        <img
          src="/BootcampRoma/cityscaperome.jpg"
          alt="Roma"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        {/* Lighter overlay — stronger only at very top and bottom edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-gray-900/50" />

        {/* Top block — badge + title */}
        <div className="relative z-10 text-center max-w-5xl mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-black/30 border border-amber-500/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-amber-400">
              {t.badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-0 leading-tight drop-shadow-2xl">
            {t.title}
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              {t.titleAccent}
            </span>
          </h1>
        </div>

        {/* Bottom block — location, subtitle, countdown — sits near bottom so image breathes in the middle */}
        <div className="relative z-10 text-center max-w-5xl mx-auto w-full">
          {/* Location badge */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
              <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-lg font-semibold text-rose-400">{t.location}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-lg font-semibold text-emerald-400">{t.date}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-semibold text-blue-400">{t.duration}</span>
            </div>
          </div>

          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-lg">
            {t.heroSubtitle}
          </p>

          {/* Countdown */}
          <div className="mb-0">
            <p className="text-sm md:text-base text-gray-300 mb-4 font-medium tracking-wide">
              {t.countdownTitle}
            </p>
            <div className="flex items-center justify-center gap-3 md:gap-5">
              {[
                { val: countdown.days, label: t.days },
                { val: countdown.hours, label: t.hours },
                { val: countdown.minutes, label: t.minutes },
                { val: countdown.seconds, label: t.seconds },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-black/40 backdrop-blur-md border border-gray-600/40 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/10">
                    <span className="text-2xl md:text-3xl font-bold text-amber-400 tabular-nums">
                      {String(item.val).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm text-gray-400 mt-2 font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        {/* Invitati (Guests) Section */}
        <div className="mb-16 md:mb-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.invitatiTitle}
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              {t.invitatiSubtitle}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full mt-4" />
          </div>

          <div className="relative group max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/15 via-amber-500/15 to-emerald-500/15 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl p-2 md:p-3">
              <img
                src="/BootcampRoma/Invitati.jpeg"
                alt={t.invitatiTitle}
                className="w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>

        {/* Modules / What You'll Learn */}
        <div className="mb-16 md:mb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.modulesTitle}
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              {t.modulesSubtitle}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {t.modules.map((mod, idx) => (
              <div
                key={idx}
                className={`group relative bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-5 md:p-6 cursor-pointer transition-all duration-500 hover:scale-[1.03] overflow-hidden ${
                  activeModule === idx
                    ? "border-amber-400/50 bg-gray-800/60"
                    : "border-gray-700/50 hover:border-amber-400/30"
                }`}
                onClick={() =>
                  setActiveModule(activeModule === idx ? null : idx)
                }
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-11 h-11 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                      {mod.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-100 group-hover:text-amber-300 transition-colors duration-300 mb-1">
                        {mod.title}
                      </h4>
                      <p
                        className={`text-sm text-gray-400 leading-relaxed transition-all duration-300 ${
                          activeModule === idx
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0 md:max-h-40 md:opacity-100"
                        } overflow-hidden`}
                      >
                        {mod.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Rome Section */}
        <div className="mb-16 md:mb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t.highlightsTitle}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {t.highlights.map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.03] overflow-hidden text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-amber-400 mb-3 group-hover:text-amber-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
          <div className="relative bg-gray-900/60 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-8 md:p-14 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
                {t.ctaTitle}
              </h2>
              <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                {t.ctaDesc}
              </p>
              <p className="text-sm md:text-base text-gray-400 mb-6">
                {t.ctaInfo}
              </p>
              <button
                disabled
                className="inline-flex items-center gap-3 bg-gray-700/60 backdrop-blur-sm text-gray-400 font-bold text-lg md:text-xl px-10 md:px-14 py-4 md:py-5 rounded-2xl cursor-not-allowed opacity-60 border border-gray-600/50"
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
                <span>{t.ctaButton}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootcampRoma;
