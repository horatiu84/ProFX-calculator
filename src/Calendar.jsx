import React, { useEffect, useState, useRef } from "react";
import { DateTime } from "luxon";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

// Import imagini pentru mentorii webinar-urilor
import Sergiu from "./pics/Sergiu.jpg";
import John from "./pics/John.jpg";
import Eli from "./pics/Eli.jpg";
import Tudor from "./pics/Tudor.jpg";
import Dan from "./pics/Dan.jpg";
import Adrian from "./pics/Adrian.jpg";
import Mihai from "./pics/Mihai.jpg"; // Nou
import Flavius from "./pics/Flavius.jpg"; // Nou

/**
 * Rotația pentru webinarul de marți (începători)
 */
const tuesdayRotation = [
  { date: "2025-08-26", presenters: "Tudor & Dan", mentors: [{ name: "Tudor", img: Tudor }, { name: "Dan", img: Dan }] },
  { date: "2025-09-02", presenters: "Tudor & Adrian", mentors: [{ name: "Tudor", img: Tudor }, { name: "Adrian", img: Adrian }] },
  { date: "2025-09-09", presenters: "Dan & Adrian", mentors: [{ name: "Dan", img: Dan }, { name: "Adrian", img: Adrian }] },
  { date: "2025-09-16", presenters: "Eli & Tudor", mentors: [{ name: "Eli", img: Eli }, { name: "Tudor", img: Tudor }] },
  { date: "2025-09-23", presenters: "Eli & Dan", mentors: [{ name: "Eli", img: Eli }, { name: "Dan", img: Dan }] },
  { date: "2025-09-30", presenters: "Eli & Adrian", mentors: [{ name: "Eli", img: Eli }, { name: "Adrian", img: Adrian }] },
  { date: "2025-10-07", presenters: "Tudor & Dan", mentors: [{ name: "Tudor", img: Tudor }, { name: "Dan", img: Dan }] },
  { date: "2025-10-14", presenters: "Tudor & Adrian", mentors: [{ name: "Tudor", img: Tudor }, { name: "Adrian", img: Adrian }] },
  { date: "2025-10-21", presenters: "Dan & Adrian", mentors: [{ name: "Dan", img: Dan }, { name: "Adrian", img: Adrian }] },
  { date: "2025-10-28", presenters: "Eli & Tudor", mentors: [{ name: "Eli", img: Eli }, { name: "Tudor", img: Tudor }] },
];

/**
 * Găsește rotația pentru o dată specificată (marți)
 */
const getTuesdayRotation = (dateString) => {
  const rotation = tuesdayRotation.find((r) => r.date === dateString);
  return (
    rotation || {
      presenters: "Tudor & Dan",
      mentors: [
        { name: "Tudor", img: Tudor },
        { name: "Dan", img: Dan },
      ],
    }
  );
};

/**
 * Evenimente recurente săptămânale
 */
const weeklyEvents = [
  {
    id: 1,
    dayOfWeek: 1, // Luni
    title: "Webinar Gratuit",
    subtitle: "Ce este tradingul și cum poți învăța Gratuit cu ProFX?",
    presenters: "Sergiu Cîrstea & Ionuț Pometcu",
    mentors: [
      { name: "Sergiu Cîrstea", img: Sergiu },
      { name: "Ionuț Pometcu", img: John },
    ],
    startTime: 20, // 20:00
    endTime: 21, // 21:00
    type: "webinar",
    color: "bg-blue-500",
  },
  {
    id: 2,
    dayOfWeek: 2, // Marți - va fi populat dinamic cu rotația
    title: "Webinar Începători",
    subtitle: "Cum să luăm tranzacții în Forex",
    presenters: "", // Va fi setat dinamic
    mentors: [], // Va fi setat dinamic
    startTime: 20,
    endTime: 21,
    type: "webinar",
    color: "bg-green-500",
  },
  {
    id: 3,
    dayOfWeek: 4, // Joi
    title: "Webinar Avansați",
    subtitle: "Trading avansat cu Ionuț Pometcu",
    presenters: "Ionuț Pometcu",
    mentors: [{ name: "Ionuț Pometcu", img: John }],
    startTime: 20,
    endTime: 21,
    type: "webinar",
    color: "bg-purple-500",
  },
  {
    id: 4,
    dayOfWeek: 3, // Miercuri
    title: "Webinar Backtesting",
    subtitle: "Analiza strategiilor de trading",
    presenters: "Echipa ProFX",
    startTime: 21,
    endTime: 23,
    type: "webinar",
    color: "bg-orange-500",
  },
];

