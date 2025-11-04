import React, { useState, useMemo, useEffect } from "react";
import { useLanguage } from "./contexts/LanguageContext";

const ProFXbookCalendar = ({ accountData, onDataGenerated }) => {
  const { language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Funcție pentru generarea datelor zilnice random (demo) - folosim useMemo pentru a menține datele constante
  const dailyData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = {};

    // Obținem data curentă pentru a nu genera trades în viitor
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      // Creăm obiectul Date pentru ziua curentă
      const currentDayDate = new Date(year, month, day);
      const dayOfWeek = currentDayDate.getDay(); // 0 = Duminică, 6 = Sâmbătă
      
      // Verificăm dacă este weekend (Sâmbătă sau Duminică)
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Verificăm dacă ziua este în trecut sau astăzi
      const isPastOrToday = 
        year < todayYear || 
        (year === todayYear && month < todayMonth) ||
        (year === todayYear && month === todayMonth && day <= todayDay);

      // NU generăm trades în weekend, și simulăm doar 60% din zilele de trading (Luni-Vineri)
      if (!isWeekend && isPastOrToday && Math.random() > 0.4) {
        const trades = Math.floor(Math.random() * 25) + 1; // 1-25 trades
        const winRate = Math.random() * 0.5 + 0.4; // 40-90% win rate
        const winners = Math.floor(trades * winRate);
        const losers = trades - winners;
        
        // Calculăm win rate-ul REAL bazat pe numărul de winners
        const actualWinRate = (winners / trades * 100).toFixed(1);
        
        // Generăm tranzacții individuale pentru ziua respectivă
        const tradesList = [];
        let totalProfit = 0;
        
        for (let i = 0; i < trades; i++) {
          const isWinner = i < winners;
          const tradeProfit = isWinner 
            ? (Math.random() * 5 + 0.5).toFixed(2) 
            : -(Math.random() * 3 + 0.2).toFixed(2);
          
          totalProfit += parseFloat(tradeProfit);
          
          const hour = Math.floor(Math.random() * 14) + 6; // 6-20
          const minute = Math.floor(Math.random() * 60);
          const second = Math.floor(Math.random() * 60);
          
          tradesList.push({
            id: i + 1,
            openTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`,
            ticker: "XAUUSD",
            side: Math.random() > 0.5 ? "LONG" : "SHORT",
            instrument: "XAUUSD",
            netPL: parseFloat(tradeProfit),
            netROI: ((parseFloat(tradeProfit) / 1000) * 100).toFixed(2), // Presupunem un capital de 1000
            volume: (Math.random() * 0.1 + 0.01).toFixed(2)
          });
        }
        
        // Sortăm tranzacțiile după timp (descrescător - cele mai recente primele)
        tradesList.sort((a, b) => b.openTime.localeCompare(a.openTime));
        
        data[day] = {
          trades,
          profit: parseFloat(totalProfit.toFixed(2)),
          winRate: actualWinRate, // Folosim win rate-ul calculat corect
          winners,
          losers,
          grossPL: parseFloat(totalProfit.toFixed(2)),
          commissions: 0,
          volume: (Math.random() * 5 + 0.5).toFixed(2),
          profitFactor: ((1 + Math.random() * 2).toFixed(5)),
          tradesList
        };
      }
    }

    return data;
  }, [currentDate]); // Se regenerează doar când se schimbă luna

  // Notifică componenta părinte când datele se schimbă
  useEffect(() => {
    if (onDataGenerated) {
      onDataGenerated(dailyData, currentDate);
    }
  }, [dailyData, currentDate, onDataGenerated]);

  // Calculează statistici săptămânale
  const calculateWeeklyStats = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const weeks = [];
    let currentWeek = { days: 0, profit: 0, start: 1 };
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (firstDay + day - 1) % 7;
      
      if (dailyData[day]) {
        currentWeek.days++;
        currentWeek.profit += dailyData[day].profit;
      }
      
      // Dacă e sâmbătă sau ultima zi
      if (dayOfWeek === 6 || day === daysInMonth) {
        if (currentWeek.days > 0) {
          weeks.push({ ...currentWeek, end: day });
        }
        currentWeek = { days: 0, profit: 0, start: day + 1 };
      }
    }
    
    return weeks;
  };

  const weeklyStats = calculateWeeklyStats();

  // Calculează totalul lunar
  const monthlyTotal = Object.values(dailyData).reduce((sum, day) => sum + day.profit, 0);
  const totalTradingDays = Object.keys(dailyData).length;

  // Navigare luni
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // Verifică dacă suntem în luna curentă (pentru a dezactiva butonul "next")
  const isCurrentMonth = () => {
    const today = new Date();
    return currentDate.getFullYear() === today.getFullYear() && 
           currentDate.getMonth() === today.getMonth();
  };

  // Deschide modalul cu detalii pentru o zi
  const openDayDetails = (day) => {
    if (dailyData[day]) {
      setSelectedDay(day);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDay(null);
  };

  // Formatare lună
  const monthNames = {
    ro: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };

  const dayNames = {
    ro: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  };

  const monthName = monthNames[language][currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // Calculează zilele pentru calendar
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const calendarDays = [];
  
  // Adaugă zile goale pentru început
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Adaugă zilele lunii
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Organizează în săptămâni
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            title={language === "ro" ? "Luna anterioară" : "Previous month"}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-xl font-bold text-white">
            {monthName} {year}
          </h2>
          
          <button
            onClick={goToNextMonth}
            disabled={isCurrentMonth()}
            className={`p-2 rounded-lg transition-colors ${
              isCurrentMonth() 
                ? 'opacity-50 cursor-not-allowed text-gray-600' 
                : 'hover:bg-gray-700/50 text-gray-400'
            }`}
            title={isCurrentMonth() 
              ? (language === "ro" ? "Nu poți vizualiza viitorul" : "Cannot view future") 
              : (language === "ro" ? "Luna următoare" : "Next month")
            }
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={goToCurrentMonth}
            className="px-3 py-1 text-sm bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-gray-300"
          >
            {language === "ro" ? "Luna curentă" : "This month"}
          </button>
        </div>

        {/* Monthly Stats */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-400">
              {language === "ro" ? "Statistici lunare:" : "Monthly stats:"}
            </p>
            <p className={`text-lg font-bold ${monthlyTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {monthlyTotal >= 0 ? '$' : '-$'}{Math.abs(monthlyTotal).toFixed(1)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">
              {language === "ro" ? "Zile active:" : "Active days:"}
            </p>
            <p className="text-lg font-bold text-blue-400">
              {totalTradingDays} {language === "ro" ? "zile" : "days"}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-8 gap-2">
        {/* Empty corner cell */}
        <div className="h-10"></div>
        
        {/* Day headers */}
        {dayNames[language].map((day, idx) => (
          <div key={idx} className="h-10 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-400">{day}</span>
          </div>
        ))}

        {/* Calendar rows with weekly stats */}
        {weeks.map((week, weekIdx) => (
          <React.Fragment key={weekIdx}>
            {/* Weekly stats column */}
            <div className="flex flex-col items-end justify-center pr-2 border-r border-gray-700/50">
              <span className="text-xs text-gray-500">
                {language === "ro" ? "Săpt" : "Week"} {weekIdx + 1}
              </span>
              {weeklyStats[weekIdx] && (
                <>
                  <span className={`text-sm font-bold ${weeklyStats[weekIdx].profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {weeklyStats[weekIdx].profit >= 0 ? '$' : '-$'}{Math.abs(weeklyStats[weekIdx].profit).toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {weeklyStats[weekIdx].days} {language === "ro" ? "zile" : "days"}
                  </span>
                </>
              )}
            </div>

            {/* Days of the week */}
            {week.map((day, dayIdx) => {
              // Verificăm dacă ziua este weekend
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth();
              const currentDayDate = day ? new Date(year, month, day) : null;
              const isWeekend = currentDayDate && (currentDayDate.getDay() === 0 || currentDayDate.getDay() === 6);
              
              return (
                <div
                  key={dayIdx}
                  onClick={() => day && !isWeekend && dailyData[day] && openDayDetails(day)}
                  className={`h-24 rounded-lg border transition-all ${
                    isWeekend
                      ? 'bg-gray-900/50 border-gray-800/50'
                      : day && dailyData[day]
                      ? dailyData[day].profit >= 0
                        ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                      : day
                      ? 'bg-gray-800/30 border-gray-700/30'
                      : 'border-transparent'
                  } ${day && !isWeekend && dailyData[day] ? 'cursor-pointer' : ''}`}
                >
                  {day && (
                    <div className="p-2 h-full flex flex-col justify-between">
                      <div className={`text-xs font-medium ${isWeekend ? 'text-gray-600' : 'text-gray-400'}`}>
                        {day}
                        {isWeekend && (
                          <span className="ml-1 text-[10px]">
                            {currentDayDate.getDay() === 0 ? '🔒' : '🔒'}
                          </span>
                        )}
                      </div>
                      {isWeekend ? (
                        <div className="text-center">
                          <div className="text-xs text-gray-600">
                            {language === "ro" ? "Piață închisă" : "Market closed"}
                          </div>
                        </div>
                      ) : dailyData[day] ? (
                        <div className="space-y-1">
                          <div className={`text-sm font-bold ${
                            dailyData[day].profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {dailyData[day].profit >= 0 ? '$' : '-$'}{Math.abs(dailyData[day].profit)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {dailyData[day].trades} {language === "ro" ? "trades" : "trades"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {dailyData[day].winRate}%
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30"></div>
          <span>{language === "ro" ? "Profit" : "Profit"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
          <span>{language === "ro" ? "Pierdere" : "Loss"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-800/30 border border-gray-700/30"></div>
          <span>{language === "ro" ? "Fără tranzacții" : "No trades"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-900/50 border border-gray-800/50"></div>
          <span>{language === "ro" ? "Weekend (piață închisă)" : "Weekend (market closed)"}</span>
        </div>
      </div>

      {/* Modal pentru detalii zilnice */}
      {showModal && selectedDay && dailyData[selectedDay] && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-gray-900 border border-gray-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gray-800/50 border-b border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  {dayNames[language][new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay).getDay()]}, {monthNames[language][currentDate.getMonth()].slice(0, 3)} {selectedDay.toString().padStart(2, '0')}, {currentDate.getFullYear()}
                </h3>
                <p className={`text-xl font-bold mt-1 ${dailyData[selectedDay].profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {language === "ro" ? "Profit Net" : "Net P&L"} {dailyData[selectedDay].profit >= 0 ? '$' : '-$'}{Math.abs(dailyData[selectedDay].profit)}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">{language === "ro" ? "Total tranzacții" : "Total trades"}</p>
                  <p className="text-2xl font-bold text-white">{dailyData[selectedDay].trades}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">{language === "ro" ? "Câștigătoare" : "Winners"}</p>
                  <p className="text-2xl font-bold text-emerald-400">{dailyData[selectedDay].winners}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">{language === "ro" ? "Pierzătoare" : "Losers"}</p>
                  <p className="text-2xl font-bold text-red-400">{dailyData[selectedDay].losers}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">Winrate</p>
                  <p className="text-2xl font-bold text-blue-400">{dailyData[selectedDay].winRate}%</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">{language === "ro" ? "P&L Brut" : "Gross P&L"}</p>
                  <p className={`text-lg font-bold ${dailyData[selectedDay].grossPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {dailyData[selectedDay].grossPL >= 0 ? '$' : '-$'}{Math.abs(dailyData[selectedDay].grossPL)}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">{language === "ro" ? "Comisioane" : "Commissions"}</p>
                  <p className="text-lg font-bold text-white">${dailyData[selectedDay].commissions}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">{language === "ro" ? "Volum" : "Volume"}</p>
                  <p className="text-lg font-bold text-white">{dailyData[selectedDay].volume}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">{language === "ro" ? "Factor Profit" : "Profit factor"}</p>
                  <p className="text-lg font-bold text-white">{dailyData[selectedDay].profitFactor}</p>
                </div>
              </div>

              {/* Trades Table */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr className="text-xs text-gray-400">
                        <th className="text-left p-3">{language === "ro" ? "Ora deschidere" : "Open time"}</th>
                        <th className="text-left p-3">Ticker</th>
                        <th className="text-left p-3">Side</th>
                        <th className="text-left p-3">{language === "ro" ? "Instrument" : "Instrument"}</th>
                        <th className="text-right p-3">{language === "ro" ? "P&L Net" : "Net P&L"}</th>
                        <th className="text-right p-3">{language === "ro" ? "ROI Net" : "Net ROI"}</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {dailyData[selectedDay].tradesList.map((trade) => (
                        <tr key={trade.id} className="border-t border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                          <td className="p-3 text-gray-300">{trade.openTime}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-gray-700/50 rounded text-blue-400 text-xs">
                              {trade.ticker}
                            </span>
                          </td>
                          <td className="p-3 text-gray-300">{trade.side}</td>
                          <td className="p-3 text-gray-300">{trade.instrument}</td>
                          <td className={`p-3 text-right font-semibold ${trade.netPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trade.netPL >= 0 ? '$' : '-$'}{Math.abs(trade.netPL)}
                          </td>
                          <td className="p-3 text-right text-gray-300">{trade.netROI}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-800/50 border-t border-gray-700 p-4 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {language === "ro" ? "Închide" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProFXbookCalendar;
