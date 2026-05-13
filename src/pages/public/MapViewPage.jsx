import React from 'react';
import MapComponent from '../../features/maps/MapComponent';

const MapViewPage = () => {
  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-semibold">Geospatial Distribution</h1>
        <p className="text-sm text-gray-400 mt-1">Interactive map displaying commodity density and regional statistics.</p>
      </div>
      <div className="flex-1">
        <MapComponent />
      </div>
    </div>
  );
};

export default MapViewPage;
