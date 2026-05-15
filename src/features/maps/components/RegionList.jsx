import React, { useState, useMemo } from 'react';
import { Search, MapPin, TrendingUp, ChevronRight, Filter } from 'lucide-react';

const RegionList = ({ regions, onRegionClick, selectedCommodity }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRegions = useMemo(() => {
    if (!Array.isArray(regions)) return [];
    
    return regions
      .filter(r => {
        const name = r?.name || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      })
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [regions, searchTerm]);


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'aman':
      case 'stabil': return 'text-emerald-500';
      case 'waspada': return 'text-amber-500';
      case 'kritis':
      case 'bahaya': return 'text-rose-500';
      default: return 'text-blue-500';
    }
  };


  return (
    <div className="w-full bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl flex flex-col h-auto lg:h-full lg:overflow-hidden animate-in fade-in slide-in-from-right duration-700">

      <div className="p-4 border-b border-gray-800/50 space-y-3">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight">Region Explorer</h3>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Browse Market Status across East Java
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text"
            placeholder="Search regency or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 lg:overflow-y-auto min-h-0 custom-scrollbar p-4 space-y-2">

        {filteredRegions.length > 0 ? (
          filteredRegions.map((region) => (
            <button
              key={region.name}
              onClick={() => onRegionClick(region.name)}
              className="w-full flex items-center justify-between p-4 bg-gray-800/10 hover:bg-gray-800/40 border border-gray-700/20 hover:border-emerald-500/30 rounded-2xl transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-gray-800/50 rounded-xl border border-gray-700/50 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                  <MapPin className="text-gray-500 group-hover:text-emerald-500 transition-colors" size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                    {region.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${getStatusColor(region.status)}`}>
                      {region.status || 'NORMAL'}
                    </span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={10} className="text-amber-500" />
                      <span className="text-[10px] text-gray-400 font-bold">
                        {region.price ? `Rp ${new Intl.NumberFormat('id-ID').format(region.price)}` : 'No Price'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
              <ChevronRight className="text-gray-700 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" size={18} />
            </button>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700/50">
              <Search className="text-gray-600" size={24} />
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">No matching regions found</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-900/50 border-t border-gray-800/50">
        <div className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
          <div className="flex items-center gap-3">
            <Filter size={14} className="text-emerald-500" />
            <div>
              <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Selected Commodity</p>
              <p className="text-[11px] font-bold text-white">{selectedCommodity}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionList;
