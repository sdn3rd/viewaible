export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="14" fill="#0B0B14"/>
      <rect x="6" y="10" width="52" height="44" rx="5" fill="#1A1A2E" stroke="#2A2A45" strokeWidth="1"/>
      <rect x="6" y="10" width="52" height="10" rx="5" fill="#222240"/>
      <rect x="6" y="16" width="52" height="4" fill="#222240"/>
      <circle cx="14" cy="15" r="2" fill="#C0392B"/>
      <circle cx="20" cy="15" r="2" fill="#D4AF37"/>
      <circle cx="26" cy="15" r="2" fill="#2ECC71"/>
      <line x1="32" y1="22" x2="32" y2="52" stroke="#2A2A45" strokeWidth="1"/>
      <text x="11" y="32" fontFamily="monospace" fontSize="6" fill="#D4AF37">$</text>
      <text x="16" y="32" fontFamily="monospace" fontSize="5.5" fill="#8888AA">claude</text>
      <rect x="11" y="36" width="4" height="6" rx="1" fill="#D4AF37" opacity="0.7"/>
      <text x="37" y="32" fontFamily="monospace" fontSize="6" fill="#D4AF37">$</text>
      <text x="42" y="32" fontFamily="monospace" fontSize="5.5" fill="#8888AA">claude</text>
      <rect x="37" y="36" width="4" height="6" rx="1" fill="#D4AF37" opacity="0.7"/>
      <circle cx="50" cy="15" r="3.5" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
      <circle cx="50" cy="15" r="1.5" fill="#D4AF37" opacity="0.8"/>
    </svg>
  );
}
