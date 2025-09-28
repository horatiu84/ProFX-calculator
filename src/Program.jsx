import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import MihaiVlada from './pics/Mihai.jpg';
import SergiuC from './pics/Sergiu.jpg';
import John from './pics/John.jpg';
import FlaviusR from './pics/Flavius.jpg';

const WeeklySchedule = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const daysOfWeek = [
    "LUNI",
    "MARȚI",
    "MIERCURI",
    "JOI",
    "VINERI",
    "SÂMBĂTĂ",
    "DUMINICĂ",
  ];

  // Avatarurile mentorilor
  const mentorAvatars = {
    "Mihai Vlada": MihaiVlada,
    "Flavius Radu": FlaviusR,
    "Sergiu Cirstea": SergiuC,
    "John Pometcu": John
  };

  // Link-urile pentru sesiuni
  const sessionLinks = {
    "Sesiune Asia cu Mihai": "https://us06web.zoom.us/j/83711922820?pwd=TZsnKZAW7menapFMuqpu5CTyi2Alzv.1",
    "Sesiune Londra cu Flavius": "", // Va fi completat mai târziu
    "Sesiune New York cu Flavius": "", // Va fi completat mai târziu
  };

  // Funcție pentru a extrage numele mentorului din textul evenimentului
  const extractMentorName = (eventName) => {
    const lowerName = eventName.toLowerCase();
    if (lowerName.includes("mihai")) return "Mihai Vlada";
    if (lowerName.includes("flavius")) return "Flavius Radu";
    if (lowerName.includes("sergiu")) return "Sergiu Cirstea";
    if (lowerName.includes("john")) return "John Pometcu";
    return null;
  };

  // Funcție pentru a extrage toți mentorii dintr-un eveniment
  const extractAllMentors = (eventName) => {
    const mentors = [];
    const lowerName = eventName.toLowerCase();
    
    if (lowerName.includes("mihai")) mentors.push("Mihai Vlada");
    if (lowerName.includes("flavius")) mentors.push("Flavius Radu");
    if (lowerName.includes("sergiu")) mentors.push("Sergiu Cirstea");
    if (lowerName.includes("john")) mentors.push("John Pometcu");
    
    return mentors;
  };

  const weekdayEvents = [
    { name: "Sesiune Asia cu Mihai", time: "03:45", duration: 2 },
    { name: "Sesiune Londra cu Flavius", time: "08:45", duration: 1 },
    { name: "Sesiune New York cu Flavius", time: "14:45", duration: 1 },
  ];

  const specialEvents = {
    0: [
      { name: "Analiza macro saptamanala cu John", time: "10:00", duration: 1 },
      {
        name: "Webinar începători cu Sergiu și John",
        time: "20:00",
        duration: 1,
      },
    ], // Luni
    1: [{ name: "Webinar începători", time: "20:00", duration: 1 }], // Marți
    //3: [{ name: "Webinar avansați cu John", time: "20:00", duration: 1 }], // Joi
    4: [
      { name: "Analiza macro saptamanala cu John", time: "16:00", duration: 1 },
    ], // Vineri
  };

  // Navigare cu tastatura - LEFT/RIGHT arrows
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Verificăm dacă nu suntem într-un input sau textarea
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveTab(prevTab => prevTab > 0 ? prevTab - 1 : 6); // Merge la ultima zi dacă suntem la prima
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveTab(prevTab => prevTab < 6 ? prevTab + 1 : 0); // Merge la prima zi dacă suntem la ultima
      }
    };

    // Adăugăm event listener-ul
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Detectează dimensiunea ecranului pentru mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Actualizează ora curentă la fiecare minut
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Setează tab-ul activ la ziua curentă
  useEffect(() => {
    const today = new Date().getDay();
    const mondayBasedDay = today === 0 ? 6 : today - 1;
    setActiveTab(mondayBasedDay);
  }, []);

  // Închide dropdown-ul când se face click afară
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  const getEventStatus = (event, dayIndex) => {
  const now = new Date();
  const currentDay = now.getDay();
  const mondayBasedCurrentDay = currentDay === 0 ? 6 : currentDay - 1;

  // Dacă suntem duminică (currentDay === 0), toate evenimentele săptămânii următoare sunt "scheduled"
  if (currentDay === 0) {
    return "scheduled";
  }

  // Dacă evenimentul e într-o zi trecută
  if (dayIndex < mondayBasedCurrentDay) {
    return "passed";
  }

  // Dacă evenimentul e într-o zi viitoare
  if (dayIndex > mondayBasedCurrentDay) {
    return "scheduled";
  }

  // Dacă evenimentul e în ziua curentă
  if (dayIndex === mondayBasedCurrentDay) {
    const [hours, minutes] = event.time.split(":").map(Number);
    const eventStartTime = new Date();
    eventStartTime.setHours(hours, minutes, 0, 0);

    const eventEndTime = new Date(eventStartTime);
    eventEndTime.setHours(hours + (event.duration || 1), minutes, 0, 0);

    if (now >= eventStartTime && now <= eventEndTime) {
      return "live";
    } else if (now > eventEndTime) {
      return "passed";
    } else {
      return "scheduled";
    }
  }

  return "scheduled";
};

  // Funcție pentru a gestiona click-ul pe sesiune
  const handleSessionClick = (eventName) => {
    const link = sessionLinks[eventName];
    if (link) {
      window.open(link, '_blank');
    }
  };

  // Verifică dacă evenimentul are link disponibil
  const hasSessionLink = (eventName) => {
    return sessionLinks[eventName] && sessionLinks[eventName] !== "";
  };

  // Componenta pentru avatar-ul mentorului
  const MentorAvatar = ({ mentorName, size = "sm", status }) => {
    if (!mentorName || !mentorAvatars[mentorName]) return null;

    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12"
    };

    return (
      <div className="relative">
        <img
          src={mentorAvatars[mentorName]}
          alt={mentorName}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 transition-all duration-300 ${
            status === "passed" 
              ? "border-gray-600 opacity-50" 
              : "border-yellow-400 hover:scale-110"
          }`}
          onError={(e) => {
            // Fallback dacă imaginea nu se încarcă
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
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

  // Componenta pentru multiple avataruri
  const MultipleAvatars = ({ mentors, status }) => {
    if (!mentors || mentors.length === 0) return null;

    if (mentors.length === 1) {
      return <MentorAvatar mentorName={mentors[0]} size="md" status={status} />;
    }

    return (
      <div className="flex ">
        {mentors.slice(0, 3).map((mentor, index) => (
          <MentorAvatar 
            key={mentor} 
            mentorName={mentor} 
            size="sm" 
            status={status}
          />
        ))}
        {mentors.length > 3 && (
          <div className={`w-8 h-8 rounded-full bg-slate-600 border-2 border-yellow-400 flex items-center justify-center text-xs font-bold text-white ${
            status === "passed" ? "opacity-50" : ""
          }`}>
            +{mentors.length - 3}
          </div>
        )}
      </div>
    );
  };

  const EventCard = ({ event, dayIndex, isWebinar = false }) => {
    const status = getEventStatus(event, dayIndex);
    const [hours, minutes] = event.time.split(":");
    const duration = event.duration || 1;
    const endHour = String(parseInt(hours) + duration).padStart(2, "0");
    const mentors = extractAllMentors(event.name);
    const hasLink = hasSessionLink(event.name);
    const isClickable = hasLink && status !== "passed";

    return (
      <div
        className={`relative bg-slate-800 rounded-lg border transition-all duration-300 ${
          status === "passed"
            ? "border-slate-600 bg-opacity-50"
            : isWebinar
            ? "border-yellow-400 shadow-lg shadow-yellow-400/20"
            : "border-slate-600 hover:border-yellow-400"
        } ${isClickable ? "cursor-pointer hover:scale-105" : "hover:scale-105"}`}
        onClick={isClickable ? () => handleSessionClick(event.name) : undefined}
      >
        {status === "passed" && (
          <div className="absolute inset-0 bg-gray-900 opacity-60 rounded-lg pointer-events-none"></div>
        )}

        <div className="p-3 md:p-4">
          <div className="flex justify-between items-start mb-2 md:mb-3">
            <div className="flex-1 mr-3">
              <div className="flex items-start gap-3 mb-2">
                <MultipleAvatars mentors={mentors} status={status} />
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-1 text-sm md:text-base ${
                      status === "passed" ? "text-gray-400" : "text-white"
                    }`}
                  >
                    {event.name}
                  </h3>
                  {mentors.length > 0 && (
                    <p className={`text-xs ${
                      status === "passed" ? "text-gray-500" : "text-gray-300"
                    }`}>
                      Mentor{mentors.length > 1 ? "i" : ""}: {mentors.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:space-x-2 space-y-1 md:space-y-0 mb-1 md:mb-2">
                <div
                  className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium w-fit ${
                    status === "passed"
                      ? "bg-gray-700 text-gray-400"
                      : "bg-yellow-400 text-black"
                  }`}
                >
                  {event.time} - {endHour}:{minutes}
                </div>
                {isWebinar && status !== "passed" && (
                  <div className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded uppercase w-fit">
                    Webinar
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p
                  className={`text-xs ${
                    status === "passed" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Durată: {duration} {duration === 1 ? "oră" : "ore"}
                </p>
                {hasLink && status !== "passed" && (
                  <div className="flex items-center space-x-1 text-xs text-blue-400">
                    <span>🔗</span>
                    <span>Click pentru Zoom</span>
                  </div>
                )}
              </div>
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
                ? "🔴 LIVE"
                : status === "passed"
                ? "TRECUT"
                : "PROGRAMAT"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDayContent = (dayIndex) => {
    // Weekend - Sâmbătă și Duminică
    if (dayIndex === 5 || dayIndex === 6) {
      return (
        <div className="flex flex-col items-center justify-center h-48 md:h-64 text-center">
          <div className="text-4xl md:text-6xl mb-2 md:mb-4">🌴</div>
          <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-1 md:mb-2">
            RELAXARE
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Weekend de odihnă și reîncărcare
          </p>
        </div>
      );
    }

    // Zilele de lucru (Luni-Vineri)
    const regularEvents = weekdayEvents.map((event) => ({
      ...event,
      isWebinar: false,
    }));
    const webinarEvents = (specialEvents[dayIndex] || []).map((event) => ({
      ...event,
      isWebinar: true,
    }));

    const allEvents = [...regularEvents, ...webinarEvents].sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    return (
      <div className="space-y-3 md:space-y-4">
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-1 md:mb-2">
            {daysOfWeek[dayIndex]}
          </h2>
          <p className="text-gray-400 text-sm">
            {allEvents.length} evenimente programate
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

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleDaySelect = (dayIndex) => {
    setActiveTab(dayIndex);
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-yellow-400 mb-2">
            PROGRAM SĂPTĂMÂNAL
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Astăzi este{" "}
            {
              daysOfWeek[
                new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
              ]
            }
            ,{currentDateTime.toLocaleDateString("ro-RO")} -{" "}
            {currentDateTime.toLocaleTimeString("ro-RO", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Navigation - Dropdown pentru mobile/tablet, tabs pentru desktop */}
        <div className="mb-6 md:mb-8">
          {isMobile ? (
            // Dropdown pentru mobile și tablet
            <div className="relative">
              <button
                onClick={handleDropdownClick}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 flex items-center justify-between text-white hover:border-yellow-400 transition-colors duration-200"
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
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden">
                  {daysOfWeek.map((day, index) => {
                    const isToday =
                      index ===
                      (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                    const hasEvents = index < 5;

                    return (
                      <button
                        key={day}
                        onClick={() => handleDaySelect(index)}
                        className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors duration-200 flex items-center justify-between ${
                          activeTab === index
                            ? "bg-slate-700 text-yellow-400"
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
            // Tabs pentru desktop
            <div className="grid grid-cols-7 gap-2 bg-slate-800 p-2 rounded-lg">
              {daysOfWeek.map((day, index) => {
                const isToday =
                  index ===
                  (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                const hasEvents = index < 5;

                return (
                  <button
                    key={day}
                    onClick={() => setActiveTab(index)}
                    className={`relative px-3 py-4 rounded-md font-bold text-sm transition-all duration-200 ${
                      activeTab === index
                        ? "bg-yellow-400 text-black shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-slate-700"
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

        {/* Conținutul tab-ului activ */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 md:p-6 min-h-80 md:min-h-96">
          {renderDayContent(activeTab)}
        </div>

        {/* Footer info */}
        <div className="mt-6 md:mt-8 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Ziua curentă
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              Evenimente programate
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
              Evenimente trecute
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;