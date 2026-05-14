import React from 'react';
import MapComponent from '../../features/maps/MapComponent';

const MapViewPage = () => {
  return (
    <div className="lg:h-[calc(100vh-6rem)] flex flex-col lg:overflow-hidden pb-12 lg:pb-0">
      <div className="flex-1 min-h-0">
        <MapComponent />
      </div>
    </div>
  );
};

export default MapViewPage;
