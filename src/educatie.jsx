import React from "react";
import { useState } from "react";

const Educatie = () => {

     const [pipLotInput, setPipLotInput] = useState(0.01);

    return (
        <div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">
            ℹ️ Ce sunt pipsii pe XAUUSD?
          </h2>
          <p className="mb-2">
            Pipul este o unitate mică folosită pentru a măsura mișcarea
            prețului.
          </p>
          <p className="mb-2">
            Pe XAUUSD (aur), un pip reprezintă o schimbare de 0.1 în prețul
            aurului. De exemplu:
          </p>
          <p className="mb-4">
            Dacă prețul aurului crește de la 1980.00 la 1980.10, atunci s-a
            mișcat 1 pip.
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
                <th className="p-2 border border-gray-700">
                  Loturi (mărime)
                </th>
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
            Valoare pip estimată:{" "}
            <strong>{(pipLotInput * 10).toFixed(2)}</strong> USD
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
      
      </div>
    )

};

export default Educatie;