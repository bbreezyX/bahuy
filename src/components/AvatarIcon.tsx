const avatars: Record<string, (p: { cls: string }) => JSX.Element> = {
  wolf: ({ cls }) => (
    <svg className={cls} viewBox="0 0 64 64" fill="currentColor">
      <path d="M12 52V36c0-11 9-20 20-20s20 9 20 20v16" opacity="0.9" />
      <path d="M22 28c-2-8 0-14 4-18l6 10-6 8z" />
      <path d="M42 28c2-8 0-14-4-18l-6 10 6 8z" />
      <circle cx="26" cy="34" r="2.5" fill="black" opacity="0.5" />
      <circle cx="38" cy="34" r="2.5" fill="black" opacity="0.5" />
      <path d="M28 40q4 3 8 0" stroke="black" strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
  ),
  hawk: ({ cls }) => (
    <svg className={cls} viewBox="0 0 64 64" fill="currentColor">
      <path d="M32 12c-12 0-20 14-20 28h40c0-14-8-28-20-28z" opacity="0.9" />
      <path d="M32 12l-8-2 8 10 8-10-8 2z" opacity="0.7" />
      <circle cx="26" cy="30" r="3" fill="black" opacity="0.5" />
      <circle cx="38" cy="30" r="3" fill="black" opacity="0.5" />
      <path d="M30 36l2 4 2-4z" fill="black" opacity="0.35" />
      <path d="M8 38q12 4 24 0 12-4 24 0" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
    </svg>
  ),
  bear: ({ cls }) => (
    <svg className={cls} viewBox="0 0 64 64" fill="currentColor">
      <circle cx="18" cy="18" r="8" opacity="0.8" />
      <circle cx="46" cy="18" r="8" opacity="0.8" />
      <ellipse cx="32" cy="36" rx="18" ry="20" opacity="0.9" />
      <circle cx="26" cy="32" r="2.5" fill="black" opacity="0.5" />
      <circle cx="38" cy="32" r="2.5" fill="black" opacity="0.5" />
      <ellipse cx="32" cy="38" rx="5" ry="3.5" fill="black" opacity="0.15" />
      <circle cx="32" cy="37" r="2" fill="black" opacity="0.35" />
    </svg>
  ),
  fox: ({ cls }) => (
    <svg className={cls} viewBox="0 0 64 64" fill="currentColor">
      <path d="M32 52c-14 0-20-10-20-22 0-8 4-14 8-18l12 14 12-14c4 4 8 10 8 18 0 12-6 22-20 22z" opacity="0.9" />
      <circle cx="25" cy="32" r="2.5" fill="black" opacity="0.5" />
      <circle cx="39" cy="32" r="2.5" fill="black" opacity="0.5" />
      <path d="M29 38q3 2 6 0" stroke="black" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M32 38v3" stroke="black" strokeWidth="1" opacity="0.25" />
    </svg>
  ),
  panther: ({ cls }) => (
    <svg className={cls} viewBox="0 0 64 64" fill="currentColor">
      <ellipse cx="32" cy="34" rx="20" ry="22" opacity="0.9" />
      <path d="M16 20c-2-10 2-14 6-16 2 6 4 10 2 16z" opacity="0.7" />
      <path d="M48 20c2-10-2-14-6-16-2 6-4 10-2 16z" opacity="0.7" />
      <path d="M24 30l4 2-4 2z" fill="black" opacity="0.5" />
      <path d="M40 30l-4 2 4 2z" fill="black" opacity="0.5" />
      <path d="M28 40q4 2 8 0" stroke="black" strokeWidth="1.5" fill="none" opacity="0.3" />
    </svg>
  ),
  skull: ({ cls }) => (
    <svg className={cls} viewBox="0 0 64 64" fill="currentColor">
      <path d="M32 8C18 8 12 20 12 32c0 10 6 16 10 18v6h20v-6c4-2 10-8 10-18 0-12-6-24-20-24z" opacity="0.9" />
      <ellipse cx="24" cy="30" rx="5" ry="6" fill="black" opacity="0.45" />
      <ellipse cx="40" cy="30" rx="5" ry="6" fill="black" opacity="0.45" />
      <path d="M26 42h12" stroke="black" strokeWidth="2" opacity="0.3" />
      <path d="M30 42v4M34 42v4" stroke="black" strokeWidth="1.5" opacity="0.2" />
    </svg>
  ),
  viper: ({ cls }) => (
    <svg className={cls} viewBox="0 0 64 64" fill="currentColor">
      <path d="M32 8c-16 0-22 14-22 26s8 22 22 22 22-10 22-22S48 8 32 8z" opacity="0.9" />
      <path d="M22 30l6 2-6 2z" fill="black" opacity="0.55" />
      <path d="M42 30l-6 2 6 2z" fill="black" opacity="0.55" />
      <path d="M28 44l4-3 4 3" stroke="black" strokeWidth="1.5" fill="none" opacity="0.35" />
      <path d="M16 24q16 6 32 0" stroke="black" strokeWidth="1" fill="none" opacity="0.15" />
    </svg>
  ),
  dragon: ({ cls }) => (
    <svg className={cls} viewBox="0 0 64 64" fill="currentColor">
      <path d="M32 10c-14 0-22 14-22 26 0 10 8 20 22 20s22-10 22-20c0-12-8-26-22-26z" opacity="0.9" />
      <path d="M14 24c-4-8-2-16 2-18 2 6 6 10 4 18z" opacity="0.6" />
      <path d="M50 24c4-8 2-16-2-18-2 6-6 10-4 18z" opacity="0.6" />
      <path d="M24 32l4 3-4 3z" fill="black" opacity="0.5" />
      <path d="M40 32l-4 3 4 3z" fill="black" opacity="0.5" />
      <path d="M26 44q6 4 12 0" stroke="black" strokeWidth="1.5" fill="none" opacity="0.3" />
    </svg>
  ),
  phantom: ({ cls }) => (
    <svg className={cls} viewBox="0 0 64 64" fill="currentColor">
      <path d="M32 6C16 6 10 22 10 36c0 10 4 16 8 20l4-6 4 8 6-8 6 8 4-8 4 6c4-4 8-10 8-20 0-14-6-30-22-30z" opacity="0.9" />
      <ellipse cx="24" cy="30" rx="5" ry="7" fill="black" opacity="0.5" />
      <ellipse cx="40" cy="30" rx="5" ry="7" fill="black" opacity="0.5" />
      <circle cx="24" cy="29" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="40" cy="29" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  ronin: ({ cls }) => (
    <svg className={cls} viewBox="0 0 64 64" fill="currentColor">
      <ellipse cx="32" cy="38" rx="18" ry="18" opacity="0.9" />
      <path d="M8 22h48v4c0 2-4 4-8 4H16c-4 0-8-2-8-4v-4z" opacity="0.7" />
      <path d="M14 22c0-6 8-12 18-12s18 6 18 12" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.5" />
      <circle cx="26" cy="36" r="2.5" fill="black" opacity="0.5" />
      <circle cx="38" cy="36" r="2.5" fill="black" opacity="0.5" />
      <path d="M29 44q3 2 6 0" stroke="black" strokeWidth="1.5" fill="none" opacity="0.3" />
    </svg>
  ),
};

const avatarKeys = Object.keys(avatars);

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getAvatarKey(nickname: string): string {
  return avatarKeys[hashName(nickname) % avatarKeys.length];
}

export default function AvatarIcon({
  nickname,
  className = "w-full h-full",
}: {
  nickname: string;
  className?: string;
}) {
  const key = getAvatarKey(nickname);
  const Render = avatars[key];
  return <Render cls={className} />;
}
