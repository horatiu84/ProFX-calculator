import React from "react";

const beginnerLinks = [
  {
    title: "Prezentare Aplicația MT5",
    url: "https://youtu.be/lfh3VtQnL-4",
  },
  {
    title: "Paternuri",
    url: "https://youtu.be/6VlTjwkCMUY?si=Jwj892KeW2ySAvxd",
  },
];

const advancedLinks = [
  {
    title: "Lecțiile de la 1 - 7 de pe canalul nostru de Youtube",
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
    title: "Masterclass “Divergențe în Trading”",
    url: "https://youtu.be/K4diseWETYQ?si=Tc6tHJSVAGmEYN6i",
  },
  {
    title: "Masterclass “Divergențe în Trading - 2”",
    url: "https://youtu.be/soJP3FEIY08",
  },
  {
    title: "Intrările pe Impuls & liquidity",
    url: "https://youtu.be/3Wa8vkqHiFg?si=Bohn8hbXmt54L7lv",
  },
];

const Training = () => (
  <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 max-w-3xl mx-auto">
    <div className="max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-8">
      <h1 className="text-3xl font-extrabold text-blue-400 mb-2 text-center">
        Salutare ProFx Fam!
      </h1>
      <p className="text-gray-300 text-center mb-6">
        Cei care v-ați alăturat comunității în ultima perioadă:<br />
        Aveți aici înregistrarea webinariilor despre execuție <span className="font-bold text-blue-300">PRICE ACTION</span> și sesiunile de Q&A!
      </p>
      <div className="bg-blue-950 rounded-lg p-4 mb-6">
        <p className="text-blue-200 font-semibold text-center">
          Vă recomand să treceți prin ele cu pix și foaie!<br />
          <span className="italic text-blue-400">Note takers are money makers!</span>
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

      <div className="mt-6 text-center">
        <p className="text-gray-300 font-semibold text-lg mb-2">
          Vizionare productivă!
        </p>
        <span className="text-blue-400 font-bold">Echipa ProFx!</span>
      </div>
    </div>
  </div>
);

export default Training;
