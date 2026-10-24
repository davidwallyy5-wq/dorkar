import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Store,
  RefreshCw,
  Send,
  Sparkles,
  Copy,
  Check,
  Search,
  Navigation,
  AlertTriangle,
  Edit3,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Order } from '../types';
import { createOrder } from '../services/orderService';
import { OFFICIAL_CONTACT } from '../utils/mockData';
import { ILLUSTRATIONS } from '../utils/illustrationAssets';
import { InteractiveGpsMap, GpsMapErrorBoundary } from './InteractiveGpsMap';
import {
  getCurrentGPSLocation,
  isWithinServiceArea,
  reverseGeocode,
  BHAWAL_MIRZAPUR_LOCATION,
  MAX_DELIVERY_RADIUS_KM,
} from '../utils/locationUtils';

interface OrderSectionProps {
  initialItems?: string;
  initialCategory?: string;
  onOrderPlaced: (order: Order) => void;
  onTrackOrderClick: (orderId: string) => void;
}

export const OrderSection: React.FC<OrderSectionProps> = ({
  initialItems = '',
  initialCategory = '',
  onOrderPlaced,
  onTrackOrderClick,
}) => {
  const [items, setItems] = useState(initialItems);
  const [category, setCategory] = useState(initialCategory || 'সাধারণ কেনাকাটা');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [preferredStore, setPreferredStore] = useState('');
  const [notes, setNotes] = useState('');

  // Location State
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [detectedLocationName, setDetectedLocationName] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isOutsideArea, setIsOutsideArea] = useState(false);
  const [isGpsConfirmed, setIsGpsConfirmed] = useState(false);
  const [hasDeniedPermission, setHasDeniedPermission] = useState(false);

  // Review & Confirmation Step
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  /**
   * Request customer's high-accuracy GPS location, calculate distance from Bhawal Mirzapur,
   * and auto-fill address if eligible.
   */
  const handleDetectLocation = async (isAutoTrigger = false): Promise<boolean> => {
    setIsLocating(true);
    setLocationError('');
    setIsOutsideArea(false);

    try {
      const position = await getCurrentGPSLocation();
      const { isAllowed, distanceKm: dist } = isWithinServiceArea(position.lat, position.lng);

      setGpsCoords({ lat: position.lat, lng: position.lng });
      setGpsAccuracy(position.accuracy);
      setDistanceKm(dist);
      setIsGpsConfirmed(true);
      setHasDeniedPermission(false);

      if (!isAllowed) {
        setIsOutsideArea(true);
        setLocationError('দুঃখিত, এই মুহূর্তে আপনার এলাকায় আমাদের ডেলিভারি সেবা নেই। (ভাওয়াল মির্জাপুর থেকে দূরত্ব: ' + dist + ' কিমি)');
        setIsLocating(false);
        return false;
      }

      // Reverse geocode to get human readable address
      const placeName = await reverseGeocode(position.lat, position.lng);
      setDetectedLocationName(placeName);

      // If customer address is empty or default, autofill it
      if (!address.trim() || isAutoTrigger) {
        setAddress((prev) => (prev.trim() ? `${prev}, ${placeName}` : placeName));
      }

      setIsOutsideArea(false);
      setLocationError('');
      setIsLocating(false);
      return true;
    } catch (err: any) {
      console.warn('Geolocation detection error:', err);
      setLocationError(err.message || 'লোকেশন পারমিশন পাওয়া যায়নি।');
      setHasDeniedPermission(true);
      setIsLocating(false);
      return false;
    }
  };

  /**
   * Primary action when customer taps "অর্ডার সম্পন্ন করুন / অর্ডার করুন"
   */
  const handleOrderInitiation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLocationError('');

    if (!items.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার দরকারি পণ্যের তালিকা লিখুন।');
      return;
    }
    if (!customerName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    if (!phone.trim() || cleanDigits.length < 11) {
      setErrorMsg('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর (যেমন: 01642430787) প্রদান করুন।');
      return;
    }
    if (!address.trim() && !gpsCoords) {
      setErrorMsg('অনুগ্রহ করে আপনার ডেলিভারি ঠিকানা লিখুন অথবা "আমার বর্তমান লোকেশন ব্যবহার করুন" বাটনে ক্লিক করুন।');
      return;
    }

    // If GPS coordinates have not been fetched yet and address is blank, request GPS permission
    if (!gpsCoords && !hasDeniedPermission && !address.trim()) {
      setIsLocating(true);
      try {
        const position = await getCurrentGPSLocation();
        const { isAllowed, distanceKm: dist } = isWithinServiceArea(position.lat, position.lng);

        setGpsCoords({ lat: position.lat, lng: position.lng });
        setGpsAccuracy(position.accuracy);
        setDistanceKm(dist);
        setIsGpsConfirmed(true);

        if (!isAllowed) {
          setIsOutsideArea(true);
          setLocationError('দুঃখিত, এই মুহূর্তে আপনার এলাকায় আমাদের ডেলিভারি সেবা নেই।');
          setIsLocating(false);
          return;
        }

        const placeName = await reverseGeocode(position.lat, position.lng);
        setDetectedLocationName(placeName);
        if (!address.trim()) {
          setAddress(placeName);
        }

        setIsOutsideArea(false);
        setIsLocating(false);
        setIsReviewing(true);
        return;
      } catch (err: any) {
        setIsLocating(false);
        setHasDeniedPermission(true);
        if (!address.trim()) {
          setErrorMsg('লোকেশন পারমিশন পাওয়া যায়নি। অনুগ্রহ করে ম্যানুয়ালি আপনার ভাওয়াল মির্জাপুরের সঠিক ডেলিভারি ঠিকানা লিখুন।');
          return;
        }
        setIsReviewing(true);
        return;
      }
    }

    // If GPS is already known and outside 5 km, block with the required message
    if (gpsCoords && distanceKm !== null && distanceKm > MAX_DELIVERY_RADIUS_KM) {
      setIsOutsideArea(true);
      setLocationError('দুঃখিত, এই মুহূর্তে আপনার এলাকায় আমাদের ডেলিভারি সেবা নেই।');
      return;
    }

    // Inside service area -> proceed to review step
    setIsReviewing(true);
  };

  /**
   * Final Confirm and Save Order to Firestore
   */
  const handleFinalOrderSubmit = async () => {
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const newOrder = await createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        items: items.trim(),
        address: address.trim(),
        latitude: gpsCoords?.lat,
        longitude: gpsCoords?.lng,
        accuracyMeters: gpsAccuracy ?? undefined,
        distanceKm: distanceKm ?? undefined,
        detectedLocationName: detectedLocationName || undefined,
        notes: notes.trim(),
        preferredStore: preferredStore.trim(),
        category: category,
      });

      onOrderPlaced(newOrder);
      setCompletedOrder(newOrder);
      setIsReviewing(false);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMsg('অর্ডার সাবমিট করতে সমস্যা হয়েছে। দয়া করে আপনার ইন্টারনেট কানেকশন চেক করুন অথবা হটলাইনে কল দিন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (completedOrder?.id) {
      navigator.clipboard.writeText(completedOrder.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setCompletedOrder(null);
    setIsReviewing(false);
    setItems('');
    setCustomerName('');
    setPhone('');
    setAddress('');
    setPreferredStore('');
    setNotes('');
    setGpsCoords(null);
    setDistanceKm(null);
    setDetectedLocationName('');
    setIsOutsideArea(false);
    setLocationError('');
    setErrorMsg('');
  };

  return (
    <section
      id="order"
      className="py-24 sm:py-32 bg-gradient-to-b from-[#EEF7FF] via-[#E0F0FE] to-[#D4EAFB] dark:from-[#061522] dark:via-[#081B2B] dark:to-[#061522] text-slate-900 dark:text-white relative overflow-hidden border-t border-slate-200/80 dark:border-white/10 transition-colors duration-300"
    >
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-200/30 dark:bg-[#0B2233] rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0B2233] border border-sky-300 dark:border-[#C69A45]/30 text-sky-800 dark:text-[#C69A45] text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#C69A45]" />
            <span>ভাওয়াল মির্জাপুর ও ৫ কি.মি. এলাকা</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-serif">
            আজ কী দরকার?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-white/70 mt-3 font-light">
            আপনার প্রয়োজনের ফর্দ লিখুন ও লোকেশন নিশ্চিত করুন। বাকি দায়িত্ব আমাদের।
          </p>
        </motion.div>

        {/* Form Container */}
        <div className="bg-white/85 dark:bg-[#0B2233]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 dark:border-white/10 shadow-[0_16px_50px_rgba(15,39,59,0.08)] dark:shadow-2xl">
          
          <AnimatePresence mode="wait">
            {/* 1. COMPLETED SUCCESS STATE */}
            {completedOrder ? (
              <motion.div
                key="order-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-6 sm:py-10 text-center flex flex-col items-center space-y-6"
              >
                {/* Cute 2D Animated Order Success Illustration */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 180, delay: 0.1 }}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-50 dark:bg-[#061522] border-2 border-emerald-400 dark:border-[#C69A45]/50 shadow-2xl shadow-emerald-500/10 relative"
                >
                  <img
                    src={ILLUSTRATIONS.deliveryDoorstep}
                    alt="Order Success"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </div>
                </motion.div>

                <div className="space-y-2 max-w-lg">
                  <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight font-serif">
                    অর্ডার হয়ে গেছে! ✓
                  </h3>
                  <p className="text-base sm:text-lg text-slate-600 dark:text-white/80 font-light">
                    আপনার অর্ডারটি আমাদের ডাটাবেজে সফলভাবে যুক্ত হয়েছে।
                  </p>
                </div>

                {/* Order ID Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-[#C69A45]/40 w-full max-w-md text-center space-y-3 shadow-lg relative">
                  <span className="text-xs font-semibold text-[#0284c7] dark:text-[#C69A45] uppercase tracking-wider block">
                    আপনার Order ID
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-wider">
                      {completedOrder.id}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="p-2 rounded-lg bg-white dark:bg-[#0B2233] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                      title="আইডি কপি করুন"
                      aria-label="Order ID কপি করুন"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copied && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block">আইডি কপি হয়েছে!</span>
                  )}
                  
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-white/70 space-y-1">
                    <p className="flex items-center justify-center gap-1.5 text-slate-800 dark:text-white/90">
                      <MapPin className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#C69A45]" />
                      <span>{completedOrder.address}</span>
                    </p>
                    {completedOrder.distanceKm !== undefined && (
                      <p className="text-[11px] text-[#0284c7] dark:text-[#C69A45] font-semibold">
                        ভাওয়াল মির্জাপুর কেন্দ্র থেকে দূরত্ব: {completedOrder.distanceKm} কি.মি. (সার্ভিস এরিয়া)
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                  <button
                    type="button"
                    id="track-new-order-btn"
                    onClick={() => onTrackOrderClick(completedOrder.id)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-bold rounded-xl hover:from-[#0369a1] hover:to-[#0284c7] transition-all cursor-pointer shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>অর্ডার ট্র্যাক করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-medium rounded-xl border border-slate-200 dark:border-white/15 transition-colors cursor-pointer text-sm"
                  >
                    নতুন অর্ডার করুন
                  </button>
                </div>
              </motion.div>
            ) : isReviewing ? (
              /* 2. ORDER CONFIRMATION & ADDRESS REVIEW STEP */
              <motion.div
                key="order-review"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-[#0284c7] dark:text-[#C69A45]" />
                      <span>অর্ডার ও লোকেশন নিশ্চিত করুন</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-white/60 mt-1">
                      অর্ডার নিশ্চিত করার আগে আপনার ডেলিভারি ঠিকানা ও তথ্য দেখে নিন।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReviewing(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#061522] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>তথ্য এডিট করুন</span>
                  </button>
                </div>

                {/* GPS Location & Service Area Status Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#061522] border border-sky-300 dark:border-[#C69A45]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0284c7] dark:text-[#C69A45] uppercase tracking-wider flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#C69A45]" />
                      <span>শনাক্তকৃত লোকেশন ও সার্ভিস এরিয়া</span>
                    </span>
                    {distanceKm !== null && distanceKm <= MAX_DELIVERY_RADIUS_KM && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-400 text-[11px] font-bold">
                        ✓ সার্ভিস এরিয়া অনুমোদিত ({distanceKm} কি.মি.)
                      </span>
                    )}
                  </div>

                  {gpsCoords && (
                    <div className="text-xs text-slate-600 dark:text-white/80 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                      <span>কেন্দ্র: <strong className="text-slate-900 dark:text-white">{BHAWAL_MIRZAPUR_LOCATION.name}</strong></span>
                      <span>GPS কোঅর্ডিনেট: <strong className="font-mono text-slate-800 dark:text-white/90">{gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}</strong></span>
                    </div>
                  )}

                  {/* Editable Final Address */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-800 dark:text-white/90 mb-1.5 flex items-center justify-between">
                      <span>চূড়ান্ত ডেলিভারি ঠিকানা (প্রয়োজনে এডিট বা সংশোধন করুন):</span>
                      <span className="text-[11px] text-[#0284c7] dark:text-[#C69A45]">এডিটেবল</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="বাড়ি নং, রোড নং, দোকান বা সুনির্দিষ্ট ল্যান্ডমার্ক..."
                      className="w-full bg-white dark:bg-[#0B2233] border border-slate-300 dark:border-[#C69A45]/50 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-white/50 mt-1">
                      রাইডারের সহজে খুঁজে পাওয়ার জন্য বাড়ি/দোকানের নাম বা স্পষ্ট ল্যান্ডমার্ক যোগ করতে পারেন।
                    </p>
                  </div>
                </div>

                {/* Items & Customer Overview */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/10 space-y-3.5 text-xs text-slate-700 dark:text-white/80">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 block">
                      অর্ডারের বিবরণ
                    </span>
                    <p className="text-sm sm:text-base font-serif font-bold text-slate-900 dark:text-white mt-1">
                      {items}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
                    <div>
                      <span className="text-slate-500 dark:text-white/50 block">গ্রাহকের নাম:</span>
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">{customerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-white/50 block">ফোন নম্বর:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{phone}</span>
                    </div>
                  </div>

                  {preferredStore && (
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                      <span className="text-slate-500 dark:text-white/50">পছন্দের দোকান:</span>{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">{preferredStore}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                    <span className="text-slate-600 dark:text-white/70">ডেলিভারি চার্জ:</span>
                    <span className="font-bold text-[#0284c7] dark:text-[#C69A45] text-sm">
                      সর্বোচ্চ ৳৬০ (দোকানের আসল মেমো ক্যাশ অন ডেলিভারি)
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-500/50 text-rose-800 dark:text-rose-200 text-sm">
                    {errorMsg}
                  </div>
                )}

                {/* Confirmation Button */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting || !address.trim()}
                    onClick={handleFinalOrderSubmit}
                    className="w-full py-4 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white text-base sm:text-lg font-bold rounded-xl transition-all cursor-pointer shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin text-white" />
                        <span>অর্ডার সম্পন্ন হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>হ্যাঁ, অর্ডার নিশ্চিত করুন</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReviewing(false)}
                    className="w-full sm:w-auto px-6 py-4 bg-slate-100 dark:bg-[#061522] hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white font-medium rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    ফিরে যান
                  </button>
                </div>
              </motion.div>
            ) : (
              /* 3. PRIMARY ORDER INPUT FORM */
              <motion.form
                key="order-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleOrderInitiation}
                className="space-y-6 sm:space-y-7"
              >
                {/* 1. Items textarea */}
                <div>
                  <label
                    htmlFor="order-items-input"
                    className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2.5 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 font-serif">
                      <ShoppingBag className="w-5 h-5 text-[#0284c7] dark:text-[#C69A45]" />
                      আপনার দরকারের পণ্যের বিবরণ লিখুন
                    </span>
                    <span className="text-xs text-[#0284c7] dark:text-[#C69A45] font-semibold bg-sky-50 dark:bg-[#061522] px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-white/10">আবশ্যক</span>
                  </label>
                  <textarea
                    id="order-items-input"
                    rows={4}
                    required
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                    placeholder="যেমন: ১ কেজি দেশি আলু, ৫০০ গ্রাম পেঁয়াজ, নাপা এক্সট্রা ১ পাতা এবং ২ প্যাকেট দুধ..."
                    className="w-full bg-white dark:bg-[#061522] border border-slate-200 dark:border-white/15 rounded-2xl p-4 sm:p-5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/35 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] transition-all text-base sm:text-lg resize-none leading-relaxed shadow-sm"
                  />
                </div>

                {/* 2. Customer Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="customer-name-input"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-white/90 mb-2 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-[#0284c7] dark:text-[#C69A45]" />
                      আপনার নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="customer-name-input"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="আপনার পূর্ণ নাম লিখুন"
                      className="w-full bg-white dark:bg-[#061522] border border-slate-200 dark:border-white/15 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/35 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="customer-phone-input"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-white/90 mb-2 flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-[#0284c7] dark:text-[#C69A45]" />
                      ফোন নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="customer-phone-input"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-white dark:bg-[#061522] border border-slate-200 dark:border-white/15 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/35 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] text-sm font-mono"
                    />
                  </div>
                </div>

                {/* 3. Delivery Address with Precise GPS Button */}
                <div className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label
                      htmlFor="customer-address-input"
                      className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white/90 flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4 text-[#0284c7] dark:text-[#C69A45]" />
                      <span>ডেলিভারি ঠিকানা</span>
                      <span className="text-rose-500">*</span>
                    </label>

                    {/* Instant Auto-Detect Button */}
                    <button
                      type="button"
                      onClick={() => handleDetectLocation(true)}
                      disabled={isLocating}
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-[#061522] dark:hover:bg-[#12181D] border border-sky-200 dark:border-[#C69A45]/60 text-sky-800 dark:text-[#C69A45] text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50 self-start sm:self-auto"
                      title="আপনার ডিভাইসের বর্তমান নির্ভুল GPS অবস্থান নিন"
                    >
                      {isLocating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>সঠিক GPS লোকেশন যাচাই হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3.5 h-3.5" />
                          <span>আমার বর্তমান লোকেশন ব্যবহার করুন</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="customer-address-input"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="বাড়ি নং, রোড নং, এলাকা ও ল্যান্ডমার্ক (যেমন: ভাওয়াল মির্জাপুর বাজার সংলগ্ন)"
                      className="w-full bg-white dark:bg-[#061522] border border-slate-200 dark:border-white/15 rounded-xl pl-4 pr-10 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/35 focus:outline-none focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] text-sm"
                    />
                    {gpsCoords && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" title="GPS সংযুক্ত">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* GPS Confirmation & Interactive Map Preview */}
                  {gpsCoords && distanceKm !== null && distanceKm <= MAX_DELIVERY_RADIUS_KM && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-[#061522] border border-emerald-300 dark:border-emerald-500/40 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>✓ আপনার সঠিক লোকেশন পাওয়া গেছে</span>
                        </div>
                        {gpsAccuracy !== null && (
                          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300">
                            GPS নির্ভুলতা: ±{gpsAccuracy} মিটার
                          </span>
                        )}
                      </div>

                      {/* Interactive map with exact pin */}
                      <div className="rounded-xl overflow-hidden border border-emerald-200 dark:border-white/10">
                        <GpsMapErrorBoundary>
                          <InteractiveGpsMap
                            latitude={gpsCoords.lat}
                            longitude={gpsCoords.lng}
                            accuracyMeters={gpsAccuracy ?? undefined}
                            customerName={customerName || 'আপনার অবস্থান'}
                            address={address}
                            height="220px"
                            showNavigationButton={false}
                          />
                        </GpsMapErrorBoundary>
                      </div>

                      {/* Poor accuracy retry prompt if accuracy > 50m */}
                      {gpsAccuracy !== null && gpsAccuracy > 50 && (
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs flex flex-wrap items-center justify-between gap-2">
                          <span>লোকেশন আরও নির্ভুল করার চেষ্টা চলছে... (±{gpsAccuracy}m)</span>
                          <button
                            type="button"
                            onClick={() => handleDetectLocation(false)}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 text-amber-900 dark:text-amber-300 font-bold text-[11px] border border-amber-300 dark:border-amber-500/40 cursor-pointer flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>পুনরায় রিফ্রেশ করুন</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Denied GPS permission fallback notice */}
                  {hasDeniedPermission && !gpsCoords && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-[#061522] border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200/90 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <span>ম্যানুয়াল ঠিকানা প্রদান করা হয়েছে (সরাসরি GPS সংযুক্ত নয়)।</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDetectLocation(false)}
                        className="text-[#0284c7] dark:text-[#C69A45] hover:underline font-bold text-xs cursor-pointer"
                      >
                        GPS অন করুন
                      </button>
                    </div>
                  )}

                  {/* Outside Area Alert Banner (Exact user required phrase) */}
                  {isOutsideArea && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/60 text-rose-900 dark:text-rose-200 text-xs sm:text-sm space-y-1.5"
                    >
                      <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-100 text-sm">
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                        <span>দুঃখিত, এই মুহূর্তে আপনার এলাকায় আমাদের ডেলিভারি সেবা নেই।</span>
                      </div>
                      <p className="text-xs text-rose-700 dark:text-rose-200/80 pl-6">
                        আমাদের সার্ভিস এলাকা: <strong>ভাওয়াল মির্জাপুর ও আশেপাশের সর্বোচ্চ ৫ কিমি এলাকা</strong>।
                        {distanceKm !== null && (
                          <span className="block mt-0.5">
                            আপনার বর্তমান অবস্থান ভাওয়াল মির্জাপুর কেন্দ্র থেকে <strong>{distanceKm} কি.মি.</strong> দূরে।
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-rose-800 dark:text-rose-300/80 pl-6 pt-1">
                        জরুরি সহযোগিতার জন্য কল করুন: <a href={`tel:${OFFICIAL_CONTACT.phone}`} className="underline font-bold font-mono">{OFFICIAL_CONTACT.phoneDisplay}</a>
                      </p>
                    </motion.div>
                  )}

                  {/* General location error if not out-of-area */}
                  {locationError && !isOutsideArea && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
                      <span>{locationError}</span>
                      <button
                        type="button"
                        onClick={() => handleDetectLocation(false)}
                        className="text-amber-800 dark:text-amber-300 underline font-semibold ml-2 cursor-pointer"
                      >
                        আবার চেষ্টা করুন
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Optional Preferred Store & Additional Note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="preferred-store-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-1.5 flex items-center gap-1.5"
                    >
                      <Store className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#C69A45]" />
                      পছন্দের দোকান (অপশনাল)
                    </label>
                    <input
                      id="preferred-store-input"
                      type="text"
                      value={preferredStore}
                      onChange={(e) => setPreferredStore(e.target.value)}
                      placeholder="নির্দিষ্ট কোনো দোকান থেকে কিনতে চাইলে লিখুন"
                      className="w-full bg-white dark:bg-[#061522] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/25 focus:outline-none focus:border-[#0284c7] text-xs"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="order-notes-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-1.5 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#C69A45]" />
                      অতিরিক্ত নোট বা নির্দেশনা (অপশনাল)
                    </label>
                    <input
                      id="order-notes-input"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="যেমন: ফ্রেশ শাকসবজি ও আসল মেমো চাই"
                      className="w-full bg-white dark:bg-[#061522] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/25 focus:outline-none focus:border-[#0284c7] text-xs"
                    />
                  </div>
                </div>

                {/* Service Area & Delivery Charge Transparency Box */}
                <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-[#061522] border border-sky-200 dark:border-[#C69A45]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#C69A45]" />
                      <span>সার্ভিস এলাকা: ভাওয়াল মির্জাপুর ও আশেপাশের সর্বোচ্চ ৫ কি.মি.</span>
                    </span>
                    <span className="text-slate-600 dark:text-white/60 block">
                      দোকানের আসল ক্যাশ মেমো অনুসারে পণ্যের মূল্যের সাথে ডেলিভারি চার্জ যুক্ত হবে।
                    </span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#0B2233] border border-sky-200 dark:border-white/10 text-[#0284c7] dark:text-[#C69A45] font-bold text-sm whitespace-nowrap self-start sm:self-auto shadow-sm">
                    Delivery Charge: {OFFICIAL_CONTACT.maxDeliveryChargeText}
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-500/50 text-rose-800 dark:text-rose-200 text-sm"
                  >
                    {errorMsg}
                  </motion.div>
                )}

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    id="submit-order-btn"
                    disabled={isLocating || isSubmitting || isOutsideArea}
                    className="w-full py-4 sm:py-4.5 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white text-base sm:text-lg font-bold rounded-2xl transition-all cursor-pointer shadow-xl shadow-sky-500/25 active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLocating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin text-white" />
                        <span>লোকেশন ও সার্ভিস এরিয়া যাচাই করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <span>অর্ডার করুন</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
};
