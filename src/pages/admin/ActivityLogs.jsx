import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logService, commodityService, mapService } from '../../api/services';
import { History, Loader2, AlertCircle, User, Clock, Activity, ChevronLeft, ChevronRight, Search, ChevronRight as ChevronRightIcon, Package, TrendingUp, Users, UserCog } from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [direction, setDirection] = useState(0);
  const limit = 100;

  useEffect(() => {
    fetchLogs();
  }, [page, activeTab]);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [commRes, regRes] = await Promise.all([
          commodityService.getAll(),
          mapService.getMapData()
        ]);
        setCommodities(commRes.data || []);
        setRegions(regRes.data || []);
      } catch (err) {
        console.error('Failed to fetch catalogs:', err);
      }
    };
    fetchCatalogs();
  }, []);

  const commodityMap = Object.fromEntries(commodities.map(c => [c.id, c.name]));
  const regionMap = Object.fromEntries(regions.map(r => [r.id, r.name]));

  const resolveName = (id, type) => {
    if (!id) return null;
    if (type === 'commodity') return commodityMap[id];
    if (type === 'region') return regionMap[id];
    return null;
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await logService.getLogs({ page, limit });
      const logData = response.data?.logs || response.logs || (Array.isArray(response) ? response : []);
      setLogs(logData);
      if (response.data?.pagination) {
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal mengambil data log aktivitas.');
    } finally {
      setLoading(false);
    }
  };

  const formatDetails = (details) => {
    if (!details) return '-';
    try {
      const obj = typeof details === 'string' ? JSON.parse(details) : details;
      if (obj.username) return `User: ${obj.username} (${obj.role || 'user'})`;
      if (obj.price !== undefined || obj.new_price !== undefined) {
        const resolvedCommodity = resolveName(obj.commodity_id, 'commodity');
        const resolvedRegion = resolveName(obj.region_id, 'region');
        const location = resolvedRegion || obj.region || obj.region_name || obj.regionName || obj.name || obj.regency || 'Lokasi';
        const commodity = resolvedCommodity || obj.commodity_name || obj.commodity || '';
        const currentPrice = obj.price ?? obj.new_price;
        return `${commodity ? commodity + ': ' : ''}Rp ${currentPrice.toLocaleString()} di ${location}`;
      }
      if (obj.commodity_name || obj.commodity_id) {
        const name = obj.commodity_name || resolveName(obj.commodity_id, 'commodity');
        return name ? `Komoditas: ${name}` : 'Data Komoditas';
      }
      if (typeof obj === 'object') return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(', ');
      return String(obj);
    } catch (e) {
      return details;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.details && typeof log.details === 'string' && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = activeTab === 'ALL' || log.action === activeTab;
    return matchesSearch && matchesAction;
  });

  const tabs = [
    { id: 'ALL', label: 'Semua', icon: Activity, color: 'text-blue-400' },
    { id: 'CREATE_USER', label: 'User Baru', icon: Users, color: 'text-purple-400' },
    { id: 'UPDATE_USER', label: 'Update User', icon: UserCog, color: 'text-purple-400' },
    { id: 'ADD_PRICE', label: 'Input Harga', icon: TrendingUp, color: 'text-emerald-400' },
    { id: 'UPDATE_PRICE', label: 'Update Harga', icon: TrendingUp, color: 'text-blue-400' },
    { id: 'ADD_COMMODITY', label: 'Komoditas', icon: Package, color: 'text-emerald-400' },
  ];

  const handleTabChange = (tabId) => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const newIndex = tabs.findIndex(t => t.id === tabId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(tabId);
    setPage(1);
  };

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 30 : -30, opacity: 0 }),
  };

  const getActionLabel = (action) => {
    const labels = {
      'ADD_PRICE': 'Menambah Data Harga',
      'UPDATE_PRICE': 'Memperbarui Data Harga',
      'DELETE_PRICE': 'Menghapus Data Harga',
      'ADD_COMMODITY': 'Menambah Komoditas',
      'CREATE_USER': 'Menambah Admin Baru',
      'UPDATE_USER': 'Memperbarui Pengguna'
    };
    return labels[action] || action.replace('_', ' ');
  };

  const getActionColor = (action) => {
    if (action.includes('CREATE') || action.includes('ADD')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (action.includes('UPDATE')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (action.includes('DELETE')) return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom duration-700 pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-[0.3em]">
          Admin <ChevronRightIcon size={12} /> Security Audit
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <History className="text-blue-500" size={32} /> Log Aktivitas
        </h1>
        <p className="text-gray-400 font-medium">
          Audit trail sistem untuk memantau setiap perubahan data dan aktivitas personel.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
            <Search className="text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan pelaku atau detail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium placeholder:text-gray-600 shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl w-full max-fit overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)} className={`relative flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                {isActive && <motion.div layoutId="activeTabLog" className="absolute inset-0 bg-gray-800 border border-gray-700 rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                <span className="relative z-10 flex items-center gap-2"><tab.icon size={16} className={isActive ? tab.color : 'text-current'} />{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={activeTab} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }} className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[180px]">Waktu</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[200px]">Pelaku</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[180px]">Aksi</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr><td colSpan="4" className="px-8 py-20 text-center text-xs font-bold text-gray-600 uppercase tracking-widest">Memuat Log...</td></tr>
                ) : filteredLogs.length === 0 ? (
                  <tr><td colSpan="4" className="px-8 py-20 text-center text-xs font-bold text-gray-600 uppercase tracking-widest">Tidak ada aktivitas.</td></tr>
                ) : filteredLogs.map((log) => (
                  <tr key={log.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium whitespace-nowrap"><Clock size={12} /> {formatDate(log.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 text-white font-bold text-sm tracking-tight">{log.fullname}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-[160px]">
                        <div className={`inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black border text-center items-center justify-center ${getActionColor(log.action)}`}>
                          {getActionLabel(log.action)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs font-medium max-w-md line-clamp-2 whitespace-normal break-words">{formatDetails(log.details)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Halaman {page} dari {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 bg-white/5 border border-white/5 rounded-lg text-gray-500 hover:text-white disabled:opacity-30"><ChevronLeft size={18} /></button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 bg-white/5 border border-white/5 rounded-lg text-gray-500 hover:text-white disabled:opacity-30"><ChevronRight size={18} /></button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ActivityLogs;
