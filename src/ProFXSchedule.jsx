import React, { useEffect, useState, useCallback } from "react";
import { DateTime } from "luxon"; // Adaugă dependența: npm install luxon

// Import imagini pentru mentorii webinar-urilor
import Sergiu from "./pics/Sergiu.jpg";
import John from "./pics/John.jpg";
import Eli from "./pics/Eli.jpg";
import Tudor from "./pics/Tudor.jpg";
import Dan from "./pics/Dan.jpg";
import Adrian from "./pics/Adrian.jpg";

/**
 * Lista cu toate webinariile săptămânale
 * dayOfWeek: 1 = Luni, 2 = Marți, 3 = Miercuri, 4 = Joi, 5 = Vineri, 6 = Sâmbătă, 7 = Duminică
 */
const weeklyWebinars = [
  {
    dayOfWeek: 1, // Luni
    title: "WEBINAR GRATUIT",
    subtitle: "Ce este tradingul și cum poți învăța Gratuit cu ProFX?",
    presenters: "Sergiu Cîrstea & Ionuț Pometcu",
    mentors: [
      { name: "Sergiu Cîrstea", img: Sergiu },
      { name: "Ionuț Pometcu", img: John },
    ],
    ora: 20, // Ora de start (20:00)
    details:
      "Participă și tu la webinarul interactiv unde vei afla ce este tradingul, cum funcționează piețele financiare și cum poți începe să înveți gratuit alături de comunitatea ProFX!",
  },
  {
    dayOfWeek: 2, // Marți
    title: "WEBINAR ÎNCEPĂTORI",
    subtitle: "Cum să luăm tranzacții în Forex",
    presenters: "Eli & Adrian",
    mentors: [
      { name: "Adrian", img: Adrian },
      { name: "Eli", img: Adrian },
    ],
    ora: 20,
    details: "Webinar practic pentru începători, cu Adrian și Eli.",
  },
  {
    dayOfWeek: 4, // Joi
    title: "WEBINAR AVANSAȚI",
    subtitle: "Trading avansat cu Ionuț Pometcu",
    presenters: "Ionuț Pometcu",
    mentors: [{ name: "Ionuț Pometcu", img: John }],
    ora: 20,
    details: "Pentru traderii avansați, cu Ionuț Pometcu.",
  },
];

/**
 * Funcție care determină următorul webinar care va avea loc
 * @returns {Object} - Obiectul webinar-ului cu data calculată
 */
