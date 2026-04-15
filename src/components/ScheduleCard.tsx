/** @jsxImportSource react */
import { useState } from "react";
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
  onEdit?: (event: ScheduleEvent) => void;
  onDelete?: (id: string) => void;
}

export default function ScheduleCard({ event, members, index, onEdit, onDelete }: ScheduleCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
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
      className={`h-full ${isFinished ? "opacity-50" : ""}`}
    >
      <div
        className="relative h-full rounded-lg border border-white/[0.12] bg-white/[0.07] backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors"
      >
        <div className="p-5 sm:p-6">
          {/* Header: mode badge + status badge */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <span
              className="inline-block font-[var(--font-condensed)] text-xs sm:text-sm uppercase tracking-[0.2em] px-2.5 py-1 rounded-full text-white/90 font-bold"
              style={{ backgroundColor: modeColor + "30", color: modeColor, textShadow: `0 0 8px ${modeColor}60` }}
            >
              {gameModeLabels[event.gameMode]}
            </span>

            <span
              className="inline-flex items-center gap-1.5 font-[var(--font-condensed)] text-xs sm:text-sm uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-bold"
              style={{ backgroundColor: stColor + "20", color: stColor, textShadow: `0 0 8px ${stColor}60` }}
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
            <p className="text-sm text-white/40 mb-4 leading-relaxed" style={{ fontFamily: "var(--font-body)", textShadow: "0 1px 4px rgba(255,255,255,0.06)" }}>
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
            <div className="mt-4 px-3 py-2 rounded bg-white/[0.05] border-l-2" style={{ borderColor: modeColor + "60" }}>
              <p className="text-xs text-white/35 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                {event.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          {(onEdit || onDelete) && (
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2 justify-end">
              {onEdit && (
                <button
                  onClick={() => onEdit(event)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-[var(--font-condensed)] uppercase tracking-[0.15em] text-white/40 border border-white/10 hover:text-white/70 hover:border-white/20 transition-colors cursor-pointer"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
              )}
              {onDelete && !confirmDelete && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-[var(--font-condensed)] uppercase tracking-[0.15em] text-white/40 border border-white/10 hover:text-red-400 hover:border-red-400/30 transition-colors cursor-pointer"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Hapus
                </button>
              )}
              {onDelete && confirmDelete && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-[var(--font-condensed)] uppercase tracking-[0.1em] text-red-400/70">Yakin?</span>
                  <button
                    onClick={() => { onDelete(event.id); setConfirmDelete(false); }}
                    className="px-2.5 py-1 rounded-full text-[10px] font-[var(--font-condensed)] uppercase tracking-[0.1em] bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors cursor-pointer"
                  >
                    Ya
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-[var(--font-condensed)] uppercase tracking-[0.1em] text-white/40 border border-white/10 hover:text-white/60 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
