import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as topojson from 'topojson-client';
import { mapService, priceService } from '../../api/services';
import { X, TrendingUp } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [geoData, setGeoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [regionStatus, setRegionStatus] = useState({});
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionPrices, setRegionPrices] = useState([]);
  const [priceLoading, setPriceLoading] = useState(false);
  const [commodities, setCommodities] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState('Beras Medium');

  // Helper to normalize region names for matching
  const normalizeName = (name) => {
    if (!name) return '';
    let normalized = name.toLowerCase().trim();
    // If it's a regency (doesn't start with kota/kabupaten), add kabupaten prefix
    if (!normalized.startsWith('kota') && !normalized.startsWith('kabupaten')) {
      normalized = `kabupaten ${normalized}`;
    }
    return normalized;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch commodities for the selector
        const commRes = await mapService.getMapData(); // The user said /maps returns list of regions, but we need commodities too
        // Actually, let's use commodityService
        // But for now, we'll keep 'beras medium' as primary
      } catch (e) {}
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch both TopoJSON and Status data in parallel
        const [topologyRes, statusRes] = await Promise.all([
          fetch('/maps/jawatimur.json'),
          mapService.getMapData()
        ]);

        if (!topologyRes.ok) throw new Error('Static map file not found');
        const topology = await topologyRes.json();
        
        // Status data from API
        const statusList = statusRes.data || statusRes || [];
        const statusMap = {};
        
        console.log('Raw API Map Data:', statusList);

        statusList.forEach(item => {
          const apiRegionName = item.region || item.name;
          if (apiRegionName) {
            // Use normalized names as keys for better matching
            statusMap[normalizeName(apiRegionName)] = item.status;
          }
        });
        setRegionStatus(statusMap);

        // Convert TopoJSON to GeoJSON
        if (topology && topology.objects) {
          const objectKey = Object.keys(topology.objects)[0];
          const geojson = topojson.feature(topology, topology.objects[objectKey]);
          
          // Inject status into geojson properties by matching name
          geojson.features.forEach(feature => {
            const geoName = feature.properties.name || feature.properties.NAME;
            if (geoName) {
              const lookupKey = normalizeName(geoName);
              feature.properties.status = statusMap[lookupKey] || 'No Data';
              
              // Debug if still 'No Data'
              if (feature.properties.status === 'No Data') {
                console.warn(`No match for: "${geoName}" (Key: "${lookupKey}")`);
              }
            } else {
              feature.properties.status = 'No Data';
            }
          });
          
          setGeoData(geojson);
        } else {
          throw new Error('Invalid TopoJSON format');
        }
      } catch (err) {
        console.error('Failed to load map data:', err);
        setError('Unable to load map data. Please ensure the map file exists in public/maps/ and the API is reachable.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapData();
  }, []);

  const handleRegionClick = async (regionName) => {
    try {
      setSelectedRegion(regionName);
      setPriceLoading(true);
      setRegionPrices([]);
      
      // Format name for API: 
      // If it's a city (already starts with "Kota"), just lowercase it.
      // If it's a regency (doesn't start with "Kota"), prepend "kabupaten ".
      let apiRegionName = regionName.trim();
      if (!apiRegionName.toLowerCase().startsWith('kota') && !apiRegionName.toLowerCase().startsWith('kabupaten')) {
        apiRegionName = `kabupaten ${apiRegionName}`;
      }
      apiRegionName = apiRegionName.toLowerCase();
      
      // Fetch prices for this region with selected commodity
      const response = await priceService.getHistory({ 
        commodity: selectedCommodity, 
        region: apiRegionName
      });
      
      const data = response.data || response || [];
      const priceList = Array.isArray(data) ? data : [];
      
      const sortedData = [...priceList]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-12);

      // Generate Dummy Prediction Data (Next 3 points)
      if (sortedData.length > 0) {
        const lastActual = sortedData[sortedData.length - 1];
        const lastDate = new Date(lastActual.date);
        
        const predictions = [];
        let lastPrice = lastActual.price;
        
        for (let i = 1; i <= 3; i++) {
          const nextDate = new Date(lastDate);
          nextDate.setMonth(lastDate.getMonth() + i);
          
          // Dummy logic: random change between -2% and +5%
          const change = 1 + (Math.random() * 0.07 - 0.02);
          lastPrice = Math.round(lastPrice * change);
          
          predictions.push({
            ...lastActual,
            date: nextDate.toISOString(),
            price: lastPrice,
            isPrediction: true
          });
        }
        
        // Mark actual data
        const actualData = sortedData.map(d => ({ ...d, actualPrice: d.price, predictedPrice: null }));
        
        // Mark prediction data
        const predictionData = predictions.map(d => ({ ...d, actualPrice: null, predictedPrice: d.price }));
        
        // Insert a bridge point to connect the lines
        const bridgePoint = { ...lastActual, actualPrice: lastActual.price, predictedPrice: lastActual.price };
        
        setRegionPrices([...actualData.slice(0, -1), bridgePoint, ...predictionData]);
      } else {
        setRegionPrices([]);
      }
    } catch (err) {
      console.error('Failed to fetch region prices:', err);
    } finally {
      setPriceLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-gray-900 border border-gray-800 rounded-md">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400 text-sm font-medium">Loading geospatial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-gray-900 border border-gray-800 rounded-md">
        <p className="text-crimson-500 text-sm">{error}</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'surplus': return '#10b981'; // Emerald
      case 'deficit': return '#e11d48'; // Rose/Crimson
      case 'stable': 
      case 'normal': return '#3b82f6'; // Blue
      case 'alert': return '#f59e0b'; // Amber
      default: return '#64748b'; // Slate
    }
  };

  return (
    <div className="w-full h-full min-h-[650px] flex flex-col gap-4 relative">
      {/* Top Bar with Commodity Selector */}
      <div className="flex items-center justify-between bg-gray-900/50 p-4 border border-gray-800 rounded-md backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <TrendingUp className="text-emerald-500" size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Geospatial Price Monitor</h2>
            <p className="text-[10px] text-gray-500 font-medium">Visualizing market trends across East Java</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Commodity:</label>
          <select 
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white text-xs rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
          >
            <option value="Beras Medium">Beras Medium</option>
            <option value="Beras Premium">Beras Premium</option>
            <option value="Bawang Merah">Bawang Merah</option>
            <option value="Cabai Rawit">Cabai Rawit</option>
            <option value="Daging Ayam">Daging Ayam</option>
            <option value="Telur Ayam">Telur Ayam</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Map Container */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-md overflow-hidden relative shadow-lg">
        <MapContainer 
          center={[-7.536, 112.238]} // Center on Jawa Timur
          zoom={8} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {geoData && (
            <GeoJSON 
              data={geoData} 
              style={(feature) => ({
                color: selectedRegion === (feature.properties.name || feature.properties.NAME) ? '#fff' : '#1e293b',
                weight: selectedRegion === (feature.properties.name || feature.properties.NAME) ? 2 : 1,
                opacity: 1,
                fillColor: getStatusColor(feature.properties.status),
                fillOpacity: selectedRegion === (feature.properties.name || feature.properties.NAME) ? 0.6 : 0.35,
              })}
              onEachFeature={(feature, layer) => {
                if (feature.properties) {
                  const name = feature.properties.name || feature.properties.NAME || 'Unknown Region';
                  const status = feature.properties.status || 'No Data';
                  const statusColor = getStatusColor(status);
                  
                  layer.bindPopup(
                    `<div class="p-1">
                      <div class="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Region</div>
                      <div class="text-sm font-bold text-white mb-2">${name}</div>
                      <div class="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Status</div>
                      <div class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold" style="background-color: ${statusColor}20; color: ${statusColor}; border: 1px solid ${statusColor}40">
                        ${status.toUpperCase()}
                      </div>
                      <div class="mt-2 pt-2 border-t border-gray-700 text-[10px] text-emerald-400 italic">Click to view price history</div>
                    </div>`
                  );

                  layer.bindTooltip(name, {
                    permanent: false,
                    direction: 'center',
                    className: 'bg-transparent border-none text-white text-[10px] font-bold shadow-none'
                  });
                  
                  layer.on({
                    mouseover: (e) => {
                      const l = e.target;
                      if (selectedRegion !== name) {
                        l.setStyle({ fillOpacity: 0.7, weight: 2, color: '#fff' });
                      }
                    },
                    mouseout: (e) => {
                      const l = e.target;
                      if (selectedRegion !== name) {
                        l.setStyle({ fillOpacity: 0.35, weight: 1, color: '#1e293b' });
                      }
                    },
                    click: () => {
                      handleRegionClick(name);
                    }
                  });
                }
              }}
            />
          )}
        </MapContainer>
        
        {/* Legend */}
        {!selectedRegion && (
          <div className="absolute bottom-6 right-6 z-[1000] bg-gray-900/90 backdrop-blur-sm p-4 border border-gray-800 rounded-lg shadow-xl">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Status Legend</h4>
            <div className="space-y-2">
              {[
                { label: 'Surplus', color: '#10b981' },
                { label: 'Normal / Stable', color: '#3b82f6' },
                { label: 'Alert', color: '#f59e0b' },
                { label: 'Deficit', color: '#e11d48' },
                { label: 'No Data', color: '#64748b' }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-gray-300 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chart Panel */}
      {selectedRegion && (
        <div className="w-[400px] bg-gray-900 border border-gray-800 rounded-md p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{selectedRegion}</h3>
              <p className="text-xs text-gray-400 mt-1">Last 12 records price history</p>
            </div>
            <button 
              onClick={() => setSelectedRegion(null)}
              className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 min-h-0">
            {priceLoading ? (
              <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
                <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500">Fetching history...</p>
              </div>
            ) : regionPrices.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Latest Price</p>
                    <p className="text-xl font-bold text-emerald-500">
                      Rp {new Intl.NumberFormat('id-ID').format(regionPrices[regionPrices.length - 1].price)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Trend</p>
                    <div className="flex items-center gap-2 text-white">
                      <TrendingUp size={16} className="text-emerald-500" />
                      <span className="font-bold">Stable</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={regionPrices}>
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPredict" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickFormatter={(str) => {
                          const date = new Date(str);
                          return date.toLocaleDateString('id-ID', { month: 'short' });
                        }}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickFormatter={(val) => `Rp${val/1000}k`}
                      />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                        formatter={(value, name) => [
                          `Rp ${new Intl.NumberFormat('id-ID').format(value)}`, 
                          name === 'actualPrice' ? 'Actual Price' : 'Forecast'
                        ]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      />
                      {/* Actual Area */}
                      <Area 
                        type="monotone" 
                        dataKey="actualPrice" 
                        name="actualPrice"
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorActual)" 
                        connectNulls={false}
                      />
                      {/* Prediction Area */}
                      <Area 
                        type="monotone" 
                        dataKey="predictedPrice" 
                        name="predictedPrice"
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fillOpacity={1} 
                        fill="url(#colorPredict)" 
                        connectNulls={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-[#10b981]"></div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Actual History</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 border-t-2 border-dashed border-[#f59e0b]"></div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Price Prediction (Dummy)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-gray-500 italic">No price history available for this region.</p>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MapComponent;
