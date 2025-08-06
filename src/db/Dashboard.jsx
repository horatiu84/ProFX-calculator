import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './FireBase.js';

const formatDate = (createdAt) => {
  if (!createdAt) return 'N/A';
  if (createdAt.toDate) {
    // Firestore Timestamp
    return createdAt.toDate().toLocaleString();
  }
  // Alte formate (string/Date)
  try {
    return new Date(createdAt).toLocaleString();
  } catch {
    return 'N/A';
  }
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [inscrieri, setInscrieri] = useState([]);
  const [allInscrieri, setAllInscrieri] = useState([]);
  const [searchNume, setSearchNume] = useState('');
  const [searchTelefon, setSearchTelefon] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [sortBy, setSortBy] = useState('data-desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [feedbackAnonim, setFeedbackAnonim] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState('');
  const [feedbackSortBy, setFeedbackSortBy] = useState('desc'); // Aici starea pentru sortare feedback anonim

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
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoginError('Eroare la login: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const fetchAllInscrieri = async () => {
    setLoading(true);
    setError('');
    try {
      const q = collection(db, 'inscrieri');
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllInscrieri(data);
      applyFiltersAndSort(data);
    } catch (err) {
      setError('Eroare la încărcare: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbackAnonim = async () => {
    setLoadingFeedback(true);
    setErrorFeedback('');
    try {
      const snapshot = await getDocs(collection(db, 'formularAnonim'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbackAnonim(data);
    } catch (err) {
      setErrorFeedback('Eroare la încărcarea feedback-ului anonim: ' + err.message);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const applyFiltersAndSort = (data) => {
    let filtered = data.filter(item => {
      const numeMatch = searchNume ? item.nume.toLowerCase().includes(searchNume.toLowerCase()) : true;
      const telefonMatch = searchTelefon ? item.telefon.includes(searchTelefon) : true;
      const emailMatch = searchEmail ? item.email.toLowerCase().includes(searchEmail.toLowerCase()) : true;
      return numeMatch && telefonMatch && emailMatch;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'nume-asc') {
        return a.nume.toLowerCase().localeCompare(b.nume.toLowerCase());
      } else if (sortBy === 'nume-desc') {
        return b.nume.toLowerCase().localeCompare(a.nume.toLowerCase());
      } else if (sortBy === 'data-asc') {
        return (a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) - (b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt));
      } else {
        return (b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) - (a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt));
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

  // Sortează feedback-ul anonim după data selectată
  const sortedFeedback = feedbackAnonim
    .slice()
    .sort((a, b) => {
      const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return feedbackSortBy === 'asc' ? aDate - bDate : bDate - aDate;
    });

  if (!user) {
    return (
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full mx-auto mt-10 text-white">
        <h1 className="text-2xl font-bold text-blue-400 mb-6 text-center">Login Admin Dashboard</h1>
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
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>
        </form>
        {loginError && <p className="text-red-400 mt-4 text-center">{loginError}</p>}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg max-w-7xl w-full mx-auto mt-6 sm:mt-10 text-white">

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-blue-400">Dashboard Înscrieri ProFX</h1>
        <button onClick={handleLogout} className="text-red-400 hover:underline">Logout</button>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
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
        <button type="submit" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Caută</button>
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
                    <td className="p-2 border border-gray-700">{item.telefon}</td>
                    <td className="p-2 border border-gray-700">{item.email}</td>
                    <td className="p-2 border border-gray-700">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-2 text-center">Nicio înscriere găsită.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Secțiunea nouă: Feedback Anonim */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Feedback Anonim</h2>

        {/* Selector sortare feedback anonim */}
        <div className="mb-3 flex gap-2 items-center">
          <label className="text-gray-300 font-semibold">Sortare feedback:</label>
          <select
            value={feedbackSortBy}
            onChange={e => setFeedbackSortBy(e.target.value)}
            className="p-2 rounded border border-gray-600 bg-gray-800 text-white"
          >
            <option value="desc">Data (recent primul)</option>
            <option value="asc">Data (vechi primul)</option>
          </select>
        </div>

        {errorFeedback && (
          <p className="text-red-400 mb-4">{errorFeedback}</p>
        )}

        {loadingFeedback ? (
          <p>Se încarcă feedback-ul anonim...</p>
        ) : (
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
                {sortedFeedback.length > 0 ? (
                  sortedFeedback.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-700 align-top">
                      <td className="p-2 border border-gray-700 text-center font-semibold">{idx + 1}</td>
                      <td className="p-2 border border-gray-700 text-center">{item.educatie}</td>
                      <td className="p-2 border border-gray-700 text-center">{item.liveTrade}</td>
                      <td className="p-2 border border-gray-700 whitespace-pre-wrap">{item.mesaj}</td>
                      <td className="p-2 border border-gray-700">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-2 text-center">Niciun feedback anonim înregistrat.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <a href="/" className="block mt-6 text-center text-blue-400 hover:underline">Înapoi în aplicație</a>
    </div>
  );
};

export default Dashboard;