function getNextWebinar() {
  const tz = "Europe/Bucharest"; // Fus orar România
  const now = DateTime.now();
  const nowInTz = now.setZone(tz); // Convertim la fusul orar din România

  let ongoingEvent = null; // Webinar care se desfășoară în acest moment
  let soonestFuture = null; // Următorul webinar programat

  // Parcurgem toate webinariile pentru a găsi următorul sau cel în desfășurare
  for (const event of weeklyWebinars) {
    // Calculăm câte zile sunt până la ziua săptămânii webinar-ului
    let offset = (event.dayOfWeek - nowInTz.weekday + 7) % 7;
    
    // Creăm data pentru webinar în această săptămână
    let candidateDt = nowInTz.plus({ days: offset }).set({
      hour: event.ora,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const startDt = candidateDt;

    if (startDt <= nowInTz) {
      // Webinarul a început deja
      if (startDt > nowInTz.minus({ hours: 1 })) {
        // Webinarul se desfășoară acum (început în ultima oră)
        ongoingEvent = {
          ...event,
          dt: startDt,
          date: startDt.toJSDate(),
        };
      } else {
        // Webinarul s-a terminat, calculăm pentru săptămâna următoare
        candidateDt = startDt.plus({ weeks: 1 });
        if (!soonestFuture || candidateDt < soonestFuture.dt) {
          soonestFuture = {
            ...event,
            dt: candidateDt,
            date: candidateDt.toJSDate(),
          };
        }
      }
    } else {
      // Webinarul este în viitor
      if (!soonestFuture || candidateDt < soonestFuture.dt) {
        soonestFuture = {
          ...event,
          dt: candidateDt,
          date: candidateDt.toJSDate(),
        };
      }
    }
  }

  // Returnăm webinarul în desfășurare sau următorul programat
  return ongoingEvent || soonestFuture;
}

/**
 * Componentă pentru afișarea countdown-ului până la începerea webinar-ului
 * @param {Date} targetDate - Data țintă pentru countdown
 * @param {Function} onExpire - Funcție apelată când webinarul se termină
 */
const CountdownTimer = ({ targetDate, onExpire }) => {
  // Funcție pentru calcularea timpului rămas
  const calculateTimeLeft = () => targetDate - new Date();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Actualizăm countdown-ul la fiecare secundă
    const interval = setInterval(() => {
      const now = new Date();
      const timeToStart = targetDate - now; // Timp până la început
      setTimeLeft(timeToStart);
      
      // Calculăm timpul până la sfârșitul webinar-ului (1 oră după început)
      const timeToEnd = targetDate.getTime() + 3600000 - now.getTime();
      
      // Dacă webinarul s-a terminat, apelăm funcția onExpire
      if (timeToEnd <= 0) {
        if (onExpire) onExpire();
      }
    }, 1000);
    
    // Curățăm interval-ul la demontarea componentei
    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  if (timeLeft > 0) {
    // Webinarul nu a început încă - afișăm countdown-ul
    const totalSeconds = Math.floor(timeLeft / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return (
      <div className="flex flex-nowrap justify-center items-center gap-2 my-4">
        {/* Afișăm zilele doar dacă sunt mai mult de 0 */}
        {days > 0 && (
          <div className="flex flex-col items-center">
            <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded-lg shadow-md min-w-[40px] text-center">
              {days}
            </div>
            <span className="text-white text-xs mt-1">Zile</span>
          </div>
        )}
        {/* Ore */}
        <div className="flex flex-col items-center">
          <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded-lg shadow-md min-w-[40px] text-center">
            {hours.toString().padStart(2, "0")}
          </div>
          <span className="text-white text-xs mt-1">Ore</span>
        </div>
        {/* minute */}
        <div className="flex flex-col items-center">
          <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded-lg shadow-md min-w-[40px] text-center">
            {minutes.toString().padStart(2, "0")}
          </div>
          <span className="text-white text-xs mt-1">Minute</span>
        </div>
        {/* Secunde */}
        <div className="flex flex-col items-center">
          <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded-lg shadow-md min-w-[40px] text-center">
            {seconds.toString().padStart(2, "0")}
          </div>
          <span className="text-white text-xs mt-1">Secunde</span>
        </div>
      </div>
    );
  } else if (timeLeft > -3600000) {
    // Webinarul a început și încă se desfășoară (în prima oră)
    return (
      <div className="my-3 text-lg font-semibold text-yellow-400 text-center w-full">
        Webinarul a început!
      </div>
    );
  } else {
    // Webinarul s-a terminat - nu afișăm nimic
    return null;
  }
};

/**
 * Componentă pentru afișarea card-ului cu următorul webinar
 * @param {Object} event - Obiectul webinar cu toate detaliile
 * @param {Function} onExpire - Funcție apelată când webinarul se termină
 */
const UpcomingWebinarCard = ({ event, onExpire }) => {
  // Convertim data la fusul orar local pentru afișare
  const localDt = DateTime.fromJSDate(event.date).toLocal();

  return (
    <div
      className="w-full max-w-xl mx-auto mb-10 bg-gradient-to-br from-[#1e293b] via-[#111827] to-[#0b0f1a] rounded-xl shadow-lg border-2 border-yellow-400 p-5 md:p-7 text-white flex flex-col items-center"
      style={{ boxSizing: "border-box" }}
    >
      {/* Eticheta "Upcoming Webinar" */}
      <span className="uppercase text-xs text-yellow-400 tracking-widest font-bold mb-2 text-center">
        Upcoming Webinar
      </span>
      
      {/* Titlul webinar-ului */}
      <h2 className="text-2xl font-bold text-yellow-400 mb-1 text-center">
        {event.title}
      </h2>
      
      {/* Subtitlul */}
      <div className="text-sm text-gray-200 mb-3 text-center">
        {event.subtitle}
      </div>
      
      {/* Data și ora + Imaginile mentorilor */}
      <div className="flex flex-col items-center mb-3 w-full text-center">
        {/* Data și ora formatate în română */}
        <div className="font-bold text-white text-base mb-2">
          {localDt.toFormat("cccc, 'ora' HH:mm", { locale: "ro" })}
        </div>
        
        {/* Imaginile și numele mentorilor */}
        <div className="flex flex-row flex-wrap justify-center items-end gap-x-4 gap-y-5 w-full">
          {event.mentors && event.mentors.length > 0 ? (
            event.mentors.map((mentor, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center min-w-[80px]"
              >
                {/* Numele mentorului */}
                <span className="text-sm text-white font-medium mb-1">
                  {mentor.name}
                </span>
                {/* Imaginea mentorului */}
                <img
                  src={mentor.img}
                  alt={mentor.name}
                  style={{
                    width: 134,
                    height: 134,
                    objectFit: "cover",
                    borderRadius: "10px",
                    background: "#23272f",
                  }}
                  className="shadow-md"
                />
              </div>
            ))
          ) : (
            // Dacă nu sunt imagini, afișăm doar numele prezentatorilor
            <span className="text-sm text-gray-300">{event.presenters}</span>
          )}
        </div>
      </div>
      
      {/* Countdown Timer */}
      <div className="my-3 text-lg font-semibold text-yellow-400 text-center w-full">
        <CountdownTimer targetDate={event.date} onExpire={onExpire} />
      </div>
      
      {/* Detaliile webinar-ului */}
      <div className="mt-1 text-xs text-gray-400 italic text-center mb-6">
        {event.details}
      </div>

      {/* Secțiunea cu detaliile de conectare Zoom */}
      <div className="w-full mt-3 pt-4 border-t border-gray-700 text-sm text-center">
        <h3 className="text-md font-semibold text-yellow-400 mb-2">
          🔗 Detalii conectare Zoom
        </h3>
        <p>
          Link:{" "}
          <a
            // href="https://zoom.us/j/86783293224" // Link 1 
           // href="https://us06web.zoom.us/j/81705355401" // Link alternativ
            href="https://us06web.zoom.us/j/85130136480"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline break-all"
          >
            Zoom Link
          </a>
        </p>
        {/* <p>
          Meeting ID: <span className="font-bold"> 817 0535 5401</span>
        </p> */}
        <p>
          Parolă: <span className="font-bold">2025</span>
        </p>
      </div>
    </div>
  );
};

/**
 * Programul săptămânal static - configurația pentru fiecare zi
 */
const schedule = [
  {
    day: "LUNI",
    activities: [
      { time: "", text: "MINIM DOUĂ SESIUNI LIVE" },
      { time: "", text: "WEBINAR" },
    ],
  },
  {
    day: "MARȚI",
    activities: [
      { time: "", text: "MINIM DOUĂ SESIUNI LIVE" },
      { time: "", text: "WEBINAR ÎNCEPĂTORI" },
    ],
  },
  {
    day: "MIERCURI",
    activities: [{ time: "", text: "MINIM DOUĂ SESIUNI LIVE" }],
  },
  {
    day: "JOI",
    activities: [
      { time: "", text: "MINIM DOUĂ SESIUNI LIVE" },
      { time: "", text: "WEBINAR AVANSAȚI" },
    ],
  },
  {
    day: "VINERI",
    activities: [{ time: "", text: "MINIM DOUĂ SESIUNI LIVE" }],
  },
  {
    day: "SÂMBĂTĂ",
    activities: [{ time: "", text: "RELAXARE" }],
  },
  {
    day: "DUMINICĂ",
    activities: [{ time: "", text: "WEBINAR BACKTESTING" }],
  },
];

/**
 * Componenta principală ProFXSchedule
 * Afișează programul săptămânal și următorul webinar cu countdown
 */
const ProFXSchedule = () => {
  // State pentru webinarul curent/următor
  const [currentWebinar, setCurrentWebinar] = useState(getNextWebinar());

  // Funcție pentru actualizarea webinar-ului când se termină cel curent
  const handleNextWebinar = useCallback(() => {
    setCurrentWebinar(getNextWebinar());
  }, []);

  return (
    <div className="bg-[#0b0f1a] text-white font-sans max-w-5xl px-4 py-10 mx-auto">
      {/* Titlul principal */}
      <div className="w-full text-center">
        <h1 className="text-4xl font-bold text-yellow-400 tracking-wide mb-8">
          PROGRAM SĂPTĂMÂNAL
        </h1>
      </div>
      
      {/* Card-ul cu următorul webinar */}
      <UpcomingWebinarCard
        event={currentWebinar}
        onExpire={handleNextWebinar}
      />
      
      {/* Grid-ul cu programul pentru fiecare zi */}
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {schedule.map((entry) => (
          <div
            key={entry.day}
            className="bg-[#111827] text-white p-6 rounded-xl shadow-lg border border-[#1f2937]"
          >
            {/* Numele zilei */}
            <h2 className="text-lg font-semibold text-white bg-[#1e293b] px-3 py-2 rounded mb-4">
              {entry.day}
            </h2>
            
            {/* Lista activităților pentru ziua respectivă */}
            <div className="space-y-2">
              {entry.activities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start text-sm text-white border-l-4 pl-3"
                  style={{ borderColor: "#facc15" }} // Bordura galbenă
                >
                  {/* Ora activității (dacă există) */}
                  {activity.time && (
                    <span className="font-bold text-yellow-400 mr-2">
                      {activity.time}
                    </span>
                  )}
                  {/* Textul activității */}
                  <span>{activity.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProFXSchedule;