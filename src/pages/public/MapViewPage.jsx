import React from 'react';
import MapComponent from '../../features/maps/MapComponent';

const MapViewPage = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0">
        <MapComponent />
      </div>
    </div>
  );
};

export default MapViewPage;
