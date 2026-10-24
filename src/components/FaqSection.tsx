import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles, Phone, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { OFFICIAL_CONTACT } from '../utils/mockData';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'দরকার প্ল্যাটফর্মের মাধ্যমে আমি কী কী জিনিস অর্ডার করতে পারব?',
    answer:
      'দৈনন্দিন যে কোনো দরকার—কাঁচাবাজারের শাকসবজি, তাজা মাছ, মাংস, ফার্মেসি থেকে জরুরি ওষুধ, রেস্তোরাঁ বা মিষ্টির দোকানের খাবার, ইলেকট্রনিক্স ও মোবাইল সামগ্রী, জরুরি অফিস ফাইল ও স্টেশনারি ইত্যাদি যা ভাওয়াল মির্জাপুর ও আশেপাশের বাজারে পাওয়া যায়।',
    category: 'সার্ভিস ও পণ্য',
  },
  {
    question: 'ডেলিভারি চার্জ কত এবং কীভাবে নির্ধারিত হয়?',
    answer:
      'আমাদের ডেলিভারি চার্জ সম্পূর্ণ স্বচ্ছ। দূরত্ব ভেদে সর্বনিম্ন ৳৩০ থেকে সর্বোচ্চ মাত্র ৳৬০ টাকা! কোনো ধরনের লুকানো খরচ বা অতিরিক্ত কমিশন নেই।',
    category: 'ডেলিভারি চার্জ',
  },
  {
    question: 'সার্ভিস এরিয়া বা ডেলিভারি এলাকা কতদূর পর্যন্ত বিস্তৃত?',
    answer:
      'আমাদের সার্ভিস ভাওয়াল মির্জাপুর বাজার কেন্দ্র করে সর্বোচ্চ ৫ কিলোমিটার ব্যাসার্ধের মধ্যে যেকোনো স্থানে নির্ভরযোগ্যভাবে চালু রয়েছে।',
    category: 'এলাকা',
  },
  {
    question: 'পণ্য পাওয়ার পর বিল পরিশোধের নিয়ম কী?',
    answer:
      'সম্পূর্ণ ক্যাশ অন ডেলিভারি (Cash on Delivery)। রাইডার যখন পণ্য আপনার ঠিকানায় পৌঁছে দেবে, তখন আসল ক্যাশ মেমো দেখে এবং পণ্য মিলিয়ে নিয়ে সরাসরি রাইডারকে মূল্য ও ডেলিভারি চার্জ পরিশোধ করবেন।',
    category: 'পেমেন্ট',
  },
  {
    question: 'ডেলিভারি হতে কত সময় লাগে?',
    answer:
      'অর্ডার নিশ্চিত হওয়ার পর সাধারণত ৩০ থেকে ৪৫ মিনিটের মধ্যেই আমাদের ডেডিকেটেড রাইডার পণ্য সংগ্রহ করে আপনার দরজায় পৌঁছে দেয়।',
    category: 'ডেলিভারি টাইম',
  },
  {
    question: 'অর্ডার নিয়ে কোনো সমস্যা হলে কার সাথে যোগাযোগ করব?',
    answer: `যেকোনো জিজ্ঞাসা বা সহায়তার জন্য আমাদের অফিসিয়াল সাপোর্ট নম্বরে কল করুন: ${OFFICIAL_CONTACT.phoneDisplay} অথবা সরাসরি আমাদের দরকার সহায়কের সাথে চ্যাট করুন।`,
    category: 'সাপোর্ট',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 bg-gradient-to-b from-[#F1F7FC] via-[#E7F2FA] to-[#DDECF6] dark:from-[#071D2D] dark:via-[#061522] dark:to-[#081B2B] text-slate-900 dark:text-white relative overflow-hidden border-t border-slate-200/80 dark:border-white/10 transition-colors duration-300"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-200/20 dark:bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0B2233]/90 backdrop-blur-xl border border-cyan-300 dark:border-cyan-400/30 text-[#0284c7] dark:text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>সচরাচর জিজ্ঞাসা (FAQ)</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-serif">
            সাধারণ কিছু প্রশ্নের উত্তর
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-white/70 mt-3 max-w-xl mx-auto font-light leading-relaxed">
            দরকার প্ল্যাটফর্ম ও ডেলিভারি সেবা সম্পর্কে আপনার প্রয়োজনীয় যাবতীয় তথ্যাদি
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-[#0B2233] border-[#0284c7] dark:border-cyan-400/50 shadow-[0_8px_30px_rgba(2,132,199,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                    : 'bg-white/70 dark:bg-[#0B2233]/70 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOpen ? 'bg-[#0284c7] dark:bg-cyan-400' : 'bg-slate-300 dark:bg-white/30'}`} />
                    <span className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white">
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#0284c7] dark:bg-cyan-500 text-white dark:text-[#061522] rotate-180'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-white/80 leading-relaxed border-t border-slate-100 dark:border-white/10 font-light">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
