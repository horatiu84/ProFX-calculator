import React from "react";
import ProFXbookCalendar from "../ProFXbookCalendar";
import ProFXDoctor from "../ProFXDoctor";
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

export default function ProFXbookDashboard({
  currentAccountData,
  selectedBroker,
  accountNumber,
  serverType,
  timePeriod,
  showCustomDatePicker,
  customStartDate,
  customEndDate,
  showDoctor,
  stats,
  monthlyData,
  growthData,
  periodButtons,
  language,
  t,
  onLogout,
  onTimePeriodChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onApplyCustomDate,
  onToggleDoctor,
  onCalendarDataGenerated
}) {
  // Date cont
  const accountType = serverType === "Live" ? "real" : "demo";
  const traderName = "ProFX Trader";
  const leverage = "1:500";
  const platform = "MetaTrader 5";

  // Helper function pentru formatare sigură
  const formatCurrency = (value) => {
    const num = value || 0;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

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
              onClick={onLogout}
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
                  onClick={() => onTimePeriodChange(period.id)}
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
                    onChange={(e) => onCustomStartDateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1 block">{t.customEnd}</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => onCustomEndDateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={onApplyCustomDate}
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
                  onDataGenerated={onCalendarDataGenerated}
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
            onClick={onToggleDoctor}
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
              onClose={() => onToggleDoctor()}
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
