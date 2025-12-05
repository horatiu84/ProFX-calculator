import React, { useState, forwardRef } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../db/FireBase.js";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { useLanguage } from "../contexts/LanguageContext";

const FormularInscriereConcurs = () => {
  const { language, translations } = useLanguage();
  const t = translations.formularConcurs;
  
  const [nume, setNume] = useState("");
  const [telefon, setTelefon] = useState("");
  const [linkMyFxBook, setLinkMyFxBook] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Custom input component with forwardRef
  const CustomPhoneInput = forwardRef((props, ref) => (
    <input
      {...props}
      ref={ref}
      id="telefon"
      className="p-2 rounded-xl border border-gray-600/50 bg-gray-800/50 text-white placeholder-gray-400 hover:bg-gray-700/50 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300 w-full"
    />
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!nume || !telefon || !linkMyFxBook) {
      setError(t.errorAllFields);
      return;
    }
    if (!isValidPhoneNumber(telefon)) {
      setError(t.errorInvalidPhone);
      return;
    }
    // Validare simplă pentru link (poate fi îmbunătățită)
    try {
      new URL(linkMyFxBook);
    } catch (_) {
      setError(t.errorInvalidUrl);
      return;
    }

    try {
      // Verificăm duplicat după telefon, deoarece link-ul sau numele pot varia
      const telefonQuery = query(
        collection(db, "inscrieri_concurs"),
        where("telefon", "==", telefon)
      );
      const querySnapshot = await getDocs(telefonQuery);
      if (querySnapshot.size > 0) {
        setError(t.errorDuplicatePhone);
        return;
      }

      await addDoc(collection(db, "inscrieri_concurs"), {
        nume,
        telefon,
        linkMyFxBook,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setNume("");
      setTelefon("");
      setLinkMyFxBook("");
    } catch (err) {
      setError(t.errorSubmit + err.message);
    }
  };

  return (
    <div key={language} className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mt-16 mb-16 max-w-md mx-auto text-white hover:border-amber-400/30 transition-all duration-500 hover:scale-[1.02] overflow-hidden animate-language-change">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <h2 className="text-center text-lg font-semibold mb-4 text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
          {t.title}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="text-sm text-gray-300" htmlFor="nume">
            {t.nameLabel}
          </label>
          <input
            type="text"
            id="nume"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
            className="p-2 rounded-xl border border-gray-600/50 bg-gray-800/50 text-white placeholder-gray-400 hover:bg-gray-700/50 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
            placeholder={t.namePlaceholder}
            required
          />

          <label className="text-sm text-gray-300">
            {t.phoneLabel}
          </label>
          <PhoneInput
            international
            defaultCountry="RO"
            value={telefon}
            onChange={setTelefon}
            className="PhoneInput dark-theme"
            inputComponent={CustomPhoneInput}
            placeholder={t.phonePlaceholder}
            required
          />

          <label className="text-sm text-gray-300" htmlFor="linkMyFxBook">
            {t.myfxbookLabel}
          </label>
          <input
            type="url"
            id="linkMyFxBook"
            value={linkMyFxBook}
            onChange={(e) => setLinkMyFxBook(e.target.value)}
            className="p-2 rounded-xl border border-gray-600/50 bg-gray-800/50 text-white placeholder-gray-400 hover:bg-gray-700/50 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300"
            placeholder={t.myfxbookPlaceholder}
            required
          />

          <button
            type="submit"
            className="px-5 py-2 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl shadow-md transition duration-300 hover:bg-gray-700/50 hover:border-amber-400/50 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          >
            {t.submitButton}
          </button>

          <p className="text-xs text-gray-400 text-center">
            {t.infoNote}
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
              {t.successMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormularInscriereConcurs;