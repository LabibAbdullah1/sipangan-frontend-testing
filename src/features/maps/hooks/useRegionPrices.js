import { useState, useEffect, useCallback } from 'react';
import { priceService } from '../../../api/services';

const useRegionPrices = (commodity) => {
  const [overviewData, setOverviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await priceService.getOverview();
      // Handle both raw array and wrapped { data: [...] } structure
      const rawData = response.data || response || [];
      const dataArray = Array.isArray(rawData) ? rawData : (rawData.data || []);

      // Filter for the current commodity (flexible matching)
      const filtered = dataArray.filter(item => {
        const itemComm = (item.commodity || item.commodity_name || '').toLowerCase();
        const searchComm = (commodity || '').toLowerCase();
        return itemComm.includes(searchComm) || searchComm.includes(itemComm);
      });
      setOverviewData(filtered);

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
