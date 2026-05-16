import React from 'react';
import { Cloud, Droplets, Thermometer, Wind, Loader2 } from 'lucide-react';
import useWeather from '../hooks/useWeather';

const WeatherWidget = ({ regionId }) => {
  const { currentWeather, isLoading, error } = useWeather(regionId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-800/20 rounded-2xl border border-gray-700/20 h-24 animate-pulse">
        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
      </div>
    );
  }

  if (error || !currentWeather) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-800/20 rounded-2xl border border-gray-700/20">
        <div className="flex items-center gap-3 opacity-50">
          <div className="p-2 bg-gray-800 rounded-lg">
            <Cloud className="text-gray-500" size={16} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Weather Forecast</p>
            <p className="text-xs text-gray-600 font-medium">Data unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  const getIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'rain': return <Cloud className="text-blue-400" size={24} />;
      case 'clear': return <Wind className="text-amber-400" size={24} />;
      case 'clouds': return <Cloud className="text-gray-400" size={24} />;
      default: return <Cloud className="text-emerald-400" size={24} />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl border border-gray-700/30 hover:border-gray-600/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-gray-800/80 rounded-xl border border-gray-700/50 shadow-inner">
          {getIcon(currentWeather.weather_condition)}
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80 mb-0.5">Today's Weather</p>
          <div className="flex flex-col">
            <p className="text-lg font-black text-white leading-none">
              {currentWeather.weather_condition}
            </p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">
              {new Date(currentWeather.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="p-1.5 bg-rose-500/10 rounded-lg">
            <Thermometer size={14} className="text-rose-400" />
          </div>
          <p className="text-xs font-bold text-gray-300">{Math.round(currentWeather.temperature)}°C</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Droplets size={14} className="text-blue-400" />
          </div>
          <p className="text-xs font-bold text-gray-300">{currentWeather.humidity}%</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
