import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import { priceService } from '../api/services';

const PriceMarquee = () => {
  const [prices, setPrices] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchLatestPrices = async () => {
      try {
        const response = await priceService.getHistory({ limit: 15 });
        setPrices(response.data || []);
      } catch (error) {
        console.error('Failed to fetch prices for marquee:', error);
      }
    };
    fetchLatestPrices();
  }, []);

  // Mouse Events
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX); 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch Events for Mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX);
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (prices.length === 0) return null;

  const displayItems = [...prices, ...prices];

  return (
    <div className="w-full bg-[#020617] border-y border-white/5 py-3 md:py-4 relative overflow-hidden flex items-center">
      
      {/* Title Section */}
      <div className="px-3 md:px-6 flex items-center gap-2 md:gap-3 shrink-0 border-r border-white/10 relative z-20 bg-[#020617]">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
          <Activity size={14} className="text-emerald-500" />
        </div>
        <div className="flex flex-col hidden sm:flex">
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Market</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Updates</span>
        </div>
      </div>

      {/* Gradients */}
      <div className="absolute inset-y-0 left-12 sm:left-40 w-16 md:w-32 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none"></div>

      {/* Ticker Container */}
      <div 
        ref={scrollRef}
        className={`flex-1 overflow-x-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} no-scrollbar flex items-center`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex items-center gap-3 md:gap-4 min-w-max pr-4 pl-4 sm:pl-0"
          style={{
            animation: `marquee 40s linear infinite`,
            animationPlayState: isHovered || isDragging ? 'paused' : 'running'
          }}
        >
          {displayItems.map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`} 
              className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-2 bg-gray-900/50 hover:bg-white/5 border border-white/5 rounded-2xl shrink-0 transition-colors select-none group"
            >
              <div className="flex flex-col">
                <span className="text-[11px] md:text-xs font-black text-white">{item.commodity}</span>
                <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.region}</span>
              </div>
              <div className="w-px h-5 md:h-6 bg-white/10 mx-1"></div>
              <div className="flex flex-col items-end">
                <span className="text-xs md:text-sm font-black text-emerald-400">Rp {parseInt(item.price).toLocaleString('id-ID')}</span>
                <span className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                  {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceMarquee;
