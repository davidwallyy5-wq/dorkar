import React from 'react';
import { ChevronDown, Sparkles, Clock, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Order } from '../types';
import { HeroCustomerInterface } from './HeroCustomerInterface';
import { ThreeHeroCanvas } from './3d/ThreeHeroCanvas';
import { CuteDeliveryRiderHero } from './CuteDeliveryRiderHero';
import { ILLUSTRATIONS } from '../utils/illustrationAssets';

interface HeroProps {
  activeTab: 'order' | 'track';
  onTabChange: (tab: 'order' | 'track') => void;
  initialItems?: string;
  initialCategory?: string;
  activeTrackId?: string;
  onOrderPlaced: (order: Order) => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  activeTab,
  onTabChange,
  initialItems = '',
  initialCategory = '',
  activeTrackId = '',
  onOrderPlaced,
  onHowItWorksClick,
}) => {
  return (
    <section
      id="home"
      className="relative min-h-[96vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#EDE4D5] dark:from-[#061522] dark:via-[#061522] dark:to-[#081B2B] text-slate-900 dark:text-white pt-24 sm:pt-28 pb-8 transition-colors duration-300"
    >
      {/* 1. Interactive 3D WebGL Scene Background */}
      <ThreeHeroCanvas />

      {/* 2. Ambient Colorful Glows */}
      <div className="absolute inset-0 pointer-events-none z-2 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-amber-200/30 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-sky-200/30 dark:bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-orange-100/40 dark:bg-violet-600/10 rounded-full blur-[130px]" />
      </div>

      {/* 3. Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-4 sm:py-6 flex flex-col items-center text-center">
        
        {/* 3D Brand Tag with Cute Rider Micro-Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-[#0B2233]/80 backdrop-blur-2xl border border-amber-200/80 dark:border-cyan-500/30 text-[#0F273B] dark:text-[#C69A45] text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-3 sm:mb-4 shadow-[0_8px_32px_rgba(2,132,199,0.08)] dark:shadow-[0_8px_32px_rgba(0,210,255,0.15)]"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden bg-[#C69A45]/20 border border-[#C69A45]/50 flex-shrink-0">
            <img
              src={ILLUSTRATIONS.heroRider}
              alt="Rider"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[#0284c7] dark:text-cyan-200 font-bold">দরকার • ব্যক্তিগত Buy & Deliver সেবা</span>
        </motion.div>

        {/* Main Large Heading with High Contrast Display Typography */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.14] mb-2 max-w-3xl font-serif drop-shadow-sm dark:drop-shadow-2xl"
        >
          আপনার যা দরকার, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#C69A45] dark:from-white dark:via-cyan-100 dark:to-[#E8E0D2] bg-clip-text text-transparent">
            আমরা এনে দেব।
          </span>
        </motion.h1>

        {/* Short Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35 }}
          className="text-sm sm:text-lg text-slate-600 dark:text-white/80 max-w-xl font-light mb-3 sm:mb-4 leading-relaxed"
        >
          আপনি শুধু দরকারটা বলুন। বাকিটা আমাদের।
        </motion.p>

        {/* Cute 3D Animated Delivery Rider traveling across Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full relative z-10 my-1"
        >
          <CuteDeliveryRiderHero />
        </motion.div>

        {/* Top Hero Customer Interface (Order Wizard & Track Tabs) */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.55 }}
          className="w-full relative z-20"
        >
          <HeroCustomerInterface
            activeTab={activeTab}
            onTabChange={onTabChange}
            initialItems={initialItems}
            initialCategory={initialCategory}
            activeTrackId={activeTrackId}
            onOrderPlaced={onOrderPlaced}
          />
        </motion.div>

      </div>

      {/* Subtle Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-white/40 hover:text-[#0284c7] dark:hover:text-cyan-300 transition-colors cursor-pointer pt-2"
        onClick={onHowItWorksClick}
      >
        <span className="text-[10px] uppercase tracking-widest font-semibold text-[#0284c7] dark:text-cyan-400/70">নিচে আরও জানুন</span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-[#0284c7] dark:text-cyan-400/80" />
        </motion.div>
      </motion.div>
    </section>
  );
};
