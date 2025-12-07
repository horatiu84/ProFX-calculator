import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import ProFXbookCalendar from "./ProFXbookCalendar";
import ProFXDoctor from "./ProFXDoctor";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  ReferenceLine,
} from "recharts";

// Custom tooltip pentru growth chart combinat (afișează procente și daily profit)
const CustomGrowthTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const growthPercent = data.growth || 0;
    const dailyProfit = data.dailyProfit || 0;
    const balanceValue = data.balance || 0;
    
    return (
      <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-lg p-3 shadow-xl">
        <p className="text-gray-300 text-sm font-semibold mb-2">{data.date}</p>
        <div className="space-y-1">
          <p className={`font-bold text-base ${growthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            Growth: {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(2)}%
          </p>
          <p className={`text-sm ${dailyProfit >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
            Daily: {dailyProfit >= 0 ? '+' : ''}{dailyProfit.toFixed(2)}%
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Balance: ${balanceValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Funcție pentru generarea de date random pentru un cont
const generateRandomAccountData = (initialBalance = 2000) => {
  const balance = initialBalance;
  
  // Pentru TOTAL (all) - date cumulative pe 10 luni
  const totalGain = (Math.random() * 200 + 80).toFixed(2); // între 80% și 280%
  const totalTrades = Math.floor(Math.random() * 800 + 500); // între 500 și 1300 trades
  const totalWinRate = (Math.random() * 25 + 60).toFixed(1); // între 60% și 85%
  const totalCurrentBalance = (balance * (1 + parseFloat(totalGain) / 100)).toFixed(2);
  const totalEquity = totalCurrentBalance;
  const totalProfit = (totalCurrentBalance - balance).toFixed(2);
  const totalDrawdown = (Math.random() * 30 + 5).toFixed(2); // între 5% și 35%
  
  // Pentru luna curentă
  const monthly = (Math.random() * 15 + 1).toFixed(2); // între 1% și 16%
  const daily = (Math.random() * 0.5 + 0.05).toFixed(2); // între 0.05% și 0.55%

  // Generare date lunare
  const monthlyData = [];
  const months = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct"];
  let runningBalance = balance;
  
  for (let i = 0; i < 10; i++) {
    const monthReturn = (Math.random() * 20 - 2).toFixed(2); // între -2% și 18%
    const monthProfit = (runningBalance * parseFloat(monthReturn) / 100).toFixed(2);
    runningBalance += parseFloat(monthProfit);
    
    monthlyData.push({
      month: months[i],
      return: parseFloat(monthReturn),
      profit: parseFloat(monthProfit)
    });
  }

  // Generare date pentru growth chart cu daily profit bars
  const growthData = [];
  let growthBalance = balance;
  const tradingDaysToGenerate = 100; // ~20 weeks of trading days (5 days/week)
  let daysGenerated = 0;
  
  // Start from 100 days ago and move forward
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - tradingDaysToGenerate - 30); // Start further back to account for weekends
  
  // Add day 0 with 0% growth
  growthData.push({
    date: `${currentDate.getDate()}/${currentDate.getMonth() + 1}`,
    balance: balance,
    growth: 0,
    dailyProfit: 0
  });
  currentDate.setDate(currentDate.getDate() + 1);
  
  // Generate only weekday data (skip weekends)
  while (daysGenerated < tradingDaysToGenerate) {
    const dayOfWeek = currentDate.getDay();
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Daily profit/loss random with 70% win rate (realistic trading)
      const isWin = Math.random() < 0.70; // 70% win rate
      const dailyChange = isWin 
        ? (Math.random() * 2 + 0.2)  // Win: between +0.2% and +2.2%
        : (Math.random() * -2 - 0.2); // Loss: between -0.2% and -2.2%
      
      const dailyProfitAmount = (growthBalance * dailyChange / 100);
      const newBalance = growthBalance + dailyProfitAmount;
      const cumulativeGrowth = ((newBalance - balance) / balance * 100);
      
      // Format date
      const dateStr = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
      
      growthData.push({
        date: dateStr,
        balance: parseFloat(newBalance.toFixed(2)),
        growth: parseFloat(cumulativeGrowth.toFixed(2)),
        dailyProfit: parseFloat(dailyChange.toFixed(2))
      });
      
      // Update balance for next day (this is the key - balance accumulates)
      growthBalance = newBalance;
      daysGenerated++;
    }
    
    // Move to next day (going forward now)
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Debug: log wins/losses count
  const wins = growthData.filter(d => d.dailyProfit > 0).length;
  const losses = growthData.filter(d => d.dailyProfit < 0).length;
  console.log(`Generated ${tradingDaysToGenerate} trading days (no weekends): ${wins} wins (green), ${losses} losses (red)`);

  return {
    stats: {
      all: {
        gain: parseFloat(totalGain),
        daily: parseFloat((parseFloat(totalGain) / 300).toFixed(2)), // gain împărțit la ~300 zile trading
        monthly: parseFloat((parseFloat(totalGain) / 10).toFixed(2)), // gain împărțit la 10 luni
        drawdown: parseFloat(totalDrawdown),
        balance: parseFloat(totalCurrentBalance), // Balanța finală
        equity: parseFloat(totalEquity),
        equityPercent: 100.0,
        highest: parseFloat((parseFloat(totalCurrentBalance) * 1.02).toFixed(2)),
        highestDate: months[Math.floor(Math.random() * months.length)],
        profit: parseFloat(totalProfit), // Profitul TOTAL cumulat
        interest: parseFloat((Math.random() * -150 - 50).toFixed(2)), // între -50 și -200
        deposits: balance,
        withdrawals: 0.0,
        totalTrades: totalTrades, // Total trades pe toate perioadele
        winRate: parseFloat(totalWinRate),
      },
      today: {
        gain: parseFloat((Math.random() * 2).toFixed(2)),
        daily: parseFloat((Math.random() * 0.5).toFixed(2)),
        monthly: parseFloat(monthly),
        drawdown: parseFloat((Math.random() * 2).toFixed(2)),
        balance: parseFloat(totalCurrentBalance), // ACEEAȘI balanță
        equity: parseFloat(totalEquity), // ACEEAȘI equity
        equityPercent: 100.0,
        highest: parseFloat(totalCurrentBalance), // Highest pentru azi = balanța curentă
        highestDate: "Today",
        profit: parseFloat((Math.random() * 50 + 10).toFixed(2)), // Profit doar pentru AZI
        interest: 0,
        deposits: 0,
        withdrawals: 0.0,
        totalTrades: Math.floor(Math.random() * 5 + 1), // Trades doar pentru AZI
        winRate: parseFloat((Math.random() * 30 + 55).toFixed(1)),
      },
      week: {
        gain: parseFloat((Math.random() * 5 + 1).toFixed(2)),
        daily: parseFloat((Math.random() * 0.5 + 0.1).toFixed(2)),
        monthly: parseFloat(monthly),
        drawdown: parseFloat((Math.random() * 5 + 1).toFixed(2)),
        balance: parseFloat(totalCurrentBalance), // ACEEAȘI balanță
        equity: parseFloat(totalEquity), // ACEEAȘI equity
        equityPercent: 100.0,
        highest: parseFloat(totalCurrentBalance),
        highestDate: "This Week",
        profit: parseFloat((Math.random() * 200 + 50).toFixed(2)), // Profit doar pentru WEEK
        interest: parseFloat((Math.random() * -10).toFixed(2)),
        deposits: 0,
        withdrawals: 0.0,
        totalTrades: Math.floor(Math.random() * 20 + 5), // Trades doar pentru WEEK
        winRate: parseFloat((Math.random() * 30 + 55).toFixed(1)),
      },
      month: {
        gain: parseFloat(monthly),
        daily: parseFloat(daily),
        monthly: parseFloat(monthly),
        drawdown: parseFloat((Math.random() * 10 + 2).toFixed(2)),
        balance: parseFloat(totalCurrentBalance), // ACEEAȘI balanță
        equity: parseFloat(totalEquity), // ACEEAȘI equity
        equityPercent: 100.0,
        highest: parseFloat(totalCurrentBalance),
        highestDate: "This Month",
        profit: parseFloat((Math.random() * 500 + 100).toFixed(2)), // Profit doar pentru MONTH
        interest: parseFloat((Math.random() * -20).toFixed(2)),
        deposits: 0,
        withdrawals: 0.0,
        totalTrades: Math.floor(Math.random() * 50 + 20), // Trades doar pentru MONTH
        winRate: parseFloat((Math.random() * 30 + 55).toFixed(1)),
      },
    },
    monthlyData,
    growthData
  };
};

// Custom tooltip pentru monthly bars
const MonthlyTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0];
    if (!data || !data.payload) return null;
    
    const returnValue = data.value || 0;
    const profitValue = data.payload.profit || 0;
    
    return (
      <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-lg p-3 shadow-xl">
        <p className="text-gray-300 text-sm font-semibold">{data.payload.month}</p>
        <p className={`font-semibold ${returnValue >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {returnValue >= 0 ? '+' : ''}{returnValue.toFixed(2)}%
        </p>
        <p className={`text-sm ${profitValue >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
          Profit: ${profitValue.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function ProFXbook() {
  // Use language context - get profxbook translations directly
  const { language, translations } = useLanguage();
  const t = translations.profxbook; // Direct access to profxbook translations

  // State pentru conturi salvate
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  // State pentru autentificare
  const [authStep, setAuthStep] = useState("select"); // "select", "broker", "account", "dashboard"
  const [selectedBroker, setSelectedBroker] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [serverType, setServerType] = useState("Live");

  // State pentru datele contului curent
  const [currentAccountData, setCurrentAccountData] = useState(null);

  // State pentru datele din calendar
  const [calendarData, setCalendarData] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // State pentru ProFX Doctor
  const [showDoctor, setShowDoctor] = useState(false);

  // State pentru perioada selectată
  const [timePeriod, setTimePeriod] = useState("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Încărcarea conturilor din localStorage la mount
  useEffect(() => {
    const storedAccounts = localStorage.getItem('profxbook_accounts');
    if (storedAccounts) {
      setSavedAccounts(JSON.parse(storedAccounts));
    }
  }, []);

  // Salvarea conturilor în localStorage când se modifică
  useEffect(() => {
    if (savedAccounts.length > 0) {
      localStorage.setItem('profxbook_accounts', JSON.stringify(savedAccounts));
    }
  }, [savedAccounts]);

  // Callback pentru când calendarul generează date
  const handleCalendarDataGenerated = (dailyData, month) => {
    setCalendarData(dailyData);
    setCalendarMonth(month);
  };

  // Calculează statisticile bazate pe perioada selectată și datele din calendar
  const calculatedStats = useMemo(() => {
    if (!calendarData) return null;

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Calculăm start of week (Luni)
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustăm pentru Luni ca început de săptămână
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);

    // Obținem balanța finală din currentAccountData (dacă există)
    const finalBalance = currentAccountData?.stats?.all?.balance || 2000;

    // Filtrează zilele bazate pe perioada selectată
    const getDaysForPeriod = () => {
      const allDays = Object.entries(calendarData);
      
      switch(timePeriod) {
        case 'today':
          return allDays.filter(([day]) => {
            const dayDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), parseInt(day));
            return dayDate.getDate() === today.getDate() && 
                   dayDate.getMonth() === today.getMonth() &&
                   dayDate.getFullYear() === today.getFullYear();
          });
        
        case 'week':
          return allDays.filter(([day]) => {
            const dayDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), parseInt(day));
            return dayDate >= startOfWeek && dayDate <= today;
          });
        
        case 'month':
          return allDays;
        
        case 'all':
          return allDays;
        
        default:
          return allDays;
      }
    };

    const filteredDays = getDaysForPeriod();
    
    if (filteredDays.length === 0) {
      return {
        totalTrades: 0,
        winners: 0,
        losers: 0,
        winRate: 0,
        totalProfit: 0,
        balance: 2000,
        equity: 2000,
        gain: 0,
        daily: 0,
        monthly: 0,
        drawdown: 0,
        tradingDays: 0
      };
    }

    // Calculează statisticile
    let totalTrades = 0;
    let totalWinners = 0;
    let totalLosers = 0;
    let totalProfit = 0;
    let tradingDays = filteredDays.length;

    filteredDays.forEach(([day, data]) => {
      totalTrades += data.trades;
      totalWinners += data.winners;
      totalLosers += data.losers;
      totalProfit += data.profit;
    });

    const winRate = totalTrades > 0 ? (totalWinners / totalTrades * 100) : 0;
    const initialBalance = 2000;
    // Folosim balanța finală (aceeași pentru toate perioadele), nu calculăm una nouă
    const currentBalance = finalBalance;
    const gain = (totalProfit / initialBalance * 100);
    const dailyGain = tradingDays > 0 ? (gain / tradingDays) : 0;
    const monthlyGain = gain; // Pentru luna curentă
    const drawdown = Math.min(...filteredDays.map(([_, data]) => data.profit < 0 ? (data.profit / currentBalance * 100) : 0), 0);
    
    // Pentru highest, folosim balanța curentă (pentru perioade scurte, highest = balanța actuală)
    // Sau putem calcula pornind de la balanța înainte de perioadă
    const balanceBeforePeriod = currentBalance - totalProfit;
    let runningBalance = balanceBeforePeriod;
    let highestBalance = balanceBeforePeriod;
    let highestDate = null;
    
    filteredDays.forEach(([day, data]) => {
      runningBalance += data.profit;
      if (runningBalance > highestBalance) {
        highestBalance = runningBalance;
        highestDate = `${calendarMonth.toLocaleString('default', { month: 'short' })} ${day}`;
      }
    });
    
    // Dacă highest este mai mic decât balanța curentă, folosim balanța curentă
    if (highestBalance < currentBalance) {
      highestBalance = currentBalance;
    }

    return {
      totalTrades,
      winners: totalWinners,
      losers: totalLosers,
      winRate: parseFloat(winRate.toFixed(1)),
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      profit: parseFloat(totalProfit.toFixed(2)),
      balance: parseFloat(currentBalance.toFixed(2)), // Balanța finală (constantă)
      equity: parseFloat(currentBalance.toFixed(2)), // Equity = balanța finală
      equityPercent: 100.0,
      highest: parseFloat(highestBalance.toFixed(2)),
      highestDate: highestDate || 'N/A',
      gain: parseFloat(gain.toFixed(2)),
      daily: parseFloat(dailyGain.toFixed(2)),
      monthly: parseFloat(monthlyGain.toFixed(2)),
      drawdown: parseFloat(Math.abs(drawdown).toFixed(2)),
      deposits: initialBalance,
      withdrawals: 0,
      interest: 0,
      tradingDays
    };
  }, [calendarData, timePeriod, calendarMonth, currentAccountData]);

  // Date cont (vor fi setate după autentificare)
  const accountType = serverType === "Live" ? "real" : "demo";
  const traderName = "ProFX Trader";
  const broker = selectedBroker;
  const leverage = "1:500";
  const platform = "MetaTrader 5";

  // Statistici și date pentru dashboard-ul curent
  // Pentru "all" (Total) folosim datele random generate, pentru restul folosim calculatedStats din calendar
  const stats = (timePeriod === 'all' && currentAccountData?.stats?.all) 
    ? currentAccountData.stats.all 
    : (calculatedStats || currentAccountData?.stats[timePeriod] || currentAccountData?.stats.all || {
      totalTrades: 0,
      winners: 0,
      losers: 0,
      winRate: 0,
      totalProfit: 0,
      profit: 0,
      balance: 2000,
      equity: 2000,
      equityPercent: 100,
      highest: 2000,
      highestDate: 'N/A',
      gain: 0,
      daily: 0,
      monthly: 0,
      drawdown: 0,
      deposits: 2000,
      withdrawals: 0,
      interest: 0,
      tradingDays: 0
    });
  
  // Helper function pentru formatare sigură
  const formatCurrency = (value) => {
    const num = value || 0;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };
  
  const monthlyData = currentAccountData?.monthlyData || [];
  
  // Date pentru growth chart bazate pe perioadă
  const growthDataByPeriod = {
    all: currentAccountData?.growthData || [],
    today: currentAccountData?.growthData?.slice(-30) || [], // Last 30 days
    week: currentAccountData?.growthData?.slice(-7) || [], // Last 7 days
    month: currentAccountData?.growthData?.slice(-30) || [], // Last 30 days
    custom: currentAccountData?.growthData || [],
  };
  
  let growthData = growthDataByPeriod[timePeriod] || growthDataByPeriod.all;
  
  console.log('Chart Growth Data Length:', growthData.length);
  console.log('First 3 entries:', growthData.slice(0, 3));
  console.log('Has dailyProfit?', growthData[0]?.dailyProfit !== undefined);

  const periodButtons = [
    { id: "today", label: t.today, icon: "📅" },
    { id: "week", label: t.week, icon: "📊" },
    { id: "month", label: t.month, icon: "📈" },
    { id: "all", label: t.total, icon: "🌐" },
    { id: "custom", label: t.custom, icon: "🔧" },
  ];

  // Funcție pentru selectarea unui cont salvat
  const handleSelectAccount = (accountId) => {
    const account = savedAccounts.find(acc => acc.id === accountId);
    if (account) {
      setSelectedAccountId(accountId);
      setSelectedBroker(account.broker);
      setAccountNumber(account.accountNumber);
      setServerType(account.serverType);
      setCurrentAccountData(account.data);
      setAuthStep("dashboard");
    }
  };

  // Funcție pentru adăugarea unui cont nou
  const handleAddNewAccount = () => {
    setAuthStep("broker");
    setSelectedBroker("");
    setAccountNumber("");
    setAccountPassword("");
    setServerType("Live");
    setSelectedAccountId(null);
  };

  // Funcție pentru a procesa autentificarea
  const handleBrokerSelection = (brokerName) => {
    setSelectedBroker(brokerName);
    setAuthStep("account");
  };

  const handleLogin = () => {
    if (accountNumber && accountPassword) {
      // Generăm date random pentru acest cont
      const randomData = generateRandomAccountData(Math.floor(Math.random() * 3000 + 2000));
      
      // Creăm noul cont
      const newAccount = {
        id: Date.now().toString(),
        broker: selectedBroker,
        accountNumber: accountNumber,
        serverType: serverType,
        data: randomData,
        createdAt: new Date().toISOString()
      };

      // Salvăm contul
      setSavedAccounts(prev => [...prev, newAccount]);
      setSelectedAccountId(newAccount.id);
      setCurrentAccountData(randomData);
      
      console.log("New account created:", newAccount);
      setAuthStep("dashboard");
    }
  };

  const handleLogout = () => {
    setAuthStep("select");
    setSelectedAccountId(null);
    setCurrentAccountData(null);
  };

  const handleDeleteAccount = (accountId, e) => {
    e.stopPropagation();
    const account = savedAccounts.find(acc => acc.id === accountId);
    setAccountToDelete(account);
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    if (accountToDelete) {
      setSavedAccounts(prev => prev.filter(acc => acc.id !== accountToDelete.id));
      if (selectedAccountId === accountToDelete.id) {
        handleLogout();
      }
      setShowDeleteModal(false);
      setAccountToDelete(null);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
    setAccountToDelete(null);
  };

  // Ecran de selectare cont sau adăugare cont nou
  if (authStep === "select") {
    return (
      <div className="min-h-screen text-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Pro<span className="text-amber-400">FX</span>book
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              {t.title}
            </p>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            {language === "ro" ? "Conturile Tale" : "Your Accounts"}
          </h2>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Saved Accounts */}
            {savedAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => handleSelectAccount(account.id)}
                className="group relative bg-transparent border-2 border-gray-700/50 hover:border-amber-400/60 rounded-2xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {/* Delete Button - Redesigned */}
                <button
                  onClick={(e) => handleDeleteAccount(account.id, e)}
                  className="absolute top-3 right-3 w-9 h-9 bg-transparent border border-red-500/40 hover:border-red-400/70 rounded-xl flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 hover:scale-110 hover:rotate-90"
                  title={language === "ro" ? "Șterge cont" : "Delete account"}
                >
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div className="flex flex-col gap-4">
                  {/* Broker Icon & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-transparent border border-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden p-1">
                      {account.broker === "FP Markets" ? (
                        <img 
                          src="/fpmarkets-logo.png" 
                          alt="FP Markets" 
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-xl">🏦</span>';
                          }}
                        />
                      ) : (
                        <div className="text-center leading-none" style={{fontFamily: 'Arial, sans-serif'}}>
                          <div className="text-[0.65rem] font-bold tracking-tight">
                            <span className="text-cyan-400">fpm</span>
                            <span className="text-white">trading</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                        {account.broker}
                      </h3>
                      <p className="text-gray-400 text-xs font-mono">#{account.accountNumber}</p>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">{language === "ro" ? "Tip" : "Type"}:</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        account.serverType === "Live" 
                          ? "bg-transparent text-emerald-400 border border-emerald-500/30"
                          : "bg-transparent text-blue-400 border border-blue-500/30"
                      }`}>
                        {account.serverType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700/30">
                      <span className="text-gray-400 text-xs">{language === "ro" ? "Balanță" : "Balance"}:</span>
                      <span className="text-emerald-400 font-bold">
                        ${account.data.stats.all.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">{language === "ro" ? "Câștig" : "Gain"}:</span>
                      <span className="text-emerald-400 font-bold">
                        +{account.data.stats.all.gain}%
                      </span>
                    </div>
                  </div>

                  {/* Select Button */}
                  <div className="mt-2 px-4 py-2 bg-transparent rounded-lg border border-amber-400/30 transition-all duration-300 text-center">
                    <span className="text-amber-400 font-semibold text-sm">
                      {language === "ro" ? "Selectează" : "Select"} →
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Account Card */}
            <button
              onClick={handleAddNewAccount}
              className="group bg-transparent border-2 border-dashed border-amber-500/30 hover:border-amber-400/60 rounded-2xl p-6 transition-all duration-300 hover:scale-105 min-h-[280px] flex flex-col items-center justify-center gap-4"
            >
              <div className="w-16 h-16 bg-transparent border border-amber-500/30 rounded-full flex items-center justify-center transition-all duration-300">
                <span className="text-4xl">➕</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300 mb-2">
                  {language === "ro" ? "Adaugă Cont Nou" : "Add New Account"}
                </h3>
                <p className="text-gray-400 text-sm text-center">
                  {language === "ro" ? "Conectează un cont nou" : "Connect a new account"}
                </p>
              </div>
            </button>
          </div>

          {/* Info Footer */}
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>{language === "ro" ? "Toate conturile sunt salvate local și în siguranță" : "All accounts are saved locally and securely"} 🔒</p>
          </div>
        </div>

        {/* Custom Delete Confirmation Modal */}
        {showDeleteModal && accountToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-gray-900/95 border-2 border-red-500/30 rounded-2xl p-8 max-w-md w-full animate-scaleIn">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center border-2 border-red-500/40 animate-pulse">
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white text-center mb-3">
                {language === "ro" ? "Șterge Cont?" : "Delete Account?"}
              </h3>

              {/* Message */}
              <p className="text-gray-300 text-center mb-6">
                {language === "ro" 
                  ? "Ești sigur că vrei să ștergi acest cont? Această acțiune nu poate fi anulată."
                  : "Are you sure you want to delete this account? This action cannot be undone."}
              </p>

              {/* Account Info Preview */}
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-transparent border border-gray-700/50 rounded-lg flex items-center justify-center overflow-hidden p-1">
                    {accountToDelete.broker === "FP Markets" ? (
                      <img 
                        src="/fpmarkets-logo.png" 
                        alt="FP Markets" 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<span class="text-lg">🏦</span>';
                        }}
                      />
                    ) : (
                      <div className="text-center leading-none" style={{fontFamily: 'Arial, sans-serif'}}>
                        <div className="text-[0.5rem] font-bold tracking-tight">
                          <span className="text-cyan-400">fpm</span>
                          <span className="text-white">trading</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-bold">{accountToDelete.broker}</p>
                    <p className="text-gray-400 text-xs font-mono">#{accountToDelete.accountNumber}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{language === "ro" ? "Balanță" : "Balance"}:</span>
                  <span className="text-emerald-400 font-bold">
                    ${accountToDelete.data.stats.all.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteAccount}
                  className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  {language === "ro" ? "Anulează" : "Cancel"}
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  className="flex-1 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  {language === "ro" ? "Șterge" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dacă utilizatorul nu a selectat încă brokerul
  if (authStep === "broker") {
    return (
      <div className="min-h-screen text-white p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Pro<span className="text-amber-400">FX</span>book
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              {t.title}
            </p>
          </div>

          {/* Broker Selection */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-6">
            {/* Back Button */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setAuthStep("select")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 hover:border-gray-500/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 text-sm font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {language === "ro" ? "Înapoi" : "Back"}
              </button>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2 text-white">
              {language === "ro" ? "Selectează Brokerul" : "Select Your Broker"}
            </h2>
            <p className="text-gray-400 text-center mb-8">
              {language === "ro" ? "Alege brokerul tău pentru a continua" : "Choose your broker to continue"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FP Markets Card */}
              <button
                onClick={() => handleBrokerSelection("FP Markets")}
                className="group bg-transparent border-2 border-blue-500/30 hover:border-blue-400/60 rounded-2xl p-8 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-4">
                  {/* FP Markets Logo */}
                  <div className="w-32 h-32 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <img 
                      src="/fpmarkets-logo.png" 
                      alt="FP Markets" 
                      className="w-full h-full object-contain filter brightness-110 group-hover:brightness-125 transition-all duration-300"
                      onError={(e) => {
                        // Fallback to emoji if image fails to load
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-6xl">🏦</span>';
                      }}
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                    FP Markets
                  </h3>
                  <p className="text-gray-400 text-center text-sm">
                    {language === "ro" ? "Broker global de încredere" : "Trusted global broker"}
                  </p>
                  <div className="mt-2 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-400/30 group-hover:bg-blue-500/30 transition-all duration-300">
                    <span className="text-blue-400 font-semibold text-sm">
                      {language === "ro" ? "Selectează" : "Select"} →
                    </span>
                  </div>
                </div>
              </button>

              {/* FPM Trading Card */}
              <button
                onClick={() => handleBrokerSelection("FPM Trading")}
                className="group bg-transparent border-2 border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-8 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-4">
                  {/* FPM Trading Text Logo */}
                  <div className="w-32 h-32 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <div className="text-center" style={{fontFamily: 'Arial, sans-serif'}}>
                      <div className="text-3xl font-bold leading-none tracking-tight">
                        <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">fpm</span>
                        <span className="text-white group-hover:text-gray-100 transition-colors duration-300">trading</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                    FPM Trading
                  </h3>
                  <p className="text-gray-400 text-center text-sm">
                     {language === "ro" ? "Broker global de încredere" : "Trusted global broker"}
                  </p>
                  <div className="mt-2 px-4 py-2 bg-cyan-500/20 rounded-lg border border-cyan-400/30 group-hover:bg-cyan-500/30 transition-all duration-300">
                    <span className="text-cyan-400 font-semibold text-sm">
                      {language === "ro" ? "Selectează" : "Select"} →
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Info Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>{language === "ro" ? "Datele tale sunt în siguranță și criptate" : "Your data is safe and encrypted"} 🔒</p>
          </div>
        </div>
      </div>
    );
  }

  // Dacă utilizatorul a selectat brokerul și trebuie să introducă datele contului
  if (authStep === "account") {
    return (
      <div className="min-h-screen text-white p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Pro<span className="text-amber-400">FX</span>book
            </h1>
            <p className="text-gray-400 text-lg">
              {selectedBroker}
            </p>
          </div>

          {/* Account Details Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {language === "ro" ? "Detalii Cont" : "Account Details"}
              </h2>
              <button
                onClick={() => setAuthStep("broker")}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                ← {language === "ro" ? "Înapoi" : "Back"}
              </button>
            </div>

            <div className="space-y-6">
              {/* Account Number */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  {language === "ro" ? "Număr Cont" : "Account Number"}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={language === "ro" ? "Introdu numărul contului" : "Enter your account number"}
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  {language === "ro" ? "Parolă Cont" : "Account Password"}
                </label>
                <input
                  type="password"
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder={language === "ro" ? "Introdu parola contului" : "Enter your account password"}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300"
                />
              </div>

              {/* Server Type Dropdown */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  {language === "ro" ? "Tip Server" : "Server Type"}
                </label>
                <select
                  value={serverType}
                  onChange={(e) => setServerType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300 cursor-pointer"
                >
                  <option value="Live">Live - {language === "ro" ? "Cont Real" : "Real Account"}</option>
                  <option value="Demo">Demo - {language === "ro" ? "Cont Demo" : "Demo Account"}</option>
                </select>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={!accountNumber || !accountPassword}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  accountNumber && accountPassword
                    ? "bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 hover:scale-[1.02]"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                {language === "ro" ? "Conectează-te" : "Login"} →
              </button>
            </div>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h4 className="text-blue-400 font-semibold text-sm mb-1">
                    {language === "ro" ? "Conexiune Sigură" : "Secure Connection"}
                  </h4>
                  <p className="text-gray-400 text-xs">
                    {language === "ro" 
                      ? "Datele tale sunt criptate și nu sunt stocate pe serverele noastre."
                      : "Your data is encrypted and not stored on our servers."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dacă utilizatorul este autentificat, afișează dashboard-ul
  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Title - Centered */}
          <div className="text-center" key={language}>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 animate-language-change">
              Pro<span className="text-amber-400">FX</span>book
            </h1>
            <p className="text-gray-400 text-sm md:text-lg animate-language-change">
              {t.title}
            </p>
          </div>
          
          {/* Logout Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 text-sm font-semibold"
            >
              <span>🚪</span>
              {language === "ro" ? "Deconectare" : "Logout"}
            </button>
          </div>
        </div>

        {/* Trader Info Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6" key={`trader-${language}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-language-change">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-3">{traderName}</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Account Type Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    accountType === "real"
                      ? "bg-transparent text-emerald-400 border border-emerald-500/30"
                      : "bg-transparent text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {accountType === "real" ? `🟢 ${t.realAccount}` : `🔵 ${t.demoAccount}`}
                </span>
                
                {/* Account Number */}
                <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1 rounded-lg border border-gray-600/30">
                  <span className="text-gray-400 text-xs">{t.account}:</span>
                  <span className="text-white font-mono font-semibold text-sm">{accountNumber}</span>
                </div>
                
                {/* Broker */}
                <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1 rounded-lg border border-gray-600/30">
                  <span className="text-gray-400 text-xs">{t.broker}:</span>
                  <span className="text-amber-400 font-semibold text-sm">{selectedBroker}</span>
                </div>
                
                {/* Server Type */}
                <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1 rounded-lg border border-gray-600/30">
                  <span className="text-gray-400 text-xs">{language === "ro" ? "Server" : "Server"}:</span>
                  <span className="text-purple-400 font-semibold text-sm">{serverType}</span>
                </div>
                
                {/* Leverage */}
                <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1 rounded-lg border border-gray-600/30">
                  <span className="text-gray-400 text-xs">{t.leverage}:</span>
                  <span className="text-blue-400 font-semibold text-sm">{leverage}</span>
                </div>
                
                {/* Platform */}
                <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1 rounded-lg border border-gray-600/30">
                  <span className="text-gray-400 text-xs">{t.platform}:</span>
                  <span className="text-cyan-400 font-semibold text-sm">{platform}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Period Filter */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6" key={`period-${language}`}>
          <div className="flex flex-col gap-4 animate-language-change">
            <div className="flex items-center gap-3">
              <span className="text-gray-300 font-semibold">📊 {t.timePeriod}:</span>
            </div>
            
            {/* Period Buttons */}
            <div className="flex flex-wrap gap-3">
              {periodButtons.map((period) => (
                <button
                  key={period.id}
                  onClick={() => {
                    setTimePeriod(period.id);
                    if (period.id !== "custom") {
                      setShowCustomDatePicker(false);
                    } else {
                      setShowCustomDatePicker(true);
                    }
                  }}
                  className={`
                    px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300
                    ${timePeriod === period.id
                      ? "bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/30 scale-105"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30"
                    }
                  `}
                >
                  <span className="mr-2">{period.icon}</span>
                  {period.label}
                </button>
              ))}
            </div>

            {/* Custom Date Picker */}
            {showCustomDatePicker && (
              <div className="flex flex-col md:flex-row gap-3 mt-2 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 animate-fadeIn">
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1 block">{t.customStart}</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1 block">{t.customEnd}</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      // Aici vei aplica filtrul custom
                      console.log("Custom date range:", customStartDate, "to", customEndDate);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg transition-all duration-300"
                  >
                    {t.apply}
                  </button>
                </div>
              </div>
            )}

            {/* Period Info */}
            <div className="text-xs text-gray-500">
              {timePeriod === "today" && `📍 ${t.periodToday}`}
              {timePeriod === "week" && `📍 ${t.periodWeek}`}
              {timePeriod === "month" && `📍 ${t.periodMonth}`}
              {timePeriod === "all" && `📍 ${t.periodAll}`}
              {timePeriod === "custom" && customStartDate && customEndDate && 
                `📍 ${t.periodCustom}: ${customStartDate} - ${customEndDate}`}
            </div>
          </div>
        </div>

        {/* Dashboard Grid Layout - 2 Rows */}
        <div className="space-y-4" key={`dashboard-${language}`}>
          
          {/* Row 1: Performance Card + Account Growth Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Performance Card - Left */}
            <div className="lg:col-span-5">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-emerald-400/30 transition-all duration-300 animate-language-change h-full">
                <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  📊 {t.performance}
                </h3>
                
                {/* Main Performance Metrics */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.gain}</span>
                    <span className="text-emerald-400 font-bold text-lg">+{stats.gain}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.absGain}</span>
                    <span className="text-emerald-400 font-semibold">${formatCurrency(stats.profit)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.drawdown}</span>
                    <span className="text-red-400 font-bold">{stats.drawdown}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.equityDrawdown}</span>
                    <span className="text-red-400 font-semibold">{stats.drawdown}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.profitEuro}</span>
                    <span className="text-emerald-400 font-bold">${formatCurrency(stats.profit)}</span>
                  </div>
                </div>

                {/* Advanced Metrics Box */}
                <div className="my-4 p-3 bg-gray-900/40 rounded-lg border border-gray-700/40">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    <div className="text-gray-400">Profit Factor</div>
                    <div className="text-cyan-400 font-semibold text-right">2.5</div>
                    <div className="text-gray-400">Standard Deviation</div>
                    <div className="text-blue-400 font-semibold text-right">13.2%</div>
                    <div className="text-gray-400">Sharpe Ratio</div>
                    <div className="text-purple-400 font-semibold text-right">1.8</div>
                    <div className="text-gray-400">Expectancy</div>
                    <div className="text-emerald-400 font-semibold text-right">$85</div>
                  </div>
                </div>

                {/* Trading Stats Section */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.nrOfTrades}</span>
                    <span className="text-purple-400 font-bold">{stats.totalTrades}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.tradesWon}</span>
                    <span className="text-emerald-400 font-semibold">{Math.floor(stats.totalTrades * stats.winRate / 100)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.tradesLost}</span>
                    <span className="text-red-400 font-semibold">{stats.totalTrades - Math.floor(stats.totalTrades * stats.winRate / 100)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.averageLost}</span>
                    <span className="text-gray-400 font-semibold">-$50.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.averageWin}</span>
                    <span className="text-emerald-400 font-semibold">+$120.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.maxConsecutiveWins}</span>
                    <span className="text-emerald-400 font-bold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t.maxConsecutiveLosses}</span>
                    <span className="text-red-400 font-bold">3</span>
                  </div>
                </div>

                {/* Account Balance Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Sold</span>
                    <span className="text-blue-400 font-bold">${formatCurrency(stats.balance)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Equity</span>
                    <span className="text-blue-400 font-semibold">${formatCurrency(stats.equity)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Retragere</span>
                    <span className="text-gray-400 font-semibold">${formatCurrency(stats.withdrawals)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Swap</span>
                    <span className="text-red-400 font-semibold">${formatCurrency(stats.interest)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Comision</span>
                    <span className="text-red-400 font-semibold">$0.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Growth Chart - Right */}
            <div className="lg:col-span-7">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-emerald-400/30 transition-all duration-300 h-full" key={`growth-${language}`}>
                <h3 className="text-lg font-bold text-emerald-400 mb-4 animate-language-change flex items-center gap-2">
                  📈 {t.accountGrowth}
                </h3>
                <ResponsiveContainer width="100%" height={450}>
                  <ComposedChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      style={{ fontSize: '11px' }}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="#10b981"
                      style={{ fontSize: '11px' }}
                      tickFormatter={(value) => `${value}%`}
                      domain={[-20, 20]}
                      allowDataOverflow={false}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="#3b82f6"
                      style={{ fontSize: '11px' }}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 'dataMax + 10']}
                    />
                    <Tooltip content={<CustomGrowthTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="rect"
                      formatter={(value, entry) => {
                        if (value === 'dailyProfit') return 'Daily Profit/Loss';
                        if (value === 'growth') return 'Cumulative Growth';
                        return value;
                      }}
                      wrapperStyle={{ paddingTop: '10px' }}
                    />
                    <ReferenceLine yAxisId="left" y={0} stroke="#6B7280" strokeDasharray="3 3" strokeWidth={2} />
                    <Bar 
                      yAxisId="left"
                      dataKey="dailyProfit" 
                      name="Daily Profit/Loss"
                      barSize={4}
                      isAnimationActive={true}
                    >
                      {growthData.map((entry, index) => {
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.dailyProfit >= 0 ? "#10b981" : "#ef4444"}
                            fillOpacity={0.75}
                          />
                        );
                      })}
                    </Bar>
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="growth"
                      name="Cumulative Growth"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 5, strokeWidth: 2, stroke: "#1e3a8a" }}
                      activeDot={{ r: 7 }}
                      isAnimationActive={true}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: Trading Calendar + Monthly Performance + Trade Time Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Trading Calendar - Left (Larger) */}
            <div className="lg:col-span-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-purple-400/30 transition-all duration-300 h-full" key={`calendar-${language}`}>
                <h3 className="text-lg font-bold text-purple-400 mb-4 animate-language-change flex items-center gap-2">
                  📆 Calendar Trading
                </h3>
                <ProFXbookCalendar 
                  accountData={currentAccountData} 
                  onDataGenerated={handleCalendarDataGenerated}
                />
              </div>
            </div>

            {/* Right Side - Two Smaller Cards Stacked */}
            <div className="lg:col-span-6 grid grid-cols-1 gap-4">
              {/* Monthly Performance */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-amber-400/30 transition-all duration-300" key={`monthly-${language}`}>
                <h3 className="text-lg font-bold text-amber-400 mb-4 animate-language-change flex items-center gap-2">
                  📅 {t.monthlyPerformance}
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData.slice(-6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#9CA3AF"
                      style={{ fontSize: '10px' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      style={{ fontSize: '10px' }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<MonthlyTooltip />} />
                    <Bar 
                      dataKey="return" 
                      radius={[6, 6, 0, 0]}
                    >
                      {monthlyData.slice(-6).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.return >= 0 ? "#10b981" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Trade Time Performance */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-cyan-400/30 transition-all duration-300 animate-language-change">
                <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  🕐 {t.tradeTimePerformance}
                </h3>
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-5xl">📊</div>
                    <div className="text-gray-400 text-sm font-semibold">
                      {language === "ro" ? "Analiză performanță pe ore" : "Hourly performance analysis"}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                        <div className="text-gray-400 text-xs mb-1">Best Time</div>
                        <div className="text-emerald-400 font-bold text-lg">09:00-12:00</div>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                        <div className="text-gray-400 text-xs mb-1">Win Rate</div>
                        <div className="text-emerald-400 font-bold text-lg">{stats.winRate}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ProFX Doctor Button */}
        <div className="mt-8 flex justify-center" key={`doctor-button-${language}`}>
          <button
            onClick={() => setShowDoctor(!showDoctor)}
            className="group relative px-8 py-4 bg-transparent border border-blue-500/40 hover:border-purple-500/60 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            <span className="text-3xl">🏥</span>
            <span>
              {showDoctor 
                ? (language === "ro" ? "Ascunde ProFX Doctor" : "Hide ProFX Doctor")
                : (language === "ro" ? "Accesează ProFX Doctor" : "Access ProFX Doctor")
              }
            </span>
            <svg 
              className={`w-6 h-6 transition-transform duration-300 ${showDoctor ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* ProFX Doctor Component */}
        {showDoctor && (
          <div key={`doctor-${language}`} className="animate-fadeIn">
            <ProFXDoctor 
              accountData={currentAccountData}
              onClose={() => setShowDoctor(false)}
            />
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm" key={`footer-${language}`}>
          <p className="animate-language-change">{t.footer1}</p>
          <p className="mt-1 animate-language-change">{t.footer2}</p>
        </div>
      </div>
    </div>
  );
}
