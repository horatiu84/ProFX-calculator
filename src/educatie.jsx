import React, { useState, useEffect } from "react";
import { db } from "./db/FireBase";
import { doc, getDoc } from "firebase/firestore";
import {
  BookOpen,
  Calculator,
  Download,
  Video,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  TrendingUp,
  BarChart3,
} from "lucide-react";
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
    <div className="max-w-3xl mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Materiale Educative ProFX
          </h1>
        </div>

        {/* Pip Information Card */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 mb-12 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mr-4">
              <BarChart3 className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Ce sunt pipsii pe XAUUSD?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Pipul este o unitate mică folosită pentru a măsura mișcarea
                prețului.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Pe XAUUSD (aur), un pip reprezintă o schimbare de{" "}
                <span className="text-yellow-400 font-semibold">0.1</span> în
                prețul aurului.
              </p>
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <p className="text-yellow-300">
                  <strong>Exemplu:</strong> Dacă prețul aurului crește de la
                  1980.00 la 1980.10, atunci s-a mișcat 1 pip.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
                <h3 className="text-xl font-bold text-white">
                  Valoarea unui pip
                </h3>
              </div>
              <p className="text-slate-300">
                Valoarea pipului variază în funcție de dimensiunea lotului
                tranzacționat.
              </p>
              <p className="text-slate-300">
                Un lot standard (1 lot) = 100 uncii de aur, iar valoarea unui
                pip pentru 1 lot este de{" "}
                <span className="text-green-400 font-semibold">10 USD</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Pip Calculator */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 mb-12 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mr-4">
              <Calculator className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Calculator Pip</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-slate-300 font-medium mb-3">
                Introdu valoarea lotului:
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="w-full p-4 bg-slate-700/50 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                value={pipLotInput}
                onChange={(e) =>
                  setPipLotInput(parseFloat(e.target.value) || 0.01)
                }
              />
              <div className="mt-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600">
                <p className="text-purple-300 text-lg">
                  Valoare pip:{" "}
                  <span className="text-2xl font-bold text-white">
                    {(pipLotInput * 10).toFixed(2)} USD
                  </span>
                </p>
              </div>
            </div>

            {/* Lot Size Table */}
            <div className="overflow-hidden rounded-xl border border-slate-600">
              <table className="w-full text-sm text-white">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="p-3 text-left font-semibold text-yellow-400">
                      Loturi
                    </th>
                    <th className="p-3 text-left font-semibold text-yellow-400">
                      Valoare pip
                    </th>
                    <th className="p-3 text-left font-semibold text-yellow-400">
                      10 pipsi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/50">
                  {[
                    ["0.01", "0.1 USD", "1 USD"],
                    ["0.05", "0.5 USD", "5 USD"],
                    ["0.10", "1 USD", "10 USD"],
                    ["0.20", "2 USD", "20 USD"],
                    ["0.50", "5 USD", "50 USD"],
                    ["1.00", "10 USD", "100 USD"],
                    ["1.25", "12.5 USD", "125 USD"],
                    ["1.50", "15 USD", "150 USD"],
                    ["1.75", "17.5 USD", "175 USD"],
                    ["2.00", "20 USD", "200 USD"],
                  ].map(([lot, value, example], idx) => (
                    <tr
                      key={idx}
                      className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="p-3 font-medium">{lot}</td>
                      <td className="p-3 text-green-400">{value}</td>
                      <td className="p-3 text-yellow-400">{example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mr-4">
                <Video className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Ghid Video pentru folosirea aplicației MT5
              </h2>
            </div>
            <div className="text-center">
              <a
                href="https://www.youtube.com/watch?v=WwX5oC1dKIw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Video className="w-5 h-5 mr-2" />
                Deschide în YouTube
              </a>
            </div>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mr-4">
                <Video className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Cum funcționează trailing stop
              </h2>
            </div>
            <video controls className="w-full rounded-xl shadow-lg">
              <source src="/trailing stop.mp4" type="video/mp4" />
              Browserul tău nu suportă redarea video.
            </video>
          </div>
        </div>

        {/* Mobile Videos */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center mr-3">
                <Video className="w-5 h-5 text-green-400" />
              </div>
              MT5 pe Android
            </h2>
            <video
              controls
              className="w-full max-w-xl mx-auto aspect-video rounded-xl shadow-lg"
            >
              <source src="/tudor android.mp4" type="video/mp4" />
              Browserul tău nu suportă redarea video.
            </video>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center mr-3">
                <Video className="w-5 h-5 text-blue-400" />
              </div>
              MT5 pe iPhone
            </h2>
            <video
              controls
              className="w-full max-w-xl mx-auto aspect-video rounded-xl shadow-lg"
            >
              <source src="/tudor iphone.mp4" type="video/mp4" />
              Browserul tău nu suportă redarea video.
            </video>
          </div>
        </div>

        {/* Course Downloads */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 mb-12 shadow-xl">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mr-4">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Lecții în format PDF</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Lecția 1 - Introducere",
                file: "/Curs ProFX - Lectia 1.pdf",
              },
              {
                title: "Lecția 2 - Grafice. Lumânări",
                file: "/Curs ProFX - Lectia 2.pdf",
              },
              {
                title: "Lecția 3 - Trenduri",
                file: "/Curs ProFX - Lectia 3.pdf",
              },
              {
                title: "Lecția 4 - Acțiunea Prețului",
                file: "/Curs ProFX - Lectia 4.pdf",
              },
              {
                title: "Lecția 5 - Risk Management",
                file: "/Curs ProFX - Lectia 5.pdf",
              },
            ].map((lesson, idx) => (
              <a
                key={idx}
                href={lesson.file}
                download
                className="flex items-center p-6 bg-slate-700/50 rounded-2xl border border-slate-600 hover:bg-slate-700/70 transition-all duration-200 transform hover:scale-105 group"
              >
                <Download className="w-6 h-6 text-blue-400 mr-3 group-hover:text-blue-300" />
                <span className="text-white font-medium group-hover:text-blue-100">
                  {lesson.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mr-4">
              <Download className="w-6 h-6 text-green-400" />
            </div>
            Resurse Adiționale PDF
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Dicționarul ProFX",
                file: "/Dictionar ProFX.pdf",
                iconColor: "text-green-400",
              },
              {
                title: "Ghid folosire MT5 mobile",
                file: "/Ghid folosire mt5.pdf",
                iconColor: "text-purple-400",
              },
              {
                title: "Ghid conectare MT5 mobile",
                file: "/Ghid conectare MT5.pdf",
                iconColor: "text-orange-400",
              },
              {
                title: "Introducere în Formațiile de Lumânări",
                file: "/ProFX - Introducere-in-Formatiile-de-Lumanari ( Mitica ).pdf",
                iconColor: "text-cyan-400",
              },
            ].map((resource, idx) => (
              <a
                key={idx}
                href={resource.file}
                download
                className="flex items-center p-6 bg-slate-700/50 rounded-2xl border border-slate-600 hover:bg-slate-700/70 hover:scale-105 transition-all duration-200 group"
              >
                <Download
                  className={`w-6 h-6 ${resource.iconColor} mr-4 group-hover:text-white`}
                />
                <span className="text-white font-medium group-hover:text-slate-200">
                  {resource.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-slate-200 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Ieși din sesiune
          </button>
        </div>
      </div>
    </div>
  );
};

export default Educatie;
