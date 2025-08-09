import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { collection, getDocs } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db, auth } from "./FireBase.js";

const formatDate = (createdAt) => {
  if (!createdAt) return "N/A";
  if (createdAt.toDate) return createdAt.toDate().toLocaleString();
  try {
    return new Date(createdAt).toLocaleString();
  } catch {
    return "N/A";
  }
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [inscrieri, setInscrieri] = useState([]);
  const [allInscrieri, setAllInscrieri] = useState([]);
  const [searchNume, setSearchNume] = useState("");
  const [searchTelefon, setSearchTelefon] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [sortBy, setSortBy] = useState("data-desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [feedbackAnonim, setFeedbackAnonim] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState("");
  const [feedbackSortBy, setFeedbackSortBy] = useState("desc");

  // PAGINARE
  const [currentPage, setCurrentPage] = useState(1);
  const feedbackPerPage = 10;

  // MEDII
  const [mediaEducatie, setMediaEducatie] = useState("0.00");
  const [mediaLiveTrade, setMediaLiveTrade] = useState("0.00");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchAllInscrieri();
        fetchFeedbackAnonim();
      } else {
        setLoading(false);
        setLoadingFeedback(false);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoginError("Eroare la login: " + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const fetchAllInscrieri = async () => {
    setLoading(true);
    setError("");
    try {
      const q = collection(db, "inscrieri");
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllInscrieri(data);
      applyFiltersAndSort(data);
    } catch (err) {
      setError("Eroare la încărcare: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbackAnonim = async () => {
    setLoadingFeedback(true);
    setErrorFeedback("");
    try {
      const snapshot = await getDocs(collection(db, "formularAnonim"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Calcul medii
      const educValues = data
        .map((f) => parseFloat(f.educatie))
        .filter((v) => !isNaN(v));
      const liveValues = data
        .map((f) => parseFloat(f.liveTrade))
        .filter((v) => !isNaN(v));

      setMediaEducatie(
        educValues.length
          ? (educValues.reduce((a, b) => a + b, 0) / educValues.length).toFixed(2)
          : "0.00"
      );
      setMediaLiveTrade(
        liveValues.length
          ? (liveValues.reduce((a, b) => a + b, 0) / liveValues.length).toFixed(2)
          : "0.00"
      );

      setFeedbackAnonim(data);
    } catch (err) {
      setErrorFeedback(
        "Eroare la încărcarea feedback-ului anonim: " + err.message
      );
    } finally {
      setLoadingFeedback(false);
    }
  };

  const applyFiltersAndSort = (data) => {
    let filtered = data.filter((item) => {
      const numeMatch = searchNume
        ? item.nume?.toLowerCase().includes(searchNume.toLowerCase())
        : true;
      const telefonMatch = searchTelefon
        ? item.telefon?.includes(searchTelefon)
        : true;
      const emailMatch = searchEmail
        ? item.email?.toLowerCase().includes(searchEmail.toLowerCase())
        : true;
      return numeMatch && telefonMatch && emailMatch;
    });

    filtered.sort((a, b) => {
      if (sortBy === "nume-asc") {
        return a.nume.toLowerCase().localeCompare(b.nume.toLowerCase());
      } else if (sortBy === "nume-desc") {
        return b.nume.toLowerCase().localeCompare(a.nume.toLowerCase());
      } else if (sortBy === "data-asc") {
        return (
          (a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) -
          (b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt))
        );
      } else {
        return (
          (b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) -
          (a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt))
        );
      }
    });
    setInscrieri(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFiltersAndSort(allInscrieri);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    applyFiltersAndSort(allInscrieri);
  };

  // --- FEEDBACK: SORTARE & PAGINARE ---

  const sortedFeedback = feedbackAnonim.slice().sort((a, b) => {
    const aDate = a.createdAt?.toDate
      ? a.createdAt.toDate()
      : new Date(a.createdAt);
    const bDate = b.createdAt?.toDate
      ? b.createdAt.toDate()
      : new Date(b.createdAt);
    return feedbackSortBy === "asc" ? aDate - bDate : bDate - aDate;
  });

  const indexOfLastFeedback = currentPage * feedbackPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbackPerPage;
  const currentFeedback = sortedFeedback.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  const totalPages = Math.ceil(sortedFeedback.length / feedbackPerPage);

  const exportFeedbackToExcel = () => {
    if (feedbackAnonim.length === 0) return;
    const dataToExport = feedbackAnonim.map((item, idx) => ({
      Nr: idx + 1,
      Educație: item.educatie || "",
      "Sesiuni Live/Trade": item.liveTrade || "",
      Mesaj: item.mesaj || "",
      "Data Creării": formatDate(item.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback Anonim");
    XLSX.writeFile(workbook, "feedback-anonim.xlsx");
  };

  if (!user) {
    return (
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full mx-auto mt-10 text-white">
        <h1 className="text-2xl font-bold text-blue-400 mb-6 text-center">
          Login Admin Dashboard
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        {loginError && (
          <p className="text-red-400 mt-4 text-center">{loginError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg max-w-7xl w-full mx-auto mt-6 sm:mt-10 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-blue-400">
          Dashboard Înscrieri ProFX
        </h1>
        <button onClick={handleLogout} className="text-red-400 hover:underline">
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Caută după nume (partial)"
          value={searchNume}
          onChange={(e) => setSearchNume(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-gray-800 text-white flex-1"
        />
        <input
          type="text"
          placeholder="Caută după telefon (partial)"
          value={searchTelefon}
          onChange={(e) => setSearchTelefon(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-gray-800 text-white flex-1"
        />
        <input
          type="text"
          placeholder="Caută după email (partial)"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-gray-800 text-white flex-1"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Caută
        </button>
      </form>

      <div className="mb-4">
        <label className="text-gray-300 mr-2">Sortare:</label>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="p-2 rounded border border-gray-600 bg-gray-800 text-white"
        >
          <option value="data-desc">Data (recentă primul)</option>
          <option value="data-asc">Data (veche primul)</option>
          <option value="nume-asc">Nume (A-Z)</option>
          <option value="nume-desc">Nume (Z-A)</option>
        </select>
      </div>

      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
      {loading ? (
        <p className="text-center">Se încarcă...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-2 border border-gray-700">Nume</th>
                <th className="p-2 border border-gray-700">Telefon</th>
                <th className="p-2 border border-gray-700">Email</th>
                <th className="p-2 border border-gray-700">Data Creării</th>
              </tr>
            </thead>
            <tbody>
              {inscrieri.length > 0 ? (
                inscrieri.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-700">
                    <td className="p-2 border border-gray-700">{item.nume}</td>
                    <td className="p-2 border border-gray-700">
                      {item.telefon}
                    </td>
                    <td className="p-2 border border-gray-700">{item.email}</td>
                    <td className="p-2 border border-gray-700">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-2 text-center">
                    Nicio înscriere găsită.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* === Secțiunea Feedback Anonim === */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-blue-400 mb-2">
          Feedback Anonim
        </h2>
        <div className="mb-4 text-green-400 font-semibold text-sm">
          Media Educație: {mediaEducatie} &nbsp; | &nbsp; Media Sesiuni Live/Trade: {mediaLiveTrade}
        </div>

        {/* Export Excel */}
        <div className="flex justify-end mb-4">
          <button
            onClick={exportFeedbackToExcel}
            className="p-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Exportă Feedback în Excel
          </button>
        </div>

        {/* Sortare */}
        <div className="mb-3 flex gap-2 items-center">
          <label className="text-gray-300 font-semibold">
            Sortare feedback:
          </label>
          <select
            value={feedbackSortBy}
            onChange={(e) => {
              setFeedbackSortBy(e.target.value);
              setCurrentPage(1); // Când schimb sortarea, revine la pagina 1
            }}
            className="p-2 rounded border border-gray-600 bg-gray-800 text-white"
          >
            <option value="desc">Data (recent primul)</option>
            <option value="asc">Data (vechi primul)</option>
          </select>
        </div>

        {errorFeedback && <p className="text-red-400 mb-4">{errorFeedback}</p>}

        {loadingFeedback ? (
          <p>Se încarcă feedback-ul anonim...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-2 border border-gray-700 text-center">#</th>
                    <th className="p-2 border border-gray-700 text-center">Educație</th>
                    <th className="p-2 border border-gray-700 text-center">Sesiuni Live/Trade</th>
                    <th className="p-2 border border-gray-700">Mesaj</th>
                    <th className="p-2 border border-gray-700">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFeedback.length > 0 ? (
                    currentFeedback.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-gray-700 align-top">
                        <td className="p-2 border border-gray-700 text-center font-semibold">
                          {indexOfFirstFeedback + idx + 1}
                        </td>
                        <td className="p-2 border border-gray-700 text-center">
                          {item.educatie}
                        </td>
                        <td className="p-2 border border-gray-700 text-center">
                          {item.liveTrade}
                        </td>
                        <td className="p-2 border border-gray-700 whitespace-pre-wrap">
                          {item.mesaj}
                        </td>
                        <td className="p-2 border border-gray-700">
                          {formatDate(item.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-2 text-center">
                        Niciun feedback anonim înregistrat.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* PAGINARE */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-blue-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
                >
                  Următor
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <a
        href="/"
        className="block mt-6 text-center text-blue-400 hover:underline"
      >
        Înapoi în aplicație
      </a>
    </div>
  );
};

export default Dashboard;
