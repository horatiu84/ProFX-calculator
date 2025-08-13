import React, { useState } from "react";
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

const FormularInscriereConcurs = () => {
  const [nume, setNume] = useState("");
  const [telefon, setTelefon] = useState("");
  const [linkMyFxBook, setLinkMyFxBook] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!nume || !telefon || !linkMyFxBook) {
      setError("Toate câmpurile sunt obligatorii!");
      return;
    }
    if (!isValidPhoneNumber(telefon)) {
      setError("Numărul de telefon este invalid pentru țara selectată!");
      return;
    }
    // Validare simplă pentru link (poate fi îmbunătățită)
    try {
      new URL(linkMyFxBook);
    } catch (_) {
      setError("Link-ul MyFxBook este invalid! Trebuie să fie un URL valid.");
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
        setError(
          "Acest număr de telefon a fost deja înscris. Urmărește pașii de pe Telegram pentru acces total."
        );
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
      setError("Eroare la înscriere: " + err.message);
    }
  };

  return (
    <div className="bg-[#1e1e1e] p-4 rounded-lg mt-10 mb-14 max-w-md mx-auto text-white">
      <h2 className="text-center text-lg font-semibold mb-3">
        Înscriere la Concurs
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <label className="text-left text-sm text-gray-300" htmlFor="nume">
          Nume:
        </label>
        <input
          type="text"
          id="nume"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          placeholder="Introdu numele tău"
          required
        />

        <label className="text-left text-sm text-gray-300" htmlFor="telefon">
          Număr de telefon:
        </label>
        <PhoneInput
          international
          defaultCountry="RO"
          value={telefon}
          onChange={setTelefon}
          className="PhoneInput dark-theme"
          inputClassName="p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-full"
          countrySelectClassName="bg-[#2a2a2a] text-white border-gray-600"
          placeholder="Introdu numărul tău"
          required
        />

        <label className="text-left text-sm text-gray-300" htmlFor="linkMyFxBook">
          Link MyFxBook:
        </label>
        <input
          type="url"
          id="linkMyFxBook"
          value={linkMyFxBook}
          onChange={(e) => setLinkMyFxBook(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          placeholder="Introdu link-ul tău MyFxBook"
          required
        />

        <button
          type="submit"
          className="p-2 mt-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
        >
          Înscrie-te
        </button>
      </form>
      {error && (
        <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
      )}
      {success && (
        <p className="text-green-400 text-sm mt-2 text-center">
          Înscriere reușită!{" "}
        </p>
      )}
    </div>
  );
};

export default FormularInscriereConcurs;