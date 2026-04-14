import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useMotionValue, useAnimation, type PanInfo } from "motion/react";
import type { Member } from "@/data/members";
import { rankOrder } from "@/data/members";
import MemberDialog from "./MemberDialog";

interface MemberGridProps {
  members: Member[];
}

const cardColors = [
  { bg: "#3B3F4A", light: "#565B6A" },   // slate gray
  { bg: "#1E5C8A", light: "#2E7AB8" },   // steel blue
  { bg: "#1B6B42", light: "#2A8E5A" },   // forest green
  { bg: "#1A5C6C", light: "#238B8E" },   // dark teal
  { bg: "#2D3A4E", light: "#4A5F7A" },   // charcoal blue
];

const roles = [
  { value: "all", label: "ALL", color: "#C4A265" },
  { value: "sniper", label: "SNIPER", color: "#565B6A" },
  { value: "rusher", label: "RUSHER", color: "#2E7AB8" },
  { value: "support", label: "SUPPORT", color: "#2A8E5A" },
  { value: "medic", label: "MEDIC", color: "#238B8E" },
];

const roleLabel: Record<string, string> = {
  sniper: "SHARPSHOOTER",
  rusher: "ASSAULT",
  support: "TACTICAL",
  medic: "FIELD MEDIC",
};

/* ── SVG Crown icon (replaces emoji) ── */
function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
  );
}

/* ══════════════════════════════════════
   BioProfile — individual member card
   ══════════════════════════════════════ */
