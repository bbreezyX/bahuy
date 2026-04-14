/** @jsxImportSource react */

interface CardFrameProps {
  accent?: string;
  bgFill?: string;
  hasAvatar?: boolean;
}

/**
 * Angular tech-frame SVG overlay.
 * - hasAvatar: fills the border region (outside frame opening) with dark color
 *   so the photo only shows through the angular cutout — like a picture frame.
 * - bgFill: fills the inner area with a solid role color (placeholder cards).
 */
export default function CardFrame({ accent = "#f9c651", bgFill, hasAvatar }: CardFrameProps) {
  // Inner frame opening — clockwise (CW)
  const frameCW =
    "M 22 5 L 40 5 L 47 12 L 107 12 L 114 5 L 130 5 L 137 12 L 137 52" +
    " L 140 55 L 140 87 L 137 90 L 137 135 L 132 140 L 132 162 L 115 179" +
    " L 76 179 L 70 185 L 40 185 L 30 175 L 30 170 L 32 168 L 32 138" +
    " L 35 138 L 35 122 L 24 111 L 24 63 L 21 60 L 21 52 L 22 52 Z";

  // Same shape counter-clockwise (CCW) — needed for evenodd hole punch
  const frameCCW =
    "M 22 52 L 21 52 L 21 60 L 24 63 L 24 111 L 35 122 L 35 138" +
    " L 32 138 L 32 168 L 30 170 L 30 175 L 40 185 L 70 185 L 76 179" +
    " L 115 179 L 132 162 L 132 140 L 137 135 L 137 90 L 140 87" +
    " L 140 55 L 137 52 L 137 12 L 130 5 L 114 5 L 107 12 L 47 12" +
    " L 40 5 L 22 5 Z";

  // Outer rect (CW) + inner cutout (CCW) = fills only the border region
  const frameMask = `M -10 -10 L 160 -10 L 160 240 L -10 240 Z ${frameCCW}`;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      viewBox="0 0 150 230"
      fill="none"
      preserveAspectRatio="none"
    >
      {/* Solid fill for placeholder cards (no avatar) */}
      {bgFill && (
        <path d={frameCW} fill={bgFill} opacity="1" />
      )}

      {/* Frame mask: dark border around the photo opening */}
      {hasAvatar && (
        <path
          d={frameMask}
          fill="#0e1112"
          fillRule="evenodd"
        />
      )}

      {/* Outer border shape */}
      <path
        d="M 10 1 L 140 1 L 149 10 L 149 220 L 140 229 L 10 229 L 1 220 L 1 10 Z"
        fill="none"
        stroke={accent}
        strokeWidth="1.2"
        opacity="0.5"
      />
      {/* Inner angular frame stroke */}
      <path
        d={frameCW}
        fill="none"
        stroke={accent}
        strokeWidth="0.6"
        opacity="0.45"
      />
      {/* Corner accents -- top-left */}
      <line x1="4" y1="20" x2="4" y2="40" stroke={accent} strokeWidth="0.8" opacity="0.4" />
      <line x1="4" y1="20" x2="14" y2="20" stroke={accent} strokeWidth="0.8" opacity="0.4" />
      {/* Corner accents -- top-right */}
      <line x1="146" y1="20" x2="146" y2="40" stroke={accent} strokeWidth="0.8" opacity="0.4" />
      <line x1="146" y1="20" x2="136" y2="20" stroke={accent} strokeWidth="0.8" opacity="0.4" />
      {/* Corner accents -- bottom-left */}
      <line x1="4" y1="210" x2="4" y2="190" stroke={accent} strokeWidth="0.8" opacity="0.4" />
      <line x1="4" y1="210" x2="14" y2="210" stroke={accent} strokeWidth="0.8" opacity="0.4" />
      {/* Corner accents -- bottom-right */}
      <line x1="146" y1="210" x2="146" y2="190" stroke={accent} strokeWidth="0.8" opacity="0.4" />
      <line x1="146" y1="210" x2="136" y2="210" stroke={accent} strokeWidth="0.8" opacity="0.4" />
      {/* Decorative dots along right edge */}
      <circle cx="143" cy="140" r="1.2" fill={accent} opacity="0.4" />
      <circle cx="143" cy="150" r="1.2" fill={accent} opacity="0.4" />
      <circle cx="143" cy="160" r="1.2" fill={accent} opacity="0.4" />
      {/* Tick marks on left side */}
      <rect x="2" y="65" width="3" height="3" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.3" />
      <rect x="2" y="72" width="3" height="3" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.3" />
      <rect x="2" y="100" width="3" height="3" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.3" />
      <rect x="2" y="107" width="3" height="3" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.3" />
      {/* Chevron accents at bottom */}
      <path d="M 72 183 L 69 186 L 70 186 L 73 183 Z" fill={accent} opacity="0.4" />
      <path d="M 76 183 L 73 186 L 74 186 L 77 183 Z" fill={accent} opacity="0.4" />
      <path d="M 80 183 L 77 186 L 78 186 L 81 183 Z" fill={accent} opacity="0.4" />
      <path d="M 84 183 L 81 186 L 82 186 L 85 183 Z" fill={accent} opacity="0.4" />
    </svg>
  );
}
