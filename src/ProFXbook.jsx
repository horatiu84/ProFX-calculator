import React, { useState } from "react";
import { useLanguage } from "./contexts/LanguageContext";
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
} from "recharts";

// Custom tooltip pentru growth chart (afișează procente)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const growthPercent = payload[0].value || 0;
    const balanceValue = payload[0].payload.balance || 0;
    return (
      <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-lg p-3 shadow-xl">
        <p className="text-gray-300 text-sm font-semibold">{payload[0].payload.date}</p>
        <p className={`font-bold text-lg ${growthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(2)}%
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Balanță: ${balanceValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

// Date demo pentru evoluția lunară (monthly bars)
const monthlyData = [
  { month: "Ian", return: 4.76, profit: 100 },
  { month: "Feb", return: 7.14, profit: 150 },
  { month: "Mar", return: 5.25, profit: 118 },
  { month: "Apr", return: 2.75, profit: 65 },
  { month: "Mai", return: 6.04, profit: 147 },
  { month: "Iun", return: 5.04, profit: 130 },
  { month: "Iul", return: 6.64, profit: 180 },
  { month: "Aug", return: 7.96, profit: 230 },
  { month: "Sep", return: 21.54, profit: 672 },
  { month: "Oct", return: -0.29, profit: -11 },
];

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

  // State pentru perioada selectată
  const [timePeriod, setTimePeriod] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Date cont (mai târziu vor veni din API)
  const accountType = "real";
  const traderName = "ProFX Trader";
  const accountNumber = "8471052";
  const broker = "FPM Trading";
  const leverage = "1:500";
  const platform = "MetaTrader 5";

  // Statistici pentru diferite perioade (în realitate vor veni din API)
  const statsData = {
    all: {
      gain: 80.02,
      daily: 0.11,
      monthly: 3.39,
      drawdown: 44.33,
      balance: 3781.98,
      equity: 3781.98,
      equityPercent: 100.0,
      highest: 3792.96,
      highestDate: "Sep 22",
      profit: 1440.68,
      interest: -27.11,
      deposits: 2341.30,
      withdrawals: 0.0,
      totalTrades: 147,
      winRate: 68.5,
    },
    today: {
      gain: 0.45,
      daily: 0.45,
      monthly: 3.39,
      drawdown: 0.12,
      balance: 3781.98,
      equity: 3781.98,
      equityPercent: 100.0,
      highest: 3792.96,
      highestDate: "Today",
      profit: 17.05,
      interest: 0,
      deposits: 0,
      withdrawals: 0.0,
      totalTrades: 3,
      winRate: 66.67,
    },
    week: {
      gain: 2.35,
      daily: 0.34,
      monthly: 3.39,
      drawdown: 1.85,
      balance: 3781.98,
      equity: 3781.98,
      equityPercent: 100.0,
      highest: 3792.96,
      highestDate: "Oct 16",
      profit: 88.75,
      interest: -1.25,
      deposits: 0,
      withdrawals: 0.0,
      totalTrades: 12,
      winRate: 75.0,
    },
    month: {
      gain: 8.92,
      daily: 0.29,
      monthly: 8.92,
      drawdown: 5.67,
      balance: 3781.98,
      equity: 3781.98,
      equityPercent: 100.0,
      highest: 3792.96,
      highestDate: "Oct 15",
      profit: 337.52,
      interest: -4.80,
      deposits: 0,
      withdrawals: 0.0,
      totalTrades: 35,
      winRate: 71.4,
    },
  };

  // Date pentru growth chart bazate pe perioadă (cu procente calculate)
  const growthDataByPeriod = {
    all: [
      { date: "Ian", balance: 2100, growth: 0 },
      { date: "Feb", balance: 2250, growth: 7.14 },
      { date: "Mar", balance: 2368, growth: 12.76 },
      { date: "Apr", balance: 2433, growth: 15.86 },
      { date: "Mai", balance: 2580, growth: 22.86 },
      { date: "Iun", balance: 2710, growth: 29.05 },
      { date: "Iul", balance: 2890, growth: 37.62 },
      { date: "Aug", balance: 3120, growth: 48.57 },
      { date: "Sep", balance: 3792, growth: 80.57 },
      { date: "Oct", balance: 3781, growth: 80.05 },
    ],
    today: [
      { date: "09:00", balance: 3764.93, growth: 0 },
      { date: "10:00", balance: 3769.15, growth: 0.11 },
      { date: "11:00", balance: 3772.80, growth: 0.21 },
      { date: "12:00", balance: 3768.45, growth: 0.09 },
      { date: "13:00", balance: 3775.20, growth: 0.27 },
      { date: "14:00", balance: 3778.65, growth: 0.36 },
      { date: "15:00", balance: 3781.98, growth: 0.45 },
    ],
    week: [
      { date: "Lun", balance: 3693.23, growth: 0 },
      { date: "Mar", balance: 3715.80, growth: 0.61 },
      { date: "Mie", balance: 3728.45, growth: 0.95 },
      { date: "Joi", balance: 3752.90, growth: 1.62 },
      { date: "Vin", balance: 3768.12, growth: 2.03 },
      { date: "Sâm", balance: 3776.55, growth: 2.26 },
      { date: "Dum", balance: 3781.98, growth: 2.40 },
    ],
    month: [
      { date: "1 Oct", balance: 3444.46, growth: 0 },
      { date: "5 Oct", balance: 3489.20, growth: 1.30 },
      { date: "10 Oct", balance: 3556.78, growth: 3.26 },
      { date: "15 Oct", balance: 3642.85, growth: 5.76 },
      { date: "17 Oct", balance: 3781.98, growth: 9.80 },
    ],
    custom: [
      { date: "Start", balance: 3500, growth: 0 },
      { date: "Mid", balance: 3650, growth: 4.29 },
      { date: "End", balance: 3781.98, growth: 8.06 },
    ],
  };

  // Selectează statisticile și datele growth bazate pe perioada aleasă
  const stats = statsData[timePeriod] || statsData.all;
  const growthData = growthDataByPeriod[timePeriod] || growthDataByPeriod.all;

  const periodButtons = [
    { id: "today", label: t.today, icon: "📅" },
    { id: "week", label: t.week, icon: "📊" },
    { id: "month", label: t.month, icon: "📈" },
    { id: "all", label: t.total, icon: "🌐" },
    { id: "custom", label: t.custom, icon: "🔧" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white p-4 md:p-8">
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
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
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
                  <span className="text-amber-400 font-semibold text-sm">{broker}</span>
                </div>
                
                {/* Leverage */}
                <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1 rounded-lg border border-gray-600/30">
                  <span className="text-gray-400 text-xs">{t.leverage}:</span>
                  <span className="text-blue-400 font-semibold text-sm">{leverage}</span>
                </div>
                
                {/* Platform */}
                <div className="flex items-center gap-2 bg-gray-700/30 px-3 py-1 rounded-lg border border-gray-600/30">
                  <span className="text-gray-400 text-xs">{t.platform}:</span>
                  <span className="text-purple-400 font-semibold text-sm">{platform}</span>
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

        {/* Statistics - Grouped Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" key={`stats-${language}`}>
          
          {/* Performance Group */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-emerald-400/20 transition-all duration-300 animate-language-change">
            <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              📈 {t.performance}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">{t.gain}</div>
                <div className="text-emerald-400 text-xl font-bold">+{stats.gain}%</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">{t.daily}</div>
                <div className="text-emerald-400 text-xl font-bold">{stats.daily}%</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">{t.monthly}</div>
                <div className="text-emerald-400 text-xl font-bold">{stats.monthly}%</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">{t.drawdown}</div>
                <div className="text-red-400 text-xl font-bold">{stats.drawdown}%</div>
              </div>
            </div>
          </div>

          {/* Account Balance Group */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-400/20 transition-all duration-300 animate-language-change">
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              💰 {t.accountBalance}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">{t.balance}</div>
                <div className="text-blue-400 text-xl font-bold">
                  ${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">{t.equity}</div>
                <div className="text-blue-400 text-xl font-bold">
                  ${stats.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-gray-500 text-xs">({stats.equityPercent}%)</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">{t.highest}</div>
                <div className="text-amber-400 text-lg font-bold">
                  ${stats.highest.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-gray-500 text-xs">({stats.highestDate})</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">{t.profit}</div>
                <div className="text-emerald-400 text-xl font-bold">
                  ${stats.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Group */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-400/20 transition-all duration-300 animate-language-change">
            <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
              💳 {t.transactions}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">{t.deposits}</div>
                <div className="text-blue-400 text-xl font-bold">
                  ${stats.deposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">{t.withdrawals}</div>
                <div className="text-gray-400 text-xl font-bold">
                  ${stats.withdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-400 text-xs mb-1">{t.interest}</div>
                <div className="text-red-400 text-xl font-bold">
                  ${stats.interest.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-amber-400/20 transition-all duration-300 animate-language-change">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
              ⚡ {t.quickStats}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-700/30">
                <span className="text-gray-400 text-sm">{t.totalTrades}</span>
                <span className="text-purple-400 font-bold text-lg">{stats.totalTrades}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-700/30">
                <span className="text-gray-400 text-sm">{t.winRate}</span>
                <span className="text-emerald-400 font-bold text-lg">{stats.winRate}%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-700/30">
                <span className="text-gray-400 text-sm">{t.totalGain}</span>
                <span className="text-emerald-400 font-bold text-lg">+{stats.gain}%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-700/30">
                <span className="text-gray-400 text-sm">{t.netProfit}</span>
                <span className="text-emerald-400 font-bold text-lg">
                  ${stats.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-700/30">
                <span className="text-gray-400 text-sm">{t.maxDrawdown}</span>
                <span className="text-red-400 font-bold text-lg">{stats.drawdown}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{t.currentBalance}</span>
                <span className="text-blue-400 font-bold text-lg">
                  ${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Growth Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6" key={`growth-${language}`}>
          <h3 className="text-xl font-semibold mb-4 text-emerald-400 animate-language-change">
            📊 {t.accountGrowth}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Performance Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6" key={`monthly-${language}`}>
          <h3 className="text-xl font-semibold mb-4 text-amber-400 animate-language-change">
            📅 {t.monthlyPerformance}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<MonthlyTooltip />} />
              <Bar 
                dataKey="return" 
                radius={[8, 8, 0, 0]}
              >
                {monthlyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.return >= 0 ? "#10b981" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Monthly Summary */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            {monthlyData.slice(-5).map((month, index) => (
              <div
                key={index}
                className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30"
              >
                <div className="text-gray-400 text-xs mb-1">{month.month}</div>
                <div
                  className={`font-bold text-lg ${
                    month.return >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {month.return >= 0 ? "+" : ""}{month.return}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm" key={`footer-${language}`}>
          <p className="animate-language-change">{t.footer1}</p>
          <p className="mt-1 animate-language-change">{t.footer2}</p>
        </div>
      </div>
    </div>
  );
}
