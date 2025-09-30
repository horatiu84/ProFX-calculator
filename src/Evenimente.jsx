import React, { useEffect, useRef, useState } from "react";
import CompetitionBanner from "./Competitie";
import HallOfFameCarousel from "./components/ui/Carusel";
import FormularInscriereConcurs from "./components/FormularConcurs";


const BootcampBanner = () => {
  // Banner cu countdown activ
  return (
    <>
      <CompetitionBanner />
      <FormularInscriereConcurs />
      <HallOfFameCarousel />
    </>
  );
};

export default BootcampBanner;
