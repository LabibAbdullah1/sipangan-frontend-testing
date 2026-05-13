import React from 'react';

const MapLegend = () => {
  const legendItems = [
    { label: 'AMAN', color: '#10b981', desc: 'Harga Stabil' },
    { label: 'NORMAL', color: '#3b82f6', desc: 'Sesuai Pasar' },
    { label: 'WASPADA', color: '#f59e0b', desc: 'Tren Menaik' },
    { label: 'KRITIS', color: '#e11d48', desc: 'Lonjakan Harga' },
    { label: 'TANPA DATA', color: '#64748b', desc: 'Update Pending' }
  ];


  return (
    <div className="absolute bottom-6 right-6 z-[1000] bg-gray-900/80 backdrop-blur-md p-5 border border-gray-800/50 rounded-2xl shadow-2xl min-w-[180px]">
      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Market Status</h4>
      <div className="space-y-3">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center gap-3 group cursor-default">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: item.color, color: item.color }}></div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-20" style={{ backgroundColor: item.color }}></div>
            </div>
            <div>
              <span className="block text-[11px] text-gray-200 font-bold leading-none">{item.label}</span>
              <span className="block text-[9px] text-gray-500 font-medium">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
