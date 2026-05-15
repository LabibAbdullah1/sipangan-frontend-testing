import React, { useState, useEffect, useRef } from 'react';
import { Bell, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { alertService } from '../api/services';

const AlertNotification = () => {
  const [alerts, setAlerts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchAlerts();
    
    const interval = setInterval(() => {
      fetchAlerts();
    }, 60000); // Fetch every minute
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await alertService.getAlerts();
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const unreadCount = alerts.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-gray-950"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[9999]">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Peringatan Harga</h3>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{alerts.length} Total</span>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {alerts.length > 0 ? (
              <div className="divide-y divide-white/5">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-white/5 transition-colors flex gap-3 items-start">
                    <div className={`mt-0.5 shrink-0 ${alert.type === 'critical' ? 'text-red-500' : alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}`}>
                      {alert.type === 'critical' ? <AlertCircle size={18} /> : alert.type === 'warning' ? <AlertTriangle size={18} /> : <Info size={18} />}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-gray-200">{alert.title}</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-bold text-gray-300">
                           {alert.price && `Rp ${parseInt(alert.price).toLocaleString('id-ID')}`}
                         </span>
                         <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                           {new Date(alert.created_at).toLocaleString('id-ID', {
                             day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                           })}
                         </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
                <Bell size={32} className="mb-3 opacity-20" />
                <p className="text-xs font-medium">Tidak ada peringatan aktif</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertNotification;
