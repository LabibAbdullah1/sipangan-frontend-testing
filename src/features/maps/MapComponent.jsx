import React, { useState } from 'react';
import useMapData from './hooks/useMapData';
import usePriceHistory from './hooks/usePriceHistory';
import MapHeader from './components/MapHeader';
import MapVisualizer from './components/MapVisualizer';
import PriceSidebar from './components/PriceSidebar';

const MapComponent = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('Beras Medium');
  const [selectedRegion, setSelectedRegion] = useState(null);
  
  const { geoData, isLoading: isMapLoading, error: mapError } = useMapData();
  const { 
    regionPrices, 
    isLoading: isPriceLoading, 
    fetchPriceHistory, 
    setRegionPrices 
  } = usePriceHistory();

  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName);
    fetchPriceHistory(regionName, selectedCommodity);
  };

  const handleCommodityChange = (commodity) => {
    setSelectedCommodity(commodity);
    if (selectedRegion) {
      fetchPriceHistory(selectedRegion, commodity);
    }
  };

  const handleCloseSidebar = () => {
    setSelectedRegion(null);
    setRegionPrices([]);
  };

  if (isMapLoading) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center bg-[#020617] border border-gray-800 rounded-3xl">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 h-16 w-16 border-4 border-emerald-500/10 rounded-full animate-pulse"></div>
        </div>
        <p className="mt-6 text-gray-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">
          Initializing Geospatial Engine
        </p>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center bg-[#020617] border border-red-900/30 rounded-3xl p-10 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
          <span className="text-red-500 text-2xl font-bold">!</span>
        </div>
        <h3 className="text-white font-black uppercase tracking-widest mb-2">Systems Offline</h3>
        <p className="text-gray-500 text-xs max-w-xs leading-relaxed">{mapError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border border-gray-700"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-6 relative min-h-[600px]">
      {/* Premium Header */}
      <MapHeader 
        selectedCommodity={selectedCommodity} 
        onCommodityChange={handleCommodityChange} 
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 relative">
        {/* Main Map Visualizer */}
        <MapVisualizer 
          geoData={geoData}
          selectedRegion={selectedRegion}
          onRegionClick={handleRegionClick}
        />

        {/* Analytics Sidebar (Hidden if no region selected) */}
        <PriceSidebar 
          region={selectedRegion}
          prices={regionPrices}
          isLoading={isPriceLoading}
          onClose={handleCloseSidebar}
        />
      </div>
    </div>
  );
};

export default MapComponent;
