import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Card3D } from './3d/Card3D';
import { ILLUSTRATIONS } from '../utils/illustrationAssets';
import { CharacterBoxCarrierWalking, CharacterPeeking } from './CuteDorkarCharacters';

interface WhatCanWeGetProps {
  onSelectCategory: (categoryTitle: string, samplePrompt?: string) => void;
}

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  samplePrompt: string;
  accent: string;
  glowColor: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'grocery',
    title: 'কাঁচাবাজার',
    subtitle: 'তাজা শাকসবজি, মাছ, মাংস ও কাঁচাবাজারের সম্পূর্ণ ফর্দ',
    image: ILLUSTRATIONS.categories.grocery,
    samplePrompt: '১ কেজি দেশি আলু, ৫০০ গ্রাম পেঁয়াজ, ১ লিটার সয়াবিন তেল ও ১ আঁটি ধনেপাতা',
    accent: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
  {
    id: 'medicine',
    title: 'জরুরি ওষুধ',
    subtitle: 'প্রেসক্রিপশন মেডিসিন ও ব্যক্তিগত স্বাস্থ্যসেবা পণ্য',
    image: ILLUSTRATIONS.categories.medicine,
    samplePrompt: 'নাপা এক্সট্রা ১ পাতা, অ্যান্টাসিড ও ওরাল স্যালাইন ৫ প্যাকেট',
    accent: '#0284c7',
    glowColor: 'rgba(2, 132, 199, 0.15)',
  },
  {
    id: 'food',
    title: 'রেস্তোরাঁর খাবার',
    subtitle: 'যেকোনো প্রিয় রেস্তোরাঁ, বেকারি বা ঐতিহ্যবাহী মিষ্টি',
    image: ILLUSTRATIONS.categories.food,
    samplePrompt: 'কাচ্চি বিরিয়ানি ১ ফুল প্লেট ও বোরহানি ১ বোতল',
    accent: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'electronics',
    title: 'ইলেকট্রনিক্স ও গ্যাজেট',
    subtitle: 'মোবাইল চার্জার, কেবল, অ্যাডাপ্টার ও হেডফোন',
    image: ILLUSTRATIONS.categories.electronics,
    samplePrompt: 'Type-C ফাস্ট চার্জিং কেবল ও হেডফোন',
    accent: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.15)',
  },
  {
    id: 'documents',
    title: 'জরুরি পার্সেল ও ফাইল',
    subtitle: 'অফিস ডকুমেন্টস, প্রিন্ট কপি, বই ও উপহার সামগ্রী',
    image: ILLUSTRATIONS.categories.documents,
    samplePrompt: 'জরুরি অফিস ফাইল ও ক্লায়েন্ট প্রিন্ট পেপার্স',
    accent: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.15)',
  },
  {
    id: 'custom',
    title: 'বিশেষ যেকোনো আইটেম',
    subtitle: 'হার্ডওয়্যার, স্টেশনারি বা আপনার ব্যক্তিগত প্রয়োজনীয় সামগ্রী',
    image: ILLUSTRATIONS.categories.custom,
    samplePrompt: 'গিফট বক্স, র‍্যাপিং পেপার ও স্পেশাল চকলেট প্যাকেট',
    accent: '#c69a45',
    glowColor: 'rgba(198, 154, 69, 0.15)',
  },
];

export const WhatCanWeGet: React.FC<WhatCanWeGetProps> = ({ onSelectCategory }) => {
  return (
    <section
      id="services"
      className="py-20 sm:py-28 bg-gradient-to-b from-[#FFF7F2] via-[#FDF0E7] to-[#FCE5D6] dark:from-[#061522] dark:via-[#081B2B] dark:to-[#061522] text-slate-900 dark:text-white relative border-t border-slate-200/80 dark:border-white/10 overflow-hidden transition-colors duration-300"
    >
      {/* Ambient aura lights */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-orange-200/20 dark:bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-rose-200/20 dark:bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Traveling Package Carrier (Right -> Left) */}
      <div className="mb-4">
        <CharacterBoxCarrierWalking />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Peeking Character on Corner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 sm:mb-18">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0B2233]/90 backdrop-blur-xl border border-orange-300 dark:border-cyan-400/30 text-orange-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3 shadow-[0_4px_20px_rgba(251,146,60,0.12)]">
              <Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />
              <span>ক্যাটেগরি ও সেবা</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-serif">
              যা দরকার, বলুন।
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-white/70 mt-3 font-light leading-relaxed">
              দৈনন্দিন জীবনের প্রয়োজনীয় যেকোনো পণ্য আপনার পছন্দসই দোকান থেকে নিরাপদে এনে দেওয়া আমাদের কাজ।
            </p>
          </motion.div>

          {/* Peeking Cute Character */}
          <div className="hidden sm:block">
            <CharacterPeeking />
          </div>
        </div>

        {/* Photography & 3D Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Card3D maxTilt={10} scaleOnHover={1.02}>
                <div
                  onClick={() => onSelectCategory(cat.title, cat.samplePrompt)}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] cursor-pointer shadow-[0_12px_36px_rgba(15,39,59,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-500 bg-white dark:bg-[#0B2233] border border-slate-200/80 dark:border-white/10 hover:border-[#0284c7] dark:hover:border-cyan-400/50"
                  style={{
                    boxShadow: `0 12px 30px 0 ${cat.glowColor}`,
                  }}
                >
                  {/* Photo Layer */}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Liquid Glass Overlay Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061522]/95 via-[#061522]/40 to-transparent" />

                  {/* Top Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-md"
                      style={{ backgroundColor: `${cat.accent}CC` }}
                    >
                      {cat.title}
                    </span>
                  </div>

                  {/* Top Right Action Arrow */}
                  <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-[#0284c7] group-hover:scale-110 transition-all shadow-md">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>

                  {/* Bottom Text Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mb-1 group-hover:text-cyan-200 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                      {cat.subtitle}
                    </p>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300">
                      <span>অর্ডার করতে ট্যাপ করুন</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
