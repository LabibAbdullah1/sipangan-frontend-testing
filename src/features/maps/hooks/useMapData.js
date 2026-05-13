import { useState, useEffect, useCallback } from 'react';
import * as topojson from 'topojson-client';
import { mapService } from '../../../api/services';

const useMapData = () => {
  const [geoData, setGeoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regionStatus, setRegionStatus] = useState({});

  const normalizeName = useCallback((name) => {
    if (!name) return '';
    let normalized = name.toLowerCase().trim();
    if (!normalized.startsWith('kota') && !normalized.startsWith('kabupaten')) {
      normalized = `kabupaten ${normalized}`;
    }
    return normalized;
  }, []);

  const fetchMapData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [topologyRes, statusRes] = await Promise.all([
        fetch('/maps/jawatimur.json'),
        mapService.getMapData()
      ]);

      if (!topologyRes.ok) throw new Error('Static map file not found');
      const topology = await topologyRes.json();
      
      const statusList = statusRes.data || statusRes || [];
      const statusMap = {};
      
      statusList.forEach(item => {
        const apiRegionName = item.region || item.name;
        if (apiRegionName) {
          statusMap[normalizeName(apiRegionName)] = item.status;
        }
      });
      setRegionStatus(statusMap);

      if (topology && topology.objects) {
        const objectKey = Object.keys(topology.objects)[0];
        const geojson = topojson.feature(topology, topology.objects[objectKey]);
        
        geojson.features.forEach(feature => {
          const geoName = feature.properties.name || feature.properties.NAME;
          if (geoName) {
            const lookupKey = normalizeName(geoName);
            feature.properties.status = statusMap[lookupKey] || 'No Data';
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
      setError('Unable to load map data. Please check connection or map files.');
    } finally {
      setIsLoading(false);
    }
  }, [normalizeName]);

  useEffect(() => {
    fetchMapData();
  }, [fetchMapData]);

  return { geoData, isLoading, error, regionStatus, refreshMap: fetchMapData };
};

export default useMapData;
