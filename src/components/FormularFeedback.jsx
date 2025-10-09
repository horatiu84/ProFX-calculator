import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../db/FireBase.js";

const FormularAnonim = () => {
  const [educatie, setEducatie] = useState("");
  const [liveTrade, setLiveTrade] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!educatie) {
      setError("Te rog să alegi o notă pentru Educație.");
      return;
    }
    if (!liveTrade) {
      setError("Te rog să alegi o notă pentru Live/Trade.");
      return;
    }
    if (!mesaj.trim()) {
      setError("Te rog să scrii un mesaj.");
      return;
    }

    try {
      await addDoc(collection(db, "formularAnonim"), {
        educatie: Number(educatie),
        liveTrade: Number(liveTrade),
        mesaj: mesaj.trim(),
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setEducatie("");
      setLiveTrade("");
      setMesaj("");
    } catch (err) {
      setError("Eroare la trimiterea formularului: " + err.message);
    }
  };

  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mt-5 max-w-md mx-auto text-white hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <h2 className="text-center text-lg font-semibold mb-4 text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
          Formular Anonim pentru Feedback
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="text-sm text-gray-300" htmlFor="educatie">
            Educație (nota 1-10):
          </label>
          <select
            id="educatie"
            value={educatie}
            onChange={(e) => setEducatie(e.target.value)}
            className="p-2 rounded-xl border border-gray-600/50 bg-gray-800/50 text-white hover:bg-gray-700/50 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
            required
          >
            <option value="">-- Alege o nota --</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <label className="text-sm text-gray-300" htmlFor="liveTrade">
            Sesiuni Live/Trade (nota 1-10):
          </label>
          <select
            id="liveTrade"
            value={liveTrade}
            onChange={(e) => setLiveTrade(e.target.value)}
            className="p-2 rounded-xl border border-gray-600/50 bg-gray-800/50 text-white hover:bg-gray-700/50 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
            required
          >
            <option value="">-- Alege o nota --</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <label className="text-sm text-gray-300" htmlFor="mesaj">
            Mesaj/Feedback către noi:
          </label>
          <textarea
            id="mesaj"
            value={mesaj}
            onChange={(e) => setMesaj(e.target.value)}
            rows={4}
            className="p-2 rounded-xl border border-gray-600/50 bg-gray-800/50 text-white resize-none hover:bg-gray-700/50 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
            placeholder="Scrie un mesaj sau feedback complet"
            required
          />

          <button
            type="submit"
            className="px-5 py-2 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl shadow-md transition duration-300 hover:bg-gray-700/50 hover:border-amber-400/50 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          >
            Trimite Feedback
          </button>

          <p className="text-xs text-gray-400 text-center">
            Feedbackul tău este complet anonim și ne ajută să ne îmbunătățim.
          </p>

          {error && (
            <p className="text-red-400 text-center mt-2 font-semibold">{error}</p>
          )}
          {success && (
            <p className="text-green-400 text-center mt-2 font-semibold flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Mulțumim pentru feedback!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormularAnonim;
