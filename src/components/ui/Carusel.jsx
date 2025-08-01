import React, { useState } from "react";
import Slider from "react-slick";
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
// ... importă restul imaginilor

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
  { img: iulie3, name: "Lucian", title: "Locul 3Iulie 2025" },

  // ... restul pozelor
];

const HallOfFameCarousel = () => {
  const [modalImg, setModalImg] = useState(null);

  return (
    <>
      <h2 className="text-3xl sm:text-5xl font-extrabold text-yellow-600 font-[Montserrat] mb-6 tracking-wider text-center drop-shadow">
        Galeria Campionilor ProFX
      </h2>
      {modalImg && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
          onClick={() => setModalImg(null)}
        >
          <img
            src={modalImg}
            className="max-w-[90vw] max-h-[80vh] rounded-2xl border-4 border-yellow-400 shadow-2xl"
            alt="Expanded"
          />
        </div>
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
