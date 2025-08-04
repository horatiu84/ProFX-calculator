import React, { useEffect, useState, useCallback } from "react";

// Lista cu toate webinariile săptămânale
const weeklyWebinars = [
  {
    dayOfWeek: 1, // Luni
    title: "WEBINAR GRATUIT",
    subtitle: "Ce este tradingul și cum poți învăța Gratuit cu ProFX?",
    presenters: "Sergiu Cîntea & Ionuț Pometcu",
    ora: 20, // 20:00
    details:
      "Participă și tu la webinarul interactiv unde vei afla ce este tradingul, cum funcționează piețele financiare și cum poți începe să înveți gratuit alături de comunitatea ProFX",
  },
  {
    dayOfWeek: 2, // Marți
    title: "WEBINAR ÎNCEPĂTORI",
    subtitle: "Cum încep să fac trading (pentru începători)",
    presenters: "Eli & Cosmin",
    ora: 20,
    details: "Webinar practic pentru începători, cu Eli și Cosmin.",
  },
  {
    dayOfWeek: 4, // Joi
    title: "WEBINAR AVANSAȚI",
    subtitle: "Trading avansat cu John",
    presenters: "John",
    ora: 20,
    details: "Pentru traderii avansați, cu John.",
  },
];

// Determină următorul webinar (data și ora exactă)
function getNextWebinar() {
  const now = new Date();
  for (let i = 0; i < weeklyWebinars.length; i++) {
    const event = weeklyWebinars[i];
    let nextDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + ((event.dayOfWeek - now.getDay() + 7) % 7),
      event.ora,
      0,
      0,
      0
    );
    if (nextDate <= now) continue; // a trecut deja, trecem la următorul
    return { ...event, date: nextDate };
  }
  // Dacă toate au trecut în săptămâna asta, iei primul din săptămâna următoare
  const firstEvent = weeklyWebinars[0];
  let nextDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + ((firstEvent.dayOfWeek - now.getDay() + 7) % 7 || 7) + 7,
    firstEvent.ora,
    0,
    0,
    0
  );
  return { ...firstEvent, date: nextDate };
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
    <span className="text-yellow-400 font-semibold text-xl">
      {days > 0 && `${days}z `}
      {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")} până la webinar
    </span>
  );
};

// Card pentru webinarul următor
const UpcomingWebinarCard = ({ event, onExpire }) => (
  <div className="w-full max-w-xl mx-auto mb-10 bg-gradient-to-br from-[#1e293b] via-[#111827] to-[#0b0f1a] rounded-xl shadow-lg border-2 border-yellow-400 p-6 text-white flex flex-col items-center">
    <span className="uppercase text-xs text-yellow-400 tracking-widest font-bold mb-1">
      Upcoming Webinar
    </span>
    <h2 className="text-2xl font-bold text-yellow-400 mb-2">{event.title}</h2>
    <div className="text-sm text-gray-200 mb-2">{event.subtitle}</div>
    <div className="flex gap-4 mb-2 text-sm text-gray-300">
      <span className="font-bold">
        {event.date.toLocaleDateString("ro-RO", { weekday: "long" })}, ora{" "}
        {event.ora}:00
      </span>
      {" | "}
      <span>{event.presenters}</span>
    </div>
    <CountdownTimer targetDate={event.date} onExpire={onExpire} />
    <div className="mt-4 text-xs text-gray-400 italic text-center">
      {event.details}
    </div>
  </div>
);

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
