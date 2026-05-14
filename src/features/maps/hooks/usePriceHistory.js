import { useState, useCallback } from 'react';
import { priceService, predictionService } from '../../../api/services';


const usePriceHistory = () => {
  const [regionPrices, setRegionPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPriceHistory = useCallback(async (regionName, commodity, currentPriceData = null, limit = 12) => {
    if (!regionName) return;

    try {
      setIsLoading(true);
      setError(null);

      const apiRegionName = regionName.trim();
      const apiCommodityName = commodity.trim();

      // Fetch both history and prediction in parallel
      // We fetch 'limit' points from the history
      const [historyResponse, predictionResponse] = await Promise.all([
        priceService.getHistory({ commodity: apiCommodityName, region: apiRegionName, limit }),
        predictionService.getPrediction(apiCommodityName, apiRegionName).catch(() => null)
      ]);

      // Process History
      const histData = historyResponse?.data || historyResponse || [];
      const priceList = Array.isArray(histData) ? histData : [];
      
      // Map and sanitize history points
      let processedHistory = priceList.map(d => ({
        ...d,
        price: d.price || d.harga || d.current_price || d.value,
        date: d.date || d.created_at || d.tanggal
      })).filter(d => d.price && d.date);

      // Sort ascending for the chart
      let sortedData = [...processedHistory]
        .sort((a, b) => new Date(a.date) - new Date(b.date));


      // FALLBACK: If history is empty but we have currentPriceData from overview
      const fallbackPrice = currentPriceData?.price || currentPriceData?.harga || currentPriceData?.current_price;
      if (sortedData.length === 0 && fallbackPrice) {
        sortedData = [{
          date: new Date().toISOString(),
          price: fallbackPrice,
          actualPrice: fallbackPrice,
          region: regionName,
          commodity: commodity
        }];
      }

      // Process Prediction
      const predData = predictionResponse?.data || predictionResponse;

      if (sortedData.length > 0) {
        const lastActual = sortedData[sortedData.length - 1];
        const lastDate = new Date(lastActual.date);

        let predictionPoints = [];

        // Support both direct object and the { predictions: [] } format from backend
        const predictionsArray = predData?.predictions || (Array.isArray(predData) ? predData : (predData ? [predData] : []));
        
        if (predictionsArray.length > 0) {
          predictionPoints = predictionsArray.map((p, index) => {

            const predDate = p.date ? new Date(p.date) : new Date(lastDate);
            if (!p.date) predDate.setMonth(lastDate.getMonth() + (index + 1));

            return {
              ...lastActual,
              date: predDate.toISOString(),
              price: p.price || p.predictedPrice || p.harga_prediksi,
              isPrediction: true
            };
          });
        }

        const actualData = sortedData.map(d => ({ ...d, actualPrice: d.price || d.actualPrice, predictedPrice: null }));
        const predictionData = predictionPoints.map(d => ({ ...d, actualPrice: null, predictedPrice: d.price }));
        const bridgePoint = { ...lastActual, actualPrice: lastActual.price || fallbackPrice, predictedPrice: lastActual.price || fallbackPrice };

        setRegionPrices([...actualData.slice(0, -1), bridgePoint, ...predictionData]);
      } else {
        setRegionPrices([]);
      }
    } catch (err) {
      console.error('Failed to fetch region prices:', err);
      
      // Even on Error, try to show the current price from overview
      const fallbackPrice = currentPriceData?.price || currentPriceData?.harga || currentPriceData?.current_price;
      if (fallbackPrice) {
        const singlePoint = {
          date: new Date().toISOString(),
          price: fallbackPrice,
          actualPrice: fallbackPrice,
          predictedPrice: fallbackPrice,
          region: regionName
        };
        setRegionPrices([singlePoint]);
      } else {
        setError('Failed to load price history');
        setRegionPrices([]);
      }
    } finally {
      setIsLoading(false);
    }

  }, []);


  return { regionPrices, isLoading, error, fetchPriceHistory, setRegionPrices };
};

export default usePriceHistory;
