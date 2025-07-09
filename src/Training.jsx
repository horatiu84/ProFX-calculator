import React, { useState, useEffect } from "react";
import FlipCard from "./FlipCard";

const correctPassword = "1224";
const PASSWORD_KEY = "profx_access_password";

const Training = () => {
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedPassword = sessionStorage.getItem(PASSWORD_KEY);
    if (savedPassword === correctPassword) {
      setAccessGranted(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAccessGranted(true);
      sessionStorage.setItem(PASSWORD_KEY, correctPassword);
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

  const materiale = [
    {
      title: "Ce este un model de tip cupă și mâner? - by Daniel Sarbu",
      url: "https://sirbudcfx.blogspot.com/2025/06/ce-este-un-model-de-tip-cupa-si-maner.html",
    },
    {
      title: "Masterclass “Divergențe în Trading” - cu Mihai Tiepac",
      url: "https://youtu.be/K4diseWETYQ?si=Tc6tHJSVAGmEYN6i",
    },
    {
      title: "Masterclass “Divergențe în Trading - 2” -cu Mihai Tiepac",
      url: "https://youtu.be/soJP3FEIY08",
    },
    {
      title: "Webinar cu Mihai Tiepac 08 07 2025 ",
      url: "https://youtu.be/52FKs74rpjs?si=dWIo5ida-deg2TIJ",
    },
  ];

  const advancedLinks = [
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
      title: "Webinar backtesting si Q&A - 1",
      url: "https://youtu.be/x7LwzhMsbvo",
    },
    {
      title: "Webinar backtesting si Q&A - 2",
      url: "https://www.youtube.com/live/rd9Sy8nLlM8?si=Jj3vhPsEGDkGzsC8",
    },
    {
      title: "Webinar Q&A + Viziunea ProFx",
      url: "https://youtu.be/TsCk6YDlJVs?si=l-n_VhvZ0ta92Qqt",
    },
    {
      title: "Webinar backtesting + Q&A",
      url: "https://youtu.be/5NEbOwgwkUc?si=jm5XkdP4DGfVvXNg",
    },
    {
      title: "Webinar backtesting + Q&A (alt link)",
      url: "https://youtu.be/F_7HqZYjipM?si=vGqR7j_UKxUjV_wU",
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
      title: "Backtesting Session - 15/06/2025",
      url: "https://youtu.be/-5Z7re53Uf8?si=37vS7j6RD5C_Nz8E",
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
      title: "Backtesting XauUsd 22.06.2025",
      url: "https://youtu.be/lpwGUmIFpL0?si=Z3zILXu2_EVSpkPo",
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
        <p className="text-center text-sm text-gray-400 mt-4">
          Nu ești încă membru al comunității ProFX?{" "}
          <a
            href="https://t.me/ProFX_Community"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Intră pe canalul nostru de Telegram
          </a>{" "}
          și urmează pașii pentru acces complet la materialele educaționale.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 max-w-3xl mx-auto">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-blue-400 mb-2 text-center">
          Salutare ProFx Fam!
        </h1>
        <p className="text-gray-300 text-center mb-6">
          Cei care v-ați alăturat comunității în ultima perioadă:
          <br />
          Aveți aici înregistrarea webinariilor despre execuție{" "}
          <span className="font-bold text-blue-300">PRICE ACTION</span> și
          sesiunile de Q&A!
        </p>

        <div className="bg-blue-950 rounded-lg p-4 mb-6">
          <p className="text-blue-200 font-semibold text-center">
            Vă recomand să treceți prin ele cu pix și foaie!
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
            🟠 Avansați
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {advancedLinks.map((item, idx) => (
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
