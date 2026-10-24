import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShoppingBag,
  Bike,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface RoleEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: () => void;
  onSelectRider: () => void;
  onSelectAdmin: () => void;
}

export const RoleEntryModal: React.FC<RoleEntryModalProps> = ({
  isOpen,
  onClose,
  onSelectCustomer,
  onSelectRider,
  onSelectAdmin,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 py-6 flex items-center justify-center">
          {/* Dark Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#061522]/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-xl bg-white dark:bg-[#0B2233] border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 text-slate-900 dark:text-white space-y-6 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#0284c7] dark:text-[#C69A45] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  দরকার পোর্টাল অ্যাক্সেস
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif">
                  আপনার ভূমিকা নির্বাচন করুন
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60">
                  কাস্টমারদের জন্য কোনো লগইন প্রয়োজন নেই। রাইডার ও অ্যাডমিনদের জন্য সুরক্ষিত লগইন।
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#061522] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Role Options */}
            <div className="space-y-3.5 pt-2">
              {/* Option 1: Customer (Main Website) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  onClose();
                  onSelectCustomer();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onClose();
                    onSelectCustomer();
                  }
                }}
                className="group p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-[#061522] hover:bg-emerald-50 dark:hover:bg-[#081B2B] border border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                        কাস্টমার (Customer)
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-200/80 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        সরাসরি সেবা
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-white/60 mt-0.5 font-medium">
                      কোনো লগইন ছাড়া সরাসরি অর্ডার দিন ও লাইভ ট্র্যাক করুন।
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/5 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-500 dark:text-white/60 transition-colors flex-shrink-0 shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Option 2: Rider Login */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  onClose();
                  onSelectRider();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onClose();
                    onSelectRider();
                  }
                }}
                className="group p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-[#061522] hover:bg-amber-50 dark:hover:bg-[#081B2B] border border-amber-300 dark:border-amber-500/30 hover:border-[#C69A45] transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-[#C69A45]/10 border border-amber-300 dark:border-[#C69A45]/30 flex items-center justify-center text-amber-800 dark:text-[#C69A45] group-hover:scale-110 transition-transform">
                    <Bike className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                        রাইডার লগইন (Rider Login)
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-amber-200/80 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 text-[10px] font-bold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        লগইন প্রয়োজন
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-white/60 mt-0.5 font-medium">
                      অ্যাসাইনকৃত অর্ডার দেখুন, কাস্টমারকে কল করুন ও ডেলিভারি আপডেট করুন।
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/5 group-hover:bg-[#C69A45] group-hover:text-white flex items-center justify-center text-slate-500 dark:text-white/60 transition-colors flex-shrink-0 shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Option 3: Owner / Admin Login */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  onClose();
                  onSelectAdmin();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onClose();
                    onSelectAdmin();
                  }
                }}
                className="group p-4 sm:p-5 rounded-2xl bg-sky-50/60 dark:bg-[#061522] hover:bg-sky-50 dark:hover:bg-[#081B2B] border border-sky-300 dark:border-blue-500/30 hover:border-sky-500 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-blue-500/10 border border-sky-300 dark:border-blue-500/30 flex items-center justify-center text-sky-800 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                        ওনার / অ্যাডমিন লগইন (Owner Login)
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-sky-200/80 dark:bg-blue-500/20 text-sky-900 dark:text-blue-300 text-[10px] font-bold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        সুরক্ষিত অ্যাক্সেস
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-white/60 mt-0.5 font-medium">
                      সকল অর্ডার ব্যবস্থাপনা, রাইডার নিয়োগ ও সার্বিক প্ল্যাটফর্ম কন্ট্রোল।
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/5 group-hover:bg-[#0284c7] group-hover:text-white flex items-center justify-center text-slate-500 dark:text-white/60 transition-colors flex-shrink-0 shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-500 dark:text-white/40">
                🔒 কঠোর নিরাপত্তা: রাইডাররা অন্য রাইডারের অর্ডার দেখতে পারবেন না এবং সাধারণ ব্যবহারকারীরা অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে পারবেন না।
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
