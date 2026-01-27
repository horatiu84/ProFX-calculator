import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { collection, getDocs, doc, updateDoc, addDoc, Timestamp, deleteDoc, setDoc } from "firebase/firestore";
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

  // Army - Cursanți
  const [armyCursanti, setArmyCursanti] = useState([]);
  const [loadingArmy, setLoadingArmy] = useState(false);
  const [errorArmy, setErrorArmy] = useState("");
  const [successArmy, setSuccessArmy] = useState("");
  const [newCursant, setNewCursant] = useState({
    nume: "",
    telefon: "",
    perecheValutara: "",
    tipParticipant: "Cursant",
    oraLumanare: "8:00 - 12:00",
    adminNotes: {
      puncteSlabe: "",
      strategiePlan: "",
      alteObservatii: ""
    }
  });
  const [editingCursant, setEditingCursant] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nume: "",
    telefon: "",
    perecheValutara: "",
    tipParticipant: "Cursant",
    oraLumanare: "8:00 - 12:00",
    adminNotes: {
      puncteSlabe: "",
      strategiePlan: "",
      alteObservatii: ""
    }
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cursantToDelete, setCursantToDelete] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedCursant, setSelectedCursant] = useState(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [showPrinciples, setShowPrinciples] = useState(false);
  const [screenshotsPage, setScreenshotsPage] = useState(1);
  const screenshotsPerPage = 10;
  const [searchCursant, setSearchCursant] = useState("");
  const [sortCursanti, setSortCursanti] = useState("asc");

  // Teme zilnice pentru cursanți
  const [temeZilnice, setTemeZilnice] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTheme, setCurrentTheme] = useState("");
  const [loadingTheme, setLoadingTheme] = useState(false);
  const [successTheme, setSuccessTheme] = useState("");
  const [errorTheme, setErrorTheme] = useState("");

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
        fetchArmyCursanti();
        fetchTemeZilnice();
        fetchMaterialeArmy();
      } else {
        setLoadingFeedback(false);
        setLoadingConcurs(false);
        setLoadingArmy(false);
        setLoadingMateriale(false);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, []);

  // Auto-resize textarea-uri când se deschide modalul sau se schimbă datele
  useEffect(() => {
    if (showProgressModal) {
      // Așteaptă ca DOM-ul să se actualizeze
      setTimeout(() => {
        const textareas = document.querySelectorAll('textarea[class*="min-h-"]');
        textareas.forEach(textarea => {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        });
      }, 100);
    }
  }, [showProgressModal, selectedCursant, editingCursant]);

  // Actualizează tema când se schimbă data selectată
  useEffect(() => {
    if (temeZilnice[selectedDate] !== undefined) {
      setCurrentTheme(temeZilnice[selectedDate]);
    } else {
      setCurrentTheme("");
    }
    
    // Auto-resize textarea pentru teme după ce se încarcă tema
    setTimeout(() => {
      const themeTextarea = document.querySelector('textarea[placeholder*="Scrie tema pentru"]');
      if (themeTextarea) {
        themeTextarea.style.height = 'auto';
        themeTextarea.style.height = themeTextarea.scrollHeight + 'px';
      }
    }, 100);
  }, [selectedDate, temeZilnice]);

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

  // === ARMY FUNCTIONS ===
  
  const fetchArmyCursanti = async (forceRefresh = false) => {
    setLoadingArmy(true);
    setErrorArmy("");
    
    try {
      // Verifică cache-ul mai întâi
      if (!forceRefresh) {
        const cachedData = getCachedData('dashboard_army');
        if (cachedData) {
          console.log('📦 Army încărcat din cache (economisim citiri Firebase)');
          setArmyCursanti(cachedData);
          setLoadingArmy(false);
          return;
        }
      }
      
      // Citește din Firebase
      console.log('🔄 Citire Army din Firebase...');
      const snapshot = await getDocs(collection(db, "Army"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArmyCursanti(data);
      
      // Salvează în cache
      setCachedData('dashboard_army', data);
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

    if (!newCursant.nume || !newCursant.telefon || !newCursant.perecheValutara || !newCursant.tipParticipant || !newCursant.oraLumanare) {
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
        tipParticipant: newCursant.tipParticipant,
        oraLumanare: newCursant.oraLumanare,
        adminNotes: newCursant.adminNotes || {
          puncteSlabe: "",
          strategiePlan: "",
          alteObservatii: ""
        },
        createdAt: Timestamp.now(),
      });
      
      console.log("Cursant adăugat cu succes!");
      setSuccessArmy("Cursant adăugat cu succes!");
      setNewCursant({ 
        nume: "", 
        telefon: "", 
        perecheValutara: "", 
        tipParticipant: "Cursant", 
        oraLumanare: "8:00 - 12:00",
        adminNotes: {
          puncteSlabe: "",
          strategiePlan: "",
          alteObservatii: ""
        }
      });
      
      // Invalidează cache-ul și reîncarcă cu date fresh
      clearCachedData('dashboard_army');
      fetchArmyCursanti(true); // Forțează refresh
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
      perecheValutara: cursant.perecheValutara,
      tipParticipant: cursant.tipParticipant || "Cursant",
      oraLumanare: cursant.oraLumanare || "8:00 - 12:00",
      adminNotes: cursant.adminNotes || {
        puncteSlabe: "",
        strategiePlan: "",
        alteObservatii: ""
      }
    });
    setErrorArmy("");
    setSuccessArmy("");
  };

  const handleCancelEdit = () => {
    setEditingCursant(null);
    setEditFormData({ 
      nume: "", 
      telefon: "", 
      perecheValutara: "", 
      tipParticipant: "Cursant", 
      oraLumanare: "8:00 - 12:00",
      adminNotes: {
        puncteSlabe: "",
        strategiePlan: "",
        alteObservatii: ""
      }
    });
    setErrorArmy("");
  };

  const handleSaveEdit = async (id) => {
    setErrorArmy("");
    setSuccessArmy("");

    if (!editFormData.nume || !editFormData.telefon || !editFormData.perecheValutara || !editFormData.tipParticipant || !editFormData.oraLumanare) {
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
        tipParticipant: editFormData.tipParticipant,
        oraLumanare: editFormData.oraLumanare,
        adminNotes: editFormData.adminNotes || {
          puncteSlabe: "",
          strategiePlan: "",
          alteObservatii: ""
        },
      });
      
      setSuccessArmy("Cursant actualizat cu succes!");
      
      // Actualizează selectedCursant dacă modalul este deschis pentru acest cursant
      if (selectedCursant && selectedCursant.id === id) {
        setSelectedCursant({
          ...selectedCursant,
          nume: editFormData.nume,
          telefon: editFormData.telefon,
          perecheValutara: editFormData.perecheValutara,
          tipParticipant: editFormData.tipParticipant,
          oraLumanare: editFormData.oraLumanare,
          adminNotes: editFormData.adminNotes || {
            puncteSlabe: "",
            strategiePlan: "",
            alteObservatii: ""
          }
        });
      }
      
      setEditingCursant(null);
      setEditFormData({ 
        nume: "", 
        telefon: "", 
        perecheValutara: "", 
        tipParticipant: "Cursant", 
        oraLumanare: "8:00 - 12:00",
        adminNotes: {
          puncteSlabe: "",
          strategiePlan: "",
          alteObservatii: ""
        }
      });
      
      // Invalidează cache-ul și reîncarcă
      clearCachedData('dashboard_army');
      fetchArmyCursanti(true);
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
      
      // Invalidează cache-ul și reîncarcă
      clearCachedData('dashboard_army');
      fetchArmyCursanti(true);
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
    setScreenshotsPage(1);
  };

  const closeProgressModal = () => {
    setShowProgressModal(false);
    setSelectedCursant(null);
  };

  // Funcție pentru download screenshot
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
      console.error('Eroare la download:', error);
      // Fallback - deschide într-o fereastră nouă
      window.open(screenshot.url, '_blank');
    }
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

  // === TEME ZILNICE FUNCTIONS ===
  
  const fetchTemeZilnice = async (forceRefresh = false) => {
    setLoadingTheme(true);
    setErrorTheme("");
    
    try {
      // Verifică cache-ul mai întâi
      if (!forceRefresh) {
        const cachedData = getCachedData('dashboard_teme');
        if (cachedData) {
          console.log('📦 Teme încărcate din cache (economisim citiri Firebase)');
          setTemeZilnice(cachedData);
          setCurrentTheme(cachedData[selectedDate] || "");
          setLoadingTheme(false);
          return;
        }
      }
      
      // Citește din Firebase
      console.log('🔄 Citire teme din Firebase...');
      const snapshot = await getDocs(collection(db, "TemeZilnice"));
      const temesData = {};
      snapshot.docs.forEach((doc) => {
        temesData[doc.id] = doc.data().tema || "";
      });
      
      setTemeZilnice(temesData);
      setCurrentTheme(temesData[selectedDate] || "");
      
      // Salvează în cache
      setCachedData('dashboard_teme', temesData);
    } catch (err) {
      // Nu afișa eroare dacă colecția nu există încă - e normal pentru prima utilizare
      console.log("Info: Colecția TemeZilnice nu există încă sau este goală:", err.message);
      setTemeZilnice({});
      setCurrentTheme("");
    } finally {
      setLoadingTheme(false);
    }
  };

  const handleSaveTheme = async () => {
    setErrorTheme("");
    setSuccessTheme("");
    setLoadingTheme(true);
    
    try {
      // Salvează tema în Firebase folosind data ca ID (setDoc creează sau actualizează)
      const docRef = doc(db, "TemeZilnice", selectedDate);
      await setDoc(docRef, {
        tema: currentTheme,
        data: selectedDate,
        updatedAt: Timestamp.now()
      }, { merge: true });
      
      setSuccessTheme(`Tema pentru ${selectedDate} a fost salvată cu succes!`);
      
      // Actualizează state-ul local
      setTemeZilnice(prev => ({
        ...prev,
        [selectedDate]: currentTheme
      }));
      
      // Invalidează cache-ul și reîncarcă
      clearCachedData('dashboard_teme');
      fetchTemeZilnice(true);
      
      // Șterge mesajul de succes după 3 secunde
      setTimeout(() => setSuccessTheme(""), 3000);
    } catch (err) {
      setErrorTheme("Eroare la salvarea temei: " + err.message);
    } finally {
      setLoadingTheme(false);
    }
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

  // Export Army cursanți to Excel
  const exportArmyToExcel = () => {
    // Filtrăm doar cursanții (nu mentorii)
    const cursanti = armyCursanti.filter(c => c.tipParticipant !== 'Mentor');
    
    if (cursanti.length === 0) return;
    
    const dataToExport = cursanti.map((item, idx) => {
      // Calculează progresul general
      const progres = item.progres || Array(20).fill(0);
      const total = progres.reduce((acc, val) => acc + val, 0);
      const progresGeneral = Math.round(total / progres.length);
      const principiiComplete = progres.filter(p => p === 100).length;
      
      // Extrage notele admin
      const adminNotes = item.adminNotes || {};
      
      return {
        Nr: idx + 1,
        Nume: item.nume || "",
        Telefon: item.telefon || "",
        "Pereche Valutară": item.perecheValutara || "",
        "Ora Lumânare 4H": item.oraLumanare || "8:00 - 12:00",
        "Progres General (%)": progresGeneral,
        "Principii Complete": `${principiiComplete}/20`,
        "Puncte Slabe": adminNotes.puncteSlabe || "",
        "Strategie și Plan": adminNotes.strategiePlan || "",
        "Alte Observații": adminNotes.alteObservatii || "",
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
        <div>
          <h2 className="text-xl font-bold text-blue-400 mb-4">📚 Gestiune Materiale Army</h2>

          {/* Success/Error Messages */}
          {successMateriale && (
            <div className="bg-green-900/50 border border-green-500 text-green-300 p-3 rounded mb-4">
              {successMateriale}
            </div>
          )}

          {errorMateriale && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded mb-4">
              {errorMateriale}
            </div>
          )}

          {/* Buton Adaugă Material */}
          <button
            onClick={() => setShowAddMaterialForm(!showAddMaterialForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
          >
            {showAddMaterialForm ? "❌ Anulează" : "➕ Adaugă Material Nou"}
          </button>

          {/* Formular Adăugare Material */}
          {showAddMaterialForm && (
            <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Material Nou</h3>
              <form onSubmit={handleAddMaterial} className="space-y-4">
                {/* Modul */}
                <div>
                  <label className="block text-gray-300 mb-2">Modul *</label>
                  <select
                    value={newMaterial.modul}
                    onChange={(e) => setNewMaterial({ ...newMaterial, modul: e.target.value })}
                    className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
                    required
                  >
                    <option value="1">Modul 1</option>
                    <option value="2">Modul 2</option>
                    <option value="3">Modul 3</option>
                    <option value="4">Modul 4</option>
                    <option value="5">Modul 5</option>
                    <option value="6">Modul 6</option>
                  </select>
                </div>

                {/* Notă */}
                <div>
                  <label className="block text-gray-300 mb-2">Notă *</label>
                  <textarea
                    value={newMaterial.nota}
                    onChange={(e) => setNewMaterial({ ...newMaterial, nota: e.target.value })}
                    className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
                    rows={4}
                    placeholder="Scrie nota aici..."
                    required
                  />
                </div>

                {/* Upload Imagine */}
                <div>
                  <label className="block text-gray-300 mb-2">Imagine (opțional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <p className="text-yellow-400 text-sm mt-2">Se încarcă imaginea...</p>
                  )}
                  {uploadedImageUrl && (
                    <div className="mt-2">
                      <img
                        src={uploadedImageUrl}
                        alt="Preview"
                        className="w-48 h-32 object-cover rounded border border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadedImageUrl(null)}
                        className="text-red-400 text-sm mt-1 hover:underline"
                      >
                        Șterge imagine
                      </button>
                    </div>
                  )}
                </div>

                {/* Butoane */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loadingMateriale || uploadingImage}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {loadingMateriale ? "Se salvează..." : "💾 Salvează Material"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMaterialForm(false);
                      setNewMaterial({ nota: "", modul: "1", imagine: null });
                      setUploadedImageUrl(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  >
                    Anulează
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista Materiale */}
          {loadingMateriale ? (
            <p className="text-gray-400">Se încarcă materialele...</p>
          ) : materialeArmy.length === 0 ? (
            <p className="text-gray-400">Nu există materiale încă.</p>
          ) : (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map(modul => {
                const materialeModul = materialeArmy.filter(m => m.modul === String(modul));
                if (materialeModul.length === 0) return null;

                return (
                  <div key={modul} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-bold text-amber-400 mb-4">📖 Modul {modul}</h3>
                    <div className="space-y-4">
                      {materialeModul.map((material) => (
                        <div key={material.id} className="bg-gray-700 p-4 rounded-lg">
                          {/* Editare */}
                          {editingMaterial === material.id ? (
                            <div className="space-y-3">
                              <select
                                value={editMaterialData.modul}
                                onChange={(e) => setEditMaterialData({ ...editMaterialData, modul: e.target.value })}
                                className="w-full p-2 rounded border border-gray-600 bg-gray-600 text-white"
                              >
                                <option value="1">Modul 1</option>
                                <option value="2">Modul 2</option>
                                <option value="3">Modul 3</option>
                                <option value="4">Modul 4</option>
                                <option value="5">Modul 5</option>
                                <option value="6">Modul 6</option>
                              </select>
                              <textarea
                                value={editMaterialData.nota}
                                onChange={(e) => setEditMaterialData({ ...editMaterialData, nota: e.target.value })}
                                className="w-full p-2 rounded border border-gray-600 bg-gray-600 text-white"
                                rows={4}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateMaterial(material.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                  disabled={loadingMateriale}
                                >
                                  {loadingMateriale ? "Se salvează..." : "✅ Salvează"}
                                </button>
                                <button
                                  onClick={() => setEditingMaterial(null)}
                                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  ❌ Anulează
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-gray-300 whitespace-pre-wrap mb-3">{material.nota}</p>
                              {material.imagine && (
                                <img
                                  src={material.imagine.url}
                                  alt="Material"
                                  className="w-full max-h-96 object-contain rounded border border-gray-600 mb-3"
                                />
                              )}
                              <p className="text-gray-500 text-xs mb-3">
                                Adăugat de {material.autor} • {formatDate(material.timestamp)}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingMaterial(material.id);
                                    setEditMaterialData({
                                      nota: material.nota,
                                      modul: material.modul
                                    });
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  ✏️ Editează
                                </button>
                                <button
                                  onClick={() => handleDeleteMaterial(material.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                  disabled={loadingMateriale}
                                >
                                  🗑️ Șterge
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Ora Lumânare 4H (Tranzacționare)
                  </label>
                  <select
                    value={newCursant.oraLumanare}
                    onChange={(e) => setNewCursant({ ...newCursant, oraLumanare: e.target.value })}
                    className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
                    required
                  >
                    <option value="0:00 - 4:00">0:00 - 4:00</option>
                    <option value="4:00 - 8:00">4:00 - 8:00</option>
                    <option value="8:00 - 12:00">8:00 - 12:00</option>
                    <option value="12:00 - 16:00">12:00 - 16:00</option>
                    <option value="16:00 - 20:00">16:00 - 20:00</option>
                    <option value="20:00 - 24:00">20:00 - 24:00</option>
                  </select>
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
                              <select
                                value={editFormData.oraLumanare}
                                onChange={(e) => setEditFormData({ ...editFormData, oraLumanare: e.target.value })}
                                className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white text-center"
                              >
                                <option value="0:00 - 4:00">0:00 - 4:00</option>
                                <option value="4:00 - 8:00">4:00 - 8:00</option>
                                <option value="8:00 - 12:00">8:00 - 12:00</option>
                                <option value="12:00 - 16:00">12:00 - 16:00</option>
                                <option value="16:00 - 20:00">16:00 - 20:00</option>
                                <option value="20:00 - 24:00">20:00 - 24:00</option>
                              </select>
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
                Lista Cursanti ({armyCursanti.filter(c => c.tipParticipant !== 'Mentor').filter(c => c.nume.toLowerCase().includes(searchCursant.toLowerCase())).length})
              </h3>
              {armyCursanti.filter(c => c.tipParticipant !== 'Mentor').length > 0 && (
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
            {armyCursanti.filter(c => c.tipParticipant !== 'Mentor').length > 0 && (
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
            ) : armyCursanti.filter(c => c.tipParticipant !== 'Mentor').length === 0 ? (
              <p className="text-gray-400">Nu exista cursanti inregistrati inca.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-green-900">
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
                    {armyCursanti
                      .filter(c => c.tipParticipant !== 'Mentor')
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
                              <input
                                type="text"
                                value={editFormData.perecheValutara}
                                onChange={(e) => setEditFormData({ ...editFormData, perecheValutara: e.target.value })}
                                className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white text-center"
                              />
                            </td>
                            <td className="p-2 border border-gray-700">
                              <select
                                value={editFormData.oraLumanare}
                                onChange={(e) => setEditFormData({ ...editFormData, oraLumanare: e.target.value })}
                                className="w-full p-1 rounded border border-gray-600 bg-gray-700 text-white text-center"
                              >
                                <option value="0:00 - 4:00">0:00 - 4:00</option>
                                <option value="4:00 - 8:00">4:00 - 8:00</option>
                                <option value="8:00 - 12:00">8:00 - 12:00</option>
                                <option value="12:00 - 16:00">12:00 - 16:00</option>
                                <option value="16:00 - 20:00">16:00 - 20:00</option>
                                <option value="20:00 - 24:00">20:00 - 24:00</option>
                              </select>
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
        </div>
      )}

      {/* Secțiunea Teme Zilnice pentru Cursanți */}
      {activeTab === "army" && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-yellow-400 flex items-center gap-3">
              <span>📚</span>
              Tema Zilnică pentru Cursanți
            </h3>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                ✍️ Conținutul Temei
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

export default Dashboard;