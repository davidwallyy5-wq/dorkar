import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy' | null;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, type }) => {
  if (!type) return null;

  const isTerms = type === 'terms';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#061522]/85 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#0B2233] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/15 overflow-hidden z-10 my-8 text-slate-900 dark:text-white transition-colors"
          >
            <div className="p-6 sm:p-7 bg-slate-50 dark:bg-[#061522] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-[#0B2233] text-[#C69A45] border border-amber-300 dark:border-white/10 flex items-center justify-center">
                  {isTerms ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
                    {isTerms ? 'শর্তাবলী (Terms & Conditions)' : 'গোপনীয়তা নীতি (Privacy Policy)'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-white/60">দরকার সেবার নিয়ম ও সুরক্ষা নীতিমালা</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#0B2233] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto space-y-4 text-sm text-slate-700 dark:text-white/80 leading-relaxed font-normal">
              {isTerms ? (
                <>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-serif">১. সেবা গ্রহণ ও অর্ডার নীতি</h4>
                  <p>
                    ‘দরকার’ প্ল্যাটফর্ম গ্রাহকের অনুরোধ অনুযায়ী কাঙ্ক্ষিত পণ্য বিশ্বস্ত দোকান থেকে ক্রয় করে ডেলিভারি দিয়ে থাকে। কোনো অবৈধ, অননুমোদিত বা ঝুঁকিপূর্ণ পণ্য বহন করা হয় না।
                  </p>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-serif">২. মূল্য ও মেমো নীতি</h4>
                  <p>
                    দোকানের মূল ক্যাশ মেমো অনুসারে পণ্যের প্রকৃত মূল্য এবং নির্ধারিত ডেলিভারি ফি ক্যাশ অন ডেলিভারি অথবা ডিজিটাল পেমেন্টে পরিশোধ করতে হবে।
                  </p>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-serif">৩. পণ্য যাচাইকরণ</h4>
                  <p>
                    ডেলিভারি গ্রহণের সময় গ্রাহককে পণ্য এবং রিসিট মেমো ভালোভাবে যাচাই করে নেওয়ার অনুরোধ করা হচ্ছে।
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-serif">১. ব্যক্তিগত তথ্যের সুরক্ষা</h4>
                  <p>
                    আপনার নাম, মোবাইল নম্বর এবং ঠিকানা কেবলমাত্র অর্ডার ও ডেলিভারি সম্পন্ন করার প্রয়োজনে সংরক্ষিত থাকবে এবং সর্বোচ্চ নিরাপত্তায় সুরক্ষিত থাকবে।
                  </p>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-serif">২. ডেটা গোপনীয়তা</h4>
                  <p>
                    আমরা গ্রাহকের কোনো ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে হস্তান্তর বা বিক্রি করি না।
                  </p>
                </>
              )}
            </div>

            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#061522] border-t border-slate-200 dark:border-white/10 text-right">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-[#C69A45] hover:brightness-105 text-slate-900 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                বুঝেছি
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
