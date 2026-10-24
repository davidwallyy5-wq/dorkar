import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Zap, Shield, HeartHandshake, Smile, Award, Sparkles } from 'lucide-react';
import { Card3D } from './3d/Card3D';
import { CharacterSittingOnBox, CharacterPeeking } from './CuteDorkarCharacters';

export const WhyDorkar: React.FC = () => {
  const benefits = [
    {
      title: 'সহজ ও ঝামেলামুক্ত',
      desc: 'কয়েকটি তথ্য দিয়েই যেকোনো দোকান থেকে অর্ডার করুন। কোনো জটিল রেজিস্ট্রেশন বা অগ্রিম পেমেন্টের ঝামেলা নেই।',
      icon: Smile,
      badge: 'সহজ ইন্টারফেস',
      accent: 'border-cyan-400/30',
      iconColor: 'text-[#0284c7] dark:text-cyan-400',
    },
    {
      title: 'গতিশীল ডেলিভারি',
      desc: 'আপনার সময় মূল্যবান। অর্ডার দেওয়ার সাথে সাথে আমাদের নিকটস্থ রাইডার আপনার পণ্যের জন্য বিশ্বস্ত দোকানে পৌঁছায়।',
      icon: Zap,
      badge: 'সময় সাশ্রয়ী',
      accent: 'border-[#C69A45]/40',
      iconColor: 'text-[#0F273B] dark:text-[#C69A45]',
    },
    {
      title: '১০০% বিশ্বস্ত ও নিরাপদ',
      desc: 'প্রতিটি পণ্য যাচাই-বাছাই ও গুণগত মান নিশ্চিত করে কেনা হয়। আসল ক্যাশ মেমোসহ হ্যান্ড-টু-হ্যান্ড বুঝিয়ে দেওয়া হয়।',
      icon: Shield,
      badge: 'যাচাইকৃত ক্যাশ মেমো',
      accent: 'border-emerald-400/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <section
      id="why-dorkar"
      className="py-20 sm:py-28 bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#ECE3D4] dark:from-[#061522] dark:via-[#081B2B] dark:to-[#061522] text-slate-900 dark:text-white relative overflow-hidden border-t border-slate-200/80 dark:border-white/10 transition-colors duration-300"
    >
      {/* Ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-amber-200/20 dark:bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-sky-200/20 dark:bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0B2233]/90 backdrop-blur-xl border border-amber-300 dark:border-cyan-400/30 text-[#0F273B] dark:text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3 shadow-[0_4px_20px_rgba(198,154,69,0.12)]">
              <Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />
              <span>আমাদের বিশেষত্ব</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-serif">
              কেন দরকারকে বেছে নেবেন?
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-white/70 mt-3 max-w-xl font-light">
              আমরা শুধু পণ্য পৌঁছে দিই না, নিশ্চিত করি আপনার সময় ও মানসিক প্রশান্তি।
            </p>
          </div>

          {/* Cute Character Sitting on Box */}
          <div className="hidden lg:block relative -mb-4">
            <CharacterSittingOnBox />
          </div>
        </div>

        {/* 3 Main Benefits Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="h-full"
              >
                <Card3D maxTilt={10} scaleOnHover={1.02} className="h-full">
                  <div
                    id={`why-dorkar-card-${idx}`}
                    className={`h-full bg-white/90 dark:bg-[#0B2233]/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 ${item.accent} shadow-[0_12px_36px_rgba(15,39,59,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-[#0284c7] dark:hover:border-cyan-400/50 transition-all flex flex-col justify-between group relative overflow-hidden`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#061522] border border-slate-200 dark:border-white/15 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                          <Icon className={`w-6 h-6 ${item.iconColor}`} />
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-[#061522]/90 text-slate-800 dark:text-cyan-200 border border-slate-200 dark:border-cyan-500/30 backdrop-blur-md">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2.5 font-serif group-hover:text-[#0284c7] dark:group-hover:text-cyan-200 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>দরকার কোয়ালিটি গ্যারান্টি</span>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            );
          })}
        </div>

        {/* Trust banner Strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="bg-white/90 dark:bg-gradient-to-r dark:from-[#0B2233]/90 dark:via-[#061522]/95 dark:to-[#0B2233]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 text-slate-900 dark:text-white border border-[#C69A45]/30 shadow-[0_15px_40px_rgba(15,39,59,0.06)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6 relative"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-[#061522] border border-[#C69A45]/40 flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-7 h-7 text-[#C69A45]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">ভাওয়াল মির্জাপুরের নির্ভরতার প্রতীক</h3>
              <p className="text-sm text-slate-600 dark:text-white/70 font-light mt-0.5">প্রতিটি অর্ডারে সঠিক মেমো ও আসল ক্যাশ মেমো সাথে দেওয়া হয়।</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2.5 text-[#0F273B] dark:text-[#C69A45] px-4 py-2 rounded-xl bg-amber-50 dark:bg-[#061522]/90 border border-[#C69A45]/30">
              <HeartHandshake className="w-5 h-5 text-[#C69A45]" />
              <span>সহায়তাপূর্ণ লোকাল কেয়ার</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
