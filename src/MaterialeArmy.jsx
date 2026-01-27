import { useState, useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import { 
  FileText, Eye, Loader
} from "lucide-react";
import { 
  collection, getDocs, orderBy, query 
} from "firebase/firestore";
import { db } from "./db/FireBase.js";

const MaterialeArmy = () => {
  const { language } = useLanguage();
  const [materiale, setMateriale] = useState([]);
  const [loading, setLoading] = useState(true);

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

        {/* Lista de Materiale - Grupate pe Module */}
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
            {[1, 2, 3, 4, 5, 6].map(modul => {
              const materialeModul = materiale.filter(m => m.modul === String(modul));
              
              if (materialeModul.length === 0) return null;
              
              return (
                <div key={modul}>
                  <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                    📖 {language === 'ro' ? `Modul ${modul}` : `Module ${modul}`}
                  </h2>
                  
                  <div className="space-y-4">
                    {materialeModul.map((material) => (
                      <div
                        key={material.id}
                        className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-amber-400/30 transition-all"
                      >
                        {/* Notă */}
                        <p className="text-gray-300 text-sm mb-4 whitespace-pre-wrap leading-relaxed">
                          {material.nota}
                        </p>

                        {/* Imagine */}
                        {material.imagine && (
                          <div className="mt-4">
                            <a
                              href={material.imagine.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative block rounded-lg overflow-hidden border border-gray-700/50 hover:border-amber-400/50 transition-all"
                            >
                              <img 
                                src={material.imagine.url} 
                                alt={material.imagine.name}
                                className="w-full max-h-96 object-contain bg-gray-800/50"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-12 h-12 text-white" />
                              </div>
                            </a>
                          </div>
                        )}

                        {/* Info autor */}
                        <p className="text-gray-500 text-xs mt-4">
                          {language === 'ro' ? 'Adăugat de' : 'Added by'} {material.autor}
                        </p>
                      </div>
                    ))}
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
