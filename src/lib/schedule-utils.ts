import type { ScheduleEvent } from "@/data/schedules";

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function getRelativeDay(dateStr: string): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  target.setHours(0, 0, 0, 0);

  const diff = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diff === 0) return "Hari Ini";
  if (diff === 1) return "Besok";
  return null;
}

export type DateGroup = "today" | "tomorrow" | "this-week" | "upcoming" | "past";

export const dateGroupLabels: Record<DateGroup, string> = {
  today: "Hari Ini",
  tomorrow: "Besok",
  "this-week": "Minggu Ini",
  upcoming: "Mendatang",
  past: "Selesai",
};

export function getDateGroup(dateStr: string): DateGroup {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  target.setHours(0, 0, 0, 0);

  const diffDays = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "past";
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";

  const dayOfWeek = today.getDay() || 7;
  const endOfWeek = 7 - dayOfWeek;
  if (diffDays <= endOfWeek) return "this-week";

  return "upcoming";
}

export function groupSchedulesByDate(
  schedules: ScheduleEvent[]
): { group: DateGroup; label: string; events: ScheduleEvent[] }[] {
  const groups = new Map<DateGroup, ScheduleEvent[]>();

  for (const event of schedules) {
    const group = getDateGroup(event.date);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(event);
  }

  for (const [, events] of groups) {
    events.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  groups.get("past")?.reverse();

  const order: DateGroup[] = ["today", "tomorrow", "this-week", "upcoming", "past"];

  return order
    .filter((g) => groups.has(g))
    .map((g) => ({
      group: g,
      label: dateGroupLabels[g],
      events: groups.get(g)!,
    }));
}

export function formatTimeRange(start: string, end: string): string {
  return `${start} - ${end} WIB`;
}
