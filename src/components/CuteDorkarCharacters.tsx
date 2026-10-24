import React from 'react';
import { motion } from 'motion/react';

// Cohesive Dorkar Makrosha-inspired Palette:
// Royal Blue / Deep Cyan / Warm Golden Cream / Soft Coral / Emerald Mint

/* =========================================================================
   1. MAIN HERO SCOOTER RIDER
   ========================================================================= */
export const CharacterHeroScooter: React.FC<{ isEntered?: boolean; isWaving?: boolean; className?: string }> = ({
  isWaving = false,
  className = '',
}) => {
  return (
    <motion.div
      animate={{ y: [0, -4, 0], rotate: [0, 0.6, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      className={`relative flex items-center select-none ${className}`}
    >
      <svg className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_12px_24px_rgba(6,182,212,0.35)]" viewBox="0 0 160 140" fill="none">
        {/* Ground shadow */}
        <ellipse cx="80" cy="128" rx="56" ry="7" fill="#040c14" opacity="0.35" />
        
        {/* Rear & Front Wheels */}
        <g className="animate-[spin_3.5s_linear_infinite]" style={{ transformOrigin: '36px 115px' }}>
          <circle cx="36" cy="115" r="17" fill="#0f172a" stroke="#0ea5e9" strokeWidth="3" />
          <circle cx="36" cy="115" r="9" fill="#0284c7" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="36" cy="115" r="3.5" fill="#38bdf8" />
        </g>
        <g className="animate-[spin_3.5s_linear_infinite]" style={{ transformOrigin: '122px 115px' }}>
          <circle cx="122" cy="115" r="17" fill="#0f172a" stroke="#0ea5e9" strokeWidth="3" />
          <circle cx="122" cy="115" r="9" fill="#0284c7" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="122" cy="115" r="3.5" fill="#38bdf8" />
        </g>

        {/* Scooter Chassis */}
        <path d="M36 115 L62 115 Q78 115 88 95 L106 74 Q114 66 120 66 L124 66" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
        <path d="M122 115 L114 66" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
        <path d="M48 112 Q66 115 86 110 L94 88 Q86 83 60 86 Z" fill="#0369a1" />
        <path d="M44 87 Q60 84 76 87 Q80 91 72 95 L47 95 Q41 91 44 87 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        
        {/* Handlebar & Gold Headlight */}
        <path d="M112 64 L120 54 Q124 50 130 50" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="130" cy="50" r="4.5" fill="#C69A45" />
        <polygon points="128,50 158,35 158,68" fill="#ffe599" opacity="0.35" />

        {/* Dorkar Delivery Cargo Box */}
        <g transform="translate(18, 54)">
          <rect x="0" y="0" width="34" height="34" rx="6" fill="#0b2233" stroke="#C69A45" strokeWidth="2" />
          <rect x="14" y="0" width="6" height="34" fill="#C69A45" opacity="0.8" />
          <rect x="0" y="14" width="34" height="6" fill="#C69A45" opacity="0.8" />
          <circle cx="17" cy="17" r="5.5" fill="#061522" stroke="#ffe599" strokeWidth="1" />
          <text x="17" y="20" fill="#C69A45" fontSize="6" fontWeight="bold" textAnchor="middle">দ</text>
        </g>

        {/* Rider Legs & Torso */}
        <path d="M68 92 Q78 96 82 108" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" />
        <path d="M62 65 Q72 60 82 66 L86 85 Q75 92 64 88 Z" fill="#0284c7" />
        <circle cx="74" cy="74" r="3" fill="#C69A45" />

        {/* Arm (Waving or Holding) */}
        {isWaving ? (
          <g>
            <path d="M72 68 Q85 55 96 42" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
            <circle cx="96" cy="40" r="4" fill="#fde047" />
          </g>
        ) : (
          <g>
            <path d="M72 68 Q90 68 114 58" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
            <circle cx="114" cy="58" r="3.5" fill="#f8fafc" />
          </g>
        )}

        {/* Cute Head & Helmet */}
        <circle cx="78" cy="45" r="14" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
        <path d="M74 42 Q86 40 90 47 Q88 53 76 53 Z" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
        <ellipse cx="82" cy="46" rx="2.5" ry="3" fill="#38bdf8" />
        <circle cx="83" cy="45" r="1" fill="#ffffff" />
        <circle cx="70" cy="34" r="3" fill="#C69A45" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   2. FEMALE / SPEED COURIER RIDER (With Pink/Coral Visor & Cap)
   ========================================================================= */
export const CharacterFemaleRider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -3, 0], rotate: [0, -0.5, 0] }}
      transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
      className={`relative flex items-center select-none ${className}`}
    >
      <svg className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-[0_10px_20px_rgba(244,114,182,0.3)]" viewBox="0 0 150 130" fill="none">
        <ellipse cx="75" cy="120" rx="50" ry="6" fill="#040c14" opacity="0.3" />
        {/* Wheels */}
        <circle cx="34" cy="108" r="15" fill="#1e1b4b" stroke="#ec4899" strokeWidth="2.5" />
        <circle cx="116" cy="108" r="15" fill="#1e1b4b" stroke="#ec4899" strokeWidth="2.5" />
        <path d="M34 108 L60 108 Q74 108 84 90 L100 70 L116 108" stroke="#db2777" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* Parcel box */}
        <rect x="16" y="52" width="30" height="30" rx="5" fill="#be185d" stroke="#fbcfe8" strokeWidth="1.5" />
        <path d="M16 67 L46 67 M31 52 L31 82" stroke="#fbcfe8" strokeWidth="2" />
        {/* Rider */}
        <path d="M60 62 Q70 56 80 62 L82 82 Q72 88 62 84 Z" fill="#9d174d" />
        {/* Cute Head & Ponytail */}
        <circle cx="74" cy="42" r="13" fill="#be185d" stroke="#f472b6" strokeWidth="2" />
        <path d="M62 44 Q52 46 54 58 Q60 56 64 50 Z" fill="#831843" />
        <path d="M70 40 Q82 38 86 44 Q84 49 72 49 Z" fill="#500724" />
        <ellipse cx="78" cy="44" rx="2.5" ry="3" fill="#f472b6" />
        <circle cx="79" cy="43" r="1" fill="#ffffff" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   3. TINY FAST RIDER (Agile Mini Courier)
   ========================================================================= */
