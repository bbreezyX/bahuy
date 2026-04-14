import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Member } from "@/data/members";

import MemberCard from "./MemberCard";
import MemberProfile from "./MemberProfile";

interface MemberGridProps {
  members: Member[];
}

const roles = [
  { value: "all", label: "ALL", color: "#C4A265" },
  { value: "sniper", label: "SNIPER", color: "#565B6A" },
  { value: "rusher", label: "RUSHER", color: "#2E7AB8" },
  { value: "support", label: "SUPPORT", color: "#2A8E5A" },
  { value: "medic", label: "MEDIC", color: "#238B8E" },
];

const slideVariants = {
  enterFromRight: { x: "60%", opacity: 0 },
  enterFromLeft: { x: "-60%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: "-60%", opacity: 0 },
  exitToRight: { x: "60%", opacity: 0 },
};

const slideTransition = { type: "spring" as const, stiffness: 260, damping: 28 };

export default function MemberGrid({ members }: MemberGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const [activeRole, setActiveRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Scroll so the "Squad Members / ROSTER" heading sits just below the navbar.
  // The section has py-20 (80px) / md:py-28 (112px) top padding — skip most of it
  // so the heading is immediately visible with the profile content below it.
  useEffect(() => {
    if (!sectionRef.current) return;
    requestAnimationFrame(() => {
      const navHeight = 96;
      const sectionTop = sectionRef.current!.getBoundingClientRect().top + window.scrollY;
      // Eat into the section padding so the heading appears right below the navbar
      const paddingSkip = window.innerWidth >= 768 ? 90 : 60;
      const top = sectionTop + paddingSkip - navHeight;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }, [selectedMember]);

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

    result.sort((a, b) => a.nickname.localeCompare(b.nickname));

    return result;
  }, [members, activeRole, searchQuery]);

  const handleCardClick = useCallback((member: Member) => {
    setSelectedMember(member);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedMember(null);
  }, []);

  return (
    <section ref={sectionRef} id="members" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 relative">
        {/* Section title -- always visible */}
        <div className="mb-12 text-center sm:text-left">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-[var(--font-condensed)] text-sm sm:text-base uppercase tracking-[0.3em] text-primary/60 mb-3 font-semibold"
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

        {/* View container with overflow hidden for slide transitions */}
        <div ref={viewRef} className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {selectedMember ? (
              /* ── Profile view ── */
              <motion.div
                key={`profile-${selectedMember.nickname}`}
                variants={slideVariants}
                initial="enterFromRight"
                animate="center"
                exit="exitToRight"
                transition={slideTransition}
              >
                <MemberProfile member={selectedMember} onBack={handleBack} />
              </motion.div>
            ) : (
              /* ── Grid view ── */
              <motion.div
                key="grid-view"
                variants={slideVariants}
                initial="enterFromLeft"
                animate="center"
                exit="exitToLeft"
                transition={slideTransition}
              >
                {/* Filters + Search */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
                  <div className="w-full md:w-auto overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 w-max md:w-auto">
                      {roles.map((role) => {
                        const isActive = activeRole === role.value;
                        return (
                          <motion.button
                            key={role.value}
                            onClick={() => setActiveRole(role.value)}
                            whileTap={{ scale: 0.96 }}
                            className="relative whitespace-nowrap rounded-full px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-[var(--font-condensed)] uppercase tracking-[0.15em] font-medium border cursor-pointer"
                            style={{
                              borderColor: isActive ? "transparent" : "rgba(255,255,255,0.20)",
                              color: isActive ? "#ffffff" : "rgba(255,255,255,0.65)",
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
                  </div>

                  <div className="relative w-full md:w-72 group/search">
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
                      className="relative w-full h-11 rounded-full border border-white/10 bg-white/5 pl-11 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white/[0.08] hover:border-white/20 hover:bg-white/[0.10] transition-all duration-300 backdrop-blur-sm"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
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
                </div>

                {/* Card grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((member, i) => (
                      <MemberCard
                        key={member.nickname}
                        member={member}
                        index={i}
                        isSelected={false}
                        onClick={() => handleCardClick(member)}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Empty state */}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
