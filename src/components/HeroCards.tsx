import { motion } from "motion/react";
import { useState, useRef, useCallback } from "react";
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

const fanPositions = [
  { rotate: -22, x: -300, y: 30, z: 1, scale: 0.85 },
  { rotate: -10, x: -150, y: 10, z: 2, scale: 0.92 },
  { rotate: 0, x: 0, y: -16, z: 5, scale: 1 },
  { rotate: 10, x: 150, y: 10, z: 2, scale: 0.92 },
  { rotate: 22, x: 300, y: 30, z: 1, scale: 0.85 },
];

const mobileFanPositions = [
  { rotate: -18, x: -90, y: 20, z: 1, scale: 0.82 },
  { rotate: 0, x: 0, y: -8, z: 5, scale: 1 },
  { rotate: 18, x: 90, y: 20, z: 1, scale: 0.82 },
];

function CrosshairSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="40" cy="40" r="16" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <line x1="40" y1="4" x2="40" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="40" y1="56" x2="40" y2="76" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="4" y1="40" x2="24" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="56" y1="40" x2="76" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="40" cy="40" r="3" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

function DiamondGrid({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[0, 30, 60, 90].map((x) =>
        [0, 30, 60, 90].map((y) => (
          <rect
            key={`${x}-${y}`}
            x={x + 10}
            y={y + 10}
            width="8"
            height="8"
            rx="1"
            transform={`rotate(45 ${x + 14} ${y + 14})`}
            fill="currentColor"
            opacity="0.06"
          />
        ))
      )}
    </svg>
  );
}

function WaveDeco({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 20 Q25 5 50 20 Q75 35 100 20 Q125 5 150 20 Q175 35 200 20"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.12"
        fill="none"
      />
      <path
        d="M0 28 Q25 13 50 28 Q75 43 100 28 Q125 13 150 28 Q175 43 200 28"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.08"
        fill="none"
      />
    </svg>
  );
}


function MagicCard({
  children,
  className,
  glowColor,
  style: styleProp,
}: {
  children: React.ReactNode;
  className: string;
  glowColor: string;
  style?: React.CSSProperties;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  const tiltX = isHovered ? (mousePos.y - 0.5) * -20 : 0;
  const tiltY = isHovered ? (mousePos.x - 0.5) * 20 : 0;
  const glow = glowColor || "rgba(255,255,255,0.4)";

  return (
    <div
      ref={cardRef}
      className={`${className} relative group`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0.5, y: 0.5 });
      }}
      style={{
        ...styleProp,
        transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: isHovered
          ? "transform 0.1s ease-out"
          : "transform 0.4s ease-out",
      }}
    >
      {children}

      {/* Holographic shimmer overlay */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 30%, transparent 60%)`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Iridescent edge shine */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(${105 + (mousePos.x - 0.5) * 60}deg, transparent 20%, rgba(255,255,255,0.12) 45%, rgba(200,220,255,0.1) 50%, rgba(255,200,150,0.08) 55%, transparent 80%)`,
        }}
      />

      {/* Glow border on hover */}
      <div
        className="absolute -inset-[1px] rounded-[inherit] pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 20px 2px ${glow}, inset 0 0 20px 2px ${glow}`,
        }}
      />
    </div>
  );
}

