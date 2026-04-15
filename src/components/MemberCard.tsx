/** @jsxImportSource react */
import { motion } from "motion/react";
import type { Member } from "@/data/members";
import CardFrame from "./CardFrame";

interface MemberCardProps {
  member: Member;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const ACCENT = "#C4A265";
const ACCENT_LIGHT = "#D4B275";

export default function MemberCard({ member, index, isSelected, onClick }: MemberCardProps) {
  const accent = isSelected ? ACCENT_LIGHT : ACCENT;
  const hasValidAvatar = !!member.avatar && !member.avatar.includes("placeholder");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.015 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div 
        className="relative aspect-[3/4.6] overflow-hidden bg-[#0e1112] rounded-lg transition-shadow duration-300"
        style={{
          boxShadow: isSelected 
            ? `0 0 0 1px rgba(255,255,255,0.15)`
            : `0 0 0 1px rgba(255,255,255,0.05)`,
        }}
      >
        {/* Portrait content */}
        <div className="absolute inset-0 z-10">
          {hasValidAvatar ? (
            <img
              src={member.avatar}
              alt={member.nickname}
              className="absolute inset-0 w-full h-full object-cover object-top"
              loading="lazy"
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

          <div
            className="absolute bottom-0 left-0 right-0 h-[55%] pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(14,17,18,0.98) 0%, rgba(14,17,18,0.80) 50%, transparent 100%)" }}
          />
        </div>

        <CardFrame accent={accent} bgFill={hasValidAvatar ? undefined : ACCENT} hasAvatar={hasValidAvatar} />

        {/* Leader crown badge */}
        {member.isLeader && (
          <div className="absolute top-[6%] right-[8%] z-30 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          </div>
        )}

        {/* Bottom: skills + name */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-[8%] pb-[3%] flex flex-col items-center gap-1">
          {member.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="font-[var(--font-condensed)] text-[7px] sm:text-[8px] uppercase tracking-[0.12em] px-1.5 py-0.5 rounded text-white/80"
                  style={{ backgroundColor: "rgba(196,162,101,0.20)", border: "1px solid rgba(196,162,101,0.50)" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          <h3 className="font-display text-sm sm:text-base lg:text-lg text-white leading-tight tracking-wide truncate text-center">
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
    </motion.div>
  );
}
