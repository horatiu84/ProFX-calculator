import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp, getDocs, query, orderBy, setDoc } from "firebase/firestore";
import { db } from "../FireBase.js";
import * as XLSX from "xlsx";

const formatDate = (createdAt) => {
  if (!createdAt) return "N/A";
  if (createdAt.toDate) return createdAt.toDate().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' });
  try {
    return new Date(createdAt).toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' });
  } catch {
    return "N/A";
  }
};

const MENTORI_DISPONIBILI = [
  { id: 'sergiu', nume: 'Sergiu' },
  { id: 'eli', nume: 'Eli' },
  { id: 'dan', nume: 'Dan' },
  { id: 'tudor', nume: 'Tudor' },
  { id: 'adrian', nume: 'Adrian' }
];

// Constante pentru status leaduri
const LEAD_STATUS = {
  NEALOCAT: 'nealocat',
  ALOCAT: 'alocat',
  CONFIRMAT: 'confirmat',
  NECONFIRMAT: 'neconfirmat',
  NO_SHOW: 'no_show',
  COMPLET: 'complet'
};

// Constante pentru sesiune 1:20
const ONE_TO_TWENTY_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  NO_SHOW: 'no_show',
  COMPLETED: 'completed'
};

// Timeout 6 ore pentru confirmare (în milisecunde)
const TIMEOUT_6H = 6 * 60 * 60 * 1000;

// === FUNCȚII HELPER PENTRU TIMEOUT (PREGĂTITE PENTRU FIREBASE FUNCTIONS) ===

/**
 * Verifică dacă un lead a depășit timeout-ul de 6h fără confirmare
 * Această funcție va fi mutată în Firebase Function în viitor
 */
const checkLeadTimeout = (lead) => {
  if (lead.status !== LEAD_STATUS.ALOCAT) return false;
  if (!lead.dataAlocare) return false;
  
  const dataAlocare = lead.dataAlocare.toDate ? lead.dataAlocare.toDate() : new Date(lead.dataAlocare);
  const now = new Date();
  const timeDiff = now - dataAlocare;
  
  return timeDiff >= TIMEOUT_6H;
};

/**
 * Calculează timpul rămas până la timeout (în minute)
 */
const getTimeUntilTimeout = (lead) => {
  if (!lead.dataAlocare) return null;
  
  const dataAlocare = lead.dataAlocare.toDate ? lead.dataAlocare.toDate() : new Date(lead.dataAlocare);
  const timeoutDate = new Date(dataAlocare.getTime() + TIMEOUT_6H);
  const now = new Date();
  const minutesLeft = Math.floor((timeoutDate - now) / (1000 * 60));
  
  return minutesLeft > 0 ? minutesLeft : 0;
};

/**
 * Formatează timpul rămas într-un string lizibil
 */