/**
 * Sesiuni live zilnice (Luni-Vineri) - ACTUALIZATE
 */
const dailySessions = [
  {
    id: 10,
    title: "Sesiune Trade Asia",
    presenter: "Mihai",
    mentors: [{ name: "Mihai", img: Mihai }],
    startTime: 3.75, // 3:45 AM
    endTime: 4.75, // 4:45 AM (aprox)
    type: "session",
    color: "bg-cyan-500",
    daysOfWeek: [1, 2, 3, 4, 5],
  },
  {
    id: 11,
    title: "Sesiune Londra",
    presenter: "Flavius",
    mentors: [{ name: "Flavius", img: Flavius }],
    startTime: 8.75, // 9:45 AM
    endTime: 9.75, // 10:45 AM (aprox)
    type: "session",
    color: "bg-yellow-500",
    daysOfWeek: [1, 2, 3, 4, 5],
  },
  {
    id: 12,
    title: "Sesiune New York",
    presenter: "Flavius",
    mentors: [{ name: "Flavius", img: Flavius }],
    startTime: 14.75, // 14:45
    endTime: 15.75, // 15:45 (aprox)
    type: "session",
    color: "bg-red-500",
    daysOfWeek: [1, 2, 3, 4, 5],
  },
];

/**
 * Analize săptămânale
 */
const weeklyAnalysis = [
  {
    id: 20,
    dayOfWeek: 1, // Luni
    title: "Analiză Săptămânală",
    subtitle: "Pregătirea pieței pentru săptămâna curentă",
    presenters: "Ionuț Pometcu",
    mentors: [{ name: "Ionuț Pometcu", img: John }],
    startTime: 10,
    endTime: 11,
    type: "analysis",
    color: "bg-indigo-500",
  },
  {
    id: 21,
    dayOfWeek: 5, // Vineri
    title: "Analiză Săptămânală",
    subtitle: "Recapitularea săptămânii de trading",
    presenters: "Ionuț Pometcu",
    mentors: [{ name: "Ionuț Pometcu", img: John }],
    startTime: 16,
    endTime: 17,
    type: "analysis",
    color: "bg-indigo-500",
  },
];

/**
 * Formatează timpul pentru afișare
 */