export const CharacterTinyFastRider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -5, 0], x: [0, 2, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none ${className}`}
    >
      <svg className="w-18 h-18 sm:w-22 sm:h-22 drop-shadow-[0_8px_18px_rgba(16,185,129,0.35)]" viewBox="0 0 100 90" fill="none">
        <ellipse cx="50" cy="82" rx="35" ry="4" fill="#040c14" opacity="0.3" />
        <circle cx="24" cy="74" r="11" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
        <circle cx="76" cy="74" r="11" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
        <path d="M24 74 L45 74 Q56 74 64 60 L76 74" stroke="#059669" strokeWidth="4" strokeLinecap="round" fill="none" />
        <rect x="12" y="38" width="22" height="22" rx="4" fill="#047857" stroke="#6ee7b7" strokeWidth="1.5" />
        <circle cx="56" cy="30" r="11" fill="#065f46" stroke="#34d399" strokeWidth="1.8" />
        <ellipse cx="60" cy="31" rx="2" ry="2.5" fill="#34d399" />
        <circle cx="61" cy="30" r="0.8" fill="#ffffff" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   4. PACKAGE CARRIER (Holds parcel in front)
   ========================================================================= */
export const CharacterPackageCarrier: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -5, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none ${className}`}
    >
      <svg className="w-20 h-24 sm:w-24 sm:h-28 drop-shadow-[0_8px_20px_rgba(198,154,69,0.3)]" viewBox="0 0 100 120" fill="none">
        <ellipse cx="50" cy="112" rx="35" ry="5" fill="#040c14" opacity="0.35" />
        <ellipse cx="40" cy="108" rx="7" ry="4" fill="#0f172a" />
        <ellipse cx="60" cy="108" rx="7" ry="4" fill="#0f172a" />
        <rect x="30" y="58" width="40" height="46" rx="20" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <rect x="32" y="70" width="36" height="28" rx="4" fill="#C69A45" stroke="#fef08a" strokeWidth="1.5" />
        <rect x="47" y="70" width="6" height="28" fill="#ffe599" />
        <rect x="32" y="81" width="36" height="5" fill="#ffe599" />
        <circle cx="32" cy="84" r="4" fill="#f8fafc" />
        <circle cx="68" cy="84" r="4" fill="#f8fafc" />
        <circle cx="50" cy="38" r="18" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
        <path d="M42 34 Q58 32 60 42 Q56 48 42 46 Z" fill="#082f49" stroke="#38bdf8" strokeWidth="1.2" />
        <ellipse cx="51" cy="40" rx="3" ry="3.5" fill="#38bdf8" />
        <circle cx="52" cy="38" r="1.2" fill="#ffffff" />
        <circle cx="50" cy="20" r="3" fill="#C69A45" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   5. SHOPPING HELPER (With grocery bag / fresh fruits)
   ========================================================================= */
