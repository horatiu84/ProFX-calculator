import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

// Import imagini pentru mentorii webinar-urilor
import Sergiu from "./pics/Sergiu.jpg";
import John from "./pics/John.jpg";
import Eli from "./pics/Eli.jpg";
import Tudor from "./pics/Tudor.jpg";
import Dan from "./pics/Dan.jpg";
import Adrian from "./pics/Adrian.jpg";

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
    endTime: 21,   // 21:00
    type: "webinar",
    color: "bg-blue-500",
  },
  {
    id: 2,
    dayOfWeek: 2, // Marți
    title: "Webinar Începători",
    subtitle: "Cum să luăm tranzacții în Forex",
    presenters: "Tudor & Dan",
    mentors: [
      { name: "Tudor", img: Tudor },
      { name: "Dan", img: Dan },
    ],
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
    dayOfWeek: 7, // Duminică
    title: "Webinar Backtesting",
    subtitle: "Analiza strategiilor de trading",
    presenters: "Echipa ProFX",
    startTime: 19,
    endTime: 20,
    type: "webinar",
    color: "bg-orange-500",
  },
];

/**
 * Sesiuni live zilnice (Luni-Vineri)
 */
const dailySessions = [
  {
    id: 10,
    title: "Sesiune Live Dimineață",
    startTime: 9,
    endTime: 10,
    type: "session",
    color: "bg-yellow-500",
    daysOfWeek: [1, 2, 3, 4, 5], // Luni-Vineri
  },
  {
    id: 11,
    title: "Sesiune Live Seară",
    startTime: 18,
    endTime: 19,
    type: "session",
    color: "bg-red-500",
    daysOfWeek: [1, 2, 3, 4, 5], // Luni-Vineri
  },
];

/**
 * Generează evenimentele pentru o lună specificată
 */
const generateMonthEvents = (year, month) => {
  const events = [];
  const startOfMonth = DateTime.local(year, month, 1);
  const endOfMonth = startOfMonth.endOf('month');
  
  // Iterează prin toate zilele din lună
  for (let day = 1; day <= endOfMonth.day; day++) {
    const currentDate = DateTime.local(year, month, day);
    const dayOfWeek = currentDate.weekday; // 1 = Luni, 7 = Duminică
    
    // Adaugă webinariile săptămânale
    weeklyEvents.forEach(event => {
      if (event.dayOfWeek === dayOfWeek) {
        events.push({
          ...event,
          date: currentDate.toJSDate(),
          dateString: currentDate.toISODate(),
        });
      }
    });
    
    // Adaugă sesiunile live zilnice
    dailySessions.forEach(session => {
      if (session.daysOfWeek.includes(dayOfWeek)) {
        events.push({
          ...session,
          date: currentDate.toJSDate(),
          dateString: currentDate.toISODate(),
        });
      }
    });
  }
  
  return events;
};

/**
 * Component pentru afișarea unui eveniment în calendar
 */
const EventItem = ({ event }) => {
  const startTime = `${event.startTime.toString().padStart(2, '0')}:00`;
  const endTime = `${event.endTime.toString().padStart(2, '0')}:00`;
  
  return (
    <div className={`${event.color} text-white text-xs p-1 mb-1 rounded cursor-pointer hover:opacity-80 transition-opacity`}>
      <div className="font-semibold truncate">{event.title}</div>
      <div className="opacity-90">{startTime} - {endTime}</div>
    </div>
  );
};

/**
 * Modal pentru afișarea detaliilor unui eveniment
 */
