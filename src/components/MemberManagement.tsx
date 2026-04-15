/** @jsxImportSource react */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Member } from "@/data/members";
import { 
  fetchMembers, 
  createMember, 
  updateMember, 
  deleteMember,
  uploadAvatar,
  deleteAvatar,
  subscribeToMembers 
} from "@/lib/member-api";
import MemberCard from "./MemberCard";
import MemberForm, { type MemberFormData } from "./MemberForm";

interface MemberManagementProps {
  initialMembers: Member[];
}

export default function MemberManagement({ initialMembers }: MemberManagementProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSkill, setActiveSkill] = useState<string>("all");
  const [error, setError] = useState<string>("");

  // Fetch fresh data
  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const freshMembers = await fetchMembers();
      // Preserve skills from current state if DB hasn't been migrated yet
      setMembers(prev =>
        freshMembers.map(fresh => {
          const cached = prev.find(m => m.nickname === fresh.nickname);
          return {
            ...fresh,
            skills: fresh.skills.length > 0 ? fresh.skills : (cached?.skills ?? []),
          };
        })
      );
    } catch (err: any) {
      setError("Failed to load members: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + realtime subscription
  useEffect(() => {
    loadMembers();

    const channel = subscribeToMembers(
      (newMember) => {
        setMembers(prev => {
          const exists = prev.some(m => m.nickname === newMember.nickname);
          return exists 
            ? prev.map(m => m.nickname === newMember.nickname ? newMember : m)
            : [...prev, newMember].sort((a, b) => a.nickname.localeCompare(b.nickname));
        });
      },
      (updatedMember) => {
        setMembers(prev => 
          prev.map(m => m.nickname === updatedMember.nickname ? updatedMember : m)
        );
      },
      (nickname) => {
        setMembers(prev => prev.filter(m => m.nickname !== nickname));
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [loadMembers]);

  const allSkills = Array.from(
    new Set(members.map((m) => m.skills[0]).filter(Boolean))
  ).sort();

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = activeSkill === "all" || member.skills.includes(activeSkill);
    return matchesSearch && matchesSkill;
  }).sort((a, b) => a.nickname.localeCompare(b.nickname));

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormOpen(true);
  };

  const getManagedAvatarFilename = (avatarUrl?: string) => {
    if (!avatarUrl?.startsWith("http")) return null;

    try {
      const url = new URL(avatarUrl);
      const marker = "/storage/v1/object/public/bahuy/";
      const markerIndex = url.pathname.indexOf(marker);

      if (markerIndex === -1) return null;
      return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
    } catch {
      return null;
    }
  };

  const handleDelete = async (member: Member) => {
    if (!confirm(`Delete member ${member.nickname}? This cannot be undone.`)) return;
    
    try {
      const avatarFilename = getManagedAvatarFilename(member.avatar);
      if (avatarFilename) {
        await deleteAvatar(avatarFilename).catch(() => {});
      }

      await deleteMember(member.nickname);
      // Realtime will handle removal
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleFormSubmit = async (data: MemberFormData, file?: File) => {
    try {
      const currentAvatar = editingMember?.avatar;
      const removeAvatar = Boolean(data.removeAvatar);
      let avatarUrl = currentAvatar;

      if (file) {
        const filename = data.nickname!.toLowerCase() + "." + file.name.split(".").pop();

        const oldFilename = getManagedAvatarFilename(currentAvatar);
        if (oldFilename) {
          await deleteAvatar(oldFilename).catch(() => {});
        }

        avatarUrl = await uploadAvatar(file, filename);
      } else if (removeAvatar) {
        const oldFilename = getManagedAvatarFilename(currentAvatar);
        if (oldFilename) {
          await deleteAvatar(oldFilename).catch(() => {});
        }

        avatarUrl = undefined;
      }

      const memberData = {
        ...data,
        avatar: removeAvatar ? null : avatarUrl,
      };
      delete memberData.removeAvatar;

      if (editingMember) {
        await updateMember(editingMember.nickname, memberData);
      } else {
        await createMember(memberData as any);
      }

      setFormOpen(false);
      setEditingMember(null);
    } catch (err: any) {
      alert("Failed to save member: " + err.message);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-8 md:px-6 md:pb-12 lg:px-8">
      {/* Header: skill filter pills + Add button */}
      <div className="flex items-start justify-between gap-3 mb-8">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {["all", ...allSkills].map((skill) => {
            const isActive = activeSkill === skill;
            return (
              <motion.button
                key={skill}
                onClick={() => setActiveSkill(skill)}
                whileTap={{ scale: 0.96 }}
                className="relative whitespace-nowrap rounded-full px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-condensed uppercase tracking-[0.15em] font-bold border cursor-pointer"
                style={{
                  borderColor: isActive ? "transparent" : "rgba(255,255,255,0.18)",
                  backgroundColor: isActive ? "transparent" : "rgba(255,255,255,0.04)",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                  transition: "color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeSkillPill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: "#C4A265" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{skill === "all" ? "Semua" : skill}</span>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            setEditingMember(null);
            setFormOpen(true);
          }}
          className="shrink-0 flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-primary text-primary-foreground font-condensed text-xs sm:text-sm uppercase tracking-[0.15em] font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="hidden sm:inline">Tambah</span>
        </motion.button>
      </div>

      {/* Search bar */}
      <div className="mb-8">
        <label className="relative block w-full sm:max-w-[360px]">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Cari nickname, nama, atau kota"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-10 w-full rounded-full border border-white/10 bg-[#1a1a1a] pl-11 pr-5 text-sm text-white placeholder:text-white/30 focus:border-primary/40 focus:outline-none"
          />
        </label>
      </div>

      {error && (
        <div className="mb-6 rounded-[24px] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.02] py-20 text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
          <p className="font-condensed text-sm uppercase tracking-[0.2em] text-white/35">
            Memuat roster...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <AnimatePresence>
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.nickname}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group relative"
              >
                <div className="absolute -right-2 -top-3 z-20 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(member)}
                    className="rounded-full border border-white/15 bg-black/85 px-3 py-1 text-[10px] font-condensed font-semibold uppercase tracking-[0.18em] text-white/80 shadow-[0_10px_25px_rgba(0,0,0,0.3)] backdrop-blur-md transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="rounded-full border border-red-500/30 bg-red-500/85 px-3 py-1 text-[10px] font-condensed font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_25px_rgba(0,0,0,0.3)] transition-colors hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>

                <MemberCard
                  member={member}
                  index={index}
                  isSelected={false}
                  onClick={() => {}}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredMembers.length === 0 && !loading && (
        <div className="rounded-[32px] border border-white/10 bg-white/[0.02] py-20 text-center text-white/40">
          Tidak ada member yang cocok dengan filter aktif.
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <MemberForm
            member={editingMember || undefined}
            onSubmit={handleFormSubmit}
            onClose={() => {
              setFormOpen(false);
              setEditingMember(null);
            }}
            isEditing={!!editingMember}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
