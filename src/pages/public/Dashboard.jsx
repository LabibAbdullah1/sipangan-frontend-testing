import React, { useEffect, useState } from 'react';
import { priceService, alertService } from '../../api/services';
import { Activity, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [prices, setPrices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch overview and alerts in parallel
        const [priceRes, alertRes] = await Promise.all([
          priceService.getOverview(),
          alertService.getAlerts()
        ]);
        
        // Documentation specifies response format: { status, message, data }
        // axiosClient is already returning response.data via interceptor
        setPrices(priceRes.data || []);
        setAlerts(alertRes.data || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">National Food Security</h1>
          <p className="text-sm text-gray-400 mt-1">Real-time overview of commodity status and predictions.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 bg-[#0f0f0f] border border-gray-800 rounded-md animate-pulse">
              <div className="h-4 w-24 bg-gray-800 rounded mb-4"></div>
              <div className="h-8 w-16 bg-gray-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0f0f0f] border border-gray-800 rounded-md shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-gray-800"><Activity size={48} /></div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Commodities</h3>
            <p className="text-3xl font-semibold text-white">{prices?.length || 0}</p>
            <p className="text-xs text-emerald-500 mt-2">Active monitoring</p>
          </div>
          <div className="p-6 bg-[#0f0f0f] border border-gray-800 rounded-md shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-gray-800"><TrendingUp size={48} /></div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Market Activity</h3>
            <p className="text-3xl font-semibold text-white">Live</p>
            <p className="text-xs text-emerald-500 mt-2">Data updated in real-time</p>
          </div>
          <div className="p-6 bg-[#0f0f0f] border border-gray-800 rounded-md shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-gray-800"><AlertCircle size={48} /></div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Active Alerts</h3>
            <p className="text-3xl font-semibold text-crimson-500">{alerts?.length || 0}</p>
            <p className="text-xs text-gray-400 mt-2">Potential price surges</p>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Market Overview</h2>
        <div className="border border-gray-800 rounded-md overflow-hidden bg-[#0f0f0f]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 font-medium">Commodity</th>
                <th className="px-6 py-4 font-medium">Region</th>
                <th className="px-6 py-4 font-medium text-right">Current Price</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    Loading market data...
                  </td>
                </tr>
              ) : prices?.length > 0 ? (
                prices.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-white font-medium">{item.commodity}</td>
                    <td className="px-6 py-4 text-gray-400">{item.region}</td>
                    <td className="px-6 py-4 text-white text-right font-mono">
                      Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No price data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
