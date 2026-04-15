import { supabase } from "./supabase";
import type { Member } from "@/data/members";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ── DB row shape (snake_case) ──────────────────────────────
interface MemberRow {
  id: string;
  nickname: string;
  name: string;
  skills: string[];
  city: string;
  is_leader: boolean;
  avatar_url?: string | null;
  bio?: string | null;
  created_at: string;
  updated_at: string;
}

// ── Mappers ───────────────────────────────────────────────────
function toMember(row: MemberRow): Member {
  return {
    nickname: row.nickname,
    name: row.name,
    skills: row.skills ?? [],
    city: row.city,
    isLeader: row.is_leader,
    avatar: row.avatar_url || undefined,
    bio: row.bio || undefined,
  };
}

function toDbRow(
  member: Omit<Partial<Member>, "avatar"> & { nickname: string; avatar?: string | null }
): Record<string, unknown> {
  return {
    nickname: member.nickname,
    name: member.name,
    skills: member.skills ?? [],
    city: member.city,
    is_leader: member.isLeader,
    avatar_url: member.avatar || null,
    bio: member.bio || null,
  };
}

// ── CRUD ───────────────────────────────────────────────────────
export async function fetchMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("nickname", { ascending: true });

  if (error) throw error;
  return (data as MemberRow[]).map(toMember);
}

export async function createMember(member: Omit<Member, "id">): Promise<Member> {
  const { data, error } = await supabase
    .from("members")
    .insert(toDbRow(member as any))
    .select()
    .single();

  if (error) throw error;
  return toMember(data as MemberRow);
}

export async function updateMember(
  nickname: string,
  updates: Omit<Partial<Member>, "nickname" | "avatar"> & { avatar?: string | null }
): Promise<Member> {
  const row: Record<string, unknown> = {};

  if (updates.name !== undefined) row.name = updates.name;
  if (updates.skills !== undefined) row.skills = updates.skills;
  if (updates.city !== undefined) row.city = updates.city;
  if (updates.isLeader !== undefined) row.is_leader = updates.isLeader;
  if (updates.avatar !== undefined) row.avatar_url = updates.avatar || null;
  if (updates.bio !== undefined) row.bio = updates.bio || null;

  const { data, error } = await supabase
    .from("members")
    .update(row)
    .eq("nickname", nickname)
    .select()
    .single();

  if (error) throw error;
  return toMember(data as MemberRow);
}

export async function deleteMember(nickname: string): Promise<void> {
  const { error } = await supabase
    .from("members")
    .delete()
    .eq("nickname", nickname);

  if (error) throw error;
}

// ── Storage Helpers (bahuy bucket) ─────────────────────────────
export async function uploadAvatar(
  file: File,
  filename: string
): Promise<string> {
  const { error: uploadError } = await supabase.storage
    .from("bahuy")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("bahuy").getPublicUrl(filename);
  return data.publicUrl;
}

export async function deleteAvatar(filename: string): Promise<void> {
  const { error } = await supabase.storage.from("bahuy").remove([filename]);
  if (error && !error.message.includes("not found")) throw error;
}

// ── Realtime ───────────────────────────────────────────────────
export function subscribeToMembers(
  onInsert: (member: Member) => void,
  onUpdate: (member: Member) => void,
  onDelete: (nickname: string) => void
): RealtimeChannel {
  return supabase
    .channel(`members-changes-${Date.now()}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "members" },
      (payload) => onInsert(toMember(payload.new as MemberRow))
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "members" },
      (payload) => onUpdate(toMember(payload.new as MemberRow))
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "members" },
      (payload) => onDelete((payload.old as { nickname: string }).nickname)
    )
    .subscribe();
}
