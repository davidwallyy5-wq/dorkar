import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  CheckCircle2,
  MapPin,
  User,
  Package,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Clock,
  RefreshCw,
  XCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { STATUS_STEPS, OFFICIAL_CONTACT, getStatusStepIndex } from '../utils/mockData';
import { subscribeToOrder, getCustomerOrderIds } from '../services/orderService';

interface OrderTrackingProps {
  activeTrackId?: string;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  activeTrackId = '',
}) => {
  const [searchId, setSearchId] = useState(activeTrackId);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Load locally saved customer order IDs
  useEffect(() => {
    setSavedIds(getCustomerOrderIds());
  }, []);

  // When activeTrackId changes externally (e.g. after placing order)
  useEffect(() => {
    if (activeTrackId) {
      setSearchId(activeTrackId);
      performTrack(activeTrackId);
    }
  }, [activeTrackId]);

  // Real-time listener for current tracked order ID
  useEffect(() => {
    if (!trackedOrder?.id) return;

    const unsubscribe = subscribeToOrder(trackedOrder.id, (updated) => {
      if (updated) {
        setTrackedOrder(updated);
      }
    });

    return () => unsubscribe();
  }, [trackedOrder?.id]);

  const performTrack = (idToTrack: string) => {
    setErrorMsg('');
    const cleanId = idToTrack.trim().toUpperCase();

    if (!cleanId) {
      setErrorMsg('অনুগ্রহ করে আপনার Order ID লিখুন (যেমন: DKR-XXXXXX)');
      setTrackedOrder(null);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToOrder(cleanId, (order) => {
      setIsLoading(false);
      if (order) {
        setTrackedOrder(order);
        setErrorMsg('');
      } else {
        setTrackedOrder(null);
        setErrorMsg(`"${cleanId}" নম্বরে কোনো অর্ডার পাওয়া যায়নি। দয়া করে সঠিক Order ID দিন অথবা আমাদের হটলাইনে কল করুন।`);
      }
    });

    // Cleanup initial listener on next action
    return () => unsubscribe();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performTrack(searchId);
  };

  const getStepIndex = (status: OrderStatus) => {
    return getStatusStepIndex(status);
  };

  return (
    <section
      id="track"
      className="py-24 sm:py-32 bg-gradient-to-b from-[#E0F0FE] via-[#EEF7FF] to-white dark:from-[#0B2233] dark:via-[#081B2B] dark:to-[#061522] text-slate-900 dark:text-white relative overflow-hidden border-t border-slate-200/80 dark:border-white/10 transition-colors duration-300"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/40 dark:bg-[#C69A45]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#12181D] border border-sky-300 dark:border-white/10 text-sky-800 dark:text-[#C69A45] text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#C69A45]" />
            <span>লাইভ রিয়েল-টাইম ট্র্যাকিং</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-serif">
            আপনার অর্ডার কোথায়?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-white/70 mt-3 font-light">
            আপনার Order ID দিয়ে সরাসরি লাইভ স্ট্যাটাস জেনে নিন।
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="bg-white/90 dark:bg-[#061522] rounded-3xl p-3 sm:p-4 border border-slate-200/80 dark:border-white/10 shadow-[0_12px_40px_rgba(15,39,59,0.06)] dark:shadow-2xl mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-white/40" />
              <input
                type="text"
                id="track-order-search-input"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                placeholder="Order ID লিখুন (যেমন: DKR-XXXXXX)"
                className="w-full bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-base text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-white/35 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7]"
              />
            </div>
            <button
              type="submit"
              id="track-order-search-btn"
              disabled={isLoading}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white text-base font-bold rounded-2xl transition-all cursor-pointer shadow-lg shadow-sky-500/25 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
              ) : (
                <>
                  <span>ট্র্যাক করুন</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* User's recent orders shortcuts */}
          {savedIds.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-2 px-2">
              <span className="text-xs text-slate-500 dark:text-white/50 font-medium">আপনার সাম্প্রতিক অর্ডার:</span>
              {savedIds.slice(0, 4).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setSearchId(id);
                    performTrack(id);
                  }}
                  className="px-3 py-1 bg-sky-50 dark:bg-[#0B2233] hover:bg-sky-100 dark:hover:bg-[#12181D] hover:border-sky-300 dark:hover:border-[#C69A45]/50 text-sky-800 dark:text-[#C69A45] text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer border border-sky-200 dark:border-white/10 flex items-center gap-1"
                >
                  <span>{id}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-sm flex items-center gap-3 mb-8"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="space-y-1">
              <p>{errorMsg}</p>
              <p className="text-xs text-amber-800 dark:text-amber-300/80">
                জরুরি প্রয়োজনে সরাসরি কল করুন: <a href={`tel:${OFFICIAL_CONTACT.phone}`} className="underline font-bold font-mono">{OFFICIAL_CONTACT.phoneDisplay}</a>
              </p>
            </div>
          </motion.div>
        )}

        {/* Tracked Order Result View */}
        <AnimatePresence mode="wait">
          {trackedOrder && (
            <motion.div
              key={trackedOrder.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/95 dark:bg-[#061522] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-[0_16px_50px_rgba(15,39,59,0.08)] dark:shadow-2xl space-y-8"
            >
              {/* Order Header Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10 gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#0284c7] dark:text-[#C69A45] uppercase tracking-wider">
                      অর্ডার আইডি
                    </span>
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-wide">
                      {trackedOrder.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-white/50 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>অর্ডার সময়: {trackedOrder.createdAt}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {trackedOrder.status === 'বাতিল' ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-500/50 text-red-800 dark:text-red-300 text-xs font-bold">
                      <XCircle className="w-4 h-4" />
                      <span>অর্ডার বাতিল</span>
                    </span>
                  ) : trackedOrder.status === 'সম্পন্ন' ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>সম্পন্ন হয়েছে</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-50 dark:bg-[#0B2233] border border-sky-300 dark:border-[#C69A45]/40 text-slate-800 dark:text-white text-xs font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] dark:bg-[#C69A45] animate-pulse" />
                      <span>{trackedOrder.status}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Order Items & Customer Overview */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B2233]/70 border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-[#0284c7] dark:text-[#C69A45] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
                      অর্ডারকৃত পণ্যতালিকা
                    </span>
                    <p className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed font-serif mt-0.5">
                      {trackedOrder.items}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-white/80">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0284c7] dark:text-[#C69A45]" />
                    <span>গ্রাহকের নাম: <strong className="text-slate-900 dark:text-white">{trackedOrder.customerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0284c7] dark:text-[#C69A45]" />
                    <span>ঠিকানা: <strong className="text-slate-900 dark:text-white">{trackedOrder.address}</strong></span>
                  </div>
                </div>

                {/* Assigned Rider Info Banner for Customer */}
                {trackedOrder.assignedRiderName && trackedOrder.status !== 'বাতিল' && (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#061522] border border-sky-200 dark:border-[#C69A45]/30 flex items-center justify-between gap-3 text-xs shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-[#0B2233] border border-sky-300 dark:border-[#C69A45]/40 text-sky-800 dark:text-[#C69A45] flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-white/40 uppercase block">ডেলিভারি রাইডার</span>
                        <strong className="text-slate-900 dark:text-white text-sm font-serif">{trackedOrder.assignedRiderName}</strong>
                      </div>
                    </div>

                    {trackedOrder.assignedRiderPhone && (
                      <a
                        href={`tel:${trackedOrder.assignedRiderPhone}`}
                        className="px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-[#0B2233] border border-sky-200 dark:border-white/15 text-sky-800 dark:text-[#C69A45] hover:border-[#0284c7] flex items-center gap-1.5 font-mono text-xs font-bold transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{trackedOrder.assignedRiderPhone}</span>
                      </a>
                    )}
                  </div>
                )}

                {trackedOrder.latitude && trackedOrder.longitude && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-white/60">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      GPS ভেরিফাইড (ভাওয়াল মির্জাপুর এরিয়া{trackedOrder.distanceKm ? ` • ${trackedOrder.distanceKm} কিমি` : ''})
                    </span>
                    <a
                      href={`https://www.google.com/maps?q=${trackedOrder.latitude},${trackedOrder.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0284c7] dark:text-[#C69A45] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>ম্যাপে অবস্থান</span>
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
                  <span className="text-slate-600 dark:text-white/60">ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-[#0284c7] dark:text-[#C69A45]">সর্বোচ্চ ৳{trackedOrder.deliveryCharge || 60} (আসল মেমো ক্যাশ অন ডেলিভারি)</span>
                </div>
              </div>

              {/* Step Timeline (if not cancelled) */}
              {trackedOrder.status !== 'বাতিল' ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-white/60 uppercase tracking-widest mb-6 flex items-center justify-between">
                    <span>ডেলিভারির লাইভ অগ্রগতি</span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      লাইভ কানেক্টেড
                    </span>
                  </h4>
                  
                  <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-white/15">
                    {STATUS_STEPS.map((step, idx) => {
                      const currentIdx = getStepIndex(trackedOrder.status);
                      const isPassed = idx < currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step.key} className="relative flex items-start gap-4">
                          {/* Step Marker */}
                          <div
                            className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isPassed
                                ? 'bg-[#0284c7] dark:bg-[#C69A45] text-white dark:text-[#061522] border-2 border-[#0284c7] dark:border-[#C69A45]'
                                : isCurrent
                                ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] dark:bg-[#C69A45] text-white dark:text-[#061522] border-2 border-sky-400 dark:border-[#C69A45] shadow-lg shadow-sky-500/30 dark:shadow-[#C69A45]/30 ring-4 ring-sky-200 dark:ring-[#C69A45]/20'
                                : 'bg-slate-100 dark:bg-[#0B2233] text-slate-400 dark:text-white/40 border-2 border-slate-300 dark:border-white/20'
                            }`}
                          >
                            {isPassed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5
                                className={`text-base font-bold font-serif ${
                                  isCurrent
                                    ? 'text-slate-900 dark:text-white'
                                    : isPassed
                                    ? 'text-slate-800 dark:text-white/80'
                                    : 'text-slate-400 dark:text-white/40'
                                }`}
                              >
                                {step.label}
                              </h5>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-[#C69A45]/20 text-[#0284c7] dark:text-[#C69A45] text-[10px] font-bold">
                                  চলমান
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs sm:text-sm mt-0.5 ${
                                isCurrent ? 'text-slate-600 dark:text-white/70' : 'text-slate-400 dark:text-white/40'
                              }`}
                            >
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Cancelled State Banner */
                <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-500/30 text-center space-y-2">
                  <p className="text-base font-bold text-red-800 dark:text-red-200">
                    অর্ডারটি বাতিল করা হয়েছে
                  </p>
                  <p className="text-xs text-slate-600 dark:text-white/60">
                    কোনো জিজ্ঞাসা বা নতুন নির্দেশের জন্য সরাসরি আমাদের হটলাইনে যোগাযোগ করুন: {OFFICIAL_CONTACT.phoneDisplay}
                  </p>
                </div>
              )}

              {/* Need Help Box */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-white/60">
                <span>অর্ডারে কোনো পরিবর্তন বা সহায়তা দরকার?</span>
                <a
                  href={`tel:${OFFICIAL_CONTACT.phone}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0B2233] hover:bg-slate-200 dark:hover:bg-[#12181D] border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white font-semibold flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#C69A45]" />
                  <span>হটলাইন: {OFFICIAL_CONTACT.phoneDisplay}</span>
                </a>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
