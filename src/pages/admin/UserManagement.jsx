import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../../api/services';
import { UserPlus, Trash2, Shield, User as UserIcon, Loader2, AlertCircle, CheckCircle2, ChevronDown, Edit2, Search, ChevronRight, Users, ShieldCheck, UserCog } from 'lucide-react';

const UserManagement = () => {
  const currentUserRole = localStorage.getItem('userRole') || 'operator';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(currentUserRole === 'super_admin' ? 'super_admin' : 'operator');
  const [direction, setDirection] = useState(0);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    role: 'operator'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      let fetchedUsers = response.data.users || [];
      
      // Filter users if current user is admin to protect superior data
      if (currentUserRole === 'admin') {
        fetchedUsers = fetchedUsers.filter(u => u.role === 'operator');
      }
      
      setUsers(fetchedUsers);
    } catch (err) {
      setError('Gagal mengambil data pengguna.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingUser) {
        // Create payload with only provided fields
        const updateData = {
          fullname: formData.fullname,
          role: formData.role
        };
        if (formData.password) updateData.password = formData.password;
        
        await userService.update(editingUser.id, updateData);
        setSuccess('Data pengguna berhasil diperbarui!');
      } else {
        await userService.create(formData);
        setSuccess('Pengguna berhasil ditambahkan!');
      }
      setShowAddModal(false);
      setEditingUser(null);
      setFormData({ username: '', password: '', fullname: '', role: 'operator' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data pengguna.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', // Password dikosongkan agar tidak wajib diisi saat edit
      fullname: user.fullname,
      role: user.role
    });
    setShowAddModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
    
    setActionLoading(true);
    try {
      await userService.delete(id);
      setSuccess('Pengguna berhasil dihapus.');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus pengguna.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const superAdmins = filteredUsers.filter(u => u.role === 'super_admin');
  const admins = filteredUsers.filter(u => u.role === 'admin');
  const operators = filteredUsers.filter(u => u.role === 'operator');

  const allTabs = [
    { id: 'super_admin', label: 'Super Admin', icon: ShieldCheck, color: 'text-purple-500', data: superAdmins },
    { id: 'admin', label: 'Admin', icon: Shield, color: 'text-blue-500', data: admins },
    { id: 'operator', label: 'Operator', icon: UserCog, color: 'text-emerald-500', data: operators },
  ];

  const tabs = allTabs.filter(tab => {
    if (currentUserRole === 'super_admin') return true;
    if (currentUserRole === 'admin') return tab.id === 'operator';
    return false;
  });

  const handleTabChange = (tabId) => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const newIndex = tabs.findIndex(t => t.id === tabId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(tabId);
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

  const UserTable = ({ title, userList, roleColor, icon: Icon }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 ml-2">
        <Icon className={roleColor.split(' ')[1]} size={20} />
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
        <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">{userList.length} Accounts</span>
      </div>
      <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 border-b border-gray-800">
              <tr>
                <th className="w-[45%] px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Pengguna</th>
                <th className="w-[30%] px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Username</th>
                <th className="w-[25%] px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {userList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-10 text-center">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Tidak ada data.</p>
                  </td>
                </tr>
              ) : userList.map((user) => (
                <motion.tr 
                  key={user.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-white/5 transition-colors"
                >
                  <td className="w-[45%] px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all ${roleColor.split(' ')[1]}`}>
                        <UserIcon size={18} />
                      </div>
                      <span className="font-bold text-white tracking-tight">{user.fullname}</span>
                    </div>
                  </td>
                  <td className="w-[30%] px-6 py-4">
                    <span className="text-gray-400 font-medium text-sm">{user.username}</span>
                  </td>
                  <td className="w-[25%] px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="p-3 text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      {user.role !== 'super_admin' && (
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading}
                          className="p-3 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-30"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-[0.3em]">
            Admin <ChevronRight size={12} /> Access Control
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="text-emerald-500" size={32} />
            Kelola Admin
          </h1>
          <p className="text-gray-400 font-medium">
            Manage administrative access, personnel hierarchy, and system permissions.
          </p>
        </div>
        
        <button 
          onClick={() => {
            setEditingUser(null);
            setFormData({ username: '', password: '', fullname: '', role: 'operator' });
            setShowAddModal(true);
          }}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap h-fit"
        >
          <UserPlus size={18} />
          Tambah Pengguna
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
            <Search className="text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Cari nama atau username personel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium placeholder:text-gray-600 shadow-inner"
          />
        </div>
      </div>

      <AnimatePresence>
        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-2xl flex items-center gap-4 border ${
              error 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="text-xs font-bold uppercase tracking-wide">{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
                <tab.icon size={18} className={isActive ? tab.color : 'text-current'} />
                {tab.label}
                <span className={`text-[10px] px-2 py-0.5 rounded-md ${isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-600'}`}>
                  {tab.data.length}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center"
          >
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Sinkronisasi Data Personel...</p>
          </motion.div>
        ) : (
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
            className="space-y-12"
          >
            {activeTab === 'super_admin' && (
              <UserTable 
                title="Administrator Utama" 
                userList={superAdmins} 
                roleColor="bg-purple-500 text-purple-400"
                icon={ShieldCheck}
              />
            )}
            {activeTab === 'admin' && (
              <UserTable 
                title="Administrator" 
                userList={admins} 
                roleColor="bg-blue-500 text-blue-400"
                icon={Shield}
              />
            )}
            {activeTab === 'operator' && (
              <UserTable 
                title="Operator" 
                userList={operators} 
                roleColor="bg-emerald-500 text-emerald-400"
                icon={UserCog}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-[2.5rem] shadow-2xl relative"
            >
              <div className="p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    {editingUser ? <Edit2 className="text-white" size={24} /> : <UserPlus className="text-white" size={24} />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tighter">
                      {editingUser ? 'Perbarui Pengguna' : 'Tambah Pengguna'}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                      {editingUser ? 'Perbarui informasi personel sistem' : 'Daftarkan personel baru sistem'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 pb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Username</label>
                      <input 
                        required
                        type="text" 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className={`w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-white focus:outline-none transition-all font-medium ${editingUser ? 'opacity-50 cursor-not-allowed' : 'focus:border-emerald-500/50'}`}
                        placeholder="username"
                        readOnly={!!editingUser}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                      <input 
                        required={!editingUser}
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium placeholder:text-gray-700"
                        placeholder={editingUser ? "•••••••• (opsional)" : "••••••••"}
                      />
                      {editingUser && <p className="text-[8px] font-bold text-gray-600 uppercase tracking-tight ml-1">Kosongkan jika tidak diubah</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input 
                      required
                      type="text" 
                      value={formData.fullname}
                      onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Peran (Role)</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-white flex items-center justify-between focus:outline-none focus:border-emerald-500/50 transition-all font-medium text-left"
                      >
                        <span className="capitalize">{formData.role.replace('_', ' ')}</span>
                        <ChevronDown size={18} className={`text-gray-500 transition-transform duration-300 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isRoleDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute z-[110] left-0 right-0 mt-2 bg-[#1a1d26] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                          >
                            <div className="p-2 space-y-1">
                              {currentUserRole === 'super_admin' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, role: 'admin' });
                                    setIsRoleDropdownOpen(false);
                                  }}
                                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition-all flex items-center gap-3
                                    ${formData.role === 'admin' 
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}
                                  `}
                                >
                                  <Shield size={14} />
                                  <span>Admin</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, role: 'operator' });
                                  setIsRoleDropdownOpen(false);
                                }}
                                className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition-all flex items-center gap-3
                                  ${formData.role === 'operator' 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}
                                `}
                              >
                                <Shield size={14} />
                                <span>Operator</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-5 rounded-2xl bg-white/5 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      disabled={actionLoading}
                      className="flex-1 px-4 py-5 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (editingUser ? 'Update Data' : 'Simpan Data')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
