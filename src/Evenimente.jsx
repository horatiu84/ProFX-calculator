import React, { useEffect, useRef, useState } from "react";
import CompetitionBanner from "./Competitie";
import HallOfFameCarousel from "./components/ui/Carusel";
import FormularInscriereConcurs from "./components/FormularConcurs";
import HowTo from "./HowTo";


function formatNumber(n) {
  return n.toString().padStart(2, "0");
}

const BootcampBanner = () => {
  // Banner cu countdown activ
  return (
    <>
      <HowTo />
      <CompetitionBanner />
      <FormularInscriereConcurs />
      <HallOfFameCarousel />
    </>
  );
};

export default BootcampBanner;
