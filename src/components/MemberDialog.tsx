import type { Member } from "@/data/members";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface MemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleBg: Record<string, string> = {
  sniper: "#8B2020",
  rusher: "#C86A1A",
  support: "#2563A8",
  medic: "#1F7A45",
};

const roleBgLight: Record<string, string> = {
  sniper: "#A83030",
  rusher: "#E08030",
  support: "#3B82C6",
  medic: "#2D9958",
};

const roleLabel: Record<string, string> = {
  sniper: "SHARPSHOOTER",
  rusher: "ASSAULT",
  support: "TACTICAL",
  medic: "FIELD MEDIC",
};

export default function MemberDialog({ member, open, onOpenChange }: MemberDialogProps) {
  if (!member) return null;

  const bg = roleBg[member.role] || "#C4A265";
  const bgLight = roleBgLight[member.role] || "#D4B275";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-[28px] border-0">
        {/* Header with solid role color */}
        <div className="relative px-6 pt-8 pb-6" style={{ backgroundColor: bg }}>
          {/* Scope decoration */}
          <svg className="absolute top-4 right-4 w-20 h-20 text-white pointer-events-none" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
            <circle cx="40" cy="40" r="16" stroke="currentColor" strokeWidth="0.8" opacity="0.07" />
            <line x1="40" y1="4" x2="40" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
            <line x1="40" y1="60" x2="40" y2="76" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
            <line x1="4" y1="40" x2="20" y2="40" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
            <line x1="60" y1="40" x2="76" y2="40" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
          </svg>

          <div className="flex flex-col items-center relative">
            {/* Decorative rings */}
            <div className="absolute w-32 h-32 rounded-full border border-white/[0.06] top-0" />

            {/* Avatar */}
            <div className="relative w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mb-4">
              <span className="font-display text-5xl text-white/90">
                {member.nickname.charAt(0).toUpperCase()}
              </span>
              {member.isLeader && (
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-sm shadow-lg">
                  👑
                </div>
              )}
            </div>

            <DialogHeader className="items-center">
              <p className="font-[var(--font-condensed)] text-[9px] uppercase tracking-[0.25em] text-white/40 mb-0.5">
                {roleLabel[member.role] || member.role}
              </p>
              <DialogTitle className="font-display text-3xl text-white text-center tracking-wide">
                {member.nickname}
              </DialogTitle>
              <DialogDescription className="text-sm text-white/60 text-center" style={{ fontFamily: "var(--font-body)" }}>
                {member.name}
              </DialogDescription>
            </DialogHeader>

            {/* Status + KD */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    member.status === "online"
                      ? "bg-green-400 animate-pulse-online"
                      : "bg-white/30"
                  }`}
                />
                <span className="text-[10px] font-[var(--font-condensed)] uppercase tracking-wider text-white/50">
                  {member.status}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1 shadow-lg"
                style={{ backgroundColor: bgLight }}
              >
                <svg className="w-3.5 h-3.5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-display text-sm text-white">{member.kdRatio.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats + Bio */}
        <div className="px-6 py-5 bg-card">
          <div className="grid grid-cols-2 gap-3">
            <DialogStatPill label="Rank" value={member.rank} bg={bg} />
            <DialogStatPill label="Kota" value={member.city} bg={bg} />
            <DialogStatPill label="K/D Ratio" value={member.kdRatio.toFixed(2)} bg={bg} />
            <DialogStatPill label="Joined" value={member.joinDate} bg={bg} />
          </div>

          {member.bio && (
            <div className="mt-5 rounded-2xl p-4" style={{ backgroundColor: `${bg}18` }}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
                <span className="text-[9px] font-[var(--font-condensed)] uppercase tracking-[0.2em] text-muted-foreground">
                  Bio
                </span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                {member.bio}
              </p>
            </div>
          )}

          {member.isLeader && (
            <div
              className="mt-4 rounded-full py-2 text-center"
              style={{ backgroundColor: bg }}
            >
              <span className="font-[var(--font-condensed)] text-[11px] uppercase tracking-[0.15em] text-white font-medium">
                👑 Clan Leader
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DialogStatPill({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div className="rounded-2xl p-3 text-center" style={{ backgroundColor: `${bg}18` }}>
      <p className="text-[8px] font-[var(--font-condensed)] uppercase tracking-[0.15em] text-muted-foreground leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground" style={{ fontFamily: "var(--font-body)" }}>
        {value}
      </p>
    </div>
  );
}
