import React, { useState, useEffect } from "react";
import CompetitionBanner from "./Competitie";
import FormularInscriereConcurs from "./components/FormularConcurs";
import HallOfFameCarousel from "./components/ui/Carusel";
import { useLanguage } from "./contexts/LanguageContext";

const Concurs = () => {
  const { translations } = useLanguage();
  const t = translations;
  const [registrationOpen, setRegistrationOpen] = useState(true);

  useEffect(() => {
    const checkRegistrationStatus = () => {
      const now = new Date();
      const registrationCloseDate = new Date(2026, 0, 5, 23, 59, 59); // 5 ianuarie 2026, 23:59:59 (sfârșitul zilei)
      setRegistrationOpen(now < registrationCloseDate);
    };

    checkRegistrationStatus();
    const interval = setInterval(checkRegistrationStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CompetitionBanner />
      {registrationOpen ? (
        <FormularInscriereConcurs />
      ) : (
        <div className="max-w-2xl mx-auto my-10 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold text-amber-400 mb-4">
            {t.competitionRegistrationsClosed}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {t.competitionRegistrationsClosedMessage}
          </p>
        </div>
      )}
      <HallOfFameCarousel />
    </>
  );
};

export default Concurs;
