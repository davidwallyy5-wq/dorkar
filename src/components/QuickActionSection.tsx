import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search, PackageCheck, ArrowRight, Sparkles, MapPin, ShieldCheck, Clock } from 'lucide-react';
import { CharacterPackageCarrier, CharacterSittingOnBox } from './CuteDorkarCharacters';

interface QuickActionSectionProps {
  onOrderClick: () => void;
  onTrackClick: () => void;
  onMyOrdersClick: () => void;
  orderCount?: number;
}

export const QuickActionSection: React.FC<QuickActionSectionProps> = ({
  onOrderClick,
  onTrackClick,
  onMyOrdersClick,
  orderCount = 0,
}) => {
  return (
    <section className="py-10 bg-gradient-to-r from-[#F5EFE6] via-[#FAF6EE] to-[#EFE6D8] dark:from-[#081B2B] dark:via-[#061522] dark:to-[#081B2B] transition-colors duration-300 relative overflow-hidden border-y border-slate-200/80 dark:border-white/10">
      {/* Ambient background glows */}
      <div className="absolute -top-10 left-1/4 w-72 h-72 bg-amber-200/20 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-72 h-72 bg-sky-200/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* PRIMARY: ORDER NOW */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={onOrderClick}
            className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B2233]/90 backdrop-blur-xl border border-white dark:border-cyan-400/30 shadow-[0_10px_30px_rgba(2,132,199,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#0ea5e9] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284c7] dark:text-cyan-300 block">
                  তাৎক্ষণিক ডেলিভারি
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                  নতুন অর্ডার করুন
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
                  যা প্রয়োজন লিখুন, রাইডার পৌঁছে দেবে
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 group-hover:bg-[#0284c7] text-slate-700 dark:text-white group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
              <ArrowRight className="w-5 h-5" />
            </div>
          </motion.div>

          {/* SECONDARY: LIVE ORDER TRACKING */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={onTrackClick}
            className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B2233]/90 backdrop-blur-xl border border-white dark:border-[#C69A45]/30 shadow-[0_10px_30px_rgba(198,154,69,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C69A45] to-[#d6a952] text-[#061522] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                <Search className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C69A45] block">
                  লাইভ স্ট্যাটাস
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                  অর্ডার ট্র্যাক করুন
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
                  আইডি দিয়ে রাইডারের অবস্থান জানুন
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 group-hover:bg-[#C69A45] text-slate-700 dark:text-white group-hover:text-[#061522] flex items-center justify-center transition-colors flex-shrink-0">
              <ArrowRight className="w-5 h-5" />
            </div>
          </motion.div>

          {/* THIRD: MY ORDERS */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={onMyOrdersClick}
            className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B2233]/90 backdrop-blur-xl border border-white dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform flex-shrink-0 relative">
                <PackageCheck className="w-7 h-7" />
                {orderCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C69A45] text-[#061522] text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-[#0B2233]">
                    {orderCount}
                  </span>
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300 block">
                  পূর্ববর্তী অর্ডার
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                  আমার অর্ডার
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
                  আপনার সকল সক্রিয় ও সম্পন্ন অর্ডার
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 group-hover:bg-emerald-500 text-slate-700 dark:text-white group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
              <ArrowRight className="w-5 h-5" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