const EventModal = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  const eventDate = DateTime.fromJSDate(event.date);
  const startTime = `${event.startTime.toString().padStart(2, '0')}:00`;
  const endTime = `${event.endTime.toString().padStart(2, '0')}:00`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] rounded-lg p-6 max-w-md w-full text-white">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-yellow-400">{event.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        {event.subtitle && (
          <p className="text-gray-300 mb-3">{event.subtitle}</p>
        )}
        
        <div className="mb-4">
          <p className="font-semibold">Data: {eventDate.toFormat('cccc, dd MMMM yyyy', { locale: 'ro' })}</p>
          <p className="font-semibold">Ora: {startTime} - {endTime}</p>
          {event.presenters && (
            <p className="font-semibold">Prezentatori: {event.presenters}</p>
          )}
        </div>
        
        {event.mentors && event.mentors.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Mentori:</h3>
            <div className="flex flex-wrap gap-3">
              {event.mentors.map((mentor, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <img
                    src={mentor.img}
                    alt={mentor.name}
                    className="w-16 h-16 object-cover rounded-full mb-1"
                  />
                  <span className="text-xs text-center">{mentor.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {event.type === 'webinar' && (
          <div className="mt-4 pt-4 border-t border-gray-700 text-sm">
            <h3 className="font-semibold text-yellow-400 mb-2">🔗 Detalii conectare Zoom</h3>
            <p>
              Link:{" "}
              <a
                href="https://us06web.zoom.us/j/81705355401"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Zoom Link
              </a>
            </p>
            <p>Parolă: <span className="font-bold">2025</span></p>
          </div>
        )}
      </div>
    </div>
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

  // Generează evenimentele pentru luna curentă
  useEffect(() => {
    const monthEvents = generateMonthEvents(currentDate.year, currentDate.month);
    setEvents(monthEvents);
  }, [currentDate]);

  // Navigare între luni
  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.minus({ months: 1 }));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.plus({ months: 1 }));
  };

  const goToToday = () => {
    setCurrentDate(DateTime.now());
  };

  // Obține evenimentele pentru o zi specifică
  const getEventsForDay = (day) => {
    const dateString = DateTime.local(currentDate.year, currentDate.month, day).toISODate();
    return events.filter(event => event.dateString === dateString);
  };

  // Gestionează click-ul pe un eveniment
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Generează zilele lunii pentru calendar
  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');
    
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
    <div className="bg-[#0b0f1a] text-white font-sans max-w-7xl px-4 py-10 mx-auto">
      {/* Header */}
      <div className="w-full text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 tracking-wide mb-4">
          CALENDAR EVENIMENTE PROFX
        </h1>
        
        {/* Controale navigare */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={goToPreviousMonth}
            className="bg-[#1e293b] hover:bg-[#374151] px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            ← Luna anterioară
          </button>
          
          <h2 className="text-2xl font-bold text-yellow-400 min-w-[200px]">
            {currentDate.toFormat('MMMM yyyy', { locale: 'ro' })}
          </h2>
          
          <button
            onClick={goToNextMonth}
            className="bg-[#1e293b] hover:bg-[#374151] px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Luna următoare →
          </button>
        </div>
        
        <button
          onClick={goToToday}
          className="bg-yellow-400 text-black hover:bg-yellow-500 px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          Astăzi
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#111827] rounded-xl p-6 shadow-lg">
        {/* Header zile săptămâna */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'].map(day => (
            <div key={day} className="text-center font-bold text-yellow-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Zilele calendarului */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(day => {
            const isCurrentMonth = day.month === currentDate.month;
            const isToday = day.hasSame(today, 'day');
            const dayEvents = isCurrentMonth ? getEventsForDay(day.day) : [];
            
            return (
              <div
                key={day.toISODate()}
                className={`min-h-[120px] p-2 rounded-lg border transition-colors ${
                  isCurrentMonth 
                    ? 'bg-[#1e293b] border-[#374151]' 
                    : 'bg-[#0f172a] border-[#1e293b] opacity-50'
                } ${
                  isToday ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${
                  isToday ? 'text-yellow-400' : 'text-white'
                }`}>
                  {day.day}
                </div>
                
                {/* Evenimente pentru ziua curentă */}
                <div className="space-y-1">
                  {dayEvents.map((event, idx) => (
                    <div
                      key={`${event.id}-${idx}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <EventItem event={event} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legendă */}
      <div className="mt-8 bg-[#111827] rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-yellow-400 mb-4">Legendă Evenimente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Webinar Gratuit (Luni)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Webinar Începători (Marți)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Webinar Avansați (Joi)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Webinar Backtesting (Duminică)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Sesiune Live Dimineață</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Sesiune Live Seară</span>
          </div>
        </div>
      </div>

      {/* Modal pentru detaliile evenimentului */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProFXCalendar;
