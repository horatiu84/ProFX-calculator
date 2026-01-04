import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import ProFXbookAccess from "./components/ProFXbookAccess";
import ProFXbookDashboard from "./components/ProFXbookDashboard";
import { db } from "./db/FireBase";
import { doc, getDoc, setDoc, Timestamp, arrayUnion, updateDoc } from "firebase/firestore";

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

  // Încărcarea conturilor din Firestore la mount
  useEffect(() => {
    const loadAccountsFromFirestore = async () => {
      try {
        // Citim documentul accounts.json din colecția accounts
        const accountsDocRef = doc(db, 'accounts', 'accounts.json');
        const accountsDoc = await getDoc(accountsDocRef);
        
        if (accountsDoc.exists()) {
          const data = accountsDoc.data();
          const accounts = data.accounts || [];
          
          // Adăugăm ID unic pentru fiecare cont (index-based pentru compatibilitate)
          const accountsWithIds = accounts.map((account, index) => ({
            ...account,
            id: account.id || `account-${index}-${account.login}`
          }));
          
          setSavedAccounts(accountsWithIds);
          console.log('Loaded accounts from Firestore:', accountsWithIds.length);
        } else {
          console.log('No accounts document found, creating empty structure');
          // Creăm structura dacă nu există
          await setDoc(accountsDocRef, { accounts: [] });
          setSavedAccounts([]);
        }
      } catch (error) {
        console.error('Error loading accounts from Firestore:', error);
        // Fallback la localStorage dacă Firebase eșuează
        const storedAccounts = localStorage.getItem('profxbook_accounts');
        if (storedAccounts) {
          setSavedAccounts(JSON.parse(storedAccounts));
        }
      }
    };

    loadAccountsFromFirestore();
  }, []);

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
      setAccountNumber(account.accountNumber || account.login);
      setServerType(account.serverType || (account.account_type === "live" ? "Live" : "Demo"));
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

  const handleLogin = async () => {
    if (accountNumber && accountPassword) {
      try {
        // Generăm date random pentru acest cont
        const randomData = generateRandomAccountData(Math.floor(Math.random() * 3000 + 2000));
        
        // Creăm noul cont pentru Firestore (structură conform screenshot-ului)
        const newAccountData = {
          account_type: serverType.toLowerCase(), // "live" sau "demo"
          active: true,
          last_check: Timestamp.now(),
          last_deal_id: Math.floor(Math.random() * 200000000),
          leverage: 500,
          login: accountNumber, // Păstrăm ca string pentru a păstra zerourile din față
          notes: "",
          password: accountPassword,
          server: selectedBroker === "FP Markets" ? "FPMarketsLLC-Live" : "FPMTrading-Live",
          total_deals: randomData.stats.all.totalTrades,
          broker: selectedBroker,
          data: randomData,
          id: `account-${Date.now()}-${accountNumber}`
        };

        // Referință la documentul accounts.json
        const accountsDocRef = doc(db, 'accounts', 'accounts.json');
        
        // Adăugăm contul nou în array-ul accounts folosind arrayUnion
        await updateDoc(accountsDocRef, {
          accounts: arrayUnion(newAccountData)
        });
        
        console.log('Account added to Firestore array');

        // Actualizăm state-ul local
        const updatedAccounts = [...savedAccounts, newAccountData];
        setSavedAccounts(updatedAccounts);
        setSelectedAccountId(newAccountData.id);
        setCurrentAccountData(randomData);
        
        // Salvăm și în localStorage ca backup
        localStorage.setItem('profxbook_accounts', JSON.stringify(updatedAccounts));
        
        setAuthStep("dashboard");
      } catch (error) {
        console.error('Error saving account to Firestore:', error);
        alert(language === "ro" 
          ? "Eroare la salvarea contului. Verifică conexiunea."
          : "Error saving account. Check your connection.");
      }
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

  const confirmDeleteAccount = async () => {
    if (accountToDelete) {
      try {
        // Citim toate conturile din Firestore
        const accountsDocRef = doc(db, 'accounts', 'accounts.json');
        const accountsDoc = await getDoc(accountsDocRef);
        
        if (accountsDoc.exists()) {
          const data = accountsDoc.data();
          const currentAccounts = data.accounts || [];
          
          // Filtrăm contul de șters din array
          const updatedAccounts = currentAccounts.filter(
            acc => (acc.id || `account-${acc.login}`) !== accountToDelete.id
          );
          
          // Actualizăm documentul cu noul array
          await setDoc(accountsDocRef, { accounts: updatedAccounts });
          
          console.log('Account deleted from Firestore array:', accountToDelete.id);

          // Actualizăm state-ul local
          const localUpdatedAccounts = savedAccounts.filter(acc => acc.id !== accountToDelete.id);
          setSavedAccounts(localUpdatedAccounts);
          
          // Actualizăm și localStorage
          localStorage.setItem('profxbook_accounts', JSON.stringify(localUpdatedAccounts));
          
          if (selectedAccountId === accountToDelete.id) {
            handleLogout();
          }
        }
        
        setShowDeleteModal(false);
        setAccountToDelete(null);
      } catch (error) {
        console.error('Error deleting account from Firestore:', error);
        alert(language === "ro" 
          ? "Eroare la ștergerea contului. Încearcă din nou."
          : "Error deleting account. Please try again.");
      }
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
    setAccountToDelete(null);
  };

  // Dacă nu este în modul dashboard, folosește componenta ProFXbookAccess
  if (authStep !== "dashboard") {
    return (
      <ProFXbookAccess
        authStep={authStep}
        savedAccounts={savedAccounts}
        selectedBroker={selectedBroker}
        accountNumber={accountNumber}
        accountPassword={accountPassword}
        serverType={serverType}
        language={language}
        t={t}
        onSelectAccount={handleSelectAccount}
        onAddNewAccount={handleAddNewAccount}
        onDeleteAccount={handleDeleteAccount}
        onBrokerSelection={handleBrokerSelection}
        onAccountNumberChange={setAccountNumber}
        onAccountPasswordChange={setAccountPassword}
        onServerTypeChange={setServerType}
        onLogin={handleLogin}
        onBackToSelect={() => setAuthStep("select")}
        onBackToBroker={() => setAuthStep("broker")}
        showDeleteModal={showDeleteModal}
        accountToDelete={accountToDelete}
        onConfirmDelete={confirmDeleteAccount}
        onCancelDelete={cancelDeleteAccount}
      />
    );
  }

  // Dacă utilizatorul este autentificat, folosește componenta ProFXbookDashboard
  return (
    <ProFXbookDashboard
      currentAccountData={currentAccountData}
      selectedBroker={selectedBroker}
      accountNumber={accountNumber}
      serverType={serverType}
      timePeriod={timePeriod}
      showCustomDatePicker={showCustomDatePicker}
      customStartDate={customStartDate}
      customEndDate={customEndDate}
      showDoctor={showDoctor}
      stats={stats}
      monthlyData={monthlyData}
      growthData={growthData}
      periodButtons={periodButtons}
      language={language}
      t={t}
      onLogout={handleLogout}
      onTimePeriodChange={(periodId) => {
        setTimePeriod(periodId);
        if (periodId !== "custom") {
          setShowCustomDatePicker(false);
        } else {
          setShowCustomDatePicker(true);
        }
      }}
      onCustomStartDateChange={setCustomStartDate}
      onCustomEndDateChange={setCustomEndDate}
      onApplyCustomDate={() => {
        console.log("Custom date range:", customStartDate, "to", customEndDate);
      }}
      onToggleDoctor={() => setShowDoctor(!showDoctor)}
      onCalendarDataGenerated={handleCalendarDataGenerated}
    />
  );
}
