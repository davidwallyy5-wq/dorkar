import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Search,
  MapPin,
  Phone,
  User,
  Navigation,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Package,
  Clock,
  ChevronRight,
  ShieldCheck,
  Store,
  Send,
  Edit3,
  Sparkles,
  ExternalLink,
  Info,
  Mic,
  MicOff,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { createOrder, subscribeToOrder, getCustomerOrderIds } from '../services/orderService';
import { STATUS_STEPS, OFFICIAL_CONTACT, getStatusStepIndex } from '../utils/mockData';
import { InteractiveGpsMap, GpsMapErrorBoundary } from './InteractiveGpsMap';
import {
  getCurrentGPSLocation,
  isWithinServiceArea,
  reverseGeocode,
  BHAWAL_MIRZAPUR_LOCATION,
  MAX_DELIVERY_RADIUS_KM,
} from '../utils/locationUtils';
import {
  CharacterHeroScooter,
  CharacterPackageCarrier,
  CharacterShoppingHelper,
  CharacterWithPhone,
  CharacterGpsHelper,
  CharacterCustomerHelper,
  CharacterCelebrationRider,
} from './CuteDorkarCharacters';

interface HeroCustomerInterfaceProps {
  activeTab: 'order' | 'track';
  onTabChange: (tab: 'order' | 'track') => void;
  initialItems?: string;
  initialCategory?: string;
  activeTrackId?: string;
  onOrderPlaced: (order: Order) => void;
}

