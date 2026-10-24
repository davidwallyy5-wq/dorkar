import React from 'react';
import { motion } from 'motion/react';
import { Package, Sparkles, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

export const CuteDeliveryOrderVisual: React.FC = () => {
  return (
    <div className="relative w-full py-4 flex flex-col items-center justify-center select-none">
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-violet-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating 3D/2.5D Animated Character Card */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* SVG Illustration of Cute Delivery Character Handing Package */}
        <div className="relative">
          {/* Subtle Speed / Route Aura */}
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />

          <svg
            className="w-48 h-40 sm:w-56 sm:h-44 drop-shadow-[0_15px_30px_rgba(0,210,255,0.25)]"
            viewBox="0 0 200 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground Shadow */}
            <ellipse cx="100" cy="148" rx="65" ry="8" fill="#040c14" opacity="0.6" />

            {/* Glowing route line on floor */}
            <path
              d="M30 148 Q100 142 170 148"
              stroke="url(#orderRouteGrad)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Cute Rider Character */}
            {/* Scooter Front Wheel / Stand */}
            <circle cx="55" cy="138" r="14" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2.5" />
            <circle cx="55" cy="138" r="4" fill="#38bdf8" />
            <path d="M55 138 L72 110" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />

            {/* Rider Legs */}
            <path d="M88 120 L92 145" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
            <path d="M102 120 L108 145" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />

            {/* Rider Torso & Jacket */}
            <path
              d="M80 82 Q96 76 112 82 L110 120 Q95 125 82 120 Z"
              fill="url(#orderJacketGrad)"
            />
            {/* Warm Gold Zipper / Stripe */}
            <line x1="96" y1="80" x2="96" y2="122" stroke="#C69A45" strokeWidth="2" />

            {/* Rider Arms Extending Forward to Present the Box */}
            <path
              d="M92 90 Q118 85 136 94"
              stroke="#0369a1"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Head & Helmet */}
            <circle cx="96" cy="58" r="16" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
            {/* Helmet Visor */}
            <path
              d="M92 55 Q106 52 110 61 Q106 68 94 68 Z"
              fill="#082f49"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <ellipse cx="102" cy="60" rx="2.5" ry="3" fill="#38bdf8" />
            <circle cx="103" cy="59" r="1" fill="#ffffff" />
            {/* Cute antenna */}
            <circle cx="86" cy="46" r="3" fill="#C69A45" />

            {/* Floating Luxury Delivery Package Held in Hands */}
            <g transform="translate(126, 75)">
              <rect
                x="0"
                y="0"
                width="42"
                height="38"
                rx="6"
                fill="url(#boxBodyGrad)"
                stroke="#C69A45"
                strokeWidth="2"
              />
              {/* Golden Ribbon Bands */}
              <rect x="18" y="0" width="6" height="38" fill="#C69A45" />
              <rect x="0" y="16" width="42" height="6" fill="#C69A45" />
              {/* Bow on Top */}
              <circle cx="21" cy="-2" r="5" fill="#ffe599" stroke="#C69A45" strokeWidth="1.5" />
            </g>

            {/* Floating Sparkle Particles */}
            <circle cx="175" cy="65" r="2" fill="#ffe599" />
            <circle cx="140" cy="50" r="1.5" fill="#38bdf8" />
            <circle cx="75" cy="45" r="2" fill="#38bdf8" />

            {/* Defs */}
            <defs>
              <linearGradient id="orderRouteGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="orderJacketGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="boxBodyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0f2a42" />
                <stop offset="100%" stopColor="#061522" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Live Badge */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#061522]/95 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-[11px] font-semibold flex items-center gap-1.5 shadow-lg whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />
            <span>সরাসরি বিশ্বস্ত ডেলিভারি</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
