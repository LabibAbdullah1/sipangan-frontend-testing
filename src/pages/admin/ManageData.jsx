import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Package, TrendingUp, ChevronRight, CloudRain, Loader2 } from 'lucide-react';
import { commodityService, weatherService } from '../../api/services';
import CommodityTable from './components/CommodityTable';
import PriceTable from './components/PriceTable';

const ManageData = () => {
  const [activeTab, setActiveTab] = useState('prices'); // default to prices
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingWeather, setSyncingWeather] = useState(false);

  const tabs = [
    { id: 'prices', label: 'Price Records', icon: TrendingUp, color: 'text-blue-500' },
    { id: 'commodities', label: 'Commodity Catalog', icon: Package, color: 'text-emerald-500' },
  ];

  const handleTabChange = (tabId) => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const newIndex = tabs.findIndex(t => t.id === tabId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(tabId);
  };

  const fetchCommodities = async () => {
    setLoading(true);
    try {
      const response = await commodityService.getAll();
      setCommodities(response.data || []);
    } catch (error) {
      console.error('Failed to load commodities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommodities();
  }, []);

  const handleSyncWeather = async () => {
    try {
      setSyncingWeather(true);
      await weatherService.syncWeather();
      alert('Weather data synchronized successfully!');
    } catch (error) {
      console.error('Failed to sync weather:', error);
      alert('Failed to synchronize weather data. Please try again.');
    } finally {
      setSyncingWeather(false);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-[0.3em]">
          Admin <ChevronRight size={12} /> Data Management
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Database className="text-emerald-500" size={32} />
            Kelola Data Pangan
          </h1>
          
          <button
            onClick={handleSyncWeather}
            disabled={syncingWeather}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            {syncingWeather ? <Loader2 className="animate-spin" size={18} /> : <CloudRain size={18} />}
            {syncingWeather ? 'Syncing...' : 'Sync Weather'}
          </button>
        </div>
        <p className="text-gray-400 font-medium">
          Manage commodity inventory and maintain historical price data across East Java.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl w-full max-w-fit overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                relative flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold transition-all flex-shrink-0
                ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gray-800 border border-gray-700 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <tab.icon size={22} className={isActive ? tab.color : 'text-current'} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {activeTab === 'commodities' ? (
              <CommodityTable
                commodities={commodities}
                loading={loading}
                onRefresh={fetchCommodities}
              />
            ) : (
              <PriceTable
                commodities={commodities}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageData;
