import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import { 
  FileText, Eye, Loader
} from "lucide-react";
import { 
  collection, getDocs, orderBy, query 
} from "firebase/firestore";
import { db } from "./db/FireBase.js";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const MaterialeArmy = () => {
  const { language } = useLanguage();
  const [materiale, setMateriale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtruModul, setFiltruModul] = useState("toate");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  
  // Plugin pentru PDF viewer - creat direct fără useMemo
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Thumbnails
    ],
  });

  // Încarcă materiale din Firebase
  useEffect(() => {
    fetchMateriale();
  }, []);

  const fetchMateriale = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "MaterialeArmy"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const materialeData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMateriale(materialeData);
    } catch (err) {
      console.error("Eroare la încărcarea materialelor:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">
            {language === 'ro' ? 'Se încarcă materialele...' : 'Loading materials...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            📚 {language === 'ro' ? 'Materiale Army' : 'Army Materials'}
          </h1>
          <p className="text-gray-400 text-lg">
            {language === 'ro' 
              ? 'Resurse și materiale ajutătoare pentru toți cursanții' 
              : 'Resources and helpful materials for all students'}
          </p>
        </div>

        {/* Filtru Modul */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-semibold">
            {language === 'ro' ? 'Filtrează după categorie:' : 'Filter by category:'}
          </label>
          <select
            value={filtruModul}
            onChange={(e) => setFiltruModul(e.target.value)}
            className="w-full md:w-64 p-3 rounded-lg border border-gray-600 bg-gray-800 text-white"
          >
            <option value="toate">{language === 'ro' ? 'Toate materialele' : 'All materials'}</option>
            <option value="1">{language === 'ro' ? 'Modul 1' : 'Module 1'}</option>
            <option value="2">{language === 'ro' ? 'Modul 2' : 'Module 2'}</option>
            <option value="3">{language === 'ro' ? 'Modul 3' : 'Module 3'}</option>
            <option value="rapoarte">{language === 'ro' ? 'Rapoarte/Indici' : 'Reports/Indices'}</option>
          </select>
        </div>

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
                          <span className="hidden sm:inline">{language === 'ro' ? 'Deschide PDF' : 'Open PDF'}</span>
                        </a>
                      </div>
                      <div className="bg-white rounded" style={{ height: 'min(600px, 70vh)' }}>
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                          <Viewer fileUrl={selectedMaterial.imagine.url} plugins={[defaultLayoutPluginInstance]} />
                        </Worker>
                      </div>
                    </div>
                  ) : selectedMaterial.imagine.type === 'video' ? (
                    <div className="bg-gray-700 p-4 rounded border border-gray-600">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">🎥</span>
                        <p className="text-white font-semibold">{selectedMaterial.imagine.name || (language === 'ro' ? 'Video' : 'Video')}</p>
                      </div>
                      <video
                        src={selectedMaterial.imagine.url}
                        controls
                        className="w-full max-h-[600px] rounded border border-gray-500"
                      >
                        {language === 'ro' ? 'Browser-ul tău nu suportă tag-ul video.' : 'Your browser does not support the video tag.'}
                      </video>
                    </div>
                  ) : (
                    <img src={selectedMaterial.imagine.url} alt="Material" className="w-full max-h-[600px] object-contain rounded border border-gray-600" />
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lista de Materiale - Tabel */}
        {materiale.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {language === 'ro' 
                ? 'Nu există materiale încă. Verifică mai târziu!' 
                : 'No materials yet. Check back later!'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {[1, 2, 3, 'rapoarte'].map(modul => {
              // Filtrare: dacă e setat un filtru specific, arată doar acel modul
              if (filtruModul !== "toate" && String(modul) !== filtruModul) return null;
              
              const materialeModul = materiale.filter(m => m.modul === String(modul));
              
              if (materialeModul.length === 0) return null;
              
              const titluModul = modul === 'rapoarte' 
                ? (language === 'ro' ? '📊 Rapoarte/Indici' : '📊 Reports/Indices')
                : (language === 'ro' ? `📖 Modul ${modul}` : `📖 Module ${modul}`);
              
              return (
                <div key={modul}>
                  <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                    {titluModul}
                  </h2>
                  
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700 bg-gray-800/50">
                            <th className="text-left p-4 text-gray-300 font-semibold">
                              {language === 'ro' ? 'Nume Material' : 'Material Name'}
                            </th>
                            <th className="text-left p-4 text-gray-300 font-semibold">
                              {language === 'ro' ? 'Modul' : 'Module'}
                            </th>
                            <th className="text-left p-4 text-gray-300 font-semibold">
                              {language === 'ro' ? 'Data' : 'Date'}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {materialeModul.map((material) => (
                            <tr
                              key={material.id}
                              onClick={() => setSelectedMaterial(material)}
                              className="border-b border-gray-700/50 hover:bg-amber-400/10 transition-colors cursor-pointer"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">
                                    {material.imagine?.type === 'pdf' ? '📄' : material.imagine?.type === 'video' ? '🎥' : '🖼️'}
                                  </span>
                                  <span className="text-gray-300 line-clamp-2">
                                    {material.nota.substring(0, 80)}{material.nota.length > 80 ? '...' : ''}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4 text-gray-400">
                                {modul === 'rapoarte' 
                                  ? (language === 'ro' ? 'Rapoarte' : 'Reports') 
                                  : (language === 'ro' ? `Modul ${modul}` : `Module ${modul}`)}
                              </td>
                              <td className="p-4 text-gray-500 text-sm">
                                {new Date(material.timestamp?.seconds * 1000 || material.timestamp).toLocaleDateString(language === 'ro' ? 'ro-RO' : 'en-US')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialeArmy;
