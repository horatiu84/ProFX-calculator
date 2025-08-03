import React, { useState, useEffect } from "react";
import { db } from "./db/FireBase";
import { doc, getDoc } from "firebase/firestore";
import FormularInscriere from "./components/FormularInscriere";

const PASSWORD_KEY = "profx_educatie_access";

const Educatie = () => {
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");
  const [pipLotInput, setPipLotInput] = useState(0.01);
  const [showSignup, setShowSignup] = useState(false);
  const [correctPassword, setCorrectPassword] = useState(null);

  useEffect(() => {
    const fetchPassword = async () => {
      try {
        const docRef = doc(db, "settings", "educatieAccess");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const storedPassword = docSnap.data().password;
          setCorrectPassword(storedPassword);
          const savedPassword = sessionStorage.getItem(PASSWORD_KEY);
          if (savedPassword === storedPassword) {
            setAccessGranted(true);
          }
        } else {
          setError("Documentul de acces nu a fost găsit.");
        }
      } catch (error) {
        console.error("Eroare la accesarea parolei:", error);
        setError("Eroare la verificarea parolei. Încearcă din nou.");
      }
    };

    fetchPassword();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      sessionStorage.setItem(PASSWORD_KEY, correctPassword);
      setAccessGranted(true);
      setError("");
    } else {
      setError("Parolă greșită. Încearcă din nou.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PASSWORD_KEY);
    setAccessGranted(false);
    setPassword("");
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  if (!accessGranted) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">
          Acces Materiale Educaționale ProFX
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Introdu parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Accesează
          </button>
        </form>
        <button
          onClick={toggleSignup}
          className="w-full mt-3 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {showSignup ? "Ascunde Înscriere" : "Înscrie-te"}
        </button>
        {showSignup && <FormularInscriere />}
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">ℹ️ Ce sunt pipsii pe XAUUSD?</h2>
        <p className="mb-2">
          Pipul este o unitate mică folosită pentru a măsura mișcarea prețului.
        </p>
        <p className="mb-2">
          Pe XAUUSD (aur), un pip reprezintă o schimbare de 0.1 în prețul
          aurului. De exemplu:
        </p>
        <p className="mb-4">
          Dacă prețul aurului crește de la 1980.00 la 1980.10, atunci s-a mișcat
          1 pip.
        </p>

        <h2 className="text-xl font-bold mb-2">💡 Valoarea unui pip</h2>
        <p>
          Valoarea pipului variază în funcție de dimensiunea lotului
          tranzacționat.
        </p>
        <p>
          Un lot standard (1 lot) = 100 uncii de aur, iar valoarea unui pip
          pentru 1 lot este de 10 USD.
        </p>

        <h2 className="text-xl font-bold mt-6 mb-2">
          📊 Exemple de dimensiuni de loturi
        </h2>
        <table className="w-full text-sm text-left text-white border border-gray-700">
          <thead className="bg-gray-800 text-yellow-300">
            <tr>
              <th className="p-2 border border-gray-700">Loturi (mărime)</th>
              <th className="p-2 border border-gray-700">
                Valoare unui pip (USD)
              </th>
              <th className="p-2 border border-gray-700">
                Exemplu: 10 pipsi câștigați/pierduți
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["0.01", "0.1 USD", "10 pipsi = 1 USD"],
              ["0.05", "0.5 USD", "10 pipsi = 5 USD"],
              ["0.10", "1 USD", "10 pipsi = 10 USD"],
              ["0.20", "2 USD", "10 pipsi = 20 USD"],
              ["0.50", "5 USD", "10 pipsi = 50 USD"],
              ["1", "10 USD", "10 pipsi = 100 USD"],
              ["1.25", "12.5 USD", "10 pipsi = 125 USD"],
              ["1.50", "15 USD", "10 pipsi = 150 USD"],
              ["1.75", "17.5 USD", "10 pipsi = 175 USD"],
              ["2", "20 USD", "10 pipsi = 200 USD"],
            ].map(([lot, value, example], idx) => (
              <tr key={idx} className="border-t border-gray-700">
                <td className="p-2 border border-gray-700">{lot}</td>
                <td className="p-2 border border-gray-700">{value}</td>
                <td className="p-2 border border-gray-700">{example}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-xl font-bold mt-10 mb-4">
          📌 Calculează valoarea pip-ului
        </h2>
        <div className="mb-4">
          <label className="block mb-2">
            Introdu valoarea lotului (ex: 0.05):
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="w-full p-2 bg-gray-800 text-white rounded"
            value={pipLotInput}
            onChange={(e) => setPipLotInput(e.target.value)}
          />
        </div>
        <p className="text-yellow-400 text-lg">
          Valoare pip estimată: <strong>{(pipLotInput * 10).toFixed(2)}</strong>{" "}
          USD
        </p>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">
          🎥 Ghid Video pentru folosirea aplicației MT5
        </h2>
        <div className="text-center">
          <a
            href="https://www.youtube.com/watch?v=WwX5oC1dKIw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-yellow-500 text-black rounded shadow hover:bg-yellow-400"
          >
            🔗 Deschide videoclipul în YouTube
          </a>
        </div>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 mt-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">
          🎬 Videoclip: Cum funcționează trailing stop
        </h2>
        <video controls className="w-full rounded-lg">
          <source src="/trailing stop.mp4" type="video/mp4" />
          Browserul tău nu suportă redarea video.
        </video>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 mt-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">🎬 Videoclip: MT5 pe Android</h2>
        <video
          controls
          className="w-full max-w-xl mx-auto aspect-video rounded-lg"
        >
          <source src="/tudor android.mp4" type="video/mp4" />
          Browserul tău nu suportă redarea video.
        </video>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 mt-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">🎬 Videoclip: MT5 pe iPhone</h2>
        <video
          controls
          className="w-full max-w-xl mx-auto aspect-video rounded-lg"
        >
          <source src="/tudor iphone.mp4" type="video/mp4" />
          Browserul tău nu suportă redarea video.
        </video>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <a
          href="/Curs ProFX - Lectia 1.pdf"
          download
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
          📥 Descarcă Curs ProFX - Lecția 1
        </a>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <a
          href="/Curs ProFX - Lectia 2.pdf"
          download
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
          📥 Descarcă Curs ProFX - Lecția 2
        </a>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <a
          href="/Curs ProFX - Lectia 3.pdf"
          download
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
          📥 Descarcă Curs ProFX - Lecția 3
        </a>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <a
          href="/Curs ProFX - Lectia 4.pdf"
          download
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
          📥 Descarcă Curs ProFX - Lecția 4
        </a>
      </div>
         <div className="flex justify-center gap-4 mt-6">
        <a
          href="/Curs ProFX - Lectia 5.pdf"
          download
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
          📥 Descarcă Curs ProFX - Lecția 5
        </a>
      </div>
      <div className="text-center mt-6">
        <a
          href="/Dictionar ProFX.pdf"
          download
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
          📥 Descarcă Dictionarul ProFX
        </a>
      </div>
      <div className="text-center mt-6">
        <a
          href="/Ghid folosire mt5.pdf"
          download
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
          📥 Descarcă ghidul de folosire MT5 mobile
        </a>
      </div>
      <div className="text-center mt-6">
        <a
          href="/Ghid conectare MT5.pdf"
          download
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
          📥 Descarcă ghidul de conectare MT5 mobile
        </a>
      </div>

      <div className="text-center mt-6">
        <a
          href="/ProFX - Introducere-in-Formatiile-de-Lumanari ( Mitica ).pdf"
          download
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
          📥 Descarcă ghidul de Introducere in Formatiile de Lumanari
        </a>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-300 underline"
        >
          Ieși din sesiune
        </button>
      </div>
    </div>
  );
};

export default Educatie;
