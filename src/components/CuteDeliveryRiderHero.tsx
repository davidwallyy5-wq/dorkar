import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Sparkles, CheckCircle2, Navigation, Zap } from 'lucide-react';

interface CuteDeliveryRiderHeroProps {
  onAnimationComplete?: () => void;
}

export const CuteDeliveryRiderHero: React.FC<CuteDeliveryRiderHeroProps> = () => {
  const [currentPositionStage, setCurrentPositionStage] = useState<'cruising' | 'at_destination'>('cruising');

  return (
    <div className="relative w-full max-w-4xl mx-auto h-36 sm:h-44 overflow-hidden pointer-events-none select-none my-1">
      {/* 1. Futuristic ground route track line */}
      <div className="absolute bottom-6 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#0284c7]/40 dark:via-cyan-400/40 to-transparent">
        {/* Animated route pulse dashes */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(2,132,199,0.7)_50%,transparent_100%)] dark:bg-[linear-gradient(90deg,transparent_0%,rgba(6,182,212,0.8)_50%,transparent_100%)] animate-[pulse_2.2s_ease-in-out_infinite]" />
      </div>

      {/* 2. Destination Target Pin on the Right */}
      <div className="absolute bottom-6 right-6 sm:right-16 flex flex-col items-center z-10">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C69A45] to-[#fde047] flex items-center justify-center text-[#061522] shadow-[0_0_20px_rgba(198,154,69,0.6)]">
            <MapPin className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-[#C69A45] animate-ping" />
        </motion.div>
        <span className="text-[10px] font-bold text-[#0284c7] dark:text-[#C69A45] tracking-wider mt-1 uppercase font-mono">
          আপনার বাড়ি / লোকেশন
        </span>
      </div>

      {/* 3. Starting Hub / Store Pin on the Left */}
      <div className="absolute bottom-6 left-6 sm:left-14 flex flex-col items-center opacity-80 z-10">
        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-[#0B2233] border border-sky-400/50 flex items-center justify-center text-[#0284c7] dark:text-cyan-300 shadow-sm">
          <Navigation className="w-3 h-3 rotate-45" />
        </div>
        <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 tracking-wider mt-1">
          ভাওয়াল মির্জাপুর বাজার
        </span>
      </div>

      {/* 4. The Cute Delivery Rider Traveling smoothly LEFT -> CENTER -> RIGHT */}
      <motion.div
        animate={{
          x: ['-5%', '42%', '78%', '42%', '-5%'],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.45, 0.5, 0.95, 1],
        }}
        className="absolute bottom-5 left-0 flex items-center z-20"
      >
        <motion.div
          animate={{
            y: [0, -4, 0],
            rotate: [0, 0.7, 0],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative flex items-center"
        >
          {/* Glowing Speed Trail Behind Rider */}
          <div className="absolute -left-12 bottom-3 w-16 h-4 bg-gradient-to-r from-transparent via-[#0284c7]/30 to-[#0284c7]/80 dark:via-cyan-400/30 dark:to-cyan-500/80 rounded-full blur-[2px]" />

          {/* SVG Cute Scooter & Rider Graphic */}
          <svg
            className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-[0_10px_25px_rgba(2,132,199,0.35)] dark:drop-shadow-[0_10px_25px_rgba(0,210,255,0.45)]"
            viewBox="0 0 160 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Scooter Shadow */}
            <ellipse cx="80" cy="128" rx="55" ry="7" fill="#040c14" opacity="0.4" />

            {/* Rear Wheel */}
            <g className="animate-[spin_2.5s_linear_infinite]" style={{ transformOrigin: '35px 115px' }}>
              <circle cx="35" cy="115" r="18" fill="#1e293b" stroke="#0ea5e9" strokeWidth="3" />
              <circle cx="35" cy="115" r="10" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="35" cy="115" r="4" fill="#38bdf8" />
            </g>

            {/* Front Wheel */}
            <g className="animate-[spin_2.5s_linear_infinite]" style={{ transformOrigin: '120px 115px' }}>
              <circle cx="120" cy="115" r="18" fill="#1e293b" stroke="#0ea5e9" strokeWidth="3" />
              <circle cx="120" cy="115" r="10" fill="#0f172a" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="120" cy="115" r="4" fill="#38bdf8" />
            </g>

            {/* Scooter Body Frame */}
            <path
              d="M35 115 L60 115 Q75 115 85 95 L105 75 Q112 68 118 68 L122 68"
              stroke="#0284c7"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Front Fork */}
            <path d="M120 115 L112 68" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />

            {/* Scooter Footboard & Main Chassis */}
            <path
              d="M48 112 Q65 114 85 110 L92 90 Q85 85 60 88 Z"
              fill="url(#scooterGrad)"
            />
            {/* Seat */}
            <path
              d="M45 88 Q60 85 75 88 Q78 92 72 96 L48 96 Q42 92 45 88 Z"
              fill="#0f172a"
              stroke="#0284c7"
              strokeWidth="1.5"
            />

            {/* Handlebar & Headlight */}
            <path d="M110 65 L118 55 Q122 52 128 52" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <circle cx="128" cy="52" r="4" fill="#C69A45" />
            {/* Headlight Beam */}
            <polygon points="126,52 160,35 160,70" fill="url(#lightBeamGrad)" opacity="0.45" />

            {/* Delivery Cargo Box on Rear */}
            <g transform="translate(18, 55)">
              <rect
                x="0"
                y="0"
                width="34"
                height="34"
                rx="6"
                fill="url(#boxGrad)"
                stroke="#C69A45"
                strokeWidth="2"
              />
              <rect x="14" y="0" width="6" height="34" fill="#C69A45" opacity="0.8" />
              <rect x="0" y="14" width="34" height="6" fill="#C69A45" opacity="0.8" />
              <circle cx="17" cy="17" r="5" fill="#061522" stroke="#ffe599" strokeWidth="1" />
              <text x="17" y="19" fill="#C69A45" fontSize="5" fontWeight="bold" textAnchor="middle">দ</text>
            </g>

            {/* Cute Rider Character Body */}
            <path d="M68 92 Q78 95 82 108" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
            <path
              d="M62 65 Q72 60 82 66 L86 85 Q75 92 64 88 Z"
              fill="url(#jacketGrad)"
            />
            <circle cx="74" cy="74" r="3" fill="#C69A45" />
            <path d="M72 68 Q90 68 114 58" stroke="#0369a1" strokeWidth="5" strokeLinecap="round" />
            <circle cx="114" cy="58" r="3.5" fill="#f8fafc" />

            {/* Cute Head & Helmet */}
            <circle cx="78" cy="45" r="14" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
            <path
              d="M74 42 Q86 40 90 47 Q88 53 76 53 Z"
              fill="#082f49"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <ellipse cx="82" cy="46" rx="2.5" ry="3" fill="#38bdf8" />
            <circle cx="83" cy="45" r="1" fill="#ffffff" />
            <circle cx="70" cy="34" r="3" fill="#C69A45" />

            {/* Gradients */}
            <defs>
              <linearGradient id="scooterGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#082f49" />
              </linearGradient>
              <linearGradient id="jacketGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0b2233" />
                <stop offset="100%" stopColor="#061522" />
              </linearGradient>
              <linearGradient id="lightBeamGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffe599" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#ffe599" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Live Badge Over Rider */}
          <div className="absolute -top-3 left-10 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-[#061522]/95 backdrop-blur-md border border-sky-300 dark:border-cyan-400/40 shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-slate-800 dark:text-cyan-200 whitespace-nowrap">
              দরকার এক্সপ্রেস
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
