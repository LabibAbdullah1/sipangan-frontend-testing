import React, { useEffect, useState } from 'react';
import { commodityService } from '../../api/services';
import { Plus } from 'lucide-react';

const ManageData = () => {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await commodityService.getAll();
        setCommodities(response.data || []);
      } catch (error) {
        console.error('Failed to load commodities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this commodity?')) {
      try {
        await commodityService.delete(id);
        setCommodities(commodities.filter(item => item.id !== id));
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete commodity.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Manage Commodities</h1>
          <p className="text-sm text-gray-400 mt-1">Add, edit, or remove commodity data across regions.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Plus size={18} /> New Record
        </button>
      </div>

      <div className="border border-gray-800 rounded-md overflow-hidden bg-[#0a0a0a]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-[#0f0f0f] border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Commodity</th>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : commodities?.length > 0 ? (
              commodities.map((item) => (
                <tr key={item.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/30">
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">{item.id}</td>
                  <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-gray-400">{item.code || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-emerald-500 hover:text-emerald-400 text-xs font-medium mr-4 transition-colors">Edit</button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-crimson-500 hover:text-crimson-400 text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  <div className="max-w-xs mx-auto">
                    <p className="mb-2 text-gray-400">No commodity records found.</p>
                    <p className="text-xs">Click "New Record" to add data.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageData;
