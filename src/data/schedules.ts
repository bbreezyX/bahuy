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

export const schedules: ScheduleEvent[] = [
  {
    id: "ranked-push-2026-04-14",
    title: "Ranked Push Malam",
    description: "Push rank bareng sampai naik tier. Wajib mic on!",
    date: "2026-04-14",
    startTime: "20:00",
    endTime: "23:00",
    gameMode: "ranked",
    status: "ongoing",
    participants: ["Bahuy", "Anggoro", "Arnold", "Bobby", "Abi", "Farhan", "Galen"],
    maxParticipants: 10,
    hostNickname: "Bahuy",
    notes: "Mic on wajib, yg AFK kick",
  },
  {
    id: "weekend-casual-2026-04-18",
    title: "Weekend Santai",
    description: "Main santai aja, have fun bareng.",
    date: "2026-04-18",
    startTime: "19:00",
    endTime: "22:00",
    gameMode: "casual",
    status: "upcoming",
    participants: ["Ky", "Theo", "Ricky", "Dwi", "Christ"],
    hostNickname: "Ky",
    isRecurring: true,
    recurringDay: "Sabtu",
  },
  {
    id: "scrim-titan-2026-04-19",
    title: "Scrim vs TITAN Squad",
    description: "Friendly match lawan clan TITAN. Siap-siap strategi!",
    date: "2026-04-19",
    startTime: "20:00",
    endTime: "22:30",
    gameMode: "scrimmage",
    status: "upcoming",
    participants: ["Bahuy", "Anggoro", "Arnold", "Jeffry", "Abi"],
    maxParticipants: 5,
    hostNickname: "Bahuy",
    notes: "Line-up fix, gak bisa diganti. Latihan jam 19:30.",
  },
  {
    id: "tournament-cup-2026-04-20",
    title: "Community Cup S3",
    description: "Turnamen komunitas season 3. Hadiah total 5 juta!",
    date: "2026-04-20",
    startTime: "13:00",
    endTime: "18:00",
    gameMode: "tournament",
    status: "upcoming",
    participants: ["Bahuy", "Anggoro", "Arnold", "Jeffry", "Abi", "Bobby", "Farhan"],
    maxParticipants: 7,
    hostNickname: "Bahuy",
    notes: "Kumpul jam 12:30 buat briefing",
  },
  {
    id: "custom-hide-2026-04-21",
    title: "Custom Room: Hide & Seek",
    description: "Main hide and seek di map baru. Yang kalah push up 10x.",
    date: "2026-04-21",
    startTime: "21:00",
    endTime: "23:00",
    gameMode: "custom",
    status: "upcoming",
    participants: ["Theo", "Ricky", "Jevon", "John", "Jaden", "Dwiky"],
    maxParticipants: 12,
    hostNickname: "Theo",
  },
  {
    id: "ranked-weekly-2026-04-25",
    title: "Ranked Push Mingguan",
    description: "Sesi ranked push rutin tiap Sabtu malam.",
    date: "2026-04-25",
    startTime: "20:00",
    endTime: "23:30",
    gameMode: "ranked",
    status: "upcoming",
    participants: ["Bahuy", "Bobby", "Bram"],
    maxParticipants: 10,
    hostNickname: "Bahuy",
    isRecurring: true,
    recurringDay: "Sabtu",
  },
  {
    id: "ranked-push-2026-04-12",
    title: "Ranked Push Sabtu",
    date: "2026-04-12",
    startTime: "20:00",
    endTime: "23:00",
    gameMode: "ranked",
    status: "completed",
    participants: ["Bahuy", "Anggoro", "Arnold", "Bobby", "Abi", "Farhan", "Galen", "Iwan"],
    maxParticipants: 10,
    hostNickname: "Bahuy",
  },
  {
    id: "scrim-cancelled-2026-04-13",
    title: "Scrim vs SHADOW Clan",
    description: "Dibatalkan — lawan gak jadi.",
    date: "2026-04-13",
    startTime: "20:00",
    endTime: "22:00",
    gameMode: "scrimmage",
    status: "cancelled",
    participants: ["Bahuy", "Anggoro", "Arnold", "Jeffry", "Abi"],
    maxParticipants: 5,
    hostNickname: "Bahuy",
    notes: "Clan lawan cancel last minute",
  },
];
