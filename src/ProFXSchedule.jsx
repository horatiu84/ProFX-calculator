import React from "react";

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
    activities: [{ time: "", text: "MINIM DOUĂ SESIUNI LIVE" },{ time: "", text: "WEBINAR ÎNCEPĂTORI" },],
  },
  {
    day: "MIERCURI",
    activities: [
      { time: "", text: "MINIM DOUĂ SESIUNI LIVE" }
    ],
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
  return (
    <div className="bg-[#0b0f1a]  text-white font-sans max-w-5xl px-4 py-10 mx-auto">
      <div className="w-full text-center">
        <h1 className="text-4xl font-bold text-yellow-400 tracking-wide">
          PROGRAM SĂPTĂMÂNAL
        </h1>
      </div>
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
