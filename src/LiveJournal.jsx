import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { tradesDb } from "./db/TradesFirebase";
import { useNavigate } from "react-router-dom";
import "./LotCalculator.css";

const LiveJournal = () => {
  const navigate = useNavigate();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = de la 30 la 1, 'asc' = de la 1 la 30

  // Preluarea datelor din Firebase
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        const tradesRef = collection(tradesDb, 'trades');
        const q = query(tradesRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const tradesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTrades(tradesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching trades:", err);
        setError("Nu s-au putut încărca datele de trading");
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  // Filtrează trades după lună și an
  const filteredTrades = trades.filter(trade => {
    if (!trade.date) return false;
    const [year, month] = trade.date.split('-');
    return parseInt(year) === selectedYear && parseInt(month) === selectedMonth;
  });

  // Grupează trades pe zile
  const groupTradesByDate = () => {
    const grouped = {};
    filteredTrades.forEach(trade => {
      const date = trade.date || 'Unknown';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(trade);
    });
    
    // Sortează trade-urile din fiecare zi după sesiune, apoi după timestamp
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        const sessionOrder = { 'Asia': 1, 'Londra': 2, 'New York': 3 };
        const orderA = sessionOrder[a.session] || 999;
        const orderB = sessionOrder[b.session] || 999;
        
        // Dacă sunt pe aceeași sesiune, sortează după timestamp
        if (orderA === orderB) {
          // Încearcă să obții timestamp-ul din diferite formate
          const timestampA = a.timestamp?.seconds || a.timestamp?.toMillis?.() || a.createdAt || 0;
          const timestampB = b.timestamp?.seconds || b.timestamp?.toMillis?.() || b.createdAt || 0;
          return timestampA - timestampB; // De la cel mai vechi la cel mai nou
        }
        
        return orderA - orderB;
      });
    });
    
    return grouped;
  };

  // Calculează totalul de pips pentru o zi
  const calculateDayTotal = (dayTrades) => {
    return dayTrades.reduce((total, trade) => {
      const pips = parseFloat(trade.pips) || 0;
      return total + pips;
    }, 0);
  };

  // Calculează statistici pentru o zi
  const calculateDayStats = (dayTrades) => {
    const totalTrades = dayTrades.length;
    const tpTrades = dayTrades.filter(t => t.result === 'TP').length;
    const slTrades = dayTrades.filter(t => t.result === 'SL').length;
    const tpPips = dayTrades
      .filter(t => t.result === 'TP')
      .reduce((sum, t) => sum + (parseFloat(t.pips) || 0), 0);
    const slPips = dayTrades
      .filter(t => t.result === 'SL')
      .reduce((sum, t) => sum + (parseFloat(t.pips) || 0), 0);
    const netPips = calculateDayTotal(dayTrades);

    return { totalTrades, tpTrades, slTrades, tpPips, slPips, netPips };
  };

  // Calculează statistici generale pentru luna selectată
  const calculateMonthStats = () => {
    const totalTrades = filteredTrades.length;
    const tpTrades = filteredTrades.filter(t => t.result === 'TP').length;
    const slTrades = filteredTrades.filter(t => t.result === 'SL').length;
    const tpPips = filteredTrades
      .filter(t => t.result === 'TP')
      .reduce((sum, t) => sum + (parseFloat(t.pips) || 0), 0);
    const slPips = filteredTrades
      .filter(t => t.result === 'SL')
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.pips) || 0), 0);
    const netPips = calculateTotalPips();
    const winRate = totalTrades > 0 ? (tpTrades / totalTrades) * 100 : 0;

    return { totalTrades, tpTrades, slTrades, tpPips, slPips, netPips, winRate };
  };

  // Calculează statistici per sesiune
  const calculateSessionStats = () => {
    const sessions = ['Asia', 'Londra', 'New York'];
    return sessions.map(session => {
      const sessionTrades = filteredTrades.filter(t => t.session === session);
      const totalTrades = sessionTrades.length;
      const tpTrades = sessionTrades.filter(t => t.result === 'TP').length;
      const winRate = totalTrades > 0 ? (tpTrades / totalTrades) * 100 : 0;
      const totalPips = sessionTrades.reduce((sum, t) => sum + (parseFloat(t.pips) || 0), 0);
      
      return {
        session,
        totalTrades,
        winRate,
        totalPips
      };
    }).filter(stat => stat.totalTrades > 0); // Afișează doar sesiunile cu tradeuri
  };

  // Calculează totalul general
  const calculateTotalPips = () => {
    return filteredTrades.reduce((total, trade) => {
      const pips = parseFloat(trade.pips) || 0;
      return total + pips;
    }, 0);
  };

  // Formatează data
  const formatDate = (dateString) => {
    try {
      const [year, month, day] = dateString.split('-');
      const date = new Date(year, month - 1, day);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('ro-RO', options);
    } catch (err) {
      return dateString;
    }
  };

  // Generează lista de ani disponibili
  const getAvailableYears = () => {
    const years = new Set();
    trades.forEach(trade => {
      if (trade.date) {
        const year = parseInt(trade.date.split('-')[0]);
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  // Lunile anului
  const months = [
    { value: 1, label: 'Ianuarie' },
    { value: 2, label: 'Februarie' },
    { value: 3, label: 'Martie' },
    { value: 4, label: 'Aprilie' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Iunie' },
    { value: 7, label: 'Iulie' },
    { value: 8, label: 'August' },
    { value: 9, label: 'Septembrie' },
    { value: 10, label: 'Octombrie' },
    { value: 11, label: 'Noiembrie' },
    { value: 12, label: 'Decembrie' }
  ];

  const groupedTrades = groupTradesByDate();
  const totalPips = calculateTotalPips();
  const availableYears = getAvailableYears();
  const monthStats = calculateMonthStats();
  const sessionStats = calculateSessionStats();

  if (loading) {
    return (
      <div className="min-h-screen lot-calculator-app flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-amber-400"></div>
          <p className="mt-6 text-xl text-gray-300">Se încarcă journal-ul...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen lot-calculator-app flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 max-w-md mx-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (filteredTrades.length === 0) {
    return (
      <div className="min-h-screen lot-calculator-app flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-8 max-w-md mx-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl text-gray-300 mb-4">Nu există trade-uri pentru {months[selectedMonth - 1].label} {selectedYear}</p>
          <button
            onClick={() => {
              setSelectedMonth(new Date().getMonth() + 1);
              setSelectedYear(new Date().getFullYear());
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors duration-200"
          >
            Revino la luna curentă
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lot-calculator-app py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Buton înapoi */}
        <button
          onClick={() => navigate('/?tab=raport')}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-800/80 border border-gray-600/50 text-white rounded-lg hover:border-amber-400/50 hover:bg-gray-700/80 transition-all duration-200 group"
        >
          <svg 
            className="w-5 h-5 text-amber-400 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Înapoi la Raport</span>
        </button>

        {/* Filtre și Header cu total */}
        <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 md:p-6 mb-8 shadow-2xl hover:border-amber-400/50 transition-all duration-300">
          {/* Filtre */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-gray-600/30">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-semibold text-sm md:text-base">Filtrează după Lună</span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="flex-1 sm:flex-none px-4 py-3 md:py-2 bg-gray-800/80 border border-gray-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 hover:border-amber-400/50 transition-all duration-200 cursor-pointer text-base md:text-sm"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="flex-1 sm:flex-none px-4 py-3 md:py-2 bg-gray-800/80 border border-gray-600/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 hover:border-amber-400/50 transition-all duration-200 cursor-pointer text-base md:text-sm"
              >
                {availableYears.length > 0 ? (
                  availableYears.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))
                ) : (
                  <option value={selectedYear}>{selectedYear}</option>
                )}
              </select>
              <div className="flex items-center justify-center sm:justify-start px-3 py-2 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <span className="text-gray-300 text-sm font-medium">
                  {filteredTrades.length} {filteredTrades.length === 1 ? 'trade' : 'tradeuri'}
                </span>
              </div>
            </div>
          </div>

          {/* Total pips pentru luna selectată */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <span>📊</span>
                <span className="hidden sm:inline">Jurnal de trade</span>
                <span className="sm:hidden">Jurnal</span>
              </h1>
              <p className="text-gray-300 text-sm md:text-lg">
                {months[selectedMonth - 1].label} {selectedYear}: <span className="font-semibold text-amber-400">{filteredTrades.length}</span> trade-uri
              </p>
            </div>
            
            {/* Buton sortare zile */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800/80 border border-gray-600/50 text-white rounded-lg hover:border-amber-400/50 transition-all duration-200 group w-full sm:w-auto"
              title={sortOrder === 'desc' ? 'Sortare: De la ultima zi la prima' : 'Sortare: De la prima zi la prima'}
            >
              <svg 
                className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span className="text-sm">
                {sortOrder === 'desc' ? 'Ultima → Prima' : 'Prima → Ultima'}
              </span>
            </button>
            
            <div className="text-center md:text-right bg-gray-800/30 md:bg-transparent rounded-xl p-4 md:p-0">
              <p className="text-xs md:text-sm text-gray-400 mb-1">PIPS TOTAL</p>
              <p className={`text-4xl md:text-5xl font-bold ${
                totalPips >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {totalPips >= 0 ? '+' : ''}{totalPips.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de trades grupate pe zile */}
        <div className="space-y-6">
          {Object.entries(groupedTrades)
            .sort(([dateA], [dateB]) => {
              // Sortare în funcție de sortOrder
              if (sortOrder === 'desc') {
                return dateB.localeCompare(dateA); // De la ultima zi la prima
              } else {
                return dateA.localeCompare(dateB); // De la prima zi la ultima
              }
            })
            .map(([date, dayTrades]) => {
              const dayTotal = calculateDayTotal(dayTrades);
              const dayStats = calculateDayStats(dayTrades);
              return (
                <div key={date} className="bg-gray-800/40 backdrop-blur-xl border border-gray-600/40 rounded-2xl overflow-hidden shadow-xl hover:border-amber-400/30 transition-all duration-300">
                  {/* Header zi */}
                  <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 px-4 md:px-6 py-3 md:py-4 border-b border-gray-600/30">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h2 className="text-base md:text-lg font-semibold text-white">
                        {formatDate(date)}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm text-gray-400">pips total:</span>
                        <span className={`text-xl md:text-2xl font-bold ${
                          dayTotal >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {dayTotal >= 0 ? '+' : ''}{dayTotal.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lista trades pentru ziua respectiva */}
                  <div className="divide-y divide-gray-700/30">
                    {dayTrades.map((trade) => {
                      const pips = parseFloat(trade.pips) || 0;
                      return (
                        <div 
                          key={trade.id}
                          className="px-4 md:px-6 py-3 md:py-4 hover:bg-gray-700/30 transition-all duration-300 group border-l-4 border-transparent hover:border-amber-400/50"
                        >
                          {/* Layout Mobile - Compact */}
                          <div className="md:hidden">
                            <div className="flex items-center justify-between mb-2">
                              {/* Pereche și Rezultat */}
                              <div className="flex items-center gap-3">
                                <span className="text-amber-300 font-bold text-lg">{trade.pair || 'N/A'}</span>
                                {trade.result === 'TP' ? (
                                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-2 py-0.5 flex items-center gap-1">
                                    <span className="text-green-400 font-bold text-xs">TP</span>
                                  </div>
                                ) : trade.result === 'SL' ? (
                                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-2 py-0.5 flex items-center gap-1">
                                    <span className="text-red-400 font-bold text-xs">SL</span>
                                  </div>
                                ) : null}
                              </div>
                              {/* Pips */}
                              <span className={`text-xl font-bold ${
                                pips >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {pips >= 0 ? '+' : ''}{pips.toFixed(1)}
                              </span>
                            </div>
                            {/* Mentor și Sesiune */}
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span>{trade.mentor || 'N/A'}</span>
                              <span>•</span>
                              <span>{trade.session || 'N/A'}</span>
                            </div>
                            {/* Notes mobile */}
                            {trade.notes && trade.notes.trim() !== '' && (
                              <div className="mt-2 pt-2 border-t border-gray-700/30">
                                <p className="text-gray-300 text-xs leading-relaxed">{trade.notes}</p>
                              </div>
                            )}
                          </div>

                          {/* Layout Desktop - Detaliat */}
                          <div className="hidden md:block">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              {/* Informații trade */}
                              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Mentor */}
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                  <div>
                                    <p className="text-xs text-gray-400">Mentor</p>
                                    <p className="text-white font-medium">{trade.mentor || 'N/A'}</p>
                                  </div>
                                </div>

                                {/* Pereche */}
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                  </svg>
                                  <div>
                                    <p className="text-xs text-gray-400">Pereche</p>
                                    <p className="text-amber-300 font-bold text-lg">{trade.pair || 'N/A'}</p>
                                  </div>
                                </div>

                                {/* Sesiune */}
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-orange-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  <div>
                                    <p className="text-xs text-gray-400">Sesiune</p>
                                    <p className="text-white font-medium">{trade.session || 'N/A'}</p>
                                  </div>
                                </div>

                                {/* Rezultat */}
                                <div className="flex items-center gap-2">
                                  <div className="flex-shrink-0">
                                    {trade.result === 'TP' ? (
                                      <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-1 flex items-center gap-1">
                                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-green-400 font-bold text-sm">TP</span>
                                      </div>
                                    ) : trade.result === 'SL' ? (
                                      <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-1 flex items-center gap-1">
                                        <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-red-400 font-bold text-sm">SL</span>
                                      </div>
                                    ) : (
                                      <div className="bg-gray-500/20 border border-gray-500/50 rounded-lg px-3 py-1">
                                        <span className="text-gray-400 font-bold text-sm">N/A</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Pips */}
                              <div className="md:text-right md:min-w-[120px]">
                                <p className={`text-3xl font-bold ${
                                  pips >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                  {pips >= 0 ? '+' : ''}{pips.toFixed(1)}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">pips</p>
                              </div>
                            </div>

                            {/* Notes desktop */}
                            {trade.notes && trade.notes.trim() !== '' && (
                              <div className="mt-4 pt-4 border-t border-gray-700/30">
                                <div className="flex items-start gap-2">
                                  <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                  <div className="flex-1">
                                    <p className="text-xs text-gray-400 mb-1">Notițe</p>
                                    <p className="text-gray-300 text-sm leading-relaxed">{trade.notes}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Statistici zilnice */}
                  <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 px-4 md:px-6 py-3 md:py-4 border-t border-gray-600/30">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      {/* Total Trades */}
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-700/30">
                        <p className="text-xs text-gray-400 mb-1">Total Trades</p>
                        <p className="text-xl md:text-2xl font-bold text-white">{dayStats.totalTrades}</p>
                      </div>

                      {/* Câștigate (TP) */}
                      <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-green-500/20">
                        <p className="text-xs text-gray-400 mb-1">Câștigate (TP)</p>
                        <p className="text-xl md:text-2xl font-bold text-green-400">{dayStats.tpTrades}</p>
                        <p className="text-xs text-green-300 mt-1">+{dayStats.tpPips.toFixed(1)} pips</p>
                      </div>

                      {/* Pierdute (SL) */}
                      <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-red-500/20">
                        <p className="text-xs text-gray-400 mb-1">Pierdute (SL)</p>
                        <p className="text-xl md:text-2xl font-bold text-red-400">{dayStats.slTrades}</p>
                        <p className="text-xs text-red-300 mt-1">{dayStats.slPips.toFixed(1)} pips</p>
                      </div>

                      {/* Pips Net */}
                      <div className={`backdrop-blur-sm rounded-xl p-3 md:p-4 border ${
                        dayStats.netPips >= 0 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-red-500/10 border-red-500/30'
                      }`}>
                        <p className="text-xs text-gray-400 mb-1">Pips Net</p>
                        <p className={`text-xl md:text-2xl font-bold ${
                          dayStats.netPips >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {dayStats.netPips >= 0 ? '+' : ''}{dayStats.netPips.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 hidden md:block">profit - pierdere</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Statistici Generale Luna */}
        {filteredTrades.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-600/30">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Statistici {months[selectedMonth - 1].label} {selectedYear}
              </h2>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Tradeuri</p>
                <p className="text-3xl font-bold text-amber-400">{monthStats.totalTrades}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Pips Câștigați */}
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 shadow-lg hover:shadow-green-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Total Pips Câștigați</p>
                    <p className="text-4xl font-bold text-green-400">+{monthStats.tpPips.toFixed(1)}</p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-green-300">{monthStats.tpTrades} trade-uri câștigătoare</p>
              </div>

              {/* Total Pips Pierduți */}
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 shadow-lg hover:shadow-red-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Total Pips Pierduți</p>
                    <p className="text-4xl font-bold text-red-400">-{monthStats.slPips.toFixed(1)}</p>
                  </div>
                  <div className="bg-red-500/20 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-red-300">{monthStats.slTrades} trade-uri pierzătoare</p>
              </div>

              {/* Pips Net */}
              <div className={`bg-gradient-to-br backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 shadow-lg ${
                monthStats.netPips >= 0 
                  ? 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/20' 
                  : 'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-400/50 hover:shadow-red-500/20'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Pips Net</p>
                    <p className={`text-4xl font-bold ${
                      monthStats.netPips >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {monthStats.netPips >= 0 ? '+' : ''}{monthStats.netPips.toFixed(1)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    monthStats.netPips >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      monthStats.netPips >= 0 ? 'text-green-400' : 'text-red-400'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-400">profit - pierdere</p>
              </div>

              {/* Win Rate */}
              <div className={`bg-gradient-to-br backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 shadow-lg ${
                monthStats.winRate >= 50 
                  ? 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/20' 
                  : 'from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-400/50 hover:shadow-amber-500/20'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Win Rate</p>
                    <p className={`text-4xl font-bold ${
                      monthStats.winRate >= 50 ? 'text-green-400' : 'text-amber-400'
                    }`}>
                      {monthStats.winRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    monthStats.winRate >= 50 ? 'bg-green-500/20' : 'bg-amber-500/20'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      monthStats.winRate >= 50 ? 'text-green-400' : 'text-amber-400'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{monthStats.tpTrades}W / {monthStats.slTrades}L</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistici per Sesiune */}
        {filteredTrades.length > 0 && sessionStats.length > 0 && (
          <div className="mt-6 bg-gray-800/40 backdrop-blur-xl border border-gray-600/40 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl font-bold text-white">Statistici per Sesiune</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sessionStats.map(stat => (
                <div 
                  key={stat.session}
                  className="bg-gradient-to-br from-gray-700/40 to-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 hover:border-amber-400/40 transition-all duration-300"
                >
                  <h4 className="text-lg font-semibold text-amber-400 mb-4">{stat.session}</h4>
                  
                  <div className="space-y-3">
                    {/* Tradeuri */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Tradeuri:</span>
                      <span className="text-xl font-bold text-white">{stat.totalTrades}</span>
                    </div>

                    {/* Win Rate */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Win Rate:</span>
                      <span className={`text-xl font-bold ${
                        stat.winRate >= 50 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.winRate.toFixed(1)}%
                      </span>
                    </div>

                    {/* Total Pips */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-600/30">
                      <span className="text-sm text-gray-400">Total:</span>
                      <span className={`text-2xl font-bold ${
                        stat.totalPips >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.totalPips >= 0 ? '+' : ''}{stat.totalPips.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveJournal;
