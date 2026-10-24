import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Store, CheckCircle, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Card3D } from './3d/Card3D';
import {
  CharacterWithPhone,
  CharacterShoppingHelper,
  CharacterCustomerHelper,
} from './CuteDorkarCharacters';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '০১',
      title: 'আপনার দরকার জানান',
      subtitle: 'তালিকা দিন',
      desc: 'আপনার পছন্দের কাঁচাবাজার, জরুরি ওষুধ, রেস্তোরাঁর খাবার কিংবা কোনো জরুরি ডকুমেন্টের তালিকা সহজে লিখে অর্ডার করুন।',
      icon: ShoppingCart,
      character: <CharacterWithPhone />,
      accentColor: 'from-cyan-500/15 to-blue-500/5',
      badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60 text-[#0284c7] dark:text-cyan-300 border-cyan-400/40',
      borderColor: 'border-slate-200/80 dark:border-cyan-500/30 group-hover:border-[#0284c7]',
      numColor: 'text-[#0284c7] dark:text-cyan-400',
    },
    {
      num: '০২',
      title: 'আমরা সংগ্রহ করে আনি',
      subtitle: 'নির্ভুল বাছাই',
      desc: 'নিকটস্থ বিশ্বস্ত দোকান থেকে যাচাইকৃত তাজা ও সঠিক পণ্য আসল ক্যাশ মেমোসহ আমাদের ডেডিকেটেড রাইডার সংগ্রহ করে।',
      icon: Store,
      character: <CharacterShoppingHelper />,
      accentColor: 'from-emerald-500/15 to-teal-500/5',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-400/40',
      borderColor: 'border-slate-200/80 dark:border-emerald-500/30 group-hover:border-emerald-500',
      numColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      num: '০৩',
      title: 'আপনার কাছে পৌঁছে দিই',
      subtitle: 'দ্রুত ডেলিভারি',
      desc: '৩০–৪৫ মিনিটের মধ্যে আপনার ঠিকানায় সরাসরি ডেলিভারি। পণ্য হাতে পেয়ে নিখুঁতভাবে চেক করে ক্যাশ মেমো অনুযায়ী পরিশোধ করুন।',
      icon: CheckCircle,
      character: <CharacterCustomerHelper />,
      accentColor: 'from-amber-500/15 to-[#C69A45]/5',
      badgeBg: 'bg-amber-50 dark:bg-[#C69A45]/20 text-[#0F273B] dark:text-[#ffe599] border-[#C69A45]/40',
      borderColor: 'border-slate-200/80 dark:border-[#C69A45]/30 group-hover:border-[#C69A45]',
      numColor: 'text-[#0F273B] dark:text-[#C69A45]',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 bg-gradient-to-b from-[#F2FAF6] via-[#E8F6EF] to-[#DBEFE4] dark:from-[#071F2C] dark:via-[#061522] dark:to-[#081B2B] text-slate-900 dark:text-white relative overflow-hidden border-t border-slate-200/80 dark:border-white/10 transition-colors duration-300"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-300/20 dark:bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-teal-300/20 dark:bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-14 sm:mb-18 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#061522]/90 backdrop-blur-xl border border-emerald-300 dark:border-cyan-400/30 text-emerald-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3 shadow-[0_4px_20px_rgba(16,185,129,0.12)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>সহজ ৩টি ধাপ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-serif">
            সহজ ৩টি ধাপে আপনার <br />
            <span className="bg-gradient-to-r from-[#0284c7] via-emerald-600 to-[#C69A45] dark:from-white dark:via-cyan-100 dark:to-[#E8E0D2] bg-clip-text text-transparent">
              দরকার পূরণ
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-white/70 mt-3 max-w-xl font-light leading-relaxed">
            কোনো জটিলতা ছাড়াই আপনার কাঙ্ক্ষিত সামগ্রী নিরাপদে ঘরে পৌঁছে দেওয়ার আধুনিক ও দ্রুত ব্যবস্থা।
          </p>
        </motion.div>

        {/* 3 Steps Grid with Cute 2D Animated Characters + 3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="h-full"
              >
                <Card3D maxTilt={10} scaleOnHover={1.02} className="h-full">
                  <div className={`h-full bg-white/90 dark:bg-[#061522]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border ${step.borderColor} transition-all duration-500 flex flex-col justify-between group shadow-[0_12px_40px_rgba(15,39,59,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative overflow-hidden`}>
                    
                    {/* Top Number & Icon */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-4xl sm:text-5xl font-bold font-serif ${step.numColor}`}>
                          {step.num}
                        </span>
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#0B2233]/90 border border-slate-200 dark:border-white/15 flex items-center justify-center text-slate-800 dark:text-white group-hover:scale-105 transition-all shadow-md">
                          <Icon className="w-5 h-5 text-[#0284c7] dark:text-cyan-400" />
                        </div>
                      </div>

                      {/* Dedicated Cute Dorkar Animated Character Illustration */}
                      <div className="my-4 rounded-2xl py-3 px-4 aspect-[4/3] flex items-center justify-center relative bg-slate-50 dark:bg-[#0B2233]/80 border border-slate-200/80 dark:border-white/10 shadow-inner group-hover:border-[#0284c7]/40 transition-all">
                        {step.character}
                        
                        {/* Step badge */}
                        <div className={`absolute bottom-2.5 right-2.5 px-3 py-0.5 rounded-full border text-[10px] font-bold shadow-sm ${step.badgeBg}`}>
                          ধাপ {step.num}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-white/60 font-semibold block mb-1">
                        {step.subtitle}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight font-serif">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-white/70 leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-white/50 group-hover:text-[#0284c7] dark:group-hover:text-white transition-colors">
                      <span>ধাপ {step.num} সুবিধা</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-[#0284c7] dark:text-white/80" />
                    </div>

                  </div>
                </Card3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
