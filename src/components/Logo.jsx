export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Terminal window frame */}
      <rect x="4" y="8" width="56" height="48" rx="6" fill="#1A1A2E" stroke="#D4AF37" strokeWidth="2"/>
      {/* Title bar */}
      <rect x="4" y="8" width="56" height="12" rx="6" fill="#222240"/>
      <rect x="4" y="14" width="56" height="6" fill="#222240"/>
      {/* Window dots */}
      <circle cx="14" cy="14" r="2.5" fill="#C0392B"/>
      <circle cx="22" cy="14" r="2.5" fill="#D4AF37"/>
      <circle cx="30" cy="14" r="2.5" fill="#2ECC71"/>
      {/* AI brain/circuit symbol */}
      <circle cx="32" cy="38" r="10" stroke="#D4AF37" strokeWidth="1.5" fill="none"/>
      <circle cx="32" cy="38" r="4" fill="#D4AF37" opacity="0.6"/>
      {/* Circuit lines */}
      <line x1="32" y1="28" x2="32" y2="24" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="48" x2="32" y2="52" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="22" y1="38" x2="16" y2="38" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="42" y1="38" x2="48" y2="38" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Diagonal circuit lines */}
      <line x1="25" y1="31" x2="21" y2="27" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="39" y1="31" x2="43" y2="27" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="25" y1="45" x2="21" y2="49" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="39" y1="45" x2="43" y2="49" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Small dots at circuit endpoints */}
      <circle cx="32" cy="24" r="1.5" fill="#D4AF37"/>
      <circle cx="32" cy="52" r="1.5" fill="#D4AF37"/>
      <circle cx="16" cy="38" r="1.5" fill="#D4AF37"/>
      <circle cx="48" cy="38" r="1.5" fill="#D4AF37"/>
    </svg>
  );
}
