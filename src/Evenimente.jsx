import React, { useEffect, useRef, useState } from "react";
import HotelImg from "./utils/Hotel.jpg"; 
import CompetitionBanner from "./Competitie";
import HallOfFameCarousel from "./components/ui/Carusel";
import FormularInscriereConcurs from "./components/FormularConcurs";

function formatNumber(n) {
  return n.toString().padStart(2, "0");
}

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
