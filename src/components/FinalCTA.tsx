import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Card3D } from './3d/Card3D';
import { CharacterRunningDeliverer } from './CuteDorkarCharacters';

interface FinalCTAProps {
  onOrderClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOrderClick }) => {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-[#FFF5F0] via-[#FFEBE3] to-[#FDE0D6] dark:from-[#0B2233] dark:via-[#061522] dark:to-[#0B2233] text-slate-900 dark:text-white relative overflow-hidden border-t border-rose-200/80 dark:border-white/10 transition-colors duration-300">
      {/* 3D Dynamic glowing center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-200/40 dark:bg-[#C69A45]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-amber-200/30 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative z-10 space-y-8">
        
        {/* Animated Running Deliverer */}
        <div className="flex justify-center">
          <CharacterRunningDeliverer />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#061522]/90 backdrop-blur-xl border border-rose-300 dark:border-[#C69A45]/40 text-rose-900 dark:text-[#ffe599] text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />
            <span>দ্রুততম হোম ডেলিভারি</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-serif">
            কী দরকার আপনার?
          </h2>
          <p className="text-base sm:text-xl text-slate-700 dark:text-white/75 max-w-lg mx-auto font-light leading-relaxed">
            একবার অর্ডার করুন। বাকি সবকিছু আমরা সঠিক সময়ে দরজায় বুঝিয়ে দেব।
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="pt-2 flex justify-center"
        >
          <Card3D maxTilt={15} scaleOnHover={1.05}>
            <button
              type="button"
              id="final-cta-order-btn"
              onClick={onOrderClick}
              className="px-10 py-4 sm:py-5 bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white text-base sm:text-lg font-bold rounded-2xl transition-all cursor-pointer shadow-[0_10px_35px_rgba(2,132,199,0.35)] active:scale-[0.98] inline-flex items-center gap-3 group border border-sky-300/40"
            >
              <span>এখনই অর্ডার করুন</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </Card3D>
        </motion.div>

      </div>
    </section>
  );
};
