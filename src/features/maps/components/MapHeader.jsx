import React from 'react';
import { TrendingUp, Map as MapIcon, Package } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';

const MapHeader = ({ selectedCommodity, onCommodityChange, commodities = [] }) => {
  const commodityOptions = commodities.length > 0 
    ? commodities.map(c => ({ label: c.name, value: c.name }))
    : [{ label: "Beras Medium", value: "Beras Medium" }];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-900/60 backdrop-blur-xl p-5 border border-gray-800/50 rounded-2xl shadow-2xl gap-4 relative z-50">
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

      <div className="flex items-center gap-4 bg-gray-800/30 p-1.5 pl-5 rounded-2xl border border-gray-700/50 w-full md:w-auto">
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-0.5 ml-1">Commodity Selector</label>
          <div className="w-full md:w-64">
            <CustomDropdown
              value={selectedCommodity}
              onChange={onCommodityChange}
              options={commodityOptions}
              placeholder="Select Commodity"
              icon={Package}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapHeader;
