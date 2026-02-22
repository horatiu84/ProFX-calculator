import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "./contexts/LanguageContext";
import { User, LogOut, Loader, Book, Upload, ChevronRight, FileText, MessageSquare, Eye, X, Image as ImageIcon, ZoomIn, ZoomOut, Info } from "lucide-react";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./db/FireBase.js";
import Biblia from "./Biblia.jsx";
import ArmyUpload from "./ArmyUpload.jsx";
import MaterialeArmy from "./MaterialeArmy.jsx";
import ArmyFeedback from "./ArmyFeedback.jsx";
import { uploadScreenshotToCloudinary } from "./ArmyUpload.jsx";

// Component pentru rândul din tabel cu expandare
const QuestionRow = ({ question, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const questionImages = Array.isArray(question.images)
    ? question.images
    : question.image
      ? [question.image]
      : [];

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '-';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString(language === 'ro' ? 'ro-RO' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  useEffect(() => {
    setIsZoomed(false);
  }, [enlargedImage]);

  return (
    <>
      <tr className="hover:bg-gray-800/30 transition-colors">
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            question.status === 'resolved'
              ? 'bg-green-900/50 text-green-300 border border-green-700'
              : 'bg-red-900/50 text-red-300 border border-red-700'
          }`}>
            {question.status === 'resolved' 
              ? (language === 'ro' ? '✓ REZOLVAT' : '✓ RESOLVED')
              : (language === 'ro' ? '⏳ ÎN AȘTEPTARE' : '⏳ PENDING')}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-gray-300">{formatDateTime(question.createdAt)}</span>
        </td>
        <td className="px-4 py-3">
          <div className="text-sm text-white">{truncateText(question.question)}</div>
          {questionImages.length > 0 && (
            <span className="text-xs text-amber-400 flex items-center gap-1 mt-1">
              <ImageIcon className="w-3 h-3" />
              {language === 'ro'
                ? `Cu ${questionImages.length} ${questionImages.length === 1 ? 'imagine' : 'imagini'}`
                : `With ${questionImages.length} ${questionImages.length === 1 ? 'image' : 'images'}`}
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Eye className="w-4 h-4" />
            {isExpanded 
              ? (language === 'ro' ? 'Ascunde' : 'Hide')
              : (language === 'ro' ? 'Vezi' : 'View')
            }
          </button>
        </td>
      </tr>

      {/* Rând expandabil cu detalii */}
      {isExpanded && (
        <tr>
          <td colSpan="4" className="px-4 py-6 bg-gray-800/50">
            <div className="space-y-6 max-w-4xl">
              {/* Întrebarea completă */}
              <div>
                <h4 className="text-sm font-semibold text-amber-400 uppercase mb-2">
                  {language === 'ro' ? 'Întrebarea ta:' : 'Your question:'}
                </h4>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-white whitespace-pre-wrap">{question.question}</p>
                </div>
              </div>

              {/* Imaginea întrebării */}
              {questionImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-amber-400 uppercase mb-2">
                    {language === 'ro' ? 'Poze atașate:' : 'Attached images:'}
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {questionImages.map((img, index) => (
                      <div key={`${img.publicId || img.url}-${index}`} className="overflow-hidden rounded-lg">
                        <img
                          src={img.url}
                          alt={`${language === 'ro' ? 'Întrebare' : 'Question'} ${index + 1}`}
                          className="w-full max-h-96 object-contain rounded-lg border border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setEnlargedImage(img.url)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Răspunsul mentorului */}
              {question.status === 'resolved' && question.raspuns && (
                <>
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 uppercase mb-2">
                      {language === 'ro' ? '💬 Răspunsul mentorului:' : '💬 Mentor\'s answer:'}
                    </h4>
                    <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/50">
                      <p className="text-white whitespace-pre-wrap">{question.raspuns}</p>
                    </div>
                  </div>

                  {question.raspunsImage && (
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 uppercase mb-2">
                        {language === 'ro' ? 'Poză răspuns:' : 'Answer image:'}
                      </h4>
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={question.raspunsImage.url}
                          alt="Răspuns"
                          className="w-full max-h-96 object-contain rounded-lg border border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setEnlargedImage(question.raspunsImage.url)}
                        />
                      </div>
                    </div>
                  )}

                  {question.resolvedAt && (
                    <p className="text-xs text-gray-400">
                      {language === 'ro' ? 'Răspuns primit pe:' : 'Answered on:'}{' '}
                      {formatDateTime(question.resolvedAt)}
                    </p>
                  )}
                </>
              )}
            </div>
          </td>
        </tr>
      )}

      {/* Lightbox pentru imaginea mărită */}
      {enlargedImage && typeof document !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 bg-black/95 z-[99999] p-4 overflow-auto"
          onClick={() => setEnlargedImage(null)}
        >
          <button
            onClick={() => setEnlargedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed((prev) => !prev);
            }}
            className="absolute top-4 right-16 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            title={isZoomed ? (language === 'ro' ? 'Micșorează' : 'Zoom out') : (language === 'ro' ? 'Mărește' : 'Zoom in')}
          >
            {isZoomed ? <ZoomOut className="w-8 h-8" /> : <ZoomIn className="w-8 h-8" />}
          </button>
          <div
            className="min-w-full min-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={enlargedImage}
              alt="Enlarged"
              className={`object-contain transition-all duration-200 origin-center ${isZoomed ? 'cursor-zoom-out max-w-none max-h-none' : 'cursor-zoom-in max-w-full max-h-full'}`}
              style={{ width: isZoomed ? '220%' : 'auto', height: 'auto' }}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed((prev) => !prev);
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// === CACHE HELPERS - Reduce Firebase reads === 
const CACHE_DURATION = 5 * 60 * 1000; // 5 minute

const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
    
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

const Army = () => {
  const { language } = useLanguage();
  
  // State pentru autentificare
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('armyAuth');
    return savedAuth ? JSON.parse(savedAuth) : false;
  });
  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    const savedUser = localStorage.getItem('armyUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginForm, setLoginForm] = useState({ nume: "", telefon: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  // State pentru selecția activității
  const [activeView, setActiveView] = useState(null); // null, 'biblia', 'upload', 'materiale', 'mentor'

  // State pentru modalul de informații program
  const [showInfoModal, setShowInfoModal] = useState(false);

  // State pentru întrebări mentor
  const [mentorQuestion, setMentorQuestion] = useState("");
  const [mentorImageFiles, setMentorImageFiles] = useState([]);
  const [mentorImagePreviews, setMentorImagePreviews] = useState([]);
  const [mentorSending, setMentorSending] = useState(false);
  const [mentorError, setMentorError] = useState("");
  const [mentorSuccess, setMentorSuccess] = useState("");
  const [myQuestions, setMyQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  // Listen for updates from Biblia component when user switches back
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When returning to this tab/component, check for updated user data
      if (document.visibilityState === 'visible' && authenticatedUser) {
        const savedUser = localStorage.getItem('armyUser');
        if (savedUser) {
          const updatedUser = JSON.parse(savedUser);
          // Update only if progress has changed
          if (JSON.stringify(updatedUser.progres) !== JSON.stringify(authenticatedUser.progres)) {
            setAuthenticatedUser(updatedUser);
          }
        }
      }
    };

    // Check for updates when component becomes visible or activeView changes back to null (main menu)
    const checkForUpdates = () => {
      if (authenticatedUser && activeView === null) {
        const savedUser = localStorage.getItem('armyUser');
        if (savedUser) {
          const updatedUser = JSON.parse(savedUser);
          if (JSON.stringify(updatedUser.progres) !== JSON.stringify(authenticatedUser.progres)) {
            setAuthenticatedUser(updatedUser);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Check for updates when returning to main menu
    checkForUpdates();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authenticatedUser, activeView]);

  // Încarcă întrebările când view-ul mentor este activ
  useEffect(() => {
    if (activeView === 'mentor' && authenticatedUser) {
      fetchMyQuestions();
    }
  }, [activeView, authenticatedUser]);

  // Funcție de autentificare
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      // Normalizează datele de intrare
      const numeNormalized = loginForm.nume.trim().toLowerCase();
      const telefonNormalized = loginForm.telefon.trim().replace(/\s+/g, '');

      // Verifică cache-ul mai întâi
      let cursanti = getCachedData('army_login_cursanti');
      
      if (cursanti) {
        console.log('📦 Cursanți încărcați din cache pentru Army (economisim citiri Firebase)');
      } else {
        // Citește din Firebase doar dacă nu există în cache
        console.log('🔄 Citire cursanți din Firebase pentru Army...');
        const snapshot = await getDocs(collection(db, "Army"));
        cursanti = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Salvează în cache
        setCachedData('army_login_cursanti', cursanti);
      }

      // Caută un cursant care se potrivește
      const cursant = cursanti.find(c => {
        const numeDB = c.nume.trim().toLowerCase();
        const telefonDB = c.telefon.trim().replace(/\s+/g, '');
        return numeDB === numeNormalized && telefonDB === telefonNormalized;
      });

      if (cursant) {
        // Autentificare reușită
        const userData = {
          id: cursant.id,
          nume: cursant.nume,
          telefon: cursant.telefon,
          perecheValutara: cursant.perecheValutara,
          tipParticipant: cursant.tipParticipant || 'Cursant',
          oraLumanare: cursant.oraLumanare || '8:00 - 12:00',
          grupa: cursant.grupa || 'Ianuarie 2026',
          progres: cursant.progres || Array(20).fill(0),
          screenshots: cursant.screenshots || []
        };
        
        // Actualizează grupa în localStorage
        localStorage.setItem('armyUserGrupa', userData.grupa);
        
        setAuthenticatedUser(userData);
        setIsAuthenticated(true);
        
        // Salvează în localStorage pentru Army
        localStorage.setItem('armyAuth', JSON.stringify(true));
        localStorage.setItem('armyUser', JSON.stringify(userData));
        
        // Salvează și pentru Biblia și ArmyUpload pentru a le sincroniza
        localStorage.setItem('bibliaAuth', JSON.stringify(true));
        localStorage.setItem('bibliaUser', JSON.stringify(userData));
        localStorage.setItem('armyUploadAuth', JSON.stringify(true));
        localStorage.setItem('armyUploadUser', JSON.stringify(userData));
        
        setLoginForm({ nume: "", telefon: "" });
      } else {
        setLoginError(language === 'ro' 
          ? "Datele introduse nu corespund cu niciun cursant înregistrat. Verifică numele și numărul de telefon."
          : "The entered data does not match any registered student. Check the name and phone number.");
      }
    } catch (err) {
      console.error("Eroare autentificare:", err);
      setLoginError(language === 'ro' 
        ? "Eroare la autentificare. Te rugăm să încerci din nou."
        : "Authentication error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Funcție de logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthenticatedUser(null);
    setActiveView(null);
    
    // Șterge toate sesiunile
    localStorage.removeItem('armyAuth');
    localStorage.removeItem('armyUser');
    localStorage.removeItem('bibliaAuth');
    localStorage.removeItem('bibliaUser');
    localStorage.removeItem('armyUploadAuth');
    localStorage.removeItem('armyUploadUser');
    
    setLoginForm({ nume: "", telefon: "" });
  };

  const handleMentorImageChange = (e) => {
    setMentorError("");
    setMentorSuccess("");

    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== selectedFiles.length) {
      setMentorError(language === 'ro'
        ? 'Doar fișierele imagine sunt acceptate.'
        : 'Only image files are accepted.');
    }

    if (imageFiles.length === 0) return;

    const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));

    setMentorImageFiles((prev) => [...prev, ...imageFiles]);
    setMentorImagePreviews((prev) => [...prev, ...newPreviews]);

    if (e.target) {
      e.target.value = '';
    }
  };

  const handleMentorImageRemove = (indexToRemove = null) => {
    if (indexToRemove === null) {
      mentorImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      setMentorImagePreviews([]);
      setMentorImageFiles([]);
      return;
    }

    const previewToRemove = mentorImagePreviews[indexToRemove];
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove);
    }

    setMentorImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setMentorImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  useEffect(() => {
    return () => {
      mentorImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [mentorImagePreviews]);

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    setMentorError("");
    setMentorSuccess("");

    const trimmedQuestion = mentorQuestion.trim();
    if (!trimmedQuestion) {
      setMentorError(language === 'ro'
        ? 'Completează întrebarea înainte de trimitere.'
        : 'Please enter your question before sending.');
      return;
    }

    if (!authenticatedUser) {
      setMentorError(language === 'ro'
        ? 'Trebuie să fii autentificat pentru a trimite o întrebare.'
        : 'You must be logged in to send a question.');
      return;
    }

    setMentorSending(true);

    try {
      let imagesData = [];

      if (mentorImageFiles.length > 0) {
        imagesData = await Promise.all(
          mentorImageFiles.map(async (file) => {
            const uploadResult = await uploadScreenshotToCloudinary(file);
            return {
              url: uploadResult.secure_url,
              publicId: uploadResult.public_id,
              format: uploadResult.format,
              size: file.size,
              fileName: file.name
            };
          })
        );
      }

      await addDoc(collection(db, "ArmyMentorQuestions"), {
        userId: authenticatedUser.id,
        nume: authenticatedUser.nume,
        telefon: authenticatedUser.telefon,
        perecheValutara: authenticatedUser.perecheValutara,
        tipParticipant: authenticatedUser.tipParticipant,
        question: trimmedQuestion,
        image: imagesData[0] || null,
        images: imagesData,
        createdAt: Timestamp.now(),
        status: "new"
      });

      setMentorSuccess(language === 'ro'
        ? 'Întrebarea a fost trimisă cu succes!'
        : 'Question sent successfully!');
      setMentorQuestion("");
      handleMentorImageRemove();
      
      // Reîncarcă întrebările pentru a vedea noua întrebare
      await fetchMyQuestions();
    } catch (err) {
      console.error("Eroare trimitere întrebare:", err);
      setMentorError(language === 'ro'
        ? 'Eroare la trimitere. Te rugăm să încerci din nou.'
        : 'Send error. Please try again.');
    } finally {
      setMentorSending(false);
    }
  };

  const fetchMyQuestions = async () => {
    if (!authenticatedUser) return;

    setLoadingQuestions(true);
    try {
      const snapshot = await getDocs(collection(db, "ArmyMentorQuestions"));
      const allQuestions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filtrează doar întrebările utilizatorului curent
      const userQuestions = allQuestions.filter(q => q.userId === authenticatedUser.id);
      
      // Sortează după dată (cele mai recente primele)
      userQuestions.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });

      setMyQuestions(userQuestions);
      setCurrentPage(1); // Reset la prima pagină când se încarcă întrebări noi
    } catch (err) {
      console.error("Eroare încărcare întrebări:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Formular de autentificare
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 mb-4">
              🎖️ ProFX Army
            </h1>
            <p className="text-gray-400">
              {language === 'ro' 
                ? 'Acces exclusiv pentru cursanții ProFX Army' 
                : 'Exclusive access for ProFX Army students'}
            </p>
          </div>

          {/* Modal Informații Program */}
          {showInfoModal && typeof document !== 'undefined' && createPortal(
            <div
              className="fixed inset-0 bg-black/92 z-[99999] flex items-center justify-center p-4"
              onClick={() => setShowInfoModal(false)}
            >
              <div
                className="relative bg-gray-950 border border-amber-400/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Buton închide */}
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors bg-gray-800/80 rounded-full p-1.5"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Titlu */}
                  <div className="text-center pr-8">
                    <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 leading-snug">
                      🎖️ Pentru cine este programul Army?!
                    </h2>
                  </div>

                  {/* Nu pentru începători */}
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-300 font-semibold">
                      Army <span className="underline">NU</span> este pentru începători absoluți.
                    </p>
                  </div>

                  {/* Este pentru cei care */}
                  <div className="space-y-2">
                    <p className="text-gray-200 font-semibold">Army este pentru cei care:</p>
                    <ul className="space-y-1.5 text-gray-200">
                      {[
                        'Cunosc deja bazele tradingului',
                        'Știu ce înseamnă market structure, entry, SL, TP',
                        'Au făcut deja tranzacții',
                        'Dar… nu au încă claritate',
                        'Nu au un plan clar de tranzacționare',
                        'Nu reușesc să fie disciplinați singuri',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-400 font-bold mt-0.5 shrink-0">✔️</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Consistență */}
                  <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4 space-y-3">
                    <p className="text-white font-semibold">
                      Army este pentru cei care simt că știu ce au de făcut… dar nu reușesc să execute constant.
                    </p>
                    <p className="text-gray-300">Este pentru cei care:</p>
                    <ul className="space-y-1 text-gray-300">
                      {[
                        'Overtradează',
                        'Intră din FOMO',
                        'Mută SL-ul',
                        'Sar de la o strategie la alta',
                        'Au rezultate fluctuante pentru că nu au un sistem stabil',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5 shrink-0">–</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ce facem */}
                  <div className="space-y-2">
                    <p className="text-amber-400 font-bold text-lg">🎯 Ce facem în Army?</p>
                    <ul className="space-y-1 text-gray-200">
                      {[
                        'Construim un plan clar.',
                        'Construim disciplină.',
                        'Construim un sistem repetabil.',
                        'Construim mentalitatea corectă.',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-amber-400 shrink-0">▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Structură */}
                  <div className="border-l-4 border-amber-400 pl-4 space-y-1">
                    <p className="text-white font-semibold">Army este structură.</p>
                    <p className="text-white font-semibold">Army este reguli.</p>
                    <p className="text-white font-semibold">Army este responsabilitate.</p>
                    <p className="text-gray-400 mt-2 text-sm">
                      Nu este doar un curs.<br />
                      Este un regim de execuție și disciplină.
                    </p>
                  </div>

                  {/* Număr limitat */}
                  <div className="bg-amber-400/10 border border-amber-400/40 rounded-xl p-4">
                    <p className="text-amber-300 font-bold">⚠️ Lucrăm cu un număr limitat de persoane.</p>
                    <p className="text-amber-200 font-semibold mt-1">Maximum 20 de oameni.</p>
                    <p className="text-gray-300 text-sm mt-2">
                      De ce? Pentru că fiecare persoană primește atenție, corectare și ghidare reală.<br />
                      Nu putem face asta cu 100 de oameni.
                    </p>
                  </div>

                  {/* Pentru tine dacă */}
                  <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4 space-y-2">
                    <p className="text-gray-300">Dacă simți că:</p>
                    <ul className="space-y-1 text-gray-200 italic">
                      <li>„Știu bazele, dar îmi lipsește consistența."</li>
                      <li>„Am nevoie de un plan clar."</li>
                      <li>„Singur nu reușesc să fiu disciplinat."</li>
                    </ul>
                    <p className="text-amber-300 font-semibold mt-2">Atunci Army este pentru tine.</p>
                    <p className="text-gray-400 text-sm">Dacă doar cauți semnale rapide… nu este pentru tine.</p>
                  </div>

                  {/* Selectiv */}
                  <div className="text-center space-y-1">
                    <p className="text-white font-semibold">Selectăm atent. Nu lucrăm cu oricine.</p>
                    <p className="text-gray-300 text-sm">
                      Cei care sunt serioși și vor structură reală, disciplina reală și rezultate construite corect — vor înțelege valoarea.
                    </p>
                  </div>

                  {/* Calendly */}
                  <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-400/30 rounded-xl p-5 text-center space-y-3">
                    <p className="text-gray-200 text-sm">
                      Aici este link-ul de programare pentru o discuție gratuită cu John, să vedeți dacă Army e ce trebuie și să primiți mai multe detalii.
                    </p>
                    <a
                      href="https://calendly.com/profxromania/profx-army"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-bold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg"
                    >
                      📅 Programează discuția gratuită
                    </a>
                    <p className="text-gray-400 text-xs">
                      Asigurați-vă că veți fi în liniște la un laptop când aveți zoom-ul.
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="text-center pt-2 pb-1">
                    <p className="text-amber-400 font-bold text-lg">Let&apos;s build traders.</p>
                    <p className="text-gray-400">Nu jucători. 💪</p>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

          {/* Formular Login */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8">
            <div className="mb-6 text-center">
              <User className="w-16 h-16 text-amber-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === 'ro' ? 'Autentificare Cursant' : 'Student Authentication'}
              </h2>
              <p className="text-sm text-gray-400">
                {language === 'ro' 
                  ? 'Introdu numele și numărul de telefon cu care te-ai înscris' 
                  : 'Enter the name and phone number you registered with'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ro' ? 'Nume Complet' : 'Full Name'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ro' ? "Ex: Ion Popescu" : "Ex: John Doe"}
                  value={loginForm.nume}
                  onChange={(e) => setLoginForm({ ...loginForm, nume: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ro' ? 'Număr Telefon' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  placeholder={language === 'ro' ? "Ex: 0751234567" : "Ex: +40751234567"}
                  value={loginForm.telefon}
                  onChange={(e) => setLoginForm({ ...loginForm, telefon: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  required
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading 
                  ? (language === 'ro' ? "Se verifică..." : "Verifying...") 
                  : (language === 'ro' ? "Accesează Army" : "Access Army")}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-xs text-gray-500">
                {language === 'ro' 
                  ? 'Nu ești înscris încă? Aflați mai multe despre programul Army.' 
                  : 'Not registered yet? Find out more about the Army program.'}
              </p>
              <button
                onClick={() => setShowInfoModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-400/40 hover:border-amber-400/80 hover:bg-amber-500/20 text-amber-300 font-semibold rounded-xl transition-all duration-200 text-sm"
              >
                <Info className="w-4 h-4" />
                {language === 'ro' ? 'Informații Program Army' : 'Army Program Info'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dacă este selectat un view specific, afișează acea componentă
  if (activeView === 'biblia') {
    return (
      <div className="relative">
        <button
          onClick={() => setActiveView(null)}
          className="fixed top-2 left-2 md:absolute md:top-4 md:left-4 z-50 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-gray-900/95 backdrop-blur-sm hover:bg-gray-800/95 text-white rounded-lg transition-all flex items-center gap-1 md:gap-2 shadow-lg border border-gray-700/50 hover:border-amber-400/50"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="hidden md:inline">{language === 'ro' ? 'Înapoi la Meniu' : 'Back to Menu'}</span>
          <span className="md:hidden">{language === 'ro' ? 'Înapoi' : 'Back'}</span>
        </button>
        <Biblia />
      </div>
    );
  }

  if (activeView === 'upload') {
    return (
      <div className="relative">
        <button
          onClick={() => setActiveView(null)}
          className="fixed top-2 left-2 md:absolute md:top-4 md:left-4 z-50 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-gray-900/95 backdrop-blur-sm hover:bg-gray-800/95 text-white rounded-lg transition-all flex items-center gap-1 md:gap-2 shadow-lg border border-gray-700/50 hover:border-amber-400/50"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="hidden md:inline">{language === 'ro' ? 'Înapoi la Meniu' : 'Back to Menu'}</span>
          <span className="md:hidden">{language === 'ro' ? 'Înapoi' : 'Back'}</span>
        </button>
        <ArmyUpload />
      </div>
    );
  }

  if (activeView === 'materiale') {
    return (
      <div className="relative">
        <button
          onClick={() => setActiveView(null)}
          className="fixed top-2 left-2 md:absolute md:top-4 md:left-4 z-50 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-gray-900/95 backdrop-blur-sm hover:bg-gray-800/95 text-white rounded-lg transition-all flex items-center gap-1 md:gap-2 shadow-lg border border-gray-700/50 hover:border-amber-400/50"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="hidden md:inline">{language === 'ro' ? 'Înapoi la Meniu' : 'Back to Menu'}</span>
          <span className="md:hidden">{language === 'ro' ? 'Înapoi' : 'Back'}</span>
        </button>
        <MaterialeArmy userGrupa={authenticatedUser?.grupa} tipParticipant={authenticatedUser?.tipParticipant} />
      </div>
    );
  }

  if (activeView === 'mentor') {
    return (
      <div className="relative">
        <button
          onClick={() => setActiveView(null)}
          className="fixed top-2 left-2 md:absolute md:top-4 md:left-4 z-50 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-gray-900/95 backdrop-blur-sm hover:bg-gray-800/95 text-white rounded-lg transition-all flex items-center gap-1 md:gap-2 shadow-lg border border-gray-700/50 hover:border-amber-400/50"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="hidden md:inline">{language === 'ro' ? 'Înapoi la Meniu' : 'Back to Menu'}</span>
          <span className="md:hidden">{language === 'ro' ? 'Înapoi' : 'Back'}</span>
        </button>

        <div className="min-h-screen p-4 md:p-8 text-white">
          <div className="max-w-6xl mx-auto pt-12 md:pt-0 space-y-6">
            
            {/* Formular întrebare nouă */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-amber-400" />
                {language === 'ro' ? 'Întreabă mentorul' : 'Ask the Mentor'}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {language === 'ro'
                  ? 'Trimite o întrebare către mentorul tău. Poți atașa o poză dacă este relevantă.'
                  : 'Send a question to your mentor. You can attach an image if relevant.'}
              </p>

              <form onSubmit={handleMentorSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'ro' ? 'Întrebarea ta' : 'Your question'}
                  </label>
                  <textarea
                    value={mentorQuestion}
                    onChange={(e) => setMentorQuestion(e.target.value)}
                    rows={5}
                    placeholder={language === 'ro'
                      ? 'Scrie aici întrebarea ta despre trade-uri sau neclarități...'
                      : 'Write your question about trades or anything unclear...'}
                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'ro' ? 'Poze (opțional)' : 'Images (optional)'}
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-800/30">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMentorImageChange}
                      className="hidden"
                      id="mentor-image-upload"
                    />
                    <label
                      htmlFor="mentor-image-upload"
                      className="cursor-pointer inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {language === 'ro' ? 'Selectează imagini' : 'Select images'}
                    </label>
                    {mentorImageFiles.length > 0 && (
                      <p className="mt-3 text-sm text-gray-400">
                        {language === 'ro'
                          ? `${mentorImageFiles.length} ${mentorImageFiles.length === 1 ? 'fișier selectat' : 'fișiere selectate'}`
                          : `${mentorImageFiles.length} ${mentorImageFiles.length === 1 ? 'file selected' : 'files selected'}`}
                      </p>
                    )}
                  </div>

                  {mentorImagePreviews.length > 0 && (
                    <div className="mt-4">
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {mentorImagePreviews.map((preview, index) => (
                          <div key={`${preview}-${index}`} className="relative">
                            <img
                              src={preview}
                              alt={`${language === 'ro' ? 'Previzualizare imagine' : 'Image preview'} ${index + 1}`}
                              className="w-full h-40 object-cover rounded-xl border border-gray-700/50"
                            />
                            <button
                              type="button"
                              onClick={() => handleMentorImageRemove(index)}
                              className="absolute top-3 right-3 bg-gray-900/80 hover:bg-gray-800 text-white text-xs px-3 py-1 rounded-full border border-gray-700/50"
                            >
                              {language === 'ro' ? 'Șterge' : 'Remove'}
                            </button>
                            <p className="mt-1 text-xs text-gray-400 truncate">
                              {mentorImageFiles[index]?.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {mentorError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{mentorError}</p>
                  </div>
                )}

                {mentorSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm">{mentorSuccess}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={mentorSending}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mentorSending
                    ? (language === 'ro' ? 'Se trimite...' : 'Sending...')
                    : (language === 'ro' ? 'Trimite întrebarea' : 'Send question')}
                </button>
              </form>
            </div>

            {/* Istoric întrebări */}
            {myQuestions.length > 0 && (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  📋 {language === 'ro' ? 'Istoricul întrebărilor tale' : 'Your Questions History'}
                </h3>
                
                {loadingQuestions ? (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400">{language === 'ro' ? 'Se încarcă...' : 'Loading...'}</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800/50 border-b border-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                              {language === 'ro' ? 'Status' : 'Status'}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                              {language === 'ro' ? 'Dată' : 'Date'}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">
                              {language === 'ro' ? 'Întrebare' : 'Question'}
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300 uppercase">
                              {language === 'ro' ? 'Acțiuni' : 'Actions'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                          {myQuestions
                            .slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage)
                            .map((q) => (
                              <QuestionRow key={q.id} question={q} language={language} />
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Paginație */}
                    {myQuestions.length > questionsPerPage && (
                      <div className="mt-6 flex items-center justify-between border-t border-gray-700 pt-4">
                        <div className="text-sm text-gray-400">
                          {language === 'ro' 
                            ? `Afișare ${(currentPage - 1) * questionsPerPage + 1}-${Math.min(currentPage * questionsPerPage, myQuestions.length)} din ${myQuestions.length}`
                            : `Showing ${(currentPage - 1) * questionsPerPage + 1}-${Math.min(currentPage * questionsPerPage, myQuestions.length)} of ${myQuestions.length}`
                          }
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {language === 'ro' ? '← Anterior' : '← Previous'}
                          </button>
                          
                          <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(myQuestions.length / questionsPerPage) }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                                  currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(myQuestions.length / questionsPerPage), prev + 1))}
                            disabled={currentPage === Math.ceil(myQuestions.length / questionsPerPage)}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {language === 'ro' ? 'Următor →' : 'Next →'}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Meniul principal după autentificare - patru carduri
  return (
    <div className="min-h-screen p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700/50">
                <User className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{authenticatedUser.nume}</h2>
                <p className="text-gray-400 text-sm">
                  {authenticatedUser.perecheValutara} • {authenticatedUser.tipParticipant}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all flex items-center gap-2 border border-gray-700/50"
            >
              <LogOut className="w-4 h-4" />
              {language === 'ro' ? 'Deconectare' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {language === 'ro' ? 'Bine ai venit în Army!' : 'Welcome to Army!'}
          </h1>
          <p className="text-gray-400 text-lg">
            {language === 'ro' 
              ? 'Alege activitatea pe care dorești să o accesezi' 
              : 'Choose the activity you want to access'}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 - Biblia */}
          <button
            onClick={() => setActiveView('biblia')}
            className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-amber-400/30 transition-all duration-300 text-left"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4 border border-gray-700/50">
                <Book className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {language === 'ro' ? 'Biblia Trading' : 'Trading Bible'}
              </h3>
              <p className="text-gray-400 mb-6">
                {language === 'ro' 
                  ? 'Cele 20 de principii fundamentale ale trading-ului' 
                  : 'The 20 fundamental principles of trading'}
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-400 group-hover:text-amber-400 transition-colors">
                <span className="text-sm font-medium">
                  {language === 'ro' ? 'Acces Biblie' : 'Access Bible'}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            {/* Progress indicator */}
            {authenticatedUser.progres && (
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">
                    {language === 'ro' ? 'Progres total' : 'Total progress'}
                  </span>
                  <span className="text-white font-semibold">
                    {Math.round(authenticatedUser.progres.reduce((a, b) => a + b, 0) / authenticatedUser.progres.length)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300"
                    style={{ 
                      width: `${authenticatedUser.progres.reduce((a, b) => a + b, 0) / authenticatedUser.progres.length}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </button>

          {/* Card 2 - Upload Screenshots */}
          <button
            onClick={() => setActiveView('upload')}
            className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-amber-400/30 transition-all duration-300 text-left"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4 border border-gray-700/50">
                <Upload className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {language === 'ro' ? 'Upload Screenshots' : 'Upload Screenshots'}
              </h3>
              <p className="text-gray-400 mb-6">
                {language === 'ro' 
                  ? 'Încarcă imagini cu trade-urile tale pentru analiză' 
                  : 'Upload images of your trades for analysis'}
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-400 group-hover:text-amber-400 transition-colors">
                <span className="text-sm font-medium">
                  {language === 'ro' ? 'Acces Upload' : 'Access Upload'}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Screenshots count */}
            {authenticatedUser.screenshots && authenticatedUser.screenshots.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-400 text-sm">
                    {language === 'ro' ? 'Screenshots încărcate:' : 'Uploaded screenshots:'}
                  </span>
                  <span className="text-white font-semibold text-lg">
                    {authenticatedUser.screenshots.length}
                  </span>
                </div>
              </div>
            )}
          </button>

          {/* Card 3 - Materiale Army */}
          <button
            onClick={() => setActiveView('materiale')}
            className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-amber-400/30 transition-all duration-300 text-left"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4 border border-gray-700/50">
                <FileText className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {language === 'ro' ? 'Materiale Army' : 'Army Materials'}
              </h3>
              <p className="text-gray-400 mb-6">
                {language === 'ro' 
                  ? 'Resurse și materiale ajutătoare pentru toți cursanții' 
                  : 'Resources and helpful materials for all students'}
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-400 group-hover:text-amber-400 transition-colors">
                <span className="text-sm font-medium">
                  {language === 'ro' ? 'Acces Materiale' : 'Access Materials'}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
       
          </button>

          {/* Card 4 - Intreaba mentorul */}
          <button
            onClick={() => setActiveView('mentor')}
            className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-amber-400/30 transition-all duration-300 text-left"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4 border border-gray-700/50">
                <MessageSquare className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {language === 'ro' ? 'Întreabă mentorul' : 'Ask the Mentor'}
              </h3>
              <p className="text-gray-400 mb-6">
                {language === 'ro'
                  ? 'Trimite întrebări despre trade-uri sau neclarități' 
                  : 'Send questions about trades or anything unclear'}
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-400 group-hover:text-amber-400 transition-colors">
                <span className="text-sm font-medium">
                  {language === 'ro' ? 'Acces Mentor' : 'Access Mentor'}
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* Feedback Army */}
        <ArmyFeedback />

        {/* Additional Info */}
        <div className="bg-gray-900/50 mt-5 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2 text-lg">
                {language === 'ro' ? 'Sfat ProFX' : 'ProFX Tip'}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {language === 'ro' 
                  ? 'Studiază zilnic Biblia Trading și urmărește-ți progresul. Încarcă screenshot-uri ale trade-urilor tale pentru feedback personalizat de la mentor.' 
                  : 'Study the Trading Bible daily and track your progress. Upload screenshots of your trades for personalized feedback from your mentor.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Army;
