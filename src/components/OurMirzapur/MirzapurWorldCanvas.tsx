import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Sparkles,
  Navigation,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Bike,
  Sun,
  Moon,
  Info,
  CheckCircle2,
  Package,
} from 'lucide-react';
import {
  MirzapurLandmark,
  MirzapurCharacter,
  MirzapurRouteRider,
  LandmarkCategory,
} from './types';
import {
  MIRZAPUR_LANDMARKS,
  MIRZAPUR_CHARACTERS,
  INITIAL_ROUTE_RIDERS,
  DEFAULT_DELIVERY_STEPS,
} from './mirzapurData';
import {
  CharacterHeroScooter,
  CharacterFemaleRider,
  CharacterTinyFastRider,
  CharacterPackageCarrier,
  CharacterShoppingHelper,
  CharacterWithPhone,
  CharacterWarehouseHelper,
  CharacterGpsHelper,
  CharacterChatbotMascot,
  CharacterCustomerHelper,
  CharacterRunningDeliverer,
  CharacterCelebrationRider,
} from '../CuteDorkarCharacters';

interface MirzapurWorldCanvasProps {
  isDarkMode: boolean;
  selectedCategory: LandmarkCategory | 'all' | 'delivery';
  onSelectLandmark: (landmark: MirzapurLandmark) => void;
  userCoords?: { latitude: number; longitude: number } | null;
  activeOrder?: any | null;
  showDeliverySimulation?: boolean;
  onToggleDeliverySimulation?: () => void;
}