export const CharacterShoppingHelper: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -5, 0], rotate: [0, 1.5, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none ${className}`}
    >
      <svg className="w-22 h-26 sm:w-26 sm:h-30 drop-shadow-[0_8px_20px_rgba(16,185,129,0.3)]" viewBox="0 0 110 130" fill="none">
        <ellipse cx="55" cy="122" rx="36" ry="5" fill="#040c14" opacity="0.35" />
        <ellipse cx="44" cy="118" rx="8" ry="4" fill="#0f172a" />
        <ellipse cx="66" cy="118" rx="8" ry="4" fill="#0f172a" />
        <rect x="34" y="60" width="42" height="52" rx="20" fill="#047857" stroke="#34d399" strokeWidth="2" />
        <g transform="translate(64, 70)">
          <path d="M0 8 Q10 2 20 8 L18 26 Q10 30 2 26 Z" fill="#10b981" stroke="#a7f3d0" strokeWidth="1.5" />
          <path d="M4 8 Q10 -2 16 8" stroke="#a7f3d0" strokeWidth="2" fill="none" />
          <circle cx="8" cy="6" r="4" fill="#fb7185" />
          <circle cx="14" cy="5" r="4" fill="#fde047" />
        </g>
        <circle cx="55" cy="38" r="18" fill="#065f46" stroke="#34d399" strokeWidth="2" />
        <path d="M46 34 Q62 32 66 42 Q62 48 46 46 Z" fill="#022c22" stroke="#34d399" strokeWidth="1.2" />
        <ellipse cx="57" cy="40" rx="3" ry="3.5" fill="#34d399" />
        <circle cx="58" cy="38" r="1.2" fill="#ffffff" />
        <circle cx="55" cy="19" r="3" fill="#10b981" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   6. SMARTPHONE HELPER (Step 1 of How it works / Order)
   ========================================================================= */
export const CharacterWithPhone: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none ${className}`}
    >
      <svg className="w-22 h-26 sm:w-26 sm:h-30 drop-shadow-[0_8px_20px_rgba(6,182,212,0.3)]" viewBox="0 0 110 130" fill="none">
        <ellipse cx="55" cy="122" rx="36" ry="5" fill="#040c14" opacity="0.35" />
        <ellipse cx="44" cy="118" rx="8" ry="4" fill="#0f172a" />
        <ellipse cx="66" cy="118" rx="8" ry="4" fill="#0f172a" />
        <rect x="34" y="60" width="42" height="52" rx="20" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <g transform="translate(62, 60) rotate(-10)">
          <rect x="0" y="0" width="22" height="34" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="2" y="3" width="18" height="28" rx="2" fill="#06b6d4" opacity="0.85" />
          <path d="M7 16 L10 19 L16 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <circle cx="62" cy="78" r="4" fill="#f8fafc" />
        <circle cx="55" cy="38" r="18" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
        <path d="M46 34 Q62 32 66 42 Q62 48 46 46 Z" fill="#082f49" stroke="#38bdf8" strokeWidth="1.2" />
        <ellipse cx="58" cy="40" rx="3" ry="3.5" fill="#38bdf8" />
        <circle cx="59" cy="38" r="1.2" fill="#ffffff" />
        <circle cx="55" cy="19" r="3" fill="#C69A45" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   7. WAREHOUSE HELPER (Carrying stack of 2 boxes)
   ========================================================================= */
