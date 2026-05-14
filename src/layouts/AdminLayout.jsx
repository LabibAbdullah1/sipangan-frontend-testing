import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Database, User, Map, Menu, X } from 'lucide-react';
import { authService } from '../api/services';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed on server:', error);
    } finally {
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };

  const navItems = [
    { path: '/admin/map', label: 'Peta Interaktif', icon: Map },
    { path: '/admin/manage', label: 'Kelola Data Pangan', icon: Database },
  ];

  return (
    <div className="h-screen bg-[#020617] text-gray-100 flex font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Shared Background Texture & Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.05),transparent_40%)]"></div>
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 1.2px)`,
            backgroundSize: '30px 30px'
          }}
        ></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-white/5 flex flex-col bg-gray-950/80 backdrop-blur-2xl h-full z-50 transition-transform duration-300
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Database className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white tracking-tighter text-lg leading-none">SIPANGAN</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Control Center</span>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <p className="px-4 mb-3 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Navigation</p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold transition-all duration-300
                    ${isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'}
                  `}
                >
                  <item.icon size={22} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-white truncate">Administrator</span>
              <span className="text-[10px] text-gray-500 font-medium">Session Active</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-4 w-full text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all duration-300 font-bold text-base"
          >
            <LogOut size={22} />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 bg-gray-950/40 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/5"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:block" />
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest truncate">System Status: <span className="text-emerald-500">Operational</span></span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-10 overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
