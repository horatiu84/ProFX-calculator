import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../db/FireBase.js";

// Hook personalizat pentru a obține numărul de comentarii
export const useCommentsCount = (newsId) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "newsComments"),
      where("newsId", "==", newsId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setCount(querySnapshot.size);
    }, (error) => {
      console.error("Eroare la numărarea comentariilor:", error);
    });

    return () => unsubscribe();
  }, [newsId]);

  return count;
};
