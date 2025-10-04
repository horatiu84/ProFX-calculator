import React, { useState, useEffect } from "react";
import ReportsModal from "./components/ReportsModal";

const TradingJournal = () => {
  // State variables for managing account balance, trades, and modals
  const [accountBalance, setAccountBalance] = useState(() => {
    const saved = localStorage.getItem("accountBalance");
    return saved ? parseFloat(saved) : 0;
  });
  const [initialBalance, setInitialBalance] = useState(() => {
    const saved = localStorage.getItem("initialBalance");
    return saved ? parseFloat(saved) : 0;
  });
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [trades, setTrades] = useState(() => {
    const saved = localStorage.getItem("trades");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  // Pagination, sorting, and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [tradesPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [filterPeriod, setFilterPeriod] = useState('all'); // 'all', 'week', 'month', 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Default structure for a new trade
  const [newTrade, setNewTrade] = useState({
    pair: "",
    lotSize: "",
    type: "buy", // Trade type: buy or sell
    pips: "", // Number of pips gained or lost
    result: "tp", // Result of the trade: take profit (tp) or stop loss (sl)
    source: "semnale", // Source of the trade signal
    mentor: "Mihai", // Mentor associated with the trade
    notes: "", // Additional notes for the trade
  });

  // Trading pairs categorized by type with pip values and locations
  const tradingPairs = {
    Commodities: {
      XAUUSD: { pipValue: 10, pipLocation: 2 },
      XTIUSD: { pipValue: 10, pipLocation: 2 },
      XAGUSD: { pipValue: 50, pipLocation: 3 },
    },
    "Forex Majors": {
      AUDUSD: { pipValue: 10, pipLocation: 4 },
      EURUSD: { pipValue: 10, pipLocation: 4 },
      GBPUSD: { pipValue: 10, pipLocation: 4 },
      NZDUSD: { pipValue: 10, pipLocation: 4 },
      USDCAD: { pipValue: 6.93, pipLocation: 4 },
      USDCHF: { pipValue: 11.08, pipLocation: 4 },
      USDJPY: { pipValue: 6.65, pipLocation: 2 },
    },
    "Forex Cross": {
      AUDCAD: { pipValue: 6.93, pipLocation: 4 },
      AUDCHF: { pipValue: 11.08, pipLocation: 4 },
      AUDJPY: { pipValue: 6.65, pipLocation: 2 },
      AUDNZD: { pipValue: 5.6, pipLocation: 4 },
      CADCHF: { pipValue: 11.08, pipLocation: 4 },
      CADJPY: { pipValue: 6.65, pipLocation: 2 },
      CHFJPY: { pipValue: 6.65, pipLocation: 2 },
      EURAUD: { pipValue: 6.21, pipLocation: 4 },
      EURCAD: { pipValue: 6.93, pipLocation: 4 },
      EURCHF: { pipValue: 11.08, pipLocation: 4 },
      EURGBP: { pipValue: 12.6, pipLocation: 4 },
      EURJPY: { pipValue: 6.65, pipLocation: 2 },
      EURNZD: { pipValue: 5.6, pipLocation: 4 },
      GBPAUD: { pipValue: 6.21, pipLocation: 4 },
      GBPCAD: { pipValue: 6.93, pipLocation: 4 },
      GBPCHF: { pipValue: 11.08, pipLocation: 4 },
      GBPJPY: { pipValue: 6.65, pipLocation: 2 },
      GBPNZD: { pipValue: 5.6, pipLocation: 4 },
      NZDCAD: { pipValue: 6.93, pipLocation: 4 },
      NZDCHF: { pipValue: 11.08, pipLocation: 4 },
      NZDJPY: { pipValue: 6.65, pipLocation: 2 },
    },
    Indices: {
      US30: { pipValue: 1, pipLocation: 0 },
      US500: { pipValue: 1, pipLocation: 0 },
      NAS100: { pipValue: 1, pipLocation: 0 },
      DE30: { pipValue: 1, pipLocation: 0 },
      UK100: { pipValue: 1, pipLocation: 0 },
    },
  };

  // Flatten trading pairs into a single object for easier access
  const allPairs = Object.entries(tradingPairs).reduce(
    (acc, [category, pairs]) => {
      Object.entries(pairs).forEach(([pair, data]) => {
        acc[pair] = { ...data, category };
      });
      return acc;
    },
    {}
  );

  // List of mentors available for selection
  const mentors = ["Mihai", "Flavius", "Eli", "Tudor", "John", "Daniel", "Altcineva"];

  // Synchronize trades and balances with localStorage
  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem("accountBalance", accountBalance.toString());
  }, [accountBalance]);

  useEffect(() => {
    localStorage.setItem("initialBalance", initialBalance.toString());
  }, [initialBalance]);

  useEffect(() => {
    if (!initialBalance || initialBalance === 0) {
      setShowBalanceModal(true);
    }
  }, []);

  // Sincronizare localStorage între tab-uri și resize-uri
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "trades" && e.newValue) {
        setTrades(JSON.parse(e.newValue));
      }
      if (e.key === "accountBalance" && e.newValue) {
        setAccountBalance(parseFloat(e.newValue));
      }
      if (e.key === "initialBalance" && e.newValue) {
        setInitialBalance(parseFloat(e.newValue));
      }
    };

    const reloadFromStorage = () => {
      const savedTrades = localStorage.getItem("trades");
      const savedBalance = localStorage.getItem("accountBalance");
      const savedInitial = localStorage.getItem("initialBalance");
      
      if (savedTrades) setTrades(JSON.parse(savedTrades));
      if (savedBalance) setAccountBalance(parseFloat(savedBalance));
      if (savedInitial) setInitialBalance(parseFloat(savedInitial));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("resize", reloadFromStorage);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("resize", reloadFromStorage);
    };
  }, []);

  // Calculate profit or loss for a trade based on its details
  const calculateProfitLoss = (pair, lotSize, pips, result) => {
    const pairData = allPairs[pair];
    if (!pairData) return 0;

    const profitLoss = lotSize * pips * pairData.pipValue;
    return result === "tp" ? profitLoss : -profitLoss;
  };

  // Set the initial balance for the account
  const handleSetInitialBalance = (balance) => {
    const bal = parseFloat(balance);
    if (isNaN(bal) || bal <= 0) {
      alert("Te rog introdu o valoare validă!");
      return;
    }
    
    if (trades.length > 0) {
      const totalPL = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
      setInitialBalance(bal);
      setAccountBalance(bal + totalPL);
    } else {
      setInitialBalance(bal);
      setAccountBalance(bal);
    }
    setShowBalanceModal(false);
  };

  // Add a new trade to the journal
  const handleAddTrade = () => {
    if (!newTrade.pair || !newTrade.lotSize || !newTrade.pips) {
      alert("Te rog completează toate câmpurile obligatorii!");
      return;
    }

    const profitLoss = calculateProfitLoss(
      newTrade.pair,
      parseFloat(newTrade.lotSize),
      parseFloat(newTrade.pips),
      newTrade.result
    );

    const now = new Date();
    const trade = {
      id: Date.now(),
      date: now.toISOString(), // Use ISO string for better date filtering
      displayDate: now.toLocaleDateString("ro-RO"), // Keep display date for UI
      time: now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
      ...newTrade,
      lotSize: parseFloat(newTrade.lotSize),
      pips: parseFloat(newTrade.pips),
      profitLoss: profitLoss,
    };

    setTrades([trade, ...trades]);
    setAccountBalance(accountBalance + profitLoss);
    setShowAddModal(false);
    setNewTrade({
      pair: "",
      lotSize: "",
      type: "buy",
      pips: "",
      result: "tp",
      source: "semnale",
      mentor: "Mihai",
      notes: "",
    });
  };

  // Delete a trade from the journal by its ID
  const handleDeleteTrade = (id) => {
    const trade = trades.find((t) => t.id === id);
    if (trade && window.confirm("Ești sigur că vrei să ștergi acest trade?")) {
      setAccountBalance(accountBalance - trade.profitLoss);
      setTrades(trades.filter((t) => t.id !== id));
    }
  };

  // View details of a selected trade
  const handleViewTrade = (trade) => {
    setSelectedTrade(trade);
    setShowViewModal(true);
  };

  // Format numbers to a specific decimal precision
  const formatNumber = (number, decimals = 2) => {
    if (isNaN(number)) return "0,00";
    const formattedNumber = number.toFixed(decimals);
    const parts = formattedNumber.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  };

  // Parse trade date handling different formats
  const parseTradeDate = (trade) => {
    let tradeDate;
    
    if (trade.date) {
      // First check if it's already a valid ISO string
      if (trade.date.includes('T') && trade.date.includes('Z')) {
        tradeDate = new Date(trade.date);
      } else {
        // Handle Romanian date format dd.mm.yyyy
        const dateStr = trade.date.toString();
        const parts = dateStr.split(/[.\/-]/);
        
        if (parts.length === 3) {
          const part1 = parseInt(parts[0]);
          const part2 = parseInt(parts[1]);
          const part3 = parseInt(parts[2]);
          
          // Determine format based on values
          if (part3 > 1900) {
            // Format: dd.mm.yyyy or mm.dd.yyyy
            if (part1 > 12) {
              // Must be dd.mm.yyyy
              tradeDate = new Date(part3, part2 - 1, part1);
            } else if (part2 > 12) {
              // Must be mm.dd.yyyy  
              tradeDate = new Date(part3, part1 - 1, part2);
            } else {
              // Assume Romanian format dd.mm.yyyy
              tradeDate = new Date(part3, part2 - 1, part1);
            }
          } else {
            // Try as direct Date constructor
            tradeDate = new Date(dateStr);
          }
        } else {
          // Try parsing as-is
          tradeDate = new Date(dateStr);
        }
      }
    }
    
    // If still invalid, use current date as fallback
    if (!tradeDate || isNaN(tradeDate.getTime())) {
      tradeDate = new Date();
    }
    
    return tradeDate;
  };

  // Get date range based on filter period
  const getFilterDateRange = () => {
    const now = new Date();
    let startDate, endDate;

    if (filterPeriod === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
    } else if (filterPeriod === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
    } else if (filterPeriod === 'custom') {
      startDate = customStartDate ? new Date(customStartDate) : new Date(0);
      startDate.setHours(0, 0, 0, 0);
      endDate = customEndDate ? new Date(customEndDate) : new Date(now);
      endDate.setHours(23, 59, 59, 999);
    }

    return { startDate, endDate };
  };

  // Filter and sort trades based on current settings
  const getFilteredAndSortedTrades = () => {
    let filteredTrades = [...trades];

    // Apply date filter
    if (filterPeriod !== 'all') {
      const { startDate, endDate } = getFilterDateRange();
      filteredTrades = trades.filter(trade => {
        const tradeDate = parseTradeDate(trade);
        return tradeDate >= startDate && tradeDate <= endDate;
      });
    }

    // Apply sorting
    filteredTrades.sort((a, b) => {
      const dateA = parseTradeDate(a);
      const dateB = parseTradeDate(b);
      
      if (sortOrder === 'newest') {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

    return filteredTrades;
  };

  // Get current page trades
  const getCurrentPageTrades = () => {
    const filteredTrades = getFilteredAndSortedTrades();
    const indexOfLastTrade = currentPage * tradesPerPage;
    const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
    return filteredTrades.slice(indexOfFirstTrade, indexOfLastTrade);
  };

  // Get pagination info
  const getPaginationInfo = () => {
    const filteredTrades = getFilteredAndSortedTrades();
    const totalTrades = filteredTrades.length;
    const totalPages = Math.ceil(totalTrades / tradesPerPage);
    const startTrade = (currentPage - 1) * tradesPerPage + 1;
    const endTrade = Math.min(currentPage * tradesPerPage, totalTrades);
    
    return { totalTrades, totalPages, startTrade, endTrade };
  };

  // Reset to first page when filters change
  const handleFilterChange = (newFilter) => {
    setFilterPeriod(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortOrder(newSort);
    setCurrentPage(1);
  };

  // Calculate total profit, total loss, and win rate from trades
  const totalProfit = trades.reduce((sum, t) => sum + (t.profitLoss > 0 ? t.profitLoss : 0), 0);
  const totalLoss = trades.reduce((sum, t) => sum + (t.profitLoss < 0 ? Math.abs(t.profitLoss) : 0), 0);
  const winRate = trades.length > 0 ? (trades.filter(t => t.profitLoss > 0).length / trades.length * 100) : 0;

  return (
    <div className="min-h-screen text-white p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                📖 Jurnal Trade
              </h1>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">Monitorizează-ți performanța de trading</p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowBalanceModal(true)}
                className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 sm:px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-600 text-sm sm:text-base whitespace-nowrap"
              >
                ⚙️ <span className="hidden sm:inline">Modifică Sold</span><span className="sm:hidden">Sold</span>
              </button>
              <button
                onClick={() => setShowReportsModal(true)}
                className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 sm:px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
              >
                📊 <span className="hidden sm:inline">Rapoarte</span><span className="sm:hidden">Rap</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold px-4 sm:px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
              >
                + <span className="hidden sm:inline">Adaugă Trade</span><span className="sm:hidden">Trade</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
              <div className="text-gray-400 text-xs sm:text-sm mb-2">Sold Cont</div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                ${formatNumber(accountBalance)}
              </div>
              <div className={`text-xs sm:text-sm mt-2 ${accountBalance >= initialBalance ? "text-green-400" : "text-red-400"}`}>
                {accountBalance >= initialBalance ? "+" : ""}{formatNumber(accountBalance - initialBalance)} ({((accountBalance - initialBalance) / initialBalance * 100).toFixed(2)}%)
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
              <div className="text-gray-400 text-xs sm:text-sm mb-2">Total Profit</div>
              <div className="text-2xl sm:text-3xl font-bold text-green-400">
                ${formatNumber(totalProfit)}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 mt-2">
                {trades.filter(t => t.profitLoss > 0).length} trades câștigătoare
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
              <div className="text-gray-400 text-xs sm:text-sm mb-2">Total Loss</div>
              <div className="text-2xl sm:text-3xl font-bold text-red-400">
                ${formatNumber(totalLoss)}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 mt-2">
                {trades.filter(t => t.profitLoss < 0).length} trades pierzătoare
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
              <div className="text-gray-400 text-xs sm:text-sm mb-2">Win Rate</div>
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                {winRate.toFixed(1)}%
              </div>
              <div className="text-xs sm:text-sm text-gray-400 mt-2">
                {trades.length} total trades
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Pagination Controls */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl mb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Perioada:</label>
                <select 
                  value={filterPeriod} 
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  <option value="all">Toate trade-urile</option>
                  <option value="week">Ultimele 7 zile</option>
                  <option value="month">Luna aceasta</option>
                  <option value="custom">Perioada personalizată</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Sortare:</label>
                <select 
                  value={sortOrder} 
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  <option value="newest">Cel mai recent → Cel mai vechi</option>
                  <option value="oldest">Cel mai vechi → Cel mai recent</option>
                </select>
              </div>

              {filterPeriod === 'custom' && (
                <div className="flex gap-2">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">De la:</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Până la:</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Info */}
            <div className="text-sm text-gray-400">
              {(() => {
                const { totalTrades, startTrade, endTrade } = getPaginationInfo();
                return totalTrades > 0 
                  ? `Afișând ${startTrade}-${endTrade} din ${totalTrades} trade-uri`
                  : 'Niciun trade găsit';
              })()}
            </div>
          </div>
        </div>

        {/* Trades Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Mobile Cards View */}
          <div className="block lg:hidden">
            {getCurrentPageTrades().length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400">
                <div className="flex flex-col items-center">
                  <div className="text-6xl mb-4">📊</div>
                  {trades.length === 0 ? (
                    <>
                      <p className="text-lg">Nu ai niciun trade înregistrat încă</p>
                      <p className="text-sm mt-2">Începe prin a adăuga primul tău trade!</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg">Nu sunt trade-uri în perioada selectată</p>
                      <p className="text-sm mt-2">Încearcă să schimbi filtrele de mai sus</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {getCurrentPageTrades().map((trade) => (
                  <div key={trade.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 cursor-pointer" onClick={() => handleViewTrade(trade)}>
                        <div className="font-semibold text-yellow-400 text-lg">{trade.pair}</div>
                        <div className="text-xs text-gray-400">{trade.displayDate || trade.date} • {trade.time}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteTrade(trade.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3 cursor-pointer" onClick={() => handleViewTrade(trade)}>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Tip</div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          trade.type === "buy" 
                            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}>
                          {trade.type.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Rezultat</div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          trade.result === "tp" 
                            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}>
                          {trade.result.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Lot</div>
                        <div className="text-sm font-medium">{formatNumber(trade.lotSize)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Pips</div>
                        <div className="text-sm font-medium">{trade.pips}</div>
                      </div>
                    </div>

                    <div className="mb-3 cursor-pointer" onClick={() => handleViewTrade(trade)}>
                      <div className="text-xs text-gray-400 mb-1">P/L</div>
                      <span className={`text-lg font-bold ${trade.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {trade.profitLoss >= 0 ? "+" : "-"}${formatNumber(Math.abs(trade.profitLoss))}
                      </span>
                    </div>

                    <div className="mb-3 cursor-pointer" onClick={() => handleViewTrade(trade)}>
                      <div className="text-xs text-gray-400 mb-1">Sursă</div>
                      {trade.source === "semnale" ? (
                        <div>
                          <div className="text-purple-400 text-sm">Semnale</div>
                          <div className="text-xs text-gray-400">{trade.mentor}</div>
                        </div>
                      ) : (
                        <div className="text-blue-400 text-sm">Proprii</div>
                      )}
                    </div>

                    {trade.notes && (
                      <div className="cursor-pointer" onClick={() => handleViewTrade(trade)}>
                        <div className="text-xs text-gray-400 mb-1">Note</div>
                        <div className="text-sm text-gray-300 line-clamp-2">{trade.notes}</div>
                        <div className="text-xs text-blue-400 mt-1">Click pentru detalii complete →</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Pagination */}
            {(() => {
              const { totalPages } = getPaginationInfo();
              const filteredTradesLength = getFilteredAndSortedTrades().length;
              
              return filteredTradesLength > tradesPerPage && (
                <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex flex-col items-center gap-3">
                  <div className="text-sm text-gray-400">
                    Pagina {currentPage} din {totalPages}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentPage === 1 
                          ? 'text-gray-500 cursor-not-allowed bg-gray-800' 
                          : 'text-white bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      ‹ Anterior
                    </button>
                    
                    <span className="px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg text-sm font-medium">
                      {currentPage}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentPage === totalPages 
                          ? 'text-gray-500 cursor-not-allowed bg-gray-800' 
                          : 'text-white bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      Următorul ›
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Data</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Pereche</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Tip</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Lot</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Pips</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Rezultat</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">P/L</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Sursă</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Note</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {getCurrentPageTrades().length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center">
                        <div className="text-6xl mb-4">📊</div>
                        {trades.length === 0 ? (
                          <>
                            <p className="text-lg">Nu ai niciun trade înregistrat încă</p>
                            <p className="text-sm mt-2">Începe prin a adăuga primul tău trade!</p>
                          </>
                        ) : (
                          <>
                            <p className="text-lg">Nu sunt trade-uri în perioada selectată</p>
                            <p className="text-sm mt-2">Încearcă să schimbi filtrele de mai sus</p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  getCurrentPageTrades().map((trade) => (
                    <tr key={trade.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleViewTrade(trade)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>{trade.displayDate || trade.date}</div>
                        <div className="text-gray-400 text-xs">{trade.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-yellow-400">{trade.pair}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          trade.type === "buy" 
                            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}>
                          {trade.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatNumber(trade.lotSize)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{trade.pips}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          trade.result === "tp" 
                            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}>
                          {trade.result.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-bold ${trade.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {trade.profitLoss >= 0 ? "+" : "-"}${formatNumber(Math.abs(trade.profitLoss))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {trade.source === "semnale" ? (
                          <div>
                            <div className="text-purple-400">Semnale</div>
                            <div className="text-xs text-gray-400">{trade.mentor}</div>
                          </div>
                        ) : (
                          <div className="text-blue-400">Proprii</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm max-w-xs">
                        <div className="truncate" title={trade.notes}>
                          {trade.notes || "-"}
                        </div>
                        {trade.notes && (
                          <div className="text-xs text-blue-400 mt-1">Click pentru detalii →</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTrade(trade.id);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {(() => {
            const { totalPages } = getPaginationInfo();
            const filteredTradesLength = getFilteredAndSortedTrades().length;
            
            return filteredTradesLength > tradesPerPage && (
              <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-400">
                  Pagina {currentPage} din {totalPages}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      currentPage === 1 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    ««
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      currentPage === 1 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    ‹
                  </button>

                  {/* Page Numbers */}
                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                    
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                            currentPage === i 
                              ? 'bg-yellow-400 text-gray-900' 
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    return pages;
                  })()}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      currentPage === totalPages 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    ›
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      currentPage === totalPages 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    »»
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Initial Balance Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              {initialBalance > 0 ? "Modifică mărimea contului" : "Setează mărimea contului"}
            </h2>
            <p className="text-gray-300 mb-2">
              {initialBalance > 0 
                ? "Introdu noul sold inițial al contului:" 
                : "Introdu soldul inițial al contului tău de trading:"}
            </p>
            {initialBalance > 0 && (
              <p className="text-sm text-yellow-400 mb-4">
                ⚠️ Soldul actual va fi recalculat automat bazat pe toate trade-urile existente
              </p>
            )}
            <input
              type="number"
              defaultValue={initialBalance > 0 ? initialBalance : ""}
              placeholder="10000"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 mb-6"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSetInitialBalance(e.target.value);
                }
              }}
            />
            <div className="flex gap-3">
              {initialBalance > 0 && (
                <button
                  onClick={() => setShowBalanceModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all duration-200 border border-gray-600"
                >
                  Anulează
                </button>
              )}
              <button
                onClick={(e) => {
                  const input = e.target.parentElement.previousElementSibling;
                  handleSetInitialBalance(input.value);
                }}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-3 rounded-xl transition-all duration-200"
              >
                Confirmă
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Trade Details Modal - MODALUL MODIFICAT */}
      {showViewModal && selectedTrade && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 p-4"
          onClick={() => setShowViewModal(false)}
        >
          <div className="flex items-start justify-center min-h-screen py-4">
            <div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">Detalii Trade</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Header Info */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-3xl font-bold text-yellow-400 mb-2">{selectedTrade.pair}</div>
                      <div className="text-sm text-gray-400">{selectedTrade.displayDate || selectedTrade.date} • {selectedTrade.time}</div>
                    </div>
                    <div className={`text-3xl font-bold ${selectedTrade.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {selectedTrade.profitLoss >= 0 ? "+" : "-"}${formatNumber(Math.abs(selectedTrade.profitLoss))}
                    </div>
                  </div>
                </div>

                {/* Trade Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-400 mb-2">Tip Tranzacție</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedTrade.type === "buy" 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                      {selectedTrade.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-400 mb-2">Rezultat</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedTrade.result === "tp" 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                      {selectedTrade.result === "tp" ? "TAKE PROFIT" : "STOP LOSS"}
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-400 mb-2">Mărime Lot</div>
                    <div className="text-xl font-bold text-white">{formatNumber(selectedTrade.lotSize)}</div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-400 mb-2">Pips</div>
                    <div className="text-xl font-bold text-white">{selectedTrade.pips}</div>
                  </div>
                </div>

                {/* Source Info */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-xs text-gray-400 mb-2">Sursă Trade</div>
                  {selectedTrade.source === "semnale" ? (
                    <div>
                      <div className="text-lg font-semibold text-purple-400">📡 Semnale Mentor</div>
                      <div className="text-sm text-gray-300 mt-1">Mentor: <span className="text-yellow-400 font-semibold">{selectedTrade.mentor}</span></div>
                    </div>
                  ) : (
                    <div className="text-lg font-semibold text-blue-400">💡 Trade-uri Proprii</div>
                  )}
                </div>

                {/* Pip Value Info */}
                {allPairs[selectedTrade.pair] && (
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                    <div className="text-xs text-blue-300 mb-2">ℹ️ Informații Tehnice</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Categorie: </span>
                        <span className="text-white font-semibold">{allPairs[selectedTrade.pair].category}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Valoare pip/lot: </span>
                        <span className="text-green-400 font-semibold">${allPairs[selectedTrade.pair].pipValue}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                {selectedTrade.notes && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-400 mb-3 flex items-center">
                      <span className="mr-2">📝</span> Observații
                    </div>
                    <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      {selectedTrade.notes}
                    </div>
                  </div>
                )}

                {/* Calculation Breakdown */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
                  <div className="text-xs text-yellow-300 mb-3">🧮 Calculul P/L</div>
                  <div className="text-sm text-gray-300 space-y-1 font-mono">
                    <div>Lot Size: {formatNumber(selectedTrade.lotSize)}</div>
                    <div>Pips: {selectedTrade.pips}</div>
                    <div>Pip Value: ${allPairs[selectedTrade.pair]?.pipValue || 0}</div>
                    <div className="border-t border-yellow-500/30 pt-2 mt-2">
                      <span className="text-gray-400">Formula: </span>
                      {formatNumber(selectedTrade.lotSize)} × {selectedTrade.pips} × ${allPairs[selectedTrade.pair]?.pipValue || 0}
                    </div>
                    <div className={`text-lg font-bold ${selectedTrade.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                      = {selectedTrade.profitLoss >= 0 ? "+" : "-"}${formatNumber(Math.abs(selectedTrade.profitLoss))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all duration-200 border border-gray-600"
                >
                  Închide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Trade Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div className="flex items-start justify-center min-h-screen py-4">
            <div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 text-yellow-400">Adaugă Trade Nou</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Pereche valutară *</label>
                  <select
                    value={newTrade.pair}
                    onChange={(e) => setNewTrade({ ...newTrade, pair: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  >
                    <option value="">Selectează...</option>
                    {Object.entries(tradingPairs).map(([category, pairs]) => (
                      <optgroup key={category} label={category}>
                        {Object.keys(pairs).map((pair) => (
                          <option key={pair} value={pair}>{pair}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Mărime lot *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTrade.lotSize}
                    onChange={(e) => setNewTrade({ ...newTrade, lotSize: e.target.value })}
                    placeholder="0.10"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Tip tranzacție</label>
                  <select
                    value={newTrade.type}
                    onChange={(e) => setNewTrade({ ...newTrade, type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  >
                    <option value="buy">BUY</option>
                    <option value="sell">SELL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Pips *</label>
                  <input
                    type="number"
                    value={newTrade.pips}
                    onChange={(e) => setNewTrade({ ...newTrade, pips: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Rezultat</label>
                  <select
                    value={newTrade.result}
                    onChange={(e) => setNewTrade({ ...newTrade, result: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  >
                    <option value="tp">Take Profit (TP)</option>
                    <option value="sl">Stop Loss (SL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Sursă</label>
                  <select
                    value={newTrade.source}
                    onChange={(e) => setNewTrade({ ...newTrade, source: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  >
                    <option value="semnale">Semnale mentor</option>
                    <option value="proprii">Trade-uri proprii</option>
                  </select>
                </div>

                {newTrade.source === "semnale" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Mentor</label>
                    <select
                      value={newTrade.mentor}
                      onChange={(e) => setNewTrade({ ...newTrade, mentor: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    >
                      {mentors.map((mentor) => (
                        <option key={mentor} value={mentor}>{mentor}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className={newTrade.source === "semnale" ? "md:col-span-1" : "md:col-span-2"}>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Observații</label>
                  <textarea
                    value={newTrade.notes}
                    onChange={(e) => setNewTrade({ ...newTrade, notes: e.target.value })}
                    placeholder="Adaugă note despre acest trade..."
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none"
                  />
                </div>
              </div>

              {newTrade.pair && newTrade.lotSize && newTrade.pips && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-sm text-gray-300 mb-2">Preview profit/pierdere:</div>
                  <div className={`text-2xl font-bold ${
                    newTrade.result === "tp" ? "text-green-400" : "text-red-400"
                  }`}>
                    {newTrade.result === "tp" ? "+" : "-"}$
                    {formatNumber(Math.abs(calculateProfitLoss(
                      newTrade.pair,
                      parseFloat(newTrade.lotSize),
                      parseFloat(newTrade.pips),
                      newTrade.result
                    )))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all duration-200 border border-gray-600"
                >
                  Anulează
                </button>
                <button
                  onClick={handleAddTrade}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-3 rounded-xl transition-all duration-200"
                >
                  Salvează Trade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      <ReportsModal
        trades={trades}
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        accountBalance={accountBalance}
        initialBalance={initialBalance}
      />
    </div>
  );
};

export default TradingJournal;