const formatTimeRemaining = (minutes) => {
  if (minutes <= 0) return 'Expirat';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const LeaduriTab = ({ clearCachedData }) => {
  const [leaduri, setLeaduri] = useState([]);
  const [mentori, setMentori] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [alocariActive, setAlocariActive] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [uploadMode, setUploadMode] = useState('excel'); // 'excel' sau 'manual'
  const [manualLead, setManualLead] = useState({ nume: '', telefon: '', email: '' });
  
  // State-uri pentru vizualizare toate leadurile
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('data-desc'); // 'nume-asc', 'nume-desc', 'data-asc', 'data-desc'
  const [currentPage, setCurrentPage] = useState(1);
  const leaduriPerPage = 10;
  
  // State-uri pentru editare lead
  const [editingLead, setEditingLead] = useState(null);
  const [editLeadData, setEditLeadData] = useState({ nume: '', telefon: '', email: '' });
  
  // State-uri pentru update 1:20 manual
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedMentorForDate, setSelectedMentorForDate] = useState(null);
  const [manualDate, setManualDate] = useState('');

  // Fetch mentori la încărcare
  useEffect(() => {
    fetchMentori();
    fetchLeaduri();
    fetchAlocari();
  }, []);

  const fetchMentori = async () => {
    try {
      const mentoriSnapshot = await getDocs(collection(db, "mentori"));
      const mentoriData = mentoriSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Dacă nu există mentori, creează-i
      if (mentoriData.length === 0) {
        await initializeMentori();
      } else {
        // Verifică și actualizează automat statusul mentorilor în funcție de leaduri
        for (const mentor of mentoriData) {
          const trebuieDeactivat = (mentor.leaduriAlocate || 0) >= 20;
          if (mentor.available && trebuieDeactivat) {
            // Dezactivează automat mentorii cu 20+ leaduri
            await updateDoc(doc(db, "mentori", mentor.id), {
              available: false
            });
          }
        }
        
        // Re-fetch pentru a obține datele actualizate
        const updatedSnapshot = await getDocs(collection(db, "mentori"));
        const updatedData = updatedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMentori(updatedData);
      }
    } catch (err) {
      console.error("Eroare fetch mentori:", err);
    }
  };

  const initializeMentori = async () => {
    try {
      const mentoriInitializati = [];
      for (let i = 0; i < MENTORI_DISPONIBILI.length; i++) {
        const mentor = MENTORI_DISPONIBILI[i];
        // Folosim ID-ul din configurare pentru a avea ID-uri fixe
        await setDoc(doc(db, "mentori", mentor.id), {
          nume: mentor.nume,
          available: true,
          ultimulOneToTwenty: null,
          ordineCoada: i,
          leaduriAlocate: 0,
          createdAt: Timestamp.now()
        });
        mentoriInitializati.push({
          id: mentor.id,
          nume: mentor.nume,
          available: true,
          ultimulOneToTwenty: null,
          ordineCoada: i,
          leaduriAlocate: 0
        });
      }
      setMentori(mentoriInitializati);
      setSuccess("Mentori inițializați cu succes!");
    } catch (err) {
      console.error("Eroare inițializare mentori:", err);
      setError("Eroare la inițializarea mentorilor");
    }
  };

  const fetchLeaduri = async () => {
    try {
      const leaduriSnapshot = await getDocs(
        query(collection(db, "leaduri"), orderBy("createdAt", "desc"))
      );
      const leaduriData = leaduriSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // === VERIFICARE AUTOMATĂ TIMEOUT (VA FI MUTATĂ ÎN FIREBASE FUNCTION) ===
      // Verifică leadurile care au depășit timeout-ul de 6h fără confirmare
      let leaduriExpirate = 0;
      for (const lead of leaduriData) {
        if (checkLeadTimeout(lead)) {
          leaduriExpirate++;
          // Marchează leadul ca neconfirmat și pregătește pentru re-alocare
          await updateDoc(doc(db, "leaduri", lead.id), {
            status: LEAD_STATUS.NECONFIRMAT,
            motivNeconfirmare: 'Timeout 6h - fără confirmare de la mentor',
            dataTimeout: Timestamp.now()
          });
        }
      }
      
      if (leaduriExpirate > 0) {
        console.log(`⏰ ${leaduriExpirate} leaduri au depășit timeout-ul de 6h`);
        // Re-fetch pentru a obține datele actualizate
        const updatedSnapshot = await getDocs(
          query(collection(db, "leaduri"), orderBy("createdAt", "desc"))
        );
        const updatedData = updatedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeaduri(updatedData);
      } else {
        setLeaduri(leaduriData);
      }
    } catch (err) {
      console.error("Eroare fetch leaduri:", err);
      setError("Eroare la încărcarea leadurilor");
    }
  };

  const fetchAlocari = async () => {
    try {
      const alocariSnapshot = await getDocs(collection(db, "alocari"));
      const alocariData = alocariSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlocariActive(alocariData);
    } catch (err) {
      console.error("Eroare fetch alocări:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!validTypes.includes(file.type)) {
        setError("Te rog încarcă un fișier Excel (.xlsx, .xls) sau CSV");
        return;
      }
      
      setUploadFile(file);
      setError("");
    }
  };

  const parseExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          // Validare și transformare date
          const leaduriValide = jsonData.map((row, index) => {
            const nume = row['Nume'] || row['nume'] || row['Name'] || row['name'] || '';
            const telefon = row['Telefon'] || row['telefon'] || row['Phone'] || row['phone'] || '';
            const email = row['Email'] || row['email'] || '';
            
            if (!nume || !telefon || !email) {
              throw new Error(`Linia ${index + 2}: Nume, telefon și email sunt obligatorii`);
            }
            
            return {
              nume: String(nume).trim(),
              telefon: String(telefon).trim(),
              email: String(email).trim(),
              status: LEAD_STATUS.NEALOCAT,
              mentorAlocat: null,
              dataAlocare: null,
              dataConfirmare: null,
              dataTimeout: null,
              statusOneToTwenty: ONE_TO_TWENTY_STATUS.PENDING,
              dataOneToTwenty: null,
              numarReAlocari: 0,
              istoricMentori: [],
              createdAt: Timestamp.now()
            };
          });
          
          resolve(leaduriValide);
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = () => reject(new Error("Eroare la citirea fișierului"));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUploadLeaduri = async () => {
    if (!uploadFile) {
      setError("Te rog selectează un fișier");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const leaduriNoi = await parseExcelFile(uploadFile);
      
      // Adaugă leadurile în Firebase
      for (const lead of leaduriNoi) {
        await addDoc(collection(db, "leaduri"), lead);
      }

      setSuccess(`${leaduriNoi.length} leaduri încărcate cu succes!`);
      setUploadFile(null);
      setShowUploadForm(false);
      await fetchLeaduri();
      
      // Clear cache
      if (clearCachedData) {
        clearCachedData('leaduri');
      }
    } catch (err) {
      console.error("Eroare upload:", err);
      setError(err.message || "Eroare la încărcarea leadurilor");
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualLead = async (e) => {
    e.preventDefault();
    
    if (!manualLead.nume || !manualLead.telefon || !manualLead.email) {
      setError("Numele, telefonul și email-ul sunt obligatorii");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await addDoc(collection(db, "leaduri"), {
        nume: manualLead.nume.trim(),
        telefon: manualLead.telefon.trim(),
        email: manualLead.email.trim(),
        status: LEAD_STATUS.NEALOCAT,
        mentorAlocat: null,
        dataAlocare: null,
        dataConfirmare: null,
        dataTimeout: null,
        statusOneToTwenty: ONE_TO_TWENTY_STATUS.PENDING,
        dataOneToTwenty: null,
        numarReAlocari: 0,
        istoricMentori: [],
        createdAt: Timestamp.now()
      });

      setSuccess(`Lead "${manualLead.nume}" adăugat cu succes!`);
      setManualLead({ nume: '', telefon: '', email: '' });
      await fetchLeaduri();
      
      if (clearCachedData) {
        clearCachedData('leaduri');
      }
    } catch (err) {
      console.error("Eroare adăugare lead:", err);
      setError("Eroare la adăugarea leadului");
    } finally {
      setLoading(false);
    }
  };

  const alocaLeaduriAutomata = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Filtrează leadurile nealocate
      const leaduriNealocate = leaduri.filter(lead => lead.status === LEAD_STATUS.NEALOCAT);
      
      if (leaduriNealocate.length < 20) {
        setError(`Sunt disponibile doar ${leaduriNealocate.length} leaduri. Minimul necesar este 20 pentru alocare.`);
        setLoading(false);
        return;
      }

      // Sortează mentorii după ordineCoada și disponibilitate
      const mentoriDisponibili = mentori
        .filter(m => m.available)
        .sort((a, b) => a.ordineCoada - b.ordineCoada);

      if (mentoriDisponibili.length === 0) {
        setError("Nu există mentori disponibili pentru alocare");
        setLoading(false);
        return;
      }

      let leaduriProcesate = 0;
      let indexMentor = 0;
      const alocariNoi = [];

      while (leaduriProcesate < leaduriNealocate.length) {
        const leaduriRamase = leaduriNealocate.length - leaduriProcesate;
        
        // Dacă rămân mai puțin de 20, nu aloca
        if (leaduriRamase < 20) {
          break;
        }

        const mentorCurent = mentoriDisponibili[indexMentor % mentoriDisponibili.length];
        
        // Aloca între 20-30 leaduri (max 30 conform schemei)
        const numarAlocare = Math.min(30, leaduriRamase);
        const leaduriDeSters = leaduriNealocate.slice(leaduriProcesate, leaduriProcesate + numarAlocare);

        // Creează o alocare
        const alocareRef = await addDoc(collection(db, "alocari"), {
          mentorId: mentorCurent.id,
          mentorNume: mentorCurent.nume,
          numarLeaduri: numarAlocare,
          leaduri: leaduriDeSters.map(l => l.id),
          createdAt: Timestamp.now(),
          status: 'activa'
        });

        const dataAlocare = Timestamp.now();
        const dataAlocareDate = dataAlocare.toDate();
        const dataTimeoutDate = new Date(dataAlocareDate.getTime() + TIMEOUT_6H);
        const dataTimeout = Timestamp.fromDate(dataTimeoutDate);

        // Actualizează statusul leadurilor cu noua structură
        for (const lead of leaduriDeSters) {
          const updatedIstoric = [...(lead.istoricMentori || []), mentorCurent.id];
          
          await updateDoc(doc(db, "leaduri", lead.id), {
            status: LEAD_STATUS.ALOCAT,
            mentorAlocat: mentorCurent.id,
            alocareId: alocareRef.id,
            dataAlocare: dataAlocare,
            dataTimeout: dataTimeout,
            istoricMentori: updatedIstoric,
            numarReAlocari: (lead.numarReAlocari || 0)
          });
        }

        // Actualizează ordineCoada pentru mentor (îl pune la coadă) și îl dezactivează
        await updateDoc(doc(db, "mentori", mentorCurent.id), {
          ordineCoada: mentoriDisponibili.length + indexMentor,
          leaduriAlocate: (mentorCurent.leaduriAlocate || 0) + numarAlocare,
          available: false // Dezactivează mentorul automat după ce primește leaduri (busy)
        });

        alocariNoi.push({
          mentor: mentorCurent.nume,
          leaduri: numarAlocare
        });

        leaduriProcesate += numarAlocare;
        indexMentor++;
      }

      await fetchLeaduri();
      await fetchMentori();
      await fetchAlocari();

      const mesajSuccess = alocariNoi.map(a => 
        `${a.mentor}: ${a.leaduri} leaduri`
      ).join(', ');
      
      setSuccess(`Alocate cu succes! ${mesajSuccess}. Leaduri nealocate: ${leaduriNealocate.length - leaduriProcesate}`);
      
      if (clearCachedData) {
        clearCachedData('leaduri');
        clearCachedData('mentori');
        clearCachedData('alocari');
      }
    } catch (err) {
      console.error("Eroare alocare:", err);
      setError("Eroare la alocarea automată a leadurilor");
    } finally {
      setLoading(false);
    }
  };

  const toggleMentorAvailability = async (mentorId, currentStatus) => {
    try {
      await updateDoc(doc(db, "mentori", mentorId), {
        available: !currentStatus
      });
      await fetchMentori();
      setSuccess("Status mentor actualizat!");
    } catch (err) {
      console.error("Eroare update mentor:", err);
      setError("Eroare la actualizarea statusului");
    }
  };

  const updateOneToTwenty = async (mentorId, customDate) => {
    try {
      let dateToUse;
      if (customDate) {
        // Convertește data manuală în Timestamp Firebase
        dateToUse = Timestamp.fromDate(new Date(customDate));
      } else {
        dateToUse = Timestamp.now();
      }
      
      await updateDoc(doc(db, "mentori", mentorId), {
        ultimulOneToTwenty: dateToUse
      });
      await fetchMentori();
      setSuccess("Dată 1:20 actualizată!");
      setShowDateModal(false);
      setSelectedMentorForDate(null);
      setManualDate('');
    } catch (err) {
      console.error("Eroare update 1:20:", err);
      setError("Eroare la actualizarea datei 1:20");
    }
  };
  
  const openDateModal = (mentorId) => {
    setSelectedMentorForDate(mentorId);
    // Setează data curentă ca valoare implicită
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    setManualDate(dateString);
    setShowDateModal(true);
  };
  
  const handleConfirmDate = () => {
    if (!manualDate) {
      setError("Te rog selectează o dată!");
      return;
    }
    updateOneToTwenty(selectedMentorForDate, manualDate);
  };

  // === FUNCȚII PENTRU GESTIONAREA STATUSURILOR LEADURILOR ===

  /**
   * Confirmă că leadul participă la sesiunea 1:20
   * Această funcție va fi apelată de mentor după contactarea leadului
   */
  const handleConfirmLead = async (leadId) => {
    if (!confirm("Confirmă că acest lead participă la sesiunea 1:20?")) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, "leaduri", leadId), {
        status: LEAD_STATUS.CONFIRMAT,
        dataConfirmare: Timestamp.now(),
        statusOneToTwenty: ONE_TO_TWENTY_STATUS.CONFIRMED
      });
      
      await fetchLeaduri();
      setSuccess("Lead confirmat cu succes!");
      
      if (clearCachedData) {
        clearCachedData('leaduri');
      }
    } catch (err) {
      console.error("Eroare confirmare lead:", err);
      setError("Eroare la confirmarea leadului");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Marchează leadul ca refuzat/neconfirmat
   */
  const handleRejectLead = async (leadId) => {
    const motiv = prompt("Motiv refuz (opțional):");
    
    setLoading(true);
    try {
      await updateDoc(doc(db, "leaduri", leadId), {
        status: LEAD_STATUS.NECONFIRMAT,
        dataConfirmare: Timestamp.now(),
        motivNeconfirmare: motiv || 'Lead-ul a refuzat sau nu răspunde'
      });
      
      await fetchLeaduri();
      setSuccess("Lead marcat ca neconfirmat. Poate fi re-alocat.");
      
      if (clearCachedData) {
        clearCachedData('leaduri');
      }
    } catch (err) {
      console.error("Eroare refuz lead:", err);
      setError("Eroare la marcarea leadului");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Marchează leadul ca NO-SHOW (nu s-a prezentat la sesiune)
   */
  const handleNoShowLead = async (leadId) => {
    if (!confirm("Marchează acest lead ca NO-SHOW (nu s-a prezentat)?")) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, "leaduri", leadId), {
        status: LEAD_STATUS.NO_SHOW,
        statusOneToTwenty: ONE_TO_TWENTY_STATUS.NO_SHOW,
        dataOneToTwenty: Timestamp.now()
      });
      
      await fetchLeaduri();
      setSuccess("Lead marcat ca NO-SHOW. Poate fi re-alocat.");
      
      if (clearCachedData) {
        clearCachedData('leaduri');
      }
    } catch (err) {
      console.error("Eroare no-show lead:", err);
      setError("Eroare la marcarea leadului");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Marchează leadul ca COMPLET (sesiunea 1:20 finalizată cu succes)
   */
  const handleCompleteLead = async (leadId) => {
    if (!confirm("Marchează sesiunea 1:20 ca finalizată cu succes?")) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, "leaduri", leadId), {
        status: LEAD_STATUS.COMPLET,
        statusOneToTwenty: ONE_TO_TWENTY_STATUS.COMPLETED,
        dataOneToTwenty: Timestamp.now()
      });
      
      await fetchLeaduri();
      setSuccess("Lead marcat ca finalizat cu succes! 🎉");
      
      if (clearCachedData) {
        clearCachedData('leaduri');
      }
    } catch (err) {
      console.error("Eroare completare lead:", err);
      setError("Eroare la marcarea leadului");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Re-alocă un lead neconfirmat/no_show către alt mentor disponibil
   * Această funcție va fi mutată în Firebase Function pentru re-alocare automată
   */
  const handleReallocateLead = async (leadId) => {
    if (!confirm("Re-alocă acest lead către alt mentor disponibil?")) return;
    
    setLoading(true);
    try {
      const lead = leaduri.find(l => l.id === leadId);
      if (!lead) {
        setError("Lead nu a fost găsit");
        return;
      }

      // Găsește un mentor disponibil (exclude mentorul curent dacă există)
      const mentoriDisponibili = mentori
        .filter(m => m.available && m.id !== lead.mentorAlocat)
        .sort((a, b) => a.ordineCoada - b.ordineCoada);

      if (mentoriDisponibili.length === 0) {
        setError("Nu există mentori disponibili pentru re-alocare");
        setLoading(false);
        return;
      }

      const mentorNou = mentoriDisponibili[0];
      const dataAlocare = Timestamp.now();
      const dataAlocareDate = dataAlocare.toDate();
      const dataTimeoutDate = new Date(dataAlocareDate.getTime() + TIMEOUT_6H);
      const dataTimeout = Timestamp.fromDate(dataTimeoutDate);

      // Actualizează leadul cu noul mentor
      await updateDoc(doc(db, "leaduri", leadId), {
        status: LEAD_STATUS.ALOCAT,
        mentorAlocat: mentorNou.id,
        dataAlocare: dataAlocare,
        dataTimeout: dataTimeout,
        dataConfirmare: null,
        numarReAlocari: (lead.numarReAlocari || 0) + 1,
        istoricMentori: [...(lead.istoricMentori || []), mentorNou.id]
      });

      // Actualizează mentorul
      await updateDoc(doc(db, "mentori", mentorNou.id), {
        leaduriAlocate: (mentorNou.leaduriAlocate || 0) + 1
      });

      await fetchLeaduri();
      await fetchMentori();
      
      setSuccess(`Lead re-alocat către ${mentorNou.nume} cu succes!`);
      
      if (clearCachedData) {
        clearCachedData('leaduri');
        clearCachedData('mentori');
      }
    } catch (err) {
      console.error("Eroare re-alocare lead:", err);
      setError("Eroare la re-alocarea leadului");
    } finally {
      setLoading(false);
    }
  };

  const stergeLeaduri = async () => {
    if (!confirm("Ești sigur că vrei să ștergi TOATE leadurile? Această acțiune este permanentă!")) {
      return;
    }

    setLoading(true);
    try {
      // Șterge toate leadurile
      for (const lead of leaduri) {
        await deleteDoc(doc(db, "leaduri", lead.id));
      }
      
      // Șterge toate alocările
      for (const alocare of alocariActive) {
        await deleteDoc(doc(db, "alocari", alocare.id));
      }
      
      // Resetează mentorii (leaduri la 0 și reactivează-i)
      for (const mentor of mentori) {        await updateDoc(doc(db, "mentori", mentor.id), {
          leaduriAlocate: 0,
          available: true
        });
      }
      
      await fetchLeaduri();
      await fetchAlocari();
      await fetchMentori();
      
      setSuccess("Toate leadurile, alocările au fost șterse și mentorii au fost resetați!");
      
      if (clearCachedData) {
        clearCachedData('leaduri');
        clearCachedData('alocari');
        clearCachedData('mentori');
      }
    } catch (err) {
      console.error("Eroare ștergere:", err);
      setError("Eroare la ștergerea leadurilor");
    } finally {
      setLoading(false);
    }
  };

  const stergeLaeduriMentor = async (alocare) => {
    if (!confirm(`Ești sigur că vrei să ștergi toate cele ${alocare.numarLeaduri} leaduri ale mentorului ${alocare.mentorNume}?`)) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Șterge leadurile din această alocare
      const leaduriDeSters = leaduri.filter(lead => alocare.leaduri.includes(lead.id));
      for (const lead of leaduriDeSters) {
        await deleteDoc(doc(db, "leaduri", lead.id));
      }
      
      // Șterge alocarea
      await deleteDoc(doc(db, "alocari", alocare.id));
      
      // Actualizează mentorul - resetează leadurile și reactivează
      const mentor = mentori.find(m => m.id === alocare.mentorId);
      if (mentor) {
        await updateDoc(doc(db, "mentori", alocare.mentorId), {
          leaduriAlocate: Math.max(0, (mentor.leaduriAlocate || 0) - alocare.numarLeaduri),
          available: true
        });
      }
      
      await fetchLeaduri();
      await fetchAlocari();
      await fetchMentori();
      
      setSuccess(`Leadurile mentorului ${alocare.mentorNume} au fost șterse cu succes!`);
      
      if (clearCachedData) {
        clearCachedData('leaduri');
        clearCachedData('alocari');
        clearCachedData('mentori');
      }
    } catch (err) {
      console.error("Eroare ștergere leaduri mentor:", err);
      setError("Eroare la ștergerea leadurilor mentorului");
    } finally {
      setLoading(false);
    }
  };

  const resetMentori = async () => {
    if (!confirm("Ești sigur că vrei să resetezi coada mentorilor? Ordinea va fi resetată la: Sergiu, Eli, Dan, Tudor, Adrian")) {
      return;
    }

    try {
      // Resetează ordinea conform constantei MENTORI_DISPONIBILI
      for (let i = 0; i < MENTORI_DISPONIBILI.length; i++) {
        const mentorId = MENTORI_DISPONIBILI[i].id;
        const mentorExistent = mentori.find(m => m.id === mentorId);
        
        if (mentorExistent) {
          await updateDoc(doc(db, "mentori", mentorId), {
            ordineCoada: i,
            leaduriAlocate: 0,
            available: true // Reactivează toți mentorii la reset
          });
        }
      }
      await fetchMentori();
      setSuccess("Coada mentorilor a fost resetată la ordinea: Sergiu, Eli, Dan, Tudor, Adrian!");
    } catch (err) {
      console.error("Eroare reset:", err);
      setError("Eroare la resetarea mentorilor");
    }
  };

  const stergeMentoriDuplicati = async () => {
    if (!confirm("Ești sigur că vrei să ștergi TOȚI mentorii duplicați? Vor rămâne doar cei 5 mentori originali.")) {
      return;
    }

    setLoading(true);
    try {
      // Șterge toți mentorii
      for (const mentor of mentori) {
        await deleteDoc(doc(db, "mentori", mentor.id));
      }

      // Reinițializează cei 5 mentori
      await initializeMentori();
      await fetchMentori();
      
      setSuccess("Mentorii duplicați au fost șterși! Au fost recreați cei 5 mentori originali.");
      if (clearCachedData) {
        clearCachedData('mentori');
      }
    } catch (err) {
      console.error("Eroare ștergere duplicați:", err);
      setError("Eroare la ștergerea mentorilor duplicați");
    } finally {
      setLoading(false);
    }
  };

  const leaduriNealocate = leaduri.filter(l => l.status === LEAD_STATUS.NEALOCAT).length;
  const leaduriAlocate = leaduri.filter(l => l.status === LEAD_STATUS.ALOCAT).length;
  const leaduriConfirmate = leaduri.filter(l => l.status === LEAD_STATUS.CONFIRMAT).length;
  const leaduriNeconfirmate = leaduri.filter(l => l.status === LEAD_STATUS.NECONFIRMAT).length;
  const leaduriNoShow = leaduri.filter(l => l.status === LEAD_STATUS.NO_SHOW).length;
  const leaduriComplete = leaduri.filter(l => l.status === LEAD_STATUS.COMPLET).length;

  // Filtrare și sortare leaduri
  const leaduriFiltrate = leaduri.filter(lead => 
    lead.nume?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.telefon?.includes(searchQuery) ||
    lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const leaduriSortate = [...leaduriFiltrate].sort((a, b) => {
    if (sortBy === 'nume-asc') {
      return (a.nume || '').localeCompare(b.nume || '');
    } else if (sortBy === 'nume-desc') {
      return (b.nume || '').localeCompare(a.nume || '');
    } else if (sortBy === 'data-asc') {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateA - dateB;
    } else { // 'data-desc'
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    }
  });

  // Paginare
  const totalPages = Math.ceil(leaduriSortate.length / leaduriPerPage);
  const indexOfLastLead = currentPage * leaduriPerPage;
  const indexOfFirstLead = indexOfLastLead - leaduriPerPage;
  const leaduriCurente = leaduriSortate.slice(indexOfFirstLead, indexOfLastLead);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead.id);
    setEditLeadData({
      nume: lead.nume,
      telefon: lead.telefon,
      email: lead.email
    });
  };

  const handleSaveEditLead = async (leadId) => {
    if (!editLeadData.nume || !editLeadData.telefon || !editLeadData.email) {
      setError("Toate câmpurile sunt obligatorii");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateDoc(doc(db, "leaduri", leadId), {
        nume: editLeadData.nume.trim(),
        telefon: editLeadData.telefon.trim(),
        email: editLeadData.email.trim()
      });

      setSuccess("Lead actualizat cu succes!");
      setEditingLead(null);
      await fetchLeaduri();

      if (clearCachedData) {
        clearCachedData('leaduri');
      }
    } catch (err) {
      console.error("Eroare editare lead:", err);
      setError("Eroare la actualizarea leadului");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingLead(null);
    setEditLeadData({ nume: '', telefon: '', email: '' });
  };

  const handleDeleteLead = async (lead) => {
    if (!confirm(`Ești sigur că vrei să ștergi leadul "${lead.nume}"?`)) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Șterge leadul
      await deleteDoc(doc(db, "leaduri", lead.id));

      // Dacă leadul era alocat, actualizează mentorul și alocarea
      if (lead.status === 'alocat' && lead.mentorAlocat) {
        const mentor = mentori.find(m => m.id === lead.mentorAlocat);
        if (mentor) {
          await updateDoc(doc(db, "mentori", lead.mentorAlocat), {
            leaduriAlocate: Math.max(0, (mentor.leaduriAlocate || 0) - 1)
          });
        }

        // Actualizează alocarea
        if (lead.alocareId) {
          const alocare = alocariActive.find(a => a.id === lead.alocareId);
          if (alocare) {
            const leaduriRamase = alocare.leaduri.filter(id => id !== lead.id);
            if (leaduriRamase.length === 0) {
              // Șterge alocarea dacă nu mai are leaduri
              await deleteDoc(doc(db, "alocari", lead.alocareId));
            } else {
              // Actualizează alocarea
              await updateDoc(doc(db, "alocari", lead.alocareId), {
                leaduri: leaduriRamase,
                numarLeaduri: leaduriRamase.length
              });
            }
          }
        }
      }

      setSuccess(`Lead "${lead.nume}" șters cu succes!`);
      await fetchLeaduri();
      await fetchMentori();
      await fetchAlocari();

      if (clearCachedData) {
        clearCachedData('leaduri');
        clearCachedData('mentori');
        clearCachedData('alocari');
      }
    } catch (err) {
      console.error("Eroare ștergere lead:", err);
      setError("Eroare la ștergerea leadului");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-400 mb-4">
        📊 Gestionare Leaduri
      </h2>

      {/* Header cu statistici extinse */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-blue-300 mb-4">📊 Statistici Generale</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-300 mb-1">Total</p>
            <p className="text-3xl font-bold text-blue-400">{leaduri.length}</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-300 mb-1">⏳ Nealocate</p>
            <p className="text-3xl font-bold text-yellow-400">{leaduriNealocate}</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-300 mb-1">🎯 Alocate</p>
            <p className="text-3xl font-bold text-blue-400">{leaduriAlocate}</p>
          </div>
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
            <p className="text-sm text-green-300 mb-1">✅ Confirmate</p>
            <p className="text-3xl font-bold text-green-400">{leaduriConfirmate}</p>
          </div>
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
            <p className="text-sm text-red-300 mb-1">❌ Neconfirmate</p>
            <p className="text-3xl font-bold text-red-400">{leaduriNeconfirmate}</p>
          </div>
          <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 text-center">
            <p className="text-sm text-purple-300 mb-1">🏆 Complete</p>
            <p className="text-3xl font-bold text-purple-400">{leaduriComplete}</p>
          </div>
        </div>
        
        {/* Statistici secundare */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-300 mb-1">👻 No-Show</p>
                <p className="text-2xl font-bold text-orange-400">{leaduriNoShow}</p>
              </div>
              <span className="text-4xl">👻</span>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">📈 Rată conversie</p>
                <p className="text-2xl font-bold text-blue-400">
                  {leaduri.length > 0 ? Math.round((leaduriComplete / leaduri.length) * 100) : 0}%
                </p>
              </div>
              <span className="text-4xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mesaje succes/eroare */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError("")}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      {/* Secțiunea Mentori */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-300">👥 Mentori ({mentori.length})</h3>
          <div className="flex gap-2">
            {mentori.length > 5 && (
              <button
                onClick={stergeMentoriDuplicati}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                🗑️ Șterge Duplicați
              </button>
            )}
            <button
              onClick={resetMentori}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              🔄 Reset
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {mentori
            .sort((a, b) => {
              // Sortează după ordinea din MENTORI_DISPONIBILI folosind numele
              const orderA = MENTORI_DISPONIBILI.findIndex(m => 
                m.id.toLowerCase() === a.id.toLowerCase() || 
                m.nume.toLowerCase() === (a.nume || '').toLowerCase()
              );
              const orderB = MENTORI_DISPONIBILI.findIndex(m => 
                m.id.toLowerCase() === b.id.toLowerCase() || 
                m.nume.toLowerCase() === (b.nume || '').toLowerCase()
              );
              
              // Dacă nu se găsesc, pune-i la final
              const finalOrderA = orderA === -1 ? 999 : orderA;
              const finalOrderB = orderB === -1 ? 999 : orderB;
              
              return finalOrderA - finalOrderB;
            })
            .map((mentor, index) => (
            <div
              key={mentor.id}
              className={`border-2 rounded-lg p-4 transition-all ${
                mentor.available
                  ? 'border-green-500 bg-gray-700'
                  : 'border-gray-600 bg-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="mb-3 flex justify-center">
                  <img 
                    src={`/src/pics/${mentor.nume}.jpg`}
                    alt={mentor.nume} 
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-3xl" style={{display: 'none'}}>
                    👤
                  </div>
                </div>
                <h4 className="font-bold text-lg text-white">{mentor.nume || 'Mentor'}</h4>
                <p className="text-sm text-gray-300">Poziție: #{index + 1}</p>
                
                {/* Statistici leaduri per mentor */}
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-white font-bold">{mentor.leaduriAlocate || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400">Alocate:</span>
                    <span className="text-blue-400 font-bold">
                      {leaduri.filter(l => l.mentorAlocat === mentor.id && l.status === LEAD_STATUS.ALOCAT).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">Confirmate:</span>
                    <span className="text-green-400 font-bold">
                      {leaduri.filter(l => l.mentorAlocat === mentor.id && l.status === LEAD_STATUS.CONFIRMAT).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-400">Complete:</span>
                    <span className="text-purple-400 font-bold">
                      {leaduri.filter(l => l.mentorAlocat === mentor.id && l.status === LEAD_STATUS.COMPLET).length}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      mentor.available
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {mentor.available ? '✓ Available' : '✗ Busy'}
                  </span>
                </div>

                {mentor.ultimulOneToTwenty && (
                  <p className="text-xs text-gray-400 mt-2">
                    Ultima 1:20: {formatDate(mentor.ultimulOneToTwenty)}
                  </p>
                )}

                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => toggleMentorAvailability(mentor.id, mentor.available)}
                    className={`w-full px-3 py-1 rounded text-sm font-semibold transition-colors ${
                      mentor.available
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {mentor.available ? 'Dezactivează' : 'Activează'}
                  </button>
                  
                  <button
                    onClick={() => openDateModal(mentor.id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    Update 1:20
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acțiuni principale */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-blue-300 mb-4">⚡ Acțiuni</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>📤</span>
            <span>Încarcă Leaduri</span>
          </button>

          <button
            onClick={alocaLeaduriAutomata}
            disabled={loading || leaduriNealocate < 20}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              loading || leaduriNealocate < 20
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <span>🎯</span>
            <span>Alocă Automat (FIFO)</span>
          </button>

          <button
            onClick={stergeLeaduri}
            disabled={loading || leaduri.length === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              loading || leaduri.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <span>🗑️</span>
            <span>Șterge Toate</span>
          </button>
        </div>
      </div>

      {/* Form upload */}
      {showUploadForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-300">📤 Încarcă Leaduri</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setUploadMode('excel')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  uploadMode === 'excel'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📁 Excel
              </button>
              <button
                onClick={() => setUploadMode('manual')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  uploadMode === 'manual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ✍️ Manual
              </button>
            </div>
          </div>
          
          {uploadMode === 'excel' ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-700">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <span>📁</span>
                <span>Selectează Fișier Excel</span>
              </label>
              
              {uploadFile && (
                <p className="mt-4 text-sm text-gray-600">
                  Fișier selectat: <span className="font-semibold">{uploadFile.name}</span>
                </p>
              )}
            </div>

            <div className="bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">📋 Format Excel</h4>
              <p className="text-sm text-gray-300 mb-2">
                Fișierul Excel trebuie să conțină următoarele coloane:
              </p>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                <li><strong className="text-white">Nume</strong> - Numele complet al leadului (obligatoriu)</li>
                <li><strong className="text-white">Telefon</strong> - Număr de telefon (obligatoriu)</li>
                <li><strong className="text-white">Email</strong> - Adresa de email (obligatoriu)</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUploadLeaduri}
                disabled={loading || !uploadFile}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  loading || !uploadFile
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loading ? '⏳ Se încarcă...' : '✓ Încarcă Leaduri'}
              </button>
              
              <button
                onClick={() => {
                  setShowUploadForm(false);
                  setUploadFile(null);
                }}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Anulează
              </button>
            </div>
          </div>
          ) : (
          <div className="space-y-4">
            <form onSubmit={handleAddManualLead} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nume complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={manualLead.nume}
                    onChange={(e) => setManualLead({ ...manualLead, nume: e.target.value })}
                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ion Popescu"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={manualLead.telefon}
                    onChange={(e) => setManualLead({ ...manualLead, telefon: e.target.value })}
                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0712345678"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={manualLead.email}
                    onChange={(e) => setManualLead({ ...manualLead, email: e.target.value })}
                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ion@example.com"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {loading ? '⏳ Se adaugă...' : '✓ Adaugă Lead'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    setManualLead({ nume: '', telefon: '', email: '' });
                  }}
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
                >
                  Anulează
                </button>
              </div>
            </form>
          </div>
          )}
        </div>
      )}

      {/* Lista alocărilor active */}
      {alocariActive.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-blue-300 mb-4">📦 Alocări Active</h3>
          
          <div className="space-y-3">
            {alocariActive
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((alocare) => (
                <div
                  key={alocare.id}
                  className="border border-gray-700 rounded-lg p-4 bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg text-blue-300">
                        👤 {alocare.mentorNume}
                      </h4>
                      <p className="text-sm text-gray-300">
                        {alocare.numarLeaduri} leaduri alocate
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(alocare.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => stergeLaeduriMentor(alocare)}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        title="Șterge leadurile acestui mentor"
                      >
                        🗑️ Șterge
                      </button>
                      <button
                        onClick={() => setSelectedMentor(
                          selectedMentor === alocare.id ? null : alocare.id
                        )}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        {selectedMentor === alocare.id ? 'Ascunde' : 'Vezi Leaduri'}
                      </button>
                    </div>
                  </div>
                  
                  {selectedMentor === alocare.id && (
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <div className="max-h-96 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-900 sticky top-0">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Nume</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Telefon</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {leaduri
                              .filter(lead => alocare.leaduri.includes(lead.id))
                              .map(lead => (
                                <tr key={lead.id} className="hover:bg-gray-700">
                                  <td className="px-4 py-2 text-sm text-white">{lead.nume}</td>
                                  <td className="px-4 py-2 text-sm text-white">{lead.telefon}</td>
                                  <td className="px-4 py-2 text-sm text-gray-300">{lead.email || '-'}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal pentru selectare dată 1:20 */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Selectează Data 1:20</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dată:
              </label>
              <input
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleConfirmDate}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold transition-colors disabled:bg-gray-400"
              >
                Confirmă
              </button>
              <button
                onClick={() => {
                  setShowDateModal(false);
                  setSelectedMentorForDate(null);
                  setManualDate('');
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded font-semibold transition-colors"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secțiunea Toate Leadurile */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-300 mb-4">
          📊 Toate Leadurile ({leaduri.length})
        </h3>

        {/* Controale pentru căutare și sortare */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Căutare */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Caută după nume, telefon sau email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset la prima pagină
              }}
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sortare */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="data-desc">📅 Data (Nou → Vechi)</option>
              <option value="data-asc">📅 Data (Vechi → Nou)</option>
              <option value="nume-asc">🔤 Nume (A → Z)</option>
              <option value="nume-desc">🔥 Nume (Z → A)</option>
            </select>
          </div>
        </div>

        {/* Tabel leaduri */}
        {leaduri.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Nu există leaduri încărcărcate</p>
            <p className="text-sm mt-2">Apasă pe "📤 Încarcă Leaduri" pentru a adăuga leaduri</p>
          </div>
        ) : leaduriCurente.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Nu s-au găsit rezultate</p>
            <p className="text-sm mt-2">Încearcă altă căutare</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Telefon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Mentor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Data Adăugare
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {leaduriCurente.map((lead, index) => {
                    const mentor = mentori.find(m => m.id === lead.mentorAlocat);
                    const isEditing = editingLead === lead.id;
                    
                    return (
                      <tr key={lead.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {indexOfFirstLead + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editLeadData.nume}
                              onChange={(e) => setEditLeadData({ ...editLeadData, nume: e.target.value })}
                              className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            lead.nume
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editLeadData.telefon}
                              onChange={(e) => setEditLeadData({ ...editLeadData, telefon: e.target.value })}
                              className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            lead.telefon
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {isEditing ? (
                            <input
                              type="email"
                              value={editLeadData.email}
                              onChange={(e) => setEditLeadData({ ...editLeadData, email: e.target.value })}
                              className="w-full p-2 rounded bg-gray-600 text-white border border-gray-500 focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            lead.email
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full text-center ${
                              lead.status === LEAD_STATUS.NEALOCAT ? 'bg-yellow-600 text-white' :
                              lead.status === LEAD_STATUS.ALOCAT ? 'bg-blue-600 text-white' :
                              lead.status === LEAD_STATUS.CONFIRMAT ? 'bg-green-600 text-white' :
                              lead.status === LEAD_STATUS.NECONFIRMAT ? 'bg-red-600 text-white' :
                              lead.status === LEAD_STATUS.NO_SHOW ? 'bg-orange-600 text-white' :
                              lead.status === LEAD_STATUS.COMPLET ? 'bg-purple-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {lead.status === LEAD_STATUS.NEALOCAT ? '⏳ Nealocat' :
                               lead.status === LEAD_STATUS.ALOCAT ? '🎯 Alocat' :
                               lead.status === LEAD_STATUS.CONFIRMAT ? '✅ Confirmat' :
                               lead.status === LEAD_STATUS.NECONFIRMAT ? '❌ Neconfirmat' :
                               lead.status === LEAD_STATUS.NO_SHOW ? '👻 No-Show' :
                               lead.status === LEAD_STATUS.COMPLET ? '🏆 Complet' :
                               lead.status}
                            </span>
                            {lead.status === LEAD_STATUS.ALOCAT && lead.dataAlocare && (
                              <span className="text-xs text-gray-400">
                                ⏰ {formatTimeRemaining(getTimeUntilTimeout(lead))}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {mentor ? mentor.nume : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveEditLead(lead.id)}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors disabled:bg-gray-400"
                              >
                                ✓ Salvează
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                              >
                                ✕ Anulează
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {/* Acțiuni bazate pe status */}
                              {lead.status === LEAD_STATUS.ALOCAT && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleConfirmLead(lead.id)}
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-semibold transition-colors disabled:bg-gray-400"
                                    title="Confirmă participare"
                                  >
                                    ✅ Confirmă
                                  </button>
                                  <button
                                    onClick={() => handleRejectLead(lead.id)}
                                    disabled={loading}
                                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-semibold transition-colors disabled:bg-gray-400"
                                    title="Refuză / Nu răspunde"
                                  >
                                    ❌ Refuză
                                  </button>
                                </div>
                              )}
                              
                              {lead.status === LEAD_STATUS.CONFIRMAT && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleCompleteLead(lead.id)}
                                    disabled={loading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-semibold transition-colors disabled:bg-gray-400"
                                    title="Sesiune finalizată"
                                  >
                                    🏆 Complet
                                  </button>
                                  <button
                                    onClick={() => handleNoShowLead(lead.id)}
                                    disabled={loading}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs font-semibold transition-colors disabled:bg-gray-400"
                                    title="Nu s-a prezentat"
                                  >
                                    👻 No-Show
                                  </button>
                                </div>
                              )}
                              
                              {(lead.status === LEAD_STATUS.NECONFIRMAT || lead.status === LEAD_STATUS.NO_SHOW) && (
                                <button
                                  onClick={() => handleReallocateLead(lead.id)}
                                  disabled={loading}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold transition-colors disabled:bg-gray-400"
                                  title="Re-alocă către alt mentor"
                                >
                                  🔄 Re-alocă
                                </button>
                              )}
                              
                              {/* Acțiuni generale */}
                              <div className="flex gap-1 mt-1 pt-1 border-t border-gray-600">
                                <button
                                  onClick={() => handleEditLead(lead)}
                                  disabled={loading}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold transition-colors disabled:bg-gray-400"
                                  title="Editează lead"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead)}
                                  disabled={loading}
                                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-semibold transition-colors disabled:bg-gray-400"
                                  title="Șterge lead"
                                >
                                  🗑️ Șterge
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginare */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Afișez {indexOfFirstLead + 1} - {Math.min(indexOfLastLead, leaduriSortate.length)} din {leaduriSortate.length} leaduri
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    ← Anterior
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Afișează doar paginile relevante
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                              currentPage === pageNumber
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className="px-2 py-2 text-gray-500">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Următor →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeaduriTab;
