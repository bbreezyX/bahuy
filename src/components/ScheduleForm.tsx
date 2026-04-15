/** @jsxImportSource react */
import { useState, useEffect } from "react";
import type { ScheduleEvent, GameMode, ScheduleStatus } from "@/data/schedules";
import { gameModeLabels, gameModeColors, statusLabels } from "@/data/schedules";
import type { Member } from "@/data/members";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createSchedule, updateSchedule } from "@/lib/schedule-api";

interface ScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  initialData?: ScheduleEvent;
}

const gameModes: GameMode[] = ["ranked", "casual", "tournament", "custom", "scrimmage"];
const statuses: ScheduleStatus[] = ["upcoming", "ongoing", "completed", "cancelled"];

const defaultForm = {
  title: "",
  description: "",
  date: "",
  startTime: "20:00",
  endTime: "23:00",
  gameMode: "ranked" as GameMode,
  status: "upcoming" as ScheduleStatus,
  participants: [] as string[],
  maxParticipants: "",
  hostNickname: "",
  notes: "",
  isRecurring: false,
  recurringDay: "",
};

export default function ScheduleForm({
  open,
  onOpenChange,
  members,
  initialData,
}: ScheduleFormProps) {
  const isEdit = !!initialData;
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          title: initialData.title,
          description: initialData.description ?? "",
          date: initialData.date,
          startTime: initialData.startTime,
          endTime: initialData.endTime,
          gameMode: initialData.gameMode,
          status: initialData.status,
          participants: [...initialData.participants],
          maxParticipants: initialData.maxParticipants?.toString() ?? "",
          hostNickname: initialData.hostNickname,
          notes: initialData.notes ?? "",
          isRecurring: initialData.isRecurring ?? false,
          recurringDay: initialData.recurringDay ?? "",
        });
      } else {
        setForm(defaultForm);
      }
      setError("");
    }
  }, [open, initialData]);

  const toggleParticipant = (nick: string) => {
    setForm((prev) => ({
      ...prev,
      participants: prev.participants.includes(nick)
        ? prev.participants.filter((n) => n !== nick)
        : [...prev.participants, nick],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.date || !form.hostNickname) {
      setError("Title, tanggal, dan host wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        gameMode: form.gameMode,
        status: form.status,
        participants: form.participants,
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants, 10) : undefined,
        hostNickname: form.hostNickname,
        notes: form.notes.trim() || undefined,
        isRecurring: form.isRecurring || undefined,
        recurringDay: form.isRecurring && form.recurringDay.trim() ? form.recurringDay.trim() : undefined,
      };

      if (isEdit && initialData) {
        await updateSchedule(initialData.id, payload);
      } else {
        await createSchedule(payload);
      }

      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const labelClass =
    "block font-[var(--font-condensed)] text-[11px] uppercase tracking-[0.15em] text-white/50 mb-1.5 font-medium";
  const sectionClass = "space-y-4";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0e1112] border-white/10">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wide text-white">
            {isEdit ? "Edit Jadwal" : "Tambah Jadwal"}
          </DialogTitle>
          <DialogDescription className="font-[var(--font-condensed)] text-sm text-white/40 tracking-wide">
            {isEdit ? "Ubah detail jadwal yang sudah ada." : "Buat jadwal main baru untuk anggota clan."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          {/* Title */}
          <div className={sectionClass}>
            <div>
              <label className={labelClass}>Judul *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Ranked Push Malam"
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20"
              />
            </div>

            <div>
              <label className={labelClass}>Deskripsi</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Deskripsi singkat tentang event..."
                rows={2}
                className="flex w-full rounded-[var(--radius)] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background resize-none"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Tanggal *</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="bg-white/[0.04] border-white/10 text-white [color-scheme:dark]"
              />
            </div>
            <div>
              <label className={labelClass}>Mulai</label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                className="bg-white/[0.04] border-white/10 text-white [color-scheme:dark]"
              />
            </div>
            <div>
              <label className={labelClass}>Selesai</label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                className="bg-white/[0.04] border-white/10 text-white [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Game Mode */}
          <div>
            <label className={labelClass}>Game Mode</label>
            <div className="flex flex-wrap gap-2">
              {gameModes.map((mode) => {
                const active = form.gameMode === mode;
                const color = gameModeColors[mode];
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, gameMode: mode }))}
                    className="px-3 py-1.5 rounded-full text-[11px] font-[var(--font-condensed)] uppercase tracking-[0.15em] font-medium border transition-colors cursor-pointer"
                    style={{
                      backgroundColor: active ? color + "25" : "transparent",
                      borderColor: active ? color : "rgba(255,255,255,0.1)",
                      color: active ? color : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {gameModeLabels[mode]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Status</label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((st) => {
                const active = form.status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, status: st }))}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-[var(--font-condensed)] uppercase tracking-[0.15em] font-medium border transition-colors cursor-pointer ${
                      active
                        ? "bg-white/10 border-white/30 text-white"
                        : "border-white/10 text-white/40 hover:text-white/60"
                    }`}
                  >
                    {statusLabels[st]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Host */}
          <div>
            <label className={labelClass}>Host *</label>
            <select
              value={form.hostNickname}
              onChange={(e) => setForm((p) => ({ ...p, hostNickname: e.target.value }))}
              className="flex h-10 w-full rounded-[var(--radius)] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background cursor-pointer [color-scheme:dark]"
            >
              <option value="" className="bg-[#0e1112]">Pilih host...</option>
              {members.map((m) => (
                <option key={m.nickname} value={m.nickname} className="bg-[#0e1112]">
                  {m.nickname}
                </option>
              ))}
            </select>
          </div>

          {/* Participants */}
          <div>
            <label className={labelClass}>
              Peserta ({form.participants.length}
              {form.maxParticipants ? `/${form.maxParticipants}` : ""})
            </label>
            <div className="max-h-36 overflow-y-auto rounded-[var(--radius)] border border-white/10 bg-white/[0.02] p-2 grid grid-cols-2 sm:grid-cols-3 gap-1">
              {members.map((m) => {
                const selected = form.participants.includes(m.nickname);
                return (
                  <button
                    key={m.nickname}
                    type="button"
                    onClick={() => toggleParticipant(m.nickname)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-[var(--font-body)] transition-colors text-left cursor-pointer ${
                      selected
                        ? "bg-primary/20 text-primary"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white/70"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                        selected ? "border-primary bg-primary/30" : "border-white/20"
                      }`}
                    >
                      {selected && (
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    {m.nickname}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max Participants */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Max Peserta</label>
              <Input
                type="number"
                min={1}
                value={form.maxParticipants}
                onChange={(e) => setForm((p) => ({ ...p, maxParticipants: e.target.value }))}
                placeholder="Opsional"
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20"
              />
            </div>
            <div>
              <label className={labelClass}>Notes</label>
              <Input
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Catatan singkat..."
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isRecurring}
                onChange={(e) => setForm((p) => ({ ...p, isRecurring: e.target.checked }))}
                className="w-4 h-4 rounded border-white/20 bg-white/[0.04] accent-primary"
              />
              <span className="font-[var(--font-condensed)] text-xs uppercase tracking-[0.12em] text-white/60">
                Berulang
              </span>
            </label>
            {form.isRecurring && (
              <Input
                value={form.recurringDay}
                onChange={(e) => setForm((p) => ({ ...p, recurringDay: e.target.value }))}
                placeholder="Misal: Sabtu"
                className="max-w-[160px] bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 h-8 text-xs"
              />
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 font-[var(--font-body)]">{error}</p>
          )}

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-[var(--radius)] bg-primary text-primary-foreground font-[var(--font-condensed)] text-sm uppercase tracking-[0.15em] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Jadwal"}
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-6 py-2.5 rounded-[var(--radius)] border border-white/10 text-white/60 font-[var(--font-condensed)] text-sm uppercase tracking-[0.15em] hover:text-white hover:border-white/20 transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
