import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { collection, getDocs, doc, updateDoc, addDoc, Timestamp, deleteDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db, auth } from "./FireBase.js";

const formatDate = (createdAt) => {
  if (!createdAt) return "N/A";
  if (createdAt.toDate) return createdAt.toDate().toLocaleString();
  try {
    return new Date(createdAt).toLocaleString();
  } catch {
    return "N/A";
  }
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tab management
  const [activeTab, setActiveTab] = useState("inscrieri");

  const [inscrieri, setInscrieri] = useState([]);
  const [allInscrieri, setAllInscrieri] = useState([]);
  const [searchNume, setSearchNume] = useState("");
  const [searchTelefon, setSearchTelefon] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [sortBy, setSortBy] = useState("data-desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null); // Pentru loading pe toggle
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({ id: null, currentVerified: null, nume: "" });

  const [feedbackAnonim, setFeedbackAnonim] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState("");
  const [feedbackSortBy, setFeedbackSortBy] = useState("desc");

  // PAGINARE
  const [currentPage, setCurrentPage] = useState(1);
  const feedbackPerPage = 10;

  // MEDII
  const [mediaEducatie, setMediaEducatie] = useState("0.00");
  const [mediaLiveTrade, setMediaLiveTrade] = useState("0.00");

  // Concurs ProFX
  const [concursInscrieri, setConcursInscrieri] = useState([]);
  const [loadingConcurs, setLoadingConcurs] = useState(false);
  const [errorConcurs, setErrorConcurs] = useState("");
  const [concursSortBy, setConcursSortBy] = useState("desc");
  const [currentPageConcurs, setCurrentPageConcurs] = useState(1);
  const concursPerPage = 10;

  // Army - Cursanți
  const [armyCursanti, setArmyCursanti] = useState([]);
  const [loadingArmy, setLoadingArmy] = useState(false);
  const [errorArmy, setErrorArmy] = useState("");
  const [successArmy, setSuccessArmy] = useState("");
  const [newCursant, setNewCursant] = useState({
    nume: "",
    telefon: "",
    perecheValutara: ""
  });
  const [editingCursant, setEditingCursant] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nume: "",
    telefon: "",
    perecheValutara: ""
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cursantToDelete, setCursantToDelete] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedCursant, setSelectedCursant] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchAllInscrieri();
        fetchFeedbackAnonim();
        fetchConcursInscrieri();
        fetchArmyCursanti();
      } else {
        setLoading(false);
        setLoadingFeedback(false);
        setLoadingConcurs(false);
        setLoadingArmy(false);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoginError("Eroare la login: " + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const fetchAllInscrieri = async () => {
    setLoading(true);
    setError("");
    try {
      const q = collection(db, "inscrieri");
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllInscrieri(data);
      applyFiltersAndSort(data);
    } catch (err) {
      setError("Eroare la încărcare: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funcție pentru deschiderea modalului de confirmare
  const openConfirmModal = (id, currentVerified, nume) => {
    setConfirmData({ id, currentVerified, nume });
    setShowConfirmModal(true);
  };

  // Funcție pentru închiderea modalului
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmData({ id: null, currentVerified: null, nume: "" });
  };

  // Funcție pentru toggle verified status cu confirmare
  const confirmToggleVerified = async () => {
    const { id, currentVerified } = confirmData;
    setUpdatingId(id);
    closeConfirmModal();
    
    try {
      const docRef = doc(db, "inscrieri", id);
      await updateDoc(docRef, {
        verified: !currentVerified
      });
      
      // Actualizez datele local
      const updatedAllInscrieri = allInscrieri.map(item => 
        item.id === id ? { ...item, verified: !currentVerified } : item
      );
      setAllInscrieri(updatedAllInscrieri);
      applyFiltersAndSort(updatedAllInscrieri);
    } catch (err) {
      setError("Eroare la actualizarea statusului: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const fetchFeedbackAnonim = async () => {
    setLoadingFeedback(true);
    setErrorFeedback("");
    try {
      const snapshot = await getDocs(collection(db, "formularAnonim"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Calcul medii
      const educValues = data
        .map((f) => parseFloat(f.educatie))
        .filter((v) => !isNaN(v));
      const liveValues = data
        .map((f) => parseFloat(f.liveTrade))
        .filter((v) => !isNaN(v));

      setMediaEducatie(
        educValues.length
          ? (educValues.reduce((a, b) => a + b, 0) / educValues.length).toFixed(2)
          : "0.00"
      );
      setMediaLiveTrade(
        liveValues.length
          ? (liveValues.reduce((a, b) => a + b, 0) / liveValues.length).toFixed(2)
          : "0.00"
      );

      setFeedbackAnonim(data);
    } catch (err) {
      setErrorFeedback(
        "Eroare la încărcarea feedback-ului anonim: " + err.message
      );
    } finally {
      setLoadingFeedback(false);
    }
  };

  const fetchConcursInscrieri = async () => {
    setLoadingConcurs(true);
    setErrorConcurs("");
    try {
      const snapshot = await getDocs(collection(db, "inscrieri_concurs"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setConcursInscrieri(data);
    } catch (err) {
      setErrorConcurs(
        "Eroare la încărcarea înscrierilor la concurs: " + err.message
      );
    } finally {
      setLoadingConcurs(false);
    }
  };

  const applyFiltersAndSort = (data) => {
    let filtered = data.filter((item) => {
      const numeMatch = searchNume
        ? item.nume?.toLowerCase().includes(searchNume.toLowerCase())
        : true;
      const telefonMatch = searchTelefon
        ? item.telefon?.includes(searchTelefon)
        : true;
      const emailMatch = searchEmail
        ? item.email?.toLowerCase().includes(searchEmail.toLowerCase())
        : true;
      return numeMatch && telefonMatch && emailMatch;
    });

    filtered.sort((a, b) => {
      if (sortBy === "nume-asc") {
        return a.nume.toLowerCase().localeCompare(b.nume.toLowerCase());
      } else if (sortBy === "nume-desc") {
        return b.nume.toLowerCase().localeCompare(a.nume.toLowerCase());
      } else if (sortBy === "data-asc") {
        return (
          (a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) -
          (b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt))
        );
      } else {
        return (
          (b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) -
          (a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt))
        );
      }
    });
    setInscrieri(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFiltersAndSort(allInscrieri);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    applyFiltersAndSort(allInscrieri);
  };

  // Export cu verified status
  const exportInscrieriToExcel = () => {
    if (inscrieri.length === 0) return;
    const dataToExport = inscrieri.map((item, idx) => ({
      Nr: idx + 1,
      Nume: item.nume || "",
      Telefon: item.telefon || "",
      Email: item.email || "",
      Verificat: item.verified ? "DA" : "NU",
      "Data Creării": formatDate(item.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Înscrieri");
    XLSX.writeFile(workbook, "inscrieri-profx.xlsx");
  };

  // --- FEEDBACK: SORTARE & PAGINARE ---

  const sortedFeedback = feedbackAnonim.slice().sort((a, b) => {
    const aDate = a.createdAt?.toDate
      ? a.createdAt.toDate()
      : new Date(a.createdAt);
    const bDate = b.createdAt?.toDate
      ? b.createdAt.toDate()
      : new Date(b.createdAt);
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

  // --- CONCURS: SORTARE & PAGINARE ---

  const sortedConcurs = concursInscrieri.slice().sort((a, b) => {
    const aDate = a.createdAt?.toDate
      ? a.createdAt.toDate()
      : new Date(a.createdAt);
    const bDate = b.createdAt?.toDate
      ? b.createdAt.toDate()
      : new Date(b.createdAt);
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

  // === ARMY FUNCTIONS ===
  
  const fetchArmyCursanti = async () => {
    setLoadingArmy(true);
    setErrorArmy("");
    try {
      const snapshot = await getDocs(collection(db, "Army"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArmyCursanti(data);
    } catch (err) {
      setErrorArmy("Eroare la încărcarea cursanților Army: " + err.message);
    } finally {
      setLoadingArmy(false);
    }
  };

  const handleAddCursant = async (e) => {
    e.preventDefault();
    setErrorArmy("");
    setSuccessArmy("");

    if (!newCursant.nume || !newCursant.telefon || !newCursant.perecheValutara) {
      setErrorArmy("Toate câmpurile sunt obligatorii!");
      return;
    }

    setLoadingArmy(true);
    try {
      console.log("Încercare adăugare cursant:", newCursant);
      console.log("User autentificat:", auth.currentUser);
      
      await addDoc(collection(db, "Army"), {
        nume: newCursant.nume,
        telefon: newCursant.telefon,
        perecheValutara: newCursant.perecheValutara,
        createdAt: Timestamp.now(),
      });
      
      console.log("Cursant adăugat cu succes!");
      setSuccessArmy("Cursant adăugat cu succes!");
      setNewCursant({ nume: "", telefon: "", perecheValutara: "" });
      fetchArmyCursanti(); // Reîncarcă lista
    } catch (err) {
      console.error("Eroare completă:", err);
      console.error("Cod eroare:", err.code);
      console.error("Mesaj eroare:", err.message);
      setErrorArmy("Eroare la adăugare: " + err.message);
    } finally {
      setLoadingArmy(false);
    }
  };

  const handleEditCursant = (cursant) => {
    setEditingCursant(cursant.id);
    setEditFormData({
      nume: cursant.nume,
      telefon: cursant.telefon,
      perecheValutara: cursant.perecheValutara
    });
    setErrorArmy("");
    setSuccessArmy("");
  };

  const handleCancelEdit = () => {
    setEditingCursant(null);
    setEditFormData({ nume: "", telefon: "", perecheValutara: "" });
    setErrorArmy("");
  };

  const handleSaveEdit = async (id) => {
    setErrorArmy("");
    setSuccessArmy("");

    if (!editFormData.nume || !editFormData.telefon || !editFormData.perecheValutara) {
      setErrorArmy("Toate câmpurile sunt obligatorii!");
      return;
    }

    setLoadingArmy(true);
    try {
      const docRef = doc(db, "Army", id);
      await updateDoc(docRef, {
        nume: editFormData.nume,
        telefon: editFormData.telefon,
        perecheValutara: editFormData.perecheValutara,
      });
      
      setSuccessArmy("Cursant actualizat cu succes!");
      setEditingCursant(null);
      setEditFormData({ nume: "", telefon: "", perecheValutara: "" });
      fetchArmyCursanti();
    } catch (err) {
      setErrorArmy("Eroare la actualizare: " + err.message);
    } finally {
      setLoadingArmy(false);
    }
  };

  const openDeleteModal = (cursant) => {
    setCursantToDelete(cursant);
    setShowDeleteModal(true);
    setErrorArmy("");
    setSuccessArmy("");
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCursantToDelete(null);
  };

  const confirmDeleteCursant = async () => {
    if (!cursantToDelete) return;

    setLoadingArmy(true);
    try {
      const docRef = doc(db, "Army", cursantToDelete.id);
      await deleteDoc(docRef);
      
      setSuccessArmy(`Cursant "${cursantToDelete.nume}" șters cu succes!`);
      closeDeleteModal();
      fetchArmyCursanti();
    } catch (err) {
      setErrorArmy("Eroare la ștergere: " + err.message);
      closeDeleteModal();
    } finally {
      setLoadingArmy(false);
    }
  };

  // Funcții pentru modalul de progres
  const openProgressModal = (cursant) => {
    setSelectedCursant(cursant);
    setShowProgressModal(true);
  };

  const closeProgressModal = () => {
    setShowProgressModal(false);
    setSelectedCursant(null);
  };

  const getProgressColor = (value) => {
    if (value < 25) return 'from-red-500 to-red-600';
    if (value < 50) return 'from-orange-500 to-orange-600';
    if (value < 75) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getProgressLabel = (value) => {
    if (value < 25) return '🔴 Început';
    if (value < 50) return '🟠 În progres';
    if (value < 75) return '🟡 Bine';
    if (value < 100) return '🟢 Foarte bine';
    return '✅ Perfect';
  };

  const principleNames = [
    "Niciodată FOMO",
    "Niciodată Răzbunare",
    "Niciodată Overtrading",
    "Frica",
    "Lăcomia",
    "Performanță, Nu Bani",
    "Fii Organizat",
    "Disciplină Absolută",
    "Răbdarea",
    "Focus Total",
    "Starea Emoțională",
    "Exersează Constant",
    "Obiceiuri Bune",
    "Fii Realist",
    "Lucrează la Tine",
    "Ține un Jurnal",
    "Monitorizează Comportamentul",
    "Încredere Echilibrată",
    "Acceptarea Pierderilor",
    "Relația cu Piața"
  ];

  // Export Army cursanți to Excel
  const exportArmyToExcel = () => {
    if (armyCursanti.length === 0) return;
    
    const dataToExport = armyCursanti.map((item, idx) => {
      // Calculează progresul general
      const progres = item.progres || Array(20).fill(0);
      const total = progres.reduce((acc, val) => acc + val, 0);
      const progresGeneral = Math.round(total / progres.length);
      const principiiComplete = progres.filter(p => p === 100).length;
      
      return {
        Nr: idx + 1,
        Nume: item.nume || "",
        Telefon: item.telefon || "",
        "Pereche Valutară": item.perecheValutara || "",
        "Progres General (%)": progresGeneral,
        "Principii Complete": `${principiiComplete}/20`,
        "Data Adăugării": formatDate(item.createdAt),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cursanți Army");
    XLSX.writeFile(workbook, "army-cursanti.xlsx");
  };

  if (!user) {
    return (
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full mx-auto mt-10 text-white">
        <h1 className="text-2xl font-bold text-blue-400 mb-6 text-center">
          Login Admin Dashboard
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        {loginError && (
          <p className="text-red-400 mt-4 text-center">{loginError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg max-w-7xl w-full mx-auto mt-6 sm:mt-10 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-blue-400">
          Dashboard Admin ProFX
        </h1>
        <button onClick={handleLogout} className="text-red-400 hover:underline">
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab("inscrieri")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "inscrieri"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Înscrieri
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "feedback"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Feedback Anonim
        </button>
        <button
          onClick={() => setActiveTab("concurs")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "concurs"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Concurs ProFX
        </button>
        <button
          onClick={() => setActiveTab("army")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "army"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          🎖️ Army
        </button>
      </div>

      {/* Tab Content: Înscrieri */}
      {activeTab === "inscrieri" && (
        <div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6"
        autoComplete="off"
      >
        <input
          type="text"
          name="search-name-field"
          placeholder="Caută după nume (partial)"
          value={searchNume}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onChange={(e) => setSearchNume(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-gray-800 text-white flex-1"
        />
        <input
          type="text"
          name="search-phone-field"
          placeholder="Caută după telefon (partial)"
          value={searchTelefon}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onChange={(e) => setSearchTelefon(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-gray-800 text-white flex-1"
        />
        <input
          type="text"
          name="search-email-field"
          placeholder="Caută după email (partial)"
          value={searchEmail}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          onChange={(e) => setSearchEmail(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-gray-800 text-white flex-1"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Caută
        </button>
      </form>

      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div>
          <label className="text-gray-300 mr-2">Sortare:</label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="p-2 rounded border border-gray-600 bg-gray-800 text-white"
          >
            <option value="data-desc">Data (recentă primul)</option>
            <option value="data-asc">Data (veche primul)</option>
            <option value="nume-asc">Nume (A-Z)</option>
            <option value="nume-desc">Nume (Z-A)</option>
          </select>
        </div>
        
        <button
          onClick={exportInscrieriToExcel}
          className="p-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Exportă Înscrieri în Excel
        </button>
      </div>

      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
      {loading ? (
        <p className="text-center">Se încarcă...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-2 border border-gray-700">Nume</th>
                <th className="p-2 border border-gray-700">Telefon</th>
                <th className="p-2 border border-gray-700">Email</th>
                <th className="p-2 border border-gray-700">Verificat</th>
                <th className="p-2 border border-gray-700">Data Creării</th>
              </tr>
            </thead>
            <tbody>
              {inscrieri.length > 0 ? (
                inscrieri.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-700">
                    <td className="p-2 border border-gray-700">{item.nume}</td>
                    <td className="p-2 border border-gray-700">
                      {item.telefon}
                    </td>
                    <td className="p-2 border border-gray-700">{item.email}</td>
                    <td className="p-2 border border-gray-700 text-center">
                      <button
                        onClick={() => openConfirmModal(item.id, item.verified, item.nume)}
                        disabled={updatingId === item.id}
                        className={`px-3 py-1 rounded text-sm font-semibold min-w-[70px] ${
                          item.verified
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        } ${updatingId === item.id ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {updatingId === item.id ? (
                          "..."
                        ) : item.verified ? (
                          "DA"
                        ) : (
                          "NU"
                        )}
                      </button>
                    </td>
                    <td className="p-2 border border-gray-700">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-2 text-center">
                    Nicio înscriere găsită.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
        </div>
      )}

      {/* Tab Content: Feedback Anonim */}
      {activeTab === "feedback" && (
        <div>

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
              setCurrentPage(1); // Când schimb sortarea, revine la pagina 1
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
      )}

      {/* Tab Content: Concurs ProFX */}
      {activeTab === "concurs" && (
        <div>

      {/* === Secțiunea Concurs ProFX === */}
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
              setCurrentPageConcurs(1); // Când schimb sortarea, revine la pagina 1
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
        </div>
      )}

      {/* Tab Content: Army */}
      {activeTab === "army" && (
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

          {/* Lista cursanți */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-300">
                Lista Cursanți ({armyCursanti.length})
              </h3>
              {armyCursanti.length > 0 && (
                <button
                  onClick={exportArmyToExcel}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-2"
                >
                  <span>📊</span>
                  Exportă în Excel
                </button>
              )}
            </div>
            {loadingArmy && !armyCursanti.length ? (
              <p>Se încarcă cursanții...</p>
            ) : armyCursanti.length === 0 ? (
              <p className="text-gray-400">Nu există cursanți înregistrați încă.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-2 border border-gray-700 text-center">#</th>
                      <th className="p-2 border border-gray-700">Nume</th>
                      <th className="p-2 border border-gray-700">Telefon</th>
                      <th className="p-2 border border-gray-700 text-center">Pereche Valutară</th>
                      <th className="p-2 border border-gray-700">Data Adăugării</th>
                      <th className="p-2 border border-gray-700 text-center">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {armyCursanti.map((cursant, idx) => (
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
                              <input
                                type="text"
                                value={editFormData.perecheValutara}
                                onChange={(e) => setEditFormData({ ...editFormData, perecheValutara: e.target.value })}
                                className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white text-center"
                              />
                            </td>
                            <td className="p-2 border border-gray-700">
                              {formatDate(cursant.createdAt)}
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
                              className="p-2 border border-gray-700 cursor-pointer hover:bg-blue-600 transition-colors"
                              onClick={() => openProgressModal(cursant)}
                              title="Click pentru a vedea progresul"
                            >
                              {cursant.nume}
                            </td>
                            <td className="p-2 border border-gray-700">{cursant.telefon}</td>
                            <td className="p-2 border border-gray-700 text-center font-semibold text-blue-300">
                              {cursant.perecheValutara}
                            </td>
                            <td className="p-2 border border-gray-700">
                              {formatDate(cursant.createdAt)}
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
        </div>
      )}

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

            {/* Lista principiilor */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Cele 20 de Principii ale Bibliei Traderului
              </h4>
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
            </div>

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

      {/* Modal de confirmare */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-4">
              Confirmare modificare status
            </h3>
            <p className="text-gray-300 mb-6">
              Ești sigur că vrei să schimbi statusul de verificare pentru{" "}
              <span className="font-semibold text-blue-400">{confirmData.nume}</span>{" "}
              din{" "}
              <span className={`font-semibold ${confirmData.currentVerified ? 'text-green-400' : 'text-red-400'}`}>
                {confirmData.currentVerified ? "VERIFICAT" : "NEVERIFICAT"}
              </span>{" "}
              în{" "}
              <span className={`font-semibold ${!confirmData.currentVerified ? 'text-green-400' : 'text-red-400'}`}>
                {!confirmData.currentVerified ? "VERIFICAT" : "NEVERIFICAT"}
              </span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Anulează
              </button>
              <button
                onClick={confirmToggleVerified}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirmă
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;