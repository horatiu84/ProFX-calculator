import { useState, useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import { Upload, Image, CheckCircle, XCircle, Loader, Trash2, X } from "lucide-react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
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

const ArmyUpload = () => {
  const { language } = useLanguage();
  
  // Preia utilizatorul autentificat din localStorage (setat de Army)
  const [authenticatedUser] = useState(() => {
    const savedUser = localStorage.getItem('armyUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // State pentru upload
  const [selectedFiles, setSelectedFiles] = useState([]);
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

  // Încarcă screenshot-urile utilizatorului din Firebase
  useEffect(() => {
    const loadUserScreenshots = async () => {
      if (!authenticatedUser) {
        setLoading(false);
        return;
      }

      try {
        // Reîncarcă datele utilizatorului din Firebase pentru a obține screenshots-urile actuale
        const userRef = doc(db, "Army", authenticatedUser.id);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const screenshots = userData.screenshots || [];
          setUserScreenshots(screenshots);
          
          // Actualizează și localStorage cu datele fresh
          const updatedUser = { ...authenticatedUser, screenshots };
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
    setUploadResults([]);
  };

  // Șterge fișier din selecție
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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

  // Upload screenshots
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert(language === 'ro' 
        ? "Te rugăm să selectezi cel puțin un screenshot."
        : "Please select at least one screenshot.");
      return;
    }

    setUploading(true);
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
            format: cloudinaryResponse.format
          };

          // Actualizează progresul
          setUploadProgress(prev => {
            const newProgress = [...prev];
            newProgress[i] = 100;
            return newProgress;
          });

          results.push({ success: true, fileName: file.name, data: screenshotData });

          // Salvează în Firebase
          const userRef = doc(db, "Army", authenticatedUser.id);
          await updateDoc(userRef, {
            screenshots: arrayUnion(screenshotData)
          });

          // Actualizează local
          setUserScreenshots(prev => [...prev, screenshotData]);
          
          // Actualizează localStorage
          const updatedUser = { ...authenticatedUser, screenshots: [...userScreenshots, screenshotData] };
          localStorage.setItem('armyUser', JSON.stringify(updatedUser));
          localStorage.setItem('armyUploadUser', JSON.stringify(updatedUser));

        } catch (error) {
          console.error(`Eroare la upload ${file.name}:`, error);
          results.push({ success: false, fileName: file.name, error: error.message });
        }
      }

      setUploadResults(results);
      
      // Dacă toate au reușit, șterge selecția
      if (results.every(r => r.success)) {
        setTimeout(() => {
          setSelectedFiles([]);
          setUploadResults([]);
        }, 3000);
      }

    } catch (err) {
      console.error("Eroare generală upload:", err);
      alert(language === 'ro' 
        ? "Eroare la upload. Te rugăm să încerci din nou."
        : "Upload error. Please try again.");
    } finally {
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
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
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
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <div className="text-center bg-gray-900/80 backdrop-blur-sm rounded-lg px-6 py-3">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArmyUpload;
