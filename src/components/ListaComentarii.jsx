import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../db/FireBase.js";

const ListaComentarii = ({ newsId }) => {
  const [comentarii, setComentarii] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query pentru comentarii specifice acestei știri (fără orderBy pentru a evita indexul)
    const q = query(
      collection(db, "newsComments"),
      where("newsId", "==", newsId)
    );

    // Real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const comentariiData = [];
      querySnapshot.forEach((doc) => {
        comentariiData.push({ id: doc.id, ...doc.data() });
      });
      
      // Sortăm în JavaScript după primirea datelor
      comentariiData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      
      setComentarii(comentariiData);
      setLoading(false);
    }, (error) => {
      console.error("Eroare la încărcarea comentariilor:", error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [newsId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recent";
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 1000 / 60);
    
    if (diffInMinutes < 1) return "Acum";
    if (diffInMinutes < 60) return `Acum ${diffInMinutes} ${diffInMinutes === 1 ? 'minut' : 'minute'}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Acum ${diffInHours} ${diffInHours === 1 ? 'oră' : 'ore'}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Acum ${diffInDays} ${diffInDays === 1 ? 'zi' : 'zile'}`;
    
    return date.toLocaleDateString('ro-RO', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Se încarcă comentariile...</span>
        </div>
      </div>
    );
  }

  if (comentarii.length === 0) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center">
        <div className="text-5xl mb-3">💬</div>
        <p className="text-gray-400">
          Niciun comentariu încă. Fii primul care lasă un comentariu!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
        <span>💬</span>
        Comentarii ({comentarii.length})
      </h3>
      
      {comentarii.map((comentariu) => (
        <div
          key={comentariu.id}
          className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-amber-400/30 transition-all duration-300 overflow-hidden"
        >
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                  {comentariu.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white">{comentariu.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(comentariu.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed ml-12">
              {comentariu.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaComentarii;
