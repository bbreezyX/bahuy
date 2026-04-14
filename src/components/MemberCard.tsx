import { motion } from "motion/react";
import type { Member } from "@/data/members";

interface MemberCardProps {
  member: Member;
  index: number;
  onClick: () => void;
}

const roleBg: Record<string, string> = {
  sniper: "#8B2020",
  rusher: "#C86A1A",
  support: "#2563A8",
  medic: "#1F7A45",
};

const roleBgLight: Record<string, string> = {
  sniper: "#A83030",
  rusher: "#E08030",
  support: "#3B82C6",
  medic: "#2D9958",
};

const roleLabel: Record<string, string> = {
  sniper: "SHARPSHOOTER",
  rusher: "ASSAULT",
  support: "TACTICAL",
  medic: "FIELD MEDIC",
};

function ScopeSVG() {
  return (
    <svg className="absolute top-3 right-3 w-16 h-16 text-white pointer-events-none" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="0.8" opacity="0.08" />
      <line x1="32" y1="4" x2="32" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      <line x1="32" y1="46" x2="32" y2="60" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      <line x1="4" y1="32" x2="18" y2="32" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      <line x1="46" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
    </svg>
  );
}

function CamoPatternSVG() {
  return (
    <svg className="absolute bottom-0 left-0 w-full h-20 text-white pointer-events-none" viewBox="0 0 200 50" fill="none" preserveAspectRatio="none">
      <ellipse cx="30" cy="40" rx="25" ry="15" fill="currentColor" opacity="0.03" />
      <ellipse cx="120" cy="35" rx="35" ry="12" fill="currentColor" opacity="0.04" />
      <ellipse cx="170" cy="42" rx="20" ry="10" fill="currentColor" opacity="0.03" />
      <path d="M0 45 Q50 30 100 42 Q150 50 200 38" stroke="currentColor" strokeWidth="0.5" opacity="0.06" fill="none" />
    </svg>
  );
}

function ChevronDeco() {
  return (
    <svg className="absolute bottom-3 right-3 w-8 h-8 text-white pointer-events-none" viewBox="0 0 32 32" fill="none">
      <path d="M8 12 L16 20 L24 12" stroke="currentColor" strokeWidth="1.5" opacity="0.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8 L16 16 L24 8" stroke="currentColor" strokeWidth="1.5" opacity="0.06" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MemberCard({ member, index, onClick }: MemberCardProps) {
  const bg = roleBg[member.role] || "#C4A265";
  const bgLight = roleBgLight[member.role] || "#D4B275";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -6 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div
        className="rounded-[24px] overflow-hidden shadow-xl shadow-black/30 hover:shadow-2xl hover:shadow-black/40 transition-shadow duration-300 relative"
        style={{ backgroundColor: bg }}
      >
        {/* SVG decorations */}
        <ScopeSVG />
        <CamoPatternSVG />
        <ChevronDeco />

        {/* Top: role label + nickname */}
        <div className="relative px-5 pt-5 pb-2">
          <p className="font-[var(--font-condensed)] text-[9px] uppercase tracking-[0.25em] text-white/40">
            {roleLabel[member.role] || member.role}
          </p>
          <h3 className="font-display text-2xl text-white leading-none tracking-wide mt-0.5">
            {member.nickname}
          </h3>
        </div>

        {/* KD badge */}
        <div className="absolute top-4 right-4 z-10">
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-lg"
            style={{ backgroundColor: bgLight }}
          >
            <svg className="w-3 h-3 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-display text-xs text-white">{member.kdRatio.toFixed(1)}</span>
          </div>
        </div>

        {/* Avatar + info area */}
        <div className="relative flex flex-col items-center px-5 pt-4 pb-5">
          {/* Decorative ring */}
          <div className="absolute w-28 h-28 rounded-full border border-white/[0.06] top-2" />

          <div className="relative w-18 h-18 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center w-[72px] h-[72px]">
            <span className="font-display text-4xl text-white/90">
              {member.nickname.charAt(0).toUpperCase()}
            </span>
            {member.isLeader && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs shadow-lg">
                👑
              </div>
            )}
          </div>

          <p className="mt-2 text-xs text-white/60" style={{ fontFamily: "var(--font-body)" }}>
            {member.name}
          </p>

          {/* Status */}
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                member.status === "online"
                  ? "bg-green-400 animate-pulse-online"
                  : "bg-white/30"
              }`}
            />
            <span className="text-[9px] font-[var(--font-condensed)] uppercase tracking-wider text-white/40">
              {member.status}
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-4 w-full justify-center">
            <StatPill label="Rank" value={member.rank} bgLight={bgLight} />
            <StatPill label="Kota" value={member.city} bgLight={bgLight} />
          </div>
          <div className="flex items-center gap-4 mt-2 w-full justify-center">
            <StatPill label="K/D" value={member.kdRatio.toFixed(1)} bgLight={bgLight} />
            <StatPill label="Joined" value={member.joinDate} bgLight={bgLight} />
          </div>

          {/* Leader badge */}
          {member.isLeader && (
            <div
              className="mt-4 rounded-full px-4 py-1.5 text-center"
              style={{ backgroundColor: bgLight }}
            >
              <span className="font-[var(--font-condensed)] text-[10px] uppercase tracking-[0.15em] text-white font-medium">
                👑 Clan Leader
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatPill({ label, value, bgLight }: { label: string; value: string; bgLight: string }) {
  return (
    <div
      className="flex-1 rounded-2xl px-3 py-2 text-center"
      style={{ backgroundColor: `${bgLight}44` }}
    >
      <p className="text-[8px] font-[var(--font-condensed)] uppercase tracking-[0.15em] text-white/40 leading-none mb-0.5">
        {label}
      </p>
      <p className="text-xs font-medium text-white truncate" style={{ fontFamily: "var(--font-body)" }}>
        {value}
      </p>
    </div>
  );
}
