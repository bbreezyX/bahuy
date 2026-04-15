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
        <span className="font-[var(--font-condensed)] text-xs font-bold uppercase tracking-[0.2em] text-white/40 group-hover/back:text-white/60 transition-colors drop-shadow-md">
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
          <div className="relative aspect-[3/4.6] overflow-hidden bg-[#0e1112] rounded-lg" style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 0 40px 0px ${bg}90` }}>
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
          <div className="bg-[#0f1214] border border-white/10 rounded-xl p-6 md:p-8 relative overflow-hidden group h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div
              className="absolute -top-24 -right-24 w-64 h-64 bg-current opacity-[0.03] blur-3xl rounded-full pointer-events-none"
              style={{ color: bg }}
            />

            <div className="relative z-10">
              {member.isLeader && (
                <div className="flex items-center gap-1.5 mb-6">
                  <CrownIcon className="w-4 h-4 text-yellow-500/80" />
                  <span className="font-[var(--font-condensed)] text-sm font-extrabold uppercase tracking-[0.2em] text-yellow-500">
                    Clan Leader
                  </span>
                </div>
              )}

              <h4 className="font-[var(--font-condensed)] text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-6 flex items-center gap-3">
                <span className="h-px bg-white/10 w-8" />
                Operative Data
                <span className="h-px bg-white/10 flex-1" />
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatBox label="Name" value={member.name} accent={bgLight} />
                <StatBox label="Nickname" value={member.nickname} accent={bgLight} />
                <StatBox label="Skills" value={roleLabel[member.role] || member.role} accent={bgLight} />
                <StatBox label="City" value={member.city} accent={bgLight} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatBox({ label, value, accent, className = "" }: { label: string; value: string | number; accent: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#0e1112] border border-white/10 rounded-lg p-5 flex flex-col justify-between group hover:border-white/20 transition-colors ${className}`}>
      {/* Background glow on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500" 
        style={{ backgroundImage: `radial-gradient(circle at center, ${accent} 0%, transparent 70%)` }}
      />
      
      <span className="font-[var(--font-condensed)] text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/30 z-10 mb-2 group-hover:text-white/50 transition-colors">
        {label}
      </span>
      <span className="text-xl sm:text-2xl font-bold text-white z-10 tracking-tight mt-1" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </span>

      {/* Decorative corner bracket */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-50 pointer-events-none" 
        style={{ borderColor: accent }}
      />
    </div>
  );
}
