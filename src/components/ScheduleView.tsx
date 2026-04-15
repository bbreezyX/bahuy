/** @jsxImportSource react */
import { useState, useMemo, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ScheduleEvent, GameMode } from "@/data/schedules";
import type { Member } from "@/data/members";
import { gameModeColors } from "@/data/schedules";
import { groupSchedulesByDate } from "@/lib/schedule-utils";
import {
  fetchSchedules,
  deleteSchedule,
  subscribeToSchedules,
} from "@/lib/schedule-api";
import ScheduleCard from "./ScheduleCard";
import ScheduleForm from "./ScheduleForm";

interface ScheduleViewProps {
  members: Member[];
  isAdmin?: boolean;
}

const modes: { value: "all" | GameMode; label: string; color: string }[] = [
  { value: "all", label: "ALL", color: "#C4A265" },
  { value: "ranked", label: "RANKED", color: gameModeColors.ranked },
  { value: "casual", label: "CASUAL", color: gameModeColors.casual },
  { value: "tournament", label: "TURNAMEN", color: gameModeColors.tournament },
  { value: "custom", label: "CUSTOM", color: gameModeColors.custom },
  { value: "scrimmage", label: "SCRIM", color: gameModeColors.scrimmage },
];

export default function ScheduleView({ members, isAdmin = false }: ScheduleViewProps) {
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<"all" | GameMode>("all");

  // CRUD dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | undefined>();

  // ── Fetch initial data ─────────────────────────────────
  useEffect(() => {
    fetchSchedules()
      .then(setSchedules)
      .catch((err) => console.error("Failed to fetch schedules:", err))
      .finally(() => setLoading(false));
  }, []);

  // ── Realtime subscription ──────────────────────────────
  useEffect(() => {
    const channel = subscribeToSchedules(
      // INSERT
      (newEvent) => {
        setSchedules((prev) => {
          if (prev.some((e) => e.id === newEvent.id)) return prev;
          return [...prev, newEvent];
        });
      },
      // UPDATE
      (updated) => {
        setSchedules((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e))
        );
      },
      // DELETE
      (deletedId) => {
        setSchedules((prev) => prev.filter((e) => e.id !== deletedId));
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // ── Handlers ───────────────────────────────────────────
  const handleEdit = useCallback((event: ScheduleEvent) => {
    setEditingEvent(event);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteSchedule(id);
      // Realtime will handle state update
    } catch (err) {
      console.error("Failed to delete schedule:", err);
    }
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingEvent(undefined);
    setFormOpen(true);
  }, []);

  // ── Derived data ───────────────────────────────────────
  const filtered = useMemo(() => {
    if (activeMode === "all") return schedules;
    return schedules.filter((s) => s.gameMode === activeMode);
  }, [schedules, activeMode]);

  const grouped = useMemo(() => groupSchedulesByDate(filtered), [filtered]);

  // Global index counter for stagger animation
  let globalIndex = 0;

  return (
    <section className="pb-20 md:pb-28 relative">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        {/* Header: Filter pills + Add button */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-1 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex items-center gap-1.5 sm:gap-2 w-max md:w-auto">
              {modes.map((mode) => {
                const isActive = activeMode === mode.value;
                return (
                  <motion.button
                    key={mode.value}
                    onClick={() => setActiveMode(mode.value)}
                    whileTap={{ scale: 0.96 }}
                    className="relative whitespace-nowrap rounded-full px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-[var(--font-condensed)] uppercase tracking-[0.15em] font-bold border cursor-pointer shadow-lg"
                    style={{
                      borderColor: isActive ? "transparent" : "rgba(255,255,255,0.30)",
                      backgroundColor: isActive ? "transparent" : "rgba(255,255,255,0.05)",
                      color: isActive ? "#ffffff" : "rgba(255,255,255,0.80)",
                      textShadow: isActive ? "0 1px 4px rgba(0,0,0,0.5)" : "none",
                      transition: "color 0.25s ease, border-color 0.25s ease, background-color 0.25s ease",
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeModePill"
                        className="absolute inset-0 rounded-full overflow-hidden"
                        style={{ backgroundColor: mode.color }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{mode.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Add button (admin only) */}
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOpenCreate}
              className="shrink-0 flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-primary text-primary-foreground font-[var(--font-condensed)] text-xs sm:text-sm uppercase tracking-[0.15em] font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="hidden sm:inline">Tambah</span>
            </motion.button>
          )}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/10 border-t-primary rounded-full mb-4"
            />
            <p className="font-[var(--font-condensed)] text-sm uppercase tracking-[0.15em] text-white/30">
              Memuat jadwal...
            </p>
          </div>
        ) : (
          /* Grouped schedule cards */
          <AnimatePresence mode="wait">
            {grouped.length > 0 ? (
              <motion.div
                key={activeMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {grouped.map((group) => (
                  <div key={group.group} className="mb-10 last:mb-0">
                    {/* Group label */}
                    <div className="flex items-center gap-4 mb-5">
                      <h3 className="font-[var(--font-condensed)] text-sm sm:text-base uppercase tracking-[0.25em] text-primary font-semibold whitespace-nowrap">
                        {group.label}
                      </h3>
                      <div className="h-px flex-1 bg-white/[0.10]" />
                      <span className="font-[var(--font-condensed)] text-xs uppercase tracking-[0.15em] text-white/40">
                        {group.events.length}
                      </span>
                    </div>

                    {/* Cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.events.map((event) => {
                        const idx = globalIndex++;
                        return (
                          <ScheduleCard
                            key={event.id}
                            event={event}
                            members={members}
                            index={idx}
                            onEdit={isAdmin ? handleEdit : undefined}
                            onDelete={isAdmin ? handleDelete : undefined}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg className="w-12 h-12 text-muted-foreground/30 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-[var(--font-condensed)] text-sm uppercase tracking-[0.15em] text-muted-foreground"
                >
                  Belum ada jadwal
                </motion.p>
                {activeMode !== "all" && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveMode("all")}
                    className="mt-4 px-5 py-2 rounded-full border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-colors cursor-pointer font-[var(--font-condensed)] uppercase tracking-wider"
                  >
                    Reset Filter
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Schedule Form Dialog (admin only) */}
      {isAdmin && (
        <ScheduleForm
          open={formOpen}
          onOpenChange={setFormOpen}
          members={members}
          initialData={editingEvent}
        />
      )}
    </section>
  );
}
