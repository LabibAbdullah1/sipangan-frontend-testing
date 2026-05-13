import { useState, useCallback } from 'react';
import { priceService } from '../../../api/services';

const usePriceHistory = () => {
  const [regionPrices, setRegionPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPriceHistory = useCallback(async (regionName, commodity) => {
    if (!regionName) return;

    try {
      setIsLoading(true);
      setError(null);
      
      let apiRegionName = regionName.trim();
      if (!apiRegionName.toLowerCase().startsWith('kota') && !apiRegionName.toLowerCase().startsWith('kabupaten')) {
        apiRegionName = `kabupaten ${apiRegionName}`;
      }
      apiRegionName = apiRegionName.toLowerCase();
      
      const response = await priceService.getHistory({ 
        commodity: commodity, 
        region: apiRegionName
      });
      
      const data = response.data || response || [];
      const priceList = Array.isArray(data) ? data : [];
      
      const sortedData = [...priceList]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-12);

      if (sortedData.length > 0) {
        const lastActual = sortedData[sortedData.length - 1];
        const lastDate = new Date(lastActual.date);
        
        const predictions = [];
        let lastPrice = lastActual.price;
        
        for (let i = 1; i <= 3; i++) {
          const nextDate = new Date(lastDate);
          nextDate.setMonth(lastDate.getMonth() + i);
          
          const change = 1 + (Math.random() * 0.07 - 0.02);
          lastPrice = Math.round(lastPrice * change);
          
          predictions.push({
            ...lastActual,
            date: nextDate.toISOString(),
            price: lastPrice,
            isPrediction: true
          });
        }
        
        const actualData = sortedData.map(d => ({ ...d, actualPrice: d.price, predictedPrice: null }));
        const predictionData = predictions.map(d => ({ ...d, actualPrice: null, predictedPrice: d.price }));
        const bridgePoint = { ...lastActual, actualPrice: lastActual.price, predictedPrice: lastActual.price };
        
        setRegionPrices([...actualData.slice(0, -1), bridgePoint, ...predictionData]);
      } else {
        setRegionPrices([]);
      }
    } catch (err) {
      console.error('Failed to fetch region prices:', err);
      setError('Failed to load price history');
      setRegionPrices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { regionPrices, isLoading, error, fetchPriceHistory, setRegionPrices };
};

export default usePriceHistory;
