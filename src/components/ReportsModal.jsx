import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';


const ReportsModal = ({ trades, isOpen, onClose, accountBalance, initialBalance }) => {
  // State for report configuration
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [reportData, setReportData] = useState(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    if (isOpen && trades.length > 0) {
      calculateReportData();
    }
  }, [isOpen, trades, reportPeriod, customStartDate, customEndDate]);

  // Calculate date range based on selected period
  const getDateRange = () => {
    const now = new Date();
    let startDate, endDate;

    if (reportPeriod === 'weekly') {
      // Get start of week (7 days ago)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
    } else if (reportPeriod === 'monthly') {
      // Get start of current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
    } else if (reportPeriod === 'custom') {
      startDate = customStartDate ? new Date(customStartDate) : new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = customEndDate ? new Date(customEndDate) : new Date(now);
      endDate.setHours(23, 59, 59, 999);
    }

    return { startDate, endDate };
  };

  // Parse trade date handling different formats
  const parseTradeDate = (trade) => {
    let tradeDate;
    
    // Handle different date formats
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

  // Filter trades based on date range and calculate metrics
  const calculateReportData = () => {
    const { startDate, endDate } = getDateRange();
    
    // Filter trades by date range
    const filtered = trades.filter(trade => {
      const tradeDate = parseTradeDate(trade);
      return tradeDate >= startDate && tradeDate <= endDate;
    });

    setFilteredTrades(filtered);

    if (filtered.length === 0) {
      setReportData(null);
      return;
    }

    // Calculate key metrics
    const totalTrades = filtered.length;
    const winningTrades = filtered.filter(t => t.profitLoss > 0);
    const losingTrades = filtered.filter(t => t.profitLoss < 0);
    const winRate = (winningTrades.length / totalTrades) * 100;
    const totalProfitLoss = filtered.reduce((sum, t) => sum + t.profitLoss, 0);
    const avgProfitLoss = totalProfitLoss / totalTrades;
    
    // Calculate risk/reward ratio using totals
    const totalWins = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, t) => sum + t.profitLoss, 0) : 0;
    const totalLosses = losingTrades.length > 0 ? 
      Math.abs(losingTrades.reduce((sum, t) => sum + t.profitLoss, 0)) : 0;
    const riskRewardRatio = totalLosses > 0 ? totalWins / totalLosses : 0;

    // Prepare chart data
    const profitLossOverTime = calculateCumulativeProfitLoss(filtered);
    const winLossDistribution = [
      { name: 'Trade-uri câștigate', value: winningTrades.length },
      { name: 'Trade-uri pierdute', value: losingTrades.length }
    ];
    
    // Calculate trade type distribution with potential grouping
    const buyTrades = filtered.filter(t => t.type === 'buy').length;
    const sellTrades = filtered.filter(t => t.type === 'sell').length;
    
    const tradeTypeDistribution = [
      { name: 'Buy', value: buyTrades },
      { name: 'Sell', value: sellTrades }
    ];
    
    const currencyPairPerformance = calculateCurrencyPairPerformance(filtered);
    
    // Calculate best and worst trades
    const bestTrade = filtered.length > 0 ? filtered.reduce((best, current) => 
      current.profitLoss > best.profitLoss ? current : best
    ) : null;
    
    const worstTrade = filtered.length > 0 ? filtered.reduce((worst, current) => 
      current.profitLoss < worst.profitLoss ? current : worst
    ) : null;

    setReportData({
      totalTrades,
      winRate,
      totalProfitLoss,
      avgProfitLoss,
      riskRewardRatio,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      profitLossOverTime,
      winLossDistribution,
      tradeTypeDistribution,
      currencyPairPerformance,
      bestTrade,
      worstTrade
    });
  };

  // Calculate cumulative profit/loss over time
  const calculateCumulativeProfitLoss = (trades) => {
    const sortedTrades = [...trades].sort((a, b) => parseTradeDate(a) - parseTradeDate(b));
    let cumulative = 0;
    
    const dataPoints = sortedTrades.map((trade, index) => {
      cumulative += trade.profitLoss;
      const tradeDate = parseTradeDate(trade);
      return {
        date: tradeDate.toLocaleDateString('ro-RO'),
        cumulative: Math.round(cumulative * 100) / 100,
        tradeNumber: index + 1,
        originalIndex: index
      };
    });

    // If we have too many data points (>50), sample them intelligently
    if (dataPoints.length > 50) {
      const sampledPoints = [];
      const step = Math.ceil(dataPoints.length / 40); // Keep ~40 points
      
      // Always include first and last points
      sampledPoints.push(dataPoints[0]);
      
      // Sample intermediate points
      for (let i = step; i < dataPoints.length - 1; i += step) {
        sampledPoints.push(dataPoints[i]);
      }
      
      // Always include the last point
      if (dataPoints.length > 1) {
        sampledPoints.push(dataPoints[dataPoints.length - 1]);
      }
      
      return sampledPoints;
    }
    
    return dataPoints;
  };

  // Calculate performance by currency pair
  const calculateCurrencyPairPerformance = (trades) => {
    const pairData = {};
    
    trades.forEach(trade => {
      if (!pairData[trade.pair]) {
        pairData[trade.pair] = { pair: trade.pair, profitLoss: 0, count: 0 };
      }
      pairData[trade.pair].profitLoss += trade.profitLoss;
      pairData[trade.pair].count += 1;
    });

    const sortedData = Object.values(pairData)
      .map(data => ({
        ...data,
        profitLoss: Math.round(data.profitLoss * 100) / 100
      }))
      .sort((a, b) => b.profitLoss - a.profitLoss);

    // Limit to top 10 performers for better visibility
    const topPerformers = sortedData.slice(0, 10);
    
    // If there are more than 10 pairs, group the rest as "Others"
    if (sortedData.length > 10) {
      const others = sortedData.slice(10);
      const othersTotal = others.reduce((sum, item) => sum + item.profitLoss, 0);
      const othersCount = others.reduce((sum, item) => sum + item.count, 0);
      
      if (othersTotal !== 0) { // Only add "Others" if there's significant data
        topPerformers.push({
          pair: `Altele (${others.length})`,
          profitLoss: Math.round(othersTotal * 100) / 100,
          count: othersCount
        });
      }
    }

    return topPerformers;
  };



  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <div className="flex items-start justify-center min-h-screen py-4">
        <div 
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl w-full max-w-6xl shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-yellow-400">📊 Rapoarte Performanță</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            
            {/* Report Configuration */}
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Perioada Raport
                </label>
                <select
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  <option value="weekly">Săptămâna aceasta</option>
                  <option value="monthly">Luna aceasta</option>
                  <option value="custom">Interval personalizat</option>
                </select>
              </div>
              
              {reportPeriod === 'custom' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Data început
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Data sfârșit
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                </>
              )}
              

            </div>
          </div>

          {/* Report Content */}
          <div className="p-6">
            {!reportData ? (
              <div className="text-center text-gray-400 py-12">
                <p className="text-lg">🔍 Nu au fost găsite trade-uri pentru perioada selectată.</p>
                <p className="text-sm mt-2">Încearcă să selectezi o altă perioadă sau să adaugi trade-uri noi.</p>
              </div>
            ) : (
              <>
                {/* Key Metrics Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                    <h3 className="text-sm font-medium text-blue-400">Total Trade-uri</h3>
                    <p className="text-2xl font-bold text-white">{reportData.totalTrades}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                    <h3 className="text-sm font-medium text-green-400">Rata de câștig</h3>
                    <p className="text-2xl font-bold text-white">{reportData.winRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                    <h3 className={`text-sm font-medium ${reportData.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      Profit Net Total
                    </h3>
                    <p className={`text-2xl font-bold ${reportData.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${reportData.totalProfitLoss.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl group relative">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-purple-400">Performanță P/L</h3>
                      <div className="relative">
                        <span className="text-purple-400 cursor-help text-xs">ⓘ</span>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 border border-purple-400/30 rounded-xl p-4 text-xs text-gray-300 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="text-purple-400 font-semibold mb-2">Formula: Câștig Total ÷ Pierderi Totale</div>
                          <div className="space-y-1 mb-3">
                            <div><span className="text-green-400">• &gt; 1.0:</span> Excelent! Câștigi total mai mult decât pierzi</div>
                            <div><span className="text-yellow-400">• = 1.0:</span> Echilibrat - câștigi total cât pierzi total</div>
                            <div><span className="text-red-400">• &lt; 1.0:</span> Risc mare - pierzi total mai mult decât câștigi</div>
                          </div>
                          <div className="text-xs text-gray-400 border-t border-gray-700 pt-2">
                            <strong>Exemplu:</strong> Câștigi $1000 total, pierzi $400 total → 1000÷400 = 2.5 (excelent!)
                          </div>
                          {/* Tooltip arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-white">{reportData.riskRewardRatio.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        reportData.riskRewardRatio > 1.5 ? 'bg-green-500/20 text-green-400' :
                        reportData.riskRewardRatio > 1.0 ? 'bg-yellow-500/20 text-yellow-400' :
                        reportData.riskRewardRatio > 0.8 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {reportData.riskRewardRatio > 1.5 ? 'Excelent' :
                         reportData.riskRewardRatio > 1.0 ? 'Bun' :
                         reportData.riskRewardRatio > 0.8 ? 'Acceptabil' :
                         'Risc Mare'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Best and Worst Trades */}
                {(reportData.bestTrade || reportData.worstTrade) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Best Trade */}
                    {reportData.bestTrade && reportData.bestTrade.profitLoss > 0 && (
                      <div className="bg-white/5 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl mr-2">🏆</span>
                          <h3 className="text-lg font-semibold text-green-400">Cel mai bun trade</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Pereche:</span>
                            <span className="text-yellow-400 font-semibold">{reportData.bestTrade.pair}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Data:</span>
                            <span className="text-white">{reportData.bestTrade.displayDate || reportData.bestTrade.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Tip:</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              reportData.bestTrade.type === 'buy' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {reportData.bestTrade.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-green-500/20">
                            <span className="text-gray-300">Profit:</span>
                            <span className="text-2xl font-bold text-green-400">
                              +${reportData.bestTrade.profitLoss.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Worst Trade */}
                    {reportData.worstTrade && reportData.worstTrade.profitLoss < 0 && (
                      <div className="bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl mr-2">💔</span>
                          <h3 className="text-lg font-semibold text-red-400">Cea mai mare pierdere</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Pereche:</span>
                            <span className="text-yellow-400 font-semibold">{reportData.worstTrade.pair}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Data:</span>
                            <span className="text-white">{reportData.worstTrade.displayDate || reportData.worstTrade.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Tip:</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              reportData.worstTrade.type === 'buy' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {reportData.worstTrade.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-red-500/20">
                            <span className="text-gray-300">Pierdere:</span>
                            <span className="text-2xl font-bold text-red-400">
                              -${Math.abs(reportData.worstTrade.profitLoss).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Profit/Loss Over Time */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-lg font-semibold mb-4 text-white">📈 Evoluția Profit/Pierdere</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={reportData.profitLossOverTime}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="tradeNumber" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#000000', 
                            border: '2px solid #F59E0B',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                          }}
                          labelStyle={{
                            color: '#FFFFFF',
                            fontWeight: '700'
                          }}
                          itemStyle={{
                            color: '#FFFFFF',
                            fontWeight: '600'
                          }}
                          cursor={{
                            stroke: '#F59E0B',
                            strokeWidth: 2,
                            strokeDasharray: '5 5'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="cumulative" 
                          stroke="#F59E0B" 
                          strokeWidth={3}
                          name="P&L Cumulativ"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Win/Loss Distribution */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-lg font-semibold mb-4 text-white">🎯 Distribuția Câștig/Pierdere</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reportData.winLossDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ value, percent }) => `${value} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={70}
                          innerRadius={20}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {reportData.winLossDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#000000', 
                            border: '2px solid #10B981',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                          }}
                          labelStyle={{
                            color: '#FFFFFF',
                            fontWeight: '700'
                          }}
                          itemStyle={{
                            color: '#FFFFFF',
                            fontWeight: '600'
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          iconType="circle"
                          wrapperStyle={{
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Trade Types */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-lg font-semibold mb-4 text-white">🔄 Tipuri de Trade-uri</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reportData.tradeTypeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ value, percent }) => `${value} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={70}
                          innerRadius={20}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {reportData.tradeTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#000000', 
                            border: '2px solid #0088FE',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                          }}
                          labelStyle={{
                            color: '#FFFFFF',
                            fontWeight: '700'
                          }}
                          itemStyle={{
                            color: '#FFFFFF',
                            fontWeight: '600'
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          iconType="circle"
                          wrapperStyle={{
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Currency Pair Performance */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-lg font-semibold mb-4 text-white">💱 Performanța pe Perechi Valutare</h3>
                    <div className="text-xs text-gray-400 mb-2">
                      {reportData.currencyPairPerformance.length > 10 ? 
                        "Afișăm top 10 performeri + restul grupate" : 
                        `${reportData.currencyPairPerformance.length} perechi valutare`}
                    </div>
                    <ResponsiveContainer 
                      width="100%" 
                      height={Math.max(300, reportData.currencyPairPerformance.length * 30)}
                    >
                      <BarChart 
                        data={reportData.currencyPairPerformance}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="pair" 
                          stroke="#9CA3AF"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={12}
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#000000', 
                            border: '2px solid #F59E0B',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                          }}
                          labelStyle={{
                            color: '#FFFFFF',
                            fontWeight: '700'
                          }}
                          itemStyle={{
                            color: '#FFFFFF',
                            fontWeight: '600'
                          }}
                          cursor={{
                            fill: 'rgba(245, 158, 11, 0.2)'
                          }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="profitLoss" 
                          fill="#F59E0B" 
                          name="P&L"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;