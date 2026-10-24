import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, Sparkles, Navigation, ShoppingBag, ShieldCheck } from 'lucide-react';
import { MirzapurLandmark } from './types';

interface LandmarkCardModalProps {
  landmark: MirzapurLandmark | null;
  onClose: () => void;
  onOrderForLandmark: (landmark: MirzapurLandmark) => void;
}

export const LandmarkCardModal: React.FC<LandmarkCardModalProps> = ({
  landmark,
  onClose,
  onOrderForLandmark,
}) => {
  if (!landmark) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white/95 dark:bg-[#061522]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/15 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] overflow-hidden text-slate-900 dark:text-white"
        >
          {/* Top Decorative Header */}
          <div
            className="p-6 relative overflow-hidden text-white"
            style={{
              background: `linear-gradient(135deg, ${landmark.accentColor} 0%, #061522 100%)`,
            }}
          >
            {/* Background Glow */}
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/20 blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-lg">
                  {landmark.icon}
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-[11px] font-bold tracking-wide uppercase">
                    {landmark.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif mt-1 text-white">
                    {landmark.name}
                  </h3>
                  <p className="text-xs text-white/80 font-mono">{landmark.nameEn}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white cursor-pointer transition-colors"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Information */}
          <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
            {/* Subtitle Highlight */}
            <p className="text-slate-700 dark:text-white/90 font-semibold leading-relaxed">
              {landmark.subtitle}
            </p>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B2233]/70 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-white/80 leading-relaxed">
              {landmark.description}
            </div>

            {/* Delivery Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-white/60 block font-semibold">
                    ডেলিভারি সময়
                  </span>
                  <span className="font-bold text-cyan-700 dark:text-cyan-300">
                    {landmark.deliveryTime}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C69A45] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-white/60 block font-semibold">
                    কভারেজ এলাকা
                  </span>
                  <span className="font-bold text-amber-800 dark:text-amber-300">
                    {landmark.deliveryReach}
                  </span>
                </div>
              </div>
            </div>

            {/* Fun Fact / Historical Note */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-[#C69A45] text-slate-700 dark:text-white/85 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C69A45] flex-shrink-0 mt-0.5" />
              <p className="text-xs">
                <span className="font-bold text-[#C69A45]">জেনে রাখা ভালো:</span> {landmark.funFact}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOrderForLandmark(landmark);
                }}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0284c7] via-sky-600 to-[#38bdf8] hover:from-sky-600 hover:to-[#0284c7] text-white font-bold text-xs sm:text-sm shadow-[0_8px_20px_rgba(2,132,199,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>এই এলাকা থেকে অর্ডার করুন</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-white font-bold text-xs cursor-pointer transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
