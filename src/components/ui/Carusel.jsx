import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import { createPortal } from "react-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import aprilie1 from "../../utils/Aprilie 1.jpg";
import aprilie2 from "../../utils/Aprilie 2.jpg";
import aprilie3 from "../../utils/Aprilie 3.jpg";
import mai1 from "../../utils/Mai 1.jpg";
import mai2 from "../../utils/Mai 2.jpg";
import iunie1 from "../../utils/Iunie 1.jpg";
import iunie2 from "../../utils/Iunie 2.jpg";
import iunie3 from "../../utils/Iunie 3.jpg";
import iulie1 from "../../utils/Iulie 1.jpg";
import iulie2 from "../../utils/Iulie 2.jpg";
import iulie3 from "../../utils/Iulie 3.jpg";
import august1 from "../../utils/August 1.jpg";
import august2 from "../../utils/August 2.jpg";
import august3 from "../../utils/August 3.jpg";
import august4 from "../../utils/August 4.jpg";
import august5 from "../../utils/August 5.jpg";
import septembrie1 from "../../utils/Septembrie1.jpg";
import septembrie2 from "../../utils/Septembrie2.jpg";
import septembrie3 from "../../utils/Septembrie3.jpg";
import septembrie4 from "../../utils/Septembrie4.jpg";
import septembrie5 from "../../utils/Septembrie5.jpg";

const hallOfFame = [
  { img: aprilie1, name: "Ciprian Penisoara", title: " Locul 1 Aprile 2025" },
  { img: aprilie2, name: "Florin Juravle", title: "Locul 2 Aprile 2025" },
  { img: aprilie3, name: "Marian Tanase", title: "Locul 3 Aprile 2025" },
  { img: mai1, name: "Florin Juravle", title: "Locul 1 Mai 2025" },
  { img: mai2, name: "Erik Cirstea", title: "Locul 2 Mai 2025" },
  { img: iunie1, name: "Paul Mendosa", title: "Locul 1 Iunie 2025" },
  { img: iunie2, name: "Erik Cirstea", title: "Locul 2 Iunie 2025" },
  { img: iunie3, name: "Mihai Vlada", title: "Locul 3 Iunie 2025" },
  { img: iulie1, name: "Romeo Bradeanu", title: "Locul 1 Iulie 2025" },
  { img: iulie2, name: "Mihai Vlada", title: "Locul 2 Iulie 2025" },
  { img: iulie3, name: "Lucian Solomonean", title: "Locul 3 Iulie 2025" },
  { img: august1, name: "Lavinia Sabau", title: "Locul 1 August 2025" },
  { img: august2, name: "Marian Tanase", title: "Locul 2 August 2025" },
  { img: august3, name: "Erik Cirstea", title: "Locul 3 August 2025" },
  { img: august4, name: "Romeo Bradeanu", title: "Locul 4 August 2025" },
  { img: august5, name: "Adela Mercea", title: "Locul 5 August 2025" },
  { img: septembrie1, name: "Horatiu Evu", title: "Locul 1 Septembrie 2025" },
  { img: septembrie2, name: "Gabriel Suciu", title: "Locul 2 Septembrie 2025" },
  {
    img: septembrie3,
    name: "Gabriel Muresan",
    title: "Locul 3 Septembrie 2025",
  },
  { img: septembrie4, name: "Erik Cirstea", title: "Locul 4 Septembrie 2025" },
  { img: septembrie5, name: "Adela Mercea", title: "Locul 5 Septembrie 2025" },
];

const HallOfFameCarousel = () => {
  const [modalImg, setModalImg] = useState(null);

  // Blochează scroll-ul pe body când modalul e deschis
  useEffect(() => {
    if (modalImg) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [modalImg]);

  // Închidere cu ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setModalImg(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <h2 className="text-3xl sm:text-5xl font-extrabold text-yellow-600 font-[Montserrat] mb-6 tracking-wider text-center drop-shadow">
        Galeria Campionilor ProFX
      </h2>

      {createPortal(
        <AnimatePresence>
          {modalImg && (
            <motion.div
              className="fixed inset-0 z-[9999] bg-black/75 flex items-center justify-center p-4"
              onClick={() => setModalImg(null)}
              aria-modal="true"
              role="dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.img
                src={modalImg}
                alt="Expanded"
                className="max-w-[92vw] max-h-[85vh] rounded-2xl border-4 border-yellow-400 shadow-2xl"
                onClick={(e) => e.stopPropagation()} // nu închide când dai click pe imagine
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25 }}
              />

              {/* buton închidere */}
              <button
                onClick={() => setModalImg(null)}
                className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold shadow"
                aria-label="Închide"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="flex justify-center items-center w-full">
        <Slider
          dots
          infinite
          speed={600}
          slidesToShow={3}
          slidesToScroll={1}
          autoplay
          autoplaySpeed={2500}
          className="w-full max-w-4xl"
          responsive={[{ breakpoint: 768, settings: { slidesToShow: 1 } }]}
        >
          {hallOfFame.map((item, idx) => (
            <div
              className="flex flex-col items-center justify-center h-full w-full p-2 cursor-pointer text-center"
              key={idx}
              onClick={() => setModalImg(item.img)}
            >
              <img
                src={item.img}
                alt={item.name}
                className="rounded-xl shadow-md w-[160px] h-[160px] object-cover mx-auto"
              />
              <div className="mt-2 font-bold">{item.name}</div>
              <div className="text-yellow-600 text-xs">{item.title}</div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default HallOfFameCarousel;
