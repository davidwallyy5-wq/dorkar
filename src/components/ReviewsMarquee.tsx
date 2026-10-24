import React from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'তানভীর আহমেদ',
    location: 'ভাওয়াল মির্জাপুর বাজার',
    rating: 5,
    comment: 'জরুরি ওষুধ দরকার ছিল, মাত্র ৩০ মিনিটে আসল ক্যাশ মেমোসহ দরজায় দিয়ে গেছে। অসাধারণ সার্ভিস!',
    tag: 'জরুরি ওষুধ',
  },
  {
    id: 2,
    name: 'রোকেয়া বেগম',
    location: 'মির্জাপুর পূর্বপাড়া',
    rating: 5,
    comment: 'কাঁচাবাজারের শাকসবজি ও মাছ খুব তাজা এনে দিয়েছে। রাইডার খুবই ভদ্র ও সময়নিষ্ঠ।',
    tag: 'তাজা কাঁচাবাজার',
  },
  {
    id: 3,
    name: 'মাহমুদুল হাসান',
    location: 'কলেজ রোড',
    rating: 5,
    comment: 'রেস্তোরাঁর গরম বিরিয়ানি একদম সময়ে পেয়েছি। ডেলিভারি চার্জ মাত্র ৳৫০ নিয়েছে!',
    tag: 'খাবার ডেলিভারি',
  },
  {
    id: 4,
    name: 'সাইফুল ইসলাম',
    location: 'দক্ষিণপাড়া',
    rating: 5,
    comment: 'অফিস ফাইল পাঠানোর প্রয়োজন ছিল। লাইভ জিপিএস ট্র্যাকিং দেখে খুব ভালো লেগেছে।',
    tag: 'পার্সেল সার্ভিস',
  },
  {
    id: 5,
    name: 'শারমিন আক্তার',
    location: 'মির্জাপুর বাজার সংলগ্ন',
    rating: 5,
    comment: 'ঘরে বসে পছন্দের দোকান থেকে কেনাকাটা করা এত সহজ হতে পারে ভাবিনি। ধন্যবাদ দরকার!',
    tag: 'দৈনন্দিন শপিং',
  },
];

export const ReviewsMarquee: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#F8F4FD] via-[#F1EAF8] to-[#E8DCF3] dark:from-[#061522] dark:via-[#081B2B] dark:to-[#061522] text-slate-900 dark:text-white relative overflow-hidden border-t border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      {/* Ambient lighting */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-purple-200/20 dark:bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0B2233]/90 backdrop-blur-xl border border-purple-300 dark:border-cyan-400/30 text-purple-800 dark:text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />
          <span>গ্রাহক সন্তুষ্টি</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-white">
          আমাদের গ্রাহকদের অভিজ্ঞতা
        </h2>
        <p className="text-sm text-slate-600 dark:text-white/70 mt-2 font-light">
          ভাওয়াল মির্জাপুর ও আশেপাশের এলাকার নির্ভরযোগ্য ডেলিভারি পার্টনার
        </p>
      </div>

      {/* ONE Single Continuous Loop Moving RIGHT -> LEFT */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right gradient fades */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#F8F4FD] dark:from-[#061522] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#E8DCF3] dark:from-[#061522] to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-5 w-max py-3"
        >
          {/* Double the list for seamless marquee */}
          {[...REVIEWS, ...REVIEWS].map((item, idx) => (
            <div
              key={idx}
              className="w-[290px] sm:w-[340px] flex-shrink-0 p-5 rounded-2xl bg-white/90 dark:bg-[#061522]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_8px_24px_rgba(15,39,59,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-[#0284c7] dark:hover:border-cyan-400/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-[#C69A45]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C69A45]" />
                    ))}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 dark:bg-cyan-950/80 border border-purple-200 dark:border-cyan-500/30 text-purple-700 dark:text-cyan-300 font-semibold">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-white/85 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-serif">{item.name}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-white/60">{item.location}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  <span>যাচাইকৃত</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
