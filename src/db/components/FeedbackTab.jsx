import React, { useState, useEffect } from "react";
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

const FeedbackTab = ({ 
  feedbackAnonim,
  loadingFeedback,
  errorFeedback,
  mediaEducatie,
  mediaLiveTrade
}) => {
  const [feedbackSortBy, setFeedbackSortBy] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const feedbackPerPage = 10;

  // Sortare și paginare
  const sortedFeedback = feedbackAnonim.slice().sort((a, b) => {
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
    
    return feedbackSortBy === "asc" ? aDate - bDate : bDate - aDate;
  });

  const indexOfLastFeedback = currentPage * feedbackPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbackPerPage;
  const currentFeedback = sortedFeedback.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  const totalPages = Math.ceil(sortedFeedback.length / feedbackPerPage);

  const exportFeedbackToExcel = () => {
    if (feedbackAnonim.length === 0) return;
    const dataToExport = feedbackAnonim.map((item, idx) => ({
      Nr: idx + 1,
      Educație: item.educatie || "",
      "Sesiuni Live/Trade": item.liveTrade || "",
      Mesaj: item.mesaj || "",
      "Data Creării": formatDate(item.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback Anonim");
    XLSX.writeFile(workbook, "feedback-anonim.xlsx");
  };

  return (
    <div>
      {/* Medii */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-900/30 border border-blue-500 p-4 rounded-lg">
          <h3 className="text-blue-300 font-semibold mb-2">📚 Media Educație</h3>
          <p className="text-3xl font-bold text-white">{mediaEducatie}</p>
        </div>
        <div className="bg-green-900/30 border border-green-500 p-4 rounded-lg">
          <h3 className="text-green-300 font-semibold mb-2">📊 Media Live/Trade</h3>
          <p className="text-3xl font-bold text-white">{mediaLiveTrade}</p>
        </div>
      </div>

      {/* Export Excel */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportFeedbackToExcel}
          className="p-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Exportă Feedback în Excel
        </button>
      </div>

      {/* Sortare */}
      <div className="mb-3 flex gap-2 items-center">
        <label className="text-gray-300 font-semibold">
          Sortare feedback:
        </label>
        <select
          value={feedbackSortBy}
          onChange={(e) => {
            setFeedbackSortBy(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 rounded border border-gray-600 bg-gray-800 text-white"
        >
          <option value="desc">Data (recent primul)</option>
          <option value="asc">Data (vechi primul)</option>
        </select>
      </div>

      {errorFeedback && <p className="text-red-400 mb-4">{errorFeedback}</p>}

      {loadingFeedback ? (
        <p>Se încarcă feedback-ul anonim...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2 border border-gray-700 text-center">#</th>
                  <th className="p-2 border border-gray-700 text-center">Educație</th>
                  <th className="p-2 border border-gray-700 text-center">Sesiuni Live/Trade</th>
                  <th className="p-2 border border-gray-700">Mesaj</th>
                  <th className="p-2 border border-gray-700">Data</th>
                </tr>
              </thead>
              <tbody>
                {currentFeedback.length > 0 ? (
                  currentFeedback.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-700 align-top">
                      <td className="p-2 border border-gray-700 text-center font-semibold">
                        {indexOfFirstFeedback + idx + 1}
                      </td>
                      <td className="p-2 border border-gray-700 text-center">
                        {item.educatie}
                      </td>
                      <td className="p-2 border border-gray-700 text-center">
                        {item.liveTrade}
                      </td>
                      <td className="p-2 border border-gray-700 whitespace-pre-wrap">
                        {item.mesaj}
                      </td>
                      <td className="p-2 border border-gray-700">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-2 text-center">
                      Niciun feedback anonim înregistrat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* PAGINARE */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

export default FeedbackTab;
