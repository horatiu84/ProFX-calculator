import React, { useState } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../FireBase.js";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const formatDate = (createdAt) => {
  if (!createdAt) return "N/A";
  if (createdAt.toDate) return createdAt.toDate().toLocaleString();
  try {
    return new Date(createdAt).toLocaleString();
  } catch {
    return "N/A";
  }
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    return "";
  } catch {
    return "";
  }
};

const MaterialeTab = ({ 
  materialeArmy, 
  setMaterialeArmy,
  fetchMaterialeArmy,
  clearCachedData 
}) => {
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
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editMaterialData, setEditMaterialData] = useState({
    nota: "",
    modul: "1"
  });
  const [filtruModul, setFiltruModul] = useState("toate");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  
  // Plugin pentru PDF viewer
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Thumbnails
    ],
  });

  // Upload fișier (imagine, PDF sau video) la Cloudinary
  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "screenshots_unsigned");

    // Detectăm tipul de fișier
    const isVideo = file.type.includes('video');
    const uploadType = isVideo ? 'video' : 'auto';

    // Folosim /auto/upload pentru PDF și imagini, /video/upload pentru video-uri
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dtdovbtye/${uploadType}/upload`,
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
      const result = await uploadFileToCloudinary(file);
      let fileType = 'image';
      if (file.type.includes('pdf')) fileType = 'pdf';
      
      const fileData = {
        url: result.secure_url,
        type: fileType,
        name: file.name
      };
      console.log('File uploaded:', fileData);
      setUploadedImageUrl(fileData);
      
      const fileTypeText = fileType === 'pdf' ? 'PDF' : 'Imagine';
      setSuccessMateriale(`${fileTypeText} încărcat cu succes!`);
      setTimeout(() => setSuccessMateriale(""), 3000);
    } catch (err) {
      setErrorMateriale("Eroare la încărcarea fișierului: " + err.message);
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

    if (youtubeUrl && !getYouTubeEmbedUrl(youtubeUrl)) {
      setErrorMateriale("Link YouTube invalid. Te rog folosește un link YouTube corect.");
      return;
    }

    setLoadingMateriale(true);
    try {
      await addDoc(collection(db, "MaterialeArmy"), {
        nota: newMaterial.nota,
        modul: newMaterial.modul,
        imagine: youtubeUrl ? {
          url: youtubeUrl,
          type: 'youtube',
          name: "YouTube"
        } : uploadedImageUrl ? {
          url: typeof uploadedImageUrl === 'string' ? uploadedImageUrl : uploadedImageUrl.url,
          type: typeof uploadedImageUrl === 'object' ? uploadedImageUrl.type : 'image',
          name: typeof uploadedImageUrl === 'object' ? uploadedImageUrl.name : "material_image.jpg"
        } : null,
        timestamp: Timestamp.now(),
        autor: "Admin"
      });

      setSuccessMateriale("Material adăugat cu succes!");
      setNewMaterial({ nota: "", modul: "1", imagine: null });
      setUploadedImageUrl(null);
      setYoutubeUrl("");
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

  return (
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

      {/* Filtru Modul */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Filtrează după categorie:</label>
        <select
          value={filtruModul}
          onChange={(e) => setFiltruModul(e.target.value)}
          className="w-full md:w-64 p-2 rounded border border-gray-600 bg-gray-700 text-white"
        >
          <option value="toate">Toate materialele</option>
          <option value="1">Modul 1</option>
          <option value="2">Modul 2</option>
          <option value="3">Modul 3</option>
          <option value="rapoarte">Rapoarte/Indici</option>
        </select>
      </div>

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
                <option value="rapoarte">Rapoarte/Indici</option>
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

            {/* Link YouTube (opțional) */}
            <div>
              <label className="block text-gray-300 mb-2">Link YouTube (opțional)</label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
              />
              <p className="text-gray-400 text-xs mt-1">
                Dacă completezi un link YouTube, fișierul încărcat nu va fi folosit.
              </p>
            </div>

            {/* Upload Fișier (Imagine sau PDF) */}
            <div>
              <label className="block text-gray-300 mb-2">Fișier - Imagine sau PDF (opțional)</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,application/pdf"
                onChange={handleImageUpload}
                className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <p className="text-yellow-400 text-sm mt-2">Se încarcă fișierul...</p>
              )}
              {uploadedImageUrl && (
                <div className="mt-2">
                  {uploadedImageUrl.type === 'pdf' ? (
                    <div className="bg-gray-600 p-3 rounded border border-gray-500">
                      <p className="text-white flex items-center gap-2">
                        <span className="text-2xl">📄</span>
                        <span>{uploadedImageUrl.name}</span>
                      </p>
                      <a 
                        href={uploadedImageUrl.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm hover:underline"
                      >
                        👁️ Previzualizează PDF
                      </a>
                    </div>
                  ) : (
                    <img
                      src={uploadedImageUrl.url || uploadedImageUrl}
                      alt="Preview"
                      className="w-48 h-32 object-cover rounded border border-gray-600"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setUploadedImageUrl(null)}
                    className="text-red-400 text-sm mt-1 hover:underline"
                  >
                    Șterge fișier
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
                  setYoutubeUrl("");
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Anulează
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal pentru vizualizare material */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMaterial(null)}>
          <div className="bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-amber-400">{selectedMaterial.nota.substring(0, 50)}...</h3>
              <button onClick={() => setSelectedMaterial(null)} className="text-white hover:text-red-400 text-2xl">
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 whitespace-pre-wrap mb-4">{selectedMaterial.nota}</p>
              {selectedMaterial.imagine && (
                selectedMaterial.imagine.type === 'pdf' ? (
                  <div className="bg-gray-700 p-4 rounded border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">📄</span>
                        <p className="text-white font-semibold">{selectedMaterial.imagine.name || 'Document PDF'}</p>
                      </div>
                      <a href={selectedMaterial.imagine.url} target="_blank" rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
                        <span>🔗</span>
                        <span className="hidden sm:inline">Deschide PDF</span>
                      </a>
                    </div>
                    <div className="bg-white rounded" style={{ height: 'min(600px, 70vh)' }}>
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer fileUrl={selectedMaterial.imagine.url} plugins={[defaultLayoutPluginInstance]} />
                      </Worker>
                    </div>
                  </div>
                ) : selectedMaterial.imagine.type === 'youtube' ? (
                  <div className="bg-gray-700 p-4 rounded border border-gray-600">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">▶️</span>
                      <p className="text-white font-semibold">YouTube</p>
                    </div>
                    <div className="w-full aspect-video rounded overflow-hidden border border-gray-500 bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(selectedMaterial.imagine.url)}
                        title="YouTube video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <img src={selectedMaterial.imagine.url} alt="Material" className="w-full max-h-[600px] object-contain rounded border border-gray-600" />
                )
              )}
              <p className="text-gray-500 text-sm mt-4">
                Adăugat de {selectedMaterial.autor} • {formatDate(selectedMaterial.timestamp)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista Materiale - Tabel */}
      {loadingMateriale ? (
        <p className="text-gray-400">Se încarcă materialele...</p>
      ) : materialeArmy.length === 0 ? (
        <p className="text-gray-400">Nu există materiale încă.</p>
      ) : (
        <div className="space-y-6">
          {[1, 2, 3, 'rapoarte'].map(modul => {
            // Filtrare: dacă e setat un filtru specific, arată doar acel modul
            if (filtruModul !== "toate" && String(modul) !== filtruModul) return null;
            
            const materialeModul = materialeArmy.filter(m => m.modul === String(modul));
            if (materialeModul.length === 0) return null;

            const titluModul = modul === 'rapoarte' ? '📊 Rapoarte/Indici' : `📖 Modul ${modul}`;

            return (
              <div key={modul} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold text-amber-400 mb-4">{titluModul}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left p-3 text-gray-300 font-semibold">Nume Material</th>
                        <th className="text-left p-3 text-gray-300 font-semibold">Modul</th>
                        <th className="text-left p-3 text-gray-300 font-semibold">Data</th>
                        <th className="text-left p-3 text-gray-300 font-semibold">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialeModul.map((material) => (
                        <tr key={material.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                          {editingMaterial === material.id ? (
                            <td colSpan="4" className="p-3">
                              <div className="space-y-3">
                                <select
                                  value={editMaterialData.modul}
                                  onChange={(e) => setEditMaterialData({ ...editMaterialData, modul: e.target.value })}
                                  className="w-full p-2 rounded border border-gray-600 bg-gray-600 text-white"
                                >
                                  <option value="1">Modul 1</option>
                                  <option value="2">Modul 2</option>
                                  <option value="3">Modul 3</option>
                                  <option value="rapoarte">Rapoarte/Indici</option>
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
                            </td>
                          ) : (
                            <>
                              <td className="p-3">
                                <button
                                  onClick={() => setSelectedMaterial(material)}
                                  className="text-left text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-2"
                                >
                                  {material.imagine?.type === 'pdf' ? '📄' : material.imagine?.type === 'youtube' ? '▶️' : '🖼️'}
                                  <span className="line-clamp-2">{material.nota.substring(0, 80)}{material.nota.length > 80 ? '...' : ''}</span>
                                </button>
                              </td>
                              <td className="p-3 text-gray-300">
                                {modul === 'rapoarte' ? 'Rapoarte' : `Modul ${modul}`}
                              </td>
                              <td className="p-3 text-gray-400 text-sm">
                                {formatDate(material.timestamp)}
                              </td>
                              <td className="p-3">
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
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMaterial(material.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                    disabled={loadingMateriale}
                                  >
                                    🗑️
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MaterialeTab;