function BioProfile({
  member,
  isActive,
  onClick,
  colorIndex,
}: {
  member: Member;
  isActive: boolean;
  onClick: () => void;
  colorIndex: number;
}) {
  const colors = cardColors[colorIndex % cardColors.length];
  const bg = colors.bg;
  const bgLight = colors.light;

  return (
    <motion.div
      className="cursor-pointer select-none relative group/card"
      onClick={onClick}
      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.92 }}
      whileHover={isActive ? { y: -4 } : { opacity: 0.65, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* ── Outer shell ── */}
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
        style={{
          backgroundColor: "#111111",
          border: `1px solid ${isActive ? bg + "40" : "rgba(255,255,255,0.06)"}`,
          boxShadow: isActive
            ? "0 4px 16px rgba(0,0,0,0.25)"
            : "0 2px 8px rgba(0,0,0,0.15)",
          transition: "border-color 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        {/* Content */}
        <div className="relative flex flex-col sm:flex-row">
          {/* Left: Avatar panel */}
          <div
            className="flex flex-row sm:flex-col items-center sm:justify-center gap-4 sm:gap-0 px-4 py-4 sm:px-8 sm:py-10 sm:w-[220px] shrink-0 relative"
            style={{ backgroundColor: `${bg}12` }}
          >
            {/* Vertical separator — desktop */}
            <div
              className="hidden sm:block absolute right-0 top-6 bottom-6 w-px"
              style={{ backgroundColor: `${bg}30` }}
            />
            {/* Horizontal separator — mobile */}
            <div
              className="sm:hidden absolute bottom-0 left-4 right-4 h-px"
              style={{ backgroundColor: `${bg}20` }}
            />

            {/* Avatar ring with pulse */}
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0">
              {/* Breathing pulse ring on active */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  scale: isActive ? [1, 1.15, 1] : 1,
                  opacity: isActive ? [0.3, 0, 0.3] : 0,
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ backgroundColor: bg }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: `${bg}30` }}
              />
              <div className="relative w-[56px] h-[56px] sm:w-[88px] sm:h-[88px] rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
                <span className="font-display text-3xl sm:text-5xl text-white/90">
                  {member.nickname.charAt(0).toUpperCase()}
                </span>
              </div>
              {member.isLeader && (
                <motion.div
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg border-2 border-black/30"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <CrownIcon className="w-3.5 h-3.5 text-yellow-900" />
                </motion.div>
              )}
            </div>

            {/* Mobile: status + KD inline */}
            <div className="flex sm:hidden flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    member.status === "online"
                      ? "bg-green-400 animate-pulse-online"
                      : "bg-white/30"
                  }`}
                />
                <span className="text-xs font-[var(--font-condensed)] uppercase tracking-wider text-white/50">
                  {member.status}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1 w-fit"
                style={{ backgroundColor: bgLight }}
              >
                <svg className="w-3 h-3 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-display text-sm text-white">
                  {member.kdRatio.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Desktop: status + KD stacked */}
            <div className="hidden sm:flex flex-col items-center">
              <div className="flex items-center gap-1.5 mt-4">
                <span
                  className={`h-2 w-2 rounded-full ${
                    member.status === "online"
                      ? "bg-green-400 animate-pulse-online"
                      : "bg-white/30"
                  }`}
                />
                <span className="text-xs font-[var(--font-condensed)] uppercase tracking-wider text-white/50">
                  {member.status}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 mt-3"
                style={{ backgroundColor: bgLight }}
              >
                <svg className="w-3.5 h-3.5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-display text-base text-white">
                  {member.kdRatio.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Bio data */}
          <div className="flex-1 px-4 py-4 sm:px-8 sm:py-8 flex flex-col justify-center min-w-0">
            <motion.p
              animate={{ x: isActive ? 0 : -4, opacity: isActive ? 0.4 : 0.25 }}
              transition={{ duration: 0.3 }}
              className="font-[var(--font-condensed)] text-xs uppercase tracking-[0.25em] text-white/40"
            >
              {roleLabel[member.role] || member.role}
            </motion.p>
            <h3 className="font-display text-2xl sm:text-4xl text-white leading-none tracking-wide mt-0.5">
              {member.nickname}
            </h3>
            <p
              className="text-sm text-white/60 mt-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {member.name}
            </p>

            {/* Bio text */}
            {member.bio && (
              <p
                className="text-sm text-white/40 mt-3 leading-relaxed line-clamp-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {member.bio}
              </p>
            )}

            {/* Animated divider — colored fill extends when active */}
            <div className="relative h-px w-full mt-3 mb-3 sm:mt-5 sm:mb-4">
              <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
              <motion.div
                className="absolute inset-y-0 left-0"
                animate={{ width: isActive ? "100%" : "0%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ backgroundColor: `${bg}40` }}
              />
            </div>

            {/* Stats row — staggered entrance */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <BioStat label="Rank" value={member.rank} bg={bg} delay={0} isActive={isActive} />
              <BioStat label="Kota" value={member.city} bg={bg} delay={0.05} isActive={isActive} />
              <BioStat label="Joined" value={member.joinDate} bg={bg} delay={0.1} isActive={isActive} />
            </div>

            {member.isLeader && (
              <div className="mt-4">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-[var(--font-condensed)] text-[10px] uppercase tracking-[0.15em] text-white font-medium"
                  style={{ backgroundColor: bg }}
                >
                  <CrownIcon className="w-3 h-3 text-yellow-300" />
                  Clan Leader
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Stat pill with staggered motion ── */
function BioStat({
  label,
  value,
  bg,
  delay = 0,
  isActive = true,
}: {
  label: string;
  value: string;
  bg: string;
  delay?: number;
  isActive?: boolean;
}) {
  return (
    <motion.div
      className="rounded-lg px-3 py-1.5"
      style={{ backgroundColor: `${bg}22` }}
      animate={{ y: isActive ? 0 : 4, opacity: isActive ? 1 : 0.6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay }}
    >
      <p className="text-[10px] font-[var(--font-condensed)] uppercase tracking-[0.15em] text-white/35 leading-none mb-1">
        {label}
      </p>
      <p
        className="text-sm font-medium text-white/80 truncate"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {value}
      </p>
    </motion.div>
  );
}

/* ── Navigation arrow with spring feedback ── */
function NavArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.1 }}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {direction === "left" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 6 15 12 9 18" />
        )}
      </svg>
    </motion.button>
  );
}

const CARD_GAP = 24;

/* ══════════════════════════════════════
   MemberGrid — main section
   ══════════════════════════════════════ */
export default function MemberGrid({ members }: MemberGridProps) {
  const [activeRole, setActiveRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Measure container inner width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const style = getComputedStyle(containerRef.current);
        const pl = parseFloat(style.paddingLeft) || 0;
        const pr = parseFloat(style.paddingRight) || 0;
        setContainerWidth(containerRef.current.offsetWidth - pl - pr);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const filtered = useMemo(() => {
    let result = [...members];

    if (activeRole !== "all") {
      result = result.filter((m) => m.role === activeRole);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.nickname.toLowerCase().includes(q) ||
          m.name.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (a.isLeader !== b.isLeader) return a.isLeader ? -1 : 1;
      return rankOrder[b.rank] - rankOrder[a.rank];
    });

    return result;
  }, [members, activeRole, searchQuery]);

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIndex(0);
    controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
  }, [filtered.length, controls]);

  const getCardWidth = useCallback(() => {
    return containerWidth || 480;
  }, [containerWidth]);

  const slideTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, filtered.length - 1));
      setActiveIndex(clamped);
      const cardW = getCardWidth();
      controls.start({
        x: -clamped * (cardW + CARD_GAP),
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    },
    [filtered.length, controls, getCardWidth]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const cardW = getCardWidth();
      const threshold = cardW / 4;
      if (info.offset.x < -threshold) {
        slideTo(activeIndex + 1);
      } else if (info.offset.x > threshold) {
        slideTo(activeIndex - 1);
      } else {
        slideTo(activeIndex);
      }
    },
    [activeIndex, slideTo, getCardWidth]
  );

  // Keyboard navigation (← →)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") slideTo(activeIndex - 1);
      else if (e.key === "ArrowRight") slideTo(activeIndex + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, slideTo]);

  return (
    <section id="members" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 relative">
        {/* ── Section title — staggered viewport entrance ── */}
        <div className="mb-12 text-center sm:text-left">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-[var(--font-condensed)] text-sm sm:text-base uppercase tracking-[0.3em] text-primary/60 mb-3"
          >
            Squad Members
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
              className="font-display text-6xl md:text-7xl lg:text-8xl tracking-wide text-white leading-none"
            >
              ROSTER
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden sm:flex items-center gap-3 flex-1"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ transformOrigin: "left" }}
                className="h-px flex-1 bg-white/10"
              />
              <span className="font-[var(--font-condensed)] text-sm uppercase tracking-[0.2em] text-white/30">
                {filtered.length} members
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="sm:hidden font-[var(--font-condensed)] text-sm uppercase tracking-[0.2em] text-white/30"
            >
              {filtered.length} members
            </motion.p>
          </div>
        </div>

        {/* ── Filters + Search + Nav ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
          {/* Role filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {roles.map((role) => {
              const isActive = activeRole === role.value;
              return (
                <motion.button
                  key={role.value}
                  onClick={() => setActiveRole(role.value)}
                  whileTap={{ scale: 0.96 }}
                  className="relative whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-[var(--font-condensed)] uppercase tracking-[0.15em] border cursor-pointer"
                  style={{
                    borderColor: isActive ? "transparent" : "rgba(255,255,255,0.12)",
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.45)",
                    transition: "color 0.25s ease, border-color 0.25s ease",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeRolePill"
                      className="absolute inset-0 rounded-full overflow-hidden"
                      style={{ backgroundColor: role.color }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    {role.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full md:w-72 group/search">
              {/* Glow ring on focus */}
              <div className="absolute -inset-px rounded-full opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(196,162,101,0.25), rgba(196,162,101,0.05))" }} />
              <motion.svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none z-10"
                animate={{
                  color: searchQuery ? "rgba(196,162,101,0.9)" : "rgba(255,255,255,0.3)",
                  scale: searchQuery ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </motion.svg>
              <input
                placeholder="Cari member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative w-full h-11 rounded-full border border-white/10 bg-white/5 pl-11 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white/[0.08] hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-sm"
                style={{ fontFamily: "var(--font-body)" }}
              />
              {/* Clear button */}
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary/20 text-white/50 hover:text-primary transition-colors duration-200 cursor-pointer"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <NavArrow
                direction="left"
                onClick={() => slideTo(activeIndex - 1)}
                disabled={activeIndex === 0}
              />
              <NavArrow
                direction="right"
                onClick={() => slideTo(activeIndex + 1)}
                disabled={activeIndex >= filtered.length - 1}
              />
            </div>
          </div>
        </div>

        {/* ── Counter + progress ── */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between mb-4 gap-4">
            {/* Animated counter — number slides on change */}
            <div className="flex items-center gap-0.5 font-[var(--font-condensed)] text-[10px] uppercase tracking-[0.2em] text-white/30 shrink-0 overflow-hidden h-4">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={activeIndex}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {activeIndex + 1}
                </motion.span>
              </AnimatePresence>
              <span className="mx-0.5">/</span>
              <span>{filtered.length}</span>
            </div>

            {/* Progress bar — mobile (spring animated) */}
            <div className="flex-1 sm:hidden">
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  animate={{
                    width: `${((activeIndex + 1) / filtered.length) * 100}%`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ backgroundColor: "rgba(196, 162, 101, 0.8)" }}
                />
              </div>
            </div>

            {/* Navigation dots — desktop (spring animated) */}
            <div className="hidden sm:flex items-center gap-1.5">
              {filtered.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => slideTo(i)}
                  animate={{
                    width: i === activeIndex ? 24 : 8,
                    backgroundColor:
                      i === activeIndex
                        ? "rgba(196, 162, 101, 0.8)"
                        : "rgba(255, 255, 255, 0.15)",
                  }}
                  whileHover={{
                    backgroundColor:
                      i === activeIndex
                        ? "rgba(196, 162, 101, 0.9)"
                        : "rgba(255, 255, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="h-1.5 rounded-full cursor-pointer"
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Horizontal bio slider ── */}
        <div
          ref={containerRef}
          className="overflow-hidden relative -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8 -my-6 py-6"
        >
          <motion.div
            className="flex"
            drag="x"
            style={{ x, gap: CARD_GAP }}
            dragConstraints={{
              left: -(filtered.length - 1) * (getCardWidth() + CARD_GAP),
              right: 0,
            }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            animate={controls}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((member, i) => (
                <motion.div
                  key={member.nickname}
                  className="shrink-0"
                  style={{ width: containerWidth || "100%" }}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.04 }}
                >
                  <BioProfile
                    member={member}
                    isActive={i === activeIndex}
                    onClick={() => setSelectedMember(member)}
                    colorIndex={i}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Mobile navigation arrows */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
          <NavArrow
            direction="left"
            onClick={() => slideTo(activeIndex - 1)}
            disabled={activeIndex === 0}
          />
          <p className="font-[var(--font-condensed)] text-xs uppercase tracking-[0.2em] text-white/40">
            Swipe or tap
          </p>
          <NavArrow
            direction="right"
            onClick={() => slideTo(activeIndex + 1)}
            disabled={activeIndex >= filtered.length - 1}
          />
        </div>

        {/* ── Empty state — floating icon + reset button ── */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-12 h-12 text-muted-foreground/30 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-[var(--font-condensed)] text-sm uppercase tracking-[0.15em] text-muted-foreground"
            >
              Tidak ada member yang ditemukan
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSearchQuery(""); setActiveRole("all"); }}
              className="mt-4 px-5 py-2 rounded-full border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-colors cursor-pointer font-[var(--font-condensed)] uppercase tracking-wider"
            >
              Reset Filter
            </motion.button>
          </motion.div>
        )}

        {/* Member dialog */}
        <MemberDialog
          member={selectedMember}
          open={!!selectedMember}
          onOpenChange={(open) => {
            if (!open) setSelectedMember(null);
          }}
        />
      </div>
    </section>
  );
}
