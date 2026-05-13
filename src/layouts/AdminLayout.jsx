import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Database } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 flex flex-col bg-[#0f0f0f]">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 text-emerald-500">
            <span className="font-semibold tracking-wide">SIPANGAN ADMIN</span>
          </div>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link to="/admin/manage" className="flex items-center gap-3 px-3 py-2 bg-gray-800/50 text-white rounded-md border border-gray-700/50">
            <Database size={18} /> Manage Data
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-800 flex items-center px-8 bg-[#0f0f0f]">
          <h1 className="text-sm font-medium text-gray-400">Admin Panel / <span className="text-white">Overview</span></h1>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
