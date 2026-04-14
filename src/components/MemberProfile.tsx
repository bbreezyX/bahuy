/** @jsxImportSource react */
import { motion } from "motion/react";
import type { Member } from "@/data/members";
import { roleBg, roleBgLight, roleLabel } from "./MemberCard";
import CardFrame from "./CardFrame";

interface MemberProfileProps {
  member: Member;
  onBack: () => void;
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
  );
}

export default function MemberProfile({ member, onBack }: MemberProfileProps) {
  const bg = roleBg[member.role] || "#C4A265";
  const bgLight = roleBgLight[member.role] || "#D4B275";

  return (
    <div>
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        onClick={onBack}
        className="flex items-center gap-2 mb-8 group/back cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover/back:bg-white/10 group-hover/back:border-white/20 transition-colors">
          <svg className="w-4 h-4 text-white/60 group-hover/back:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
        <span className="font-[var(--font-condensed)] text-xs uppercase tracking-[0.2em] text-white/40 group-hover/back:text-white/60 transition-colors">
          Back to roster
        </span>
      </motion.button>

      {/* Profile layout: two-column on desktop, stacked on mobile */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

        {/* Left: portrait card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.05 }}
          className="shrink-0 w-full lg:w-[320px] xl:w-[360px]"
        >
          <div className="relative aspect-[3/4.6] overflow-hidden bg-[#0e1112] rounded-lg" style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 0 40px -8px ${bg}80` }}>
            {/* Portrait content */}
            <div className="absolute inset-0 z-10">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.nickname}
                  className="absolute inset-0 w-full h-full object-cover object-top"
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
                className="absolute bottom-0 left-0 right-0 h-[45%] pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(14,17,18,0.95) 0%, rgba(14,17,18,0.7) 40%, transparent 100%)" }}
              />
            </div>

            {/* Tech frame — dark border frames the photo */}
            <CardFrame accent={bgLight} bgFill={member.avatar ? undefined : bg} hasAvatar={!!member.avatar} />

            {/* Leader crown */}
            {member.isLeader && (
              <div className="absolute top-[6%] right-[8%] z-30 w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
                <CrownIcon className="w-4 h-4 text-yellow-900" />
              </div>
            )}

            {/* Role + name at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-30 px-[8%] pb-[6%]">
              <span
                className="inline-block font-[var(--font-condensed)] text-[9px] uppercase tracking-[0.25em] px-2.5 py-0.5 text-white/80 mb-2"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                {roleLabel[member.role] || member.role}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-white leading-none tracking-wide">
                {member.nickname}
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Right: info panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex-1 min-w-0"
        >
          {/* Leader badge */}
          {member.isLeader && (
            <div className="flex items-center gap-1.5 mb-5">
              <CrownIcon className="w-4 h-4 text-yellow-500/80" />
              <span className="font-[var(--font-condensed)] text-sm font-extrabold uppercase tracking-[0.2em] text-yellow-500">
                Clan Leader
              </span>
            </div>
          )}

          {/* Info rows */}
          <div className="space-y-4">
            <ProfileRow label="Name" value={member.name} accent={bgLight} />
            <ProfileRow label="Nick Game" value={member.nickname} accent={bgLight} />
            <ProfileRow label="Skills" value={roleLabel[member.role] || member.role} accent={bgLight} />
            <ProfileRow label="City" value={member.city} accent={bgLight} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-white/[0.06] pb-3">
      <span className="font-[var(--font-condensed)] text-xs font-extrabold uppercase tracking-[0.2em] text-white/40 w-28 shrink-0">
        {label}
      </span>
      <span className="text-base font-bold text-white" style={{ fontFamily: "var(--font-body)" }}>
        {value}
      </span>
    </div>
  );
}
