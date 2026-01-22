import { useState, useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import { Upload, Image, CheckCircle, XCircle, Loader, Trash2, X } from "lucide-react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./db/FireBase.js";

// Funcție pentru upload la Cloudinary
export async function uploadScreenshotToCloudinary(file) {
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
}

// Funcție pentru a verifica dacă utilizatorul a uploadat astăzi (ora României - EET/EEST)
const hasUploadedToday = (lastUploadDate) => {
  if (!lastUploadDate) return false;
  
  try {
    // Convertim la data României (UTC+2 sau UTC+3 in functie de DST)
    const lastUpload = new Date(lastUploadDate);
    const now = new Date();
    
    // Convertim la ora României
    const romaniaOffset = 2 * 60; // UTC+2 (sau +3 în timpul verii, dar vom folosi +2 ca bază)
    const lastUploadRomania = new Date(lastUpload.getTime() + romaniaOffset * 60 * 1000);
    const nowRomania = new Date(now.getTime() + romaniaOffset * 60 * 1000);
    
    // Resetare la începutul zilei (00:00:00)
    const lastUploadDay = new Date(lastUploadRomania.getFullYear(), lastUploadRomania.getMonth(), lastUploadRomania.getDate());
    const todayStart = new Date(nowRomania.getFullYear(), nowRomania.getMonth(), nowRomania.getDate());
    
    // Verificăm dacă lastUploadDay >= todayStart (adică a uploadat astăzi)
    return lastUploadDay.getTime() >= todayStart.getTime();
  } catch {
    return false;
  }
};

const ArmyUpload = () => {
  const { language } = useLanguage();
  
  // Preia utilizatorul autentificat din localStorage (setat de Army)
  const [authenticatedUser] = useState(() => {
    const savedUser = localStorage.getItem('armyUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // State pentru upload
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNotes, setFileNotes] = useState([]); // Note pentru fiecare fișier
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);
  
  // State pentru istoricul screenshot-urilor utilizatorului
  const [userScreenshots, setUserScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State pentru lightbox
  const [selectedImage, setSelectedImage] = useState(null);
  
  // State pentru paginatie
  const [screenshotsPage, setScreenshotsPage] = useState(1);
  const screenshotsPerPage = 10;
  
  // State pentru verificare upload zilnic
  const [hasUploadedTodayStatus, setHasUploadedTodayStatus] = useState(false);

  // State pentru teme zilnice
  const [todayTheme, setTodayTheme] = useState("");
  const [tomorrowTheme, setTomorrowTheme] = useState("");
  const [loadingThemes, setLoadingThemes] = useState(true);

  // State pentru editarea notei
  const [editingNote, setEditingNote] = useState(null);
  const [editedNoteText, setEditedNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Încarcă screenshot-urile utilizatorului din Firebase
  useEffect(() => {
    const loadUserScreenshots = async () => {
      if (!authenticatedUser) {
        setLoading(false);
        return;
      }

      try {
        // Verifică cache mai întâi (doar pentru screenshots, nu pentru lastUploadDate)
        const cached = localStorage.getItem(`userScreenshots_${authenticatedUser.id}`);
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached);
            const now = Date.now();
            const CACHE_DURATION = 2 * 60 * 1000; // 2 minute pentru ArmyUpload
            
            // Folosește cache-ul doar dacă este fresh
            if (now - timestamp < CACHE_DURATION) {
              console.log('📦 Screenshots încărcate din cache (economisim citiri Firebase)');
              setUserScreenshots(data.screenshots || []);
              setHasUploadedTodayStatus(hasUploadedToday(data.lastUploadDate));
              setLoading(false);
              return;
            }
          } catch (err) {
            console.warn('Cache invalid, se reîncarcă din Firebase');
          }
        }
        
        // Citește din Firebase
        console.log('🔄 Citire screenshots din Firebase...');
        const userRef = doc(db, "Army", authenticatedUser.id);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const screenshots = userData.screenshots || [];
          setUserScreenshots(screenshots);
          
          // Verifică status upload zilnic
          setHasUploadedTodayStatus(hasUploadedToday(userData.lastUploadDate));
          
          // Salvează în cache
          localStorage.setItem(`userScreenshots_${authenticatedUser.id}`, JSON.stringify({
            data: { screenshots, lastUploadDate: userData.lastUploadDate },
            timestamp: Date.now()
          }));
          
          // Actualizează și localStorage cu datele fresh
          const updatedUser = { ...authenticatedUser, screenshots, lastUploadDate: userData.lastUploadDate };
          localStorage.setItem('armyUser', JSON.stringify(updatedUser));
          localStorage.setItem('armyUploadUser', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Eroare la încărcarea screenshots:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserScreenshots();
  }, [authenticatedUser]);

  // Încarcă temele zilnice (pentru astăzi și mâine)
  useEffect(() => {
    const loadThemes = async () => {
      setLoadingThemes(true);
      try {
        // Generează datele pentru astăzi și mâine
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayString = today.toISOString().split('T')[0];
        const tomorrowString = tomorrow.toISOString().split('T')[0];
        
        console.log('🔄 Citire teme zilnice din Firebase...');
        const snapshot = await getDocs(collection(db, "TemeZilnice"));
        const temesData = {};
        snapshot.docs.forEach((doc) => {
          temesData[doc.id] = doc.data().tema || "";
        });
        
        setTodayTheme(temesData[todayString] || "");
        setTomorrowTheme(temesData[tomorrowString] || "");
      } catch (error) {
        console.log("Info: Nu s-au putut încărca temele zilnice:", error.message);
      } finally {
        setLoadingThemes(false);
      }
    };

    loadThemes();
  }, []);

  // Gestionare selecție fișiere
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      alert(language === 'ro' 
        ? "Doar fișierele imagine sunt acceptate."
        : "Only image files are accepted.");
    }
    
    setSelectedFiles(prev => [...prev, ...imageFiles]);
    setFileNotes(prev => [...prev, ...Array(imageFiles.length).fill('')]);
    setUploadResults([]);
  };

  // Șterge fișier din selecție
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFileNotes(prev => prev.filter((_, i) => i !== index));
  };

  // Șterge screenshot
  const handleDeleteScreenshot = async (screenshot) => {
    const confirmed = window.confirm(
      language === 'ro'
        ? 'Sigur vrei să ștergi acest screenshot?'
        : 'Are you sure you want to delete this screenshot?'
    );

    if (!confirmed) return;

    try {
      // Șterge din Firebase
      const userRef = doc(db, "Army", authenticatedUser.id);
      await updateDoc(userRef, {
        screenshots: arrayRemove(screenshot)
      });

      // Actualizează local
      setUserScreenshots(prev => prev.filter(s => s.publicId !== screenshot.publicId));
      
      // Invalidează cache-ul
      localStorage.removeItem(`userScreenshots_${authenticatedUser.id}`);
      
      // Actualizează localStorage
      const updatedScreenshots = userScreenshots.filter(s => s.publicId !== screenshot.publicId);
      const updatedUser = { ...authenticatedUser, screenshots: updatedScreenshots };
      localStorage.setItem('armyUser', JSON.stringify(updatedUser));
      localStorage.setItem('armyUploadUser', JSON.stringify(updatedUser));

      alert(
        language === 'ro'
          ? 'Screenshot șters cu succes!'
          : 'Screenshot deleted successfully!'
      );
    } catch (error) {
      console.error("Eroare la ștergere:", error);
      alert(
        language === 'ro'
          ? 'Eroare la ștergere. Te rugăm să încerci din nou.'
          : 'Delete error. Please try again.'
      );
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
      console.error('Eroare la download:', error);
      // Fallback - deschide într-o fereastră nouă
      window.open(screenshot.url, '_blank');
    }
  };

  // Funcție pentru editarea notei
  const handleEditNote = (screenshot) => {
    console.log('📝 Editare notă pentru:', screenshot.fileName, 'Nota existentă:', screenshot.note);
    setEditingNote(screenshot);
    setEditedNoteText(screenshot.note || "");
  };

  // Funcție pentru salvarea notei editate
  const handleSaveEditedNote = async () => {
    if (!authenticatedUser || !editingNote) return;

    setSavingNote(true);
    try {
      const userRef = doc(db, "Army", authenticatedUser.id);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const screenshots = userData.screenshots || [];
        
        // Actualizează screenshot-ul cu noua notă
        const updatedScreenshots = screenshots.map(s => 
          s.url === editingNote.url && s.uploadDate === editingNote.uploadDate
            ? { ...s, note: editedNoteText }
            : s
        );
        
        // Salvează în Firebase
        await updateDoc(userRef, {
          screenshots: updatedScreenshots
        });
        
        // Actualizează state-ul local
        setUserScreenshots(updatedScreenshots);
        
        // Actualizează selectedImage dacă este deschis
        if (selectedImage && selectedImage.url === editingNote.url) {
          setSelectedImage({ ...selectedImage, nota: editedNoteText });
        }
        
        // Actualizează cache
        const cacheData = {
          data: {
            screenshots: updatedScreenshots,
            lastUploadDate: userData.lastUploadDate
          },
          timestamp: Date.now()
        };
        localStorage.setItem(`userScreenshots_${authenticatedUser.id}`, JSON.stringify(cacheData));
        
        // Închide modul de editare
        setEditingNote(null);
        setEditedNoteText("");
      }
    } catch (error) {
      console.error("Eroare la salvarea notei:", error);
      alert(language === 'ro' 
        ? 'Eroare la salvarea notei. Te rugăm să încerci din nou.'
        : 'Error saving note. Please try again.'
      );
    } finally {
      setSavingNote(false);
    }
  };

  // Upload screenshots
  const handleUpload = async () => {
    // Dezactivează butonul imediat pentru a preveni click-uri multiple
    setUploading(true);
    
    if (selectedFiles.length === 0) {
      setUploading(false);
      alert(language === 'ro' 
        ? "Te rugăm să selectezi cel puțin un screenshot."
        : "Please select at least one screenshot.");
      return;
    }

    setUploadProgress(Array(selectedFiles.length).fill(0));
    const results = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        try {
          // Upload la Cloudinary
          const cloudinaryResponse = await uploadScreenshotToCloudinary(file);
          
          const screenshotData = {
            url: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
            uploadDate: new Date().toISOString(),
            fileName: file.name,
            size: file.size,
            format: cloudinaryResponse.format,
            note: fileNotes[i] || '' // Adaugă nota (opțională)
          };

          // Actualizează progresul
          setUploadProgress(prev => {
            const newProgress = [...prev];
            newProgress[i] = 100;
            return newProgress;
          });

          results.push({ success: true, fileName: file.name, data: screenshotData });

          // Salvează în Firebase cu timestamp-ul upload-ului zilei
          const userRef = doc(db, "Army", authenticatedUser.id);
          await updateDoc(userRef, {
            screenshots: arrayUnion(screenshotData),
            lastUploadDate: new Date().toISOString() // Salvăm data și ora exactă
          });

          // Actualizează local
          setUserScreenshots(prev => [...prev, screenshotData]);
          
          // Actualizează status upload zilnic
          setHasUploadedTodayStatus(true);
          
          // Invalidează cache-ul pentru a forța reîncărcarea
          localStorage.removeItem(`userScreenshots_${authenticatedUser.id}`);
          
          // Actualizează localStorage
          const updatedUser = { ...authenticatedUser, screenshots: [...userScreenshots, screenshotData], lastUploadDate: new Date().toISOString() };
          localStorage.setItem('armyUser', JSON.stringify(updatedUser));
          localStorage.setItem('armyUploadUser', JSON.stringify(updatedUser));

        } catch (error) {
          console.error(`Eroare la upload ${file.name}:`, error);
          results.push({ success: false, fileName: file.name, error: error.message });
        }
      }

      setUploadResults(results);
      
      // Dacă toate au reușit, șterge selecția și reactivează butonul
      if (results.every(r => r.success)) {
        setTimeout(() => {
          setSelectedFiles([]);
          setFileNotes([]);
          setUploadResults([]);
          setUploading(false);
        }, 3000);
      } else {
        // Dacă au fost erori, reactivează butonul imediat
        setUploading(false);
      }

    } catch (err) {
      console.error("Eroare generală upload:", err);
      alert(language === 'ro' 
        ? "Eroare la upload. Te rugăm să încerci din nou."
        : "Upload error. Please try again.");
      setUploading(false);
    }
  };

  // Interfața principală de upload
  return (
    <div className="min-h-screen p-4 md:p-8 text-white">
      {loading ? (
        <div className="max-w-6xl mx-auto pt-12 md:pt-0 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">
              {language === 'ro' ? 'Se încarcă screenshots...' : 'Loading screenshots...'}
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto pt-12 md:pt-0">
        
        {/* Notificare dacă nu a uploadat astăzi */}
        {!hasUploadedTodayStatus && (
          <div className="bg-gradient-to-r from-red-600 to-orange-600 border-2 border-red-400 rounded-2xl p-4 mb-6 shadow-lg animate-pulse">
            <div className="flex items-center gap-3">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg mb-1">
                  {language === 'ro' 
                    ? '🔴 Nu ai uploadat încă o poză astăzi!' 
                    : '🔴 You haven\'t uploaded a photo today yet!'}
                </h4>
                <p className="text-white/90 text-sm">
                  {language === 'ro' 
                    ? 'Te rugăm să încarci screenshot-ul cu tranzacțiile tale pentru ziua de astăzi.' 
                    : 'Please upload your screenshot with today\'s transactions.'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Confirmare upload reușit */}
        {hasUploadedTodayStatus && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 border-2 border-green-400 rounded-2xl p-4 mb-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="text-3xl">✅</div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg mb-1">
                  {language === 'ro' 
                    ? '🟢 Bravo! Ai uploadat deja astăzi!' 
                    : '🟢 Great! You\'ve already uploaded today!'}
                </h4>
                <p className="text-white/90 text-sm">
                  {language === 'ro' 
                    ? 'Screenshot-ul tău a fost înregistrat cu succes pentru ziua de astăzi.' 
                    : 'Your screenshot has been successfully recorded for today.'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Secțiunea Teme Zilnice */}
        {!loadingThemes && (todayTheme || tomorrowTheme) && (
          <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 backdrop-blur-sm rounded-2xl p-6 mb-6 border-2 border-yellow-500/50 shadow-xl">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">📚</span>
              {language === 'ro' ? 'Temele Zilnice' : 'Daily Tasks'}
            </h3>
            
            {/* Tema pentru astăzi */}
            {todayTheme && (
              <div className="mb-4 bg-gray-800/60 rounded-xl p-5 border border-yellow-600/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">📅</span>
                  <h4 className="text-xl font-bold text-green-400">
                    {language === 'ro' 
                      ? `Tema pentru astăzi (${new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })})` 
                      : `Today's Task (${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })})`}
                  </h4>
                </div>
                <div className="text-white leading-relaxed whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg border border-green-500/20">
                  {todayTheme}
                </div>
              </div>
            )}
            
            {/* Tema pentru mâine */}
            {tomorrowTheme && (
              <div className="bg-gray-800/60 rounded-xl p-5 border border-yellow-600/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🗓️</span>
                  <h4 className="text-xl font-bold text-blue-400">
                    {language === 'ro' 
                      ? `Tema pentru mâine (${new Date(Date.now() + 86400000).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })})` 
                      : `Tomorrow's Task (${new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })})`}
                  </h4>
                </div>
                <div className="text-white leading-relaxed whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg border border-blue-500/20">
                  {tomorrowTheme}
                </div>
              </div>
            )}
            
            {/* Mesaj dacă nu există teme */}
            {!todayTheme && !tomorrowTheme && (
              <div className="text-center text-gray-400 py-4">
                <p className="text-lg">
                  {language === 'ro' 
                    ? '📝 Nu există teme programate pentru astăzi sau mâine' 
                    : '📝 No tasks scheduled for today or tomorrow'}
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Upload Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700/50">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Upload className="w-6 h-6" />
            {language === 'ro' ? 'Upload Screenshots' : 'Upload Screenshots'}
          </h3>

          {/* File Input */}
          <div className="mb-6">
            <label className="block w-full">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-amber-400 transition-all hover:bg-gray-800/30">
                <Upload className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <p className="text-white font-medium mb-1">
                  {language === 'ro' 
                    ? 'Click pentru a selecta imagini' 
                    : 'Click to select images'}
                </p>
                <p className="text-gray-400 text-sm">
                  {language === 'ro' 
                    ? 'sau drag & drop (PNG, JPG, JPEG)' 
                    : 'or drag & drop (PNG, JPG, JPEG)'}
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">
                {language === 'ro' 
                  ? `Fișiere selectate (${selectedFiles.length})` 
                  : `Selected files (${selectedFiles.length})`}
              </h4>
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <Image className="w-5 h-5 text-amber-400" />
                        <span className="text-white text-sm truncate">{file.name}</span>
                        <span className="text-gray-400 text-xs">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      {uploading && uploadProgress[index] !== undefined && (
                        <div className="flex items-center gap-2 mx-4">
                          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300"
                              style={{ width: `${uploadProgress[index]}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-xs">{uploadProgress[index]}%</span>
                        </div>
                      )}
                      {!uploading && (
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-300 hover:text-red-200 transition-colors"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    {/* Notă opțională - Design îmbunătățit */}
                    {!uploading && (
                      <div className="mt-3 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border-2 border-emerald-400/40 rounded-lg p-4 shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-gradient-to-br from-emerald-400 to-cyan-400 p-2 rounded-lg shadow-md animate-pulse">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <label className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-bold text-lg leading-tight">
                              {language === 'ro' 
                                ? '✍️ Adaugă notă pentru acest trade!' 
                                : '✍️ Add note for this trade!'}
                            </label>
                            <span className="text-gray-400 text-xs font-medium">
                              {language === 'ro' ? 'Opțional, dar recomandat' : 'Optional, but recommended'}
                            </span>
                          </div>
                        </div>
                        <textarea
                          value={fileNotes[index] || ''}
                          onChange={(e) => {
                            const newNotes = [...fileNotes];
                            newNotes[index] = e.target.value;
                            setFileNotes(newNotes);
                          }}
                          placeholder={language === 'ro' 
                            ? 'Setup-ul folosit pentru trade ...' 
                            : 'Setup used for this trade ...'}
                          className="w-full bg-gray-800/80 text-white text-sm rounded-lg px-3 py-2.5 border border-emerald-500/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 focus:outline-none resize-none placeholder:text-gray-500"
                          rows="3"
                          maxLength={500}
                        />
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-gray-500 text-xs">
                            {language === 'ro' 
                              ? '💡 Tip: Notează analiza tehnică, setup-ul folosit, emoțiile' 
                              : '💡 Tip: Note technical analysis, setup used, emotions'}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {(fileNotes[index] || '').length}/500
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-amber-500 disabled:hover:to-yellow-500 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {language === 'ro' ? 'Se încarcă...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    {language === 'ro' ? 'Încarcă Screenshots' : 'Upload Screenshots'}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Upload Results */}
          {uploadResults.length > 0 && (
            <div className="space-y-2">
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    result.success 
                      ? 'bg-green-500/20 border border-green-500/50' 
                      : 'bg-red-500/20 border border-red-500/50'
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-300" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-300" />
                  )}
                  <div className="flex-1">
                    <p className={result.success ? 'text-green-200' : 'text-red-200'}>
                      {result.fileName}
                    </p>
                    {!result.success && (
                      <p className="text-red-300 text-xs mt-1">{result.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Screenshots Gallery */}
        {userScreenshots.length > 0 && (() => {
          const reversedScreenshots = userScreenshots.slice().reverse();
          const totalPages = Math.ceil(reversedScreenshots.length / screenshotsPerPage);
          const startIndex = (screenshotsPage - 1) * screenshotsPerPage;
          const endIndex = startIndex + screenshotsPerPage;
          const currentScreenshots = reversedScreenshots.slice(startIndex, endIndex);
          
          return (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Image className="w-6 h-6" />
              {language === 'ro' 
                ? `Screenshots-urile Tale (${userScreenshots.length})` 
                : `Your Screenshots (${userScreenshots.length})`}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm w-16">#</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">
                      {language === 'ro' ? 'Nume Fișier' : 'File Name'}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm w-48">
                      {language === 'ro' ? 'Data și Ora' : 'Date & Time'}
                    </th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold text-sm w-32">
                      {language === 'ro' ? 'Acțiuni' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentScreenshots.map((screenshot, index) => (
                    <tr 
                      key={index}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-amber-400 font-semibold">{startIndex + index + 1}</td>
                      <td 
                        className="py-3 px-4 text-white cursor-pointer hover:text-amber-400 transition-colors"
                        onClick={() => setSelectedImage(screenshot)}
                      >
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{screenshot.fileName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">
                        {new Date(screenshot.uploadDate).toLocaleDateString(language === 'ro' ? 'ro-RO' : 'en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditNote(screenshot)}
                            className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 p-2 rounded-lg transition-colors"
                            title={language === 'ro' ? 'Editează Nota' : 'Edit Note'}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDownloadScreenshot(screenshot)}
                            className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 p-2 rounded-lg transition-colors"
                            title={language === 'ro' ? 'Download' : 'Download'}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteScreenshot(screenshot)}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-lg transition-colors"
                            title={language === 'ro' ? 'Șterge' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                  ← {language === 'ro' ? 'Anterior' : 'Previous'}
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setScreenshotsPage(page)}
                      className={`w-10 h-10 rounded ${
                        page === screenshotsPage
                          ? 'bg-amber-500 text-gray-900 font-bold'
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
                  {language === 'ro' ? 'Următor' : 'Next'} →
                </button>
              </div>
            )}
          </div>
          );
        })()}
        </div>
      )}
      
      {/* Modal pentru editarea notei */}
      {editingNote && (
        <div 
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
          onClick={() => {
            setEditingNote(null);
            setEditedNoteText("");
          }}
        >
          <div 
            className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {language === 'ro' ? 'Editează Nota' : 'Edit Note'}
              </h3>
              <button
                onClick={() => {
                  setEditingNote(null);
                  setEditedNoteText("");
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-2">{editingNote.fileName}</p>
              <p className="text-gray-500 text-xs">
                {new Date(editingNote.uploadDate).toLocaleDateString(language === 'ro' ? 'ro-RO' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <textarea
              value={editedNoteText}
              onChange={(e) => setEditedNoteText(e.target.value)}
              placeholder={language === 'ro' 
                ? 'Adaugă sau modifică nota pentru acest screenshot...'
                : 'Add or edit note for this screenshot...'}
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-amber-500 focus:outline-none min-h-[120px] resize-vertical"
              maxLength={500}
            />
            <p className="text-gray-500 text-xs mt-1 text-right">{editedNoteText.length}/500</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveEditedNote}
                disabled={savingNote}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {savingNote ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {language === 'ro' ? 'Se salvează...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {language === 'ro' ? 'Salvează' : 'Save'}
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setEditingNote(null);
                  setEditedNoteText("");
                }}
                disabled={savingNote}
                className="px-6 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {language === 'ro' ? 'Anulează' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 bg-gray-800/90 hover:bg-gray-700 text-white p-3 rounded-full transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadScreenshot(selectedImage);
            }}
            className="absolute top-4 right-20 bg-amber-500/90 hover:bg-amber-600 text-gray-900 px-4 py-3 rounded-lg transition-colors z-50 flex items-center gap-2 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          
          <div className="max-w-7xl max-h-[90vh] w-full flex flex-col items-center gap-4">
            <img
              src={selectedImage.url}
              alt={selectedImage.fileName}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="text-center bg-gray-900/80 backdrop-blur-sm rounded-lg px-6 py-3 w-full max-w-2xl">
              <p className="text-white font-medium text-lg">{selectedImage.fileName}</p>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(selectedImage.uploadDate).toLocaleDateString(language === 'ro' ? 'ro-RO' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {selectedImage.note && (
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-300 text-sm text-left">
                    <span className="text-amber-400 font-semibold">{language === 'ro' ? 'Nota ta:' : 'Your note:'}</span> {selectedImage.note}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArmyUpload;
