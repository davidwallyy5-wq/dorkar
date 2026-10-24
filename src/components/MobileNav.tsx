import React from 'react';
import { Home, Layers, ShoppingBag, Search, Phone } from 'lucide-react';

interface MobileNavProps {
  onOrderClick: () => void;
  onTrackClick: () => void;
  onServicesClick: () => void;
  onContactClick: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  onOrderClick,
  onTrackClick,
  onServicesClick,
  onContactClick,
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
      <div className="bg-white/90 dark:bg-[#061522]/90 backdrop-blur-2xl border border-slate-200 dark:border-cyan-500/25 rounded-3xl p-2 shadow-[0_12px_40px_rgba(15,39,59,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center justify-around text-slate-700 dark:text-white transition-colors">
        <a
          href="#home"
          className="flex flex-col items-center gap-1 p-2 text-slate-600 dark:text-white/70 hover:text-[#0284c7] dark:hover:text-cyan-300 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">হোম</span>
        </a>

        <button
          type="button"
          onClick={onServicesClick}
          className="flex flex-col items-center gap-1 p-2 text-slate-600 dark:text-white/70 hover:text-[#0284c7] dark:hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-semibold">সেবা</span>
        </button>

        {/* Center Primary Action - Glowing Sky / Amber Dorkar Order Button */}
        <button
          type="button"
          onClick={onOrderClick}
          className="flex flex-col items-center justify-center w-14 h-14 -mt-6 bg-gradient-to-tr from-[#0284c7] via-sky-500 to-[#38bdf8] text-white rounded-2xl shadow-[0_8px_25px_rgba(2,132,199,0.4)] border-2 border-white dark:border-[#061522] active:scale-95 transition-transform cursor-pointer"
          aria-label="অর্ডার করুন"
        >
          <ShoppingBag className="w-6 h-6 text-white stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={onTrackClick}
          className="flex flex-col items-center gap-1 p-2 text-slate-600 dark:text-white/70 hover:text-[#0284c7] dark:hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-semibold">ট্র্যাকিং</span>
        </button>

        <button
          type="button"
          onClick={onContactClick}
          className="flex flex-col items-center gap-1 p-2 text-slate-600 dark:text-white/70 hover:text-[#0284c7] dark:hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] font-semibold">যোগাযোগ</span>
        </button>
      </div>
    </div>
  );
};
