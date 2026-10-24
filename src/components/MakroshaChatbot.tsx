import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Phone, MessageCircle, Sparkles, MapPin, Package, Check, HelpCircle, ShieldCheck } from 'lucide-react';
import { CharacterChatbotMascot } from './CuteDorkarCharacters';
import { OFFICIAL_CONTACT } from '../utils/mockData';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
  actionType?: 'order' | 'track' | 'call' | 'whatsapp';
}

interface MakroshaChatbotProps {
  onOpenOrder?: () => void;
  onOpenTrack?: () => void;
}

export const MakroshaChatbot: React.FC<MakroshaChatbotProps> = ({
  onOpenOrder,
  onOpenTrack,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'আসসালামু আলাইকুম! আমি "দরকার সহায়ক"। আপনার কী প্রয়োজন? যেকোনো জিনিস কেনাকাটা বা ডেলিভারিতে আপনাকে সাহায্য করতে প্রস্তুত।',
      options: ['অর্ডার করতে চাই', 'অর্ডার কোথায়?', 'রাইডার কোথায়?', 'ডেলিভারি কতক্ষণ?', 'সহায়তা চাই'],
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleOptionClick = (option: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: option,
    };

    let botResponse: Message;

    if (option.includes('অর্ডার করতে') || option.includes('কিনব') || option.includes('নতুন অর্ডার')) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'অর্ডার করতে নিচে "অর্ডার ফর্ম খুলুন" বাটনে ক্লিক করুন অথবা আপনার প্রয়োজনীয় পণ্যের তালিকা লিখে দিন। মাত্র ৩০-৪৫ মিনিটে ডেলিভারি পৌঁছে দেওয়া হবে।',
        actionType: 'order',
        options: ['অর্ডার কোথায়?', 'ডেলিভারি কতক্ষণ?', 'সহায়তা চাই'],
      };
    } else if (option.includes('অর্ডার কোথায়') || option.includes('ট্র্যাকিং') || option.includes('ট্র্যাক')) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'আপনার অর্ডার ট্র্যাকিং আইডির মাধ্যমে সরাসরি লাইভ স্ট্যাটাস দেখতে পারবেন। নিচে ক্লিক করে সরাসরি ট্র্যাক করুন।',
        actionType: 'track',
        options: ['অর্ডার করতে চাই', 'রাইডার কোথায়?', 'হটলাইনে কথা বলুন'],
      };
    } else if (option.includes('রাইডার কোথায়') || option.includes('রাইডার')) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'আমাদের ভাওয়াল মির্জাপুর লোকাল রাইডাররা সবসময় এলাকায় প্রস্তুত থাকেন। অর্ডার কনফার্ম হওয়ার সাথে সাথে নিকটস্থ রাইডার দোকানে গিয়ে পণ্য সংগ্রহ করে রওনা দেন।',
        options: ['অর্ডার করতে চাই', 'ডেলিভারি কতক্ষণ?', 'হটলাইনে কল করুন'],
      };
    } else if (option.includes('কতক্ষণ') || option.includes('সময়') || option.includes('চার্জ')) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'ভাওয়াল মির্জাপুর ও আশেপাশের ৫ কিমি এলাকায় সাধারণত ৩০ থেকে ৪৫ মিনিটের মধ্যে ডেলিভারি সম্পন্ন হয়। ডেলিভারি চার্জ দূরত্ব ভেদে মাত্র ৳৩০ থেকে ৳৬০ টাকা।',
        options: ['অর্ডার করতে চাই', 'অর্ডার কোথায়?', 'সহায়তা চাই'],
      };
    } else if (option.includes('সহায়তা') || option.includes('হেল্প') || option.includes('যোগাযোগ')) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `জরুরি যে কোনো সহায়তায় আমাদের সরাসরি কল করতে পারেন ${OFFICIAL_CONTACT.phoneDisplay} নম্বরে অথবা হোয়াটসঅ্যাপে মেসেজ দিন।`,
        actionType: 'call',
        options: ['হোয়াটসঅ্যাপে পাঠান', 'অর্ডার করতে চাই'],
      };
    } else if (option.includes('হটলাইন') || option.includes('কল')) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `জরুরি যে কোনো প্রয়োজনে আমাদের অফিসিয়াল হটলাইন ${OFFICIAL_CONTACT.phoneDisplay}-এ সরাসরি কল করুন।`,
        actionType: 'call',
      };
    } else if (option.includes('হোয়াটসঅ্যাপ')) {
      botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `আমাদের অফিসিয়াল হোয়াটসঅ্যাপ নম্বরে মেসেজ পাঠাতে নিচে ক্লিক করুন।`,
        actionType: 'whatsapp',
      };
    } else {
      botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'ধন্যবাদ! আপনার চাহিদামতো কাঁচাবাজার, জরুরি ওষুধ, খাবার বা যেকোনো জিনিস সংগ্রহ করতে দরকার সবসময় প্রস্তুত।',
        options: ['অর্ডার করতে চাই', 'অর্ডার কোথায়?', 'সহায়তা চাই'],
      };
    }

    setMessages((prev) => [...prev, userMsg, botResponse]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    handleOptionClick(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Liquid Glass Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-[90vw] sm:w-96 max-h-[540px] mb-3 rounded-3xl bg-white/95 dark:bg-[#061522]/95 backdrop-blur-2xl border border-sky-300 dark:border-cyan-400/30 shadow-[0_20px_60px_rgba(15,39,59,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden text-slate-900 dark:text-white relative transition-colors"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-sky-100 via-blue-50 to-amber-50 dark:from-[#0B2233] dark:to-[#061522] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#0B2233] border border-sky-300 dark:border-cyan-400/40 flex items-center justify-center p-1 shadow-sm">
                  <CharacterChatbotMascot isOpen={true} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-serif">
                    <span>দরকার সহায়ক</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[11px] text-sky-800 dark:text-cyan-300 font-medium">স্মার্ট পার্সোনাল ডেলিভারি অ্যাসিস্ট্যান্ট</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Badge / Info ribbon */}
            <div className="px-4 py-2 bg-sky-50/80 dark:bg-[#082338]/80 border-b border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] text-sky-900 dark:text-cyan-200 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C69A45]" /> ভাওয়াল মির্জাপুর (৫ কিমি)
              </span>
              <span className="font-bold text-[#C69A45]">সর্বোচ্চ ৳৬০</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[300px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-100 dark:bg-[#0B2233]/90 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white/90 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}

                    {/* Bot Action Buttons */}
                    {msg.actionType === 'order' && onOpenOrder && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          onOpenOrder();
                        }}
                        className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#C69A45] hover:brightness-105 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>অর্ডার শুরু করুন</span>
                      </button>
                    )}

                    {msg.actionType === 'track' && onOpenTrack && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          onOpenTrack();
                        }}
                        className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>লাইভ ট্র্যাকিং দেখুন</span>
                      </button>
                    )}

                    {msg.actionType === 'call' && (
                      <a
                        href={`tel:${OFFICIAL_CONTACT.phone}`}
                        className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>সরাসরি কল দিন ({OFFICIAL_CONTACT.phoneDisplay})</span>
                      </a>
                    )}

                    {msg.actionType === 'whatsapp' && (
                      <a
                        href={OFFICIAL_CONTACT.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>হোয়াটসঅ্যাপে মেসেজ পাঠান</span>
                      </a>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleOptionClick(opt)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-[#082338] hover:bg-sky-50 dark:hover:bg-cyan-950/80 border border-sky-300 dark:border-cyan-500/30 text-sky-800 dark:text-cyan-200 hover:text-sky-950 dark:hover:text-white transition-all cursor-pointer shadow-sm font-medium"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-[#0B2233]/90 border-t border-slate-200 dark:border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="প্রশ্ন বা দরকার লিখুন..."
                className="flex-1 bg-slate-100 dark:bg-[#061522] border border-slate-200 dark:border-white/15 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-sky-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-[#0284c7] hover:bg-sky-500 disabled:opacity-40 text-white font-bold cursor-pointer transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mascot Trigger Button with Text Directly Under Character (Requirement 26) */}
      <motion.button
        type="button"
        id="dorkar-assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="group flex flex-col items-center justify-center cursor-pointer focus:outline-none"
        title="দরকার সহায়ক — পার্সোনাল ডেলিভারি অ্যাসিস্ট্যান্ট"
      >
        {/* Top Mascot Icon with Liquid Glass Glow Ring */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-white via-sky-50 to-amber-50 dark:from-[#0B2233] dark:via-[#061522] dark:to-[#0284c7]/40 backdrop-blur-xl border border-sky-300 dark:border-cyan-400/50 shadow-[0_8px_30px_rgba(2,132,199,0.3)] dark:shadow-[0_8px_30px_rgba(6,182,212,0.45)] flex items-center justify-center relative group-hover:border-sky-400 dark:group-hover:border-cyan-300 transition-all">
          <CharacterChatbotMascot isOpen={isOpen} />
          
          {/* Notification Ping Badge */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-500 border border-white" />
          </span>
        </div>

        {/* Text Directly UNDER the Mascot (Requirement 26) */}
        <div className="mt-1 px-3 py-0.5 rounded-full bg-white/95 dark:bg-[#061522]/95 backdrop-blur-md border border-sky-300 dark:border-cyan-400/40 shadow-sm">
          <span className="text-[11px] font-bold tracking-tight text-slate-800 dark:text-cyan-200 group-hover:text-sky-700 dark:group-hover:text-white transition-colors">
            দরকার সহায়ক
          </span>
        </div>
      </motion.button>
    </div>
  );
};
