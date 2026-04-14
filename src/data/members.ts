export interface Member {
  nickname: string;
  name: string;
  rank: "Private" | "Corporal" | "Sergeant" | "Lieutenant" | "Captain" | "Major" | "Colonel" | "General";
  city: string;
  role: "sniper" | "rusher" | "support" | "medic";
  status: "online" | "offline";
  joinDate: string;
  kdRatio: number;
  isFeatured: boolean;
  isLeader: boolean;
  avatar?: string;
  bio?: string;
}

export const members: Member[] = [
  // ── Original Ace ──────────────────────────────────────
  {
    nickname: "Bahuy",
    name: "Bahuy",
    rank: "Colonel",
    city: "Indonesia",
    role: "sniper",
    status: "online",
    joinDate: "2024",
    kdRatio: 2.5,
    isFeatured: true,
    isLeader: true,
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  {
    nickname: "Fadil",
    name: "Fadil",
    rank: "Colonel",
    city: "Indonesia",
    role: "rusher",
    status: "online",
    joinDate: "2024",
    kdRatio: 2.3,
    isFeatured: true,
    isLeader: true,
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  {
    nickname: "Farhan",
    name: "Farhan",
    rank: "Colonel",
    city: "Indonesia",
    role: "support",
    status: "online",
    joinDate: "2024",
    kdRatio: 2.2,
    isFeatured: true,
    isLeader: true,
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  {
    nickname: "Galen",
    name: "Galen",
    rank: "Colonel",
    city: "Indonesia",
    role: "sniper",
    status: "online",
    joinDate: "2024",
    kdRatio: 2.4,
    isFeatured: true,
    isLeader: true,
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  {
    nickname: "John",
    name: "John",
    rank: "Colonel",
    city: "Indonesia",
    role: "rusher",
    status: "online",
    joinDate: "2024",
    kdRatio: 2.3,
    isFeatured: true,
    isLeader: true,
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  {
    nickname: "Tony",
    name: "Tony",
    rank: "Colonel",
    city: "Indonesia",
    role: "support",
    status: "online",
    joinDate: "2024",
    kdRatio: 2.1,
    isFeatured: false,
    isLeader: true,
    bio: "Original Ace. Founding member of TEAM ULTRA."
  },
  // ── Active Members ────────────────────────────────────
  {
    nickname: "Abi",
    name: "Abi",
    rank: "Major",
    city: "Indonesia",
    role: "support",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.8,
    isFeatured: false,
    isLeader: false,
    bio: "Solid support player. Always has the team's back."
  },
  {
    nickname: "Anggoro",
    name: "Anggoro",
    rank: "Captain",
    city: "Indonesia",
    role: "rusher",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.7,
    isFeatured: false,
    isLeader: false,
    bio: "Aggressive entry fragger with quick reflexes."
  },
  {
    nickname: "Arnold",
    name: "Arnold",
    rank: "Captain",
    city: "Indonesia",
    role: "sniper",
    status: "offline",
    joinDate: "2024",
    kdRatio: 1.9,
    isFeatured: false,
    isLeader: false,
    bio: "Precision shooter. Calm under pressure."
  },
  {
    nickname: "Bobby",
    name: "Bobby",
    rank: "Major",
    city: "Indonesia",
    role: "rusher",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.8,
    isFeatured: false,
    isLeader: false,
    bio: "Fearless frontliner. First in, last out."
  },
  {
    nickname: "Boy",
    name: "Boy",
    rank: "Captain",
    city: "Indonesia",
    role: "medic",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.5,
    isFeatured: false,
    isLeader: false,
    bio: "Reliable medic who keeps the squad alive."
  },
  {
    nickname: "Bram",
    name: "Bram",
    rank: "Lieutenant",
    city: "Indonesia",
    role: "support",
    status: "offline",
    joinDate: "2024",
    kdRatio: 1.6,
    isFeatured: false,
    isLeader: false,
    bio: "Tactical mind with great game sense."
  },
  {
    nickname: "Christ",
    name: "Christ",
    rank: "Captain",
    city: "Indonesia",
    role: "sniper",
    status: "online",
    joinDate: "2024",
    kdRatio: 2.0,
    isFeatured: false,
    isLeader: false,
    bio: "Sharpshooter with deadly accuracy at range."
  },
  {
    nickname: "Dwiky",
    name: "Dwiky",
    rank: "Sergeant",
    city: "Indonesia",
    role: "rusher",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.6,
    isFeatured: false,
    isLeader: false,
    bio: "Fast-paced attacker. Always pushing the tempo."
  },
  {
    nickname: "Heru",
    name: "Heru",
    rank: "Lieutenant",
    city: "Indonesia",
    role: "sniper",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.9,
    isFeatured: false,
    isLeader: false,
    bio: "Patient sniper. Waits for the perfect shot."
  },
  {
    nickname: "Iwan",
    name: "Iwan",
    rank: "Sergeant",
    city: "Indonesia",
    role: "support",
    status: "offline",
    joinDate: "2024",
    kdRatio: 1.5,
    isFeatured: false,
    isLeader: false,
    bio: "Utility specialist. Smoke and flash expert."
  },
  {
    nickname: "Jeffry",
    name: "Jeffry",
    rank: "Major",
    city: "Indonesia",
    role: "rusher",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.9,
    isFeatured: false,
    isLeader: false,
    bio: "High-impact rusher with clutch potential."
  },
  {
    nickname: "Jeshua",
    name: "Jeshua",
    rank: "Captain",
    city: "Indonesia",
    role: "medic",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.6,
    isFeatured: false,
    isLeader: false,
    bio: "Dedicated healer. Team-first mentality."
  },
  {
    nickname: "Jevon",
    name: "Jevon",
    rank: "Lieutenant",
    city: "Indonesia",
    role: "sniper",
    status: "offline",
    joinDate: "2024",
    kdRatio: 1.8,
    isFeatured: false,
    isLeader: false,
    bio: "Rising talent with a keen eye for headshots."
  },
  {
    nickname: "Ky",
    name: "Ky",
    rank: "Captain",
    city: "Indonesia",
    role: "rusher",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.7,
    isFeatured: false,
    isLeader: false,
    bio: "Explosive entry. Thrives in chaos."
  },
  {
    nickname: "Rendi",
    name: "Rendi",
    rank: "Sergeant",
    city: "Indonesia",
    role: "support",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.5,
    isFeatured: false,
    isLeader: false,
    bio: "Anchor player. Holds the site down."
  },
  {
    nickname: "Ricky",
    name: "Ricky",
    rank: "Major",
    city: "Indonesia",
    role: "sniper",
    status: "online",
    joinDate: "2024",
    kdRatio: 2.0,
    isFeatured: false,
    isLeader: false,
    bio: "Veteran sniper. Consistent and reliable."
  },
  {
    nickname: "Roni",
    name: "Roni",
    rank: "Sergeant",
    city: "Indonesia",
    role: "medic",
    status: "offline",
    joinDate: "2024",
    kdRatio: 1.4,
    isFeatured: false,
    isLeader: false,
    bio: "Field medic who never leaves a teammate behind."
  },
  {
    nickname: "Theo",
    name: "Theo",
    rank: "Lieutenant",
    city: "Indonesia",
    role: "rusher",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.7,
    isFeatured: false,
    isLeader: false,
    bio: "Aggressive playstyle with smart rotations."
  },
  {
    nickname: "Yaden",
    name: "Yaden",
    rank: "Sergeant",
    city: "Indonesia",
    role: "support",
    status: "online",
    joinDate: "2024",
    kdRatio: 1.5,
    isFeatured: false,
    isLeader: false,
    bio: "Dependable teammate. Always in the right position."
  },
];

export const rankOrder: Record<Member["rank"], number> = {
  General: 8,
  Colonel: 7,
  Major: 6,
  Captain: 5,
  Lieutenant: 4,
  Sergeant: 3,
  Corporal: 2,
  Private: 1,
};
