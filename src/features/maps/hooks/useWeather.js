import { useState, useEffect, useCallback } from 'react';
import { weatherService } from '../../../api/services';

const useWeather = (regionId) => {
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!regionId) {
      setWeatherData([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await weatherService.getWeatherByRegion(regionId);
      
      const data = response.data?.data?.weather || response.data?.weather || response.data || [];
      setWeatherData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      setError('Failed to fetch weather information');
      setWeatherData([]);
    } finally {
      setIsLoading(false);
    }
  }, [regionId]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Find the weather for today or the most recent upcoming date
  const currentWeather = weatherData.length > 0 ? weatherData[0] : null;

  return { 
    weatherData, 
    currentWeather,
    isLoading, 
    error,
    refreshWeather: fetchWeather 
  };
};

export default useWeather;
