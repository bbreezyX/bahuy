export interface Member {
  nickname: string;
  name: string;
  skills: string[];
  city: string;
  isLeader: boolean;
  avatar?: string;
  bio?: string;
}

// Re-export from new API for dynamic data (Supabase)
export { fetchMembers, uploadAvatar, deleteAvatar, subscribeToMembers } from "@/lib/member-api";

export const members: Member[] = [
  // ── A ─────────────────────────────────────────────────
  {
    nickname: "Abi",
    name: "Abi",
    skills: ["Support", "Utility"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/abi.jpeg",
    bio: "Solid support player. Always has the team's back."
  },
  {
    nickname: "Akmal",
    name: "Akmal",
    skills: ["Rusher", "Close Range"],
    city: "Indonesia",
    isLeader: false,
    bio: "Quick reflexes and aggressive playstyle."
  },
  {
    nickname: "Anggoro",
    name: "Anggoro",
    skills: ["Rusher", "Entry Frag"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/anggoro.jpeg",
    bio: "Aggressive entry fragger with quick reflexes."
  },
  {
    nickname: "Arnold",
    name: "Arnold",
    skills: ["Sniper", "Long Range"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/arnold.jpeg",
    bio: "Precision shooter. Calm under pressure."
  },
  // ── B ─────────────────────────────────────────────────
  {
    nickname: "Bahuy",
    name: "Bahuy",
    skills: ["Sniper", "Long Range", "IGL"],
    city: "Indonesia",
    isLeader: true,
    avatar: "/bahuy.jpeg",
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  {
    nickname: "Bobby",
    name: "Bobby",
    skills: ["Rusher", "Frontliner"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/bobby.jpeg",
    bio: "Fearless frontliner. First in, last out."
  },
  {
    nickname: "Boy",
    name: "Boy",
    skills: ["Medic", "Revive"],
    city: "Indonesia",
    isLeader: false,
    bio: "Reliable medic who keeps the squad alive."
  },
  {
    nickname: "Bram",
    name: "Bram",
    skills: ["Support", "Utility"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/bram.jpeg",
    bio: "Tactical mind with great game sense."
  },
  // ── C ─────────────────────────────────────────────────
  {
    nickname: "Christ",
    name: "Christ",
    skills: ["Sniper", "Long Range"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/christ.jpeg",
    bio: "Sharpshooter with deadly accuracy at range."
  },
  // ── D ─────────────────────────────────────────────────
  {
    nickname: "Dimas",
    name: "Dimas",
    skills: ["Support", "Utility"],
    city: "Indonesia",
    isLeader: false,
    bio: "Versatile support with solid game awareness."
  },
  {
    nickname: "Dwiky",
    name: "Dwiky",
    skills: ["Rusher", "Close Range"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/dwiky.jpeg",
    bio: "Fast-paced attacker. Always pushing the tempo."
  },
  // ── F ─────────────────────────────────────────────────
  {
    nickname: "Fadil",
    name: "Fadil",
    skills: ["Rusher", "Entry Frag", "IGL"],
    city: "Indonesia",
    isLeader: true,
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  {
    nickname: "Farhan",
    name: "Farhan",
    skills: ["Support", "Utility", "IGL"],
    city: "Indonesia",
    isLeader: true,
    avatar: "/farhan.jpeg",
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  {
    nickname: "Ferdy",
    name: "Ferdy",
    skills: ["Sniper", "Long Range"],
    city: "Indonesia",
    isLeader: false,
    bio: "Sharp eyes and steady hands under fire."
  },
  // ── G ─────────────────────────────────────────────────
  {
    nickname: "Galen",
    name: "Galen",
    skills: ["Sniper", "Long Range", "IGL"],
    city: "Indonesia",
    isLeader: true,
    avatar: "/galen.jpeg",
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  // ── H ─────────────────────────────────────────────────
  {
    nickname: "Heru",
    name: "Heru",
    skills: ["Sniper", "Long Range"],
    city: "Indonesia",
    isLeader: false,
    bio: "Patient sniper. Waits for the perfect shot."
  },
  // ── I ─────────────────────────────────────────────────
  {
    nickname: "Iwan",
    name: "Iwan",
    skills: ["Support", "Utility"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/iwan.jpeg",
    bio: "Utility specialist. Smoke and flash expert."
  },
  // ── J ─────────────────────────────────────────────────
  {
    nickname: "Jeffry",
    name: "Jeffry",
    skills: ["Rusher", "Clutch"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/jeffry.jpeg",
    bio: "High-impact rusher with clutch potential."
  },
  {
    nickname: "Jeshua",
    name: "Jeshua",
    skills: ["Medic", "Revive"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/jesua.jpeg",
    bio: "Dedicated healer. Team-first mentality."
  },
  {
    nickname: "Jevon",
    name: "Jevon",
    skills: ["Sniper", "Long Range"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/jevon.jpeg",
    bio: "Rising talent with a keen eye for headshots."
  },
  {
    nickname: "John",
    name: "John",
    skills: ["Rusher", "Entry Frag", "IGL"],
    city: "Indonesia",
    isLeader: true,
    avatar: "/john.jpeg",
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  // ── K ─────────────────────────────────────────────────
  {
    nickname: "Ken",
    name: "Ken",
    skills: ["Medic", "Revive"],
    city: "Indonesia",
    isLeader: false,
    bio: "Combat medic with quick revive skills."
  },
  {
    nickname: "Ky",
    name: "Ky",
    skills: ["Rusher", "Close Range"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/ky.jpeg",
    bio: "Explosive entry. Thrives in chaos."
  },
  // ── R ─────────────────────────────────────────────────
  {
    nickname: "Rendi",
    name: "Rendi",
    skills: ["Support", "Anchor"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/rendi.jpeg",
    bio: "Anchor player. Holds the site down."
  },
  {
    nickname: "Ricky",
    name: "Ricky",
    skills: ["Sniper", "Long Range"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/ricky.jpeg",
    bio: "Veteran sniper. Consistent and reliable."
  },
  {
    nickname: "Roni",
    name: "Roni",
    skills: ["Medic", "Revive"],
    city: "Indonesia",
    isLeader: false,
    bio: "Field medic who never leaves a teammate behind."
  },
  // ── T ─────────────────────────────────────────────────
  {
    nickname: "Theo",
    name: "Theo",
    skills: ["Rusher", "Entry Frag"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/theo.jpeg",
    bio: "Aggressive playstyle with smart rotations."
  },
  {
    nickname: "Tony",
    name: "Tony",
    skills: ["Support", "Utility", "IGL"],
    city: "Indonesia",
    isLeader: true,
    avatar: "/tony.jpeg",
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  // ── Y ─────────────────────────────────────────────────
  {
    nickname: "Yaden",
    name: "Yaden",
    skills: ["Support", "Utility"],
    city: "Indonesia",
    isLeader: false,
    avatar: "/jaden.jpeg",
    bio: "Dependable teammate. Always in the right position."
  },
  {
    nickname: "Yudi",
    name: "Yudi",
    skills: ["Rusher", "Close Range"],
    city: "Indonesia",
    isLeader: false,
    bio: "Energetic rusher with unpredictable moves."
  },
];