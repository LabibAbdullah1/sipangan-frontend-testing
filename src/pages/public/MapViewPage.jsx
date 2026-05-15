import React from 'react';
import MapComponent from '../../features/maps/MapComponent';

const MapViewPage = () => {
  return (
    <div className="py-0.5 lg:py-0 lg:mt-2 lg:mb-2 flex-1 flex flex-col min-h-0 lg:overflow-hidden">
      <div className="flex-1 min-h-0">
        <MapComponent />
      </div>
    </div>
  );
};

export default MapViewPage;
