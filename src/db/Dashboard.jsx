import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'; // Importuri Auth
import { db, auth } from './FireBase.js'; // Importă auth

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchAllInscrieri();
      } else {
        setLoading(false);
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
        return (a.createdAt?.toDate() || new Date(0)) - (b.createdAt?.toDate() || new Date(0));
      } else {
        return (b.createdAt?.toDate() || new Date(0)) - (a.createdAt?.toDate() || new Date(0));
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

  if (!user) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10 text-white">
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
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-400">Dashboard Înscrieri ProFX</h1>
        <button onClick={handleLogout} className="text-red-400 hover:underline">Logout</button>
      </div>
      
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
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
        <table className="w-full border-collapse">
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
                    {item.createdAt ? item.createdAt.toDate().toLocaleString() : 'N/A'}
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
      )}
      
      <a href="/" className="block mt-6 text-center text-blue-400 hover:underline">Înapoi la Training</a>
    </div>
  );
};

export default Dashboard;