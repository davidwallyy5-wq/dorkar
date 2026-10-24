import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bike,
  KeyRound,
  LogIn,
  LogOut,
  MapPin,
  Phone,
  CheckCircle2,
  Package,
  Calendar,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  EyeOff,
  Bell,
  Check,
  Search,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Truck,
  DollarSign,
  User,
  Hash,
} from 'lucide-react';
import { Order, OrderStatus, Rider } from '../types';
import {
  loginRiderWithPin,
  getRiderSavedSession,
  clearRiderSession,
  subscribeToRiderOrders,
  updateRiderOrderStatus,
} from '../services/riderService';
import { registerDeviceForNotifications, getNotificationPermissionStatus } from '../services/notificationService';

interface RiderPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const RiderPortal: React.FC<RiderPortalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
}) => {
  // Authentication State
  const [currentRider, setCurrentRider] = useState<Rider | null>(null);
  const [riderIdentifier, setRiderIdentifier] = useState('');
  const [riderPin, setRiderPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification status
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    getNotificationPermissionStatus()
  );
  const [isEnablingPush, setIsEnablingPush] = useState(false);
  const [pushStatusMsg, setPushStatusMsg] = useState('');

  // Orders State
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved rider session on mount
  useEffect(() => {
    const saved = getRiderSavedSession();
    if (saved && saved.id) {
      setCurrentRider(saved);
    }
  }, []);

  // Update notification permission state
  useEffect(() => {
    setNotificationPermission(getNotificationPermissionStatus());
  }, [isOpen]);

  // Subscribe to rider orders when logged in
  useEffect(() => {
    if (!currentRider) {
      setAssignedOrders([]);
      return;
    }

    setIsLoadingOrders(true);
    const unsubscribe = subscribeToRiderOrders(
      currentRider.id,
      currentRider.phone,
      (orders) => {
        setAssignedOrders(orders);
        setIsLoadingOrders(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentRider]);

  // Handle Rider Login with PIN
  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      const rider = await loginRiderWithPin(riderIdentifier, riderPin);
      setCurrentRider(rider);
      setLoginError('');
      // Auto register for notifications if permission already granted
      if (Notification.permission === 'granted') {
        registerDeviceForNotifications('rider', rider.id);
      }
    } catch (err: any) {
      console.error('Rider login failed:', err);
      setLoginError(err.message || 'লগইন ব্যর্থ হয়েছে। আইডি ও পিন পরীক্ষা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    clearRiderSession();
    setCurrentRider(null);
    setRiderIdentifier('');
    setRiderPin('');
    setLoginError('');
  };

  // Handle Order Status Transition
  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    if (!currentRider) return;
    setUpdatingOrderId(orderId);
    setStatusFeedback('');

    try {
      await updateRiderOrderStatus(orderId, newStatus, currentRider.name);
      setStatusFeedback(`✓ অর্ডার #${orderId} স্ট্যাটাস সফলভাবে '${newStatus}' করা হয়েছে!`);
      setTimeout(() => setStatusFeedback(''), 4000);
    } catch (err) {
      console.error('Failed to update status by rider:', err);
      setStatusFeedback('স্ট্যাটাস আপডেট ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Handle Push Notification Activation
  const handleEnablePush = async () => {
    if (!currentRider) return;
    setIsEnablingPush(true);
    setPushStatusMsg('');

    try {
      const res = await registerDeviceForNotifications('rider', currentRider.id);
      setNotificationPermission(res.permission);
      if (res.success) {
        setPushStatusMsg('✓ পুশ নোটিফিকেশন সফলভাবে চালু হয়েছে! নতুন অর্ডারে আপনি তাৎক্ষণিক নোটিফিকেশন পাবেন।');
      } else {
        setPushStatusMsg(res.error || 'নোটিফিকেশন চালু করা যায়নি।');
      }
    } catch (e: any) {
      setPushStatusMsg(e.message || 'সমস্যা হয়েছে।');
    } finally {
      setIsEnablingPush(false);
      setTimeout(() => setPushStatusMsg(''), 5000);
    }
  };

  // Filter orders
  const activeOrders = assignedOrders.filter(
    (o) => o.status !== 'সম্পন্ন' && o.status !== 'ডেলিভারি সম্পন্ন' && o.status !== 'বাতিল'
  );
  const completedOrders = assignedOrders.filter(
    (o) => o.status === 'সম্পন্ন' || o.status === 'ডেলিভারি সম্পন্ন'
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : completedOrders;

  const filteredOrders = displayedOrders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.address.toLowerCase().includes(q) ||
      o.items.toLowerCase().includes(q)
    );
  });

  const totalEarnings = completedOrders.length * 60;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl bg-white dark:bg-[#061522] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0F273B] to-[#061522] text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#0ea5e9] flex items-center justify-center shadow-md">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif text-white tracking-wide">
                  দরকার রাইডার পোর্টাল
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">
                  RIDER APP
                </span>
              </div>
              <p className="text-xs text-white/60">
                {currentRider
                  ? `${currentRider.name} (${currentRider.id})`
                  : 'রাইডার আইডি ও পিন দিয়ে লগইন করুন'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentRider && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!currentRider ? (
            /* ============================================================ */
            /* 1. RIDER LOGIN FORM (NO FIREBASE AUTH - ID/PHONE + PIN)     */
            /* ============================================================ */
            <div className="max-w-md mx-auto py-6 sm:py-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-500/20">
                  <Bike className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2">
                  রাইডার লগইন
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60">
                  মালিক/অ্যাডমিন কর্তৃক প্রদত্ত আপনার <span className="font-semibold text-[#0284c7] dark:text-cyan-400">রাইডার আইডি বা ফোন নম্বর</span> এবং <span className="font-semibold text-[#0284c7] dark:text-cyan-400">৪-ডিজিট পিন</span> দিন।
                </p>
              </div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-200 text-xs font-semibold flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </motion.div>
              )}

              <form onSubmit={handlePinLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider mb-2">
                    রাইডার আইডি অথবা মোবাইল নম্বর
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={riderIdentifier}
                      onChange={(e) => setRiderIdentifier(e.target.value)}
                      placeholder="যেমন: RID-1024 অথবা 017XXXXXXXX"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-cyan-500/20 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider mb-2">
                    ৪-ডিজিট সিক্রেট পিন (PIN)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      maxLength={8}
                      value={riderPin}
                      onChange={(e) => setRiderPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="৪ ডিজিট পিন (যেমন: 5832)"
                      className="w-full pl-11 pr-12 py-3 rounded-2xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-cyan-500/20 text-sm font-mono tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer p-1"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white font-bold text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>যাচাই করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>লগইন করুন</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>রাইডার অ্যাকাউন্ট নেই?</span>
                </div>
                <p className="leading-relaxed">
                  নতুন রাইডার যুক্ত হওয়ার জন্য দরকার-এর অ্যাডমিন বা ওনারের সাথে যোগাযোগ করুন। ওনার প্যানেল থেকে রাইডার আইডি ও পিন দেওয়া হবে।
                </p>
                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="mt-2 text-xs text-[#0284c7] dark:text-cyan-400 underline font-semibold cursor-pointer"
                  >
                    মালিক/অ্যাডমিন প্যানেল খুলুন →
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* 2. RIDER ACTIVE DASHBOARD                                    */
            /* ============================================================ */
            <div className="space-y-6">
              {/* Feedback Banner */}
              {statusFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{statusFeedback}</span>
                </motion.div>
              )}

              {/* Push Status Banner */}
              {pushStatusMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 text-cyan-800 dark:text-cyan-200 text-xs font-semibold"
                >
                  {pushStatusMsg}
                </motion.div>
              )}

              {/* Rider Profile Card & Notification Setup */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rider Info Card */}
                <div className="md:col-span-2 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#0ea5e9] flex items-center justify-center text-white font-bold text-lg shadow-md">
                      <Bike className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {currentRider.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          সক্রিয় রাইডার
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-white/60 mt-1 font-mono">
                        <span>আইডি: <strong className="text-slate-900 dark:text-white">{currentRider.id}</strong></span>
                        <span>•</span>
                        <span>ফোন: {currentRider.phone}</span>
                        <span>•</span>
                        <span>বাহন: {currentRider.vehicleType || 'মোটরসাইকেল'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-white/10">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 dark:text-white/50 block">মোট ডেলিভারি</span>
                      <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {completedOrders.length} টি
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notification Setup Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0B2233] to-[#061522] border border-cyan-500/30 text-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1">
                      <Bell className="w-4 h-4 animate-bounce" />
                      <span>পুশ নোটিফিকেশন</span>
                    </div>
                    <p className="text-[11px] text-white/70 leading-relaxed">
                      নতুন কোনো ডেলিভারি অ্যাসাইন হলে তৎক্ষণাৎ ফোনে নোটিফিকেশন পেতে চালু রাখুন।
                    </p>
                  </div>
                  <div className="mt-3">
                    {notificationPermission === 'granted' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>নোটিফিকেশন সক্রিয় আছে</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleEnablePush}
                        disabled={isEnablingPush}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md cursor-pointer transition-transform hover:scale-105 flex items-center justify-center gap-1.5"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>{isEnablingPush ? 'চালু হচ্ছে...' : 'নোটিফিকেশন চালু করুন'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Tabs & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                      activeTab === 'active'
                        ? 'bg-[#0284c7] text-white shadow-md'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-200'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>চলমান অর্ডার ({activeOrders.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('completed')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                      activeTab === 'completed'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>সম্পন্ন ডেলিভারি ({completedOrders.length})</span>
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="অর্ডার, কাস্টমার বা ঠিকানা..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0284c7]"
                  />
                </div>
              </div>

              {/* Order List */}
              {isLoadingOrders ? (
                <div className="py-12 text-center text-slate-500 dark:text-white/50">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0284c7]" />
                  <p className="text-xs">অর্ডার তালিকা লোড হচ্ছে...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-12 text-center rounded-3xl bg-slate-50 dark:bg-[#0B2233]/40 border border-dashed border-slate-200 dark:border-white/10 p-6">
                  <Package className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
                  <h5 className="font-bold text-slate-700 dark:text-white/80 text-sm mb-1">
                    {activeTab === 'active'
                      ? 'বর্তমানে আপনার কোনো চলমান ডেলিভারি নেই'
                      : 'কোনো সম্পন্ন ডেলিভারি পাওয়া যায়নি'}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-white/50 max-w-sm mx-auto">
                    {activeTab === 'active'
                      ? 'অ্যাডমিন নতুন অর্ডার অ্যাসাইন করলে এখানে প্রদর্শিত হবে এবং আপনার ফোনে বেল বাজবে।'
                      : 'আপনার সম্পন্ন করা সব ডেলিভারির রেকর্ড এখানে সংরক্ষিত থাকবে।'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const isUpdating = updatingOrderId === order.id;

                    return (
                      <div
                        key={order.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B2233] border border-slate-200 dark:border-white/10 shadow-md hover:shadow-lg transition-shadow"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#0284c7] dark:text-cyan-400">
                              #{order.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 border border-amber-400/40 text-amber-800 dark:text-amber-300">
                              {order.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-white/50 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {order.createdAt}
                          </span>
                        </div>

                        {/* Customer & Location Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#061522]/60 border border-slate-100 dark:border-white/5 space-y-1.5">
                            <span className="text-slate-500 dark:text-white/50 block font-semibold">কাস্টমার তথ্য:</span>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">
                              {order.customerName}
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <a
                                href={`tel:${order.phone}`}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>{order.phone}</span>
                              </a>
                              <a
                                href={`https://wa.me/88${order.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#061522]/60 border border-slate-100 dark:border-white/5 space-y-1.5">
                            <span className="text-slate-500 dark:text-white/50 block font-semibold">ডেলিভারি ঠিকানা:</span>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {order.address}
                            </p>
                            {order.latitude && order.longitude && (
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-[#0284c7] dark:text-cyan-400 underline font-bold mt-1"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Google Maps এ রুট দেখুন →</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Items to buy & Store */}
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#061522]/60 border border-slate-100 dark:border-white/5 mb-4 text-xs">
                          <span className="text-slate-500 dark:text-white/50 block font-semibold mb-1">
                            কী কী জিনিস আনতে হবে:
                          </span>
                          <p className="font-bold text-slate-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                            {order.items}
                          </p>
                          {order.preferredStore && (
                            <p className="text-slate-600 dark:text-white/70 mt-1">
                              <strong>দোকান:</strong> {order.preferredStore}
                            </p>
                          )}
                          {order.notes && (
                            <p className="text-amber-700 dark:text-amber-300 mt-1 font-semibold">
                              <strong>বিশেষ নোট:</strong> {order.notes}
                            </p>
                          )}
                        </div>

                        {/* Order Fee & Status Action Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 dark:text-white/60">ডেলিভারি ফি:</span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                              ৳{order.deliveryCharge || 60} (ক্যাশ)
                            </span>
                          </div>

                          {/* Quick Step Buttons for Active Orders */}
                          {activeTab === 'active' && (
                            <div className="flex flex-wrap items-center gap-2">
                              {order.status === 'অর্ডার গ্রহণ করা হয়েছে' && (
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleStatusUpdate(order.id, 'জিনিস কিনছি')}
                                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#061522] text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition-transform hover:scale-105 disabled:opacity-50"
                                >
                                  {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                                  <span>🛒 জিনিস কিনছি</span>
                                </button>
                              )}

                              {(order.status === 'জিনিস কেনা হচ্ছে' || order.status === 'জিনিস কিনছি') && (
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleStatusUpdate(order.id, 'ডেলিভারির পথে')}
                                  className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition-transform hover:scale-105 disabled:opacity-50"
                                >
                                  {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                                  <span>🏍️ ডেলিভারির পথে রওনা হলাম</span>
                                </button>
                              )}

                              {order.status === 'ডেলিভারির পথে' && (
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleStatusUpdate(order.id, 'ডেলিভারি সম্পন্ন')}
                                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer transition-transform hover:scale-105 disabled:opacity-50"
                                >
                                  {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                  <span>✓ ডেলিভারি সম্পন্ন হয়েছে</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
