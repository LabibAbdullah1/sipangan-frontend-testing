import { X, TrendingUp, TrendingDown, ArrowRight, Info, ArrowUpRight, Calendar, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

const PriceSidebar = ({ region, status, currentPrice, trend, prices, isLoading, selectedRange, onRangeChange, onClose }) => {
  if (!region) return null;

  const getStatusColor = (s) => {
    switch (s?.toLowerCase()) {
      case 'aman':
      case 'stabil': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' };
      case 'waspada': return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' };
      case 'kritis':
      case 'bahaya': return { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' };
      default: return { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' };
    }
  };

  const statusStyle = getStatusColor(status);

  const actualPrices = prices.filter(p => !p.isPrediction);
  const latestActual = actualPrices[actualPrices.length - 1];
  const previousActual = actualPrices[actualPrices.length - 2];
  
  const priceFromHistory = latestActual ? latestActual.price : 0;
  
  const calculatedTrend = (() => {
    if (trend) return trend;
    if (!latestActual || !previousActual) return 'stable';
    const diff = latestActual.price - previousActual.price;
    if (Math.abs(diff) < 100) return 'stable';
    return diff > 0 ? 'up' : 'down';
  })();

  const firstPrediction = prices.find(p => p.isPrediction);
  const predictedPrice = firstPrediction ? firstPrediction.price : 0;

  return (
    <div className="w-full lg:w-[450px] bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out overflow-hidden h-auto lg:h-full">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-gray-800/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-white/10">
              Region Analytics
            </span>
            <span className={`px-2 py-0.5 ${statusStyle.bg} ${statusStyle.text} text-[9px] font-black uppercase tracking-widest rounded-md border ${statusStyle.border} animate-pulse`}>
              Status: {status || 'Normal'}
            </span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{region}</h3>
        </div>

        <button 
          onClick={onClose}
          className="p-3 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-2xl transition-all border border-gray-700/50 hover:border-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Stats Grid - Stable layout to prevent flicker */}
        <div className={`grid grid-cols-1 ${predictedPrice > 0 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'} gap-4`}>
          <div className={`p-5 bg-gray-800/20 rounded-2xl border border-gray-700/20 hover:border-emerald-500/30 transition-colors duration-300 ${isLoading ? 'animate-pulse' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Current Price</p>
              <div className={`p-1.5 ${calculatedTrend === 'up' ? 'bg-red-500/10' : calculatedTrend === 'down' ? 'bg-emerald-500/10' : 'bg-blue-500/10'} rounded-lg`}>
                {calculatedTrend === 'up' ? <TrendingUp size={14} className="text-red-500" /> : 
                 calculatedTrend === 'down' ? <TrendingDown size={14} className="text-emerald-500" /> : 
                 <ArrowRight size={14} className="text-blue-500" />}
              </div>
            </div>
            <p className="text-2xl font-black text-white">
              <span className="text-xs text-emerald-500 mr-1">Rp</span>
              {new Intl.NumberFormat('id-ID').format(priceFromHistory || currentPrice || 0)}
            </p>
          </div>

          {predictedPrice > 0 && !isLoading && (
            <div className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10 transition-colors duration-300 animate-in fade-in zoom-in duration-500">
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] text-amber-500/60 uppercase font-black tracking-widest">Forecasted Price</p>
                    <div className="p-1.5 bg-amber-500/10 rounded-lg">
                      <TrendingUp size={14} className="text-amber-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-black text-white">
                      <span className="text-xs text-amber-500 mr-1">Rp</span>
                      {new Intl.NumberFormat('id-ID').format(predictedPrice)}
                    </p>
                    {(currentPrice || priceFromHistory) > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${predictedPrice >= (currentPrice || priceFromHistory) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {predictedPrice >= (currentPrice || priceFromHistory) ? '+' : ''}{((predictedPrice - (currentPrice || priceFromHistory)) / (currentPrice || priceFromHistory) * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Next Month Estimate</p>
                </>
              </div>
            )}
          </div>

        <AnimatePresence mode="wait">
          {isLoading && prices.length === 0 ? (
            <motion.div 
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 animate-pulse"
            >
              {/* Chart Skeleton */}
              <div className="space-y-4">
                <div className="h-4 w-32 bg-gray-800/50 rounded"></div>
                <div className="h-[320px] bg-gray-800/20 rounded-3xl border border-gray-800/50"></div>
              </div>
              {/* Info Card Skeleton */}
              <div className="h-24 bg-gray-800/20 rounded-2xl border border-gray-700/10"></div>
            </motion.div>
          ) : prices.length > 0 ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 relative"
            >
              {/* Chart Section */}
              <div className="space-y-4 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={14} /> {selectedRange} Data Points
                    </h4>
                    {prices.length > 0 && (
                      <p className="text-[10px] text-gray-500 font-bold mt-0.5 ml-6">
                        Period: {new Date(prices[0].date).getFullYear()} — {new Date(prices[prices.length - 1].date).getFullYear()}
                      </p>
                    )}
                  </div>
                  
                  {/* Range Selector */}
                  <div className="flex bg-gray-800/50 p-1 rounded-xl border border-gray-700/50">
                    {[12, 24, 120].map((r) => (
                      <button
                        key={r}
                        onClick={() => !isLoading && onRangeChange(r)}
                        disabled={isLoading}
                        className={`
                          px-3 py-1 rounded-lg text-[10px] font-black transition-all
                          ${selectedRange === r 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'text-gray-500 hover:text-gray-300'}
                          ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
                        `}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  {/* Loading Overlay for Chart */}
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 bg-gray-950/20 backdrop-blur-[2px] rounded-3xl flex items-center justify-center border border-emerald-500/10"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">Updating Data</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={`h-[200px] lg:h-[250px] w-full bg-gray-800/10 rounded-3xl p-4 border border-gray-800/30 transition-all duration-500 ${isLoading ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={prices} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPredict" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#475569" 
                          fontSize={10} 
                          fontWeight="bold"
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(str) => {
                            const date = new Date(str);
                            return date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
                          }}
                        />
                        <YAxis 
                          stroke="#475569" 
                          fontSize={10} 
                          fontWeight="bold"
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(val) => `${val/1000}k`}
                        />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                          itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                          labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 'bold', fontSize: '10px' }}
                          formatter={(value, name) => [
                            `Rp ${new Intl.NumberFormat('id-ID').format(value)}`, 
                            name === 'actualPrice' ? 'Current Price' : 'Forecasted'
                          ]}
                          labelFormatter={(label) => new Date(label).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="actualPrice" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorActual)" 
                          animationDuration={1000}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="predictedPrice" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          strokeDasharray="6 6"
                          fillOpacity={1} 
                          fill="url(#colorPredict)" 
                          animationDuration={1000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Info className="text-emerald-500" size={18} />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-emerald-400 mb-1 tracking-tight">Supply Forecast</h5>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                      The market trend shows stability for the next 3 months. Local production is expected to meet demand with a projected price variance of <span className="text-emerald-400 font-bold">±2%</span>.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col items-center justify-center text-center p-10 space-y-4"
            >
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700/50">
                <Calendar className="text-gray-600" size={32} />
              </div>
              <div>
                <p className="text-white font-black uppercase tracking-widest text-xs mb-2">No Historical Data</p>
                <p className="text-gray-500 text-[11px] font-medium leading-relaxed">
                  We couldn't find any historical price records for this region and commodity combination.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Footer / Legend */}
      <div className="p-6 border-t border-gray-800/50 bg-gray-900/50 flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-emerald-500 rounded-full"></div>
          <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Historical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-amber-500 rounded-full opacity-50"></div>
          <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Forecast</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSidebar;
