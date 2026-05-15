import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Map, LayoutDashboard, Menu, X, Shield, ChevronRight } from 'lucide-react';

const PublicLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Beranda', path: '/', icon: LayoutDashboard },
    { name: 'Geo Map', path: '/map', icon: Map },
  ];

  return (
    <div className={`${location.pathname === '/map' ? 'h-screen' : 'min-h-screen'} bg-[#020617] text-gray-100 flex flex-col relative overflow-hidden`}>
      {/* Background Texture & Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.05),transparent_40%)]"></div>

        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 1.2px)`,
            backgroundSize: '30px 30px'
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-gray-950/50 backdrop-blur-xl sticky top-0 z-[9000] flex items-center shrink-0">

        <div className="w-full max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <Menu size={22} />
            </button>
            
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-emerald-500/20">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-black tracking-tight leading-none">SIPANGAN</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1 text-emerald-500/80">Intelligence Hub</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 ml-10">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-emerald-400 ${
                      isActive ? 'text-emerald-500' : 'text-gray-500'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {localStorage.getItem('accessToken') ? (
              <Link 
                to="/admin/manage" 
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.05]"
              >
                <Shield size={14} />
                Panel Admin
              </Link>
            ) : (
              <Link 
                to="/admin/login" 
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white rounded-xl transition-all border border-white/5 hover:border-white/10"
              >
                <Shield size={14} className="text-emerald-500" />
                Admin Access
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9001] animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sliding Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-[300px] bg-gray-950 border-r border-white/5 z-[9002] transition-transform duration-500 ease-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 h-16 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-white text-xs">S</div>
            <span className="font-black text-sm tracking-tight">SIPANGAN</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="px-4 py-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${isActive ? 'bg-emerald-500/10 text-emerald-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-emerald-500' : 'text-gray-500 group-hover:text-white'} />
                  <span className="text-sm font-bold tracking-tight">{item.name}</span>
                </div>
                <ChevronRight size={14} className={`transition-transform ${isActive ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0 group-hover:opacity-100 group-hover:rotate-0'}`} />
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5 bg-gray-900/20">
          {localStorage.getItem('accessToken') ? (
            <Link
              to="/admin/manage"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Shield size={18} />
              <span className="text-sm font-black uppercase tracking-wider">Ke Panel Admin</span>
            </Link>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-4 bg-white/5 border border-white/10 text-white rounded-2xl shadow-lg hover:bg-white/10 transition-all"
            >
              <Shield size={18} className="text-emerald-500" />
              <span className="text-sm font-black uppercase tracking-wider">Admin Portal</span>
            </Link>
          )}
        </div>
      </aside>


      <main className={`flex-1 flex flex-col min-h-0 w-full max-w-[1600px] mx-auto px-6 ${location.pathname === '/map' ? 'py-0 overflow-hidden' : 'py-8'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
