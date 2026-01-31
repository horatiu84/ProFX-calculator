import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../FireBase';
import { MessageSquare, Calendar, CheckCircle, AlertCircle, Upload, X, Image as ImageIcon, ZoomIn, ZoomOut } from 'lucide-react';

// Upload imagine la Cloudinary
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

const IntrebariArmyTab = ({ getCachedData, setCachedData, clearCachedData }) => {
  const [intrebari, setIntrebari] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // State pentru vizualizare/răspuns
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [raspuns, setRaspuns] = useState("");
  const [raspunsImageFile, setRaspunsImageFile] = useState(null);
  const [raspunsImagePreview, setRaspunsImagePreview] = useState("");
  const [sending, setSending] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Fetch întrebări
  const fetchIntrebari = async (forceRefresh = false) => {
    const cacheKey = 'army_mentor_questions';
    
    if (!forceRefresh) {
      const cached = getCachedData?.(cacheKey);
      if (cached) {
        console.log('📦 Întrebări Army încărcate din cache');
        setIntrebari(cached);
        return;
      }
    }

    setLoading(true);
    setError("");
    
    try {
      const q = query(collection(db, "ArmyMentorQuestions"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setIntrebari(data);
      
      if (setCachedData) {
        setCachedData(cacheKey, data);
      }
    } catch (err) {
      console.error("Eroare fetch întrebări:", err);
      setError("Eroare la încărcarea întrebărilor: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntrebari();
  }, []);

  useEffect(() => {
    setIsZoomed(false);
  }, [enlargedImage]);

  const handleOpenModal = (question) => {
    setSelectedQuestion(question);
    setShowModal(true);
    setRaspuns("");
    setRaspunsImageFile(null);
    setRaspunsImagePreview("");
    setError("");
    setSuccess("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuestion(null);
    setRaspuns("");
    setRaspunsImageFile(null);
    if (raspunsImagePreview) {
      URL.revokeObjectURL(raspunsImagePreview);
    }
    setRaspunsImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (raspunsImagePreview) {
      URL.revokeObjectURL(raspunsImagePreview);
    }

    setRaspunsImageFile(file);
    setRaspunsImagePreview(URL.createObjectURL(file));
  };

  const handleImageRemove = () => {
    if (raspunsImagePreview) {
      URL.revokeObjectURL(raspunsImagePreview);
    }
    setRaspunsImagePreview("");
    setRaspunsImageFile(null);
  };

  const handleSubmitRaspuns = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedRaspuns = raspuns.trim();
    if (!trimmedRaspuns) {
      setError("Completează răspunsul înainte de trimitere.");
      return;
    }

    setSending(true);

    try {
      let imageData = null;

      if (raspunsImageFile) {
        const uploadResult = await uploadImageToCloudinary(raspunsImageFile);
        imageData = {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          format: uploadResult.format,
          size: raspunsImageFile.size,
          fileName: raspunsImageFile.name
        };
      }

      const questionRef = doc(db, "ArmyMentorQuestions", selectedQuestion.id);
      await updateDoc(questionRef, {
        status: "resolved",
        raspuns: trimmedRaspuns,
        raspunsImage: imageData,
        resolvedAt: Timestamp.now()
      });

      setSuccess("Răspuns trimis cu succes!");
      
      // Actualizează local
      const updatedIntrebari = intrebari.map(q =>
        q.id === selectedQuestion.id
          ? { ...q, status: "resolved", raspuns: trimmedRaspuns, raspunsImage: imageData, resolvedAt: Timestamp.now() }
          : q
      );
      setIntrebari(updatedIntrebari);

      // Invalidează cache
      if (clearCachedData) {
        clearCachedData('army_mentor_questions');
      }

      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err) {
      console.error("Eroare trimitere răspuns:", err);
      setError("Eroare la trimitere. Te rugăm să încerci din nou.");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '-';
    try {
      let date;
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else {
        date = new Date(timestamp);
      }
      
      if (isNaN(date.getTime())) return '-';
      
      return date.toLocaleString('ro-RO', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Error formatting date:', err, timestamp);
      return '-';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-300 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Întrebări Cursanți Army
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Gestionează întrebările primite de la cursanți
          </p>
        </div>
        <button
          onClick={() => fetchIntrebari(true)}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? '⏳ Se încarcă...' : '🔄 Reîmprospătează'}
        </button>
      </div>

      {/* Mesaje */}
      {error && (
        <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-900 bg-opacity-50 border border-green-700 rounded-lg p-4">
          <p className="text-green-300">{success}</p>
        </div>
      )}

      {/* Tabele întrebări - separate pentru nerezolvate și rezolvate */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Se încarcă întrebările...</p>
        </div>
      ) : intrebari.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Nu există întrebări de la cursanți</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tabel Întrebări Nerezolvate */}
          {intrebari.filter(q => q.status !== 'resolved').length > 0 && (
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-red-700/50">
              <div className="bg-red-900/30 px-4 py-3 border-b border-red-700/50">
                <h3 className="text-lg font-bold text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Întrebări Nerezolvate ({intrebari.filter(q => q.status !== 'resolved').length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Cursant
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Pereche / Tip
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Dată și Oră
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Acțiuni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {intrebari.filter(q => q.status !== 'resolved').map((intrebare) => (
                      <tr
                        key={intrebare.id}
                        className="hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">{intrebare.nume}</div>
                          <div className="text-sm text-gray-400">{intrebare.telefon}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-300">{intrebare.perecheValutara || '-'}</div>
                          <div className="text-xs text-gray-400">{intrebare.tipParticipant || '-'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{formatDateTime(intrebare.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleOpenModal(intrebare)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                          >
                            Răspunde
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tabel Întrebări Rezolvate */}
          {intrebari.filter(q => q.status === 'resolved').length > 0 && (
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-green-700/50">
              <div className="bg-green-900/30 px-4 py-3 border-b border-green-700/50">
                <h3 className="text-lg font-bold text-green-300 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Întrebări Rezolvate ({intrebari.filter(q => q.status === 'resolved').length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Cursant
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Pereche / Tip
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Dată și Oră
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Rezolvat La
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Acțiuni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {intrebari.filter(q => q.status === 'resolved').map((intrebare) => (
                      <tr
                        key={intrebare.id}
                        className="hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">{intrebare.nume}</div>
                          <div className="text-sm text-gray-400">{intrebare.telefon}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-300">{intrebare.perecheValutara || '-'}</div>
                          <div className="text-xs text-gray-400">{intrebare.tipParticipant || '-'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{formatDateTime(intrebare.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-green-300">
                            {formatDateTime(intrebare.resolvedAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleOpenModal(intrebare)}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-semibold transition-colors"
                          >
                            Vezi Detalii
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal pentru vizualizare/răspuns */}
      {showModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Întrebare de la {selectedQuestion.nume}
                </h3>
                <p className="text-sm text-gray-400">
                  {formatDateTime(selectedQuestion.createdAt)}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Întrebarea */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Întrebarea:</h4>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-white whitespace-pre-wrap">{selectedQuestion.question}</p>
                </div>
              </div>

              {/* Imaginea întrebării */}
              {selectedQuestion.image && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Poză atașată:</h4>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={selectedQuestion.image.url}
                      alt="Întrebare"
                      className="w-full max-h-96 object-contain rounded-lg border border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setEnlargedImage(selectedQuestion.image.url)}
                    />
                  </div>
                </div>
              )}

              {/* Răspunsul (dacă există) */}
              {selectedQuestion.status === "resolved" && selectedQuestion.raspuns && (
                <>
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 uppercase mb-2">Răspunsul tău:</h4>
                    <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/50">
                      <p className="text-white whitespace-pre-wrap">{selectedQuestion.raspuns}</p>
                    </div>
                  </div>

                  {selectedQuestion.raspunsImage && (
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 uppercase mb-2">Poză răspuns:</h4>
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={selectedQuestion.raspunsImage.url}
                          alt="Răspuns"
                          className="w-full max-h-96 object-contain rounded-lg border border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setEnlargedImage(selectedQuestion.raspunsImage.url)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Închide
                    </button>
                  </div>
                </>
              )}

              {/* Formular răspuns (dacă nu e rezolvat) */}
              {selectedQuestion.status !== "resolved" && (
                <form onSubmit={handleSubmitRaspuns} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Răspunsul tău:
                    </label>
                    <textarea
                      value={raspuns}
                      onChange={(e) => setRaspuns(e.target.value)}
                      rows={5}
                      placeholder="Scrie aici răspunsul pentru cursant..."
                      className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Poză (opțional)
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-900/30">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="raspuns-image-upload"
                      />
                      <label
                        htmlFor="raspuns-image-upload"
                        className="cursor-pointer inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Selectează imagine
                      </label>
                      {raspunsImageFile && (
                        <p className="mt-3 text-sm text-gray-400">
                          Fișier selectat: <span className="font-semibold text-white">{raspunsImageFile.name}</span>
                        </p>
                      )}
                    </div>

                    {raspunsImagePreview && (
                      <div className="mt-4">
                        <div className="relative">
                          <img
                            src={raspunsImagePreview}
                            alt="Previzualizare răspuns"
                            className="w-full max-h-72 object-cover rounded-xl border border-gray-700"
                          />
                          <button
                            type="button"
                            onClick={handleImageRemove}
                            className="absolute top-3 right-3 bg-gray-900/80 hover:bg-gray-800 text-white text-xs px-3 py-1 rounded-full border border-gray-700"
                          >
                            Șterge
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 text-sm">{success}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Anulează
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? 'Se trimite...' : 'Trimite Răspuns'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox pentru imaginea mărită */}
      {enlargedImage && (
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
            title={isZoomed ? 'Micșorează' : 'Mărește'}
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
        </div>
      )}
    </div>
  );
};

export default IntrebariArmyTab;
