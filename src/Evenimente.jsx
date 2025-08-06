import React, { useEffect, useRef, useState } from "react";
import HotelImg from "./utils/Hotel.jpg"; // Atenție la calea și denumirea imaginii
import CompetitionBanner from "./Competitie";
import HallOfFameCarousel from "./components/ui/Carusel";

function formatNumber(n) {
  return n.toString().padStart(2, "0");
}

const BootcampBanner = () => {
  // Banner cu countdown activ
  return (
    <>
      <CompetitionBanner />
      <HallOfFameCarousel />
    </>
  );
};

export default BootcampBanner;
