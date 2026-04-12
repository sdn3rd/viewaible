export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="14" fill="#0B0B14"/>
      <rect x="8" y="12" width="48" height="40" rx="4" fill="#1A1A2E" stroke="#2A2A45" strokeWidth="1"/>
      <rect x="8" y="12" width="48" height="10" rx="4" fill="#222240"/>
      <rect x="8" y="18" width="48" height="4" fill="#222240"/>
      <circle cx="15" cy="17" r="2" fill="#C0392B"/>
      <circle cx="21" cy="17" r="2" fill="#D4AF37"/>
      <circle cx="27" cy="17" r="2" fill="#2ECC71"/>
      <text x="14" y="33" fontFamily="monospace" fontSize="7" fill="#D4AF37">$</text>
      <text x="20" y="33" fontFamily="monospace" fontSize="7" fill="#8888AA">claude</text>
      <rect x="14" y="38" width="5" height="8" fill="#D4AF37" opacity="0.8"/>
      <circle cx="48" cy="14" r="3" fill="#D4AF37" opacity="0.4"/>
      <circle cx="48" cy="14" r="1.5" fill="#D4AF37"/>
    </svg>
  );
}
