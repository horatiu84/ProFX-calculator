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

const FormularInscriere = () => {
  const [nume, setNume] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    if (!nume || !telefon || !email) {
      setError("Toate câmpurile sunt obligatorii!");
      setSubmitting(false);
      return;
    }
    if (!consent) {
      setError("Trebuie să accepți termenii și politica de confidențialitate!");
      setSubmitting(false);
      return;
    }
    if (!email.includes("@")) {
      setError("Email invalid!");
      setSubmitting(false);
      return;
    }
    if (!isValidPhoneNumber(telefon)) {
      setError("Numărul de telefon este invalid pentru țara selectată!");
      setSubmitting(false);
      return;
    }

    try {
      const emailQuery = query(
        collection(db, "inscrieri"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(emailQuery);
      if (querySnapshot.size > 0) {
        setError(
          "Acest cont de email a fost deja înscris. Urmărește pașii de pe Telegram pentru acces total."
        );
        setSubmitting(false);
        return;
      }

      // Salvează datele în Firebase
      await addDoc(collection(db, "inscrieri"), {
        nume,
        telefon,
        email,
        verified: false, // Flag pentru verificarea manuală
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setNume("");
      setTelefon("");
      setEmail("");
      setConsent(false);
    } catch (err) {
      setError("Eroare la înscriere: " + err.message);
    }
    setSubmitting(false);
  };

  const toggleModal = () => setShowModal(!showModal);
  const toggleVipModal = () => setShowVipModal(!showVipModal);

  return (
    <div className="bg-[#1e1e1e] p-4 rounded-lg mt-5 max-w-md mx-auto text-white">
      <h2 className="text-center text-lg font-semibold mb-3">
        Înscriere VIP ProFX
      </h2>

      {/* Buton pentru a vedea instrucțiunile VIP */}
      <div className="mb-4 text-center">
        <button
          onClick={toggleVipModal}
          className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Instrucțiuni Acces VIP
        </button>
      </div>

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

        <label className="text-left text-sm text-gray-300" htmlFor="email">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          placeholder="Introdu email-ul tău"
          required
        />

        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="form-checkbox text-blue-600"
          />
          <label htmlFor="consent" className="text-sm text-gray-300">
            Sunt de acord cu{" "}
            <span
              onClick={toggleModal}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              prelucrarea datelor cu caracter personal.
            </span>{" "}
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="p-2 mt-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {submitting ? "Se procesează..." : "Înscrie-te VIP"}
        </button>
      </form>

      <p className="text-sm mt-2 text-gray-500">
        Prin trimiterea acestui formular, sunteți de acord să primiți texte
        informative și/sau de marketing de la ProFX, inclusiv texte trimise prin
        apelare automată. Dezabonați-vă în orice moment, răspunzând STOP sau
        făcând clic pe linkul de dezabonare (acolo unde este disponibil).
      </p>

      {error && (
        <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
      )}
      {success && (
        <p className="text-green-400 text-sm mt-2 text-center">
          Înscriere reușită!{" "}
          <a
            href="https://t.me/ProFX_Community"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Intră pe canalul nostru de Telegram
          </a>{" "}
          și așteaptă confirmarea verificării contului.{" "}
        </p>
      )}

      {/* Modal pentru Instrucțiunile VIP */}
      {showVipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] p-6 rounded-lg max-w-lg w-full text-white relative max-h-[85vh] flex flex-col">
            <button
              onClick={toggleVipModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 sticky top-0 bg-[#1e1e1e] pb-2 text-yellow-400 border-b border-yellow-400">
              Instrucțiuni Acces VIP ProFX
            </h2>
            <div className="overflow-y-auto pr-2 flex-1 mb-4">
              <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 p-4 rounded-lg mb-6 border border-yellow-600/30">
                <p className="text-sm font-medium text-yellow-100">
                  Urmați acești pași pentru a obține acces la grupurile de Telegram VIP, 
                  unde se tranzacționează LIVE, precum și la sesiunile practice și de backtesting.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#2a2a2a] p-5 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-blue-400">
                      Creați cont FPM Trading
                    </h3>
                  </div>
                  <p className="text-sm mb-3 ml-11">
                    Creați un cont FPM Trading folosind link-ul oficial:
                  </p>
                  <a 
                    href="https://smartlnks.com/PROFX-Romania" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors block mb-3 ml-11 font-medium"
                  >
                    https://smartlnks.com/PROFX-Romania
                  </a>
                  <div className="ml-11">
                    <p className="text-sm mb-2 text-gray-300">Tutorial de înregistrare:</p>
                    <a 
                      href="https://youtu.be/SnxXpX1Iei8" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      https://youtu.be/SnxXpX1Iei8
                    </a>
                  </div>
                </div>

                <div className="bg-[#2a2a2a] p-5 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-green-400">
                      Contactați pentru verificare
                    </h3>
                  </div>
                  <p className="text-sm mb-2 ml-11">
                    Trimiteți un mesaj către{" "}
                    <a
                      href="https://t.me/sergiucirstea"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                    >
                      Sergiu Cirstea
                    </a>{" "}
                    și atașați o captură cu contul vostru activ FPM Trading (demo sau real).
                  </p>
                  <p className="text-sm ml-11 text-gray-300">
                    După verificare, veți fi adăugați în grupul nostru exclusiv.
                  </p>
                </div>

                <div className="bg-[#2a2a2a] p-5 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-purple-400">
                      Parcurgeți lecțiile gratuite
                    </h3>
                  </div>
                  <p className="text-sm mb-3 ml-11">
                    Studiul lecțiilor ProFX este esențial pentru cei care doresc să învețe de la zero:
                  </p>
                  <a 
                    href="https://profx.ro/#lectii" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors ml-11 font-medium"
                  >
                    https://profx.ro/#lectii
                  </a>
                </div>

                <div className="bg-gradient-to-r from-yellow-600/10 to-yellow-700/10 p-5 rounded-lg border border-yellow-500/30">
                  <h3 className="text-lg font-semibold mb-3 text-yellow-400">
                    Beneficii Exclusive VIP
                  </h3>
                  <div className="bg-[#2a2a2a]/50 p-4 rounded-md">
                    <p className="text-sm mb-3 text-gray-200">
                      Prin deschiderea unui cont la FPM Trading folosind link-ul nostru oficial, 
                      veți debloca următoarele beneficii:
                    </p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Acces la grupurile de Telegram VIP cu tranzacționare LIVE</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Participare la sesiuni practice și de backtesting</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Suport personalizat și mentorat</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center bg-gradient-to-r from-blue-600/20 to-blue-700/20 p-5 rounded-lg border border-blue-500/30">
                  <p className="text-lg font-semibold text-blue-300 mb-2">
                    Vă așteptăm cu entuziasm în comunitatea noastră!
                  </p>
                  <p className="text-yellow-400 font-medium">
                    Echipa ProFX
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={toggleVipModal}
              className="mt-0 p-3 bg-blue-600 text-white rounded w-full hover:bg-blue-700 transition-colors font-medium flex-shrink-0"
            >
              Închide
            </button>
          </div>
        </div>
      )}

      {/* Modal pentru Politica de Confidențialitate */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-hidden">
          <div className="bg-[#1e1e1e] p-6 rounded-lg max-w-lg w-full m-4 text-white relative max-h-[90vh] flex flex-col">
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 sticky top-0 bg-[#1e1e1e] pb-2">
              Politica Datelor Personale GDPR
            </h2>
            <div className="overflow-y-auto pr-2">
              <p className="text-sm mb-2">
                S.C. Pro Fx Media S. R. L. cu sediul in SLATINA, Str. POPA
                ȘAPCĂ, Nr. 8C, județ OLT, CUI 50830817, înregistrata la ORC J28,
                sub nr 38440, are grijă de intimitatea dumneavoastră și dorește
                să vă simțiți apărați pe platforma noastră. Documentul de mai
                jos, care conține explicațiile datelor pe care le colectăm vine
                în întâmpinarea acestor așteptări. Mai jos veți afla cum sunt
                colectate informații, care anume și cum vor fi folosite de către
                noi. De asemenea, veți ști să vă apărați sau să vă securizați
                contul.
              </p>
              <p className="text-sm mb-2">
                Această politică de confidențialitate se aplică inclusiv pentru
                site-ul ‚www.profx.ro’.
              </p>
              <p className="text-sm mb-2">
                Nu acoperim informațiile colectate de site-urile terțe, inclusiv
                cele partenere sau care au cumpărat spațiu de publicitate pe
                site-ul nostru.
              </p>
              <p className="text-sm mb-2">
                Site-ul www.profx.ro’ conține și link-uri către alte site-uri.
                Dacă dați click pe un material de pe alt site promovat de noi,
                nu răspundem pentru setările lor de intimitate. Vă recomandăm să
                citiți politica lor de confidențialitate în momentul când citiți
                informații de pe acestea.
              </p>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Prelucrarea datelor cu caracter personal
              </h3>
              <p className="text-sm mb-2">
                Prelucrăm datele Dvs. cu caracter personal exclusiv în cadrul
                dispoziţiilor legale cu privire la protecţia datelor cu caracter
                personal. Acestea sunt dispoziţiile Legii nr. 677/2001 și
                Regulamentul UE 679/2016 pentru protecţia persoanelor cu privire
                la prelucrarea datelor cu caracter personal şi libera circulaţie
                a acestor date precum şi dispoziţiile Legii nr. 506/2004 privind
                prelucrarea datelor cu caracter personal şi protecţia vieţii
                private în sectorul comunicaţiilor electronice.
              </p>
              <p className="text-sm mb-2">
                Salariaţii şi împuterniciţii noştri au obligaţia de a respecta
                dispoziţiile cu privire la protecţia datelor conform normelor
                legale.
              </p>
              <p className="text-sm mb-2">
                În legătură cu toate solicitările legate de datele dvs., de
                protecţia datelor în cadrul societăţii S.C. Pro Fx Media
                 S.R.L sau orice întrebare/reclamație pot fi adresate către
                adresa de email: office@profx.ro
              </p>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Scopul prelucrării datelor îl reprezintă:
              </h3>
              <p className="text-sm mb-2">
                Scopurile în care sunt prelucrate datele cu caracter personal de
                către S.C. Pro Fx Media S.R.L. sunt următoarele:
              </p>
              <ol className="list-decimal pl-6 text-sm mb-2">
                <li>
                  Comunicare prin e-mail. Putem folosi aceste informații pe care
                  ni le-ați oferit pentru a vă trimite comunicări prin mesaje pe
                  căsuța poștală electronică. Dacă v-ați înscris in baza noastra
                  de date , vă vom trimite aceste informări pe adresa de mail
                  comunicată. Temeiul juridic al prelucrării este consimțământul
                  dumneavoastră. Vă puteți retrage oricând doriți.
                </li>
                <li>
                  Publicitate. Pagina noastra de internet poate afișa reclame,
                  multe dintre ele fiind influențate de opțiunile selectate de
                  dumneavoastră și de preferințele de pe site și de pe conturile
                  conexe. De exemplu, folosind informațiile colectate prin
                  cookies, informațiile demografice de pe site-urile terțe și
                  activitatea dumneavoastră pe site, putem să publicăm reclame
                  care ar putea fi relevante preferințelor dumneavoastră.
                  Temeiul prelucrării este interesul nostru legitim de a menține
                  accesul gratuit la website-ul nostru dar fără a ne afecta
                  activitatea financiară.
                </li>
                <li>
                  Calitatea dvs. de client/potential client. Vă colectăm
                  informațiile de mai sus și pentru faptul că oferim o
                  facilitate prin care dorim sa va gasim cele mai bune oferte de
                  finantare de la firmele de leasing, sau institutii financiare
                  bancare/nebancare, precum si cele mai bune oferte din domeniul
                  nostru de activitate.
                </li>
                <li>
                  Analiză statistică. Avem interesul legitim de a înțelege cum
                  funcționează cum funcționează activitatea noastra, cum putem
                  imbunati aceasta activitate in intelesul clientului. Pentru
                  aceasta, agregăm datele din mai multe surse. Putem să folosim
                  aceste date pentru a îmbunătăți anumite funcționalități,
                  pentru a modifica secțiunile sau pentru a vă oferi cele mai
                  relevante informații, în cea mai bună oferta posibilă.
                </li>
                <li>
                  Activitați de marketing . În scopul de a prezenta activitatea
                  societății noastre, Societatea noastră are acceptul dvs. să
                  promoveze anumite fotografii sau imagini pe instagram,
                  facebook sau alte rețele de socializare ori pagini web de
                  profil, (inclusiv pagina oficiala a societății Nicodem SRL) în
                  care puteți fi identificat dvs. ori societatea cumpărătoare de
                  bunuri de la noi. Acestea se fac exclusiv în scop comercial,
                  și numai cu acordul dvs. prealabil exprimat anterior
                  fotografierii sau prelevării de imagini.
                </li>
                <li>
                  Acordul dvs. se va considera acordat. Acordul dvs. va fi
                  exprimat în mod expres, prin semnătură, distinct și numai după
                  ce ați înțeles scopul pentru care vor fi folosite. Semnătura
                  dvs. reprezintă renunțarea la orice pretenții cu privire la
                  societatea noastră după fotografiere și/sau prelvarea
                  imaginilor. În cazurile în care vom prelucra datele
                  dumneavoastră cu caracter personal doar cu consimțământul
                  dumneavoastră, vă vom solicita separat consimțământul, în mod
                  transparent, atunci când furnizați datele dumneavoastră cu
                  caracter personal. Ulterior, veți putea să vă retrageți
                  consimțământul în orice moment prin intermediul adresei de
                  e-mail office@profx.ro Cu toate acestea, retragerea
                  consimțământului nu va afecta legalitatea niciunei prelucrări
                  care a avut loc înainte de retragerea acestuia. De asemenea,
                  putem prelucra datele dumneavoastră cu caracter personal,
                  precum datele de identificare, datele de contact  și adresa de
                  reședință, în scopul posibilei exercitări a drepturilor sau a
                  reclamațiilor noastre împotriva dumneavoastră în viitor.
                  Această prelucrare se bazează pe interesul nostru legitim,
                  fiind necesar să ne exercităm drepturile în cazul unor
                  eventuale litigii.
                </li>
              </ol>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Ce drepturi aveți și cum le puteți exercita?
              </h3>
              <p className="text-sm mb-2">
                Potrivit  Regulamentului  UE 679/2016 beneficiaţi de:
              </p>
              <ul className="list-disc pl-6 text-sm mb-2">
                <li>
                  dreptul de acces;  puteți obține de la noi confirmarea că
                  prelucrăm datele dvs. personale, precum și informații privind
                  specificul prelucrării
                </li>
                <li>
                  dreptul la rectificarea datelor; puteți să ne solicitati să
                  modificam datele dvs. personale incorecte ori, după caz,
                  completarea datelor care sunt incomplete.
                </li>
                <li>
                  dreptul la ștergerea datelor („dreptul de a fi
                  uitat”);  puteți solicita stergerea datelor personale atunci
                  cand: (i) acestea nu mai sunt necesare pentru scopurile pentru
                  care le-am colectat și le prelucram; (ii) v-ați retras
                  consimțământul pentru prelucrarea datelor și noi nu le mai
                  putem prelucra pe alte temeiuri legale; (iii) datele sunt
                  prelucrate contrar legii; respectiv (iv) datele trebuie sterse
                  conform legislației relevante
                </li>
                <li>
                  dreptul la restricționarea prelucrării; în anumite condiții
                  (daca persoana vizata contestă exactitatea datelor, dacă
                  prelucrarea este ilegala, dacă datele sunt solicitate opentru
                  constatarea , exercitarea sau apararea unui drept în instanță;
                  sau dacă vă opuneți prelucrării datelor) puteți solicita
                  restricționarea prelucrării datelor dvs. personale
                </li>
                <li>
                  dreptul la portabilitatea datelor; în măsura în care prelucrăm
                  datele prin mijloace automate, puteți să ne solicitați, în
                  condițiile legii, să furnizăm datele dvs. într-o formă
                  structurată, utilizată frecvent și care poate fi citită în mod
                  automat.  Dacă ne solicitați acest lucru, putem să transmitem
                  datele dvs. unei alte entități, dacă este posibil din punct de
                  vedere tehnic
                </li>
                <li>
                  dreptul la opoziție și procesul decizional individual
                  automatizat, inclusiv crearea de pofiluri; vă puteți opune
                  oricând prelucrarilor pentru scop de marketing, inclusiv
                  profilărilor efectuate în acest scop, precum și prelucrarilor
                  bazate pe interesul legitim al Societății, din motive care țin
                  de situația dvs. specifică
                </li>
                <li>
                  dreptul la retragerea consimțământului în cazul prelucrării în
                  scop de informare sau promovare; puteți să vă retrageți
                  oricând consimțământul cu privire la prelucrarea datelor pe
                  baza de consimțământ
                </li>
                <li>
                  dreptul de a depune o plângere în fața unei autorități de
                  supraveghere a prelucrării datelor cu caracter personal; aveți
                  dreptul de a depune o plângere la autoritatea de supraveghere
                  a prelucrării datelor în cazul în care considerați că v-au
                  fost încălcate drepturile
                </li>
                <li>
                  dreptul la o cale de atac judiciară; dreptul de a exercita o
                  cale de atac judiciară eficientă împotriva unei decizii
                  obligatorii din punct de vedere juridic a unei autorități de
                  supraveghere
                </li>
                <li>
                  dreptul de a fi notificat de către operator cu privire la
                  prelucrarea datelor cu carcter personal ale dvs.
                </li>
              </ul>
              <h3 className="text-lg font-semibold mt-4 mb-2">Contact</h3>
              <p className="text-sm mb-2">
                Pentru exercitarea drepturilor menţionate mai sus vă rugăm să vă
                adresaţi prin cerere scrisă prin e-mail la office@profx.ro
              </p>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Ce date sunt stocate de S.C Pro Fx Media S.R.L.?
              </h3>
              <ol className="list-decimal pl-6 text-sm mb-2">
                <li>
                  Stocarea şi prelucrarea de date care nu au caracter personal
                  (anonime) în scopuri interne legate de sistem şi în scopuri
                  statistice În cazul accesării paginii noastre de internet
                  browser-ul Dvs. de internet transmite automat date (de ex.
                  data şi ora accesării, adresa URL a paginii de internet care
                  face trimiterea, fişierul accesat, cantitatea datelor
                  transmise, tipul şi versiunea browser-ului, sistemul de
                  operare, ) către serverul nostru, pe baza unor setări tehnice.
                  Aceste date sunt colectate şi utilizate exclusiv în scop
                  statistic şi în scop de analiză, de ex. pentru îmbunătăţirea
                  experientei dvs, pe site. Anumite date de trafic (cum sunt
                  adresele IP sau alt identificatori ai dispozitivelor cu care
                  ne accesati site-ul) pot fi în anumite circumstanțe date cu
                  caracter personal și ca atare le vom trata ca atare.
                </li>
                <li>Stocarea şi prelucrarea datelor cu caracter personale</li>
              </ol>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                În ce situații au terții acces la datele Dvs?
              </h3>
              <p className="text-sm mb-2">
                Informațiile colectate sunt destinate numai utilizării de către
                S.C. Nicodem S.R.L. și sunt comunicate doar următoarelor
                categorii de destinatari: terți furnizori implicați in mod
                direct sau indirect in procesele aferente scopurilor mai sus
                menționate (furnizori de servicii IT, furnizori de servicii de
                consultanță, furnizori de servicii de procesare plăți, societati
                financiare bancare sau nebancare etc.) sau autorități publice
                abilitate de lege, în cadrul unei investigații pentru activități
                ilegale, dar doar în baza unui mandat legal
              </p>
              <p className="text-sm mb-2">
                Societatea Pro Fx Media SRL  nu îşi asumă răspunderea pentru
                directivele de protecţie a datelor şi procedurile paginilor
                internet sau firmelor partenere.
              </p>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Perioada de păstrare a datelor personale
              </h3>
              <p className="text-sm mb-2">
                Pentru a determina perioada pentru care datele personale vor fi
                prelucrate și păstrate, luăm în considerare durata contractuală
                până la îndeplinirea obligațiilor contractuale respectiv a
                scopului și termenele de arhivare prevăzute de dispozițiile
                legale în materie. Dacă doriți mai multe informații despre cât
                timp păstrăm datele dumneavoastră cu caracter personal, vă rugăm
                să ne contactați la adresa office@profx.ro
              </p>
              <p className="text-sm mb-2">
                În cazul în care prelucrăm datele dumneavoastră cu caracter
                personal în temeiul consimțământului dumneavoastră, aceste date
                cu caracter personal vor fi prelucrate numai pentru perioada
                prevăzută prin consimțământul dumneavoastră, cu excepția cazului
                în care vă retrageți sau limitați consimțământul înainte de
                expirarea acestei perioade. În astfel de cazuri, vom înceta
                prelucrarea datelor cu caracter personal respective în scopurile
                relevante, sub rezerva oricărei obligații legale de a prelucra
                aceste date cu caracter personal și/sau a nevoii noastre de a
                prelucra aceste date cu caracter personal în scopul exercitării
                drepturilor noastre legitime (inclusiv a drepturilor legitime
                ale altor persoane).
              </p>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Securitatea datelor
              </h3>
              <p className="text-sm mb-2">
                Pagina noastră de internet şi celelalte sisteme informatice ale
                noastre sunt protejate prin măsuri tehnice şi organizatorice
                împotriva accesului, modificării sau difuzării datelor Dvs. de
                către persoane neautorizate precum şi împotriva pierderii sau
                distrugerii datelor Dvs.
              </p>
              <p className="text-sm mb-2">
                Este necesar să trataţi în permanenţă cu confidenţialitate
                datele Dvs. de acces şi să închideţi fereastra de browser când
                terminaţi vizitarea paginii noastre de internet.
              </p>
              <p className="text-sm mb-2">
                Pentru transferul de date cu caracter personal utilizăm
                proceduri tehnice de criptare. Puteţi identifica transmiterea de
                date criptate (https) prin afişarea unui simbol de închidere, de
                ex. afişarea unui simbol de cheie sau lacăt în bara de statut a
                browser-ului Dvs.
              </p>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Întrebari, Sugestii și Reclamații?
              </h3>
              <p className="text-sm mb-2">
                Aveți întrebări referitoare la protecția datelor, politica de
                utilizare cookie-uri sau la pagina noastră de internet? Nicio
                problemă, vă ajutăm cu placere daca trimiteti un mesaj la adresa
                de email office@profx.ro
              </p>
            </div>
            <button
              onClick={toggleModal}
              className="mt-4 p-2 bg-blue-600 text-white rounded w-full hover:bg-blue-700"
            >
              Închide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormularInscriere;
