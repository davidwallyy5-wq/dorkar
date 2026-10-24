import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Phone, User, Package, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';
import { Order } from '../types';
import { InteractiveGpsMap, GpsMapErrorBoundary } from './InteractiveGpsMap';

interface GpsLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  role?: 'admin' | 'rider' | 'customer';
}

export const GpsLocationModal: React.FC<GpsLocationModalProps> = ({
  isOpen,
  onClose,
  order,
  role = 'admin',
}) => {
  if (!isOpen || !order) return null;

  const hasGps = order.latitude !== undefined && order.longitude !== undefined;
  const lat = order.latitude || 24.0886;
  const lng = order.longitude || 90.3582;
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#061522]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#0B2233] border border-[#C69A45]/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#061522]/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C69A45]/20 border border-[#C69A45]/40 flex items-center justify-center text-[#C69A45]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  কাস্টমারের সঠিক GPS লোকেশন
                </h3>
                <p className="text-xs text-white/60">
                  অর্ডার ID: <span className="font-mono text-[#C69A45] font-bold">#{order.id}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {hasGps ? (
              <>
                {/* Precise GPS Map View */}
                <GpsMapErrorBoundary>
                  <InteractiveGpsMap
                    latitude={lat}
                    longitude={lng}
                    accuracyMeters={order.accuracyMeters}
                    customerName={order.customerName}
                    address={order.address}
                    height="340px"
                    showNavigationButton={role === 'rider' || role === 'admin'}
                  />
                </GpsMapErrorBoundary>

                {/* Customer Details Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#061522]/70 p-4 rounded-2xl border border-white/10">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-white/60">
                      <User className="w-3.5 h-3.5 text-[#C69A45]" />
                      <span>গ্রাহকের নাম:</span>
                    </div>
                    <p className="font-bold text-white text-sm pl-5.5">{order.customerName}</p>

                    <div className="flex items-center gap-2 text-white/60 pt-1">
                      <Phone className="w-3.5 h-3.5 text-[#C69A45]" />
                      <span>মোবাইল নম্বর:</span>
                    </div>
                    <div className="pl-5.5 flex items-center gap-2">
                      <a
                        href={`tel:${order.phone}`}
                        className="font-mono font-bold text-[#C69A45] hover:underline"
                      >
                        {order.phone}
                      </a>
                      <a
                        href={`tel:${order.phone}`}
                        className="px-2 py-0.5 rounded bg-white/5 text-white/80 hover:bg-white/10 text-[10px] border border-white/10"
                      >
                        সরাসরি কল
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4 pt-2 sm:pt-0">
                    <div className="flex items-center gap-2 text-white/60">
                      <MapPin className="w-3.5 h-3.5 text-[#C69A45]" />
                      <span>প্রদত্ত ডেলিভারি ঠিকানা:</span>
                    </div>
                    <p className="text-white/90 pl-5.5 leading-relaxed">{order.address}</p>

                    <div className="flex items-center gap-2 text-white/60 pt-1">
                      <Package className="w-3.5 h-3.5 text-[#C69A45]" />
                      <span>প্রয়োজনীয় জিনিস:</span>
                    </div>
                    <p className="text-white/80 pl-5.5 line-clamp-2">{order.items}</p>
                  </div>
                </div>
              </>
            ) : (
              /* No GPS provided state */
              <div className="py-8 px-4 text-center space-y-4 bg-[#061522] rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">সরাসরি GPS সংযুক্ত নয়</h4>
                  <p className="text-xs text-white/60 max-w-md mx-auto">
                    গ্রাহক অর্ডার করার সময় GPS পারমিশন দেননি। গ্রাহক ম্যানুয়ালি নিচের ঠিকানাটি উল্লেখ করেছেন:
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white max-w-md mx-auto text-left">
                  <span className="text-[11px] text-[#C69A45] font-bold block mb-1">গ্রাহকের ঠিকানা:</span>
                  {order.address}
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <a
                    href={`tel:${order.phone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B2233] border border-[#C69A45]/40 text-[#C69A45] text-xs font-bold hover:bg-[#C69A45] hover:text-[#061522] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>ঠিকানা জানতে কল করুন ({order.phone})</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 bg-[#061522]/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <ShieldCheck className="w-4 h-4 text-[#C69A45]" />
              <span>দরকার সিকিউর ডেলিভারি জিপিএস</span>
            </div>

            <div className="flex items-center gap-2">
              {hasGps && (
                <>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#061522] border border-[#C69A45]/50 text-[#C69A45] hover:bg-[#C69A45] hover:text-[#061522] text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Google Maps-এ খুলুন</span>
                  </a>

                  {(role === 'rider' || role === 'admin') && (
                    <a
                      href={navigationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>নেভিগেশন</span>
                    </a>
                  )}
                </>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
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
