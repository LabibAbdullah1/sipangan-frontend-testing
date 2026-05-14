import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logService } from '../../api/services';
import { History, Loader2, AlertCircle, User, Clock, Activity, ChevronLeft, ChevronRight, Search, Filter, Calendar, ChevronDown, ChevronRight as ChevronRightIcon, Package, TrendingUp, Users, UserCog } from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [direction, setDirection] = useState(0);
  const limit = 50;

  useEffect(() => {
    fetchLogs();
  }, [page]);

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
      if (obj.username) return `User: ${obj.username} (${obj.role})`;
      if (obj.commodity_name) return `Komoditas: ${obj.commodity_name}`;
      if (obj.price) return `Rp ${obj.price.toLocaleString()} di ${obj.region}`;
      if (typeof obj === 'object') return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(', ');
      return String(obj);
    } catch (e) {
      return details;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
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
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  const actionOptions = [
    { value: 'ALL', label: 'Semua Aktivitas' },
    { value: 'CREATE_USER', label: 'Manajemen User' },
    { value: 'UPDATE_USER', label: 'Update User' },
    { value: 'ADD_PRICE', label: 'Input Harga' },
    { value: 'UPDATE_PRICE', label: 'Update Harga' },
    { value: 'ADD_COMMODITY', label: 'Data Komoditas' },
  ];

  const getActionLabel = (action) => {
    const labels = {
      'ADD_PRICE': 'Menambah Data Harga',
      'UPDATE_PRICE': 'Memperbarui Data Harga',
      'DELETE_PRICE': 'Menghapus Data Harga',
      'ADD_COMMODITY': 'Menambah Komoditas',
      'CREATE_USER': 'Menambah Admin/Operator Baru',
      'UPDATE_USER': 'Memperbarui Data Pengguna'
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
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-[0.3em]">
          Admin <ChevronRightIcon size={12} /> Security Audit
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <History className="text-blue-500" size={32} />
          Log Aktivitas
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

        {/* Tabs Navigation */}
        <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl w-full max-w-fit overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  relative flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0
                  ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabLog"
                    className="absolute inset-0 bg-gray-800 border border-gray-700 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon size={16} className={isActive ? tab.color : 'text-current'} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-4"
        >
          <AlertCircle size={20} />
          <span className="text-xs font-bold uppercase tracking-wide">{error}</span>
        </motion.div>
      )}

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
          className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Waktu</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Pelaku</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-4" />
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Memuat Log...</p>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Tidak ada aktivitas yang sesuai filter.</p>
                    </td>
                  </tr>
                ) : filteredLogs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-gray-400">
                        <Clock size={14} />
                        <span className="text-xs font-medium">{formatDate(log.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 border border-white/5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all">
                          <User size={14} />
                        </div>
                        <span className="font-bold text-white tracking-tight text-sm">{log.fullname}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getActionColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-xs font-medium line-clamp-2 max-w-md">
                        {formatDetails(log.details)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                Halaman {page} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 bg-white/5 border border-white/5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 bg-white/5 border border-white/5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ActivityLogs;
