import { motion } from "motion/react";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { Member } from "@/data/members";

interface HeroCardsProps {
  members: Member[];
}

const cardColors = [
  { bg: "#3B3F4A", light: "#565B6A", glow: "rgba(86, 91, 106, 0.6)" },   // slate gray
  { bg: "#1E5C8A", light: "#2E7AB8", glow: "rgba(46, 122, 184, 0.6)" },  // steel blue
  { bg: "#1B6B42", light: "#2A8E5A", glow: "rgba(42, 142, 90, 0.6)" },   // forest green
  { bg: "#1A5C6C", light: "#238B8E", glow: "rgba(35, 139, 142, 0.6)" },  // dark teal
  { bg: "#2D3A4E", light: "#4A5F7A", glow: "rgba(74, 95, 122, 0.6)" },   // charcoal blue
];

// Measure an element's width reactively
function useElementWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(900);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return width;
}

// Compute 5-card fan positions so outermost cards stay within the container width
function computeDesktopFan(containerW: number, cardW = 260) {
  // Max safe half-spread: half-container minus half-card minus a small margin
  const halfSpread = Math.max((containerW / 2) - (cardW / 2) - 16, 80);
  const step = halfSpread / 2;
  return [
    { rotate: -22, x: -step * 2, y: 30, z: 1, scale: 0.85 },
    { rotate: -10, x: -step,     y: 10, z: 2, scale: 0.92 },
    { rotate:   0, x:  0,        y: -16, z: 5, scale: 1    },
    { rotate:  10, x:  step,     y: 10, z: 2, scale: 0.92 },
    { rotate:  22, x:  step * 2, y: 30, z: 1, scale: 0.85 },
  ];
}

// Compute 3-card mobile fan positions — center card dominant, sides overflow edges
function computeMobileFan(containerW: number, cardW = 240) {
  const spread = Math.max((containerW / 2) + 20, 120);
  return [
    { rotate: -14, x: -spread, y: 30, z: 1, scale: 0.88 },
    { rotate:   0, x:  0,      y: -10, z: 5, scale: 1    },
    { rotate:  14, x:  spread, y: 30, z: 1, scale: 0.88 },
  ];
}


/* Card shape path generator — creates the notched card outline */
function cardShapePath(w: number, h: number, notchY = 0.68) {
  const r = 18;       // corner radius
  const ny = h * notchY; // notch Y position
  const nd = 6;       // notch depth (how far inward)
  const nr = 8;       // notch curve radius
  return `M ${r},0 L ${w - r},0 Q ${w},0 ${w},${r} L ${w},${ny - nr} C ${w},${ny - 2} ${w - nd},${ny - 2} ${w - nd},${ny} C ${w - nd},${ny + 2} ${w},${ny + 2} ${w},${ny + nr} L ${w},${h - r} Q ${w},${h} ${w - r},${h} L ${r},${h} Q 0,${h} 0,${h - r} L 0,${ny + nr} C 0,${ny + 2} ${nd},${ny + 2} ${nd},${ny} C ${nd},${ny - 2} 0,${ny - 2} 0,${ny - nr} L 0,${r} Q 0,0 ${r},0 Z`;
}

