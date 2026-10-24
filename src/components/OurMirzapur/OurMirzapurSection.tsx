import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  MapPin,
  Bike,
  ShieldCheck,
  Zap,
  Layers,
  Compass,
  ArrowRight,
  Route,
  Clock,
  Heart,
  Navigation,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { MirzapurLandmark, LandmarkCategory } from './types';
import { MIRZAPUR_LANDMARKS } from './mirzapurData';
import { MirzapurWorldCanvas } from './MirzapurWorldCanvas';
import { LandmarkCardModal } from './LandmarkCardModal';
import { subscribeToAllRiders } from '../../services/riderService';
import { Rider } from '../../types';

interface OurMirzapurSectionProps {
  onOrderClick: () => void;
  onTrackClick?: () => void;
  activeOrder?: any | null;
  userCoords?: { latitude: number; longitude: number } | null;
}

export const OurMirzapurSection: React.FC<OurMirzapurSectionProps> = ({
  onOrderClick,
  onTrackClick,
  activeOrder,
  userCoords,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [selectedCategory, setSelectedCategory] = useState<LandmarkCategory | 'all' | 'delivery'>('all');
  const [selectedLandmark, setSelectedLandmark] = useState<MirzapurLandmark | null>(null);
  const [showDeliverySimulation, setShowDeliverySimulation] = useState(false);
  const [activeRiderCount, setActiveRiderCount] = useState<number>(12); // fallback realistic count

  // Subscribe to real rider count if available in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToAllRiders((riders: Rider[]) => {
      if (riders && riders.length > 0) {
        const activeOnly = riders.filter((r) => r.active !== false);
        setActiveRiderCount(activeOnly.length > 0 ? activeOnly.length : riders.length);
      }
    });
    return () => unsubscribe();
  }, []);

  const categories: { id: LandmarkCategory | 'all' | 'delivery'; label: string; icon: string }[] = [
    { id: 'all', label: 'সকল ল্যান্ডমার্ক', icon: '🗺️' },
    { id: 'market', label: 'বাজার ও বাণিজ্য', icon: '🛍️' },
    { id: 'community', label: 'আবাসিক ও কমিউনিটি', icon: '🏘️' },
    { id: 'cultural', label: 'ঐতিহ্য ও নুহাশ পল্লী', icon: '🌳' },
    { id: 'resort', label: 'রিসোর্ট ও বিনোদন', icon: '🛖' },
    { id: 'transport', label: 'রোড ও জংশন', icon: '🛣️' },
    { id: 'nature', label: 'শালবন ও প্রকৃতি', icon: '🌲' },
  ];

  const handleLandmarkOrder = (landmark: MirzapurLandmark) => {
    // Scroll smoothly to order form and trigger action
    onOrderClick();
  };

  return (
    <section
      id="our-mirzapur"
      className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-emerald-50/50 via-sky-50/40 to-white dark:from-[#040e17] dark:via-[#061522] dark:to-[#071d2e] overflow-hidden transition-colors duration-300"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C69A45]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. HEADER TITLE & SUBTITLE */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 via-[#C69A45]/15 to-sky-500/15 border border-emerald-500/30 dark:border-cyan-400/30 shadow-sm mb-4">
            <Sparkles className="w-4 h-4 text-[#0284c7] dark:text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white tracking-wide">
              ভাওয়াল মির্জাপুর স্পেশাল এক্সপেরিয়েন্স
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-slate-900 dark:text-white leading-tight">
            আমাদের মির্জাপুর
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-white/80 font-medium">
            মির্জাপুরের পথে পথে, দরকার আপনার সাথেই।
          </p>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-white/60 max-w-xl mx-auto">
            ভাওয়াল মির্জাপুর বাজার থেকে নুহাশ পল্লী, পিরুজালী শালবন থেকে শিমলা বাজার — সম্পূর্ণ ভাওয়াল মির্জাপুর জুড়ে যেকোনো পণ্য বা পার্সেল দ্রুততম সময়ে আপনার ঠিকানায়।
          </p>
        </div>

        {/* 2. LIQUID GLASS STATS CARDS (Floating Top Metrics) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Stat 1: Real-time Active Riders */}
          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#061522]/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg flex items-center gap-3.5 transition-all hover:scale-[1.02]">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/15 text-[#0284c7] dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {activeRiderCount} জন
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-white/60">
                Dorkar Rider অন-ডিউটি
              </p>
            </div>
          </div>

          {/* Stat 2: Flat Rate Delivery */}
          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#061522]/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg flex items-center gap-3.5 transition-all hover:scale-[1.02]">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-[#C69A45] flex items-center justify-center flex-shrink-0 font-bold text-lg">
              ৳৬০
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                ফ্ল্যাট রেট
              </span>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-white/60">
                পুরো মির্জাপুর জুড়ে ক্যাপড
              </p>
            </div>
          </div>

          {/* Stat 3: 100% Upazila Coverage */}
          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#061522]/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg flex items-center gap-3.5 transition-all hover:scale-[1.02]">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                ১৪টি ইউনিয়ন
              </span>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-white/60">
                পৌরসভা ও গ্রামীণ নেটওয়ার্ক
              </p>
            </div>
          </div>

          {/* Stat 4: Fast Turnaround */}
          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#061522]/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg flex items-center gap-3.5 transition-all hover:scale-[1.02]">
            <div className="w-11 h-11 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                ১৫-৩০ মিনিট
              </span>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-white/60">
                গড় ডেলিভারি সম্পন্ন
              </p>
            </div>
          </div>
        </div>

        {/* 3. CATEGORY FILTER PILLS & SIMULATION TOGGLE */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (cat.id !== 'all') setShowDeliverySimulation(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#0284c7] text-white shadow-md shadow-sky-500/25 scale-105'
                    : 'bg-white/80 dark:bg-[#061522]/80 hover:bg-white dark:hover:bg-[#0B2233] text-slate-700 dark:text-white/80 border border-slate-200/80 dark:border-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Delivery Simulation Action Button */}
          <button
            type="button"
            onClick={() => setShowDeliverySimulation((prev) => !prev)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              showDeliverySimulation
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/25 animate-pulse'
                : 'bg-white/90 dark:bg-[#061522]/90 hover:bg-slate-50 dark:hover:bg-[#0B2233] text-[#0284c7] dark:text-cyan-300 border-[#0284c7]/40 shadow-sm'
            }`}
          >
            <Route className="w-4 h-4" />
            <span>{showDeliverySimulation ? 'সিমুলেশন বন্ধ করুন ✕' : 'আমার ডেলিভারি দেখুন 🚀'}</span>
          </button>
        </div>

        {/* 4. THE INTERACTIVE ILLUSTRATED CANVAS */}
        <MirzapurWorldCanvas
          isDarkMode={isDarkMode}
          selectedCategory={selectedCategory}
          onSelectLandmark={(landmark) => setSelectedLandmark(landmark)}
          userCoords={userCoords}
          activeOrder={activeOrder}
          showDeliverySimulation={showDeliverySimulation}
          onToggleDeliverySimulation={() => setShowDeliverySimulation((prev) => !prev)}
        />

        {/* 5. QUICK LANDMARKS GRID / CAROUSEL */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C69A45]" />
              <span>মির্জাপুরের প্রধান আকর্ষণ ও কভারেজ স্পটসমূহ</span>
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-white/50 hidden sm:inline">
              যেকোনো স্থানে ক্লিক করে তথ্য ও সার্ভিস দেখুন
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {MIRZAPUR_LANDMARKS.slice(0, 5).map((landmark) => (
              <button
                key={landmark.id}
                type="button"
                onClick={() => setSelectedLandmark(landmark)}
                className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#061522]/80 hover:bg-white dark:hover:bg-[#0B2233] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {landmark.icon}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70">
                    {landmark.deliveryTime}
                  </span>
                </div>
                <h4 className="mt-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#0284c7] dark:group-hover:text-cyan-300">
                  {landmark.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-white/60 line-clamp-1 mt-0.5">
                  {landmark.badge}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 6. BOTTOM CALL TO ACTION BANNER */}
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-sky-600 via-[#0284c7] to-cyan-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl flex-shrink-0">
              🛵
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold">
                মির্জাপুরের যেকোনো এলাকা থেকে অর্ডার প্রয়োজন?
              </h4>
              <p className="text-xs sm:text-sm text-white/85 mt-0.5">
                শুধুমাত্র যা লাগবে লিখুন, বাকি দায়িত্ব দরকার রাইডারদের!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOrderClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-[#0284c7] font-bold text-xs sm:text-sm shadow-lg hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>এখনই অর্ডার করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 7. LANDMARK DETAIL MODAL */}
      <LandmarkCardModal
        landmark={selectedLandmark}
        onClose={() => setSelectedLandmark(null)}
        onOrderForLandmark={handleLandmarkOrder}
      />
    </section>
  );
};
