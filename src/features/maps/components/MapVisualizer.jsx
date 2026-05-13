import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapLegend from './MapLegend';

const MapController = ({ selectedRegion, geoData }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedRegion && geoData) {
      const feature = geoData.features.find(f => 
        (f.properties.name || f.properties.NAME) === selectedRegion
      );
      
      if (feature) {
        const layer = L.geoJSON(feature);
        map.flyToBounds(layer.getBounds(), { padding: [100, 100], duration: 1.5 });
      }
    } else if (!selectedRegion) {
      map.flyTo([-7.536, 112.238], 8, { duration: 1.5 });
    }
  }, [selectedRegion, geoData, map]);
  
  return null;
};


const MapVisualizer = ({ geoData, selectedRegion, onRegionClick }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'surplus': return '#10b981';
      case 'deficit': return '#e11d48';
      case 'stable': 
      case 'normal': return '#3b82f6';
      case 'alert': return '#f59e0b';
      default: return '#475569';
    }
  };

  const mapStyle = (feature) => {
    const isSelected = selectedRegion === (feature.properties.name || feature.properties.NAME);
    return {
      color: isSelected ? '#fff' : '#0f172a',
      weight: isSelected ? 3 : 1,
      opacity: 1,
      fillColor: getStatusColor(feature.properties.status),
      fillOpacity: isSelected ? 0.8 : 0.45,
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.name || feature.properties.NAME || 'Unknown Region';
    const status = feature.properties.status || 'No Data';
    const statusColor = getStatusColor(status);
    
    layer.bindPopup(
      `<div class="p-2 min-w-[150px] bg-gray-900 text-white rounded-xl">
        <div class="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1">Geographic Area</div>
        <div class="text-lg font-black text-white mb-3 tracking-tight">${name}</div>
        <div class="flex items-center justify-between items-center py-2 px-3 rounded-lg bg-white/5 border border-white/10">
          <span class="text-[10px] font-bold text-gray-400 uppercase">Status</span>
          <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-[0_0_10px_rgba(0,0,0,0.2)]" style="background-color: ${statusColor}; color: white">
            ${status}
          </span>
        </div>
        <div class="mt-4 pt-3 border-t border-gray-800 text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          Analyze Trends
        </div>
      </div>`,
      { className: 'custom-popup', maxWidth: 300 }
    );

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
          l.setStyle({ fillOpacity: 0.45, weight: 1, color: '#0f172a' });
        }
      },
      click: () => {
        onRegionClick(name);
      }
    });
  };

  return (
    <div className="flex-1 w-full h-full relative rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
      <MapContainer 
        center={[-7.536, 112.238]} 
        zoom={8} 
        style={{ height: '100%', width: '100%', background: '#020617' }}
        zoomControl={false}
      >
        <MapController selectedRegion={selectedRegion} geoData={geoData} />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {geoData && (
          <GeoJSON 
            data={geoData} 
            style={mapStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
      
      {!selectedRegion && <MapLegend />}
      
      <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
        <div className="bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-800 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Live Geographic Feed</span>
        </div>
      </div>
    </div>
  );
};

export default MapVisualizer;