export const HeroCustomerInterface: React.FC<HeroCustomerInterfaceProps> = ({
  activeTab,
  onTabChange,
  initialItems = '',
  initialCategory = '',
  activeTrackId = '',
  onOrderPlaced,
}) => {
  // Wizard Step: 1 (Items) -> 2 (Store) -> 3 (GPS) -> 4 (Dropoff) -> 5 (Name) -> 6 (Phone) -> 7 (Notes) -> 8 (Summary)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepDirection, setStepDirection] = useState<'next' | 'prev'>('next');

  // Form Fields (Persistent)
  const [items, setItems] = useState(initialItems);
  const [category, setCategory] = useState(initialCategory || 'সাধারণ কেনাকাটা');
  const [preferredStore, setPreferredStore] = useState('');
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // GPS & Location State
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [detectedLocationName, setDetectedLocationName] = useState<string>('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isOutsideArea, setIsOutsideArea] = useState(false);
  const [isGpsConfirmed, setIsGpsConfirmed] = useState(false);

  // Validation & Submission
  const [validationError, setValidationError] = useState<string>('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [orderErrorMsg, setOrderErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Voice Order State
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceSupport, setVoiceSupport] = useState(true);

  const handleVoiceOrderToggle = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupport(false);
      setValidationError('আপনার ব্রাউজারে ভয়েস রিকগনিশন সাপোর্ট নেই। অনুগ্রহ করে টাইপ করুন।');
      return;
    }

    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-BD';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningVoice(true);
        setValidationError('');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript.trim()) {
          setItems((prev) => (prev ? `${prev}, ${transcript.trim()}` : transcript.trim()));
        }
        setIsListeningVoice(false);
      };

      recognition.onerror = () => {
        setIsListeningVoice(false);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } catch {
      setIsListeningVoice(false);
    }
  };

  // Tracking State
  const [searchTrackId, setSearchTrackId] = useState(activeTrackId);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackErrorMsg, setTrackErrorMsg] = useState('');
  const [savedOrderIds, setSavedOrderIds] = useState<string[]>([]);

  // Popular Quick Suggestion Chips for Step 1
  const quickSuggestions = [
    'প্যারাসিটামল ও নাপা সিরাপ',
    '১ কেজি পেঁয়াজ ও আধা কেজি কাঁচামরিচ',
    'হাফ কেজি মিষ্টি ও দই',
    'জরুরি ফাইল ও কাগজপত্র',
    'খাতা, কলম ও স্টেশনারি',
    'রেস্তোরাঁর খাবার',
  ];

  // Sync initial items & category
  useEffect(() => {
    if (initialItems) setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSavedOrderIds(getCustomerOrderIds());
  }, []);

  useEffect(() => {
    if (activeTrackId) {
      setSearchTrackId(activeTrackId);
      performTracking(activeTrackId);
    }
  }, [activeTrackId]);

  useEffect(() => {
    if (!trackedOrder?.id) return;
    const unsubscribe = subscribeToOrder(trackedOrder.id, (updated) => {
      if (updated) setTrackedOrder(updated);
    });
    return () => unsubscribe();
  }, [trackedOrder?.id]);

  // Handle GPS location detection with high accuracy
  const handleDetectLocation = async (): Promise<boolean> => {
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

      if (!isAllowed) {
        setIsOutsideArea(true);
      }

      // Reverse geocode to human readable name
      try {
        const placeName = await reverseGeocode(position.lat, position.lng);
        setDetectedLocationName(placeName);
        if (!address.trim()) {
          setAddress(placeName);
        }
      } catch {
        setDetectedLocationName(`অক্ষাংশ: ${position.lat.toFixed(4)}, দ্রাঘিমাংশ: ${position.lng.toFixed(4)}`);
      }

      setIsLocating(false);
      return true;
    } catch (err: any) {
      setIsLocating(false);
      setLocationError(err.message || 'লোকেশন সনাক্ত করতে ব্যর্থ হয়েছে। ম্যানুয়ালি ঠিকানা লিখুন।');
      return false;
    }
  };

  // Step Validation
  const validateCurrentStep = (): boolean => {
    setValidationError('');

    if (currentStep === 1) {
      if (!items.trim()) {
        setValidationError('অনুগ্রহ করে আপনার প্রয়োজনীয় পণ্যের বিবরণ লিখুন 😊');
        return false;
      }
    } else if (currentStep === 2) {
      // Preferred store can be optional or fallback to default
    } else if (currentStep === 3) {
      // GPS step - recommended but optional if user enters address in step 4
    } else if (currentStep === 4) {
      if (!address.trim()) {
        setValidationError('অনুগ্রহ করে ডেলিভারি ঠিকানা বা ল্যান্ডমার্ক লিখুন 😊');
        return false;
      }
    } else if (currentStep === 5) {
      if (!customerName.trim()) {
        setValidationError('অনুগ্রহ করে আপনার নাম লিখুন 😊');
        return false;
      }
    } else if (currentStep === 6) {
      const cleaned = phone.replace(/[^0-9]/g, '');
      if (cleaned.length < 11) {
        setValidationError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx) 😊');
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    setStepDirection('next');
    setCurrentStep((prev) => Math.min(prev + 1, 8));
  };

  const handlePrevStep = () => {
    setValidationError('');
    setStepDirection('prev');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Estimate delivery fee (৳30 - ৳60)
  const calculateEstimatedFee = () => {
    if (!distanceKm) return 40;
    if (distanceKm <= 1.5) return 30;
    if (distanceKm <= 3.0) return 45;
    return 60;
  };

  // Confirm and Submit Order to Firebase Firestore
  const handleConfirmOrder = async () => {
    setIsSubmittingOrder(true);
    setOrderErrorMsg('');

    try {
      const estimatedFee = calculateEstimatedFee();
      const newOrder = await createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        items: items.trim(),
        preferredStore: preferredStore.trim() || 'যেকোনো বিশ্বস্ত দোকান',
        notes: notes.trim() || undefined,
        category: category,
        latitude: gpsCoords?.lat,
        longitude: gpsCoords?.lng,
        accuracyMeters: gpsAccuracy || undefined,
        distanceKm: distanceKm || undefined,
        detectedLocationName: detectedLocationName || undefined,
      });

      setCompletedOrder(newOrder);
      onOrderPlaced(newOrder);
      setIsSubmittingOrder(false);
    } catch (err: any) {
      setIsSubmittingOrder(false);
      setOrderErrorMsg(err.message || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  // Tracking Lookup
  const performTracking = (idToTrack: string) => {
    const cleanId = idToTrack.trim().toUpperCase();
    if (!cleanId) {
      setTrackErrorMsg('অনুগ্রহ করে অর্ডার আইডি প্রদান করুন');
      return;
    }

    setIsTrackingLoading(true);
    setTrackErrorMsg('');

    const unsubscribe = subscribeToOrder(cleanId, (order) => {
      setIsTrackingLoading(false);
      if (order) {
        setTrackedOrder(order);
        setTrackErrorMsg('');
      } else {
        setTrackedOrder(null);
        setTrackErrorMsg('এই আইডির কোনো অর্ডার পাওয়া যায়নি। সঠিক আইডি দিন।');
      }
    });

    return unsubscribe;
  };

  const handleResetOrderForm = () => {
    setCompletedOrder(null);
    setCurrentStep(1);
    setItems('');
    setPreferredStore('');
    setAddress('');
    setNotes('');
    setGpsCoords(null);
    setGpsAccuracy(null);
    setDistanceKm(null);
    setIsGpsConfirmed(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      {/* Top Liquid Glass Navigation Switcher (Order / Track) */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1.5 rounded-2xl bg-white/70 dark:bg-[#0B2233]/80 backdrop-blur-2xl border border-white/80 dark:border-cyan-500/30 shadow-[0_8px_30px_rgba(15,39,59,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <button
            type="button"
            onClick={() => onTabChange('order')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'order'
                ? 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white shadow-[0_4px_20px_rgba(2,132,199,0.4)] scale-100'
                : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>নতুন অর্ডার</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('track')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
              activeTab === 'track'
                ? 'bg-gradient-to-r from-[#C69A45] to-[#d6a952] text-[#061522] shadow-[0_4px_20px_rgba(198,154,69,0.35)] scale-100'
                : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>অর্ডার ট্র্যাকিং</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: ORDER WIZARD OR LIVE TRACKING */}
      {activeTab === 'order' ? (
        <div className="relative">
          {/* Order Completed Success Card with Character Celebration */}
          {completedOrder ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 sm:p-10 rounded-3xl bg-white/90 dark:bg-[#0B2233]/90 backdrop-blur-2xl border border-emerald-400/40 shadow-2xl text-center"
            >
              <CharacterCelebrationRider className="mx-auto mb-4" />

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400/40 text-emerald-600 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>অর্ডার সফলভাবে গ্রহণ করা হয়েছে!</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif mb-2">
                ধন্যবাদ, {completedOrder.customerName}!
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-white/75 max-w-lg mx-auto mb-6">
                আপনার অর্ডারটি রাইডারের কাছে পৌঁছেছে। রাইডার শীঘ্রই পণ্য সংগ্রহ করে আপনার ঠিকানায় রওনা দেবে।
              </p>

              {/* Order ID Box */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-[#061522]/80 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 mb-6">
                <div className="text-left">
                  <span className="text-[11px] text-slate-500 dark:text-white/50 block">আপনার অর্ডার আইডি:</span>
                  <span className="font-mono text-base sm:text-lg font-bold text-[#0284c7] dark:text-cyan-300">
                    {completedOrder.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(completedOrder.id);
                    setCopiedId(true);
                    setTimeout(() => setCopiedId(false), 2000);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onTabChange('track');
                    setSearchTrackId(completedOrder.id);
                    performTracking(completedOrder.id);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#C69A45] to-[#d6a952] hover:from-[#d6a952] hover:to-[#e5b962] text-[#061522] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform hover:scale-105"
                >
                  <Search className="w-4 h-4" />
                  <span>লাইভ ট্র্যাক করুন</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetOrderForm}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold text-sm cursor-pointer transition-colors"
                >
                  আরেকটি অর্ডার করুন
                </button>
              </div>
            </motion.div>
          ) : (
            /* Multi-Step Wizard Container */
            <div className="rounded-3xl bg-white/85 dark:bg-[#0B2233]/85 backdrop-blur-2xl border border-white/90 dark:border-white/10 shadow-[0_16px_50px_rgba(15,39,59,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)] p-5 sm:p-8">
              {/* Step Progress Bar & Count */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-white/70 mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse" />
                    {currentStep === 8 ? 'ধাপ ৮: অর্ডার সামারি' : `ধাপ ${currentStep} / ৭`}
                  </span>
                  <span className="text-slate-500 dark:text-white/50">
                    {Math.round((currentStep / 8) * 100)}% সম্পন্ন
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#C69A45]"
                    initial={{ width: '12%' }}
                    animate={{ width: `${(currentStep / 8) * 100}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>

                {/* Step Circles for Desktop */}
                <div className="hidden sm:flex items-center justify-between mt-3 px-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <div
                      key={s}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        s === currentStep
                          ? 'bg-[#0284c7] text-white scale-110 shadow-md ring-2 ring-cyan-400/40'
                          : s < currentStep
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/40'
                      }`}
                    >
                      {s < currentStep ? '✓' : s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Step View with Smooth Transitions */}
              <div className="min-h-[280px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {/* STEP 1: WHAT DO YOU NEED? */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: stepDirection === 'next' ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection === 'next' ? -30 : 30 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <CharacterPackageCarrier className="w-12 h-14 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">
                            আপনার কী দরকার?
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                            প্রয়োজনীয় পণ্য বা কেনাকাটার তালিকা বিস্তারিত লিখুন
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          id="order-items-input"
                          rows={3}
                          value={items}
                          onChange={(e) => {
                            setItems(e.target.value);
                            if (validationError) setValidationError('');
                          }}
                          placeholder="যেমন: ১ পাতা নাপা এক্সটেন্ড, ১ লিটার দুধ, ১ ডজন কলা, ইত্যাদি..."
                          className="w-full p-4 pr-14 rounded-2xl bg-slate-50 dark:bg-[#061522]/90 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-cyan-500/20 text-sm leading-relaxed"
                          autoFocus
                        />

                        {/* Voice Order Button */}
                        <button
                          type="button"
                          onClick={handleVoiceOrderToggle}
                          className={`absolute right-3 top-3 p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
                            isListeningVoice
                              ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-300 dark:ring-rose-900'
                              : 'bg-white dark:bg-[#0B2233] hover:bg-sky-50 dark:hover:bg-cyan-950 border border-sky-200 dark:border-cyan-500/40 text-[#0284c7] dark:text-cyan-300'
                          }`}
                          title={isListeningVoice ? 'ভয়েস গ্রহণ থামান' : 'মুখে বলে অর্ডার দিন (ভয়েস অর্ডার)'}
                        >
                          {isListeningVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                      </div>

                      {isListeningVoice && (
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          <span>শুনছি... আপনার প্রয়োজনীয় জিনিস বা পণ্যের নাম স্পষ্ট করে বলুন।</span>
                        </div>
                      )}

                      {/* Quick Chips */}
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 block mb-2">
                          💡 দ্রুত পছন্দের উদাহরণ (ক্লিক করুন):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {quickSuggestions.map((sug, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setItems((prev) => (prev ? `${prev}, ${sug}` : sug));
                                if (validationError) setValidationError('');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 text-xs font-medium transition-all hover:scale-105 cursor-pointer text-left"
                            >
                              + {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: PREFERRED STORE */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: stepDirection === 'next' ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection === 'next' ? -30 : 30 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <CharacterShoppingHelper className="w-12 h-14 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">
                            কোথা থেকে আনতে হবে?
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                            নির্দিষ্ট কোনো দোকান বা বাজারের নাম থাকলে উল্লেখ করুন (ঐচ্ছিক)
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <Store className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-white/40" />
                        <input
                          type="text"
                          value={preferredStore}
                          onChange={(e) => setPreferredStore(e.target.value)}
                          placeholder="যেমন: মির্জাপুর বাজার, ভাই ভাই ফার্মেসি, অথবা যেকোনো ভালো দোকান"
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#061522]/90 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-cyan-500/20 text-sm"
                          autoFocus
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 text-xs text-cyan-800 dark:text-cyan-200 flex items-center gap-2.5">
                        <Info className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                        <span>দোকানের নাম নির্দিষ্ট না করলেও সমস্যা নেই, রাইডার এলাকার সেরা দোকান থেকে সংগ্রহ করবে।</span>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: CURRENT GPS LOCATION */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: stepDirection === 'next' ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection === 'next' ? -30 : 30 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <CharacterGpsHelper className="w-12 h-14 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">
                            আপনার বর্তমান লোকেশন
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                            রিয়েল-টাইম GPS দিয়ে দ্রুততম ডেলিভারি নিশ্চিত করুন
                          </p>
                        </div>
                      </div>

                      {/* GPS Action Trigger Button */}
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isLocating}
                        className={`w-full p-4 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isGpsConfirmed
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-800 dark:text-emerald-200 shadow-md'
                            : locationError
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-600 text-amber-900 dark:text-amber-200 shadow-sm'
                            : 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white border-transparent shadow-lg hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            {isLocating ? (
                              <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                              <Navigation className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-sm block">
                              {isLocating
                                ? '📍 অবস্থান খোঁজা হচ্ছে...'
                                : isGpsConfirmed
                                ? '✓ অবস্থান পাওয়া গেছে'
                                : locationError
                                ? '⚠ অবস্থান পাওয়া যায়নি (পুনরায় চেষ্টা করুন)'
                                : '📍 আমার বর্তমান অবস্থান'}
                            </span>
                            <span className="text-[11px] opacity-80">
                              {isGpsConfirmed && detectedLocationName
                                ? detectedLocationName
                                : isLocating
                                ? 'ব্রাউজার থেকে স্যাটেলাইট লোকেশন রিড করা হচ্ছে...'
                                : locationError
                                ? 'ক্লিক করে আবার চেষ্টা করুন অথবা পরের ধাপে ঠিকানা লিখুন'
                                : 'এক ক্লিকে সঠিক ম্যাপ পিন ও দূরত্ব হিসেব'}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 flex-shrink-0">
                          {isLocating ? 'অপেক্ষা করুন...' : isGpsConfirmed ? 'আপডেট করুন' : 'ট্যাপ করুন'}
                        </span>
                      </button>

                      {locationError && (
                        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
                          <div className="flex items-center gap-2 font-semibold">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                            <span>{locationError}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-white/70 pl-6">
                            কোনো সমস্যা নেই! নিচের &quot;পরবর্তী ধাপ&quot; বাটনে ক্লিক করে বাড়ি নম্বর, রোড বা পরিচিত ল্যান্ডমার্ক লিখে অর্ডার সম্পন্ন করতে পারেন।
                          </p>
                        </div>
                      )}

                      {isGpsConfirmed && gpsCoords && (
                        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                          <GpsMapErrorBoundary>
                            <InteractiveGpsMap
                              latitude={gpsCoords.lat}
                              longitude={gpsCoords.lng}
                              customerCoords={gpsCoords}
                              accuracyMeters={gpsAccuracy || 20}
                              distanceKm={distanceKm || 1.2}
                              customerName={customerName || 'আপনার অবস্থান'}
                              address={detectedLocationName || address}
                              isLiveTracking={false}
                              onRetry={handleDetectLocation}
                            />
                          </GpsMapErrorBoundary>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 4: DELIVERY ADDRESS / LANDMARK */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: stepDirection === 'next' ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection === 'next' ? -30 : 30 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <CharacterCustomerHelper className="w-12 h-14 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">
                            কোথায় পৌঁছে দিতে হবে?
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                            বাড়ি নং, রোড, পরিচিত ল্যান্ডমার্ক বা তলা উল্লেখ করুন
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-white/40" />
                        <textarea
                          rows={3}
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            if (validationError) setValidationError('');
                          }}
                          placeholder="যেমন: মির্জাপুর উত্তরপাড়া, জামে মসজিদের পাশের লাল ৩ তলা বাড়ি, ২য় তলা"
                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#061522]/90 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-cyan-500/20 text-sm leading-relaxed"
                          autoFocus
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 5: CUSTOMER NAME */}
                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: stepDirection === 'next' ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection === 'next' ? -30 : 30 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <CharacterPackageCarrier className="w-12 h-14 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">
                            আপনার নাম
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                            ডেলিভারি মেমোতে আপনার নামটি ব্যবহৃত হবে
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <User className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-white/40" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => {
                            setCustomerName(e.target.value);
                            if (validationError) setValidationError('');
                          }}
                          placeholder="যেমন: তানভীর আহমেদ"
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#061522]/90 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-cyan-500/20 text-sm"
                          autoFocus
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 6: PHONE NUMBER */}
                  {currentStep === 6 && (
                    <motion.div
                      key="step6"
                      initial={{ opacity: 0, x: stepDirection === 'next' ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection === 'next' ? -30 : 30 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <CharacterWithPhone className="w-12 h-14 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">
                            মোবাইল নম্বর
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                            রাইডার ডেলিভারির পূর্বে এই নম্বরে যোগাযোগ করবে
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-white/40" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (validationError) setValidationError('');
                          }}
                          placeholder="01XXXXXXXXX"
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#061522]/90 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-cyan-500/20 text-sm font-mono"
                          autoFocus
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 7: ADDITIONAL INSTRUCTIONS */}
                  {currentStep === 7 && (
                    <motion.div
                      key="step7"
                      initial={{ opacity: 0, x: stepDirection === 'next' ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection === 'next' ? -30 : 30 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <CharacterShoppingHelper className="w-12 h-14 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">
                            অতিরিক্ত নির্দেশনা (ঐচ্ছিক)
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                            জরুরি ডেলিভারি বা বিশেষ কোনো বার্তা থাকলে লিখে দিন
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <Edit3 className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-white/40" />
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="যেমন: গেটের কলিং বেল বাজাবেন, অথবা কল দিয়ে নিচে নামতে বলবেন..."
                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#061522]/90 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-cyan-500/20 text-sm leading-relaxed"
                          autoFocus
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 8: ORDER SUMMARY & CONFIRMATION */}
                  {currentStep === 8 && (
                    <motion.div
                      key="step8"
                      initial={{ opacity: 0, x: stepDirection === 'next' ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: stepDirection === 'next' ? -30 : 30 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">
                            অর্ডার সামারি যাচাই করুন
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-white/60">
                            সবকিছু ঠিক থাকলে 'অর্ডার নিশ্চিত করুন' বাটনে চাপুন
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                          ক্যাশ অন ডেলিভারি
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#061522]/70 border border-slate-200 dark:border-white/10">
                          <span className="text-slate-500 dark:text-white/50 block font-semibold mb-1">কী লাগবে:</span>
                          <p className="font-bold text-slate-900 dark:text-white">{items}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#061522]/70 border border-slate-200 dark:border-white/10">
                          <span className="text-slate-500 dark:text-white/50 block font-semibold mb-1">দোকান / উৎস:</span>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {preferredStore || 'যেকোনো ভালো দোকান'}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#061522]/70 border border-slate-200 dark:border-white/10">
                          <span className="text-slate-500 dark:text-white/50 block font-semibold mb-1">ডেলিভারি ঠিকানা:</span>
                          <p className="font-bold text-slate-900 dark:text-white">{address}</p>
                          {gpsCoords && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block mt-1">
                              ✓ GPS পিন সংযুক্ত ({gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)})
                            </span>
                          )}
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#061522]/70 border border-slate-200 dark:border-white/10">
                          <span className="text-slate-500 dark:text-white/50 block font-semibold mb-1">কাস্টমার তথ্য:</span>
                          <p className="font-bold text-slate-900 dark:text-white">{customerName}</p>
                          <p className="font-mono text-slate-600 dark:text-white/80">{phone}</p>
                        </div>
                      </div>

                      {/* Delivery Charge Calculation Box */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 dark:from-[#0B2233] dark:via-[#061522] dark:to-[#0B2233] border border-[#C69A45]/40 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-600 dark:text-white/70 block">আনুমানিক ডেলিভারি চার্জ:</span>
                          <span className="text-[11px] text-slate-500 dark:text-white/50">
                            (দূরত্ব অনুযায়ী সর্বোচ্চ ৳৬০ টাকা মাত্র)
                          </span>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold font-mono text-[#0F273B] dark:text-[#C69A45]">
                          ৳{calculateEstimatedFee()}
                        </span>
                      </div>

                      {orderErrorMsg && (
                        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-200 text-xs">
                          {orderErrorMsg}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Friendly Inline Validation Message */}
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{validationError}</span>
                  </motion.div>
                )}

                {/* Wizard Navigation Action Buttons (Back / Next / Confirm) */}
                <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>পিছনে</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 8 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
                    >
                      <span>পরবর্তী</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConfirmOrder}
                      disabled={isSubmittingOrder}
                      className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#C69A45] to-[#d6a952] hover:from-[#d6a952] hover:to-[#e5b962] text-[#061522] text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xl transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      {isSubmittingOrder ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{isSubmittingOrder ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার নিশ্চিত করুন'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* LIVE ORDER TRACKING PANEL */
        <div className="rounded-3xl bg-white/85 dark:bg-[#0B2233]/85 backdrop-blur-2xl border border-white/90 dark:border-white/10 shadow-[0_16px_50px_rgba(15,39,59,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)] p-5 sm:p-8">
          <div className="max-w-xl mx-auto space-y-5">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif mb-1">
                অর্ডার লাইভ ট্র্যাকিং
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                আপনার অর্ডারের সঠিক অগ্রগতি ও রাইডারের অবস্থান সরাসরি দেখুন
              </p>
            </div>

            {/* Tracking Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 dark:text-white/40" />
                <input
                  type="text"
                  value={searchTrackId}
                  onChange={(e) => setSearchTrackId(e.target.value.toUpperCase())}
                  placeholder="অর্ডার আইডি লিখুন (যেমন: DKR-XXXXXX)"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#061522]/90 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 font-mono text-sm uppercase focus:outline-none focus:border-[#C69A45]"
                />
              </div>

              <button
                type="button"
                onClick={() => performTracking(searchTrackId)}
                disabled={isTrackingLoading}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#C69A45] to-[#d6a952] hover:from-[#d6a952] hover:to-[#e5b962] text-[#061522] font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
              >
                {isTrackingLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>খুঁজুন</span>
              </button>
            </div>

            {/* Recent Orders Chips */}
            {savedOrderIds.length > 0 && !trackedOrder && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#061522]/60 border border-slate-200 dark:border-white/10">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-white/50 block mb-2">
                  🕒 আপনার সাম্প্রতিক অর্ডারগুলো:
                </span>
                <div className="flex flex-wrap gap-2">
                  {savedOrderIds.slice(0, 4).map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setSearchTrackId(id);
                        performTracking(id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-[#0284c7] dark:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/15 transition-colors cursor-pointer"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {trackErrorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-200 text-xs text-center font-medium">
                {trackErrorMsg}
              </div>
            )}

            {/* TRACKED ORDER DETAILS */}
            {trackedOrder && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 pt-2 border-t border-slate-200 dark:border-white/10"
              >
                {/* Status Progress Pipeline */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#061522]/80 border border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-white/50 block">অর্ডার আইডি:</span>
                      <span className="font-mono text-base font-bold text-[#0284c7] dark:text-cyan-300">
                        {trackedOrder.id}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-400/40 text-cyan-800 dark:text-cyan-300 text-xs font-bold">
                      {trackedOrder.status}
                    </span>
                  </div>

                  {/* Progress Step Icons */}
                  <div className="relative py-2">
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-white/10 -translate-y-1/2" />
                    <div
                      className="absolute top-1/2 left-4 h-1 bg-[#C69A45] -translate-y-1/2 transition-all duration-500"
                      style={{
                        width: `${(getStatusStepIndex(trackedOrder.status) / (STATUS_STEPS.length - 1)) * 100}%`,
                      }}
                    />

                    <div className="relative z-10 flex justify-between">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= getStatusStepIndex(trackedOrder.status);
                        const isCurrent = idx === getStatusStepIndex(trackedOrder.status);
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                isCurrent
                                  ? 'bg-[#C69A45] text-[#061522] scale-110 shadow-lg ring-4 ring-[#C69A45]/30'
                                  : isDone
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-white/30'
                              }`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                                isCurrent
                                  ? 'text-slate-900 dark:text-white font-bold'
                                  : 'text-slate-400 dark:text-white/40'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Assigned Rider Info Card */}
                {trackedOrder.assignedRiderName ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-[#0B2233] dark:to-[#061522] border border-cyan-400/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center font-bold">
                        🏍️
                      </div>
                      <div>
                        <span className="text-[11px] text-cyan-800 dark:text-cyan-300 font-semibold block">
                          দায়িত্বপ্রাপ্ত রাইডার:
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {trackedOrder.assignedRiderName}
                        </span>
                      </div>
                    </div>

                    {trackedOrder.assignedRiderPhone && (
                      <a
                        href={`tel:${trackedOrder.assignedRiderPhone}`}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>কল করুন</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>নিকটস্থ রাইডার নির্ধারণ করা হচ্ছে... অল্প কিছুক্ষণ অপেক্ষা করুন।</span>
                  </div>
                )}

                {/* Real GPS Map Visual */}
                {trackedOrder.gpsCoordinates && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                    <GpsMapErrorBoundary>
                      <InteractiveGpsMap
                        latitude={trackedOrder.gpsCoordinates.lat}
                        longitude={trackedOrder.gpsCoordinates.lng}
                        customerCoords={trackedOrder.gpsCoordinates}
                        riderCoords={trackedOrder.riderCoordinates}
                        accuracyMeters={trackedOrder.gpsAccuracy || 20}
                        distanceKm={trackedOrder.distanceKm || 1.2}
                        customerName={trackedOrder.customerName}
                        address={trackedOrder.address}
                        isLiveTracking={true}
                      />
                    </GpsMapErrorBoundary>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
