import React from 'react';
import { motion } from 'motion/react';
import { Clock, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card3D } from './3d/Card3D';
import { ILLUSTRATIONS } from '../utils/illustrationAssets';
import { CharacterCrossingScooterRider } from './CuteDorkarCharacters';

export const StorySection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-[#FAF5EE] via-[#F4EBE0] to-[#EAE0D2] dark:from-[#061522] dark:via-[#081B2B] dark:to-[#061522] text-slate-900 dark:text-white relative overflow-hidden border-y border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      {/* 3D Depth ambient background lights */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-amber-200/30 dark:bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-sky-200/30 dark:bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Lively Traveling Scooter Crossing the Section (Requirement 5) */}
      <div className="mb-8">
        <CharacterCrossingScooterRider />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 sm:space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0B2233]/80 backdrop-blur-xl border border-amber-300 dark:border-cyan-400/30 text-[#0F273B] dark:text-cyan-300 text-xs font-bold tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />
              <span>নির্ভরযোগ্য ও দ্রুততম সেবা</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] font-serif">
              সময় নেই? <br />
              <span className="bg-gradient-to-r from-[#0284c7] via-[#0F273B] to-[#C69A45] dark:from-white dark:via-cyan-100 dark:to-[#E8E0D2] bg-clip-text text-transparent">
                কোনো সমস্যা নেই।
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-slate-700 dark:text-white/80 leading-relaxed font-light">
              তাজা কাঁচাবাজার, গরম খাবার, জরুরি প্রেসক্রিপশন কিংবা জরুরি পার্সেল—আপনি শুধু তালিকা দিন, বাকি দায়িত্ব আমাদের।
            </p>

            {/* 3D Feature Cards in Liquid Glass */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card3D maxTilt={8} scaleOnHover={1.03}>
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/90 dark:bg-[#0B2233]/80 backdrop-blur-xl border border-slate-200/80 dark:border-cyan-500/20 shadow-[0_8px_24px_rgba(15,39,59,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-[#0284c7] dark:hover:border-cyan-400/40 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-[#061522] border border-sky-200 dark:border-cyan-500/30 flex items-center justify-center text-[#0284c7] dark:text-cyan-400 shrink-0 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-sky-700 dark:text-cyan-300/80 uppercase block">গতিশীল ডেলিভারি</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">৩০–৪৫ মিনিটে নিশ্চিত</span>
                  </div>
                </div>
              </Card3D>

              <Card3D maxTilt={8} scaleOnHover={1.03}>
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/90 dark:bg-[#0B2233]/80 backdrop-blur-xl border border-slate-200/80 dark:border-[#C69A45]/30 shadow-[0_8px_24px_rgba(15,39,59,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-[#C69A45] dark:hover:border-[#C69A45]/50 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-[#061522] border border-amber-200 dark:border-[#C69A45]/40 flex items-center justify-center text-[#0F273B] dark:text-[#C69A45] shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-800 dark:text-[#C69A45]/80 uppercase block">১০০% স্বচ্ছতা</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">আসল ক্যাশ মেমোসহ</span>
                  </div>
                </div>
              </Card3D>
            </div>

            {/* Bullet Points */}
            <div className="space-y-2.5 pt-2 text-sm font-medium text-slate-700 dark:text-white/85">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-cyan-500/20 text-[#0284c7] dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>যেকোনো নির্দিষ্ট বা প্রিয় দোকান থেকে ক্রয়ের স্বাধীনতা</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-[#C69A45]/20 text-[#0F273B] dark:text-[#C69A45] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>ডেলিভারি পাওয়ার পর পণ্য যাচাই করে মূল্য পরিশোধ</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Layered Card with Team Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="lg:col-span-6 relative"
          >
            <Card3D maxTilt={12} scaleOnHover={1.02}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/12] shadow-[0_20px_50px_rgba(15,39,59,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white dark:border-white/15 bg-white dark:bg-[#061522] group">
                <img
                  src={ILLUSTRATIONS.storyTeam}
                  alt="Dorkar Friendly Delivery Team"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061522]/80 via-[#061522]/20 to-transparent pointer-events-none" />
                
                {/* Floating animated sparkles badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-[#061522]/90 backdrop-blur-xl border border-amber-200 dark:border-cyan-400/40 text-amber-900 dark:text-cyan-300 text-xs font-bold shadow-xl flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />
                  <span>দরকার টিম</span>
                </motion.div>

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 dark:bg-[#061522]/95 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-2xl text-slate-900 dark:text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#0F273B] dark:text-[#C69A45] uppercase tracking-wider block">
                      বিশ্বস্ত লোকাল নেটওয়ার্ক
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      আপনার পছন্দের স্থানীয় বাজার ও বিশ্বস্ত দোকান থেকেই কেনাকাটা
                    </span>
                  </div>
                </div>
              </div>
            </Card3D>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
