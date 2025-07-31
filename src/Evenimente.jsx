import React, { useEffect, useRef, useState } from "react";
import HotelImg from "./utils/Hotel.jpg"; // Atenție la calea și denumirea imaginii

function formatNumber(n) {
  return n.toString().padStart(2, "0");
}

const BootcampBanner = () => {
  const deadline = new Date("2025-09-09T00:00:00");
  const [timeLeft, setTimeLeft] = useState(null); // null = nu afișezi nimic/loader
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef();

  // Face calculul timpului rămas
  function calculateTimeLeft() {
    const now = new Date();
    const total = deadline - now;
    if (total > 0) {
      return {
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((total / 1000 / 60) % 60),
        seconds: Math.floor((total / 1000) % 60),
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  useEffect(() => {
    // Primul calcul imediat la montare
    setTimeLeft(calculateTimeLeft());

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = calculateTimeLeft();
        // Oprește intervalul când timerul a ajuns la zero
        if (Object.values(next).every((x) => x === 0)) {
          clearInterval(intervalRef.current);
        }
        return next;
      });
    }, 1000);

    // Cleanup la demontare componentă
    return () => clearInterval(intervalRef.current);
    // (deadline e constant, nu-l trece în deps)
  }, []);

  const timerItems = [
    { label: "Zile", value: timeLeft?.days ?? 0 },
    { label: "Ore", value: timeLeft?.hours ?? 0 },
    { label: "Min", value: timeLeft?.minutes ?? 0 },
    { label: "Sec", value: timeLeft?.seconds ?? 0 },
  ];

  // Modal - detalii înscriere
  const Modal = () => (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-1"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white rounded-2xl p-5 sm:p-8 max-w-md w-full shadow-2xl border-2 border-yellow-400 relative mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-gray-600 hover:text-black text-2xl font-bold"
          onClick={() => setShowModal(false)}
          aria-label="Închide"
        >
          ×
        </button>
        <h3 className="text-lg sm:text-xl font-bold text-yellow-700 mb-4 text-center">
          Dragilor, am dat drumul la înscrieri!
        </h3>
        <div className="mb-3 text-base font-medium text-gray-800">
          Aveți aici conturile în care puteți vira banii!
        </div>
        <div className="mb-2 font-semibold text-red-600">
          Data limită este 5 AUGUST!
        </div>
        <div className="mb-3 text-gray-700 text-sm">
          După ce ați achitat, vă rog să trimiteți <b>în privat dovada</b> lui{" "}
          <a
            href="https://t.me/sergiucirstea"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-700 underline font-bold hover:text-yellow-900 transition"
          >
            Sergiu Cîrstea
          </a>{" "}
          și un <b>buletin</b> pentru facturare. Contractul îl semnăm la
          BOOTCAMP.
        </div>
        <div className="mb-2 text-gray-900 text-sm">
          <b>SC PRO FX MEDIA SRL</b>
          <br />
          J28/403/8440001
          <br />
          CUI: 50830817
        </div>
        <div className="mb-3 text-gray-900 text-sm">
          <b>Cont bancar:</b>
          <br />
          <span className="block mt-1">
            <b>Ron:</b> Ro09 RZBR 0000 0600 2690 6576
          </span>
          <span className="block">
            <b>Eur:</b> Ro79 RZBR 0000 0600 2690 6577
          </span>
        </div>
      </div>
    </div>
  );

  // Loader (poți pune altceva aici)
  if (timeLeft === null) return null;

  // Banner la expirare
  if (Object.values(timeLeft).every((x) => x === 0))
    return (
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl md:max-w-5xl mx-auto my-8 sm:my-12 overflow-hidden">
        <div className="relative w-full" style={{ paddingTop: "46%" }}>
          <img
            src={HotelImg}
            alt="Hotel & Piscină"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center top" }}
          />
        </div>
        <div className="p-4 sm:p-10 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-yellow-600 mb-2">
            Trading BootCamp Accelerator
          </h1>
          <h2 className="text-lg sm:text-2xl text-gray-700 mb-4">
            9-14 septembrie • Bacolux Koralio, Eforie Nord
          </h2>
          <div className="text-red-600 text-base sm:text-xl font-bold animate-pulse my-4">
            Bootcampul a început!
          </div>
        </div>
      </div>
    );

  // Banner cu countdown activ
  return (
    <div className="bg-gradient-to-br from-yellow-400 via-white to-blue-500 rounded-3xl shadow-2xl max-w-3xl md:max-w-5xl mx-auto my-8 sm:my-12 overflow-hidden">
      <div className="relative w-full" style={{ paddingTop: "46%" }}>
        <img
          src={HotelImg}
          alt="Hotel & Piscină"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center top" }}
        />
      </div>
      <div className="p-4 sm:p-10">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-yellow-600 mb-2 drop-shadow">
            Trading BootCamp Accelerator
          </h1>
          <h2 className="text-base sm:text-xl md:text-2xl text-gray-700 mb-3 sm:mb-5">
            9-14 septembrie • Bacolux Koralio, Eforie Nord
          </h2>
        </div>
        <div className="flex justify-center gap-2 sm:gap-6 mb-6 sm:mb-10 flex-wrap">
          {timerItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center bg-gray-900/90 text-white px-4 sm:px-6 py-2 sm:py-4 rounded-xl shadow-md text-lg sm:text-3xl mb-2 sm:mb-0"
            >
              <span className="font-bold tracking-widest">
                {formatNumber(item.value)}
              </span>
              <span className="text-xs uppercase text-yellow-300 mt-1 sm:mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-base sm:text-lg">
          <ul className="list-disc list-inside space-y-2 sm:space-y-3 text-gray-700 font-medium pl-2">
            <li>Lecții live cu mentori de top</li>
            <li>Sesiuni practice de trading</li>
            <li>Live trading în echipă</li>
            <li>Strategii profitabile & psihologie</li>
            <li>Educație financiară aplicată</li>
            <li>Networking & petrecere exclusivistă</li>
          </ul>
          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-start md:items-end">
            <p className="bg-yellow-600/80 py-2 sm:py-3 px-4 sm:px-8 rounded-lg font-bold text-lg sm:text-xl hover:bg-yellow-700 transition">
              800€ / cameră dublă
            </p>
            <p className="bg-yellow-500/80 py-2 sm:py-3 px-4 sm:px-8 rounded-lg font-bold text-base sm:text-lg hover:bg-yellow-600 transition">
              700€ / cameră single
            </p>
            <p className="bg-gray-500 py-2 sm:py-3 px-4 sm:px-8 rounded-lg font-bold">
              200€ / fără cazare
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 text-right">
              * Mic dejun, Coffee break zilnic și Cină festivă (White Party All
              Inclusive)
            </p>
            <button
              className="mt-1 sm:mt-3 bg-yellow-500 text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-md hover:bg-yellow-600 transition text-base sm:text-lg animate-bounce"
              onClick={() => setShowModal(true)}
            >
              Înscrie-te ACUM!
            </button>
          </div>
        </div>
      </div>
      {showModal && <Modal />}
    </div>
  );
};

export default BootcampBanner;
