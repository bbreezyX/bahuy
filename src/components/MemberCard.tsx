/** @jsxImportSource react */
import { motion } from "motion/react";
import type { Member } from "@/data/members";
import AvatarIcon from "./AvatarIcon";
import CardFrame from "./CardFrame";

interface MemberCardProps {
  member: Member;
  index: number;
  isSelected: boolean;
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

export { roleBg, roleBgLight, roleLabel };

export default function MemberCard({ member, index, isSelected, onClick }: MemberCardProps) {
  const bg = roleBg[member.role] || "#C4A265";
  const bgLight = roleBgLight[member.role] || "#D4B275";
  const accent = isSelected ? bgLight : "#f9c651";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
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
        {/* Portrait content (behind frame, only visible inside the shape) */}
        <div className="absolute inset-0 z-10">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.nickname}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#141819]">
              {/* Biodata-style photo placeholder with frame */}
              <div className="relative w-[65%] h-[70%] flex items-center justify-center">
                {/* Outer frame */}
                <div className="absolute inset-0 rounded-sm border border-white/[0.08]" />
                {/* Inner frame line */}
                <div className="absolute inset-[3px] rounded-sm border border-white/[0.05]" />
                {/* Corner accents */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 120" fill="none" preserveAspectRatio="none">
                  <path d="M0 12 L0 0 L12 0" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                  <path d="M88 0 L100 0 L100 12" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                  <path d="M100 108 L100 120 L88 120" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                  <path d="M12 120 L0 120 L0 108" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                </svg>
                {/* Person silhouette */}
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

        {/* SVG tech frame — dark border frames the photo, inner cutout shows image */}
        <CardFrame accent={accent} bgFill={member.avatar ? undefined : bg} hasAvatar={!!member.avatar} />

        {/* Role tag top-left */}
        <div className="absolute top-[7%] left-[8%] z-30">
          <span
            className="inline-block font-[var(--font-condensed)] text-[7px] sm:text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 text-white/80"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          >
            {roleLabel[member.role] || member.role}
          </span>
        </div>

        {/* Leader crown badge */}
        {member.isLeader && (
          <div className="absolute top-[6%] right-[8%] z-30 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          </div>
        )}


        {/* Name area at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-[8%] pb-[6%]">
          <h3 className="font-display text-sm sm:text-base lg:text-lg text-white leading-tight tracking-wide truncate text-center">
            {member.nickname}
          </h3>
          <p
            className="text-[9px] sm:text-[10px] text-white/40 truncate mt-0.5 text-center"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {member.name}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
