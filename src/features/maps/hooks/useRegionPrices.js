import { useState, useEffect, useCallback } from 'react';
import { priceService } from '../../../api/services';

const useRegionPrices = (commodity) => {
  const [overviewData, setOverviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch data with commodity parameter if provided
      const response = await priceService.getOverview({ commodity });
      
      // Handle both raw array and wrapped { data: [...] } structure
      const rawData = response.data || response || [];
      const dataArray = Array.isArray(rawData) ? rawData : (rawData.data || []);

      // With the new backend logic, dataArray is already filtered or aggregated correctly
      setOverviewData(dataArray);

    } catch (err) {
      console.error('Failed to fetch price overview:', err);
    } finally {
      setIsLoading(false);
    }
  }, [commodity]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { overviewData, isLoading, refreshOverview: fetchOverview };
};

export default useRegionPrices;