export const CharacterWarehouseHelper: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -5, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none ${className}`}
    >
      <svg className="w-22 h-26 sm:w-26 sm:h-30 drop-shadow-[0_8px_20px_rgba(234,179,8,0.3)]" viewBox="0 0 110 130" fill="none">
        <ellipse cx="55" cy="122" rx="36" ry="5" fill="#040c14" opacity="0.35" />
        <rect x="34" y="60" width="42" height="52" rx="20" fill="#7c2d12" stroke="#fde047" strokeWidth="2" />
        {/* Two stacked boxes */}
        <g transform="translate(58, 56)">
          <rect x="0" y="16" width="32" height="22" rx="3" fill="#C69A45" stroke="#fef08a" strokeWidth="1.2" />
          <rect x="3" y="0" width="26" height="18" rx="3" fill="#d97706" stroke="#fef08a" strokeWidth="1.2" />
        </g>
        <circle cx="55" cy="38" r="18" fill="#451a03" stroke="#fde047" strokeWidth="2" />
        <ellipse cx="58" cy="40" rx="3" ry="3.5" fill="#fde047" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   8. GPS NAVIGATION HELPER (Holding glowing map pin)
   ========================================================================= */
export const CharacterGpsHelper: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none ${className}`}
    >
      <svg className="w-22 h-26 sm:w-26 sm:h-30 drop-shadow-[0_8px_20px_rgba(6,182,212,0.4)]" viewBox="0 0 110 130" fill="none">
        <ellipse cx="55" cy="122" rx="36" ry="5" fill="#040c14" opacity="0.35" />
        <rect x="34" y="60" width="42" height="52" rx="20" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        {/* Big GPS Map Pin */}
        <g transform="translate(68, 52)">
          <path d="M12 0 C5.37 0 0 5.37 0 12 C0 21 12 34 12 34 C12 34 24 21 24 12 C24 5.37 18.63 0 12 0 Z" fill="#ef4444" stroke="#fecaca" strokeWidth="1.5" />
          <circle cx="12" cy="11" r="4.5" fill="#ffffff" />
        </g>
        <circle cx="55" cy="38" r="18" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
        <ellipse cx="57" cy="40" rx="3" ry="3.5" fill="#38bdf8" />
        <circle cx="58" cy="38" r="1.2" fill="#ffffff" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   9. PACKAGE MASCOT (Sitting peacefully on a Dorkar Box)
   ========================================================================= */
export const CharacterSittingOnBox: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none ${className}`}
    >
      <svg className="w-24 h-28 sm:w-28 sm:h-32 drop-shadow-[0_10px_25px_rgba(198,154,69,0.3)]" viewBox="0 0 100 120" fill="none">
        <ellipse cx="50" cy="114" rx="36" ry="5" fill="#040c14" opacity="0.35" />
        <rect x="22" y="66" width="56" height="46" rx="8" fill="#0b2233" stroke="#C69A45" strokeWidth="2.5" />
        <rect x="46" y="66" width="8" height="46" fill="#C69A45" />
        <rect x="22" y="85" width="56" height="8" fill="#C69A45" />
        <circle cx="50" cy="89" r="6" fill="#061522" stroke="#ffe599" strokeWidth="1.2" />
        <text x="50" y="92" fill="#C69A45" fontSize="7" fontWeight="bold" textAnchor="middle">দ</text>
        <rect x="36" y="38" width="28" height="30" rx="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.8" />
        <path d="M38 64 L36 78 M60 64 L62 78" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="50" cy="24" r="14" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
        <ellipse cx="52" cy="26" rx="2.5" ry="3" fill="#38bdf8" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   10. CUSTOMER HELPER (Doorstep recipient / helper)
   ========================================================================= */
export const CharacterCustomerHelper: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -4, 0], scale: [1, 1.02, 1] }}
      transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none ${className}`}
    >
      <svg className="w-22 h-26 sm:w-26 sm:h-30 drop-shadow-[0_8px_20px_rgba(234,179,8,0.3)]" viewBox="0 0 110 130" fill="none">
        <ellipse cx="55" cy="122" rx="36" ry="5" fill="#040c14" opacity="0.35" />
        <rect x="34" y="60" width="42" height="52" rx="20" fill="#b45309" stroke="#fde047" strokeWidth="2" />
        <g transform="translate(56, 66)">
          <rect x="0" y="0" width="30" height="26" rx="4" fill="#C69A45" stroke="#fef08a" strokeWidth="1.5" />
          <rect x="12" y="0" width="5" height="26" fill="#fef08a" />
          <circle cx="15" cy="-2" r="3" fill="#ffe599" />
        </g>
        <circle cx="55" cy="38" r="18" fill="#78350f" stroke="#fde047" strokeWidth="2" />
        <ellipse cx="58" cy="40" rx="3" ry="3.5" fill="#fde047" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   11. SPEED COURIER RUNNER
   ========================================================================= */
