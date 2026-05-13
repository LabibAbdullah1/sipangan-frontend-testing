import React, { useState } from 'react';
import useMapData from './hooks/useMapData';
import usePriceHistory from './hooks/usePriceHistory';
import useRegionPrices from './hooks/useRegionPrices';

import MapHeader from './components/MapHeader';
import MapVisualizer from './components/MapVisualizer';
import PriceSidebar from './components/PriceSidebar';
import RegionList from './components/RegionList';


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

  const { overviewData } = useRegionPrices(selectedCommodity);

  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName);
    const currentData = regionList.find(r => r.name === regionName);
    fetchPriceHistory(regionName, selectedCommodity, currentData);
  };


  const handleCommodityChange = (commodity) => {
    setSelectedCommodity(commodity);
    if (selectedRegion) {
      const currentData = regionList.find(r => r.name === selectedRegion);
      fetchPriceHistory(selectedRegion, commodity, currentData);
    }
  };


  const handleCloseSidebar = () => {
    setSelectedRegion(null);
    setRegionPrices([]);
  };

  const enrichedGeoData = React.useMemo(() => {
    if (!geoData || !overviewData) return geoData;

    return {
      ...geoData,
      features: geoData.features
        .map(f => {
          const name = f.properties.name || f.properties.NAME;
          const priceData = overviewData.find(p => {
            // Check various possible name fields from backend
            const regName = (p.region || p.name || p.region_name || '').toLowerCase();
            const featName = name?.toLowerCase() || '';
            
            return regName.includes(featName) || featName.includes(regName);
          });


          return {
            ...f,
            properties: {
              ...f.properties,
              status: priceData?.status || priceData?.keadaan || 'aman',
              price: priceData?.current_price || priceData?.price || priceData?.harga,
              fullRegionName: priceData?.region || priceData?.name || priceData?.region_name || name,
              fullCommodityName: priceData?.commodity || priceData?.commodity_name || selectedCommodity
            }
          };




        })
        .sort((a, b) => {
          // Put "KOTA" at the end so they are rendered on top of regencies
          const nameA = (a.properties.name || a.properties.NAME || '').toUpperCase();
          const nameB = (b.properties.name || b.properties.NAME || '').toUpperCase();
          const isKotaA = nameA.includes('KOTA');
          const isKotaB = nameB.includes('KOTA');
          
          if (isKotaA && !isKotaB) return 1;
          if (!isKotaA && isKotaB) return -1;
          return 0;
        })
    };
  }, [geoData, overviewData, selectedCommodity]);


  const regionList = React.useMemo(() => {
    if (!enrichedGeoData?.features) return [];
    const allRegions = enrichedGeoData.features.map(f => ({
      name: f.properties.fullRegionName || f.properties.name || f.properties.NAME,
      commodity: f.properties.fullCommodityName || selectedCommodity,
      status: f.properties.status,
      price: f.properties.price
    }));

    // Remove duplicates based on name
    return allRegions.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
  }, [enrichedGeoData, selectedCommodity]);




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
    <div className="w-full flex flex-col gap-6 relative pb-12">
      {/* Premium Header */}
      <MapHeader 
        selectedCommodity={selectedCommodity} 
        onCommodityChange={handleCommodityChange} 
      />

      <div className="flex flex-col lg:flex-row gap-6 relative lg:h-[calc(100vh-14rem)] lg:min-h-[600px]">
        {/* Main Map Visualizer */}
        <div className={`transition-all duration-500 ease-in-out ${selectedRegion ? 'lg:flex-[1.5]' : 'flex-1'} h-[400px] lg:h-full`}>
          <MapVisualizer 
            geoData={enrichedGeoData}
            selectedRegion={selectedRegion}
            onRegionClick={handleRegionClick}
          />
        </div>



        {/* Analytics Sidebar or Region List */}
        <div className="w-full lg:w-[450px] h-[500px] lg:h-full flex flex-col overflow-hidden">

          {selectedRegion ? (
            <div className="h-full animate-in slide-in-from-right duration-500 flex flex-col overflow-hidden">
              <PriceSidebar 
                region={selectedRegion}
                status={regionList.find(r => r.name === selectedRegion)?.status}
                prices={regionPrices}
                isLoading={isPriceLoading}
                onClose={handleCloseSidebar}
              />

            </div>
          ) : (
            <div className="h-full flex flex-col overflow-hidden">
              <RegionList 
                regions={regionList}
                selectedCommodity={selectedCommodity}
                onRegionClick={handleRegionClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>





  );
};

export default MapComponent;