export const MirzapurWorldCanvas: React.FC<MirzapurWorldCanvasProps> = ({
  isDarkMode,
  selectedCategory,
  onSelectLandmark,
  userCoords,
  activeOrder,
  showDeliverySimulation = false,
  onToggleDeliverySimulation,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedCharacter, setSelectedCharacter] = useState<MirzapurCharacter | null>(null);
  const [selectedRider, setSelectedRider] = useState<MirzapurRouteRider | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<MirzapurLandmark | null>(null);
  const [simulationStepIndex, setSimulationStepIndex] = useState(0);
  const [customTimeOfDay, setCustomTimeOfDay] = useState<'system' | 'day' | 'night'>('system');

  const containerRef = useRef<HTMLDivElement>(null);

  const effectiveDarkMode =
    customTimeOfDay === 'night' ? true : customTimeOfDay === 'day' ? false : isDarkMode;

  // Auto step through delivery simulation when activated
  useEffect(() => {
    if (!showDeliverySimulation) return;
    const interval = setInterval(() => {
      setSimulationStepIndex((prev) => (prev + 1) % DEFAULT_DELIVERY_STEPS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [showDeliverySimulation]);

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    // Avoid pan start when clicking on interactive buttons/markers
    if ((e.target as HTMLElement).closest('button, [data-interactive="true"]')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: Math.max(-200, Math.min(200, e.clientX - dragStart.x)),
      y: Math.max(-150, Math.min(150, e.clientY - dragStart.y)),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch pan controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPanOffset({
      x: Math.max(-200, Math.min(200, touch.clientX - dragStart.x)),
      y: Math.max(-150, Math.min(150, touch.clientY - dragStart.y)),
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedCharacter(null);
    setSelectedRider(null);
  };

  const filteredLandmarks = MIRZAPUR_LANDMARKS.filter((landmark) => {
    if (selectedCategory === 'all' || selectedCategory === 'delivery') return true;
    return landmark.category === selectedCategory;
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[520px] sm:h-[620px] lg:h-[700px] rounded-3xl overflow-hidden select-none border border-slate-200/80 dark:border-white/10 shadow-2xl transition-colors duration-500 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        background: effectiveDarkMode
          ? 'linear-gradient(180deg, #051321 0%, #092032 50%, #0a273d 100%)'
          : 'linear-gradient(180deg, #bae6fd 0%, #e0f2fe 35%, #f1f5f9 100%)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. TOP INTERACTIVE TOOLBAR (Zoom, Time, Simulation, Reset) */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Side: Mirzapur Badge */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-white/80 dark:bg-[#061522]/85 backdrop-blur-md border border-slate-200 dark:border-white/15 text-xs font-bold shadow-md flex items-center gap-2 text-slate-800 dark:text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-serif">মির্জাপুর মিনি-ওয়ার্ল্ড</span>
            <span className="hidden sm:inline text-[10px] text-slate-500 dark:text-white/60 font-mono">
              2.5D LIVE
            </span>
          </div>

          {/* Time of Day Switcher */}
          <div className="hidden sm:flex items-center rounded-2xl bg-white/80 dark:bg-[#061522]/85 backdrop-blur-md border border-slate-200 dark:border-white/15 p-1 shadow-md">
            <button
              type="button"
              onClick={() => setCustomTimeOfDay('day')}
              className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                effectiveDarkMode
                  ? 'text-slate-400 hover:text-amber-400'
                  : 'bg-amber-400/20 text-amber-600 font-bold'
              }`}
              title="দিনের দৃশ্য (Day View)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCustomTimeOfDay('night')}
              className={`p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                effectiveDarkMode
                  ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-cyan-500'
              }`}
              title="রাতের দৃশ্য (Night View)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Map Navigation Tools */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/85 dark:bg-[#061522]/90 backdrop-blur-md border border-slate-200 dark:border-white/15 p-1.5 rounded-2xl shadow-lg">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs cursor-pointer transition-colors"
            title="জুম ইন (+)"
            aria-label="জুম ইন"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs cursor-pointer transition-colors"
            title="জুম আউট (-)"
            aria-label="জুম আউট"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs cursor-pointer transition-colors"
            title="ভিউ রিসেট করুন"
            aria-label="ভিউ রিসেট"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. THE MAIN ISOMETRIC SCENE CONTAINER (Scales & Pans) */}
      <div
        className="w-full h-full origin-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
        }}
      >
        {/* SKY / CELESTIAL BACKGROUND LAYER */}
        <div className="absolute inset-0 pointer-events-none">
          {effectiveDarkMode ? (
            /* NIGHT SKY: Stars, Glowing Moon & Night Clouds */
            <>
              {/* Moon */}
              <div className="absolute top-10 right-16 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-100 via-amber-200 to-white shadow-[0_0_50px_rgba(254,240,138,0.6)] flex items-center justify-center opacity-90">
                <div className="w-3 h-3 rounded-full bg-amber-300/40 absolute top-3 left-4" />
                <div className="w-4 h-4 rounded-full bg-amber-300/30 absolute bottom-3 right-4" />
              </div>

              {/* Twinkling Stars */}
              {[
                { top: '8%', left: '12%', size: 'w-1 h-1', delay: '0s' },
                { top: '15%', left: '25%', size: 'w-1.5 h-1.5', delay: '1s' },
                { top: '6%', left: '42%', size: 'w-1 h-1', delay: '1.5s' },
                { top: '18%', left: '60%', size: 'w-2 h-2', delay: '0.5s' },
                { top: '10%', left: '78%', size: 'w-1 h-1', delay: '2s' },
                { top: '22%', left: '88%', size: 'w-1.5 h-1.5', delay: '1.2s' },
                { top: '12%', left: '94%', size: 'w-1 h-1', delay: '0.8s' },
              ].map((star, idx) => (
                <div
                  key={idx}
                  className={`absolute ${star.size} rounded-full bg-white animate-pulse`}
                  style={{
                    top: star.top,
                    left: star.left,
                    animationDelay: star.delay,
                    boxShadow: '0 0 6px rgba(255,255,255,0.8)',
                  }}
                />
              ))}

              {/* Night Mist / Clouds */}
              <motion.div
                animate={{ x: [0, 80, 0] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-16 left-10 w-48 h-12 rounded-full bg-cyan-900/20 blur-xl"
              />
            </>
          ) : (
            /* DAY SKY: Warm Sun, Drifting Fluffy Clouds, Flying Birds */
            <>
              {/* Warm Sun */}
              <div className="absolute top-8 right-20 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-100 shadow-[0_0_60px_rgba(251,191,36,0.7)]" />

              {/* Drifting Clouds */}
              <motion.div
                animate={{ x: [-100, 1200] }}
                transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
                className="absolute top-12 left-0 opacity-80"
              >
                <svg className="w-32 h-16 fill-white drop-shadow-sm" viewBox="0 0 100 50">
                  <path d="M20 40 Q10 40 10 30 Q10 20 25 20 Q30 8 45 10 Q58 6 70 18 Q85 18 85 30 Q85 40 70 40 Z" />
                </svg>
              </motion.div>

              <motion.div
                animate={{ x: [-80, 1100] }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear', delay: 15 }}
                className="absolute top-20 left-0 opacity-60"
              >
                <svg className="w-24 h-12 fill-white drop-shadow-sm" viewBox="0 0 100 50">
                  <path d="M20 40 Q10 40 10 30 Q10 20 25 20 Q30 8 45 10 Q58 6 70 18 Q85 18 85 30 Q85 40 70 40 Z" />
                </svg>
              </motion.div>

              {/* Flying Birds Flocks */}
              <motion.div
                animate={{ x: [1000, -100], y: [60, 40] }}
                transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                className="absolute top-14 left-0 flex items-center gap-3 opacity-60 text-slate-700"
              >
                <span className="text-xs">🕊️</span>
                <span className="text-[10px] -mt-2">🕊️</span>
                <span className="text-xs -mt-1">🕊️</span>
              </motion.div>
            </>
          )}
        </div>

        {/* 3. TERRAIN BASE MAP (SVG Vector Landscape) */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Terrain Gradients */}
            <linearGradient id="grassDay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>

            <linearGradient id="grassNight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="50%" stopColor="#04382c" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>

            {/* River Gradients */}
            <linearGradient id="riverDay" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="riverNight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#082f49" />
              <stop offset="50%" stopColor="#0c4a6e" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Highway Gradients */}
            <linearGradient id="highwayDay" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Farmland Pattern */}
            <pattern id="paddyPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M2 18 L6 10 L10 18 M12 18 L16 10 L20 18"
                stroke={effectiveDarkMode ? '#065f46' : '#15803d'}
                strokeWidth="1.2"
                fill="none"
                opacity="0.45"
              />
            </pattern>
          </defs>

          {/* MAIN GROUND TERRAIN BASE */}
          <rect
            x="0"
            y="120"
            width="1000"
            height="580"
            rx="40"
            fill={effectiveDarkMode ? 'url(#grassNight)' : 'url(#grassDay)'}
          />

          {/* Crop & Agriculture Fields (Paddy & Mustard) */}
          <path
            d="M 50,450 C 120,400 200,420 280,480 C 220,580 100,560 50,450 Z"
            fill={effectiveDarkMode ? '#134e4a' : '#fef08a'}
            opacity="0.75"
          />
          <path
            d="M 50,450 C 120,400 200,420 280,480 C 220,580 100,560 50,450 Z"
            fill="url(#paddyPattern)"
          />

          {/* Eastern Farmland (Red Soil Hills - Banshtail zone) */}
          <path
            d="M 750,150 C 850,140 960,180 980,320 C 900,350 820,300 750,150 Z"
            fill={effectiveDarkMode ? '#3b1c14' : '#fed7aa'}
            opacity="0.6"
          />

          {/* LOUHAJANG RIVER (লৌহজং নদী) - Curving waterway */}
          <g id="louhajang-river">
            <path
              d="M 0,220 C 180,240 280,360 420,380 C 580,400 680,560 840,620 C 920,650 980,680 1000,700 L 1000,740 L 0,740 Z"
              fill={effectiveDarkMode ? 'url(#riverNight)' : 'url(#riverDay)'}
              opacity="0.9"
            />

            {/* River Wave Lines */}
            <path
              d="M 40,250 Q 150,260 250,330 T 450,390 T 700,520 T 920,640"
              stroke="#e0f2fe"
              strokeWidth="2"
              strokeDasharray="12 18"
              fill="none"
              opacity="0.4"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;60"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>

            {/* Animated Country Boat (নৌকা) on Louhajang River */}
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="220,340; 520,440; 800,590"
                dur="28s"
                repeatCount="indefinite"
              />
              <path d="M 0,0 C 15,10 35,10 50,0 C 40,16 10,16 0,0 Z" fill="#78350f" />
              <path d="M 16,-8 Q 25,-16 34,-8 L 34,0 L 16,0 Z" fill="#b45309" />
              <circle cx="12" cy="-5" r="3" fill="#fef08a" />
              <line x1="8" y1="-2" x2="-2" y2="10" stroke="#451a03" strokeWidth="2" />
            </g>
          </g>

          {/* ROAD INFRASTRUCTURE NETWORK */}
          <g id="road-network">
            {/* 1. Major Dhaka-Tangail 4-Lane Highway (ঢাকা-টাঙ্গাইল মহাসড়ক) */}
            <path
              d="M 50,160 C 260,200 480,220 720,300 C 850,340 940,400 1000,450"
              stroke="url(#highwayDay)"
              strokeWidth="28"
              strokeLinecap="round"
              fill="none"
            />
            {/* Highway Center Divider Dashes */}
            <path
              d="M 50,160 C 260,200 480,220 720,300 C 850,340 940,400 1000,450"
              stroke="#facc15"
              strokeWidth="2.5"
              strokeDasharray="14 14"
              fill="none"
            />

            {/* 2. Mirzapur Town & Bazaar Bypass Road */}
            <path
              d="M 380,210 C 380,310 460,400 520,490 C 580,560 640,620 700,680"
              stroke="#475569"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 380,210 C 380,310 460,400 520,490 C 580,560 640,620 700,680"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeDasharray="8 8"
              fill="none"
              opacity="0.8"
            />

            {/* 3. Jamurki & Mohera Heritage Rural Road */}
            <path
              d="M 220,240 C 200,320 240,440 320,530 C 400,600 500,520 520,490"
              stroke="#64748b"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />

            {/* 4. Gorai Industrial Access Link */}
            <path
              d="M 720,300 C 780,420 840,480 900,560"
              stroke="#64748b"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />

            {/* Railway Track (উত্তরবঙ্গ রেলপথ) */}
            <path
              d="M 0,380 C 180,360 360,340 600,280 C 800,240 920,180 1000,150"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeDasharray="4 6"
              fill="none"
            />
          </g>

          {/* TREES, PALMS & VEGETATION (Subtle animated sway) */}
          <g id="vegetation">
            {[
              { x: 120, y: 190, scale: 1.1 },
              { x: 160, y: 220, scale: 0.9 },
              { x: 280, y: 170, scale: 1.2 },
              { x: 340, y: 240, scale: 0.8 },
              { x: 440, y: 180, scale: 1.0 },
              { x: 620, y: 210, scale: 1.3 },
              { x: 740, y: 190, scale: 1.1 },
              { x: 880, y: 220, scale: 1.4 },
              { x: 920, y: 260, scale: 1.0 },
              { x: 180, y: 520, scale: 1.2 },
              { x: 600, y: 440, scale: 1.0 },
              { x: 720, y: 520, scale: 1.2 },
            ].map((tree, i) => (
              <g
                key={i}
                transform={`translate(${tree.x}, ${tree.y}) scale(${tree.scale})`}
                className="animate-[pulse_4s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                {/* Trunk */}
                <rect x="-3" y="0" width="6" height="18" fill="#78350f" rx="2" />
                {/* Foliage */}
                <circle
                  cx="0"
                  cy="-6"
                  r="14"
                  fill={effectiveDarkMode ? '#065f46' : '#16a34a'}
                  stroke={effectiveDarkMode ? '#047857' : '#86efac'}
                  strokeWidth="1.5"
                />
                <circle
                  cx="-6"
                  cy="-10"
                  r="10"
                  fill={effectiveDarkMode ? '#047857' : '#22c55e'}
                />
                <circle
                  cx="6"
                  cy="-10"
                  r="10"
                  fill={effectiveDarkMode ? '#059669' : '#4ade80'}
                />
              </g>
            ))}
          </g>

          {/* STREET LIGHT GLOWS (Dark Mode) */}
          {effectiveDarkMode && (
            <g id="street-lights">
              {[
                { cx: 200, cy: 190 },
                { cx: 380, cy: 220 },
                { cx: 500, cy: 470 },
                { cx: 700, cy: 300 },
                { cx: 860, cy: 370 },
              ].map((light, idx) => (
                <g key={idx}>
                  <circle cx={light.cx} cy={light.cy} r="35" fill="#fef08a" opacity="0.18" />
                  <circle cx={light.cx} cy={light.cy} r="18" fill="#fde047" opacity="0.35" />
                  <circle cx={light.cx} cy={light.cy} r="3" fill="#ffffff" />
                </g>
              ))}
            </g>
          )}

          {/* DELIVERY SIMULATION ROUTE (When active) */}
          {showDeliverySimulation && (
            <g id="delivery-simulation-path">
              <path
                d="M 520,490 C 440,420 360,340 260,340"
                stroke="#0284c7"
                strokeWidth="5"
                strokeDasharray="8 8"
                fill="none"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="32;0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Delivery Step Highlights */}
              {DEFAULT_DELIVERY_STEPS.map((s, idx) => (
                <g
                  key={idx}
                  transform={`translate(${(s.x * 1000) / 100}, ${(s.y * 700) / 100})`}
                  opacity={simulationStepIndex === idx ? 1 : 0.4}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r={simulationStepIndex === idx ? 16 : 8}
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="4"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {s.step}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>

        {/* 4. REAL CUSTOMER LOCATION ("📍 আপনি এখানে") */}
        {userCoords && (
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-full pointer-events-auto"
            style={{
              left: '42%',
              top: '56%',
            }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-bold text-[10px] shadow-lg whitespace-nowrap border-2 border-white flex items-center gap-1 animate-bounce">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                📍 আপনি এখানে
              </span>
              <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-md -mt-1" />
            </motion.div>
          </div>
        )}

        {/* 5. INTERACTIVE 2.5D LANDMARKS */}
        {filteredLandmarks.map((landmark) => {
          const isHovered = hoveredLandmark?.id === landmark.id;

          return (
            <div
              key={landmark.id}
              data-interactive="true"
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 active:scale-95"
              style={{
                left: `${landmark.x}%`,
                top: `${landmark.y}%`,
              }}
              onClick={() => onSelectLandmark(landmark)}
              onMouseEnter={() => setHoveredLandmark(landmark)}
              onMouseLeave={() => setHoveredLandmark(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center group"
              >
                {/* Miniature 3D Landmark Badge */}
                <div
                  className="relative p-2.5 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-300 border backdrop-blur-md"
                  style={{
                    backgroundColor: effectiveDarkMode ? '#061522dd' : '#ffffffee',
                    borderColor: isHovered ? landmark.accentColor : 'rgba(255,255,255,0.4)',
                    boxShadow: isHovered
                      ? `0 12px 28px ${landmark.accentColor}55`
                      : '0 8px 20px rgba(0,0,0,0.15)',
                  }}
                >
                  <span className="text-2xl sm:text-3xl select-none filter drop-shadow-sm">
                    {landmark.icon}
                  </span>

                  {/* Pulsing Target Dot */}
                  <span
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white"
                    style={{ backgroundColor: landmark.accentColor }}
                  />
                </div>

                {/* Subtle Landmark Name Label */}
                <div className="mt-1.5 px-2.5 py-0.5 rounded-xl bg-slate-900/80 dark:bg-black/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold shadow-md whitespace-nowrap border border-white/20 flex items-center gap-1">
                  <span>{landmark.name}</span>
                </div>

                {/* Hover Quick Tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-2 w-48 p-2 rounded-xl bg-white/95 dark:bg-[#061522]/95 backdrop-blur-xl border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white text-[11px] shadow-2xl text-center pointer-events-none z-30"
                  >
                    <p className="font-bold text-slate-900 dark:text-white">{landmark.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-white/60 mt-0.5">
                      {landmark.badge}
                    </p>
                    <span className="inline-block mt-1 text-[9px] text-[#0284c7] dark:text-cyan-400 font-bold">
                      ট্যাপ করে বিস্তারিত দেখুন →
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          );
        })}

        {/* 6. DORKAR DELIVERY RIDERS (Cruising through roads) */}
        {INITIAL_ROUTE_RIDERS.map((rider, idx) => {
          // Route coordinates based on route id
          const isForward = rider.direction === 'forward';

          return (
            <motion.div
              key={rider.id}
              data-interactive="true"
              animate={
                rider.route === 'highway'
                  ? {
                      x: isForward ? [-20, 850] : [850, -20],
                      y: isForward ? [160, 420] : [420, 160],
                    }
                  : rider.route === 'town_bazaar'
                  ? {
                      x: isForward ? [380, 680] : [680, 380],
                      y: isForward ? [210, 620] : [620, 210],
                    }
                  : {
                      x: isForward ? [220, 520] : [520, 220],
                      y: isForward ? [240, 490] : [490, 240],
                    }
              }
              transition={{
                duration: rider.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: idx * 5,
              }}
              className="absolute top-0 left-0 z-25 cursor-pointer"
              onClick={() => setSelectedRider(rider)}
            >
              <div className="relative group flex items-center">
                {rider.vehicle === 'scooter' ? (
                  <CharacterHeroScooter className="scale-60 -m-6" />
                ) : (
                  <CharacterFemaleRider className="scale-55 -m-6" />
                )}

                {/* Floating Rider Live Tag */}
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-cyan-600 text-white text-[8px] font-bold font-mono shadow -ml-2">
                  {rider.riderCode}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* 7. 10-12 CUTE DORKAR CHARACTERS (Living World) */}
        {MIRZAPUR_CHARACTERS.map((char) => {
          return (
            <div
              key={char.id}
              data-interactive="true"
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125"
              style={{
                left: `${char.x}%`,
                top: `${char.y}%`,
              }}
              onClick={() => setSelectedCharacter(char)}
            >
              <motion.div
                animate={
                  char.animation === 'bounce'
                    ? { y: [0, -5, 0] }
                    : char.animation === 'pulse'
                    ? { scale: [1, 1.05, 1] }
                    : char.animation === 'sway'
                    ? { rotate: [-3, 3, -3] }
                    : { y: [0, -4, 0] }
                }
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative group flex flex-col items-center"
              >
                {/* Render Appropriate Cute SVG Character */}
                {char.type === 'shohayok' ? (
                  <CharacterChatbotMascot isOpen={true} className="scale-75" />
                ) : char.type === 'shopping' ? (
                  <CharacterShoppingHelper className="scale-60 -m-4" />
                ) : char.type === 'carrier' ? (
                  <CharacterPackageCarrier className="scale-60 -m-4" />
                ) : char.type === 'drinking_tea' ? (
                  <CharacterWithPhone className="scale-60 -m-4" />
                ) : char.type === 'gardening' ? (
                  <CharacterCustomerHelper className="scale-60 -m-4" />
                ) : char.type === 'runner' ? (
                  <CharacterRunningDeliverer className="scale-60 -m-4" />
                ) : char.type === 'celebrating' ? (
                  <CharacterCelebrationRider className="scale-60 -m-4" />
                ) : (
                  <CharacterWarehouseHelper className="scale-60 -m-4" />
                )}

                {/* Character Name Pill */}
                <span className="mt-0.5 px-1.5 py-0.2 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white text-[9px] font-bold shadow-sm whitespace-nowrap border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  {char.name}
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* 8. CHARACTER INTERACTIVE SPEECH BUBBLE POPUP */}
      <AnimatePresence>
        {selectedCharacter && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-40 p-4 rounded-2xl bg-white/95 dark:bg-[#061522]/95 backdrop-blur-xl border border-[#C69A45]/40 shadow-2xl text-slate-900 dark:text-white"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {selectedCharacter.name}
                  </h4>
                  <p className="text-[10px] text-[#0284c7] dark:text-cyan-400 font-semibold">
                    {selectedCharacter.role}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCharacter(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-xs bg-slate-50 dark:bg-[#0B2233] p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/90 leading-relaxed font-serif">
              "{selectedCharacter.speech}"
            </p>

            <span className="text-[10px] text-slate-500 dark:text-white/50 block mt-2">
              কর্মকাণ্ড: {selectedCharacter.activity}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9. RIDER INTERACTION POPUP */}
      <AnimatePresence>
        {selectedRider && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-40 p-4 rounded-2xl bg-white/95 dark:bg-[#061522]/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl text-slate-900 dark:text-white"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-[#0284c7] dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {selectedRider.name}
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {selectedRider.riderCode}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRider(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#0B2233] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-white/60 text-[11px]">স্ট্যাটাস:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedRider.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-white/60 text-[11px]">বাহন:</span>
                <span className="font-bold capitalize">{selectedRider.vehicle}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 10. ACTIVE ORDER SIMULATION CONTROL BANNER */}
      {showDeliverySimulation && (
        <div className="absolute bottom-4 left-4 z-30 max-w-xs sm:max-w-sm p-3 rounded-2xl bg-white/95 dark:bg-[#061522]/95 backdrop-blur-xl border border-[#0284c7]/40 shadow-2xl text-xs">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#0284c7] animate-bounce" />
            <span className="font-bold text-slate-900 dark:text-white">
              লাইভ ডেলিভারি রুট সিমুলেশন
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-white/70 mt-1">
            ধাপ {DEFAULT_DELIVERY_STEPS[simulationStepIndex].step}:{' '}
            <strong className="text-[#0284c7] dark:text-cyan-400">
              {DEFAULT_DELIVERY_STEPS[simulationStepIndex].title}
            </strong>{' '}
            ({DEFAULT_DELIVERY_STEPS[simulationStepIndex].location})
          </p>
        </div>
      )}
    </div>
  );
};