/* Shaped gaming card with notch cutouts */
function GameCard({
  children,
  w,
  h,
  glowColor,
  className,
}: {
  children: (shapePath: string) => React.ReactNode;
  w: number;
  h: number;
  glowColor: string;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const shapePath = useMemo(() => cardShapePath(w, h), [w, h]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  }, []);

  const tiltX = isHovered ? (mousePos.y - 0.5) * -20 : 0;
  const tiltY = isHovered ? (mousePos.x - 0.5) * 20 : 0;

  return (
    <div
      ref={cardRef}
      className={`${className || ""} relative group`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      style={{
        width: w,
        height: h,
        transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
      }}
    >
      {/* Clipped content */}
      <div className="absolute inset-0" style={{ clipPath: `path('${shapePath}')` }}>
        {children(shapePath)}
      </div>

      {/* SVG border outline */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox={`0 0 ${w} ${h}`}>
        <path d={shapePath} stroke="rgba(255,255,255,0.14)" strokeWidth="3" fill="none" />
      </svg>

      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          clipPath: `path('${shapePath}')`,
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 30%, transparent 60%)`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Glow on hover */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" viewBox={`0 0 ${w} ${h}`}>
        <path d={shapePath} stroke={glowColor} strokeWidth="4" fill="none" style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }} />
      </svg>
    </div>
  );
}

export default function HeroCards({ members }: HeroCardsProps) {
  // Refs to measure actual rendered container width
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef  = useRef<HTMLDivElement>(null);
  const desktopW   = useElementWidth(desktopRef);
  const mobileW    = useElementWidth(mobileRef);

  // Dynamic fan positions — recomputed whenever container width changes
  const fanPositions       = useMemo(() => computeDesktopFan(desktopW), [desktopW]);
  const mobileFanPositions = useMemo(() => computeMobileFan(mobileW),   [mobileW]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number | null>(null);

  const handleMobileTap = useCallback((index: number) => {
    setMobileActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  // Roulette: click a card → whole fan rotates so that card goes to center slot.
  // Click the same card again to reset.
  const handleDesktopClick = useCallback((index: number) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  }, []);

  const getDesktopPos = (cardIndex: number) => {
    if (selectedIndex === null) return fanPositions[cardIndex] ?? fanPositions[2];
    const offset = selectedIndex - 2;
    let slot = cardIndex - offset;
    const len = fanPositions.length;
    slot = ((slot % len) + len) % len;
    return fanPositions[slot];
  };

  return (
    <>
      {/* Desktop fan-spread */}
      <div
        ref={desktopRef}
        className="hidden md:flex items-end justify-center relative h-[380px] w-full max-w-[1000px] overflow-visible"
      >
        {members.map((member, i) => {
          const pos = getDesktopPos(i);
          const colors = cardColors[i % cardColors.length];
          const isCentered = selectedIndex === i;
          return (
            <motion.div
              key={member.nickname}
              className="absolute cursor-pointer"
              initial={false}
              animate={{
                opacity: 1,
                y: isCentered ? pos.y - 5 : pos.y,
                rotate: pos.rotate,
                x: pos.x,
                scale: isCentered ? 1.05 : pos.scale,
                zIndex: isCentered ? 50 : pos.z,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  zIndex: { delay: isCentered ? 0 : 0.15 },
                }
              }}
              onClick={() => handleDesktopClick(i)}
              style={{
                transformOrigin: "bottom center",
              }}
            >
              <GameCard w={260} h={360} glowColor={colors.glow}>
                {() => (
                  <div className="w-full h-full flex flex-col shadow-2xl shadow-black/50">
                    {/* Visual area — colored bg with monogram */}
                    <div
                      className="relative flex flex-col items-center justify-center flex-1"
                      style={{ backgroundColor: colors.bg }}
                    >
                      {/* K/D badge + Role tag at top */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5 rounded-full px-3 py-1 shadow-lg" style={{ backgroundColor: colors.light }}>
                          <svg className="w-3 h-3 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="font-display text-sm text-white">
                            {member.kdRatio.toFixed(1)}
                          </span>
                        </div>
                        <span
                          className="rounded-full px-3 py-1 font-[var(--font-condensed)] text-[10px] uppercase tracking-[0.15em] text-white/80 font-medium"
                          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                        >
                          {member.role === "sniper" ? "Sharpshooter" : member.role === "rusher" ? "Assault" : member.role === "support" ? "Tactical" : "Field Medic"}
                        </span>
                      </div>

                      <div className="absolute w-36 h-36 rounded-full border border-white/[0.07]" />
                      <div className="absolute w-52 h-52 rounded-full border border-white/[0.04]" />

                      <div className="relative w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                        <span className="font-display text-5xl text-white/90">
                          {member.nickname.charAt(0)}
                        </span>
                        {member.isLeader && (
                          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-sm shadow-lg">
                            👑
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info panel — bottom section */}
                    <div className="bg-[#0e0e0e] px-5 py-4 flex flex-col items-center text-center">
                      <h3 className="font-display text-2xl text-white leading-none tracking-wide">
                        {member.nickname}
                      </h3>

                      <p className="text-xs text-white/40 mt-1.5" style={{ fontFamily: "var(--font-body)" }}>
                        {member.name} · {member.rank}
                      </p>
                    </div>
                  </div>
                )}
              </GameCard>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile compact fan-spread */}
      <div ref={mobileRef} className="md:hidden flex items-end justify-center relative h-[370px] w-full overflow-visible">
        {members.slice(0, 3).map((member, i) => {
          const colors = cardColors[i % cardColors.length];
          const isMobileActive = mobileActiveIndex === i;
          // When a card is tapped, roulette to center (slot 1)
          const getMobilePos = () => {
            if (mobileActiveIndex === null) return mobileFanPositions[i] || mobileFanPositions[1];
            const offset = mobileActiveIndex - 1;
            let slot = i - offset;
            const len = mobileFanPositions.length;
            slot = ((slot % len) + len) % len;
            return mobileFanPositions[slot];
          };
          const pos = getMobilePos();
          return (
            <motion.div
              key={member.nickname}
              className="absolute cursor-pointer"
              initial={false}
              animate={{
                opacity: 1,
                y: isMobileActive ? pos.y - 5 : pos.y,
                rotate: pos.rotate,
                x: pos.x,
                scale: isMobileActive ? 1.04 : pos.scale,
                zIndex: isMobileActive ? 50 : pos.z,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  zIndex: { delay: isMobileActive ? 0 : 0.15 },
                },
              }}
              onTap={() => handleMobileTap(i)}
              style={{
                transformOrigin: "bottom center",
              }}
            >
              <GameCard w={240} h={340} glowColor={colors.glow}>
                {() => (
                  <div className="w-full h-full flex flex-col shadow-2xl shadow-black/50">
                    {/* Visual area */}
                    <div
                      className="relative flex flex-col items-center justify-center flex-1"
                      style={{ backgroundColor: colors.bg }}
                    >
                      {/* K/D badge + Role tag at top */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                        <div className="flex items-center gap-1 rounded-full px-2.5 py-0.5 shadow-lg" style={{ backgroundColor: colors.light }}>
                          <svg className="w-2.5 h-2.5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="font-display text-xs text-white">
                            {member.kdRatio.toFixed(1)}
                          </span>
                        </div>
                        <span
                          className="rounded-full px-2.5 py-0.5 font-[var(--font-condensed)] text-[9px] uppercase tracking-[0.12em] text-white/80 font-medium"
                          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                        >
                          {member.role === "sniper" ? "Sharpshooter" : member.role === "rusher" ? "Assault" : member.role === "support" ? "Tactical" : "Field Medic"}
                        </span>
                      </div>

                      <div className="absolute w-32 h-32 rounded-full border border-white/[0.07]" />
                      <div className="absolute w-48 h-48 rounded-full border border-white/[0.04]" />

                      <div className="relative w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                        <span className="font-display text-4xl text-white/90">
                          {member.nickname.charAt(0)}
                        </span>
                        {member.isLeader && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs shadow-lg">
                            👑
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info panel */}
                    <div className="bg-[#0e0e0e] px-4 py-3.5 flex flex-col items-center text-center">
                      <h3 className="font-display text-xl text-white leading-none tracking-wide">
                        {member.nickname}
                      </h3>

                      <p className="text-xs text-white/40 mt-1" style={{ fontFamily: "var(--font-body)" }}>
                        {member.name} · {member.rank}
                      </p>
                    </div>
                  </div>
                )}
              </GameCard>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
