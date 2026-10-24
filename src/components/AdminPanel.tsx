import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  Package,
  Search,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Lock,
  Bike,
  UserPlus,
  Trash2,
  Power,
  DollarSign,
  XCircle,
  Copy,
  Check,
  Key,
  Eye,
  EyeOff,
  Send,
  Bell,
  Edit2,
  AlertCircle,
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';
import { Order, Rider, AppNotification } from '../types';
import {
  subscribeToAllOrders,
} from '../services/orderService';
import { GpsLocationModal } from './GpsLocationModal';
import {
  determineUserRole,
  subscribeToAllRiders,
  createRider,
  updateRider,
  resetRiderPin,
  toggleRiderActive,
  deleteRider,
  assignOrderToRider,
  acceptOrder,
  rejectOrder,
  generateRiderId,
  generateRiderPin,
} from '../services/riderService';
import {
  registerDeviceForNotifications,
  getNotificationPermissionStatus,
  subscribeToNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../services/notificationService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRiderPortal?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onOpenRiderPortal,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [roleError, setRoleError] = useState('');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active view tab
  const [currentTab, setCurrentTab] = useState<'orders' | 'riders'>('orders');

  // Push Notifications state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    getNotificationPermissionStatus()
  );
  const [isEnablingPush, setIsEnablingPush] = useState(false);
  const [pushStatusMsg, setPushStatusMsg] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState('');
  const [selectedLocationOrder, setSelectedLocationOrder] = useState<Order | null>(null);

  // Riders state
  const [riders, setRiders] = useState<Rider[]>([]);
  const [isAddRiderModalOpen, setIsAddRiderModalOpen] = useState(false);
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [newRiderId, setNewRiderId] = useState(generateRiderId());
  const [newRiderPin, setNewRiderPin] = useState(generateRiderPin());
  const [newRiderActive, setNewRiderActive] = useState(true);
  const [newRiderVehicle, setNewRiderVehicle] = useState<'মোটরসাইকেল' | 'বাইসাইকেল' | 'হাঁটা' | 'সিএনজি/অন্যান্য'>('মোটরসাইকেল');
  const [newRiderNid, setNewRiderNid] = useState('');
  const [newRiderNotes, setNewRiderNotes] = useState('');
  const [addRiderError, setAddRiderError] = useState('');
  const [isAddingRider, setIsAddingRider] = useState(false);
  const [createdRiderSuccess, setCreatedRiderSuccess] = useState<Rider | null>(null);

  // Rider deletion modal
  const [riderToDelete, setRiderToDelete] = useState<Rider | null>(null);
  const [deleteRiderError, setDeleteRiderError] = useState('');
  const [isDeletingRider, setIsDeletingRider] = useState(false);

  // Edit Rider Modal
  const [editingRider, setEditingRider] = useState<Rider | null>(null);
  const [editRiderName, setEditRiderName] = useState('');
  const [editRiderPhone, setEditRiderPhone] = useState('');
  const [editRiderVehicle, setEditRiderVehicle] = useState<'মোটরসাইকেল' | 'বাইসাইকেল' | 'হাঁটা' | 'সিএনজি/অন্যান্য'>('মোটরসাইকেল');
  const [editRiderNotes, setEditRiderNotes] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Reset PIN modal
  const [resetPinRider, setResetPinRider] = useState<Rider | null>(null);
  const [newGeneratedPin, setNewGeneratedPin] = useState('');
  const [isResettingPin, setIsResettingPin] = useState(false);

  // Assign Rider Modal
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);
  const [selectedRiderIdForAssign, setSelectedRiderIdForAssign] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Rejection modal
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Copy tracking state
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [visiblePins, setVisiblePins] = useState<{ [riderId: string]: boolean }>({});

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const togglePinVisibility = (riderId: string) => {
    setVisiblePins((prev) => ({
      ...prev,
      [riderId]: !prev[riderId],
    }));
  };

  // Track auth state & verify admin role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setRoleError('');

      if (currentUser) {
        try {
          const roleResult = await determineUserRole(
            currentUser.email,
            currentUser.uid
          );
          if (roleResult.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            setRoleError(
              'এই ইমেইল অ্যাকাউন্টে অ্যাডমিন পারমিশন নেই। সঠিক ওনার ইমেইল (davidwallyy5@gmail.com) দিয়ে লগইন করুন।'
            );
          }
        } catch (e) {
          console.error('Role check error:', e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update notification permission state
  useEffect(() => {
    setNotificationPermission(getNotificationPermissionStatus());
  }, [isOpen]);

  // Subscribe to real-time orders, riders, and notifications when admin is logged in
  useEffect(() => {
    if (!isAdmin) {
      setOrders([]);
      setRiders([]);
      setNotifications([]);
      return;
    }

    const unsubOrders = subscribeToAllOrders((allOrders) => {
      setOrders(allOrders);
    });

    const unsubRiders = subscribeToAllRiders((allRiders) => {
      setRiders(allRiders);
    });

    const unsubNotifications = subscribeToNotifications('owner', undefined, (allNotifs) => {
      setNotifications(allNotifs);
    });

    return () => {
      unsubOrders();
      unsubRiders();
      unsubNotifications();
    };
  }, [isAdmin]);

  // Handle Admin Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setRoleError('');
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      console.error('Login failed:', err);
      setLoginError(
        err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
          ? 'ভুল ইমেইল অথবা পাসওয়ার্ড। আবার চেষ্টা করুন।'
          : err.message || 'লগইন করতে সমস্যা হয়েছে।'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setLoginError('');
    setRoleError('');
    setIsSubmitting(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google login error:', err);
      setLoginError(err.message || 'গুগল সাইন-ইন ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Enable Push Notifications
  const handleEnablePush = async () => {
    setIsEnablingPush(true);
    setPushStatusMsg('');

    try {
      const res = await registerDeviceForNotifications('owner', user?.uid || 'admin');
      setNotificationPermission(res.permission);
      if (res.success) {
        setPushStatusMsg('✓ ফোনে পুশ নোটিফিকেশন সফলভাবে চালু হয়েছে!');
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

  // Add Rider Handler (NO FIREBASE AUTH REQUIRED)
  const handleAddRider = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddRiderError('');
    setIsAddingRider(true);

    try {
      const rider = await createRider({
        id: newRiderId,
        name: newRiderName,
        phone: newRiderPhone,
        pin: newRiderPin,
        active: newRiderActive,
        vehicleType: newRiderVehicle,
        nid: newRiderNid,
        notes: newRiderNotes,
      });

      setCreatedRiderSuccess(rider);
      // Reset form
      setNewRiderName('');
      setNewRiderPhone('');
      setNewRiderId(generateRiderId());
      setNewRiderPin(generateRiderPin());
      setNewRiderNid('');
      setNewRiderNotes('');
      setNewRiderActive(true);
    } catch (err: any) {
      console.error('Failed to create rider:', err);
      setAddRiderError(err.message || 'রাইডার তৈরিতে সমস্যা হয়েছে।');
    } finally {
      setIsAddingRider(false);
    }
  };

  // Open Edit Rider Modal
  const handleOpenEditRider = (rider: Rider) => {
    setEditingRider(rider);
    setEditRiderName(rider.name);
    setEditRiderPhone(rider.phone);
    setEditRiderVehicle(rider.vehicleType || 'মোটরসাইকেল');
    setEditRiderNotes(rider.notes || '');
  };

  // Save Rider Edit
  const handleSaveRiderEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRider) return;
    setIsSavingEdit(true);

    try {
      await updateRider(editingRider.id, {
        name: editRiderName.trim(),
        phone: editRiderPhone.trim(),
        vehicleType: editRiderVehicle,
        notes: editRiderNotes.trim(),
      });
      setEditingRider(null);
      setStatusSuccessMsg(`রাইডার '${editRiderName}' এর তথ্য সফলভাবে আপডেট হয়েছে!`);
      setTimeout(() => setStatusSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Error updating rider:', err);
      alert(err.message || 'আপডেট করতে সমস্যা হয়েছে।');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Open Reset PIN Modal
  const handleOpenResetPin = (rider: Rider) => {
    setResetPinRider(rider);
    setNewGeneratedPin(generateRiderPin());
  };

  // Save Reset PIN
  const handleSaveResetPin = async () => {
    if (!resetPinRider) return;
    setIsResettingPin(true);

    try {
      await resetRiderPin(resetPinRider.id, newGeneratedPin);
      setResetPinRider(null);
      setStatusSuccessMsg(`রাইডার '${resetPinRider.name}' এর পিন সফলভাবে রিসেট হয়েছে: ${newGeneratedPin}`);
      setTimeout(() => setStatusSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Error resetting PIN:', err);
      alert(err.message || 'পিন রিসেট ব্যর্থ হয়েছে।');
    } finally {
      setIsResettingPin(false);
    }
  };

  // Toggle Rider Active / Inactive
  const handleToggleRider = async (rider: Rider) => {
    try {
      await toggleRiderActive(rider.id, !rider.active);
      setStatusSuccessMsg(`রাইডার '${rider.name}' স্ট্যাটাস '${!rider.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}' করা হয়েছে!`);
      setTimeout(() => setStatusSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Error toggling rider status:', err);
    }
  };

  // Confirm Rider Delete (ACTUALLY DELETES FROM FIRESTORE DATABASE)
  const handleConfirmDeleteRider = async () => {
    if (!riderToDelete) return;
    setIsDeletingRider(true);
    setDeleteRiderError('');

    try {
      await deleteRider(riderToDelete.id);
      setRiderToDelete(null);
      setStatusSuccessMsg(`রাইডার '${riderToDelete.name}' কে সফলভাবে ডাটাবেজ থেকে ডিলিট করা হয়েছে!`);
      setTimeout(() => setStatusSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed to delete rider:', err);
      setDeleteRiderError(err.message || 'রাইডার ডিলিট করতে সমস্যা হয়েছে।');
    } finally {
      setIsDeletingRider(false);
    }
  };

  // Assign Order to Rider
  const handleAssignOrder = async () => {
    if (!assigningOrder || !selectedRiderIdForAssign) return;
    const targetRider = riders.find((r) => r.id === selectedRiderIdForAssign);
    if (!targetRider) return;

    setIsAssigning(true);
    try {
      await assignOrderToRider(assigningOrder.id, {
        id: targetRider.id,
        name: targetRider.name,
        phone: targetRider.phone,
        address: assigningOrder.address,
      });
      setAssigningOrder(null);
      setSelectedRiderIdForAssign('');
      setStatusSuccessMsg(`অর্ডার #${assigningOrder.id} সফলভাবে রাইডার '${targetRider.name}' কে অ্যাসাইন করা হয়েছে!`);
      setTimeout(() => setStatusSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Error assigning order:', err);
      alert(err.message || 'অর্ডার অ্যাসাইন করতে সমস্যা হয়েছে।');
    } finally {
      setIsAssigning(false);
    }
  };

  // Accept Order directly
  const handleAcceptOrder = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    try {
      await acceptOrder(orderId);
      setStatusSuccessMsg(`অর্ডার #${orderId} সফলভাবে গ্রহণ করা হয়েছে!`);
      setTimeout(() => setStatusSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Error accepting order:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Reject Order with reason
  const handleRejectOrder = async () => {
    if (!rejectingOrderId) return;
    setUpdatingOrderId(rejectingOrderId);

    try {
      await rejectOrder(rejectingOrderId, rejectionReasonInput.trim());
      setRejectingOrderId(null);
      setRejectionReasonInput('');
      setStatusSuccessMsg(`অর্ডার #${rejectingOrderId} বাতিল করা হয়েছে।`);
      setTimeout(() => setStatusSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Error rejecting order:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      selectedStatusFilter === 'all'
        ? true
        : selectedStatusFilter === 'pending'
        ? o.status === 'নতুন অর্ডার'
        : selectedStatusFilter === 'active'
        ? o.status !== 'নতুন অর্ডার' && o.status !== 'সম্পন্ন' && o.status !== 'ডেলিভারি সম্পন্ন' && o.status !== 'বাতিল'
        : selectedStatusFilter === 'completed'
        ? o.status === 'সম্পন্ন' || o.status === 'ডেলিভারি সম্পন্ন'
        : selectedStatusFilter === 'cancelled'
        ? o.status === 'বাতিল'
        : true;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.address.toLowerCase().includes(q) ||
      o.items.toLowerCase().includes(q) ||
      (o.assignedRiderName && o.assignedRiderName.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const newOrdersCount = orders.filter((o) => o.status === 'নতুন অর্ডার').length;
  const activeDeliveriesCount = orders.filter(
    (o) => o.status !== 'নতুন অর্ডার' && o.status !== 'সম্পন্ন' && o.status !== 'ডেলিভারি সম্পন্ন' && o.status !== 'বাতিল'
  ).length;
  const completedOrdersCount = orders.filter((o) => o.status === 'সম্পন্ন' || o.status === 'ডেলিভারি সম্পন্ন').length;
  const totalRevenue = completedOrdersCount * 60;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-6xl bg-white dark:bg-[#061522] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        {/* Top Header Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0F273B] to-[#061522] text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C69A45] to-[#d6a952] flex items-center justify-center text-[#061522] shadow-md font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif text-white tracking-wide">
                  দরকার মালিক ও অ্যাডমিন প্যানেল
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#C69A45]/20 border border-[#C69A45]/40 text-[#d6a952] text-[10px] font-mono font-bold">
                  OWNER PANEL
                </span>
              </div>
              <p className="text-xs text-white/60">
                {isAdmin
                  ? `লগইন আছেন: ${user?.email || 'Admin'}`
                  : 'শুধুমাত্র অনুমোদিত মালিক/অ্যাডমিনের জন্য'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                {/* Notification Bell with Badge */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors relative"
                    title="নোটিফিকেশন"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Menu */}
                  <AnimatePresence>
                    {isNotificationMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0B2233] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden z-50 text-slate-900 dark:text-white"
                      >
                        <div className="p-3 bg-slate-50 dark:bg-[#061522] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-xs">
                            <Bell className="w-4 h-4 text-[#0284c7] dark:text-cyan-400" />
                            <span>রিয়েল-টাইম নোটিফিকেশন</span>
                            {unreadNotificationsCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px]">
                                {unreadNotificationsCount}
                              </span>
                            )}
                          </div>
                          {notifications.length > 0 && (
                            <button
                              type="button"
                              onClick={() => markAllNotificationsAsRead(notifications)}
                              className="text-[11px] text-[#0284c7] dark:text-cyan-400 hover:underline font-semibold cursor-pointer"
                            >
                              সব পঠিত করুন
                            </button>
                          )}
                        </div>

                        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-400 dark:text-white/40">
                              বর্তমানে কোনো নোটিফিকেশন নেই।
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                className={`p-3 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
                                  !n.read ? 'bg-cyan-50/60 dark:bg-cyan-950/30' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => {
                                      markNotificationAsRead(n.id);
                                      if (n.orderId) {
                                        setSearchQuery(n.orderId);
                                        setCurrentTab('orders');
                                        setIsNotificationMenuOpen(false);
                                      }
                                    }}
                                  >
                                    <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                      {!n.read && (
                                        <span className="w-2 h-2 rounded-full bg-[#0284c7] inline-block" />
                                      )}
                                      {n.title}
                                    </h5>
                                    <p className="text-slate-600 dark:text-white/70 mt-1 whitespace-pre-wrap">
                                      {n.body}
                                    </p>
                                    <span className="text-[10px] text-slate-400 dark:text-white/40 block mt-1">
                                      {n.createdAt}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => deleteNotification(n.id)}
                                    className="text-slate-400 hover:text-rose-500 cursor-pointer p-1"
                                    title="মুছে ফেলুন"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="লগআউট"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">লগআউট</span>
                </button>
              </>
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
          {authLoading ? (
            <div className="py-20 text-center text-slate-500 dark:text-white/60">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#C69A45]" />
              <p className="text-sm font-semibold">অ্যাডমিন স্ট্যাটাস যাচাই করা হচ্ছে...</p>
            </div>
          ) : !isAdmin ? (
            /* ADMIN LOGIN FORM */
            <div className="max-w-md mx-auto py-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#C69A45] via-[#d6a952] to-[#e5b962] flex items-center justify-center mx-auto mb-4 text-[#061522] shadow-xl">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2">
                  অ্যাডমিন লগইন
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60">
                  দরকার প্ল্যাটফর্মের অর্ডার ও রাইডার ব্যবস্থাপনার জন্য অনুমোদিত অ্যাডমিন ইমেইল দিয়ে লগইন করুন।
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {roleError && (
                <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>{roleError}</span>
                </div>
              )}

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider mb-2">
                    অ্যাডমিন ইমেইল
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="davidwallyy5@gmail.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#C69A45] focus:ring-2 focus:ring-[#C69A45]/20 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider mb-2">
                    পাসওয়ার্ড
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-[#C69A45] focus:ring-2 focus:ring-[#C69A45]/20 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C69A45] to-[#d6a952] hover:from-[#d6a952] hover:to-[#e5b962] text-[#061522] font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'লগইন হচ্ছে...' : 'অ্যাডমিন প্যানেলে প্রবেশ করুন'}</span>
                </button>
              </form>

              <div className="mt-5 flex items-center justify-center gap-3">
                <div className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
                <span className="text-xs text-slate-400">অথবা</span>
                <div className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="mt-5 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>গুগল দিয়ে প্রবেশ করুন (Google Login)</span>
              </button>
            </div>
          ) : (
            /* ADMIN DASHBOARD VIEW */
            <div className="space-y-6">
              {/* Success Feedback Banner */}
              {statusSuccessMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{statusSuccessMsg}</span>
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

              {/* Notification Permission Banner */}
              {notificationPermission !== 'granted' && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#C69A45]/20 to-amber-500/15 border border-[#C69A45]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C69A45] flex items-center justify-center text-[#061522] flex-shrink-0 font-bold">
                      <Bell className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        📲 ফোনে তাৎক্ষণিক অর্ডারের পুশ নোটিফিকেশন চালু করুন
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-white/70">
                        কাস্টমার নতুন কোনো অর্ডার দিলে ব্রাউজার বন্ধ থাকলেও আপনি মোবাইলে সাউন্ড সহ নোটিফিকেশন পাবেন।
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleEnablePush}
                    disabled={isEnablingPush}
                    className="px-5 py-2.5 rounded-xl bg-[#C69A45] hover:bg-[#d6a952] text-[#061522] font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    <Bell className="w-4 h-4" />
                    <span>{isEnablingPush ? 'অনুমতি নেওয়া হচ্ছে...' : 'নোটিফিকেশন সক্রিয় করুন'}</span>
                  </button>
                </div>
              )}

              {/* Top Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-white/60">নতুন অর্ডার</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  </div>
                  <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                    {newOrdersCount}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-white/60">চলমান ডেলিভারি</span>
                    <Bike className="w-4 h-4 text-[#0284c7]" />
                  </div>
                  <span className="text-2xl font-bold font-mono text-[#0284c7] dark:text-cyan-400">
                    {activeDeliveriesCount}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-white/60">সম্পন্ন ডেলিভারি</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {completedOrdersCount}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-white/60">মোট সংগৃহীত ফি</span>
                    <DollarSign className="w-4 h-4 text-[#C69A45]" />
                  </div>
                  <span className="text-2xl font-bold font-mono text-[#C69A45]">
                    ৳{totalRevenue}
                  </span>
                </div>
              </div>

              {/* Main Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                <button
                  type="button"
                  onClick={() => setCurrentTab('orders')}
                  className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                    currentTab === 'orders'
                      ? 'bg-[#0284c7] text-white shadow-md'
                      : 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>অর্ডার সমূহ ({orders.length})</span>
                  {newOrdersCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px]">
                      {newOrdersCount} নতুন
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('riders')}
                  className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                    currentTab === 'riders'
                      ? 'bg-[#C69A45] text-[#061522] shadow-md'
                      : 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>রাইডার টিম ({riders.length})</span>
                </button>
              </div>

              {/* TAB 1: ORDERS MANAGEMENT */}
              {currentTab === 'orders' && (
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { id: 'all', label: 'সকল' },
                        { id: 'pending', label: 'নতুন অর্ডার' },
                        { id: 'active', label: 'চলমান' },
                        { id: 'completed', label: 'সম্পন্ন' },
                        { id: 'cancelled', label: 'বাতিল' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setSelectedStatusFilter(tab.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                            selectedStatusFilter === tab.id
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                              : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="অর্ডার আইডি, কাস্টমার বা ঠিকানা..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0B2233] border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0284c7]"
                      />
                    </div>
                  </div>

                  {/* Orders List */}
                  {filteredOrders.length === 0 ? (
                    <div className="py-12 text-center rounded-3xl bg-slate-50 dark:bg-[#0B2233]/40 border border-dashed border-slate-200 dark:border-white/10 p-6">
                      <Package className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
                      <h5 className="font-bold text-slate-700 dark:text-white/80 text-sm mb-1">
                        কোনো অর্ডার পাওয়া যায়নি
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-white/50">
                        অন্য কোনো ফিল্টার সিলেক্ট করুন অথবা সার্চ কি-ওয়ার্ড পরিবর্তন করুন।
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredOrders.map((order) => {
                        const isUpdating = updatingOrderId === order.id;

                        return (
                          <div
                            key={order.id}
                            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B2233] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm text-[#0284c7] dark:text-cyan-400">
                                  #{order.id}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                    order.status === 'নতুন অর্ডার'
                                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-400 animate-pulse'
                                      : order.status === 'সম্পন্ন' || order.status === 'ডেলিভারি সম্পন্ন'
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                      : order.status === 'বাতিল'
                                      ? 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/60'
                                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                                  }`}
                                >
                                  {order.status}
                                </span>
                                {order.category && (
                                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 text-[10px]">
                                    {order.category}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-white/50 flex items-center gap-1 font-mono">
                                <Clock className="w-3.5 h-3.5" />
                                {order.createdAt}
                              </span>
                            </div>

                            {/* Customer & Location Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#061522]/60 border border-slate-100 dark:border-white/5">
                                <span className="text-slate-500 dark:text-white/50 block font-semibold mb-0.5">কাস্টমার:</span>
                                <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                                <a
                                  href={`tel:${order.phone}`}
                                  className="inline-flex items-center gap-1 text-[#0284c7] dark:text-cyan-400 font-mono font-bold mt-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  {order.phone}
                                </a>
                              </div>

                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#061522]/60 border border-slate-100 dark:border-white/5">
                                <span className="text-slate-500 dark:text-white/50 block font-semibold mb-0.5">ডেলিভারি ঠিকানা:</span>
                                <p className="text-slate-800 dark:text-white/90">{order.address}</p>
                                {order.latitude && order.longitude && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedLocationOrder(order)}
                                    className="inline-flex items-center gap-1 text-[11px] text-[#0284c7] dark:text-cyan-400 underline font-bold mt-1 cursor-pointer"
                                  >
                                    <MapPin className="w-3 h-3" />
                                    <span>GPS লোকেশন দেখুন →</span>
                                  </button>
                                )}
                              </div>

                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#061522]/60 border border-slate-100 dark:border-white/5">
                                <span className="text-slate-500 dark:text-white/50 block font-semibold mb-0.5">অ্যাসাইনকৃত রাইডার:</span>
                                {order.assignedRiderName ? (
                                  <div>
                                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                      <Bike className="w-3.5 h-3.5 text-[#0284c7]" />
                                      {order.assignedRiderName}
                                    </p>
                                    <p className="font-mono text-[11px] text-slate-500 dark:text-white/60">
                                      {order.assignedRiderPhone}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-rose-500 dark:text-rose-400 text-xs font-semibold">
                                    রাইডার এখনো নির্ধারিত হয়নি
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Items Box */}
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#061522]/60 border border-slate-100 dark:border-white/5 text-xs mb-3">
                              <span className="text-slate-500 dark:text-white/50 block font-semibold mb-0.5">
                                অর্ডারকৃত মালামাল:
                              </span>
                              <p className="font-semibold text-slate-900 dark:text-white whitespace-pre-wrap">
                                {order.items}
                              </p>
                              {order.preferredStore && (
                                <p className="text-slate-600 dark:text-white/70 mt-1">
                                  <strong>দোকান:</strong> {order.preferredStore}
                                </p>
                              )}
                              {order.notes && (
                                <p className="text-amber-700 dark:text-amber-300 mt-1">
                                  <strong>নোট:</strong> {order.notes}
                                </p>
                              )}
                            </div>

                            {/* Actions Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-slate-500">ডেলিভারি ফি:</span>
                                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                  ৳{order.deliveryCharge || 60}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {/* Assign Rider Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAssigningOrder(order);
                                    setSelectedRiderIdForAssign(order.assignedRiderId || '');
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                                >
                                  <Bike className="w-3.5 h-3.5" />
                                  <span>{order.assignedRiderId ? 'রাইডার পরিবর্তন' : 'রাইডার অ্যাসাইন করুন'}</span>
                                </button>

                                {/* Direct Accept if New */}
                                {order.status === 'নতুন অর্ডার' && (
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() => handleAcceptOrder(order.id)}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>অর্ডার গ্রহণ</span>
                                  </button>
                                )}

                                {/* Reject Button */}
                                {order.status !== 'বাতিল' && order.status !== 'সম্পন্ন' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRejectingOrderId(order.id);
                                      setRejectionReasonInput('');
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>বাতিল</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: RIDER MANAGEMENT */}
              {currentTab === 'riders' && (
                <div className="space-y-4">
                  {/* Top Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-[#0B2233] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        রাইডার অ্যাকাউন্ট সিস্টেম
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-white/60">
                        সহজ ৪-ডিজিট পিন ও আইডি ভিত্তিক সরাসরি ডাটাবেজ সিস্টেম (Firebase Auth ছাড়া)।
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddRiderModalOpen(true);
                        setCreatedRiderSuccess(null);
                        setNewRiderId(generateRiderId());
                        setNewRiderPin(generateRiderPin());
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C69A45] to-[#d6a952] hover:from-[#d6a952] hover:to-[#e5b962] text-[#061522] font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>+ নতুন রাইডার যুক্ত করুন</span>
                    </button>
                  </div>

                  {/* Rider Cards Grid */}
                  {riders.length === 0 ? (
                    <div className="py-12 text-center rounded-3xl bg-slate-50 dark:bg-[#0B2233]/40 border border-dashed border-slate-200 dark:border-white/10 p-6">
                      <Bike className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
                      <h5 className="font-bold text-slate-700 dark:text-white/80 text-sm mb-1">
                        কোনো রাইডার এখনো যুক্ত করা হয়নি
                      </h5>
                      <p className="text-xs text-slate-500 dark:text-white/50 max-w-sm mx-auto">
                        উপরের '+ নতুন রাইডার যুক্ত করুন' বাটনে চাপ দিয়ে রাইডারের নাম, মোবাইল ও পিন দিয়ে সহজেই অ্যাকাউন্ট তৈরি করুন।
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {riders.map((rider) => {
                        const isPinVisible = visiblePins[rider.id];

                        return (
                          <div
                            key={rider.id}
                            className="p-5 rounded-2xl bg-white dark:bg-[#0B2233] border border-slate-200 dark:border-white/10 shadow-md flex flex-col justify-between"
                          >
                            <div>
                              {/* Header */}
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#0ea5e9] flex items-center justify-center text-white font-bold">
                                    <Bike className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                      {rider.name}
                                    </h4>
                                    <span className="text-xs font-mono text-slate-500 dark:text-white/60">
                                      {rider.phone}
                                    </span>
                                  </div>
                                </div>

                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    rider.active
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-400/40'
                                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-400/40'
                                  }`}
                                >
                                  {rider.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                </span>
                              </div>

                              {/* Credentials Box (ID & PIN) */}
                              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#061522]/80 border border-slate-100 dark:border-white/5 space-y-2 text-xs mb-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500 dark:text-white/50">রাইডার আইডি:</span>
                                  <div className="flex items-center gap-2 font-mono font-bold text-slate-900 dark:text-cyan-300">
                                    <span>{rider.id}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(rider.id, `ID-${rider.id}`)}
                                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer p-0.5"
                                      title="আইডি কপি করুন"
                                    >
                                      {copiedText === `ID-${rider.id}` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500 dark:text-white/50">লগইন পিন (PIN):</span>
                                  <div className="flex items-center gap-2 font-mono font-bold text-amber-600 dark:text-amber-400">
                                    <span>{isPinVisible ? rider.pin : '••••'}</span>
                                    <button
                                      type="button"
                                      onClick={() => togglePinVisibility(rider.id)}
                                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer p-0.5"
                                    >
                                      {isPinVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(rider.pin, `PIN-${rider.id}`)}
                                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer p-0.5"
                                      title="পিন কপি করুন"
                                    >
                                      {copiedText === `PIN-${rider.id}` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/40 pt-1 border-t border-slate-100 dark:border-white/5">
                                  <span>বাহন: {rider.vehicleType || 'মোটরসাইকেল'}</span>
                                  <span>তৈরি: {rider.createdAt}</span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditRider(rider)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  title="তথ্য পরিবর্তন"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>এডিট</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenResetPin(rider)}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  title="পিন রিসেট করুন"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                  <span>পিন রিসেট</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleRider(rider)}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                                    rider.active
                                      ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300'
                                      : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300'
                                  }`}
                                  title={rider.active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                  <span>{rider.active ? 'নিষ্ক্রিয়' : 'সক্রিয়'}</span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => setRiderToDelete(rider)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                                title="রাইডার ডিলিট করুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* MODAL: ADD RIDER */}
      <AnimatePresence>
        {isAddRiderModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-[#0B2233] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#C69A45]" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                    নতুন রাইডার যুক্ত করুন
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddRiderModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {createdRiderSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                      রাইডার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      নিচের তথ্যগুলো রাইডারকে SMS বা WhatsApp এ পাঠিয়ে দিন:
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#061522] text-left text-xs font-mono space-y-2 border border-emerald-200 dark:border-white/10">
                    <div className="flex justify-between">
                      <span className="text-slate-500">নাম:</span>
                      <strong className="text-slate-900 dark:text-white">{createdRiderSuccess.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">মোবাইল:</span>
                      <strong className="text-slate-900 dark:text-white">{createdRiderSuccess.phone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">রাইডার আইডি:</span>
                      <strong className="text-[#0284c7] dark:text-cyan-300">{createdRiderSuccess.id}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">লগইন পিন (PIN):</span>
                      <strong className="text-amber-600 dark:text-amber-400">{createdRiderSuccess.pin}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const copyMsg = `দরকার রাইডার লগইন তথ্য:\nনাম: ${createdRiderSuccess.name}\nরাইডার আইডি: ${createdRiderSuccess.id}\nলগইন পিন: ${createdRiderSuccess.pin}\nদরকার ওয়েবসাইটে 'রাইডার পোর্টাল' থেকে লগইন করুন।`;
                        navigator.clipboard.writeText(copyMsg);
                        alert('লগইন তথ্য কপি হয়েছে!');
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                    >
                      <Copy className="w-4 h-4" />
                      <span>সব তথ্য কপি করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCreatedRiderSuccess(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-semibold"
                    >
                      আরেকটি যোগ করুন
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddRider} className="space-y-3.5">
                  {addRiderError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-200 text-xs">
                      {addRiderError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                      রাইডারের নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRiderName}
                      onChange={(e) => setNewRiderName(e.target.value)}
                      placeholder="যেমন: মোঃ রহিম উদ্দিন"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/15 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#C69A45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                      মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newRiderPhone}
                      onChange={(e) => setNewRiderPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/15 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#C69A45]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-white/80">
                          অটো-জেনারেটেড আইডি
                        </label>
                        <button
                          type="button"
                          onClick={() => setNewRiderId(generateRiderId())}
                          className="text-[10px] text-[#0284c7] hover:underline cursor-pointer"
                        >
                          নতুন আইডি
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={newRiderId}
                        onChange={(e) => setNewRiderId(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-white/80">
                          অটো-জেনারেটেড পিন
                        </label>
                        <button
                          type="button"
                          onClick={() => setNewRiderPin(generateRiderPin())}
                          className="text-[10px] text-[#0284c7] hover:underline cursor-pointer"
                        >
                          নতুন পিন
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={8}
                        value={newRiderPin}
                        onChange={(e) => setNewRiderPin(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-white font-mono font-bold text-amber-600 dark:text-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                        যানবাহন
                      </label>
                      <select
                        value={newRiderVehicle}
                        onChange={(e: any) => setNewRiderVehicle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="মোটরসাইকেল">মোটরসাইকেল</option>
                        <option value="বাইসাইকেল">বাইসাইকেল</option>
                        <option value="হাঁটা">হাঁটা</option>
                        <option value="সিএনজি/অন্যান্য">সিএনজি/অন্যান্য</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                        জাতীয় পরিচয়পত্র (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={newRiderNid}
                        onChange={(e) => setNewRiderNid(e.target.value)}
                        placeholder="NID নম্বর"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsAddRiderModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-semibold"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={isAddingRider}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C69A45] to-[#d6a952] hover:from-[#d6a952] hover:to-[#e5b962] text-[#061522] font-bold text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isAddingRider ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                      <span>রাইডার তৈরি করুন</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: EDIT RIDER */}
      <AnimatePresence>
        {editingRider && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#0B2233] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                  রাইডার তথ্য পরিবর্তন ({editingRider.id})
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingRider(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveRiderEdit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                    রাইডারের নাম
                  </label>
                  <input
                    type="text"
                    required
                    value={editRiderName}
                    onChange={(e) => setEditRiderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/15 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    required
                    value={editRiderPhone}
                    onChange={(e) => setEditRiderPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/15 text-sm text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-1">
                    বাহন
                  </label>
                  <select
                    value={editRiderVehicle}
                    onChange={(e: any) => setEditRiderVehicle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="মোটরসাইকেল">মোটরসাইকেল</option>
                    <option value="বাইসাইকেল">বাইসাইকেল</option>
                    <option value="হাঁটা">হাঁটা</option>
                    <option value="সিএনজি/অন্যান্য">সিএনজি/অন্যান্য</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingRider(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-semibold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    {isSavingEdit ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: RESET PIN */}
      <AnimatePresence>
        {resetPinRider && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#0B2233] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif mb-1">
                পিন রিসেট ({resetPinRider.name})
              </h3>
              <p className="text-xs text-slate-600 dark:text-white/60 mb-4">
                রাইডারের জন্য নতুন ৪-ডিজিট পিন নির্ধারণ করুন:
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/10 mb-4">
                <span className="text-xs text-slate-500 dark:text-white/50 block mb-1">নতুন পিন:</span>
                <div className="flex items-center justify-center gap-3">
                  <input
                    type="text"
                    maxLength={8}
                    value={newGeneratedPin}
                    onChange={(e) => setNewGeneratedPin(e.target.value.replace(/\D/g, ''))}
                    className="w-36 text-center py-2 rounded-xl bg-white dark:bg-[#0B2233] border border-amber-400 text-lg font-mono font-bold text-amber-600 dark:text-amber-400 tracking-widest focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setNewGeneratedPin(generateRiderPin())}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white text-xs cursor-pointer"
                    title="র‍্যান্ডম পিন"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setResetPinRider(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  disabled={isResettingPin || !newGeneratedPin}
                  onClick={handleSaveResetPin}
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#061522] font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  {isResettingPin ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>পিন নিশ্চিত করুন</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CONFIRM DELETE RIDER */}
      <AnimatePresence>
        {riderToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#0B2233] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif mb-1">
                রাইডার ডিলিট করবেন?
              </h3>
              <p className="text-xs text-slate-600 dark:text-white/70 mb-4">
                আপনি কি নিশ্চিত যে <strong className="text-rose-500">{riderToDelete.name} ({riderToDelete.id})</strong> কে ডাটাবেজ থেকে স্থায়ীভাবে ডিলিট করতে চান?
              </p>

              {deleteRiderError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-200 text-xs">
                  {deleteRiderError}
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setRiderToDelete(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  disabled={isDeletingRider}
                  onClick={handleConfirmDeleteRider}
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  {isDeletingRider ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>হ্যাঁ, ডিলিট করুন</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ASSIGN ORDER TO RIDER */}
      <AnimatePresence>
        {assigningOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#0B2233] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                    রাইডার অ্যাসাইন করুন
                  </h3>
                  <span className="font-mono text-xs text-[#0284c7] dark:text-cyan-400 font-bold">
                    #{assigningOrder.id} - {assigningOrder.customerName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAssigningOrder(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/80 mb-2">
                    সক্রিয় রাইডার নির্বাচন করুন:
                  </label>
                  {riders.filter((r) => r.active).length === 0 ? (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-800 dark:text-amber-200 text-xs">
                      কোনো সক্রিয় রাইডার নেই। প্রথমে রাইডার তৈরি অথবা সক্রিয় করুন।
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {riders
                        .filter((r) => r.active)
                        .map((rider) => (
                          <label
                            key={rider.id}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                              selectedRiderIdForAssign === rider.id
                                ? 'bg-cyan-50 dark:bg-cyan-950/60 border-[#0284c7]'
                                : 'bg-slate-50 dark:bg-[#061522] border-slate-200 dark:border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="assignRider"
                                checked={selectedRiderIdForAssign === rider.id}
                                onChange={() => setSelectedRiderIdForAssign(rider.id)}
                                className="text-[#0284c7]"
                              />
                              <div>
                                <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                                  {rider.name} ({rider.id})
                                </h5>
                                <span className="text-[11px] font-mono text-slate-500 dark:text-white/60">
                                  {rider.phone} • {rider.vehicleType || 'মোটরসাইকেল'}
                                </span>
                              </div>
                            </div>
                            <Bike className="w-4 h-4 text-slate-400" />
                          </label>
                        ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setAssigningOrder(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-semibold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    disabled={isAssigning || !selectedRiderIdForAssign}
                    onClick={handleAssignOrder}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white font-bold text-xs shadow flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isAssigning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>অ্যাসাইন নিশ্চিত করুন</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: REJECT ORDER WITH REASON */}
      <AnimatePresence>
        {rejectingOrderId && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#0B2233] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-2xl"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-2">
                অর্ডার #{rejectingOrderId} বাতিল কারণ
              </h3>
              <p className="text-xs text-slate-600 dark:text-white/60 mb-3">
                কাস্টমারকে প্রদর্শনের জন্য বাতিলের কারণ লিখুন:
              </p>

              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="যেমন: পণ্য দোকানে মজুদ নেই, অথবা ঠিকানা ডেলিভারি এলাকার বাইরে..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#061522] border border-slate-200 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500 mb-4"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectingOrderId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white text-xs font-semibold"
                >
                  ফিরে যান
                </button>
                <button
                  type="button"
                  onClick={handleRejectOrder}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow"
                >
                  বাতিল নিশ্চিত করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GPS Location Modal */}
      {selectedLocationOrder && (
        <GpsLocationModal
          order={selectedLocationOrder}
          isOpen={true}
          onClose={() => setSelectedLocationOrder(null)}
        />
      )}
    </div>
  );
};
