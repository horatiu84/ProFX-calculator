import React, { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./db/FireBase.js";
import FlipCard from "./FlipCard";
import FormularInscriere from "./components/FormularInscriere";

const PASSWORD_KEY = "profx_access_password";

const Training = () => {
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const savedPassword = sessionStorage.getItem(PASSWORD_KEY);
    if (savedPassword) {
      verifyPassword(savedPassword);
    }
  }, []);

  const verifyPassword = async (inputPassword) => {
    try {
      const docRef = doc(db, "settings", "trainingAccess");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const storedPassword = docSnap.data().password;
        if (inputPassword === storedPassword) {
          setAccessGranted(true);
          sessionStorage.setItem(PASSWORD_KEY, inputPassword);
          setError("");
        } else {
          setError("Parolă greșită. Încearcă din nou.");
        }
      } else {
        setError("Eroare: parola nu este disponibilă.");
      }
    } catch (err) {
      console.error("Eroare la verificarea parolei:", err);
      setError("Eroare la verificarea parolei. Încearcă din nou.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verifyPassword(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PASSWORD_KEY);
    setAccessGranted(false);
    setPassword("");
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  const beginnerLinks = [
    {
      title: "Prezentare Aplicația MT5",
      url: "https://youtu.be/lfh3VtQnL-4",
    },
    {
      title: "Paternuri",
      url: "https://youtu.be/6VlTjwkCMUY?si=Jwj892KeW2ySAvxd",
    },
    {
      title: "Webinar Incepatori 10/06/2025",
      url: "https://youtu.be/phhoKeZH44k?si=OH46WM0V3o6NUpAB",
    },
  ];

  const advancedGeneralLinks = [
    {
      title: "Lecțiile de la 1 - 10 de pe canalul nostru de Youtube",
      url: "https://youtube.com/@profx-romania?si=wA7daxrGD2nedUBj",
    },
    {
      title: "Cum să executați ideile de Trade ale lui Flaviu",
      url: "https://youtu.be/fBqbevzaIaU?si=Mkhv_hpvNa-H_JsL",
    },
    {
      title: "Strategie executie actiunea pretului si Q&A",
      url: "https://youtu.be/92jGomG6dnA",
    },
    {
      title: "Fakeouts + Q&A (Trader Daniel)",
      url: "https://youtu.be/gJV8eGQTE3I",
    },
    {
      title: "Intrările pe Impuls & liquidity",
      url: "https://youtu.be/3Wa8vkqHiFg?si=Bohn8hbXmt54L7lv",
    },
    {
      title: "Cand dam o a 2a sansa tranzactiei & Market Structure",
      url: "https://youtu.be/yYkRlBA_cHs?si=2Ax-urncY2_Kzs2O",
    },
    {
      title: "Corelarea intre timeframe urile M30 si M15",
      url: "https://youtu.be/iBy8WbNq9bs?si=Uryhns8QgR79ekbr",
    },
    {
      title: "Risk Management 1.0",
      url: "https://youtu.be/Ai10kdtbNvM?si=xBMzktL-xp5xAvK8",
    },
    {
      title: "Risk Management 2.0",
      url: "https://youtu.be/iuv_itQfepM?si=ccaph62qj29LMgRZ",
    },
    {
      title: "Sesiune practica pentru avansati - 10/07/2025",
      url: "https://youtu.be/Lqsq3aF_sKw?si=PKpQ3QOwclYwGSEO",
    },
    {
      title: "Sesiune Practica Mentorat 17.07.2025",
      url: "https://youtu.be/jbZwc7KCOiw?si=BOHXtNDyUnmKuO2G",
    },
    {
      title: " Fakeouts - Cum le poti gestiona si risk Managementul lor",
      url: "https://youtu.be/UsPmwdhrl_M?si=leP1b7fzCtkuhw90",
    },
  ];

  const backtestingLinks = [
    {
      title: "Webinar backtesting si Q&A - 1",
      url: "https://youtu.be/x7LwzhMsbvo",
    },
    {
      title: "Webinar backtesting si Q&A - 2",
      url: "https://www.youtube.com/live/rd9Sy8nLlM8?si=Jj3vhPsEGDkGzsC8",
    },
    {
      title: "Webinar Backtesting si Q&A + Viziunea ProFx",
      url: "https://youtu.be/TsCk6YDlJVs?si=l-n_VhvZ0ta92Qqt",
    },
    {
      title: "Webinar backtesting + Q&A",
      url: "https://youtu.be/5NEbOwgwkUc?si=jm5XkdP4DGfVvXNg",
    },
    {
      title: "Backtesting Session - 15/06/2025",
      url: "https://youtu.be/-5Z7re53Uf8?si=37vS7j6RD5C_Nz8E",
    },
    {
      title: "Backtesting XauUsd 22.06.2025",
      url: "https://youtu.be/lpwGUmIFpL0?si=Z3zILXu2_EVSpkPo",
    },
    {
      title: "Backtesting Session 06/07/2025",
      url: "https://youtu.be/IG7DvagZq7I?si=UUJX0kDhnkBDZoyz",
    },
    {
      title: "Backtesting Session - 13/07/2025",
      url: "https://youtu.be/pz1V-Vc_JWA?si=qRqH_kljeQNbPfwI",
    },
    {
      title: "Backtesting Session - 03/08/2025",
      url: "https://youtu.be/OioK9t2lc8M",
    },
    {
      title: "Backtesting Session - 17/08/2025",
      url: "https://youtu.be/RjdGXZxft5s?si=dAFFjSmwY95u7Dvm",
    },
  ];

  const macroeconomieLinks = [
    {
      title: "Macroeconomie - Ep.1 Inflatie",
      url: "https://youtu.be/IPtfRhvQJgs?si=dRMTSPR9yPZ9Ap6f",
    },
    {
      title: "Macroeconomie - EP.2 PIB",
      url: "https://youtu.be/4f7-xg7lRhI?si=2oherYO-dG4QxQAs",
    },
  ];

  const materiale = [
    {
      title: "Ce este un model de tip cupă și mâner? - by Daniel Sarbu",
      url: "https://sirbudcfx.blogspot.com/2025/06/ce-este-un-model-de-tip-cupa-si-maner.html",
    },
    {
      title: "Head and shoulders pattern - by Daniel Sarbu",
      url: "https://sirbudcfx.blogspot.com/2025/07/head-and-shoulders-pattern-in-aceasta.html",
    },
    {
      title: "Masterclass Divergențe în Trading - cu Mihai Tiepac",
      url: "https://youtu.be/K4diseWETYQ?si=Tc6tHJSVAGmEYN6i",
    },
    {
      title: "Masterclass 'Divergențe în Trading - 2 -cu Mihai Tiepac",
      url: "https://youtu.be/soJP3FEIY08",
    },
    {
      title: "Curs inflatie Forex ",
      url: "/Curs Inflatie Forex.pdf",
      type: "pdf",
    },
    {
      title: "Indicatori Macroeconomici",
      url: "/Indicatori Macroeconomici.pdf",
      type: "pdf",
    },
     {
      title: "Înțelegerea PIB-ului: Coloana vertebral a analizei economice",
      url: "/Intelegerea PIB-ului.pdf",
      type: "pdf",
    },
  ];

  const analizeSaptamanale = [
    {
      title: "Analiza saptamanala 18 08 2025",
      url: "https://youtu.be/e2z0ecJj2pQ?si=Pwu51YoUXXt82XHL",
    },
    {
      title: "Analiza saptamanala 22 08 2025",
      url: "https://youtu.be/0ujRUpll_Ao?si=ryhpYYbq3xn0ZMm7",
    }, {
      title: "Analiza Saptamanala  25 08 2025",
      url: "https://youtu.be/chmtZv2jwig?si=aGicjTJnVgtIMNZu",
    },
  ];

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-amber-400 mb-6 text-center">
            Acces Training ProFx
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Introdu parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
            >
              Accesează
            </button>
          </form>
          <button
            onClick={toggleSignup}
            className="w-full mt-4 bg-gray-600/50 hover:bg-gray-600/70 text-white font-bold py-3 px-4 rounded-lg transition-all border border-gray-500/50"
          >
            {showSignup ? "Ascunde Înscriere" : "Înscrie-te"}
          </button>
          {showSignup && (
            <div className="mt-6">
              <FormularInscriere />
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-2xl mb-6 shadow-xl">
          <span className="text-4xl">🎯</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Training <span className="text-amber-400">ProFX</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Cei care v-ați alăturat comunității: aveți aici înregistrarea webinariilor despre execuție{" "}
          <span className="text-amber-400 font-semibold">PRICE ACTION</span> și sesiunile de Q&A!
        </p>
      </div>

      {/* Note Card */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 mb-12 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
        <div className="text-center">
          <p className="text-xl text-gray-300 font-semibold mb-2">
            Recomandat este să treceți prin ele cu pix și foaie!
          </p>
          <p className="text-2xl text-amber-400 font-bold italic">
            Note takers are money makers!
          </p>
        </div>
      </div>

      {/* Training Sections Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Începători Section */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:border-green-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center mr-3 hover:bg-green-400/20 transition-all duration-300">
              <span className="text-xl">🟢</span>
            </div>
            <h2 className="text-xl font-bold text-green-400">
              Începători
            </h2>
          </div>
          <ol className="space-y-3 list-decimal list-inside">
            {beginnerLinks.map((item, idx) => (
              <li key={idx} className="text-gray-300 text-sm">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 underline underline-offset-4 transition-colors font-medium ml-2"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Avansați Section */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:border-orange-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center mr-3 hover:bg-orange-400/20 transition-all duration-300">
              <span className="text-xl">🟠</span>
            </div>
            <h2 className="text-xl font-bold text-orange-400">
              Avansați - Lecții generale
            </h2>
          </div>
          <ol className="space-y-3 list-decimal list-inside">
            {advancedGeneralLinks.map((item, idx) => (
              <li key={idx} className="text-gray-300 text-sm">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-4 transition-colors font-medium ml-2"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">

        {/* Backtesting Section */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:border-blue-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center mr-3 hover:bg-blue-400/20 transition-all duration-300">
              <span className="text-xl">📈</span>
            </div>
            <h2 className="text-xl font-bold text-blue-400">
              Sesiuni Backtesting
            </h2>
          </div>
          <ol className="space-y-3 list-decimal list-inside">
            {backtestingLinks.map((item, idx) => (
              <li key={idx} className="text-gray-300 text-sm">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors font-medium ml-2"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Macroeconomie Section */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:border-teal-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center mr-3 hover:bg-teal-400/20 transition-all duration-300">
              <span className="text-xl">🌍</span>
            </div>
            <h2 className="text-xl font-bold text-teal-400">
              Macroeconomie
            </h2>
          </div>
          <ol className="space-y-3 list-decimal list-inside">
            {macroeconomieLinks.map((item, idx) => (
              <li key={idx} className="text-gray-300 text-sm">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 underline underline-offset-4 transition-colors font-medium ml-2"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">

        {/* Materiale Section */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:border-purple-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center mr-3 hover:bg-purple-400/20 transition-all duration-300">
              <span className="text-xl">🟣</span>
            </div>
            <h2 className="text-xl font-bold text-purple-400">
              Materiale
            </h2>
          </div>
          <ol className="space-y-3 list-decimal list-inside">
            {materiale.map((item, idx) => (
              <li key={idx} className="text-gray-300 text-sm">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors font-medium ml-2"
                  {...(item.type === "pdf" ? { download: true } : {})}
                >
                  {item.title}
                  {item.type === "pdf" && (
                    <span className="ml-2 text-gray-400 text-sm">
                      (PDF)
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Analize Section */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:border-pink-400/50 hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center mr-3 hover:bg-pink-400/20 transition-all duration-300">
              <span className="text-xl">📊</span>
            </div>
            <h2 className="text-xl font-bold text-pink-400">
              Analiză săptămânală macroeconomie
            </h2>
          </div>
          <ol className="space-y-3 list-decimal list-inside">
            {analizeSaptamanale.map((item, idx) => (
              <li key={idx} className="text-gray-300 text-sm">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 underline underline-offset-4 transition-colors font-medium ml-2"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-8 mb-8 shadow-xl hover:border-amber-400/50 hover:bg-gray-800/70 transition-all duration-300">
        <div className="text-center">
          <p className="text-2xl text-gray-300 font-semibold mb-2">
            Vizionare productivă!
          </p>
          <p className="text-2xl text-amber-400 font-bold mb-6">Echipa ProFx!</p>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 hover:text-red-300 rounded-xl transition-all duration-200"
          >
            Ieși din sesiune
          </button>
        </div>
      </div>
      
      {/* FlipCard */}
      <div className="mt-8">
        <FlipCard />
      </div>
    </div>
  );
};

export default Training;
