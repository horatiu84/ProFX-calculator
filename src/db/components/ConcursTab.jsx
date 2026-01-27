import React, { useState } from "react";
import * as XLSX from "xlsx";

const formatDate = (createdAt) => {
  if (!createdAt) return "N/A";
  
  // Handle Firestore Timestamp
  if (createdAt.toDate && typeof createdAt.toDate === 'function') {
    try {
      return createdAt.toDate().toLocaleString('ro-RO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "N/A";
    }
  }
  
  // Handle timestamp in seconds (Firestore format)
  if (createdAt.seconds) {
    try {
      return new Date(createdAt.seconds * 1000).toLocaleString('ro-RO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "N/A";
    }
  }
  
  // Handle regular date string or Date object
  try {
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString('ro-RO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return "N/A";
  }
};

const ConcursTab = ({ 
  concursInscrieri,
  loadingConcurs,
  errorConcurs
}) => {
  const [concursSortBy, setConcursSortBy] = useState("desc");
  const [currentPageConcurs, setCurrentPageConcurs] = useState(1);
  const concursPerPage = 10;

  // Sortare și paginare
  const sortedConcurs = concursInscrieri.slice().sort((a, b) => {
    let aDate, bDate;
    
    // Handle a.createdAt
    if (a.createdAt?.toDate && typeof a.createdAt.toDate === 'function') {
      aDate = a.createdAt.toDate();
    } else if (a.createdAt?.seconds) {
      aDate = new Date(a.createdAt.seconds * 1000);
    } else {
      aDate = new Date(a.createdAt);
    }
    
    // Handle b.createdAt
    if (b.createdAt?.toDate && typeof b.createdAt.toDate === 'function') {
      bDate = b.createdAt.toDate();
    } else if (b.createdAt?.seconds) {
      bDate = new Date(b.createdAt.seconds * 1000);
    } else {
      bDate = new Date(b.createdAt);
    }
    
    return concursSortBy === "asc" ? aDate - bDate : bDate - aDate;
  });

  const indexOfLastConcurs = currentPageConcurs * concursPerPage;
  const indexOfFirstConcurs = indexOfLastConcurs - concursPerPage;
  const currentConcurs = sortedConcurs.slice(
    indexOfFirstConcurs,
    indexOfLastConcurs
  );

  const totalPagesConcurs = Math.ceil(sortedConcurs.length / concursPerPage);

  const exportConcursToExcel = () => {
    if (concursInscrieri.length === 0) return;
    const dataToExport = concursInscrieri.map((item, idx) => ({
      Nr: idx + 1,
      Nume: item.nume || "",
      Telefon: item.telefon || "",
      "Link MyFxBook": item.linkMyFxBook || "",
      "Data Creării": formatDate(item.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Concurs ProFX");
    XLSX.writeFile(workbook, "concurs-profx.xlsx");
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-400 mb-2">
        Înscrieri Concurs ProFX
      </h2>

      {/* Export Excel */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportConcursToExcel}
          className="p-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Exportă Înscrieri Concurs în Excel
        </button>
      </div>

      {/* Sortare */}
      <div className="mb-3 flex gap-2 items-center">
        <label className="text-gray-300 font-semibold">
          Sortare înscrieri concurs:
        </label>
        <select
          value={concursSortBy}
          onChange={(e) => {
            setConcursSortBy(e.target.value);
            setCurrentPageConcurs(1);
          }}
          className="p-2 rounded border border-gray-600 bg-gray-800 text-white"
        >
          <option value="desc">Data (recent primul)</option>
          <option value="asc">Data (vechi primul)</option>
        </select>
      </div>

      {errorConcurs && <p className="text-red-400 mb-4">{errorConcurs}</p>}

      {loadingConcurs ? (
        <p>Se încarcă înscrierile la concurs...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2 border border-gray-700 text-center">#</th>
                  <th className="p-2 border border-gray-700 text-center">Nume</th>
                  <th className="p-2 border border-gray-700 text-center">Telefon</th>
                  <th className="p-2 border border-gray-700">Link MyFxBook</th>
                  <th className="p-2 border border-gray-700">Data</th>
                </tr>
              </thead>
              <tbody>
                {currentConcurs.length > 0 ? (
                  currentConcurs.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-700 align-top">
                      <td className="p-2 border border-gray-700 text-center font-semibold">
                        {indexOfFirstConcurs + idx + 1}
                      </td>
                      <td className="p-2 border border-gray-700 text-center">
                        {item.nume}
                      </td>
                      <td className="p-2 border border-gray-700 text-center">
                        {item.telefon}
                      </td>
                      <td className="p-2 border border-gray-700 whitespace-pre-wrap">
                        <a
                          href={item.linkMyFxBook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {item.linkMyFxBook}
                        </a>
                      </td>
                      <td className="p-2 border border-gray-700">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-2 text-center">
                      Nicio înscriere la concurs înregistrată.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* PAGINARE */}
          {totalPagesConcurs > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                disabled={currentPageConcurs === 1}
                onClick={() => setCurrentPageConcurs((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPagesConcurs }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPageConcurs(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPageConcurs === i + 1
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPageConcurs === totalPagesConcurs}
                onClick={() => setCurrentPageConcurs((prev) => Math.min(prev + 1, totalPagesConcurs))}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                Următor
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConcursTab;
