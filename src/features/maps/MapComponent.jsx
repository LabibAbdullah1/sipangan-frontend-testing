import React, { useState, useEffect } from 'react';
import useMapData from './hooks/useMapData';
import usePriceHistory from './hooks/usePriceHistory';
import useRegionPrices from './hooks/useRegionPrices';
import { commodityService } from '../../api/services';

import MapHeader from './components/MapHeader';
import MapVisualizer from './components/MapVisualizer';
import PriceSidebar from './components/PriceSidebar';
import RegionList from './components/RegionList';


const MapComponent = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('Beras Medium');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedRange, setSelectedRange] = useState(12);
  const [commodities, setCommodities] = useState([]);

  const { geoData, isLoading: isMapLoading, error: mapError } = useMapData();
  const {
    regionPrices,
    isLoading: isPriceLoading,
    fetchPriceHistory,
    setRegionPrices
  } = usePriceHistory();

  const { overviewData } = useRegionPrices(selectedCommodity);

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const response = await commodityService.getAll();
        const data = response.data || [];
        setCommodities(data);
        if (data.length > 0 && !selectedCommodity) {
          setSelectedCommodity(data[0].name);
        }
      } catch (error) {
        console.error('Failed to fetch commodities:', error);
      }
    };
    fetchCommodities();
  }, []);

  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName);
    const currentData = regionList.find(r => r.name === regionName);
    fetchPriceHistory(regionName, selectedCommodity, currentData, selectedRange);
  };


  const handleCommodityChange = (commodity) => {
    setSelectedCommodity(commodity);
    if (selectedRegion) {
      const currentData = regionList.find(r => r.name === selectedRegion);
      fetchPriceHistory(selectedRegion, commodity, currentData, selectedRange);
    }
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    if (selectedRegion) {
      const currentData = regionList.find(r => r.name === selectedRegion);
      fetchPriceHistory(selectedRegion, selectedCommodity, currentData, range);
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
            const rawRegName = (p.region || p.name || p.region_name || '').toLowerCase();
            const rawFeatName = (name || '').toLowerCase();

            // Function to strip prefixes and dots (v2)
            const clean = (s) => s.replace(/kabupaten|kota|kab|city|kab\.|kota\./g, '').replace(/\./g, '').trim();
            const cleanReg = clean(rawRegName);
            const cleanFeat = clean(rawFeatName);

            // 1. Basic matching of core names
            const isBaseMatch = cleanReg.includes(cleanFeat) || cleanFeat.includes(cleanReg);
            if (!isBaseMatch) return false;

            // 2. Strict Type Check (Kota vs Kabupaten)
            // If one is clearly a Kota and the other is clearly NOT, it's a mismatch
            const isRegKota = rawRegName.includes('kota');
            const isFeatKota = rawFeatName.includes('kota');

            return isRegKota === isFeatKota;
          });


          return {
            ...f,
            properties: {
              ...f.properties,
              status: priceData?.status || 'aman',
              price: priceData?.current_price || 0,
              previousPrice: priceData?.previous_price || 0,
              trend: priceData?.trend || 'stable',
              percentChange: priceData?.percent_change || 0,
              regionId: priceData?.region_id || null,
              fullRegionName: priceData?.region_name || name,
              fullCommodityName: priceData?.commodity_name || selectedCommodity
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
      regionId: f.properties.regionId,
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
    <div className="w-full h-full flex flex-col gap-2 relative overflow-hidden">
      {/* Premium Header */}
      <MapHeader
        selectedCommodity={selectedCommodity}
        onCommodityChange={handleCommodityChange}
        commodities={commodities}
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-4 relative min-h-0">
        {/* Main Map Visualizer */}
        <div className={`transition-all duration-500 ease-in-out ${selectedRegion ? 'lg:flex-[1.5]' : 'flex-1'} aspect-square lg:aspect-auto h-auto lg:h-full shrink-0`}>
          <MapVisualizer
            geoData={enrichedGeoData}
            selectedRegion={selectedRegion}
            onRegionClick={handleRegionClick}
          />
        </div>



        {/* Analytics Sidebar or Region List */}
        <div className="w-full h-[650px] lg:h-full lg:w-[450px] flex flex-col relative min-h-0 shrink-0">

          {selectedRegion ? (
            <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-right duration-500">
              <PriceSidebar
                region={selectedRegion}
                regionId={regionList.find(r => r.name === selectedRegion)?.regionId}
                status={regionList.find(r => r.name === selectedRegion)?.status}
                currentPrice={regionList.find(r => r.name === selectedRegion)?.price}
                trend={regionList.find(r => r.name === selectedRegion)?.trend}
                prices={regionPrices}
                isLoading={isPriceLoading}
                selectedRange={selectedRange}
                onRangeChange={handleRangeChange}
                onClose={handleCloseSidebar}
              />

            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
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
