export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Spiral void mask — cuts into the terminal */}
        <mask id="spiral-void">
          <rect width="64" height="64" fill="white"/>
          {/* Spiral path as negative space */}
          <path
            d="M32 38
               a4 4 0 0 1 4 -4
               a7 7 0 0 1 -7 7
               a10 10 0 0 1 10 -10
               a13 13 0 0 1 -13 13"
            stroke="black"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Center void dot */}
          <circle cx="32" cy="38" r="2" fill="black"/>
        </mask>
      </defs>

      {/* Terminal silhouette */}
      <g mask="url(#spiral-void)">
        {/* Body */}
        <rect x="4" y="8" width="56" height="48" rx="6" fill="#1A1A2E"/>
        {/* Title bar */}
        <rect x="4" y="8" width="56" height="11" rx="6" fill="#222240"/>
        <rect x="4" y="14" width="56" height="5" fill="#222240"/>
        {/* Screen glow */}
        <rect x="6" y="21" width="52" height="33" rx="2" fill="#0B0B14"/>
      </g>

      {/* Title bar dots (on top of mask) */}
      <circle cx="13" cy="14" r="2" fill="#C0392B" opacity="0.9"/>
      <circle cx="19" cy="14" r="2" fill="#D4AF37" opacity="0.9"/>
      <circle cx="25" cy="14" r="2" fill="#2ECC71" opacity="0.9"/>

      {/* Spiral outline — visible as gold trace */}
      <path
        d="M32 38
           a4 4 0 0 1 4 -4
           a7 7 0 0 1 -7 7
           a10 10 0 0 1 10 -10
           a13 13 0 0 1 -13 13"
        stroke="#D4AF37"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Center void glow */}
      <circle cx="32" cy="38" r="3" fill="#D4AF37" opacity="0.15"/>
      <circle cx="32" cy="38" r="1.5" fill="#D4AF37" opacity="0.5"/>

      {/* Subtle prompt lines */}
      <line x1="10" y1="26" x2="16" y2="26" stroke="#D4AF37" strokeWidth="1" opacity="0.3"/>
      <line x1="18" y1="26" x2="30" y2="26" stroke="#8888AA" strokeWidth="1" opacity="0.2"/>
      <line x1="10" y1="30" x2="14" y2="30" stroke="#D4AF37" strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}
