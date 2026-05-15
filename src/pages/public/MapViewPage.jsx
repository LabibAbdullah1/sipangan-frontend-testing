import React from 'react';
import MapComponent from '../../features/maps/MapComponent';

const MapViewPage = () => {
  return (
    <div className="mt-2 mb-2 flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 min-h-0">
        <MapComponent />
      </div>
    </div>
  );
};

export default MapViewPage;
