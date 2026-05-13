import React from 'react';
import { TrendingUp, Map as MapIcon, ChevronDown } from 'lucide-react';

const MapHeader = ({ selectedCommodity, onCommodityChange }) => {
  const commodities = [
    "Beras Medium"
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-900/60 backdrop-blur-xl p-5 border border-gray-800/50 rounded-2xl shadow-2xl gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <MapIcon className="text-emerald-400" size={24} />
        </div>
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
            SIPANGAN <span className="text-emerald-500">Monitor</span>
          </h2>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Real-time Geospatial Insights • East Java
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-gray-800/30 p-1.5 pl-4 rounded-xl border border-gray-700/50 w-full md:w-auto">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Select Commodity</label>
        <div className="relative group w-full md:w-48">
          <select
            value={selectedCommodity}
            onChange={(e) => onCommodityChange(e.target.value)}
            className="appearance-none w-full bg-gray-900/80 border border-gray-700 text-white text-xs font-bold rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer pr-10 hover:border-emerald-500/50"
          >
            {commodities.map(c => (
              <option key={c} value={c} className="bg-gray-900">{c}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-emerald-500 transition-colors pointer-events-none" size={16} />
        </div>
      </div>
    </div>
  );
};

export default MapHeader;
