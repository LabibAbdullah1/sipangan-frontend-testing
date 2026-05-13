import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Map, LayoutDashboard } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col">
      <header className="border-b border-gray-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center font-bold text-white">
              S
            </div>
            <span className="font-semibold tracking-wide">SIPANGAN</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-2">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/map" className="hover:text-white transition-colors flex items-center gap-2">
              <Map size={16} /> Geo Map
            </Link>
            <Link to="/admin/login" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors border border-gray-700">
              Admin Login
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
