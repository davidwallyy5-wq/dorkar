import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, MapPin, ChevronRight } from 'lucide-react';
import { Order } from '../types';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrderToTrack: (orderId: string) => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrderToTrack,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#061522]/85 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#0B2233] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/15 overflow-hidden z-10 my-8 text-slate-900 dark:text-white transition-colors"
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-7 bg-slate-50 dark:bg-[#061522] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-[#0B2233] text-[#C69A45] border border-amber-300 dark:border-white/10 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">আমার অর্ডারসমূহ</h3>
                  <p className="text-xs text-slate-500 dark:text-white/60">আপনার অর্ডারের রিয়েল-টাইম ইতিহাস ও স্ট্যাটাস</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#0B2233] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content / Orders List */}
            <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto space-y-3.5">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-slate-500 dark:text-white/60 space-y-2">
                  <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-white/20" />
                  <p className="text-base font-semibold text-slate-900 dark:text-white">এখনও কোনো অর্ডার রেকর্ড নেই</p>
                  <p className="text-xs text-slate-500 dark:text-white/50">আপনার যা দরকার অর্ডার করুন, সাথে সাথে লাইভ ট্র্যাকিং দেখতে পাবেন।</p>
                </div>
              ) : (
                orders.map((order) => {
                  const isDone = order.status === 'সম্পন্ন' || order.status === 'ডেলিভারি সম্পন্ন';
                  const isCancelled = order.status === 'বাতিল';

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/10 hover:border-sky-400 dark:hover:border-[#C69A45]/40 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-bold text-[#0284c7] dark:text-[#C69A45]">
                            {order.id}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-white/40">• {order.createdAt}</span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                            isDone
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                              : isCancelled
                              ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-400 border border-red-300 dark:border-red-500/30'
                              : 'bg-sky-100 dark:bg-[#0B2233] text-sky-800 dark:text-[#C69A45] border border-sky-300 dark:border-white/10'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-slate-800 dark:text-white/90 line-clamp-2 font-serif">
                        {order.items}
                      </p>

                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-white/60">
                        <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                          <MapPin className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#C69A45]" />
                          <span className="truncate">{order.address}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectOrderToTrack(order.id);
                          }}
                          className="font-bold text-[#0284c7] dark:text-[#C69A45] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>লাইভ ট্র্যাকিং</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
