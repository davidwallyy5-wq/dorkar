export type OrderStatus =
  | 'নতুন অর্ডার'
  | 'অর্ডার গ্রহণ করা হয়েছে'
  | 'জিনিস কেনা হচ্ছে'
  | 'জিনিস কিনছি'
  | 'ডেলিভারির পথে'
  | 'সম্পন্ন'
  | 'ডেলিভারি সম্পন্ন'
  | 'বাতিল';

export type UserRole = 'customer' | 'rider' | 'admin';

export interface Rider {
  id: string; // e.g. "RID-1024" or "RDR-8492"
  pin: string; // 4-6 digit secret numeric PIN e.g. "5832"
  name: string;
  phone: string;
  email?: string;
  active: boolean;
  vehicleType?: 'মোটরসাইকেল' | 'বাইসাইকেল' | 'হাঁটা' | 'সিএনজি/অন্যান্য';
  nid?: string;
  createdAt: string;
  timestamp: number;
  totalDeliveries?: number;
  notes?: string;
}

export interface AppNotification {
  id: string;
  type: 'new_order' | 'order_assigned' | 'status_update' | 'order_picked_up' | 'order_delivered' | 'system';
  targetRole: 'owner' | 'rider' | 'customer' | 'all';
  targetRiderId?: string;
  orderId?: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  timestamp: number;
}

export interface DeviceToken {
  id: string;
  token: string;
  role: 'owner' | 'rider' | 'customer';
  userId?: string;
  userAgent?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  riderId?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: string;
  address: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  distanceKm?: number;
  detectedLocationName?: string;
  notes?: string;
  preferredStore?: string;
  category?: string;
  createdAt: string;
  timestamp: number;
  deliveryCharge: number; // Always capped at 60
  status: OrderStatus;
  statusNotes?: string;
  
  // Rider & Assignment Information
  assignedRiderId?: string;
  assignedRiderName?: string;
  assignedRiderPhone?: string;
  assignedAt?: string;
  statusUpdatedAt?: string;
  statusUpdatedBy?: 'admin' | 'rider' | 'customer';
  rejectionReason?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tag: string;
  examples: string[];
}

export interface ContactMessage {
  id?: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  timestamp: number;
}


