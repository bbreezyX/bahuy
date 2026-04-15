import { supabase } from "./supabase";
import type { ScheduleEvent, GameMode, ScheduleStatus } from "@/data/schedules";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ── DB row shape (snake_case) ──────────────────────────────

interface ScheduleRow {
  id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  game_mode: string;
  status: string;
  participants: string[];
  max_participants: number | null;
  host_nickname: string;
  notes: string | null;
  is_recurring: boolean;
  recurring_day: string | null;
  created_at: string;
  updated_at: string;
}

// ── Mappers ────────────────────────────────────────────────

function toScheduleEvent(row: ScheduleRow): ScheduleEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    date: row.date,
    startTime: row.start_time.slice(0, 5), // "HH:MM:SS" → "HH:MM"
    endTime: row.end_time.slice(0, 5),
    gameMode: row.game_mode as GameMode,
    status: row.status as ScheduleStatus,
    participants: row.participants ?? [],
    maxParticipants: row.max_participants ?? undefined,
    hostNickname: row.host_nickname,
    notes: row.notes ?? undefined,
    isRecurring: row.is_recurring || undefined,
    recurringDay: row.recurring_day ?? undefined,
  };
}

function toDbRow(
  data: Omit<ScheduleEvent, "id"> & { id?: string }
): Record<string, unknown> {
  return {
    ...(data.id ? { id: data.id } : {}),
    title: data.title,
    description: data.description ?? null,
    date: data.date,
    start_time: data.startTime,
    end_time: data.endTime,
    game_mode: data.gameMode,
    status: data.status,
    participants: data.participants,
    max_participants: data.maxParticipants ?? null,
    host_nickname: data.hostNickname,
    notes: data.notes ?? null,
    is_recurring: data.isRecurring ?? false,
    recurring_day: data.recurringDay ?? null,
  };
}

// ── CRUD ───────────────────────────────────────────────────

export async function fetchSchedules(): Promise<ScheduleEvent[]> {
  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw error;
  return (data as ScheduleRow[]).map(toScheduleEvent);
}

export async function createSchedule(
  event: Omit<ScheduleEvent, "id">
): Promise<ScheduleEvent> {
  const { data, error } = await supabase
    .from("schedules")
    .insert(toDbRow(event))
    .select()
    .single();

  if (error) throw error;
  return toScheduleEvent(data as ScheduleRow);
}

export async function updateSchedule(
  id: string,
  event: Partial<Omit<ScheduleEvent, "id">>
): Promise<ScheduleEvent> {
  const row: Record<string, unknown> = {};
  if (event.title !== undefined) row.title = event.title;
  if (event.description !== undefined) row.description = event.description ?? null;
  if (event.date !== undefined) row.date = event.date;
  if (event.startTime !== undefined) row.start_time = event.startTime;
  if (event.endTime !== undefined) row.end_time = event.endTime;
  if (event.gameMode !== undefined) row.game_mode = event.gameMode;
  if (event.status !== undefined) row.status = event.status;
  if (event.participants !== undefined) row.participants = event.participants;
  if (event.maxParticipants !== undefined) row.max_participants = event.maxParticipants ?? null;
  if (event.hostNickname !== undefined) row.host_nickname = event.hostNickname;
  if (event.notes !== undefined) row.notes = event.notes ?? null;
  if (event.isRecurring !== undefined) row.is_recurring = event.isRecurring ?? false;
  if (event.recurringDay !== undefined) row.recurring_day = event.recurringDay ?? null;

  const { data, error } = await supabase
    .from("schedules")
    .update(row)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return toScheduleEvent(data as ScheduleRow);
}

export async function deleteSchedule(id: string): Promise<void> {
  const { error } = await supabase.from("schedules").delete().eq("id", id);
  if (error) throw error;
}

// ── Realtime ───────────────────────────────────────────────

export function subscribeToSchedules(
  onInsert: (event: ScheduleEvent) => void,
  onUpdate: (event: ScheduleEvent) => void,
  onDelete: (id: string) => void
): RealtimeChannel {
  return supabase
    .channel("schedules-changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "schedules" },
      (payload) => onInsert(toScheduleEvent(payload.new as ScheduleRow))
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "schedules" },
      (payload) => onUpdate(toScheduleEvent(payload.new as ScheduleRow))
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "schedules" },
      (payload) => onDelete((payload.old as { id: string }).id)
    )
    .subscribe();
}