export const CharacterRunningDeliverer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none ${className}`}
    >
      <svg className="w-22 h-26 sm:w-26 sm:h-30 drop-shadow-[0_8px_20px_rgba(6,182,212,0.35)]" viewBox="0 0 110 120" fill="none">
        <ellipse cx="55" cy="114" rx="34" ry="4" fill="#040c14" opacity="0.35" />
        <path d="M42 86 L28 108 M64 86 L80 102 L88 98" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        <rect x="36" y="52" width="38" height="42" rx="18" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" transform="rotate(8 55 73)" />
        <g transform="translate(66, 56)">
          <rect x="0" y="0" width="28" height="24" rx="4" fill="#C69A45" stroke="#fef08a" strokeWidth="1.5" />
          <rect x="11" y="0" width="5" height="24" fill="#ffe599" />
        </g>
        <circle cx="62" cy="34" r="16" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
        <ellipse cx="64" cy="36" rx="3" ry="3.5" fill="#38bdf8" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   12. DORKAR SHOHAYOK CHATBOT MASCOT
   ========================================================================= */
export const CharacterChatbotMascot: React.FC<{ isOpen?: boolean; className?: string }> = ({
  isOpen = false,
  className = '',
}) => {
  return (
    <motion.div
      animate={{
        y: isOpen ? 0 : [0, -4, 0],
        scale: isOpen ? 1.05 : [1, 1.03, 1],
      }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      <svg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_6px_16px_rgba(6,182,212,0.6)]" viewBox="0 0 60 60" fill="none">
        <circle cx="30" cy="32" r="20" fill="#0369a1" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M20 27 Q38 24 42 34 Q36 41 20 39 Z" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
        <ellipse cx="32" cy="33" rx="3" ry="3.5" fill="#38bdf8" />
        <circle cx="33" cy="31.5" r="1.2" fill="#ffffff" />
        <circle cx="30" cy="10" r="3.5" fill="#C69A45" />
        <line x1="30" y1="10" x2="30" y2="15" stroke="#C69A45" strokeWidth="2" />
        <circle cx="23" cy="42" r="2" fill="#f472b6" opacity="0.7" />
        <circle cx="39" cy="42" r="2" fill="#f472b6" opacity="0.7" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   13. CELEBRATION RIDER (Order Success Animation)
   ========================================================================= */
export const CharacterCelebrationRider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, y: 15 }}
      animate={{ scale: [1, 1.06, 1], y: [0, -6, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      className={`relative flex flex-col items-center select-none ${className}`}
    >
      <div className="relative">
        {/* Star bursts */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-3 -right-3 text-amber-400 text-xl font-bold"
        >
          ✨
        </motion.div>
        <CharacterHeroScooter isWaving={true} />
      </div>
    </motion.div>
  );
};

/* =========================================================================
   14. CROSSING RIDER (Travels LEFT -> RIGHT across screen!)
   ========================================================================= */
export const CharacterCrossingScooterRider: React.FC<{ className?: string; duration?: number }> = ({
  className = '',
  duration = 18,
}) => {
  return (
    <div className={`w-full overflow-hidden pointer-events-none select-none relative h-20 sm:h-24 ${className}`}>
      {/* Route dashed line */}
      <div className="absolute bottom-4 left-0 right-0 h-[1.5px] border-b border-dashed border-cyan-500/30" />
      <motion.div
        initial={{ x: '-15%' }}
        animate={{ x: '115%' }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-1 flex items-center"
      >
        <CharacterHeroScooter />
      </motion.div>
    </div>
  );
};

/* =========================================================================
   15. CROSSING CARRIER WALKING (Travels RIGHT -> LEFT across screen!)
   ========================================================================= */
export const CharacterBoxCarrierWalking: React.FC<{ className?: string; duration?: number }> = ({
  className = '',
  duration = 22,
}) => {
  return (
    <div className={`w-full overflow-hidden pointer-events-none select-none relative h-24 sm:h-28 ${className}`}>
      <div className="absolute bottom-4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C69A45]/20 to-transparent" />
      <motion.div
        initial={{ x: '115%' }}
        animate={{ x: '-15%' }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-2 flex items-center"
      >
        <div className="flex items-center gap-2">
          <CharacterPackageCarrier />
          <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#061522]/90 border border-[#C69A45]/40 text-[#C69A45] text-[10px] font-bold shadow-md whitespace-nowrap">
            ডেলিভারি চলছে...
          </span>
        </div>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   16. EASTER EGG: PEEKING CHARACTER (Behind Cards)
   ========================================================================= */
export const CharacterPeeking: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none ${className}`}
    >
      <svg className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_6px_16px_rgba(6,182,212,0.4)]" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="22" fill="#0369a1" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M28 36 Q48 33 54 44 Q48 52 28 48 Z" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
        <ellipse cx="44" cy="42" rx="3.5" ry="4" fill="#38bdf8" />
        <circle cx="45" cy="40" r="1.5" fill="#ffffff" />
        <circle cx="40" cy="16" r="4" fill="#C69A45" />
        <circle cx="24" cy="62" r="5" fill="#f8fafc" />
        <circle cx="56" cy="62" r="5" fill="#f8fafc" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   17. EASTER EGG: CLIMBING / HANGING ROUTE CHARACTER
   ========================================================================= */