const formatTime = (timeFloat) => {
  const hours = Math.floor(timeFloat);
  const minutes = Math.round((timeFloat - hours) * 60);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

/**
 * Generează evenimentele pentru o lună specificată
 */
const generateMonthEvents = (year, month) => {
  const events = [];
  const startOfMonth = DateTime.local(year, month, 1);
  const endOfMonth = startOfMonth.endOf("month");

  for (let day = 1; day <= endOfMonth.day; day++) {
    const currentDate = DateTime.local(year, month, day);
    const dayOfWeek = currentDate.weekday; // 1 = Luni, 7 = Duminică
    const dateString = currentDate.toISODate();

    // Webinarii
    weeklyEvents.forEach((event) => {
      if (event.dayOfWeek === dayOfWeek) {
        let eventToAdd = { ...event };
        if (event.id === 2) {
          const rotation = getTuesdayRotation(dateString);
          eventToAdd.presenters = rotation.presenters;
          eventToAdd.mentors = rotation.mentors;
        }
        events.push({
          ...eventToAdd,
          date: currentDate.toJSDate(),
          dateString,
        });
      }
    });

    // Sesiuni zilnice
    dailySessions.forEach((session) => {
      if (session.daysOfWeek.includes(dayOfWeek)) {
        events.push({
          ...session,
          date: currentDate.toJSDate(),
          dateString,
        });
      }
    });

    // Analize
    weeklyAnalysis.forEach((analysis) => {
      if (analysis.dayOfWeek === dayOfWeek) {
        events.push({
          ...analysis,
          date: currentDate.toJSDate(),
          dateString,
        });
      }
    });
  }

  return events;
};

/**
 * Item eveniment în celulă de calendar
 */
const EventItem = ({ event }) => {
  const startTime = formatTime(event.startTime);
  const endTime = formatTime(event.endTime);

  return (
    <div className={`${event.color} text-white text-xs p-1 mb-1 rounded cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="font-semibold truncate">{event.title}</div>
      <div className="opacity-90">{startTime} - {endTime}</div>
    </div>
  );
};

/**
 * Modal pentru detaliile unui eveniment — PORTAL + FOCUS TRAP
 */
const EventModal = ({ event, isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // montează doar pe client
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // body lock + ESC + focus trap + restore focus
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Tab") {
        const root = modalRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement;
      document.addEventListener("keydown", onKey);
      document.body.classList.add("overflow-hidden");
      setTimeout(() => {
        if (closeBtnRef.current) closeBtnRef.current.focus();
        else modalRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
      const prev = previouslyFocusedRef.current;
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event || !mounted) return null;

  const eventDate = DateTime.fromJSDate(event.date);
  const startTime = formatTime(event.startTime);
  const endTime = formatTime(event.endTime);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
          aria-labelledby="event-modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Conținut modal */}
          <motion.div
            ref={modalRef}
            className="relative bg-[#1e293b] rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md text-white max-h-[min(90dvh,700px)] overflow-y-auto shadow-2xl focus:outline-none"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            tabIndex={-1}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 id="event-modal-title" className="text-lg sm:text-xl font-bold text-yellow-400 pr-2">
                {event.title}
              </h2>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl flex-shrink-0 ml-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                aria-label="Închide"
              >
                ×
              </button>
            </div>

            {event.subtitle && (
              <p className="text-gray-300 mb-3 text-sm sm:text-base">{event.subtitle}</p>
            )}

            <div className="mb-4 text-sm sm:text-base">
              <p className="font-semibold mb-1">
                Data: {eventDate.toFormat("cccc, dd MMMM yyyy", { locale: "ro" })}
              </p>
              <p className="font-semibold mb-1">Ora: {startTime} - {endTime}</p>
              {event.presenters && <p className="font-semibold mb-1">Prezentatori: {event.presenters}</p>}
              {event.presenter && <p className="font-semibold mb-1">Prezentator: {event.presenter}</p>}
            </div>

            {event.mentors && event.mentors.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Mentori:</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {event.mentors.map((mentor, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <img src={mentor.img} alt={mentor.name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full mb-1" />
                      <span className="text-xs text-center">{mentor.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.type === "webinar" && (
              <div className="mt-4 pt-4 border-t border-gray-700 text-sm">
                <h3 className="font-semibold text-yellow-400 mb-2">🔗 Detalii conectare Zoom</h3>
                <p className="mb-1">
                  Link:{" "}
                  <a
                    href="https://us06web.zoom.us/j/81705355401"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline break-all"
                  >
                    Zoom Link
                  </a>
                </p>
                <p>Parolă: <span className="font-bold">2025</span></p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

/**
 * Componenta principală Calendar
 */
const ProFXCalendar = () => {
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectează mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generează evenimentele pentru luna curentă
  useEffect(() => {
    const monthEvents = generateMonthEvents(currentDate.year, currentDate.month);
    setEvents(monthEvents);
  }, [currentDate]);

  // Navigare între luni
  const goToPreviousMonth = () => setCurrentDate(currentDate.minus({ months: 1 }));
  const goToNextMonth     = () => setCurrentDate(currentDate.plus({ months: 1 }));
  const goToToday         = () => setCurrentDate(DateTime.now());

  // Evenimentele pentru o zi (sortate)
  const getEventsForDay = (day) => {
    const dateString = DateTime.local(currentDate.year, currentDate.month, day).toISODate();
    return events
      .filter((event) => event.dateString === dateString)
      .sort((a, b) => a.startTime - b.startTime);
  };

  // Click pe eveniment
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Zilele din grilă (cu „umplere” la început/sfârșit de lună)
  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startOfWeek = startOfMonth.startOf("week");
    const endOfWeek = endOfMonth.endOf("week");

    const days = [];
    let day = startOfWeek;
    while (day <= endOfWeek) {
      days.push(day);
      day = day.plus({ days: 1 });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = DateTime.now();

  return (
    <div className="bg-[#0b0f1a] text-white font-sans max-w-7xl px-2 sm:px-4 py-4 sm:py-10 mx-auto">
      {/* Header */}
      <div className="w-full text-center mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-yellow-400 tracking-wide mb-2 sm:mb-4">
          CALENDAR EVENIMENTE PROFX
        </h1>

        {/* Controale navigare */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={goToPreviousMonth} className="bg-[#1e293b] hover:bg-[#374151] px-3 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base">
              {isMobile ? "← Ant." : "← Luna anterioară"}
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 min-w-[150px] sm:min-w-[200px]">
              {currentDate.toFormat("MMMM yyyy", { locale: "ro" })}
            </h2>

            <button onClick={goToNextMonth} className="bg-[#1e293b] hover:bg-[#374151] px-3 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base">
              {isMobile ? "Urm. →" : "Luna următoare →"}
            </button>
          </div>

          <button onClick={goToToday} className="bg-yellow-400 text-black hover:bg-yellow-500 px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base">
            Astăzi
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#111827] rounded-xl p-2 sm:p-6 shadow-lg">
        {/* Header zile săptămână */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
          {["L", "Ma", "Mi", "J", "V", "S", "D"].map((d, i) => {
            const full = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];
            return (
              <div key={d} className="text-center font-bold text-yellow-400 py-1 sm:py-2 text-xs sm:text-base">
                {isMobile ? d : full[i]}
              </div>
            );
          })}
        </div>

        {/* Zilele calendarului */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day) => {
            const isCurrentMonth = day.month === currentDate.month;
            const isToday = day.hasSame(today, "day");
            const dayEvents = isCurrentMonth ? getEventsForDay(day.day) : [];

            return (
              <div
                key={day.toISODate()}
                className={`min-h-[60px] sm:min-h-[120px] p-1 sm:p-2 rounded-lg border transition-colors ${
                  isCurrentMonth ? "bg-[#1e293b] border-[#374151]" : "bg-[#0f172a] border-[#1e293b] opacity-50"
                } ${isToday ? "ring-1 sm:ring-2 ring-yellow-400" : ""}`}
              >
                <div className={`text-xs sm:text-sm font-semibold mb-1 ${isToday ? "text-yellow-400" : "text-white"}`}>
                  {day.day}
                </div>

                <div className="space-y-1">
                  {isMobile ? (
                    dayEvents.length > 0 && (
                      <div
                        onClick={() => handleEventClick(dayEvents[0])}
                        className="bg-yellow-500 text-black text-xs p-1 rounded cursor-pointer text-center font-bold"
                      >
                        {dayEvents.length} event{dayEvents.length > 1 ? "e" : ""}
                      </div>
                    )
                  ) : (
                    dayEvents.map((event, idx) => (
                      <div key={`${event.id}-${idx}`} onClick={() => handleEventClick(event)}>
                        <EventItem event={event} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legendă */}
      <div className="mt-4 sm:mt-8 bg-[#111827] rounded-xl p-3 sm:p-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-bold text-yellow-400 mb-3 sm:mb-4">Legendă Evenimente</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded" /><span>Webinar Gratuit (Luni)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded" /><span>Webinar Începători (Marți)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded" /><span>Webinar Avansați (Joi)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded" /><span>Webinar Backtesting (Miercuri)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-cyan-500 rounded" /><span>Trade Asia (3:45 AM)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded" /><span>Londra (8:45 AM)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded" /><span>New York (2:45 PM)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 sm:w-4 sm:h-4 bg-indigo-500 rounded" /><span>Analiză Săptămânală</span></div>
        </div>
      </div>

      {/* Modal */}
      <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProFXCalendar;