export default function HeroCards({ members }: HeroCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMobileTap = useCallback((index: number) => {
    setMobileActiveIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleHover = useCallback((index: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoveredIndex(index), 150);
  }, []);

  const handleLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setHoveredIndex(null);
  }, []);

  // Compute roulette positions: when a card is hovered, the whole fan
  // rotates so the hovered card lands at position 2 (center).
  const getDesktopPos = (cardIndex: number) => {
    if (hoveredIndex === null) return fanPositions[cardIndex] || fanPositions[2];
    // Shift: which slot should this card occupy?
    const offset = hoveredIndex - 2; // how many slots the hovered card is away from center
    let slot = cardIndex - offset;
    // Wrap around for roulette feel
    const len = fanPositions.length;
    slot = ((slot % len) + len) % len;
    return fanPositions[slot];
  };

  return (
    <>
      {/* Desktop fan-spread */}
      <div
        className="hidden md:flex items-end justify-center relative h-[440px] w-full max-w-[1000px] overflow-visible"
        onMouseLeave={handleLeave}
      >
        {members.map((member, i) => {
          const pos = getDesktopPos(i);
          const colors = cardColors[i % cardColors.length];
          const isCentered = hoveredIndex === i;
          return (
            <motion.div
              key={member.nickname}
              className="absolute cursor-pointer"
              initial={false}
              animate={{
                opacity: 1,
                y: isCentered ? pos.y - 30 : pos.y,
                rotate: pos.rotate,
                x: pos.x,
                scale: isCentered ? 1.08 : pos.scale,
                zIndex: isCentered ? 50 : pos.z,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  zIndex: { delay: isCentered ? 0 : 0.15 },
                }
              }}
              onMouseEnter={() => handleHover(i)}
              style={{
                transformOrigin: "bottom center",
              }}
            >
              <MagicCard
                className="w-[260px]" style={{ borderRadius: '28px 28px 20px 20px' }}
                glowColor={colors.glow}
              >
                <div
                  className="w-full overflow-hidden shadow-2xl shadow-black/50 relative" style={{ borderRadius: '28px 28px 20px 20px', backgroundColor: colors.bg }}
                >
                  {/* Decorative SVG overlay */}
                  <CrosshairSVG className="absolute top-4 right-4 w-20 h-20 text-white pointer-events-none" />
                  <DiamondGrid className="absolute bottom-0 left-0 w-28 h-28 text-white pointer-events-none" />

                  {/* Top section */}
                  <div className="relative px-5 pt-5 pb-0">
                    {/* Role label */}
                    <p className="font-[var(--font-condensed)] text-xs font-semibold uppercase tracking-[0.25em] text-white/50 mb-0.5">
                      {member.role === "sniper" ? "SHARPSHOOTER" : member.role === "rusher" ? "ASSAULT" : member.role === "support" ? "TACTICAL" : "FIELD MEDIC"}
                    </p>
                    {/* Nickname */}
                    <h3 className="font-display text-4xl text-white leading-none tracking-wide">
                      {member.nickname}
                    </h3>
                  </div>

                  {/* KD Badge — like the rating badge in reference */}
                  <div className="absolute top-5 right-5 z-10">
                    <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-lg" style={{ backgroundColor: colors.light }}>
                      <svg className="w-3.5 h-3.5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="font-display text-base font-bold text-white">
                        {member.kdRatio.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Avatar area */}
                  <div className="relative flex flex-col items-center justify-center h-[300px] overflow-hidden">
                    {/* Large decorative circle behind avatar */}
                    <div className="absolute w-40 h-40 rounded-full border border-white/10" />
                    <div className="absolute w-56 h-56 rounded-full border border-white/5" />

                    {/* Avatar */}
                    <div className="relative w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center backdrop-blur-sm">
                      <span className="font-display text-5xl text-white/90">
                        {member.nickname.charAt(0)}
                      </span>
                      {member.isLeader && (
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-sm shadow-lg">
                          👑
                        </div>
                      )}
                    </div>

                    {/* Name + rank below avatar */}
                    <p className="mt-3 text-base font-medium text-white/70" style={{ fontFamily: "var(--font-body)" }}>
                      {member.name}
                    </p>
                    <p className="font-[var(--font-condensed)] text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mt-0.5">
                      {member.rank}
                    </p>

                    {/* Wave decoration at bottom */}
                    <WaveDeco className="absolute bottom-2 left-0 w-full text-white pointer-events-none" />
                  </div>
                </div>
              </MagicCard>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile compact fan-spread */}
      <div className="md:hidden flex items-end justify-center relative h-[330px] w-full overflow-visible">
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
                y: isMobileActive ? pos.y - 20 : pos.y,
                rotate: pos.rotate,
                x: pos.x,
                scale: isMobileActive ? 1.06 : pos.scale,
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
              <MagicCard
                className="w-[180px]" style={{ borderRadius: '22px 22px 16px 16px' }}
                glowColor={colors.glow}
              >
                <div
                  className="w-full overflow-hidden shadow-xl shadow-black/40 relative"
                  style={{ borderRadius: '22px 22px 16px 16px', backgroundColor: colors.bg }}
                >
                  <CrosshairSVG className="absolute top-3 right-3 w-12 h-12 text-white pointer-events-none" />
                  <div className="px-3.5 pt-3.5 pb-0">
                    <p className="font-[var(--font-condensed)] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-0.5">
                      {member.role === "sniper" ? "SHARPSHOOTER" : member.role === "rusher" ? "ASSAULT" : member.role === "support" ? "TACTICAL" : "FIELD MEDIC"}
                    </p>
                    <h3 className="font-display text-2xl text-white leading-none tracking-wide">
                      {member.nickname}
                    </h3>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <div
                      className="flex items-center gap-1 rounded-full px-2 py-1 shadow-lg"
                      style={{ backgroundColor: colors.light }}
                    >
                      <svg className="w-2.5 h-2.5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="font-display text-[11px] text-white">
                        {member.kdRatio.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="relative flex flex-col items-center justify-center h-[200px] overflow-hidden">
                    <div className="absolute w-28 h-28 rounded-full border border-white/10" />
                    <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                      <span className="font-display text-2xl text-white/90">
                        {member.nickname.charAt(0)}
                      </span>
                      {member.isLeader && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-[10px] shadow-lg">
                          👑
                        </div>
                      )}
                    </div>
                    <p
                      className="mt-2 text-xs font-medium text-white/70"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {member.name}
                    </p>
                    <p className="font-[var(--font-condensed)] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mt-0.5">
                      {member.rank}
                    </p>
                  </div>
                </div>
              </MagicCard>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
