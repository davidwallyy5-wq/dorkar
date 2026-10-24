import React from 'react';
import { motion } from 'motion/react';
import { Check, Shield, Zap, Receipt, Sparkles } from 'lucide-react';
import { Card3D } from './3d/Card3D';
import { ILLUSTRATIONS } from '../utils/illustrationAssets';

export const DeliveryVisual: React.FC = () => {
  const highlights = [
    {
      icon: Receipt,
      title: 'আসল ক্যাশ মেমো',
      desc: 'দোকানের মূল ভাউচার বা ক্যাশ মেমো পণ্যের সাথে সরাসরি বুঝিয়ে দেওয়া হয়।',
      color: 'text-[#0284c7] dark:text-cyan-400',
    },
    {
      icon: Shield,
      title: 'সঠিক যাচাই ও গুণগত মান',
      desc: 'তাজা কাঁচাবাজার ও ব্র্যান্ডেড পণ্য নিশ্চিত করতে প্রতিটি আইটেম সতর্কতার সাথে বাছাই করা হয়।',
      color: 'text-[#0F273B] dark:text-[#C69A45]',
    },
    {
      icon: Zap,
      title: 'নির্ধারিত সময়ে পৌঁছানো',
      desc: 'অর্ডার নিশ্চিতের পরপরই ৩০–৪৫ মিনিটের মধ্যে আপনার ঠিকানায় সরাসরি ডেলিভারি।',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-[#F0F6FF] via-[#E6F0FA] to-[#DCEAF8] dark:from-[#081B2B] dark:via-[#061522] dark:to-[#081B2B] text-slate-900 dark:text-white relative overflow-hidden border-t border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      {/* Ambient radial glow */}
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-sky-200/30 dark:bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-indigo-200/30 dark:bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: 3D Tilt Authentic Rider Cute 2D Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 order-2 lg:order-1 relative"
          >
            <Card3D maxTilt={10} scaleOnHover={1.02}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/12] shadow-[0_20px_50px_rgba(15,39,59,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white dark:border-white/15 bg-white dark:bg-[#0B2233] group">
                <img
                  src={ILLUSTRATIONS.deliveryDoorstep}
                  alt="Delivery Rider handing package to customer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061522]/90 via-[#061522]/20 to-transparent pointer-events-none" />
                
                {/* Floating animated cash memo badge */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 left-4 px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-[#061522]/90 backdrop-blur-xl border border-sky-300 dark:border-cyan-400/40 text-[#0284c7] dark:text-cyan-300 text-xs font-bold shadow-xl flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-[#0284c7] dark:text-cyan-400" />
                  <span>আসল ক্যাশ মেমো নিশ্চিত</span>
                </motion.div>

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 dark:bg-[#061522]/95 backdrop-blur-xl border border-white/80 dark:border-white/15 shadow-2xl text-slate-900 dark:text-white">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#0284c7] dark:bg-cyan-500 text-white dark:text-[#061522] flex items-center justify-center flex-shrink-0 font-bold shadow-md">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">হ্যান্ড-টু-হ্যান্ড নিরাপদ ডেলিভারি</h4>
                      <p className="text-xs text-slate-600 dark:text-white/75">পণ্য বুঝে নিয়ে সন্তুষ্ট হয়ে ক্যাশ অন ডেলিভারিতে বিল পরিশোধ করুন</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card3D>
          </motion.div>

          {/* Right Column: Key Commitments */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-6 order-1 lg:order-2 space-y-6 sm:space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0B2233]/90 backdrop-blur-xl border border-sky-300 dark:border-cyan-400/30 text-[#0284c7] dark:text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3 shadow-[0_4px_20px_rgba(2,132,199,0.12)]">
                <Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />
                <span>আমাদের অঙ্গীকার</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-serif">
                আপনার ভরসা, <br />
                <span className="bg-gradient-to-r from-[#0284c7] via-sky-600 to-[#C69A45] dark:from-white dark:via-cyan-100 dark:to-[#E8E0D2] bg-clip-text text-transparent">
                  আমাদের সর্বোচ্চ দায়িত্ব
                </span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-white/75 mt-3 font-light leading-relaxed">
                আমরা শুধু ডেলিভারি করি না; আপনার প্রতিটি কেনাকাটায় সর্বোচ্চ সততা, স্বচ্ছতা ও প্রযুক্তি নির্ভর যত্ন নিশ্চিত করি।
              </p>
            </div>

            <div className="space-y-3.5">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card3D key={idx} maxTilt={6} scaleOnHover={1.01}>
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-[#0B2233]/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_8px_24px_rgba(15,39,59,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex items-start gap-4 hover:border-[#0284c7] dark:hover:border-cyan-400/40 transition-colors">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#061522] border border-slate-200 dark:border-white/15 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 font-serif">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed font-light">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
