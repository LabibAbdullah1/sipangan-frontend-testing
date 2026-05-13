import { useState, useEffect, useCallback } from 'react';
import { priceService } from '../../../api/services';

const useRegionPrices = (commodity) => {
  const [overviewData, setOverviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await priceService.getOverview();
      const data = response.data || response || [];
      // Filter for the current commodity
      const filtered = data.filter(item => 
        item.commodity?.toLowerCase() === commodity?.toLowerCase()
      );
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
