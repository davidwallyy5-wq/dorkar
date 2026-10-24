import React from 'react';
import { ShoppingBag, ArrowUp, Phone, MessageCircle, ShieldCheck, Bike } from 'lucide-react';
import { motion } from 'motion/react';
import { OFFICIAL_CONTACT } from '../utils/mockData';
import { ILLUSTRATIONS } from '../utils/illustrationAssets';

interface FooterProps {
  onOpenPolicy: (type: 'terms' | 'privacy') => void;
  onOpenAdmin: () => void;
  onOpenRider: () => void;
  onOpenRoleSelector?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPolicy,
  onOpenAdmin,
  onOpenRider,
  onOpenRoleSelector,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'হোম', href: '#home' },
    { label: 'কীভাবে কাজ করে', href: '#how-it-works' },
    { label: 'সেবা', href: '#services' },
    { label: 'অর্ডার', href: '#order' },
    { label: 'ট্র্যাকিং', href: '#track' },
    { label: 'যোগাযোগ', href: '#contact' },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#FAF5F0] via-[#F4ECE4] to-[#ECE0D6] dark:from-[#081B2B] dark:via-[#061522] dark:to-[#040D16] text-slate-900 dark:text-white pt-16 pb-12 border-t border-slate-200/80 dark:border-white/10 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-200 dark:border-white/10 items-start">
          {/* Brand Info with Cute Minimal Rider Avatar */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3.5">
              {/* Cute Minimal Rider Avatar */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-[#0B2233] border border-amber-300 dark:border-[#C69A45]/40 flex-shrink-0 shadow-md"
              >
                <img
                  src={ILLUSTRATIONS.footerRider}
                  alt="Dorkar Delivery Boy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
                  {OFFICIAL_CONTACT.brandName}
                </span>
                <span className="block text-[11px] text-[#0F273B] dark:text-[#C69A45] font-semibold">
                  {OFFICIAL_CONTACT.brandSub}
                </span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-white/70 font-light max-w-sm">
              “{OFFICIAL_CONTACT.tagline}”
            </p>
            <p className="text-xs text-slate-500 dark:text-white/50 pt-0.5">
              ডেলিভারি চার্জ: {OFFICIAL_CONTACT.maxDeliveryChargeText} • বিশ্বস্ত আসল ক্যাশ মেমো
            </p>
          </div>

          {/* Contact Fast Access */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
              অফিসিয়াল যোগাযোগ
            </span>
            <div className="flex flex-col gap-2 text-xs">
              <a
                href={`tel:${OFFICIAL_CONTACT.phone}`}
                className="flex items-center gap-2 text-slate-800 dark:text-white/80 hover:text-[#0284c7] dark:hover:text-[#C69A45] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#0284c7] dark:text-[#C69A45]" />
                <span>Hotline: <strong className="font-mono">{OFFICIAL_CONTACT.phoneDisplay}</strong></span>
              </a>
              <a
                href={OFFICIAL_CONTACT.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-800 dark:text-white/80 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>WhatsApp: <strong className="font-mono">{OFFICIAL_CONTACT.phoneDisplay}</strong></span>
              </a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-wider block">
              ন্যাভিগেশন ও পোর্টাল
            </span>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-medium text-slate-700 dark:text-white/75 hover:text-[#0284c7] dark:hover:text-[#C69A45] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Policy & Portals Access Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-white/50">
          <div className="flex items-center gap-3.5 flex-wrap">
            <button
              type="button"
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-slate-900 dark:hover:text-[#C69A45] transition-colors cursor-pointer"
            >
              গোপনীয়তা নীতি
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-slate-900 dark:hover:text-[#C69A45] transition-colors cursor-pointer"
            >
              শর্তাবলী
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onOpenRider}
              className="text-[#0F273B] dark:text-[#C69A45] hover:underline flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <Bike className="w-3.5 h-3.5" />
              <span>রাইডার লগইন</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-slate-800 dark:text-white/80 hover:text-slate-900 dark:hover:text-[#C69A45] flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F273B] dark:text-[#C69A45]" />
              <span>ওনার / অ্যাডমিন লগইন</span>
            </button>
            {onOpenRoleSelector && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenRoleSelector}
                  className="text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-[#C69A45] flex items-center gap-1 cursor-pointer"
                >
                  <span>ভূমিকা নির্বাচন</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} {OFFICIAL_CONTACT.brandSub}</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="w-8 h-8 rounded-xl bg-white dark:bg-[#0B2233] border border-slate-200 dark:border-white/10 hover:bg-[#0284c7] dark:hover:bg-[#C69A45] hover:text-white dark:hover:text-[#061522] text-slate-800 dark:text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              aria-label="উপরে যান"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
