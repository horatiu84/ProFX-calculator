import React from "react";
import CompetitionBanner from "./Competitie";
import FormularInscriereConcurs from "./components/FormularConcurs";
import HallOfFameCarousel from "./components/ui/Carusel";

const Concurs = () => {
  return (
    <>
      <CompetitionBanner />
      <FormularInscriereConcurs />
      <HallOfFameCarousel />
    </>
  );
};

export default Concurs;