export const CharacterHangingRoute: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ rotate: [-6, 6, -6] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: 'top center' }}
      className={`select-none ${className}`}
    >
      <svg className="w-16 h-20 drop-shadow-md" viewBox="0 0 70 90" fill="none">
        {/* Rope */}
        <line x1="35" y1="0" x2="35" y2="28" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 2" />
        {/* Hands on rope */}
        <circle cx="35" cy="28" r="4" fill="#f8fafc" />
        <circle cx="35" cy="48" r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        <circle cx="35" cy="38" r="12" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
        <ellipse cx="37" cy="39" rx="2.5" ry="3" fill="#38bdf8" />
      </svg>
    </motion.div>
  );
};

/* =========================================================================
   18. WAVING EDGE CHARACTER (For Support Card / Contact)
   ========================================================================= */
export const CharacterWavingEdge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ y: [0, -6, 0], rotate: [-2, 4, -2] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className={`select-none ${className}`}
    >
      <svg className="w-16 h-16 drop-shadow-[0_6px_16px_rgba(6,182,212,0.4)]" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="42" r="20" fill="#0369a1" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M28 38 Q48 35 54 46 Q48 54 28 50 Z" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
        <ellipse cx="44" cy="44" rx="3" ry="3.5" fill="#38bdf8" />
        <circle cx="45" cy="42" r="1.2" fill="#ffffff" />
        <circle cx="40" cy="18" r="3.5" fill="#C69A45" />
        {/* Waving hand */}
        <motion.g
          animate={{ rotate: [-20, 20, -20] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '60px 35px' }}
        >
          <path d="M54 38 Q64 26 66 22" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="66" cy="21" r="3" fill="#fde047" />
        </motion.g>
      </svg>
    </motion.div>
  );
};
