import { motion } from "motion/react";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { Member } from "@/data/members";
import CardFrame from "./CardFrame";

interface HeroCardsProps {
  members: Member[];
}

const ACCENT = "#C4A265";

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

/* ── Fan position calculators ── */

function computeDesktopFan(containerW: number) {
  const cardW = 260;
  const halfSpread = Math.max((containerW / 2) - (cardW / 2) - 8, 100);
  const step = halfSpread / 2;
  return [
    { rotate: -18, x: -step * 2, y: 28, z: 1, scale: 0.88 },
    { rotate:  -8, x: -step,     y: 8,  z: 2, scale: 0.94 },
    { rotate:   0, x:  0,        y: -12, z: 5, scale: 1    },
    { rotate:   8, x:  step,     y: 8,  z: 2, scale: 0.94 },
    { rotate:  18, x:  step * 2, y: 28, z: 1, scale: 0.88 },
  ];
}

function computeMobileFan(containerW: number) {
  const spread = Math.max((containerW / 2) + 10, 110);
  return [
    { rotate: -12, x: -spread, y: 24, z: 1, scale: 0.9 },
    { rotate:   0, x:  0,      y: -8, z: 5, scale: 1   },
    { rotate:  12, x:  spread, y: 24, z: 1, scale: 0.9 },
  ];
}

/* ── Tilt wrapper ── */

function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const tiltX = isHovered ? (mousePos.y - 0.5) * -12 : 0;
  const tiltY = isHovered ? (mousePos.x - 0.5) * 12 : 0;

  return (
    <div
      ref={cardRef}
      className="relative group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      style={{
        transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.35s ease-out",
        willChange: "transform",
      }}
    >
      {children}
      {/* Shimmer */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.10) 0%, transparent 50%)`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

/* ── Hero card (same style as MemberCard, with CardFrame SVG) ── */

function HeroCard({ member }: { member: Member }) {
  const hasAvatar = !!member.avatar;

  return (
    <div 
      className="hero-card relative overflow-hidden bg-[#0e1112] rounded-lg"
      style={{
        boxShadow: `0 0 0 1px rgba(255,255,255,0.05)`,
      }}
    >
      {/* Portrait content (behind frame) */}
      <div className="absolute inset-0 z-10">
        {hasAvatar ? (
          <img
            src={member.avatar}
            alt={member.nickname}
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#141819]">
            <div className="relative w-[65%] h-[70%] flex items-center justify-center">
              <div className="absolute inset-0 rounded-sm border border-white/[0.08]" />
              <div className="absolute inset-[3px] rounded-sm border border-white/[0.05]" />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 120" fill="none" preserveAspectRatio="none">
                <path d="M0 12 L0 0 L12 0" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                <path d="M88 0 L100 0 L100 12" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                <path d="M100 108 L100 120 L88 120" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                <path d="M12 120 L0 120 L0 108" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
              </svg>
              <svg className="w-[55%] text-white/[0.08]" viewBox="0 0 64 80" fill="currentColor">
                <circle cx="32" cy="22" r="12" />
                <path d="M10 72c0-14 10-26 22-26s22 12 22 26" />
              </svg>
            </div>
          </div>
        )}

        {/* Bottom gradient for text readability */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[45%] pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(14,17,18,0.95) 0%, rgba(14,17,18,0.7) 40%, transparent 100%)" }}
        />
      </div>

      {/* SVG tech frame */}
      <CardFrame accent={ACCENT} bgFill={hasAvatar ? undefined : ACCENT} hasAvatar={hasAvatar} />

      {/* Leader crown badge */}
      {member.isLeader && (
        <div className="absolute top-[6%] right-[8%] z-30 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-900" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
          </svg>
        </div>
      )}

      {/* Bottom info: skills + nickname + name */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-[8%] pb-[3%] flex flex-col items-center gap-1">
        {/* Skills pills */}
        {member.skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="font-[var(--font-condensed)] text-[7px] sm:text-[8px] uppercase tracking-[0.15em] px-1.5 py-0.5 text-white/70 rounded"
                style={{ backgroundColor: "rgba(196,162,101,0.20)", border: "1px solid rgba(196,162,101,0.50)" }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-display text-base sm:text-lg lg:text-xl text-white leading-tight tracking-wide truncate text-center">
          {member.nickname}
        </h3>
        <p
          className="text-[9px] sm:text-[10px] text-white/40 truncate text-center"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {member.name}
        </p>
      </div>
    </div>
  );
}

/* ── Main component ── */

export default function HeroCards({ members }: HeroCardsProps) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef  = useRef<HTMLDivElement>(null);
  const desktopW   = useElementWidth(desktopRef);
  const mobileW    = useElementWidth(mobileRef);

  const fanPositions       = useMemo(() => computeDesktopFan(desktopW), [desktopW]);
  const mobileFanPositions = useMemo(() => computeMobileFan(mobileW),   [mobileW]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number | null>(null);

  const handleMobileTap = useCallback((index: number) => {
    setMobileActiveIndex((prev) => (prev === index ? null : index));
  }, []);

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
        className="hidden md:flex items-end justify-center relative h-[440px] w-full max-w-[1100px] overflow-visible"
      >
        {members.map((member, i) => {
          const pos = getDesktopPos(i);
          const isCentered = selectedIndex === i;
          return (
            <motion.div
              key={member.nickname}
              className="absolute cursor-pointer"
              initial={false}
              animate={{
                opacity: 1,
                y: isCentered ? pos.y - 6 : pos.y,
                rotate: pos.rotate,
                x: pos.x,
                scale: isCentered ? 1.06 : pos.scale,
                zIndex: isCentered ? 50 : pos.z,
                transition: {
                  type: "spring",
                  stiffness: 280,
                  damping: 26,
                  zIndex: { delay: isCentered ? 0 : 0.15 },
                },
              }}
              onClick={() => handleDesktopClick(i)}
              style={{ transformOrigin: "bottom center" }}
            >
              <TiltCard>
                <HeroCard member={member} />
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile compact fan-spread */}
      <div ref={mobileRef} className="md:hidden flex items-end justify-center relative h-[380px] w-full overflow-visible">
        {members.slice(0, 3).map((member, i) => {
          const isMobileActive = mobileActiveIndex === i;
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
                  stiffness: 280,
                  damping: 26,
                  zIndex: { delay: isMobileActive ? 0 : 0.15 },
                },
              }}
              onTap={() => handleMobileTap(i)}
              style={{ transformOrigin: "bottom center" }}
            >
              <TiltCard>
                <HeroCard member={member} />
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .hero-card {
          width: 220px;
          aspect-ratio: 3 / 4.6;
        }
        @media (min-width: 768px) {
          .hero-card {
            width: 260px;
          }
        }
        @media (min-width: 1024px) {
          .hero-card {
            width: 280px;
          }
        }
      `}</style>
    </>
  );
}
