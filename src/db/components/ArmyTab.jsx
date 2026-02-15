import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../FireBase';

// Helper pentru formatare date
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Funcție de verificare dacă cursantul a uploadat astăzi (timezone Romania)
const hasUploadedToday = (lastUploadDate) => {
  if (!lastUploadDate) return false;
  const today = new Date();
  const uploadDate = lastUploadDate.toDate ? lastUploadDate.toDate() : new Date(lastUploadDate);
  
  // Convertim la timezone România (UTC+2 sau UTC+3 în DST)
  const romaniaOffset = 2 * 60; // offset in minute
  const todayRomania = new Date(today.getTime() + (today.getTimezoneOffset() + romaniaOffset) * 60000);
  const uploadRomania = new Date(uploadDate.getTime() + (uploadDate.getTimezoneOffset() + romaniaOffset) * 60000);
  
  return (
    todayRomania.getFullYear() === uploadRomania.getFullYear() &&
    todayRomania.getMonth() === uploadRomania.getMonth() &&
    todayRomania.getDate() === uploadRomania.getDate()
  );
};

const ArmyTab = ({ getCachedData, setCachedData, clearCachedData }) => {
  // State-uri pentru cursanți Army
  const [armyCursanti, setArmyCursanti] = useState([]);
  const [loadingArmy, setLoadingArmy] = useState(false);
  const [errorArmy, setErrorArmy] = useState("");
  const [successArmy, setSuccessArmy] = useState("");
  
  // State-uri pentru formular adăugare
  const [newCursant, setNewCursant] = useState({
    nume: "",
    telefon: "",
    perecheValutara: "",
    tipParticipant: "Cursant",
    oraLumanare: "",
    grupa: "Ianuarie 2026"
  });
  
  // State-uri pentru editare
  const [editingCursant, setEditingCursant] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  // State-uri pentru căutare și sortare
  const [searchCursant, setSearchCursant] = useState("");
  const [sortCursanti, setSortCursanti] = useState("asc");
  const [selectedGrupa, setSelectedGrupa] = useState("Ianuarie 2026");
  
  // Lista de grupe disponibile
  const grupeDisponibile = [
    "Ianuarie 2026",
    "Februarie 2026",
    "Martie 2026",
    "Aprilie 2026",
    "Mai 2026",
    "Iunie 2026",
    "Iulie 2026",
    "August 2026",
    "Septembrie 2026",
    "Octombrie 2026",
    "Noiembrie 2026",
    "Decembrie 2026"
  ];
  
  // State-uri pentru modal progres
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedCursant, setSelectedCursant] = useState(null);
  const [showPrinciples, setShowPrinciples] = useState(false);
  
  // State-uri pentru screenshots
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [screenshotsPage, setScreenshotsPage] = useState(1);
  const screenshotsPerPage = 10;
  
  // State-uri pentru modal ștergere
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cursantToDelete, setCursantToDelete] = useState(null);
  
  // State-uri pentru teme zilnice
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [currentTheme, setCurrentTheme] = useState("");
  const [temeZilnice, setTemeZilnice] = useState({});
  const [loadingTheme, setLoadingTheme] = useState(false);
  const [errorTheme, setErrorTheme] = useState("");
  const [successTheme, setSuccessTheme] = useState("");
  
  // Cele 20 de principii
  const principleNames = [
    "1. Identificarea Trendului",
    "2. Structura Pieței (HH/HL sau LH/LL)",
    "3. Zone de Suport și Rezistență",
    "4. Fibonacci Retracement",
    "5. Order Blocks",
    "6. Fair Value Gaps (FVG)",
    "7. Liquidity Zones",
    "8. Break of Structure (BOS)",
    "9. Change of Character (CHoCH)",
    "10. Premium și Discount Zones",
    "11. Session Highs și Lows",
    "12. Kill Zones (trading sessions)",
    "13. Market Structure Shift",
    "14. Entry Models (specific patterns)",
    "15. Risk Management (1-2% per trade)",
    "16. Position Sizing",
    "17. Stop Loss Placement",
    "18. Take Profit Strategy",
    "19. Trade Management (trailing stops)",
    "20. Psychology și Discipline"
  ];

  // Fetch cursanți Army cu cache
  const fetchArmyCursanti = async (forceRefresh = false) => {
    const cacheKey = "armyCursanti";
    const cached = getCachedData(cacheKey);
    
    if (!forceRefresh && cached) {
      setArmyCursanti(cached);
      return;
    }
    
    setLoadingArmy(true);
    setErrorArmy("");
    try {
      const querySnapshot = await getDocs(collection(db, "Army"));
      const data = [];
      const updatePromises = [];
      
      querySnapshot.docs.forEach(doc => {
        const docData = doc.data();
        const grupa = docData.grupa || "Ianuarie 2026";
        
        // Dacă cursantul nu are grupă, actualizează-l în Firebase
        if (!docData.grupa) {
          updatePromises.push(
            updateDoc(doc.ref, { grupa: "Ianuarie 2026" })
          );
        }
        
        data.push({
          id: doc.id,
          ...docData,
          grupa: grupa
        });
      });
      
      // Așteaptă ca toate actualizările să se finalizeze
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        console.log(`✅ ${updatePromises.length} cursanți actualizați cu grupa "Ianuarie 2026"`);
      }
      
      setArmyCursanti(data);
      setCachedData(cacheKey, data);
    } catch (error) {
      console.error("Eroare la încărcarea cursanților Army:", error);
      setErrorArmy("Eroare la încărcarea datelor.");
    } finally {
      setLoadingArmy(false);
    }
  };

  // Fetch la montare
  useEffect(() => {
    fetchArmyCursanti();
    fetchTemeZilnice();
  }, []);

  // Auto-resize pentru textarea-uri
  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    });
  }, [showProgressModal, editingCursant, currentTheme]);

  // Sincronizare temă când se schimbă data selectată
  useEffect(() => {
    setCurrentTheme(temeZilnice[selectedDate] || "");
    setSuccessTheme("");
    setErrorTheme("");
  }, [selectedDate, temeZilnice]);
  
  // Reîncarcă temele când se schimbă grupa
  useEffect(() => {
    fetchTemeZilnice(true);
  }, [selectedGrupa]);

  // Adaugă cursant nou
  const handleAddCursant = async (e) => {
    e.preventDefault();
    setLoadingArmy(true);
    setErrorArmy("");
    setSuccessArmy("");
    
    try {
      const docRef = await addDoc(collection(db, "Army"), {
        ...newCursant,
        createdAt: new Date(),
        progres: Array(20).fill(0),
        adminNotes: {
          puncteSlabe: "",
          strategiePlan: "",
          alteObservatii: ""
        }
      });
      
      setNewCursant({
        nume: "",
        telefon: "",
        perecheValutara: "",
        tipParticipant: "Cursant",
        oraLumanare: "",
        grupa: "Ianuarie 2026"
      });
      setSuccessArmy("Cursant adăugat cu succes!");
      await fetchArmyCursanti(true);
      clearCachedData("armyCursanti");
    } catch (error) {
      console.error("Eroare la adăugarea cursantului:", error);
      setErrorArmy("Eroare la adăugarea cursantului.");
    } finally {
      setLoadingArmy(false);
    }
  };

  // Inițiază editarea
  const handleEditCursant = (cursant) => {
    setEditingCursant(cursant.id);
    setEditFormData({ 
      ...cursant,
      adminNotes: cursant.adminNotes || {
        puncteSlabe: "",
        strategiePlan: "",
        alteObservatii: ""
      }
    });
  };

  // Salvează editarea
  const handleSaveEdit = async (cursantId) => {
    setLoadingArmy(true);
    setErrorArmy("");
    setSuccessArmy("");
    
    try {
      const docRef = doc(db, "Army", cursantId);
      const { id, ...dataToUpdate } = editFormData;
      await updateDoc(docRef, dataToUpdate);
      
      setSuccessArmy("Cursant actualizat cu succes!");
      setEditingCursant(null);
      setEditFormData({});
      await fetchArmyCursanti(true);
      clearCachedData("armyCursanti");
      
      // Actualizează și cursantul selectat în modal dacă e deschis
      if (showProgressModal && selectedCursant?.id === cursantId) {
        setSelectedCursant({ ...editFormData, id: cursantId });
      }
    } catch (error) {
      console.error("Eroare la actualizarea cursantului:", error);
      setErrorArmy("Eroare la salvarea modificărilor.");
    } finally {
      setLoadingArmy(false);
    }
  };

  // Anulează editarea
  const handleCancelEdit = () => {
    setEditingCursant(null);
    setEditFormData({});
  };

  // Deschide modal progres
  const openProgressModal = (cursant) => {
    setSelectedCursant(cursant);
    setShowProgressModal(true);
    setScreenshotsPage(1);
  };

  // Închide modal progres
  const closeProgressModal = () => {
    setShowProgressModal(false);
    setSelectedCursant(null);
    if (editingCursant) {
      setEditingCursant(null);
      setEditFormData({});
    }
  };

  // Deschide modal ștergere
  const openDeleteModal = (cursant) => {
    setCursantToDelete(cursant);
    setShowDeleteModal(true);
  };

  // Închide modal ștergere
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCursantToDelete(null);
  };

  // Confirmă ștergerea
  const confirmDeleteCursant = async () => {
    if (!cursantToDelete) return;
    
    setLoadingArmy(true);
    setErrorArmy("");
    setSuccessArmy("");
    
    try {
      await deleteDoc(doc(db, "Army", cursantToDelete.id));
      setSuccessArmy(`Cursantul ${cursantToDelete.nume} a fost șters cu succes!`);
      closeDeleteModal();
      await fetchArmyCursanti(true);
      clearCachedData("armyCursanti");
    } catch (error) {
      console.error("Eroare la ștergerea cursantului:", error);
      setErrorArmy("Eroare la ștergerea cursantului.");
    } finally {
      setLoadingArmy(false);
    }
  };

  // Download screenshot
  const handleDownloadScreenshot = async (screenshot) => {
    try {
      const response = await fetch(screenshot.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = screenshot.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Eroare la descărcarea screenshot-ului:", error);
      alert("Eroare la descărcarea fișierului");
    }
  };

  // Export la Excel
  const exportArmyToExcel = () => {
    const cursantiToExport = armyCursanti.filter(c => c.tipParticipant !== 'Mentor' && c.grupa === selectedGrupa);
    
    if (cursantiToExport.length === 0) {
      alert(`Nu există cursanți de exportat pentru grupa ${selectedGrupa}!`);
      return;
    }
    
    const dataToExport = cursantiToExport
      .map((cursant, idx) => ({
        "Nr.": idx + 1,
        "Nume": cursant.nume,
        "Telefon": cursant.telefon,
        "Grupă": cursant.grupa || "Ianuarie 2026",
        "Tip Participant": cursant.tipParticipant || "Cursant",
        "Pereche Valutară": cursant.perecheValutara,
        "Ora Lumânare 4H": cursant.oraLumanare || "8:00 - 12:00",
        "Upload Astăzi": hasUploadedToday(cursant.lastUploadDate) ? "DA" : "NU",
        "Data Ultimului Upload": cursant.lastUploadDate 
          ? new Date(cursant.lastUploadDate.toDate ? cursant.lastUploadDate.toDate() : cursant.lastUploadDate).toLocaleDateString('ro-RO')
          : "-"
      }));
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Cursanti ${selectedGrupa}`);
    XLSX.writeFile(workbook, `Cursanti_Army_${selectedGrupa}_${new Date().toLocaleDateString('ro-RO').replace(/\//g, '-')}.xlsx`);
  };

  // Fetch teme zilnice
  const fetchTemeZilnice = async (forceRefresh = false) => {
    const cacheKey = `temeZilnice_${selectedGrupa}`;
    const cached = getCachedData(cacheKey);
    
    if (!forceRefresh && cached) {
      setTemeZilnice(cached);
      setCurrentTheme(cached[selectedDate] || "");
      return;
    }
    
    setLoadingTheme(true);
    setErrorTheme("");
    
    try {
      const snapshot = await getDocs(collection(db, "TemeZilnice"));
      const temesData = {};
      const updatePromises = [];
      
      snapshot.docs.forEach((doc) => {
        const docData = doc.data();
        const docGrupa = docData.grupa || "Ianuarie 2026";
        
        // Dacă tema nu are grupă, actualizează-o în Firebase
        if (!docData.grupa) {
          updatePromises.push(
            updateDoc(doc.ref, { grupa: "Ianuarie 2026" })
          );
        }
        
        // Filtrăm doar temele pentru grupa selectată
        if (docGrupa === selectedGrupa) {
          // Extragem data din ID-ul documentului (format: grupa_data sau doar data pentru temele vechi)
          const parts = doc.id.split('_');
          if (parts.length === 2) {
            temesData[parts[1]] = docData.tema || "";
          } else if (parts.length === 1) {
            // Temă veche fără grupă în ID
            temesData[doc.id] = docData.tema || "";
          }
        }
      });
      
      // Așteaptă ca toate actualizările să se finalizeze
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        console.log(`✅ ${updatePromises.length} teme actualizate cu grupa "Ianuarie 2026"`);
      }
      
      setTemeZilnice(temesData);
      setCurrentTheme(temesData[selectedDate] || "");
      setCachedData(cacheKey, temesData);
    } catch (error) {
      console.error("Eroare la încărcarea temelor:", error);
      setErrorTheme("Eroare la încărcarea temelor.");
    } finally {
      setLoadingTheme(false);
    }
  };

  // Salvează tema
  const handleSaveTheme = async () => {
    if (!currentTheme.trim()) {
      setErrorTheme("Tema nu poate fi goală!");
      return;
    }
    
    setLoadingTheme(true);
    setErrorTheme("");
    setSuccessTheme("");
    
    try {
      // Document ID format: grupa_data (ex: Ianuarie 2026_2026-01-27)
      const docId = `${selectedGrupa}_${selectedDate}`;
      const docRef = doc(db, "TemeZilnice", docId);
      await setDoc(docRef, {
        tema: currentTheme,
        data: selectedDate,
        grupa: selectedGrupa,
        updatedAt: new Date()
      }, { merge: true });
      
      setTemeZilnice(prev => ({
        ...prev,
        [selectedDate]: currentTheme
      }));
      
      setSuccessTheme(`Tema pentru grupa ${selectedGrupa} a fost salvată cu succes!`);
      
      // Invalidează cache-ul pentru grupa curentă
      clearCachedData(`temeZilnice_${selectedGrupa}`);
      
      setTimeout(() => setSuccessTheme(""), 3000);
    } catch (error) {
      console.error("Eroare la salvarea temei:", error);
      setErrorTheme("Eroare la salvarea temei.");
    } finally {
      setLoadingTheme(false);
    }
  };

  // Helper pentru culoarea progresului
  const getProgressColor = (value) => {
    if (value < 25) return 'from-red-500 to-red-600';
    if (value < 50) return 'from-orange-500 to-orange-600';
    if (value < 75) return 'from-yellow-500 to-yellow-600';
    if (value < 100) return 'from-green-500 to-green-600';
    return 'from-emerald-500 to-emerald-600';
  };

  // Helper pentru label progres
  const getProgressLabel = (value) => {
    if (value < 25) return 'Începător';
    if (value < 50) return 'În progres';
    if (value < 75) return 'Avansat';
    if (value < 100) return 'Aproape gata';
    return 'Complet';
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-400 mb-4">
        🎖️ Proiect Army - Gestionare Cursanți
      </h2>

      {/* Formular adăugare cursant */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">
          Adaugă Cursant Nou
        </h3>
        <form onSubmit={handleAddCursant} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nume complet"
              value={newCursant.nume}
              onChange={(e) => setNewCursant({ ...newCursant, nume: e.target.value })}
              className="p-2 rounded border border-gray-600 bg-gray-700 text-white"
              required
            />
            <input
              type="tel"
              placeholder="Număr telefon"
              value={newCursant.telefon}
              onChange={(e) => setNewCursant({ ...newCursant, telefon: e.target.value })}
              className="p-2 rounded border border-gray-600 bg-gray-700 text-white"
              required
            />
            <input
              type="text"
              placeholder="Pereche valutară (ex: EUR/USD)"
              value={newCursant.perecheValutara}
              onChange={(e) => setNewCursant({ ...newCursant, perecheValutara: e.target.value })}
              className="p-2 rounded border border-gray-600 bg-gray-700 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tip Participant
              </label>
              <select
                value={newCursant.tipParticipant}
                onChange={(e) => setNewCursant({ ...newCursant, tipParticipant: e.target.value })}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
                required
              >
                <option value="Cursant">Cursant</option>
                <option value="Mentor">Mentor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Grupă
              </label>
              <select
                value={newCursant.grupa}
                onChange={(e) => setNewCursant({ ...newCursant, grupa: e.target.value })}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
                required
              >
                {grupeDisponibile.map(grupa => (
                  <option key={grupa} value={grupa}>{grupa}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ora Lumânare 4H (Tranzacționare)
              </label>
              <input
                type="text"
                value={newCursant.oraLumanare}
                onChange={(e) => setNewCursant({ ...newCursant, oraLumanare: e.target.value })}
                placeholder="Ex: 13:00 - 17:00"
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loadingArmy}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingArmy ? "Se adaugă..." : "Adaugă Cursant"}
          </button>
        </form>
        {errorArmy && (
          <p className="text-red-400 mt-3">{errorArmy}</p>
        )}
        {successArmy && (
          <p className="text-green-400 mt-3">{successArmy}</p>
        )}
      </div>

      {/* Filtru Grupă */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <label className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
            <span>🎯</span>
            Filtrează după grupă:
          </label>
          <select
            value={selectedGrupa}
            onChange={(e) => setSelectedGrupa(e.target.value)}
            className="p-2 rounded border border-gray-600 bg-gray-700 text-white font-semibold"
          >
            {grupeDisponibile.map(grupa => (
              <option key={grupa} value={grupa}>{grupa}</option>
            ))}
          </select>
          <span className="text-gray-400 text-sm">
            ({armyCursanti.filter(c => c.tipParticipant !== 'Mentor' && c.grupa === selectedGrupa).length} cursanți în această grupă)
          </span>
        </div>
      </div>

      {/* Tabel Mentori */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
            <span>👨‍🏫</span>
            Lista Mentori ({armyCursanti.filter(c => c.tipParticipant === 'Mentor').length})
          </h3>
          {armyCursanti.filter(c => c.tipParticipant === 'Mentor').length > 0 && (
            <button
              onClick={() => fetchArmyCursanti(true)}
              disabled={loadingArmy}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm flex items-center gap-2 disabled:opacity-50"
              title="Reîncarcă datele din Firebase"
            >
              <span>🔄</span>
              {loadingArmy ? 'Se încarcă...' : 'Refresh'}
            </button>
          )}
        </div>
        {loadingArmy && !armyCursanti.length ? (
          <p>Se încarcă mentorii...</p>
        ) : armyCursanti.filter(c => c.tipParticipant === 'Mentor').length === 0 ? (
          <p className="text-gray-400">Nu există mentori înregistrați încă.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-purple-900">
                  <th className="p-2 border border-gray-700 text-center">#</th>
                  <th className="p-2 border border-gray-700">Nume</th>
                  <th className="p-2 border border-gray-700">Telefon</th>
                  <th className="p-2 border border-gray-700 text-center">Tip Participant</th>
                  <th className="p-2 border border-gray-700 text-center">Pereche Valutară</th>
                  <th className="p-2 border border-gray-700 text-center">Ora Lumânare 4H</th>
                  <th className="p-2 border border-gray-700 text-center">Upload Astăzi</th>
                  <th className="p-2 border border-gray-700 text-center">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {armyCursanti.filter(c => c.tipParticipant === 'Mentor').map((cursant, idx) => (
                  <tr key={cursant.id} className="hover:bg-gray-700">
                    <td className="p-2 border border-gray-700 text-center font-semibold">
                      {idx + 1}
                    </td>
                    {editingCursant === cursant.id ? (
                      <>
                        <td className="p-2 border border-gray-700">
                          <input
                            type="text"
                            value={editFormData.nume}
                            onChange={(e) => setEditFormData({ ...editFormData, nume: e.target.value })}
                            className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white"
                          />
                        </td>
                        <td className="p-2 border border-gray-700">
                          <input
                            type="tel"
                            value={editFormData.telefon}
                            onChange={(e) => setEditFormData({ ...editFormData, telefon: e.target.value })}
                            className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white"
                          />
                        </td>
                        <td className="p-2 border border-gray-700">
                          <select
                            value={editFormData.tipParticipant}
                            onChange={(e) => setEditFormData({ ...editFormData, tipParticipant: e.target.value })}
                            className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white text-center"
                          >
                            <option value="Cursant">Cursant</option>
                            <option value="Mentor">Mentor</option>
                          </select>
                        </td>
                        <td className="p-2 border border-gray-700">
                          <input
                            type="text"
                            value={editFormData.perecheValutara}
                            onChange={(e) => setEditFormData({ ...editFormData, perecheValutara: e.target.value })}
                            className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white text-center"
                          />
                        </td>
                        <td className="p-2 border border-gray-700">
                          <input
                            type="text"
                            value={editFormData.oraLumanare}
                            onChange={(e) => setEditFormData({ ...editFormData, oraLumanare: e.target.value })}
                            placeholder="Ex: 13:00 - 17:00"
                            className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white text-center"
                          />
                        </td>
                        <td className="p-2 border border-gray-700 text-center">
                          {hasUploadedToday(cursant.lastUploadDate) ? (
                            <span className="text-2xl" title="A uploadat astăzi">🟢</span>
                          ) : (
                            <span className="text-2xl" title="Nu a uploadat astăzi">🔴</span>
                          )}
                        </td>
                        <td className="p-2 border border-gray-700">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleSaveEdit(cursant.id)}
                              disabled={loadingArmy}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50"
                            >
                              Salvează
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={loadingArmy}
                              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm disabled:opacity-50"
                            >
                              Anulează
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td 
                          className="p-2 border border-gray-700 cursor-pointer hover:bg-purple-600 transition-colors"
                          onClick={() => openProgressModal(cursant)}
                          title="Click pentru a vedea progresul"
                        >
                          {cursant.nume}
                        </td>
                        <td className="p-2 border border-gray-700">{cursant.telefon}</td>
                        <td className="p-2 border border-gray-700 text-center">
                          <span className={`px-2 py-1 rounded text-sm font-semibold ${
                            cursant.tipParticipant === 'Mentor' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-green-600 text-white'
                          }`}>
                            {cursant.tipParticipant || 'Cursant'}
                          </span>
                        </td>
                        <td className="p-2 border border-gray-700 text-center font-semibold text-blue-300">
                          {cursant.perecheValutara}
                        </td>
                        <td className="p-2 border border-gray-700 text-center text-sm">
                          {cursant.oraLumanare || '8:00 - 12:00'}
                        </td>
                        <td className="p-2 border border-gray-700 text-center">
                          {hasUploadedToday(cursant.lastUploadDate) ? (
                            <span className="text-2xl" title="A uploadat astăzi">🟢</span>
                          ) : (
                            <span className="text-2xl" title="Nu a uploadat astăzi">🔴</span>
                          )}
                        </td>
                        <td className="p-2 border border-gray-700">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditCursant(cursant)}
                              disabled={loadingArmy || editingCursant !== null}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                            >
                              Editează
                            </button>
                            <button
                              onClick={() => openDeleteModal(cursant)}
                              disabled={loadingArmy || editingCursant !== null}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                            >
                              Șterge
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tabel Cursanti */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
            <span>🎓</span>
            Lista Cursanti ({armyCursanti.filter(c => c.tipParticipant !== 'Mentor' && c.grupa === selectedGrupa).filter(c => c.nume.toLowerCase().includes(searchCursant.toLowerCase())).length})
          </h3>
          {armyCursanti.filter(c => c.tipParticipant !== 'Mentor' && c.grupa === selectedGrupa).length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => fetchArmyCursanti(true)}
                disabled={loadingArmy}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-2 disabled:opacity-50"
                title="Reîncarcă datele din Firebase"
              >
                <span>🔄</span>
                {loadingArmy ? 'Se încarcă...' : 'Refresh'}
              </button>
              <button
                onClick={exportArmyToExcel}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-2"
              >
                <span>📊</span>
                Exporta cursanti
              </button>
            </div>
          )}
        </div>
        
        {/* Filtre si Sortare */}
        {armyCursanti.filter(c => c.tipParticipant !== 'Mentor' && c.grupa === selectedGrupa).length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[250px]">
              <input
                type="text"
                placeholder="Cauta dupa nume..."
                value={searchCursant}
                onChange={(e) => setSearchCursant(e.target.value)}
                className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortCursanti("asc")}
                className={`px-4 py-2 rounded text-sm flex items-center gap-2 ${
                  sortCursanti === "asc" 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span>🔼</span>
                A-Z
              </button>
              <button
                onClick={() => setSortCursanti("desc")}
                className={`px-4 py-2 rounded text-sm flex items-center gap-2 ${
                  sortCursanti === "desc" 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span>🔽</span>
                Z-A
              </button>
            </div>
          </div>
        )}
        {loadingArmy && !armyCursanti.length ? (
          <p>Se incarca cursantii...</p>
        ) : armyCursanti.filter(c => c.tipParticipant !== 'Mentor' && c.grupa === selectedGrupa).length === 0 ? (
          <p className="text-gray-400">Nu exista cursanti inregistrati inca pentru aceasta grupa.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-green-900">
                  <th className="p-2 border border-gray-700 text-center">#</th>
                  <th className="p-2 border border-gray-700">Nume</th>
                  <th className="p-2 border border-gray-700">Telefon</th>
                  <th className="p-2 border border-gray-700 text-center">Tip Participant</th>
                  <th className="p-2 border border-gray-700 text-center">Grupa</th>
                  <th className="p-2 border border-gray-700 text-center">Pereche Valutară</th>
                  <th className="p-2 border border-gray-700 text-center">Ora Lumânare 4H</th>
                  <th className="p-2 border border-gray-700 text-center">Upload Astăzi</th>
                  <th className="p-2 border border-gray-700 text-center">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {armyCursanti
                  .filter(c => c.tipParticipant !== 'Mentor' && c.grupa === selectedGrupa)
                  .filter(c => c.nume.toLowerCase().includes(searchCursant.toLowerCase()))
                  .sort((a, b) => {
                    const nameA = a.nume.toLowerCase();
                    const nameB = b.nume.toLowerCase();
                    if (sortCursanti === 'asc') {
                      return nameA.localeCompare(nameB);
                    } else {
                      return nameB.localeCompare(nameA);
                    }
                  })
                  .map((cursant, idx) => (
                  <tr key={cursant.id} className="hover:bg-gray-700">
                    <td className="p-2 border border-gray-700 text-center font-semibold">
                      {idx + 1}
                    </td>
                    {editingCursant === cursant.id ? (
                      <>
                        <td className="p-2 border border-gray-700">
                          <input
                            type="text"
                            value={editFormData.nume}
                            onChange={(e) => setEditFormData({ ...editFormData, nume: e.target.value })}
                            className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white"
                          />
                        </td>
                        <td className="p-2 border border-gray-700">
                          <input
                            type="tel"
                            value={editFormData.telefon}
                            onChange={(e) => setEditFormData({ ...editFormData, telefon: e.target.value })}
                            className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white"
                          />
                        </td>
                        <td className="p-2 border border-gray-700">
                          <select
                            value={editFormData.tipParticipant}
                            onChange={(e) => setEditFormData({ ...editFormData, tipParticipant: e.target.value })}
                            className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white text-center"
                          >
                            <option value="Cursant">Cursant</option>
                            <option value="Mentor">Mentor</option>
                          </select>
                        </td>
                        <td className="p-2 border border-gray-700">
                          <select
                            value={editFormData.grupa || 'Ianuarie 2026'}
                            onChange={(e) => setEditFormData({ ...editFormData, grupa: e.target.value })}
                            className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white text-center"
                          >
                            {grupeDisponibile.map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2 border border-gray-700">
                          <input
                            type="text"
                            value={editFormData.perecheValutara}
                            onChange={(e) => setEditFormData({ ...editFormData, perecheValutara: e.target.value })}
                            className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white text-center"
                          />
                        </td>
                        <td className="p-2 border border-gray-700">
                          <input
                            type="text"
                            value={editFormData.oraLumanare}
                            onChange={(e) => setEditFormData({ ...editFormData, oraLumanare: e.target.value })}
                            placeholder="Ex: 13:00 - 17:00"
                            className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white text-center"
                          />
                        </td>
                        <td className="p-2 border border-gray-700 text-center">
                          {hasUploadedToday(cursant.lastUploadDate) ? (
                            <span className="text-2xl" title="A uploadat astăzi">🟢</span>
                          ) : (
                            <span className="text-2xl" title="Nu a uploadat astăzi">🔴</span>
                          )}
                        </td>
                        <td className="p-2 border border-gray-700">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleSaveEdit(cursant.id)}
                              disabled={loadingArmy}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50"
                            >
                              Salvează
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={loadingArmy}
                              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm disabled:opacity-50"
                            >
                              Anulează
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td 
                          className="p-2 border border-gray-700 cursor-pointer hover:bg-green-600 transition-colors"
                          onClick={() => openProgressModal(cursant)}
                          title="Click pentru a vedea progresul"
                        >
                          {cursant.nume}
                        </td>
                        <td className="p-2 border border-gray-700">{cursant.telefon}</td>
                        <td className="p-2 border border-gray-700 text-center">
                          <span className={`px-2 py-1 rounded text-sm font-semibold ${
                            cursant.tipParticipant === 'Mentor' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-green-600 text-white'
                          }`}>
                            {cursant.tipParticipant || 'Cursant'}
                          </span>
                        </td>
                        <td className="p-2 border border-gray-700 text-center">
                          <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
                            {cursant.grupa || 'Ianuarie 2026'}
                          </span>
                        </td>
                        <td className="p-2 border border-gray-700 text-center font-semibold text-blue-300">
                          {cursant.perecheValutara}
                        </td>
                        <td className="p-2 border border-gray-700 text-center text-sm">
                          {cursant.oraLumanare || '8:00 - 12:00'}
                        </td>
                        <td className="p-2 border border-gray-700 text-center">
                          {hasUploadedToday(cursant.lastUploadDate) ? (
                            <span className="text-2xl" title="A uploadat astăzi">🟢</span>
                          ) : (
                            <span className="text-2xl" title="Nu a uploadat astăzi">🔴</span>
                          )}
                        </td>
                        <td className="p-2 border border-gray-700">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditCursant(cursant)}
                              disabled={loadingArmy || editingCursant !== null}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                            >
                              Editează
                            </button>
                            <button
                              onClick={() => openDeleteModal(cursant)}
                              disabled={loadingArmy || editingCursant !== null}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                            >
                              Șterge
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Secțiunea Teme Zilnice pentru Cursanți */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-yellow-400 flex items-center gap-3">
            <span>📚</span>
            Tema Zilnică pentru Cursanți
          </h3>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Selector de grupă */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                🎯 Selectează Grupa
              </label>
              <select
                value={selectedGrupa}
                onChange={(e) => setSelectedGrupa(e.target.value)}
                className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white text-lg font-semibold focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                {grupeDisponibile.map(grupa => (
                  <option key={grupa} value={grupa}>{grupa}</option>
                ))}
              </select>
              <p className="text-sm text-yellow-300 mt-2 font-semibold">
                📌 Grupa selectată: {selectedGrupa}
              </p>
            </div>
            
            {/* Selector de dată */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                📅 Selectează Data pentru Temă
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white text-lg font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-400 mt-2">
                Data selectată: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ro-RO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Info despre tema curentă */}
            <div className="flex flex-col justify-center bg-gray-800 p-4 rounded-lg border border-gray-600">
              <div className="text-sm text-gray-400 mb-2">Status temă:</div>
              {currentTheme ? (
                <div className="flex items-center gap-2 text-green-400">
                  <span className="text-2xl">✅</span>
                  <span className="font-semibold">Tema existentă pentru această dată</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-2xl">📝</span>
                  <span className="font-semibold">Nicio temă pentru această dată</span>
                </div>
              )}
            </div>
          </div>

          {/* Textarea pentru temă */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              ✍️ Conținutul Temei pentru grupa {selectedGrupa}
            </label>
            <textarea
              value={currentTheme}
              onChange={(e) => {
                setCurrentTheme(e.target.value);
                // Auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              placeholder={`Scrie tema pentru ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}...`}
              className="w-full p-4 rounded border border-gray-600 bg-gray-700 text-white min-h-[150px] resize-none overflow-hidden focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
              style={{ height: 'auto' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
          </div>

          {/* Butoane și mesaje */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {successTheme && (
                <p className="text-green-400 font-semibold flex items-center gap-2">
                  <span>✅</span>
                  {successTheme}
                </p>
              )}
              {errorTheme && (
                <p className="text-red-400 font-semibold flex items-center gap-2">
                  <span>❌</span>
                  {errorTheme}
                </p>
              )}
            </div>
            <button
              onClick={handleSaveTheme}
              disabled={loadingTheme || !currentTheme.trim()}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2 transition-all"
            >
              {loadingTheme ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Se salvează...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Salvează Tema
                </>
              )}
            </button>
          </div>

          {/* Info suplimentară */}
          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
            <p className="text-sm text-blue-300 flex items-center gap-2">
              <span>💡</span>
              <strong>Sfat:</strong> Poți programa teme în avans. Selectează o dată viitoare și scrie tema pentru acea zi.
            </p>
          </div>
        </div>
      </div>

      <a
        href="/"
        className="block mt-6 text-center text-blue-400 hover:underline"
      >
        Înapoi în aplicație
      </a>

      {/* Modal progres cursant */}
      {showProgressModal && selectedCursant && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    📊 Progres - {selectedCursant.nume}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Pereche valutară: <span className="font-semibold">{selectedCursant.perecheValutara}</span>
                  </p>
                </div>
                <button
                  onClick={closeProgressModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="p-6 bg-gray-900 border-b border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-white">Progres General</h4>
                <div className="text-right">
                  {(() => {
                    const progres = selectedCursant.progres || Array(20).fill(0);
                    const total = progres.reduce((acc, val) => acc + val, 0);
                    const average = Math.round(total / progres.length);
                    const completed = progres.filter(p => p === 100).length;
                    return (
                      <>
                        <p className="text-3xl font-bold text-blue-400">{average}%</p>
                        <p className="text-sm text-gray-400">
                          {completed} din 20 principii complete
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
              {(() => {
                const progres = selectedCursant.progres || Array(20).fill(0);
                const total = progres.reduce((acc, val) => acc + val, 0);
                const average = Math.round(total / progres.length);
                return (
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getProgressColor(average)} transition-all duration-500`}
                      style={{ width: `${average}%` }}
                    />
                  </div>
                );
              })()}
            </div>

            {/* Notele Adminului */}
            <div className="p-6 bg-gray-900 border-t border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                📝 Note Admin
              </h4>
              <div className="space-y-4">
                {/* Puncte Slabe */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <label className="block text-sm font-semibold text-red-400 mb-2">
                    🔴 Puncte Slabe
                  </label>
                  <textarea
                    value={editingCursant === selectedCursant.id 
                      ? editFormData.adminNotes?.puncteSlabe || "" 
                      : selectedCursant.adminNotes?.puncteSlabe || ""}
                    onChange={(e) => {
                      if (editingCursant === selectedCursant.id) {
                        setEditFormData({
                          ...editFormData,
                          adminNotes: {
                            ...editFormData.adminNotes,
                            puncteSlabe: e.target.value
                          }
                        });
                      }
                      // Auto-resize
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    disabled={editingCursant !== selectedCursant.id}
                    placeholder="Notează punctele slabe ale cursantului..."
                    className={`w-full p-3 rounded border bg-gray-700 text-white min-h-[100px] resize-none overflow-hidden ${
                      editingCursant === selectedCursant.id 
                        ? 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                        : 'border-gray-700 cursor-default'
                    }`}
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                </div>

                {/* Strategie și Plan de Execuție */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <label className="block text-sm font-semibold text-blue-400 mb-2">
                    🎯 Strategie și Plan de Execuție
                  </label>
                  <textarea
                    value={editingCursant === selectedCursant.id 
                      ? editFormData.adminNotes?.strategiePlan || "" 
                      : selectedCursant.adminNotes?.strategiePlan || ""}
                    onChange={(e) => {
                      if (editingCursant === selectedCursant.id) {
                        setEditFormData({
                          ...editFormData,
                          adminNotes: {
                            ...editFormData.adminNotes,
                            strategiePlan: e.target.value
                          }
                        });
                      }
                      // Auto-resize
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    disabled={editingCursant !== selectedCursant.id}
                    placeholder="Notează strategia și planul de execuție pentru cursant..."
                    className={`w-full p-3 rounded border bg-gray-700 text-white min-h-[100px] resize-none overflow-hidden ${
                      editingCursant === selectedCursant.id 
                        ? 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                        : 'border-gray-700 cursor-default'
                    }`}
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                </div>

                {/* Alte Observații */}
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <label className="block text-sm font-semibold text-green-400 mb-2">
                    📋 Alte Observații
                  </label>
                  <textarea
                    value={editingCursant === selectedCursant.id 
                      ? editFormData.adminNotes?.alteObservatii || "" 
                      : selectedCursant.adminNotes?.alteObservatii || ""}
                    onChange={(e) => {
                      if (editingCursant === selectedCursant.id) {
                        setEditFormData({
                          ...editFormData,
                          adminNotes: {
                            ...editFormData.adminNotes,
                            alteObservatii: e.target.value
                          }
                        });
                      }
                      // Auto-resize
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    disabled={editingCursant !== selectedCursant.id}
                    placeholder="Alte observații despre cursant..."
                    className={`w-full p-3 rounded border bg-gray-700 text-white min-h-[100px] resize-none overflow-hidden ${
                      editingCursant === selectedCursant.id 
                        ? 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                        : 'border-gray-700 cursor-default'
                    }`}
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                </div>

                {/* Butoane de acțiune */}
                {editingCursant === selectedCursant.id ? (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleSaveEdit(selectedCursant.id)}
                      disabled={loadingArmy}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-semibold"
                    >
                      {loadingArmy ? "Se salvează..." : "💾 Salvează Notele"}
                    </button>
                    <button
                      onClick={() => {
                        handleCancelEdit();
                        closeProgressModal();
                      }}
                      disabled={loadingArmy}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                      Anulează
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditCursant(selectedCursant)}
                    disabled={loadingArmy}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
                  >
                    ✏️ Editează Notele
                  </button>
                )}
              </div>
            </div>

            {/* Lista principiilor */}
            <div className="p-6 border-t border-gray-700">
              <button
                onClick={() => setShowPrinciples(!showPrinciples)}
                className="w-full flex items-center justify-between text-lg font-semibold text-white mb-4 hover:text-blue-400 transition-colors"
              >
                <span>Cele 20 de Principii ale Bibliei Traderului</span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${showPrinciples ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showPrinciples && (
              <div className="space-y-3">
                {principleNames.map((name, idx) => {
                  const progres = selectedCursant.progres || Array(20).fill(0);
                  const value = progres[idx] || 0;
                  return (
                    <div
                      key={idx}
                      className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl font-bold text-blue-400 w-8">
                            {idx + 1}
                          </span>
                          <h5 className="text-white font-medium">{name}</h5>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            value < 25 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            value < 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                            value < 75 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            value < 100 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {getProgressLabel(value)}
                          </span>
                          <span className="text-lg font-bold text-white w-12 text-right">
                            {value}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getProgressColor(value)} transition-all duration-500`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>

            {/* Screenshots Section */}
            {selectedCursant.screenshots && selectedCursant.screenshots.length > 0 && (() => {
              const reversedScreenshots = selectedCursant.screenshots.slice().reverse();
              const totalPages = Math.ceil(reversedScreenshots.length / screenshotsPerPage);
              const startIndex = (screenshotsPage - 1) * screenshotsPerPage;
              const endIndex = startIndex + screenshotsPerPage;
              const currentScreenshots = reversedScreenshots.slice(startIndex, endIndex);
              
              return (
              <div className="p-6 bg-gray-900 border-t border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Screenshots Uploadate ({selectedCursant.screenshots.length})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm w-16">#</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Nume Fișier</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm w-48">Data și Ora</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Notă</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentScreenshots.map((screenshot, index) => (
                        <tr 
                          key={index}
                          className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                          onClick={() => setSelectedScreenshot(screenshot)}
                        >
                          <td className="py-3 px-4 text-blue-400 font-semibold">{startIndex + index + 1}</td>
                          <td className="py-3 px-4 text-white">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="truncate">{screenshot.fileName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-300 text-sm">
                            {new Date(screenshot.uploadDate).toLocaleDateString('ro-RO', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="py-3 px-4 text-gray-300 text-sm">
                            {screenshot.note ? (
                              <div className="max-w-xs">
                                <span className="line-clamp-2" title={screenshot.note}>
                                  📝 {screenshot.note}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => setScreenshotsPage(prev => Math.max(1, prev - 1))}
                      disabled={screenshotsPage === 1}
                      className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Anterior
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setScreenshotsPage(page)}
                          className={`w-10 h-10 rounded ${
                            page === screenshotsPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          } transition-colors`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setScreenshotsPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={screenshotsPage === totalPages}
                      className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Următor →
                    </button>
                  </div>
                )}
              </div>
              );
            })()}

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-700 rounded-b-lg">
              <button
                onClick={closeProgressModal}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Screenshots */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 bg-black/95 z-[60] overflow-y-auto"
          onClick={() => setSelectedScreenshot(null)}
        >
          <button
            onClick={() => setSelectedScreenshot(null)}
            className="fixed top-4 right-4 bg-gray-800/90 hover:bg-gray-700 text-white p-3 rounded-full transition-colors z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadScreenshot(selectedScreenshot);
            }}
            className="fixed top-4 right-20 bg-blue-600/90 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors z-50 flex items-center gap-2 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          
          <div className="min-h-screen flex items-center justify-center p-4 py-20">
            <div className="max-w-7xl w-full flex flex-col items-center gap-4">
              <img
                src={selectedScreenshot.url}
                alt={selectedScreenshot.fileName}
                className="max-w-full h-auto object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="w-full bg-gray-900/90 backdrop-blur-sm rounded-lg px-6 py-4 max-w-4xl">
                <p className="text-white font-medium text-lg text-left">{selectedScreenshot.fileName}</p>
                <p className="text-gray-400 text-sm mt-1 text-left">
                  Uploadat: {new Date(selectedScreenshot.uploadDate).toLocaleDateString('ro-RO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {selectedScreenshot.note && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-amber-400 font-semibold text-sm mb-2 text-left">📝 Notă:</p>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap text-left">
                      {selectedScreenshot.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmare ștergere cursant Army */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-4">
              Confirmare ștergere cursant
            </h3>
            <p className="text-gray-300 mb-6">
              Ești sigur că vrei să ștergi cursantul{" "}
              <span className="font-semibold text-blue-400">{cursantToDelete?.nume}</span>?
              <br />
              <span className="text-red-400 text-sm">Această acțiune nu poate fi anulată!</span>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                disabled={loadingArmy}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
              >
                Anulează
              </button>
              <button
                onClick={confirmDeleteCursant}
                disabled={loadingArmy}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {loadingArmy ? "Se șterge..." : "Șterge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArmyTab;
