export type GameMode = "ranked" | "casual" | "tournament" | "custom" | "scrimmage";
export type ScheduleStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  gameMode: GameMode;
  status: ScheduleStatus;
  participants: string[];
  maxParticipants?: number;
  hostNickname: string;
  notes?: string;
  isRecurring?: boolean;
  recurringDay?: string;
}

export const gameModeLabels: Record<GameMode, string> = {
  ranked: "RANKED",
  casual: "CASUAL",
  tournament: "TURNAMEN",
  custom: "CUSTOM",
  scrimmage: "SCRIM",
};

export const gameModeColors: Record<GameMode, string> = {
  ranked: "#C4A265",
  casual: "#2D9958",
  tournament: "#A83030",
  custom: "#3B82C6",
  scrimmage: "#E08030",
};

export const statusLabels: Record<ScheduleStatus, string> = {
  upcoming: "SEGERA",
  ongoing: "BERLANGSUNG",
  completed: "SELESAI",
  cancelled: "DIBATALKAN",
};

export const statusColors: Record<ScheduleStatus, string> = {
  upcoming: "#2D9958",
  ongoing: "#C4A265",
  completed: "#6B7280",
  cancelled: "#A83030",
};

// Schedule data is now stored in Supabase.
// See supabase-setup.sql for table schema and seed data.
// Use src/lib/schedule-api.ts for CRUD operations.
