import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { collection, getDocs, doc, updateDoc, addDoc, Timestamp, deleteDoc, setDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db, auth } from "./FireBase.js";
import MaterialeTab from "./components/MaterialeTab.jsx";
import FeedbackTab from "./components/FeedbackTab.jsx";
import ConcursTab from "./components/ConcursTab.jsx";
import ArmyTab from "./components/ArmyTab.jsx";
import LeaduriTab from "./components/LeaduriTab.jsx";
import IntrebariArmyTab from "./components/IntrebariArmyTab.jsx";


const formatDate = (createdAt) => {
  if (!createdAt) return "N/A";
  if (createdAt.toDate) return createdAt.toDate().toLocaleString();
  try {
    return new Date(createdAt).toLocaleString();
  } catch {
    return "N/A";
  }
};

// === CACHE HELPERS - Reduce Firebase reads === 
const CACHE_DURATION = 5 * 60 * 1000; // 5 minute

const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Verifică dacă cache-ul este încă valid
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
    
    // Cache-ul a expirat, șterge-l
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
};

const setCachedData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (err) {
    console.warn('Nu s-a putut cache-ui datele:', err);
  }
};

const clearCachedData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn('Nu s-a putut șterge cache-ul:', err);
  }
};

// Funcție pentru a verifica dacă utilizatorul a uploadat astăzi (ora României - EET/EEST)
const hasUploadedToday = (lastUploadDate) => {
  if (!lastUploadDate) return false;
  
  try {
    const lastUpload = new Date(lastUploadDate);
    const now = new Date();
    
    // Folosim toLocaleDateString cu timezone-ul României pentru a obține doar data calendaristică
    const lastUploadDay = lastUpload.toLocaleDateString('ro-RO', { 
      timeZone: 'Europe/Bucharest',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const todayRomania = now.toLocaleDateString('ro-RO', { 
      timeZone: 'Europe/Bucharest',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    // Comparăm doar zilele calendaristice în timezone-ul României
    return lastUploadDay === todayRomania;
  } catch {
    return false;
  }
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tab management
  const [activeTab, setActiveTab] = useState("army");

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

  // Materiale Army
  const [materialeArmy, setMaterialeArmy] = useState([]);
  const [loadingMateriale, setLoadingMateriale] = useState(false);
  const [errorMateriale, setErrorMateriale] = useState("");
  const [successMateriale, setSuccessMateriale] = useState("");
  const [showAddMaterialForm, setShowAddMaterialForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    nota: "",
    modul: "1",
    imagine: null
  });
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editMaterialData, setEditMaterialData] = useState({
    nota: "",
    modul: "1"
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchFeedbackAnonim();
        fetchConcursInscrieri();
        fetchMaterialeArmy();
      } else {
        setLoadingFeedback(false);
        setLoadingConcurs(false);
        setLoadingMateriale(false);
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

  const fetchFeedbackAnonim = async (forceRefresh = false) => {
    setLoadingFeedback(true);
    setErrorFeedback("");
    
    try {
      // Verifică cache-ul mai întâi (doar dacă nu e forceRefresh)
      if (!forceRefresh) {
        const cachedData = getCachedData('dashboard_feedback');
        if (cachedData) {
          console.log('📦 Feedback încărcat din cache (economisim citiri Firebase)');
          setFeedbackAnonim(cachedData.feedback);
          setMediaEducatie(cachedData.mediaEducatie);
          setMediaLiveTrade(cachedData.mediaLiveTrade);
          setLoadingFeedback(false);
          return;
        }
      }
      
      // Dacă nu există cache sau e forceRefresh, citește din Firebase
      console.log('🔄 Citire feedback din Firebase...');
      const snapshot = await getDocs(collection(db, "formularAnonim"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Calcul medii
      const educValues = data
        .map((f) => parseFloat(f.educatie))
        .filter((v) => !isNaN(v));
      const liveValues = data
        .map((f) => parseFloat(f.liveTrade))
        .filter((v) => !isNaN(v));

      const mediaEducatieCalc = educValues.length
        ? (educValues.reduce((a, b) => a + b, 0) / educValues.length).toFixed(2)
        : "0.00";
      const mediaLiveTradeCalc = liveValues.length
        ? (liveValues.reduce((a, b) => a + b, 0) / liveValues.length).toFixed(2)
        : "0.00";

      setMediaEducatie(mediaEducatieCalc);
      setMediaLiveTrade(mediaLiveTradeCalc);
      setFeedbackAnonim(data);
      
      // Salvează în cache
      setCachedData('dashboard_feedback', {
        feedback: data,
        mediaEducatie: mediaEducatieCalc,
        mediaLiveTrade: mediaLiveTradeCalc
      });
    } catch (err) {
      setErrorFeedback(
        "Eroare la încărcarea feedback-ului anonim: " + err.message
      );
    } finally {
      setLoadingFeedback(false);
    }
  };

  const fetchConcursInscrieri = async (forceRefresh = false) => {
    setLoadingConcurs(true);
    setErrorConcurs("");
    
    try {
      // Verifică cache-ul mai întâi
      if (!forceRefresh) {
        const cachedData = getCachedData('dashboard_concurs');
        if (cachedData) {
          console.log('📦 Concurs încărcat din cache (economisim citiri Firebase)');
          setConcursInscrieri(cachedData);
          setLoadingConcurs(false);
          return;
        }
      }
      
      // Citește din Firebase
      console.log('🔄 Citire concurs din Firebase...');
      const snapshot = await getDocs(collection(db, "inscrieri_concurs"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setConcursInscrieri(data);
      
      // Salvează în cache
      setCachedData('dashboard_concurs', data);
    } catch (err) {
      setErrorConcurs(
        "Eroare la încărcarea înscrierilor la concurs: " + err.message
      );
    } finally {
      setLoadingConcurs(false);
    }
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

  // === MATERIALE ARMY FUNCTIONS ===
  
  const fetchMaterialeArmy = async (forceRefresh = false) => {
    setLoadingMateriale(true);
    setErrorMateriale("");
    
    try {
      if (!forceRefresh) {
        const cachedData = getCachedData('dashboard_materiale');
        if (cachedData) {
          console.log('📦 Materiale încărcate din cache (economisim citiri Firebase)');
          setMaterialeArmy(cachedData);
          setLoadingMateriale(false);
          return;
        }
      }
      
      console.log('🔄 Citire materiale din Firebase...');
      const snapshot = await getDocs(collection(db, "MaterialeArmy"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Sortează după modul și timestamp
      data.sort((a, b) => {
        if (a.modul !== b.modul) return parseInt(a.modul) - parseInt(b.modul);
        return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
      });
      setMaterialeArmy(data);
      setCachedData('dashboard_materiale', data);
    } catch (err) {
      setErrorMateriale("Eroare la încărcarea materialelor: " + err.message);
    } finally {
      setLoadingMateriale(false);
    }
  };

  // Upload imagine la Cloudinary (similar cu ArmyUpload)
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "screenshots_unsigned");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dtdovbtye/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Cloudinary upload failed");
    }

    return await response.json();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMateriale("");

    try {
      const result = await uploadImageToCloudinary(file);
      setUploadedImageUrl(result.secure_url);
      setSuccessMateriale("Imagine încărcată cu succes!");
      setTimeout(() => setSuccessMateriale(""), 3000);
    } catch (err) {
      setErrorMateriale("Eroare la încărcarea imaginii: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    setErrorMateriale("");
    setSuccessMateriale("");

    if (!newMaterial.nota) {
      setErrorMateriale("Completează nota!");
      return;
    }

    setLoadingMateriale(true);
    try {
      await addDoc(collection(db, "MaterialeArmy"), {
        nota: newMaterial.nota,
        modul: newMaterial.modul,
        imagine: uploadedImageUrl ? {
          url: uploadedImageUrl,
          name: "material_image.jpg"
        } : null,
        timestamp: Timestamp.now(),
        autor: "Admin"
      });

      setSuccessMateriale("Material adăugat cu succes!");
      setNewMaterial({ nota: "", modul: "1", imagine: null });
      setUploadedImageUrl(null);
      setShowAddMaterialForm(false);
      
      clearCachedData('dashboard_materiale');
      fetchMaterialeArmy(true);
      
      setTimeout(() => setSuccessMateriale(""), 3000);
    } catch (err) {
      setErrorMateriale("Eroare la adăugarea materialului: " + err.message);
    } finally {
      setLoadingMateriale(false);
    }
  };

  const handleUpdateMaterial = async (materialId) => {
    setErrorMateriale("");
    setSuccessMateriale("");
    setLoadingMateriale(true);

    try {
      const docRef = doc(db, "MaterialeArmy", materialId);
      await updateDoc(docRef, {
        nota: editMaterialData.nota,
        modul: editMaterialData.modul,
        updatedAt: Timestamp.now()
      });

      setSuccessMateriale("Material actualizat cu succes!");
      setEditingMaterial(null);
      
      clearCachedData('dashboard_materiale');
      fetchMaterialeArmy(true);
      
      setTimeout(() => setSuccessMateriale(""), 3000);
    } catch (err) {
      setErrorMateriale("Eroare la actualizarea materialului: " + err.message);
    } finally {
      setLoadingMateriale(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm("Sigur vrei să ștergi acest material?")) return;

    setLoadingMateriale(true);
    setErrorMateriale("");

    try {
      await deleteDoc(doc(db, "MaterialeArmy", materialId));
      setSuccessMateriale("Material șters cu succes!");
      
      clearCachedData('dashboard_materiale');
      fetchMaterialeArmy(true);
      
      setTimeout(() => setSuccessMateriale(""), 3000);
    } catch (err) {
      setErrorMateriale("Eroare la ștergerea materialului: " + err.message);
    } finally {
      setLoadingMateriale(false);
    }
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
          onClick={() => setActiveTab("army")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "army"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          🎖️ Army
        </button>
        <button
          onClick={() => setActiveTab("materiale")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "materiale"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          📚 Materiale Army
        </button>
        <button
          onClick={() => setActiveTab("leaduri")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "leaduri"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          👥 Leaduri
        </button>
        <button
          onClick={() => setActiveTab("intrebari")}
          className={`px-4 py-2 rounded-t ${
            activeTab === "intrebari"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          💬 Întrebări Army
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
      </div>

      {/* Tab Content: Materiale Army */}
      {activeTab === "materiale" && (
        <MaterialeTab
          materialeArmy={materialeArmy}
          setMaterialeArmy={setMaterialeArmy}
          fetchMaterialeArmy={fetchMaterialeArmy}
          clearCachedData={clearCachedData}
        />
      )}

      {/* Tab Content: Leaduri */}
      {activeTab === "leaduri" && (
        <LeaduriTab clearCachedData={clearCachedData} />
      )}

      {/* Tab Content: Feedback Anonim */}
      {activeTab === "feedback" && (
        <FeedbackTab
          feedbackAnonim={feedbackAnonim}
          loadingFeedback={loadingFeedback}
          errorFeedback={errorFeedback}
          mediaEducatie={mediaEducatie}
          mediaLiveTrade={mediaLiveTrade}
        />
      )}

      {/* Tab Content: Concurs ProFX */}
      {activeTab === "concurs" && (
        <ConcursTab
          concursInscrieri={concursInscrieri}
          loadingConcurs={loadingConcurs}
          errorConcurs={errorConcurs}
        />
      )}

      {/* Tab Content: Army */}
      {activeTab === "army" && (
        <ArmyTab 
          getCachedData={getCachedData}
          setCachedData={setCachedData}
          clearCachedData={clearCachedData}
        />
      )}

      {/* Tab Content: Întrebări Army */}
      {activeTab === "intrebari" && (
        <IntrebariArmyTab 
          getCachedData={getCachedData}
          setCachedData={setCachedData}
          clearCachedData={clearCachedData}
        />
      )}
    </div>
  );
};

export default Dashboard;