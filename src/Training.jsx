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
      title: "Lecțiile de la 1 - 8 de pe canalul nostru de Youtube",
      url: "https://youtube.com/@profx-romania?si=wA7daxrGD2nedUBj",
    },
    {
      title: "Webinar Fakeouts + Fibo",
      url: "https://youtu.be/F_7HqZYjipM?si=T8hmZTTa4EzuLBXA",
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
      title: "Webinar cu Mihai Tiepac 08 07 2025 ",
      url: "https://youtu.be/52FKs74rpjs?si=dWIo5ida-deg2TIJ",
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
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">
          Acces Training ProFx
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
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 max-w-3xl mx-auto">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-blue-400 mb-2 text-center">
          Bun venit la Sectiunea Training!
        </h1>
        <p className="text-gray-300 text-center mb-6">
          Cei care v-ați alăturat comunității:
          <br />
          Aveți aici înregistrarea webinariilor despre execuție{" "}
          <span className="font-bold text-blue-300">PRICE ACTION</span> și
          sesiunile de Q&A!
        </p>

        <div className="bg-blue-950 rounded-lg p-4 mb-6">
          <p className="text-blue-200 font-semibold text-center">
            Recomandat este să treceți prin ele cu pix și foaie!
            <br />
            <span className="italic text-blue-400">
              Note takers are money makers!
            </span>
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-blue-300 mb-3 flex items-center gap-2">
            🟢 Începători
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {beginnerLinks.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-200 underline underline-offset-4 transition"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-yellow-300 mb-3 flex items-center gap-2">
            🟠 Avansați - Lecții generale
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {advancedGeneralLinks.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-300 hover:text-yellow-100 underline underline-offset-4 transition"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-red-300 mb-3 flex items-center gap-2">
            📈 Sesiuni Backtesting
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {backtestingLinks.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-200 underline underline-offset-4 transition"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-green-300 mb-3 flex items-center gap-2">
            🌍 Macroeconomie
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {macroeconomieLinks.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-200 underline underline-offset-4 transition"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
            🟣 Materiale
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {materiale.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-200 underline underline-offset-4 transition"
                  {...(item.type === "pdf" ? { download: true } : {})}
                >
                  {item.title}
                  {item.type === "pdf" && (
                    <span className="ml-1 text-gray-400">
                      {" "}
                      &#40;download format PDF&#41;
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-orange-300 mb-3 flex items-center gap-2">
            📊 Analiză săptămânală macroeconomie
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {analizeSaptamanale.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-200 underline underline-offset-4 transition"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-6 text-center">
          <p className="text-gray-300 font-semibold text-lg mb-2">
            Vizionare productivă!
          </p>
          <span className="text-blue-400 font-bold">Echipa ProFx!</span>

          <div className="mt-4">
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 underline"
            >
              Ieși din sesiune
            </button>
          </div>
        </div>
      </div>
      <div>
        <FlipCard />
      </div>
    </div>
  );
};

export default Training;
