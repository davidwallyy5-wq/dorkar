import React, { useState } from 'react';
import { Phone, MessageCircle, Clock, MapPin, Send, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { OFFICIAL_CONTACT } from '../utils/mockData';
import { saveContactMessage } from '../services/orderService';
import { Card3D } from './3d/Card3D';
import { ILLUSTRATIONS } from '../utils/illustrationAssets';
import { CharacterWavingEdge } from './CuteDorkarCharacters';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await saveContactMessage({
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
      setTimeout(() => {
        setName('');
        setPhone('');
        setMessage('');
        setSubmitted(false);
      }, 4500);
    } catch (err) {
      console.error('Contact submit error:', err);
      setError('মেসেজ পাঠাতে সমস্যা হয়েছে। দয়া করে সরাসরি হটলাইনে কল করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 sm:py-28 bg-gradient-to-b from-[#EFF9F6] via-[#E3F4EF] to-[#D6EFE8] dark:from-[#061522] dark:via-[#081B2B] dark:to-[#061522] text-slate-900 dark:text-white relative overflow-hidden border-t border-slate-200/80 dark:border-white/10 transition-colors duration-300"
    >
      {/* Ambient aura lighting */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-teal-200/20 dark:bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 dark:bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Official Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-6 sm:space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0B2233]/90 backdrop-blur-xl border border-teal-300 dark:border-cyan-400/30 text-teal-800 dark:text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3 shadow-[0_4px_20px_rgba(20,184,166,0.12)]">
                <Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />
                <span>অফিসিয়াল যোগাযোগ</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-serif">
                যে কোনো প্রয়োজনে <br />
                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-[#C69A45] dark:from-white dark:via-cyan-100 dark:to-[#E8E0D2] bg-clip-text text-transparent">
                  আমাদের পাশে পাবেন
                </span>
              </h2>
              <p className="text-base text-slate-600 dark:text-white/75 mt-3 font-light leading-relaxed">
                জরুরি অর্ডার, স্পেশাল রিকোয়েস্ট বা যেকোনো তথ্যের জন্য আমাদের অফিসিয়াল হটলাইন অথবা হোয়াটসঅ্যাপে সরাসরি যোগাযোগ করুন।
              </p>
            </div>

            {/* Support Card with Waving Mascot */}
            <Card3D maxTilt={8} scaleOnHover={1.02}>
              <div className="rounded-3xl overflow-hidden bg-white/90 dark:bg-[#0B2233]/80 backdrop-blur-xl border border-slate-200/80 dark:border-cyan-500/20 shadow-[0_12px_36px_rgba(15,39,59,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative p-4.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 rounded-2xl overflow-hidden flex-shrink-0 relative bg-slate-100 dark:bg-[#061522] border border-slate-200 dark:border-white/10">
                    <img
                      src={ILLUSTRATIONS.contactSupport}
                      alt="Customer Support Executive"
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061522]/50 to-transparent pointer-events-none" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider block">
                      সার্বক্ষণিক কাস্টমার কেয়ার
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-serif">
                      আমরা সবসময় প্রস্তুত
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-white/70">
                      সকাল ৮:০০ থেকে রাত ১১:০০
                    </p>
                  </div>
                </div>

                {/* Cute Waving Character on Edge */}
                <div className="hidden sm:block">
                  <CharacterWavingEdge />
                </div>
              </div>
            </Card3D>

            <div className="space-y-3">
              {/* Hotline Card */}
              <Card3D maxTilt={6} scaleOnHover={1.01}>
                <a
                  href={`tel:${OFFICIAL_CONTACT.phone}`}
                  className="p-4 rounded-2xl bg-white/90 dark:bg-[#0B2233]/80 backdrop-blur-xl border border-slate-200/80 dark:border-cyan-500/20 shadow-[0_8px_24px_rgba(15,39,59,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex items-center gap-4 hover:border-teal-500 dark:hover:border-cyan-400/50 transition-all group block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-[#061522] border border-teal-200 dark:border-cyan-500/30 flex items-center justify-center text-teal-700 dark:text-cyan-400 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-teal-700 dark:text-cyan-400 uppercase tracking-wider block">
                        Hotline
                      </span>
                      <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
                        {OFFICIAL_CONTACT.phoneDisplay}
                      </span>
                    </div>
                  </div>
                </a>
              </Card3D>

              {/* WhatsApp Card */}
              <Card3D maxTilt={6} scaleOnHover={1.01}>
                <a
                  href={OFFICIAL_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/90 dark:bg-[#0B2233]/80 backdrop-blur-xl border border-slate-200/80 dark:border-emerald-500/20 shadow-[0_8px_24px_rgba(15,39,59,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex items-center gap-4 hover:border-emerald-500 dark:hover:border-emerald-400/50 transition-all group block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-[#061522] border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                        WhatsApp
                      </span>
                      <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
                        {OFFICIAL_CONTACT.phoneDisplay}
                      </span>
                    </div>
                  </div>
                </a>
              </Card3D>
            </div>
          </motion.div>

          {/* Right Column: Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="p-6 sm:p-10 rounded-3xl bg-white/90 dark:bg-[#0B2233]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_16px_50px_rgba(15,39,59,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-serif mb-2">
                বার্তা পাঠান
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 mb-6">
                আপনার মতামত, অভিযোগ বা পরামর্শ লিখে পাঠালে আমরা অবিলম্বে সাড়া দেব।
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white font-serif">বার্তা সফলভাবে পাঠানো হয়েছে!</h4>
                  <p className="text-xs text-slate-600 dark:text-white/80">আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন। ধন্যবাদ!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                      আপনার নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: তানভীর আহমেদ"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#061522]/90 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-teal-500 dark:focus:border-cyan-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#061522]/90 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-teal-500 dark:focus:border-cyan-400 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                      আপনার বার্তা বা বিবরণ <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="আপনার প্রশ্ন বা মতামত বিস্তারিত লিখুন..."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#061522]/90 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:border-teal-500 dark:focus:border-cyan-400 text-sm leading-relaxed"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-200 text-xs">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? 'বার্তা পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
