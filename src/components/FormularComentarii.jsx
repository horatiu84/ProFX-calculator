import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../db/FireBase.js";

const FormularComentarii = ({ newsId }) => {
  const [nume, setNume] = useState("");
  const [comentariu, setComentariu] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!nume.trim() || !comentariu.trim()) {
      setError("Toate câmpurile sunt obligatorii!");
      return;
    }

    if (nume.trim().length < 2) {
      setError("Numele trebuie să aibă cel puțin 2 caractere!");
      return;
    }

    if (comentariu.trim().length < 10) {
      setError("Comentariul trebuie să aibă cel puțin 10 caractere!");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "newsComments"), {
        name: nume.trim(),
        text: comentariu.trim(),
        newsId: newsId,
        createdAt: serverTimestamp(),
      });
      
      setSuccess(true);
      setNume("");
      setComentariu("");
      
      // Resetează mesajul de success după 3 secunde
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Eroare la trimiterea comentariului:", err);
      setError("Eroare la trimiterea comentariului. Te rog încearcă din nou!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-white hover:border-amber-400/30 transition-all duration-500 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-4 text-amber-400 group-hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
          <span>💬</span>
          Lasă un comentariu
        </h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block" htmlFor="nume">
              Nume:
            </label>
            <input
              type="text"
              id="nume"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-600/50 bg-gray-800/50 text-white placeholder-gray-400 hover:bg-gray-700/50 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
              placeholder="Introdu numele tău"
              maxLength={50}
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block" htmlFor="comentariu">
              Comentariu:
            </label>
            <textarea
              id="comentariu"
              value={comentariu}
              onChange={(e) => setComentariu(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl border border-gray-600/50 bg-gray-800/50 text-white placeholder-gray-400 resize-none hover:bg-gray-700/50 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
              placeholder="Scrie comentariul tău aici..."
              maxLength={500}
              disabled={isSubmitting}
              required
            />
            <div className="text-xs text-gray-400 mt-1 text-right">
              {comentariu.length}/500 caractere
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl shadow-md transition duration-300 hover:bg-gray-700/50 hover:border-amber-400/50 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Se trimite...
              </span>
            ) : (
              "Publică comentariul"
            )}
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-400/50 text-red-400 p-3 rounded-xl text-sm flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 border border-green-400/50 text-green-400 p-3 rounded-xl text-sm flex items-center gap-2 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              Comentariul tău a fost publicat cu succes!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormularComentarii;
