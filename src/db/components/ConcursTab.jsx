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
  errorConcurs,
  onDeleteAll,
  onEditConcurent
}) => {
  const [concursSortBy, setConcursSortBy] = useState("desc");
  const [currentPageConcurs, setCurrentPageConcurs] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ nume: "", telefon: "", linkMyFxBook: "" });
  const [saving, setSaving] = useState(false);
  const concursPerPage = 10;

  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({
      nume: item.nume || "",
      telefon: item.telefon || "",
      linkMyFxBook: item.linkMyFxBook || "",
    });
  };

  const closeEdit = () => {
    setEditItem(null);
    setEditForm({ nume: "", telefon: "", linkMyFxBook: "" });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await onEditConcurent(editItem.id, editForm);
      closeEdit();
    } finally {
      setSaving(false);
    }
  };

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

      {/* Export Excel + Stergere */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-2 px-4 bg-red-700 text-white rounded hover:bg-red-800 text-sm"
        >
          Ștergere Concurenți Concurs
        </button>
        <button
          onClick={exportConcursToExcel}
          className="p-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Exportă Înscrieri Concurs în Excel
        </button>
      </div>

      {/* Modal Editare Concurent */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 border border-blue-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-blue-400 mb-4">Editare Concurent</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-1">Nume</label>
                <input
                  type="text"
                  value={editForm.nume}
                  onChange={(e) => setEditForm((f) => ({ ...f, nume: e.target.value }))}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-1">Telefon</label>
                <input
                  type="text"
                  value={editForm.telefon}
                  onChange={(e) => setEditForm((f) => ({ ...f, telefon: e.target.value }))}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-semibold block mb-1">Link MyFxBook</label>
                <input
                  type="text"
                  value={editForm.linkMyFxBook}
                  onChange={(e) => setEditForm((f) => ({ ...f, linkMyFxBook: e.target.value }))}
                  className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button
                onClick={closeEdit}
                disabled={saving}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Anulează
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50 font-semibold"
              >
                {saving ? "Se salvează..." : "Salvează"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmare Ștergere */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 border border-red-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-red-400 mb-3">Confirmare Ștergere</h3>
            <p className="text-gray-200 mb-1">
              Ești sigur că vrei să ștergi <span className="font-bold text-white">toți concurenții</span> din baza de date?
            </p>
            <p className="text-gray-400 text-sm mb-5">
              Această acțiune este <span className="text-red-400 font-semibold">ireversibilă</span>. Toți cei {concursInscrieri.length} concurenți înscriși vor fi eliminați.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Anulează
              </button>
              <button
                onClick={async () => {
                  setDeleting(true);
                  await onDeleteAll();
                  setDeleting(false);
                  setShowDeleteModal(false);
                }}
                disabled={deleting}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 disabled:opacity-50 font-semibold"
              >
                {deleting ? "Se șterge..." : "Da, șterge toți"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <th className="p-2 border border-gray-700 text-center">Acțiuni</th>
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
                      <td className="p-2 border border-gray-700 text-center">
                        <button
                          onClick={() => openEdit(item)}
                          className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 text-xs font-semibold"
                        >
                          Editează
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-2 text-center">
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
