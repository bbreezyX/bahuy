/** @jsxImportSource react */
import { motion } from "motion/react";
import type { ScheduleEvent } from "@/data/schedules";
import type { Member } from "@/data/members";
import {
  gameModeLabels,
  gameModeColors,
  statusLabels,
  statusColors,
} from "@/data/schedules";
import { formatDate, formatTimeRange, getRelativeDay } from "@/lib/schedule-utils";

interface ScheduleCardProps {
  event: ScheduleEvent;
  members: Member[];
  index: number;
}

export default function ScheduleCard({ event, members, index }: ScheduleCardProps) {
  const modeColor = gameModeColors[event.gameMode];
  const stColor = statusColors[event.status];
  const isFinished = event.status === "completed" || event.status === "cancelled";
  const relativeDay = getRelativeDay(event.date);

  const memberMap = new Map(members.map((m) => [m.nickname, m]));
  const participantMembers = event.participants
    .map((nick) => memberMap.get(nick))
    .filter(Boolean) as Member[];

  const maxShow = 5;
  const shown = participantMembers.slice(0, maxShow);
  const extra = participantMembers.length - maxShow;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={isFinished ? undefined : { y: -3 }}
      className={isFinished ? "opacity-50" : ""}
    >
      <div
        className="relative rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors"
      >
        {/* Top color strip */}
        <div className="h-[3px]" style={{ background: modeColor }} />

        <div className="p-5 sm:p-6">
          {/* Header: mode badge + status badge */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <span
              className="inline-block font-[var(--font-condensed)] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full text-white/90 font-medium"
              style={{ backgroundColor: modeColor + "30", color: modeColor }}
            >
              {gameModeLabels[event.gameMode]}
            </span>

            <span
              className="inline-flex items-center gap-1.5 font-[var(--font-condensed)] text-[10px] sm:text-[11px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: stColor + "20", color: stColor }}
            >
              {event.status === "ongoing" && (
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: stColor }} />
              )}
              {statusLabels[event.status]}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-display text-lg sm:text-xl text-white leading-tight tracking-wide mb-3"
            style={event.status === "cancelled" ? { textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.3)" } : undefined}
          >
            {event.title}
          </h3>

          {/* Description */}
          {event.description && (
            <p className="text-sm text-white/40 mb-4 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              {event.description}
            </p>
          )}

          {/* Date & Time */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 mb-4">
            <div className="flex items-center gap-2 text-white/60">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="font-[var(--font-condensed)] text-sm tracking-wide">
                {relativeDay ? (
                  <><span className="text-primary font-semibold">{relativeDay}</span> &middot; {formatDate(event.date)}</>
                ) : (
                  formatDate(event.date)
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="font-[var(--font-condensed)] text-sm tracking-wide">
                {formatTimeRange(event.startTime, event.endTime)}
              </span>
            </div>
          </div>

          {/* Recurring badge */}
          {event.isRecurring && event.recurringDay && (
            <div className="flex items-center gap-1.5 mb-4">
              <svg className="w-3.5 h-3.5 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
                <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
              </svg>
              <span className="font-[var(--font-condensed)] text-xs uppercase tracking-[0.15em] text-primary/70 font-medium">
                Tiap {event.recurringDay}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mb-4" />

          {/* Host */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="font-[var(--font-condensed)] text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">Host</span>
            {(() => {
              const host = memberMap.get(event.hostNickname);
              return (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                    {host?.avatar ? (
                      <img src={host.avatar} alt={host.nickname} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] font-bold text-white/40">{event.hostNickname[0]}</span>
                    )}
                  </div>
                  <span className="font-[var(--font-body)] text-sm text-white/80 font-semibold">{event.hostNickname}</span>
                </div>
              );
            })()}
          </div>

          {/* Participants */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {shown.map((m, i) => (
                <div
                  key={m.nickname}
                  className="w-7 h-7 rounded-full overflow-hidden border-2 border-[#0e1112] bg-white/10 flex items-center justify-center shrink-0"
                  style={{ marginLeft: i > 0 ? -8 : 0, zIndex: maxShow - i }}
                  title={m.nickname}
                >
                  {m.avatar ? (
                    <img src={m.avatar} alt={m.nickname} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[8px] font-bold text-white/40">{m.nickname[0]}</span>
                  )}
                </div>
              ))}
              {extra > 0 && (
                <div
                  className="w-7 h-7 rounded-full border-2 border-[#0e1112] bg-white/10 flex items-center justify-center shrink-0"
                  style={{ marginLeft: -8, zIndex: 0 }}
                >
                  <span className="text-[9px] font-bold text-white/50">+{extra}</span>
                </div>
              )}
            </div>
            <span className="font-[var(--font-condensed)] text-xs tracking-wider text-white/40">
              {event.participants.length}{event.maxParticipants ? `/${event.maxParticipants}` : ""} slot
            </span>
          </div>

          {/* Notes */}
          {event.notes && (
            <div className="mt-4 px-3 py-2 rounded bg-white/[0.03] border-l-2" style={{ borderColor: modeColor + "60" }}>
              <p className="text-xs text-white/35 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                {event.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
