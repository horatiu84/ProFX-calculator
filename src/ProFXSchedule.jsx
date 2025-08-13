import React, { useEffect, useState, useCallback } from "react";
import { DateTime } from "luxon"; // Adaugă dependența: npm install luxon
import Sergiu from "./pics/Sergiu.jpg";
import John from "./pics/John.jpg";
import Eli from "./pics/Eli.jpg";
import Tudor from "./pics/Tudor.jpg";
import Dan from "./pics/Dan.jpg";
import Cosmin from "./pics/Cosmin.jpg";
import Adrian from "./pics/Adrian.jpg";

// Lista cu toate webinariile săptămânale
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
    ora: 20,
    details:
      "Participă și tu la webinarul interactiv unde vei afla ce este tradingul, cum funcționează piețele financiare și cum poți începe să înveți gratuit alături de comunitatea ProFX!",
  },
  {
    dayOfWeek: 2, // Marți
    title: "WEBINAR ÎNCEPĂTORI",
    subtitle: "Cum să luăm tranzacții în Forex",
    presenters: "Eli & Dan",
    mentors: [
      { name: "Eli", img: Eli },
      { name: "Dan", img: Dan },
    ],
    ora: 20,
    details: "Webinar practic pentru începători, cu Eli și Dan.",
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

function getNextWebinar() {
  const tz = "Europe/Bucharest";
  const now = DateTime.now();
  const nowInTz = now.setZone(tz);

  let soonestEvent = null;

  for (const event of weeklyWebinars) {
    let offset = (event.dayOfWeek - nowInTz.weekday + 7) % 7;
    let candidateDt = nowInTz.plus({ days: offset }).set({
      hour: event.ora,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    if (candidateDt <= nowInTz) {
      offset += 7;
      candidateDt = nowInTz.plus({ days: offset }).set({
        hour: event.ora,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    }

    if (!soonestEvent || candidateDt < soonestEvent.dt) {
      soonestEvent = {
        ...event,
        dt: candidateDt,
        date: candidateDt.toJSDate(),
      };
    }
  }

  return soonestEvent;
}

// Timer dinamic pentru orice dată țintă
const CountdownTimer = ({ targetDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(targetDate - new Date());

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(targetDate - new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onExpire, targetDate]);

  if (timeLeft <= 0) return null;

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="flex flex-nowrap justify-center items-center gap-2 my-4">
      {days > 0 && (
        <div className="flex flex-col items-center">
          <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded-lg shadow-md min-w-[40px] text-center">
            {days}
          </div>
          <span className="text-white text-xs mt-1">Zile</span>
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded-lg shadow-md min-w-[40px] text-center">
          {hours.toString().padStart(2, "0")}
        </div>
        <span className="text-white text-xs mt-1">Ore</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded-lg shadow-md min-w-[40px] text-center">
          {minutes.toString().padStart(2, "0")}
        </div>
        <span className="text-white text-xs mt-1">Minute</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-yellow-400 text-black font-bold text-xl px-3 py-1 rounded-lg shadow-md min-w-[40px] text-center">
          {seconds.toString().padStart(2, "0")}
        </div>
        <span className="text-white text-xs mt-1">Secunde</span>
      </div>
    </div>
  );
};

// Card pentru webinarul următor
const UpcomingWebinarCard = ({ event, onExpire }) => {
  const localDt = DateTime.fromJSDate(event.date).toLocal();

  return (
    <div
      className="w-full max-w-xl mx-auto mb-10 bg-gradient-to-br from-[#1e293b] via-[#111827] to-[#0b0f1a] rounded-xl shadow-lg border-2 border-yellow-400 p-5 md:p-7 text-white flex flex-col items-center"
      style={{ boxSizing: "border-box" }}
    >
      <span className="uppercase text-xs text-yellow-400 tracking-widest font-bold mb-2 text-center">
        Upcoming Webinar
      </span>
      <h2 className="text-2xl font-bold text-yellow-400 mb-1 text-center">
        {event.title}
      </h2>
      <div className="text-sm text-gray-200 mb-3 text-center">
        {event.subtitle}
      </div>
      <div className="flex flex-col items-center mb-3 w-full text-center">
        <div className="font-bold text-white text-base mb-2">
          {localDt.toFormat("cccc, 'ora' HH:mm", { locale: "ro" })}
        </div>
        <div className="flex flex-row flex-wrap justify-center items-end gap-x-4 gap-y-5 w-full">
          {event.mentors && event.mentors.length > 0 ? (
            event.mentors.map((mentor, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center min-w-[80px]"
              >
                <span className="text-sm text-white font-medium mb-1">
                  {mentor.name}
                </span>
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
            <span className="text-sm text-gray-300">{event.presenters}</span>
          )}
        </div>
      </div>
      <div className="my-3 text-lg font-semibold text-yellow-400 text-center w-full">
        <CountdownTimer targetDate={event.date} onExpire={onExpire} />
      </div>
      <div className="mt-1 text-xs text-gray-400 italic text-center mb-6">
        {event.details}
      </div>

      {/* 🔗 Detalii Zoom */}
      <div className="w-full mt-3 pt-4 border-t border-gray-700 text-sm text-center">
        <h3 className="text-md font-semibold text-yellow-400 mb-2">
          🔗 Detalii conectare Zoom
        </h3>
        <p>
          Link:{" "}
          <a
            href="https://zoom.us/j/86783293224"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline break-all"
          >
            Zoom Link
          </a>
        </p>
        <p>
          Parolă: <span className="font-bold">2022</span>
        </p>
      </div>
    </div>
  );
};

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

const ProFXSchedule = () => {
  const [currentWebinar, setCurrentWebinar] = useState(getNextWebinar());

  const handleNextWebinar = useCallback(() => {
    setCurrentWebinar(getNextWebinar());
  }, []);

  return (
    <div className="bg-[#0b0f1a]  text-white font-sans max-w-5xl px-4 py-10 mx-auto">
      <div className="w-full text-center">
        <h1 className="text-4xl font-bold text-yellow-400 tracking-wide mb-8">
          PROGRAM SĂPTĂMÂNAL
        </h1>
      </div>
      <UpcomingWebinarCard
        event={currentWebinar}
        onExpire={handleNextWebinar}
      />
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {schedule.map((entry) => (
          <div
            key={entry.day}
            className="bg-[#111827] text-white p-6 rounded-xl shadow-lg border border-[#1f2937]"
          >
            <h2 className="text-lg font-semibold text-white bg-[#1e293b] px-3 py-2 rounded mb-4">
              {entry.day}
            </h2>
            <div className="space-y-2">
              {entry.activities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start text-sm text-white border-l-4 pl-3"
                  style={{ borderColor: "#facc15" }}
                >
                  {activity.time && (
                    <span className="font-bold text-yellow-400 mr-2">
                      {activity.time}
                    </span>
                  )}
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