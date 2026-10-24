import { ServiceItem, OrderStatus } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'grocery',
    title: 'বাজার ও গ্রোসারি',
    description: 'তাজা শাকসবজি, মাছ-মাংস, চাল, ডাল, তেল ও প্রতিদিনের কাঁচাবাজার।',
    iconName: 'ShoppingBag',
    tag: 'জনপ্রিয়',
    examples: ['১ কেজি আলু, পেঁয়াজ', '৫০০ গ্রাম তাজা রুই মাছ', '২ লিটার সয়াবিন তেল'],
  },
  {
    id: 'medicine',
    title: 'ওষুধ ও ফার্মেসি',
    description: 'জরুরি প্রেসক্রিপশন ওষুধ, বেবি ফুড, ফার্স্ট এইড ও হেলথকেয়ার পণ্য।',
    iconName: 'Pill',
    tag: 'জরুরি সেবা',
    examples: ['নাপা এক্সট্রা ১ পাতা', 'স্যাভলন অ্যান্টিসেপটিক', 'বেবি ডায়াপার'],
  },
  {
    id: 'food',
    title: 'খাবার ও রেস্তোরাঁ',
    description: 'আপনার প্রিয় স্থানীয় রেস্তোরাঁ, বেকারি বা মিষ্টির দোকান থেকে তাজা খাবার।',
    iconName: 'Utensils',
    tag: 'হট ডেলিভারি',
    examples: ['কাচ্চি বিরিয়ানি', 'চিকেন ফ্রাই ও নান', 'রসগোল্লা বা মিষ্টি'],
  },
  {
    id: 'electronics',
    title: 'ইলেকট্রনিক্স ও গ্যাজেট',
    description: 'মোবাইল চার্জার, ডেটা কেবল, হেডফোন, ব্যাটারি ও দরকারি এক্সেসরিজ।',
    iconName: 'Smartphone',
    tag: 'দ্রুত সেবা',
    examples: ['Type-C কেবল', 'পাওয়ার ব্যাংক', 'ব্যাটারি'],
  },
  {
    id: 'documents',
    title: 'ডকুমেন্ট ও পার্সেল',
    description: 'অফিসের ফাইল, জরুরি কাগজপত্র, বই বা ছোট পার্সেল দ্রুত আনা-নেওয়া।',
    iconName: 'FileText',
    tag: 'নিরাপদ',
    examples: ['জরুরি ফাইল', 'বিশ্ববিদ্যালয়ের ডকুমেন্টস', 'প্রয়োজনীয় বই'],
  },
  {
    id: 'custom',
    title: 'অন্যান্য প্রয়োজনীয় জিনিস',
    description: 'আপনার যেকোনো বিশেষ চাহিদা—হার্ডওয়্যার, স্টেশনারি বা বিশেষ পণ্য।',
    iconName: 'PackagePlus',
    tag: 'কাস্টম',
    examples: ['কালার প্রিন্ট পেপার', 'উপহার সামগ্রী', 'টুলস বা হার্ডওয়্যার'],
  },
];

export interface StatusStepInfo {
  key: OrderStatus;
  label: string;
  desc: string;
}

export const ORDER_STATUS_LIST: OrderStatus[] = [
  'নতুন অর্ডার',
  'অর্ডার গ্রহণ করা হয়েছে',
  'জিনিস কিনছি',
  'জিনিস কেনা হচ্ছে',
  'ডেলিভারির পথে',
  'ডেলিভারি সম্পন্ন',
  'সম্পন্ন',
  'বাতিল',
];

export const STATUS_STEPS: StatusStepInfo[] = [
  {
    key: 'নতুন অর্ডার',
    label: 'নতুন অর্ডার',
    desc: 'আপনার অর্ডার সফলভাবে আমাদের সিস্টেমে জমা হয়েছে।',
  },
  {
    key: 'অর্ডার গ্রহণ করা হয়েছে',
    label: 'অর্ডার গ্রহণ করা হয়েছে',
    desc: 'আমাদের ডেলিভারি টিম আপনার অর্ডারটি গ্রহণ করেছে।',
  },
  {
    key: 'জিনিস কিনছি',
    label: 'জিনিস কেনা হচ্ছে',
    desc: 'আমাদের রাইডার আপনার চাহিদামতো বিশ্বস্ত দোকান থেকে পণ্য কিনছে।',
  },
  {
    key: 'ডেলিভারির পথে',
    label: 'ডেলিভারির পথে',
    desc: 'রাইডার প্রয়োজনীয় পণ্য ও ক্যাশ মেমো নিয়ে আপনার ঠিকানায় আসছে।',
  },
  {
    key: 'ডেলিভারি সম্পন্ন',
    label: 'সম্পন্ন',
    desc: 'পণ্য সফলভাবে আপনার হাতে পৌঁছে দেওয়া হয়েছে।',
  },
];

export function getStatusStepIndex(status: OrderStatus): number {
  if (status === 'নতুন অর্ডার') return 0;
  if (status === 'অর্ডার গ্রহণ করা হয়েছে') return 1;
  if (status === 'জিনিস কিনছি' || status === 'জিনিস কেনা হচ্ছে') return 2;
  if (status === 'ডেলিভারির পথে') return 3;
  if (status === 'ডেলিভারি সম্পন্ন' || status === 'সম্পন্ন') return 4;
  return -1;
}

export const OFFICIAL_CONTACT = {
  phone: '01642430787',
  phoneDisplay: '01642430787',
  whatsappUrl: 'https://wa.me/8801642430787',
  brandName: 'দরকার',
  brandSub: 'দরকার — A Part of Makrosha',
  tagline: 'আপনার দরকার, আমাদের দায়িত্ব।',
  maxDeliveryCharge: 60,
  maxDeliveryChargeText: 'সর্বোচ্চ ৳60',
};
