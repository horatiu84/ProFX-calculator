import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "./contexts/LanguageContext";
import VipInfoModal from "./components/VipInfoModal.jsx";
import MihaiVlada from "./pics/Mihai.jpg";
import SergiuC from "./pics/Sergiu.jpg";
import John from "./pics/John.jpg";
import FlaviusR from "./pics/Flavius.jpg";

const WeeklySchedule = () => {
  const { language, translations } = useLanguage();
  const t = translations.program;

  const [activeTab, setActiveTab] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVIP, setIsVIP] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [vipPassword, setVipPassword] = useState("");
  const [vipError, setVipError] = useState("");
  const [pendingSessionLink, setPendingSessionLink] = useState("");
  const [showVipInfoModal, setShowVipInfoModal] = useState(false);
  const [showZoomRedirect, setShowZoomRedirect] = useState(false);
  const [redirectLink, setRedirectLink] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [nextSession, setNextSession] = useState(null);
  const [timeUntilNextSession, setTimeUntilNextSession] = useState(null);

  const VIP_PASSWORD = "VIP2026";

  const daysOfWeek = t.daysOfWeek;

  // Session names with translations
  const sessionNames = {
    asiaWithMihai: t.sessionAsiaWithMihai,
    londonWithFlavius: t.sessionLondonWithFlavius,
    newYorkWithFlavius: t.sessionNewYorkWithFlavius,
    macroAnalysisWithJohn: t.macroAnalysisWithJohn,
    beginnersWebinar: t.beginnersWebinarWithSergiu,
    class1to20: t.class1to20,
  };

  const mentorAvatars = {
    "Mihai Vlada": MihaiVlada,
    "Flavius Radu": FlaviusR,
    "Sergiu Cirstea": SergiuC,
    "John Pometcu": John,
  };

  const sessionLinksByDay = {
    [sessionNames.asiaWithMihai]: {
      0: "https://us06web.zoom.us/j/87842252532", // Luni - VIP
      1: "https://us06web.zoom.us/j/87842252532",// Marți - VIP
      2: "https://us02web.zoom.us/j/83647707202", // Miercuri - FREE
      3: "https://us06web.zoom.us/j/87842252532", // Joi - VIP
      4: "https://us06web.zoom.us/j/87842252532", // Vineri - VIP
    },
    [sessionNames.londonWithFlavius]: {
      0: "https://zoom.us/j/4505052025", // Luni - VIP
      1: "https://zoom.us/j/4505052025", // Marți - VIP
      2: "https://us02web.zoom.us/j/83647707202", // Miercuri - FREE
      3: "https://zoom.us/j/4505052025", // Joi - VIP
      4: "https://zoom.us/j/4505052025", // Vineri - VIP
    },
    [sessionNames.newYorkWithFlavius]: {
      0: "https://zoom.us/j/4505052025", // Luni - VIP
      1: "https://zoom.us/j/4505052025", // Marți - VIP
      2: "https://us02web.zoom.us/j/83647707202", // Miercuri - FREE
      3: "https://zoom.us/j/4505052025", // Joi - VIP
      4: "https://zoom.us/j/4505052025", // Vineri - VIP
    },
    [sessionNames.macroAnalysisWithJohn]: {
      1: "https://us06web.zoom.us/j/82243984757?pwd=QBCn16XU7fwGYYgyPa9jaWmuVfkKrZ.1",
    },
    [sessionNames.beginnersWebinar]: {
      0: "https://us06web.zoom.us/j/84144689182?pwd=uRoZpakhgy7feSR29XDxDf1Q1wRm3J.1",
    },
  };

  const weekdayEvents = [
    { name: sessionNames.asiaWithMihai, time: "03:45", duration: 4 },
    { name: sessionNames.londonWithFlavius, time: "08:45", duration: 1 },
    { name: sessionNames.newYorkWithFlavius, time: "14:45", duration: 1 }, 
  ];
  const specialEvents = {
    0: [
      {
        name: sessionNames.beginnersWebinar,
        time: "20:00",
        duration: 1,
      },
    ],
    1: [
      { name: sessionNames.macroAnalysisWithJohn, time: "12:00", duration: 1 },
      { name: sessionNames.class1to20, time: "20:00", duration: 1 },
    ],
    4: [
      { name: sessionNames.macroAnalysisWithJohn, time: "16:00", duration: 1 },
    ],
  };

  // Helper: calculează timestamp-ul unei sesiuni pentru ziua specificată
  // Orele sunt în fusul orar românesc (Europe/Bucharest) și convertite automat în ora locală
  const getSessionTimestamp = (dayIndex, timeString) => {
    const now = new Date();
    const [hours, minutes] = timeString.split(":").map(Number);
    
    // Calculează ziua săptămânii (0 = Luni, 6 = Duminică)
    const currentDay = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const dayDiff = dayIndex - currentDay;
    
    // Creează data în fusul orar local
    const sessionDate = new Date(now);
    sessionDate.setDate(now.getDate() + dayDiff);
    
    // Construim un string de dată în format ISO pentru timezone România
    const year = sessionDate.getFullYear();
    const month = String(sessionDate.getMonth() + 1).padStart(2, '0');
    const day = String(sessionDate.getDate()).padStart(2, '0');
    
    // Determinăm dacă România este în DST (Daylight Saving Time)
    // România: +2h iarna (EET), +3h vara (EEST)
    // DST: ultima duminică din martie până ultima duminică din octombrie
    const isRomaniaDST = (date) => {
      const year = date.getFullYear();
      
      // Ultima duminică din martie (start DST)
      const march = new Date(year, 2, 31); // 31 martie
      const marchLastSunday = new Date(march.setDate(31 - march.getDay()));
      
      // Ultima duminică din octombrie (end DST)
      const october = new Date(year, 9, 31); // 31 octombrie
      const octoberLastSunday = new Date(october.setDate(31 - october.getDay()));
      
      return date >= marchLastSunday && date < octoberLastSunday;
    };
    
    // Offset România: +3h vara (DST), +2h iarna
    const romaniaOffset = isRomaniaDST(sessionDate) ? 3 : 2;
    
    // Creăm data în UTC, apoi browserul o va converti automat în timezone-ul local
    const utcDate = new Date(Date.UTC(
      year, 
      sessionDate.getMonth(), 
      sessionDate.getDate(), 
      hours - romaniaOffset, // Scădem offset-ul României pentru a obține UTC
      minutes, 
      0
    ));
    
    return utcDate;
  };

  // Helper: găsește următoarea sesiune programată (cea mai apropiată în viitor)
  const findNextSession = () => {
    const now = new Date();
    let closestSession = null;
    let minTimeDiff = Infinity;

    // Verifică toate zilele săptămânii (0-6)
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      // Skip weekend
      if (dayIndex === 5 || dayIndex === 6) continue;

      // Combină evenimentele regulate și speciale pentru ziua respectivă
      const dayEvents = [
        ...weekdayEvents.map((e) => ({ ...e, isWebinar: false })),
        ...(specialEvents[dayIndex] || []).map((e) => ({ ...e, isWebinar: true })),
      ];

      dayEvents.forEach((event) => {
        const sessionTime = getSessionTimestamp(dayIndex, event.time);
        const timeDiff = sessionTime - now;

        // Doar sesiuni viitoare (timeDiff > 0)
        if (timeDiff > 0 && timeDiff < minTimeDiff) {
          minTimeDiff = timeDiff;
          closestSession = {
            ...event,
            dayIndex,
            timestamp: sessionTime,
            timeDiff,
          };
        }
      });
    }

    return closestSession;
  };

  // Helper: formatează timpul rămas (ex: "15m 23s", "2h 30m", "în curs")
  const formatTimeRemaining = (milliseconds) => {
    if (milliseconds < 0) return "în curs";
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Helper: convertește ora din timezone România în timezone local
  const convertRomaniaTimeToLocal = (timeString, dayIndex) => {
    const sessionTimestamp = getSessionTimestamp(dayIndex, timeString);
    const hours = sessionTimestamp.getHours();
    const minutes = sessionTimestamp.getMinutes();
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Helper: formatează intervalul de timp cu ora de sfârșit
  const formatTimeRange = (event, dayIndex) => {
    const sessionTimestamp = getSessionTimestamp(dayIndex, event.time);
    const startHours = sessionTimestamp.getHours();
    const startMinutes = sessionTimestamp.getMinutes();
    
    const endTimestamp = new Date(sessionTimestamp);
    endTimestamp.setHours(endTimestamp.getHours() + (event.duration || 1));
    const endHours = endTimestamp.getHours();
    const endMinutes = endTimestamp.getMinutes();
    
    const startTime = `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    
    return `${startTime} - ${endTime}`;
  };

  // Helper: verifică dacă accesul Zoom este disponibil (10 minute înainte până la final)
  const isZoomAccessAvailable = (event, dayIndex) => {
    const now = new Date();
    const sessionTime = getSessionTimestamp(dayIndex, event.time);
    const sessionEndTime = new Date(sessionTime);
    sessionEndTime.setHours(sessionTime.getHours() + (event.duration || 1));

    const timeDiff = sessionTime - now;
    const ACCESS_WINDOW = 10 * 60 * 1000; // 10 minute în milliseconds

    // Accesul e disponibil cu 10 min înainte sau în timpul sesiunii
    return timeDiff <= ACCESS_WINDOW && now <= sessionEndTime;
  };

  useEffect(() => {
    const vipStatus = sessionStorage.getItem("vipAccess");
    if (vipStatus === "true") setIsVIP(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveTab((p) => (p > 0 ? p - 1 : 6));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveTab((p) => (p < 6 ? p + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const today = new Date().getDay();
    setActiveTab(today === 0 ? 6 : today - 1);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) setDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  // useEffect pentru calculul următoarei sesiuni și update live al countdown-ului
  useEffect(() => {
    const updateNextSession = () => {
      const next = findNextSession();
      setNextSession(next);
      
      if (next) {
        const timeRemaining = next.timestamp - new Date();
        setTimeUntilNextSession(timeRemaining);
      } else {
        setTimeUntilNextSession(null);
      }
    };

    // Calculează inițial
    updateNextSession();

    // Update la fiecare secundă pentru countdown live
    const interval = setInterval(updateNextSession, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showZoomRedirect || !redirectLink) return;

    // Redirect simplu după 1s - folosim location.href pentru compatibilitate mobilă
    const redirectTimer = setTimeout(() => {
      window.location.href = redirectLink;
    }, 1000);

    // Countdown interval (3, 2, 1, 0)
    const countdownInterval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-close după 5s
    const closeTimer = setTimeout(() => {
      setShowZoomRedirect(false);
      setRedirectCountdown(3);
    }, 5000);

    return () => {
      clearTimeout(redirectTimer);
      clearTimeout(closeTimer);
      clearInterval(countdownInterval);
    };
  }, [showZoomRedirect, redirectLink]);

  const isSessionFree = (eventName, dayIndex) => {
    // Sesiunile de Miercuri sunt gratuite (Asia cu Mihai + sesiunile lui Flavius)
    if (dayIndex === 2) {
      // Sesiunea de Asia cu Mihai de Miercuri este gratis
      if (eventName === sessionNames.asiaWithMihai) return true;
      // Sesiunile lui Flavius de Miercuri sunt gratuite
      if (eventName.toLowerCase().includes("flavius")) return true;
    }

    // Webinarul cu Sergiu de Luni este gratuit
    if (dayIndex === 0 && eventName === sessionNames.beginnersWebinar) return true;

    // Sesiunea cu John de Vineri este gratuită
    if (dayIndex === 4 && eventName === sessionNames.macroAnalysisWithJohn) return true;

    // Toate celelalte sesiuni necesită VIP
    return false;
  };

  const getSessionLink = (eventName, dayIndex) =>
    sessionLinksByDay[eventName]?.[dayIndex] || "";

  const extractAllMentors = (eventName) => {
    const mentors = [];
    const lower = eventName.toLowerCase();
    if (lower.includes("mihai")) mentors.push("Mihai Vlada");
    if (lower.includes("flavius")) mentors.push("Flavius Radu");
    if (lower.includes("sergiu")) mentors.push("Sergiu Cirstea");
    if (lower.includes("john")) mentors.push("John Pometcu");
    return mentors;
  };

  const getEventStatus = (event, dayIndex) => {
    const now = new Date();
    const currentDay = now.getDay();
    const mondayBasedCurrentDay = currentDay === 0 ? 6 : currentDay - 1;

    // Dacă e weekend (sâmbătă=5 sau duminică=6)
    if (currentDay === 0 || currentDay === 6) {
      if (dayIndex === 0 || dayIndex === 1) return "scheduled"; // Luni = programat
      if (dayIndex > 1 && dayIndex < 5) return "passed"; // Marți-Vineri = trecut
      return "scheduled"; // Weekend = programat (deși n-ar trebui să apară evenimente)
    }

    if (dayIndex < mondayBasedCurrentDay) return "passed";
    if (dayIndex > mondayBasedCurrentDay) return "scheduled";

    if (dayIndex === mondayBasedCurrentDay) {
      // Folosim getSessionTimestamp pentru conversie corectă timezone
      const eventStartTime = getSessionTimestamp(dayIndex, event.time);
      const eventEndTime = new Date(eventStartTime);
      eventEndTime.setHours(eventStartTime.getHours() + (event.duration || 1));

      if (now >= eventStartTime && now <= eventEndTime) return "live";
      if (now > eventEndTime) return "passed";
      return "scheduled";
    }
    return "scheduled";
  };

  const handleSessionClick = (eventName, dayIndex, event) => {
    const link = getSessionLink(eventName, dayIndex);
    if (!link) return;

    // Verifică dacă accesul Zoom este disponibil (10 minute înainte)
    if (!isZoomAccessAvailable(event, dayIndex)) {
      return; // Nu face nimic dacă e prea devreme
    }

    if (isSessionFree(eventName, dayIndex) || isVIP) {
      setRedirectLink(link);
      setShowZoomRedirect(true);
    } else {
      setPendingSessionLink(link);
      setShowVIPModal(true);
    }
  };

  const hasSessionLink = (eventName, dayIndex) => {
    const link = getSessionLink(eventName, dayIndex);
    return link && link !== "";
  };

  const handleVIPSubmit = () => {
    if (vipPassword === VIP_PASSWORD) {
      setIsVIP(true);
      sessionStorage.setItem("vipAccess", "true");
      setShowVIPModal(false);
      setVipError("");
      setVipPassword("");
      setPendingSessionLink(""); // Clear pending link without redirecting
    } else {
      setVipError("Parolă incorectă! Te rugăm să încerci din nou.");
    }
  };

  const handleVIPLogout = () => {
    setIsVIP(false);
    sessionStorage.removeItem("vipAccess");
  };

  const closeVIPModal = () => {
    setShowVIPModal(false);
    setVipError("");
    setVipPassword("");
    setPendingSessionLink("");
  };

  const handleManualRedirect = () => {
    window.location.href = redirectLink;
  };

  const closeZoomRedirect = () => {
    setShowZoomRedirect(false);
    setRedirectCountdown(3);
  };

  const toggleVipInfoModal = () => setShowVipInfoModal((v) => !v);

  const MentorAvatar = ({ mentorName, size = "sm", status }) => {
    if (!mentorName || !mentorAvatars[mentorName]) return null;
    const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
    return (
      <div className="relative">
        <img
          src={mentorAvatars[mentorName]}
          alt={mentorName}
          className={`${
            sizeClasses[size]
          } rounded-full object-cover border-2 transition-all duration-300 ${
            status === "passed"
              ? "border-gray-600 opacity-50"
              : "border-yellow-400 hover:scale-110"
          }`}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div
          className={`${sizeClasses[size]} rounded-full bg-slate-700 border-2 border-yellow-400 items-center justify-center text-xs font-bold text-yellow-400 hidden`}
        >
          {mentorName.charAt(0)}
        </div>
      </div>
    );
  };

  const MultipleAvatars = ({ mentors, status }) => {
    if (!mentors || mentors.length === 0) return null;
    if (mentors.length === 1)
      return <MentorAvatar mentorName={mentors[0]} size="md" status={status} />;
    return (
      <div className="flex">
        {mentors.slice(0, 3).map((mentor) => (
          <MentorAvatar
            key={mentor}
            mentorName={mentor}
            size="sm"
            status={status}
          />
        ))}
        {mentors.length > 3 && (
          <div
            className={`w-8 h-8 rounded-full bg-slate-600 border-2 border-yellow-400 flex items-center justify-center text-xs font-bold text-white ${
              status === "passed" ? "opacity-50" : ""
            }`}
          >
            +{mentors.length - 3}
          </div>
        )}
      </div>
    );
  };

  const ZoomRedirectOverlay = () => {
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
      const fallbackTimer = setTimeout(() => setShowFallback(true), 3000);
      return () => clearTimeout(fallbackTimer);
    }, []);

    return createPortal(
      <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <div className="relative max-w-lg w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-amber-400/50 rounded-3xl p-8 shadow-2xl" key={`zoom-redirect-${language}`}>
          {/* Close button */}
          <button
            onClick={closeZoomRedirect}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-300"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Rocket spinner */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl animate-pulse">🚀</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2 animate-language-change">
            {t.zoomLaunch}
          </h2>

          {/* Subtitle */}
          <p className="text-gray-400 text-center mb-6 animate-language-change">
            {t.sessionOpens}{" "}
            <span className="text-amber-400 font-bold text-lg">
              {redirectCountdown}
            </span>{" "}
            {redirectCountdown !== 1 ? t.seconds : t.second}
          </p>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-1000 ease-linear"
                style={{
                  width: `${((3 - redirectCountdown) / 3) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Info tooltip */}
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-300 text-center animate-language-change">
              💡 {t.zoomInfo}
            </p>
          </div>

          {/* Manual fallback button */}
          {showFallback && (
            <div className="animate-fade-in">
              <button
                onClick={handleManualRedirect}
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black rounded-xl font-bold transition-all duration-300 transform hover:scale-105 animate-language-change"
              >
                {t.clickToOpen}
              </button>
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  };

  const EventCard = ({ event, dayIndex, isWebinar = false }) => {
    const status = getEventStatus(event, dayIndex);
    const duration = event.duration || 1;
    const mentors = extractAllMentors(event.name);
    const hasLink = hasSessionLink(event.name, dayIndex);
    const isFree = isSessionFree(event.name, dayIndex);
    const zoomAccessAvailable = isZoomAccessAvailable(event, dayIndex);
    const needsVIP = hasLink && !isFree && !isVIP && status !== "passed";
    const isClickable = hasLink && (isFree || isVIP) && status !== "passed" && zoomAccessAvailable;
    
    // Verifică dacă sesiunea conține "(Revine în Ianuarie)" sau "(Returns in January)"
    const isComingSoon = event.name.includes("Revine în Ianuarie") || event.name.includes("Returns in January");
    
    // Verifică dacă această sesiune este următoarea programată
    const isNextSession = nextSession && 
      nextSession.name === event.name && 
      nextSession.dayIndex === dayIndex;

    // Calculează timpul până când accesul Zoom devine disponibil (cu 10 min înainte de sesiune)
    const sessionTime = getSessionTimestamp(dayIndex, event.time);
    const ACCESS_WINDOW = 10 * 60 * 1000; // 10 minute în milliseconds
    const zoomAccessTime = new Date(sessionTime.getTime() - ACCESS_WINDOW); // 10 min înainte
    const timeUntilZoomAccess = zoomAccessTime - new Date();
    const minutesUntilAccess = Math.floor(timeUntilZoomAccess / (60 * 1000));

    return (
      <div
        className={`group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-gray-800/50 hover:border-gray-600/50 overflow-hidden ${
          status === "passed"
            ? "opacity-60"
            : isWebinar
            ? "bg-amber-500/5 border-amber-400/30 hover:border-amber-400/50"
            : ""
        } ${isClickable ? "cursor-pointer" : needsVIP ? "cursor-pointer" : !zoomAccessAvailable && status !== "passed" ? "cursor-not-allowed" : ""}`}
        onClick={
          isClickable
            ? () => handleSessionClick(event.name, dayIndex, event)
            : needsVIP
            ? () => handleSessionClick(event.name, dayIndex, event)
            : undefined
        }
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            isWebinar ? "from-amber-500/5" : "from-blue-500/3"
          } via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        <div className="p-3 md:p-4 relative z-10">
          <div className="flex justify-between items-start mb-2 md:mb-3">
            <div className="flex-1 mr-3">
              <div className="flex items-start gap-3 mb-2">
                <MultipleAvatars mentors={mentors} status={status} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3
                      className={`font-semibold text-sm md:text-base ${
                        status === "passed" ? "text-gray-400" : isComingSoon ? "text-gray-400" : "text-white"
                      }`}
                    >
                      {isComingSoon ? (
                        <>
                          <span className="opacity-60">
                            {event.name.replace(/\s*\((Revine în Ianuarie|Returns in January)\)/i, '')}
                          </span>
                          <span className="ml-2 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-lg shadow-lg">
                            {event.name.match(/\((Revine în Ianuarie|Returns in January)\)/i)?.[1]}
                          </span>
                        </>
                      ) : (
                        event.name
                      )}
                    </h3>
                    {isFree && hasLink && status !== "passed" && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded uppercase">
                        FREE
                      </span>
                    )}
                    {!isFree && hasLink && status !== "passed" && (
                      <span className="px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded uppercase flex items-center gap-1">
                        ⭐ VIP
                      </span>
                    )}
                    {/* Countdown badge pentru următoarea sesiune */}
                    {isNextSession && timeUntilNextSession > 0 && status !== "passed" && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded uppercase flex items-center gap-1">
                        ⏰ {t.startsIn} {formatTimeRemaining(timeUntilNextSession)}
                      </span>
                    )}
                  </div>
                  {mentors.length > 0 && (
                    <p
                      className={`text-xs ${
                        status === "passed" ? "text-gray-500" : isComingSoon ? "text-gray-500 opacity-60" : "text-gray-300"
                      }`}
                    >
                      {mentors.length > 1 ? t.mentors : t.mentor}:{" "}
                      {mentors.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-2 space-y-1 md:space-y-0 mb-1 md:mb-2">
                <div
                  className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium w-fit ${
                    status === "passed"
                      ? "bg-gray-700 text-gray-400"
                      : isComingSoon
                      ? "bg-gray-700 text-gray-500 opacity-70"
                      : "bg-yellow-400 text-black"
                  }`}
                >
                  {formatTimeRange(event, dayIndex)}
                </div>
                {isWebinar && status !== "passed" && (
                  <div className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded uppercase w-fit">
                    {t.webinar}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p
                  className={`text-xs ${
                    status === "passed" ? "text-gray-500" : isComingSoon ? "text-gray-500 opacity-70" : "text-gray-400"
                  }`}
                >
                  {t.duration}: {duration} {duration === 1 ? t.hour : t.hours}
                </p>
                {hasLink && status !== "passed" && (
                  <div className="flex items-center space-x-1 text-xs">
                    {!zoomAccessAvailable ? (
                      // Afișează countdown DOAR pentru următoarea sesiune, altfel text static
                      isNextSession ? (
                        <>
                          <span>🔒</span>
                          <span className="text-orange-400">
                            {t.availableIn} {minutesUntilAccess > 0 ? minutesUntilAccess : 0}m
                          </span>
                        </>
                      ) : (
                        <>
                          <span>🔒</span>
                          <span className="text-gray-400">
                            {t.accessBefore}
                          </span>
                        </>
                      )
                    ) : (isFree || isVIP) ? (
                      <>
                        <span>🔗</span>
                        <span className="text-green-400 font-bold">{t.availableNow}</span>
                      </>
                    ) : (
                      <>
                        <span>🔒</span>
                        <span className="text-amber-400">{t.requiresVip}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              {/* Afișează detalii Zoom pentru sesiunile de Asia cu Mihai când accesul este disponibil */}
              {event.name === sessionNames.asiaWithMihai && zoomAccessAvailable && status !== "passed" && (isFree || isVIP) && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-400/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400 text-lg">🎥</span>
                    <p className="text-xs font-bold text-green-400 uppercase">Zoom Details</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Passcode:</span>
                      <span className="text-white font-mono font-semibold">2026</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Afișează detalii Zoom pentru sesiunile lui Flavius când accesul este disponibil */}
              {(event.name === sessionNames.londonWithFlavius || event.name === sessionNames.newYorkWithFlavius) && zoomAccessAvailable && status !== "passed" && (isFree || isVIP) && (
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-400/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400 text-lg">🎥</span>
                    <p className="text-xs font-bold text-blue-400 uppercase">Zoom Details</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Passcode:</span>
                      <span className="text-white font-mono font-semibold">2026</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold uppercase ${
                status === "live"
                  ? "bg-red-500 text-white animate-pulse"
                  : status === "passed"
                  ? "bg-gray-700 text-gray-400"
                  : "bg-blue-500 text-white"
              }`}
            >
              {status === "live"
                ? `🔴 ${t.live}`
                : status === "passed"
                ? t.past
                : t.scheduled}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDayContent = (dayIndex) => {
    if (dayIndex === 5 || dayIndex === 6) {
      return (
        <div className="flex flex-col items-center justify-center h-48 md:h-64 text-center" key={`weekend-${language}`}>
          <div className="text-4xl md:text-6xl mb-2 md:mb-4">🌴</div>
          <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-1 md:mb-2 animate-language-change">
            {t.relaxation}
          </h2>
          <p className="text-gray-400 text-sm md:text-base animate-language-change">
            {t.weekendRest}
          </p>
        </div>
      );
    }

    const regularEvents = weekdayEvents.map((e) => ({
      ...e,
      isWebinar: false,
    }));
    const webinarEvents = (specialEvents[dayIndex] || []).map((e) => ({
      ...e,
      isWebinar: true,
    }));
    const allEvents = [...regularEvents, ...webinarEvents].sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    return (
      <div className="space-y-3 md:space-y-4">
        <div className="text-center mb-4 md:mb-6" key={`day-header-${language}`}>
          <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-1 md:mb-2 animate-language-change">
            {daysOfWeek[dayIndex]}
          </h2>
          <p className="text-gray-400 text-sm animate-language-change">
            {allEvents.length} {t.eventsScheduled}
          </p>
        </div>
        {allEvents.map((event, index) => (
          <EventCard
            key={index}
            event={event}
            dayIndex={dayIndex}
            isWebinar={event.isWebinar}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white">
      {showZoomRedirect && <ZoomRedirectOverlay />}
      
      {showVIPModal &&
        createPortal(
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border-2 border-amber-400/50 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl" key={`vip-modal-${language}`}>
              <div className="text-center mb-6 animate-language-change">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⭐</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {t.vipAccessRequired}
                </h2>
                <p className="text-gray-400 text-sm">
                  {t.vipSessionOnly}
                </p>
              </div>
              <div className="space-y-4 animate-language-change">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.enterVipPassword}
                  </label>
                  <input
                    type="password"
                    value={vipPassword}
                    onChange={(e) => {
                      setVipPassword(e.target.value);
                      setVipError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVIPSubmit();
                    }}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    placeholder={t.enterPassword}
                    autoFocus
                  />
                  {vipError && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                      <span>⚠️</span>
                      {t.incorrectPassword}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeVIPModal}
                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleVIPSubmit}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                  >
                    {t.verify}
                  </button>
                </div>
              </div>

            </div>
          </div>,
          document.body
        )}

      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6" key={`header-${language}`}>
        <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 text-center hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 animate-language-change">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors duration-300">
              {t.weeklySchedule.split(" ")[0]}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                {t.weeklySchedule.split(" ")[1]}
              </span>
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t.today}{" "}
              <span className="text-amber-400 font-medium">
                {
                  daysOfWeek[
                    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
                  ]
                }
              </span>
              , {currentDateTime.toLocaleDateString(language === "ro" ? "ro-RO" : "en-US")} -{" "}
              {currentDateTime.toLocaleTimeString(language === "ro" ? "ro-RO" : "en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-xs text-blue-400 mt-2 flex items-center justify-center gap-1">
              <span>🌍</span> {t.timezone}
            </p>
            {isVIP && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full">
                <span className="text-lg">⭐</span>
                <span className="text-sm font-medium text-purple-300">
                  {t.vipActive}
                </span>
                <button
                  onClick={handleVIPLogout}
                  className="ml-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 rounded-full text-xs font-medium text-red-300 hover:text-red-200 transition-all duration-300"
                  title={language === "ro" ? "Ieșire VIP" : "Logout VIP"}
                >
                  {language === "ro" ? "🚪 Ieșire" : "🚪 Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banner pentru următoarea sesiune cu countdown */}
      {nextSession && timeUntilNextSession > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6" key={`next-session-${language}`}>
          <div className="relative bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-cyan-900/40 border-2 border-cyan-400/50 rounded-2xl p-4 md:p-5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-cyan-500/5" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 animate-language-change">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl md:text-3xl">⏰</span>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    {t.nextSession}
                  </h3>
                  <p className="text-sm md:text-base text-cyan-300 font-semibold">
                    {nextSession.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {daysOfWeek[nextSession.dayIndex]} • {convertRomaniaTimeToLocal(nextSession.time, nextSession.dayIndex)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    {t.startsIn}
                  </p>
                  <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    {formatTimeRemaining(timeUntilNextSession)}
                  </div>
                </div>
                {isZoomAccessAvailable(nextSession, nextSession.dayIndex) ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/40 rounded-full">
                    <span className="text-xs md:text-sm font-bold text-green-300">
                      🟢 {t.zoomAvailable}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/40 rounded-full">
                    <span className="text-xs md:text-sm font-bold text-orange-300">
                      🔒 {t.accessIn} {Math.max(0, Math.floor((nextSession.timestamp - new Date() - 10 * 60 * 1000) / 60000))}m
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          {isMobile ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-3 flex items-center justify-between text-white hover:bg-gray-800/50 hover:border-amber-400/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-yellow-400">
                    {daysOfWeek[activeTab]}
                  </span>
                  {activeTab ===
                    (new Date().getDay() === 0
                      ? 6
                      : new Date().getDay() - 1) && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    dropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {daysOfWeek.map((day, index) => {
                    const isToday =
                      index ===
                      (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                    const hasEvents = index < 5;
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          setActiveTab(index);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-all duration-300 flex items-center justify-between ${
                          activeTab === index
                            ? "bg-gray-800/50 text-amber-400"
                            : "text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{day}</span>
                          {isToday && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        {hasEvents && (
                          <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-2 rounded-xl">
              {daysOfWeek.map((day, index) => {
                const isToday =
                  index ===
                  (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                const hasEvents = index < 5;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveTab(index)}
                    className={`relative px-3 py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                      activeTab === index
                        ? "bg-amber-400 text-black"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {day}
                    {isToday && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                    {hasEvents && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 md:p-6 min-h-80 md:min-h-96 hover:border-gray-600/50 hover:bg-gray-800/50 transition-all duration-500 hover:scale-[1.01] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">{renderDayContent(activeTab)}</div>
        </div>

        <div className="mt-6 md:mt-8 text-center space-y-4">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs text-gray-500" key={`legend-${language}`}>
            <div className="flex items-center animate-language-change">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              {t.currentDay}
            </div>
            <div className="flex items-center animate-language-change">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              {t.scheduledEvents}
            </div>
            <div className="flex items-center animate-language-change">
              <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
              {t.pastEvents}
            </div>
          </div>
          {!isVIP && (
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-900/30 to-amber-900/30 border border-purple-500/30 rounded-xl p-4" key={`vip-banner-${language}`}>
              <div className="flex items-center justify-center gap-3 flex-wrap animate-language-change">
                <span className="text-2xl">⭐</span>
                <div className="text-left flex-1 min-w-[200px]">
                  <p className="text-sm font-semibold text-white mb-1">
                    {t.wantAccess}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t.becomeVip}
                  </p>
                </div>
                <button
                  onClick={toggleVipInfoModal}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                >
                  {t.learnMore}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <VipInfoModal open={showVipInfoModal} onClose={toggleVipInfoModal} />
    </div>
  );
};

export default WeeklySchedule;
